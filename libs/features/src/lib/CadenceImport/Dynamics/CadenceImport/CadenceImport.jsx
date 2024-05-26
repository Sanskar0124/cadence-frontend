import {
	Button,
	DeleteModal,
	Div,
	PageContainer,
	Spinner,
	Title,
	Tooltip,
} from "@cadence-frontend/components";
import { MessageContext } from "@cadence-frontend/contexts";
import { useCadenceImportDynamics, useSocket } from "@cadence-frontend/data-access";
import { ENV } from "@cadence-frontend/environments";
import {
	CadenceBox,
	Cadences,
	ErrorGradient,
	Excel,
	GoogleSheets,
	More,
	Dynamics,
	Trash,
	ColumnMapping,
} from "@cadence-frontend/icons";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import { TableThemes, ThemedButtonThemes } from "@cadence-frontend/themes";
import { useQuery } from "@cadence-frontend/utils";
import {
	BackButton,
	Checkbox,
	CollapseContainer,
	Table,
	ThemedButton,
} from "@cadence-frontend/widgets";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import styles from "./CadenceImport.module.scss";
import Actions from "./components/Actions/Actions";
import LinkLeadsModal from "../../components/LinkLeadsModal/LinkLeadsModal";
import LeadDetailsModal from "./components/LeadDetailsModal/LeadDetailsModal";
import {
	DATA_CATEGORY,
	DATA_CATEGORY_ID,
	getLeadsExcludingError,
	isLeadError,
	isLeadSuccesss,
	LEAD_ERROR_MSG_MAP,
	LEAD_STATUS,
} from "./constants";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";
import { LEAD_INTEGRATION_TYPES } from "@cadence-frontend/constants";
import ImportSuccessModal from "../../components/ImportSuccessModal/ImportSuccessModal";
import ErrorModal from "../../components/ErrorModal/ErrorModal";

const CadenceImport = () => {
	const navigate = useNavigate();
	const user = useRecoilValue(userInfo);
	const { addError } = useContext(MessageContext);
	const [socket1] = useSocket(ENV.BACKEND, "/socket-service/socket");
	const [socket2] = useSocket(ENV.BACKEND, "/socket-service/socket");
	const query = useQuery();
	const cadence_id = query.get("cadence_id");
	const cadence_name = query.get("cadence_name");
	const id = query.get("id");
	const type = query.get("type");
	const importFrom = query.get("import");
	const [errorModal, setErrorModal] = useState(false);

	let moreBtnPressed = false;

	//refs
	const loader = useRef({ ids: { loader1: "", loader2: "" }, length: 0 });
	const loader1 = useRef(0);
	const loader2 = useRef(0);
	//Made this ref to access the checkedLeads in the socket event handler
	const checkedLeadsRef = useRef([]);
	//To count how many results have been fetched from both add and link event handler
	const countRef = useRef(0);

	//dropdowns
	const [optionsDropdown, setOptionsDropdown] = useState(false);
	const [cadencesDropdown, setCadencesDropdown] = useState(false);
	const [errorDropdown, setErrorDropdown] = useState(false);
	//states
	const [list, setList] = useState([]);
	const [checkedLeads, setCheckedLeads] = useState([]);

	const [checkedIssueLead, setCheckedIssueLead] = useState([]);
	const [isModal, setIsModal] = useState(false);
	const [cadenceSelected, setCadenceSelected] = useState({
		id: parseInt(cadence_id),
		name: cadence_name,
	});
	const [progress, setProgress] = useState(0);
	const [isAdding, setIsAdding] = useState(false);

	//modals
	const [deleteModal, setDeleteModal] = useState(false);
	const [linkLeadsModal, setLinkLeadsModal] = useState(false);
	const [leadDetailsModal, setLeadDetailsModal] = useState(null);
	const [importSuccessModal, setImportSuccessModal] = useState({
		successCount: 0,
		errorCount: 0,
	});

	//api
	const cadenceImportDataAccess = useCadenceImportDynamics(
		{ id, type },
		{ leads: importFrom === "xls" ? false : true }
	);

	const { leads, importLoading, importError, addList, isAddSuccess } =
		cadenceImportDataAccess;

	//funtions
	const handleImportResponse = data => {
		let errorLeads = [...(data?.element_error || [])];
		let successLeads = [...(data?.element_success || [])];

		//CountRef stores number of results fetched
		countRef.current += errorLeads.length + successLeads.length;
		//checks if the number of responses from socket is equal to the number of checkedLeads(number of leads selected to add or import)
		let showModal = checkedLeadsRef.current.length === countRef.current;

		setList(prev =>
			prev
				.map(lead => {
					let errorLead = errorLeads.find(errLead => errLead.integration_id === lead.Id);
					let successLead = successLeads.find(
						succLead => succLead.integration_id === lead.Id
					);
					if (errorLead)
						return {
							...lead,
							error: { msg: errorLead.msg, type: errorLead?.type },
							shown: true,
						};
					if (successLead)
						return {
							...lead,
							success: true,
							success_lead_id: successLead.lead_id,
							shown: true,
						};
					return lead;
				})
				.sort(a => {
					if (a.error) return -1;
					if (a.success) return 1;
					return 0;
				})
		);
		//As soon as we get both the responses from socket, unselect the leads selected(set checkedLeads to empty array)
		if (showModal) {
			setTimeout(() => setProgress(0), 1000);
			setIsAdding(false);
			setCheckedLeads([]);
		}
		setImportSuccessModal(prev => ({
			...prev,
			successCount: prev?.successCount + successLeads.length,
			errorCount: prev?.errorCount + errorLeads.length,
			show: showModal,
			cadence_id: cadenceSelected?.id,
		}));
	};

	const handleCadencesClick = (lead, e) => {
		e.stopPropagation();
		resetDropdowns();
		if (lead.Id === cadencesDropdown.id) setCadencesDropdown(false);
		else {
			let cadences = [];
			if (lead.Cadences)
				cadences = lead.Cadences.map(cad => ({
					name: cad.Cadences[0]?.name,
					cadence_id: cad.Cadences[0]?.cadence_id,
				}));
			if (lead.cadences)
				cadences = lead.cadences.map(cad => ({
					name: cad?.name,
					cadence_id: cad?.cadence_id,
				}));
			setCadencesDropdown({
				id: lead.Id,
				cadences,
			});
		}
	};

	const handleMenuClick = (id, e) => {
		e.stopPropagation();
		resetDropdowns();
		if (id === optionsDropdown) setOptionsDropdown(false);
		else setOptionsDropdown(id);
	};

	const handleDelete = () => {
		setList(prev => prev.filter(lead => lead.Id !== deleteModal.id));
		setCheckedLeads(prev => prev.filter(id => id !== deleteModal.id));
	};

	const handleAddToCadence = (lead, stopPreviousCadences) => {
		setIsAdding(true);
		loader.current = {
			ids: {
				loader1: uuidv4(),
				loader2: uuidv4(),
			},
			length:
				list.filter(
					lead =>
						checkedLeads.includes(lead.Id) &&
						lead.status === LEAD_STATUS.LEAD_ABSENT_IN_TOOL
				).length +
				list.filter(
					lead =>
						checkedLeads.includes(lead.Id) &&
						(lead.status === LEAD_STATUS.LEAD_PRESENT_IN_TOOL ||
							lead.status === LEAD_STATUS.LEAD_INACTIVE)
				).length,
		};
		socket1.current.emit("join-room", loader.current.ids.loader1);
		socket2.current.emit("join-room", loader.current.ids.loader2);
		resetDropdowns();

		if (!cadenceSelected.id) return addError({ text: "Please select a cadence" });
		setCheckedLeads([lead.Id]);

		let body = {};
		if (lead.status === LEAD_STATUS.LEAD_ABSENT_IN_TOOL) {
			body.add = {
				loaderId: loader.current.ids.loader1,
				cadence_id: cadenceSelected.id.toString(),
				[DATA_CATEGORY[type]]: [lead].map(l => {
					delete l.error;
					delete l.success;
					return l;
				}),
			};
		}
		if (lead.status === LEAD_STATUS.LEAD_PRESENT_IN_TOOL) {
			body.link = {
				stopPreviousCadences,
				loaderId: loader.current.ids.loader2,
				cadence_id: cadenceSelected.id.toString(),
				[DATA_CATEGORY[type]]: [lead].map(l => {
					delete l.error;
					delete l.success;
					return l;
				}),
			};
		}
		setList(prev => prev.map(i => ({ ...i, shown: false })));
		addList(body);
	};

	const handleDynamicsIconClick = (lead, e) => {
		e.stopPropagation();
		let url = "";
		if (type === "lead" || type === "lead_list")
			url = `${user?.instance_url}/main.aspx?pagetype=entityrecord&etn=lead&id=${lead.Id}`;
		else
			url = `${user?.instance_url}/main.aspx?pagetype=entityrecord&etn=contact&id=${lead.Id}`;
		if (url) window.open(url, "_blank");
		else addError({ text: "This lead does not have the required info." });
	};

	const handleGoToProfileClick = () => {
		navigate("/settings?view=my_connections");
	};

	const resetDropdowns = () => {
		setOptionsDropdown(false);
		setCadencesDropdown(false);
		setErrorDropdown(false);
		setLinkLeadsModal(false);
	};

	//handle loader socket function for both loaders that adds both loader values and show it in the progress bar
	const handleImportSocket = (data, id) => {
		if (loader.current.ids.loader1 !== id && loader.current.ids.loader2 !== id) return;
		if (loader.current.ids.loader1 === id) loader1.current = data.index;
		if (loader.current.ids.loader2 === id) loader2.current = data.index;

		let totalProgress =
			((loader1.current + loader2.current) / loader.current.length) * 100;
		setProgress(Math.floor(totalProgress));
	};

	//sideeffects

	useEffect(() => {
		// if (type === "create_lead") {
		// 	const leadsArr = JSON.parse(sessionStorage.getItem(`leads-cadence-${cadence_id}`));
		// 	setList(leadsArr.map(item => ({ ...item, shown: true })));
		// } else {
		if (importFrom === "xls") {
			const peopleArr = JSON.parse(
				sessionStorage.getItem(`lead-contact-cadence-${cadence_id}`)
			);
			setList(peopleArr.map(item => ({ ...item, shown: true })));
			setCheckedLeads(getLeadsExcludingError(peopleArr) ?? []);
		} else {
			setList(leads?.map(item => ({ ...item, shown: true })));
			setCheckedLeads(getLeadsExcludingError(leads) ?? []);
		}
	}, [leads]);

	useEffect(() => {
		checkedLeadsRef.current = checkedLeads;
	}, [checkedLeads]);

	//create 2 socket connections for 2 loaders (add, link)
	useEffect(() => {
		socket1.current.on("cadence-import-loader", data =>
			handleImportSocket(data, loader.current.ids.loader1)
		);
		socket1.current.on("cadence-import-response", data => handleImportResponse(data));
		socket2.current.on("cadence-import-loader", data =>
			handleImportSocket(data, loader.current.ids.loader2)
		);
		socket2.current.on("cadence-import-response", data => handleImportResponse(data));
	}, []);

	//constants
	const TABLE_COLUMNS = [
		<Checkbox
			className={styles.checkBox}
			disabled={getLeadsExcludingError(list?.filter(lead => lead.shown))?.length === 0}
			checked={
				checkedLeads?.length > 0 &&
				checkedLeads?.length === getLeadsExcludingError(list)?.length &&
				list?.length > 0
			}
			onChange={() => {
				if (list?.length > 0)
					checkedLeads?.length !==
					getLeadsExcludingError(list?.filter(lead => lead.shown))?.length
						? setCheckedLeads(getLeadsExcludingError(list))
						: setCheckedLeads([]);
			}}
		/>,
		"Sno.",
		"Name",
		"Company",
		"Title",
		"Phone",
		"Email",
		"Owner",
		"Status",
		"Action",
	];

	const onRemoveSelected = () => {
		if ([...new Set(checkedIssueLead)].length) {
			const data = list?.filter(ld => {
				let isLead = [...new Set(checkedIssueLead)].find(lead => lead.Id === ld.Id);

				return isLead?.Id !== ld?.Id;
			});

			setCheckedIssueLead([]);

			const checkedData = checkedLeads.filter(ld => {
				let isLead = [...new Set(checkedIssueLead)].find(lead => lead.Id === ld);
				return isLead?.Id === ld?.Id;
			});

			setCheckedLeads(checkedData);

			setList(data);
			setIsModal(false);
		}
	};

	const handleLeadClick = lead => {
		if (!moreBtnPressed) setLeadDetailsModal(lead);
	};
	const handleDropdownBtnClick = (event, setModal, value) => {
		event.stopPropagation();
		moreBtnPressed = true;
		setModal(value);
		window.onmousedown = e => {
			moreBtnPressed = false;
			// if (e.target !== event.target) setModal(null);
			window.onmousedown = null;
		};
	};
	const handleAddToCadenceBtClick = (event, lead) => {
		event.stopPropagation();
		moreBtnPressed = true;
		handleAddToCadence(lead);
		window.onmousedown = e => {
			moreBtnPressed = false;
			window.onmousedown = null;
		};
	};

	return (
		<PageContainer className={styles.pageContainer}>
			<div className={styles.header}>
				<BackButton
					text={cadenceSelected.id ? "Back to cadence" : "Back to home"}
					onClick={() =>
						navigate(
							cadenceSelected?.id
								? `/cadence/${cadenceSelected?.id}?view=list`
								: "/cadence"
						)
					}
				/>
				{/* {!webhook && !importError?.error && !importLoading && ( */}
				{importFrom === "xls" && !isAdding && !isAddSuccess && (
					<div className={styles.backToCSV}>
						<Tooltip text="Column remapping" className={styles.csvTooltip}>
							<ThemedButton
								theme={ThemedButtonThemes.WHITE}
								onClick={() =>
									cadence_id
										? navigate(
												`/import-csv?type=${type}&cadence_id=${cadence_id}&cadence_name=${cadence_name}`
										  )
										: navigate("/cadence")
								}
								height={"44px"}
								width="fit-content"
							>
								<ColumnMapping />
								Column Remapping
							</ThemedButton>
						</Tooltip>
					</div>
				)}

				{/* )} */}
			</div>

			{importError?.error ? (
				<div className={styles.error}>
					<ErrorGradient size="38px" />
					<span className={styles.importFailed}>
						{COMMON_TRANSLATION.IMPORT_FAILED[user?.language?.toUpperCase()]}
					</span>
					<span>{importError.msg}</span>
					{importError.msg === "Kindly log in with dynamics" ? (
						<ThemedButton
							className={styles.btn}
							width="180px"
							onClick={handleGoToProfileClick}
							theme={ThemedButtonThemes.WHITE}
						>
							Go to profile page
						</ThemedButton>
					) : (
						<CollapseContainer
							className={styles.errorCollapse}
							openByDefault={false}
							title={
								<div className={styles.header}>
									<Dynamics /> Dynamics error message
								</div>
							}
						>
							<div className={styles.sfError}>{importError.dynamicsErrorMessage}</div>
						</CollapseContainer>
					)}
				</div>
			) : importLoading || isAdding ? (
				<div className={styles.loading}>
					<span className={styles.text}>
						{importLoading ? "Importing Leads" : `Adding - ${progress}%`}
					</span>
					{isAdding && (
						<span className={styles.cadence}>
							<Cadences /> Adding {checkedLeads.length}{" "}
							{COMMON_TRANSLATION.PEOPLE_IN[user?.language?.toUpperCase()]}{" "}
							{cadenceSelected.name}
						</span>
					)}
					{importLoading ? (
						<Spinner className={styles.spinner} />
					) : (
						<progress max="100" value={progress}></progress>
					)}
				</div>
			) : (
				<>
					<Title className={styles.title} size="20px">
						Import
					</Title>
					<Actions
						cadenceImportDataAccess={cadenceImportDataAccess}
						checkedLeads={checkedLeads}
						setCheckedLeads={setCheckedLeads}
						importFrom={importFrom}
						list={list}
						setList={setList}
						cadenceSelected={cadenceSelected}
						setCadenceSelected={setCadenceSelected}
						resetDropdowns={resetDropdowns}
						loader={loader}
						socket1={socket1}
						socket2={socket2}
						setProgress={setProgress}
						setIsAdding={setIsAdding}
						setCheckedIssueLead={setCheckedIssueLead}
						checkedIssueLead={checkedIssueLead}
						onRemoveSelected={onRemoveSelected}
						isModal={isModal}
						setIsModal={setIsModal}
						setImportSuccessModal={setImportSuccessModal}
						isAddSuccess={isAddSuccess}
					/>
					<Table
						loading={importLoading}
						columns={TABLE_COLUMNS}
						noOfRows={6}
						className={styles.table}
						theme={TableThemes.WHITE_AND_LIGHT_PURPLE}
						height="calc(100vh - 190px)"
					>
						{list
							?.filter(item => item.shown === true)
							?.map((lead, index) => {
								return (
									<tr
										key={lead.Id}
										onClick={() => {
											handleLeadClick(lead);
										}}
									>
										<td onClick={e => e.stopPropagation()}>
											<Checkbox
												className={styles.checkBox}
												checked={checkedLeads?.includes(lead.Id)}
												disabled={isLeadError(lead) || isLeadSuccesss(lead)}
												onChange={() => {
													checkedLeads.includes(lead.Id)
														? setCheckedLeads(prevState =>
																prevState.filter(item => item !== lead.Id)
														  )
														: setCheckedLeads(prevState => [...prevState, lead.Id]);
												}}
											/>
										</td>

										<td>{index + 1}</td>

										<td className={styles.name}>
											<div>
												{/* {lead?.integration_type ===
												LEAD_INTEGRATION_TYPES.SALESFORCE_GOOGLE_SHEET_LEAD ? (
													<GoogleSheets size={30} />
												) : lead?.integration_type ===
												  LEAD_INTEGRATION_TYPES.SALESFORCE_CSV_LEAD ? (
													<Excel size={30} />
												) : ( */}
												<Dynamics onClick={e => handleDynamicsIconClick(lead, e)} />
												{/* // )} */}
												{lead.success_lead_id && (
													<CadenceBox
														size="2rem"
														onClick={e => {
															e.stopPropagation();
															window.open(`/crm/leads/${lead.success_lead_id}`);
														}}
														style={{ cursor: "pointer" }}
													/>
												)}
												<div title={`${lead.first_name} ${lead.last_name}`}>
													{lead.first_name} {lead.last_name}
												</div>
											</div>
										</td>

										<td>
											<div title={lead.Account?.name}>{lead.Account?.name} </div>
										</td>
										<td>
											<div title={lead.job_position ?? "NA"}>
												{lead.job_position ?? "NA"}
											</div>
										</td>
										<td>
											{/* {lead?.phone_numbers?.map(
											(ph, index) => index === 0 && ph.phone_number ?? "NA"
										)} */}
											{/* {lead?.phone_numbers?.map((ph, index) =>
											index === 0 && ph.phone_number ? ph.phone_number : "NA"
										)} */}
											<div
												title={
													lead?.phone_numbers?.find(ph => ph.phone_number)
														?.phone_number ?? "NA"
												}
											>
												{lead?.phone_numbers?.find(ph => ph.phone_number)?.phone_number ??
													"NA"}
											</div>
										</td>
										<td>
											<div
												title={lead?.emails?.map(
													(mail, index) => index === 0 && mail.email_id
												)}
											>
												{lead?.emails?.map((mail, index) => index === 0 && mail.email_id)}
											</div>
										</td>
										<td>
											<div title={lead.Owner?.name}>{lead.Owner?.name}</div>
										</td>
										<td className={styles.actions}>
											<div className={styles.buttons}>
												{lead.status === LEAD_STATUS.LEAD_PRESENT_IN_TOOL &&
													!lead.error &&
													!lead.success && (
														<ThemedButton
															onClick={e => handleCadencesClick(lead, e)}
															theme={ThemedButtonThemes.GREEN}
															className={styles.cadenceStatus}
															height="30px"
														>
															Active
														</ThemedButton>
													)}
												{isLeadError(lead) && !lead.error && (
													<ThemedButton
														onClick={e => {
															e.preventDefault();
															e.stopPropagation();
															setErrorModal({
																type: "default",
																msg: LEAD_ERROR_MSG_MAP[lead?.status] ?? lead?.status,
															});
														}}
														theme={ThemedButtonThemes.RED}
														className={styles.cadenceStatus}
														height="30px"
													>
														Error
													</ThemedButton>
												)}
												{lead.error && (
													<ThemedButton
														onClick={e => {
															e.preventDefault();
															e.stopPropagation();
															setErrorModal({
																type: lead?.error?.type ?? "default",
																msg: lead?.error?.msg,
															});
														}}
														theme={ThemedButtonThemes.RED}
														className={styles.cadenceStatus}
														height="30px"
													>
														Error
													</ThemedButton>
												)}
												{lead.success && (
													<ThemedButton
														theme={ThemedButtonThemes.GREEN}
														className={styles.cadenceStatus}
														height="30px"
													>
														Success
													</ThemedButton>
												)}
											</div>
											<div
												className={`${styles.dropDownMenu} ${styles.cadences} ${
													lead.Id === cadencesDropdown.id ? styles.isActive : ""
												}`}
											>
												{cadencesDropdown?.cadences?.length ? (
													cadencesDropdown?.cadences?.map(cadence => (
														<div key={cadence.cadence_id}>{cadence.name}</div>
													))
												) : (
													<div>
														{
															COMMON_TRANSLATION.NO_CADENCES[
																user?.language?.toUpperCase()
															]
														}
													</div>
												)}
											</div>
											<div
												className={`${styles.dropDownMenu} ${styles.errorText} ${
													lead.Id === errorDropdown.id ? styles.isActive : ""
												}`}
											>
												<div>{errorDropdown?.error}</div>
											</div>
										</td>
										<td className={styles.actions}>
											<Tooltip
												text={COMMON_TRANSLATION.MORE[user?.language?.toUpperCase()]}
											>
												<ThemedButton
													className={styles.dotsBtn}
													theme={ThemedButtonThemes.GREY}
													onClick={e => handleMenuClick(lead.Id, e)}
													height="40px"
													width="60px"
													disabled={isAddSuccess}
												>
													<div>
														<More />
													</div>
												</ThemedButton>
											</Tooltip>
											<div
												className={`${styles.dropDownMenu} ${
													lead.Id === optionsDropdown ? styles.isActive : ""
												}`}
											>
												<Button
													disabled={
														isLeadError(lead) ||
														isLeadSuccesss(lead) ||
														!cadenceSelected?.id
													}
													onClick={event => {
														lead.status === LEAD_STATUS.LEAD_PRESENT_IN_TOOL
															? !cadenceSelected.id
																? addError({ text: "Please select a cadence" })
																: handleDropdownBtnClick(event, setLinkLeadsModal, lead)
															: handleAddToCadenceBtClick(event, lead);
														event.stopPropagation();
													}}
												>
													<Cadences />
													Add to cadence
												</Button>
												{/* <Button>
											<ReAssign />
											Re-assign
										</Button> */}
												<Button
													onClick={event =>
														handleDropdownBtnClick(event, setDeleteModal, {
															name: `${lead.first_name ?? ""} ${lead.last_name ?? ""}`,
															id: lead.Id,
														})
													}
													className={styles.deleteBtn}
												>
													<Trash />
													{COMMON_TRANSLATION.DELETE[user?.language?.toUpperCase()]
														?.slice(0, 1)
														.toUpperCase() +
														COMMON_TRANSLATION.DELETE[
															user?.language?.toUpperCase()
														]?.slice(1)}
												</Button>
											</div>
										</td>
									</tr>
								);
							})}
					</Table>
					<LeadDetailsModal
						modal={leadDetailsModal}
						setModal={setLeadDetailsModal}
						type={type}
					/>
					<DeleteModal
						modal={deleteModal}
						setModal={setDeleteModal}
						item={deleteModal?.name}
						onDelete={handleDelete}
					/>
					<LinkLeadsModal
						modal={linkLeadsModal}
						setModal={setLinkLeadsModal}
						onAdd={stopPreviousCadences => {
							handleAddToCadence(linkLeadsModal, stopPreviousCadences);
							resetDropdowns();
						}}
					/>
					<ImportSuccessModal
						modal={importSuccessModal}
						setModal={setImportSuccessModal}
						cadenceSelected={cadenceSelected}
					/>
					<ErrorModal modal={errorModal} setModal={setErrorModal} />
				</>
			)}
		</PageContainer>
	);
};

export default CadenceImport;

const Placeholder = () => {
	return (
		<div className={styles.placeholder}>
			{[...Array(2).keys()].map(() => (
				<Div loading />
			))}
		</div>
	);
};
