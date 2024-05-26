import { userInfo } from "@cadence-frontend/atoms";
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
import { useCadenceImportGoogleSheets, useSocket } from "@cadence-frontend/data-access";
import { ENV } from "@cadence-frontend/environments";
import {
	CadenceBox,
	Cadences,
	ColumnMapping,
	ErrorGradient,
	More,
	Refresh2,
	Trash,
} from "@cadence-frontend/icons";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import { TableThemes, ThemedButtonThemes } from "@cadence-frontend/themes";
import { useOutsideClickHandler, useQuery } from "@cadence-frontend/utils";
import { BackButton, Checkbox, Table, ThemedButton } from "@cadence-frontend/widgets";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { v4 as uuidv4 } from "uuid";
import LinkLeadsModal from "../../components/LinkLeadsModal/LinkLeadsModal";
import LeadDetailsModal from "./components/LeadDetailsModal/LeadDetailsModal";
import styles from "./CadenceImport.module.scss";
import Actions from "./components/Actions/Actions";
import { getLeadsExcludingError, isLeadError, LEAD_STATUS } from "./constants";
import LeadsLimitModal from "../../components/LeadsLimitModal/LeadsLimitModal";
import ImportSuccessModal from "../../components/ImportSuccessModal/ImportSuccessModal";
import ErrorModal from "../../components/ErrorModal/ErrorModal";

const CadenceImport = () => {
	const navigate = useNavigate();
	const user = useRecoilValue(userInfo);
	const [socket1] = useSocket(ENV.BACKEND, "/socket-service/socket");
	const [socket2] = useSocket(ENV.BACKEND, "/socket-service/socket");
	const [socket3] = useSocket(ENV.BACKEND, "/socket-service/socket");
	const query = useQuery();
	const sheet_url = sessionStorage.getItem("sheet_url");
	const sheet_field_map = JSON.parse(sessionStorage.getItem("csv_field_map"));
	const cadence_id = query.get("cadence_id");
	const cadence_name = query.get("cadence_name");

	//refs
	const loader = useRef({ ids: { loader1: "", loader2: "", loader3: "" }, length: 0 });
	const loader1 = useRef(0);
	const loader2 = useRef(0);

	const optionsDropdownRef = useRef(null);
	const errorDropdownRef = useRef(null);
	const cadencesDropdownRef = useRef(null);

	useOutsideClickHandler(optionsDropdownRef, () => setOptionsDropdown(false));
	useOutsideClickHandler(errorDropdownRef, () => setErrorDropdown(false));
	useOutsideClickHandler(cadencesDropdownRef, () => setCadencesDropdown(false));

	//dropdowns
	const [optionsDropdown, setOptionsDropdown] = useState(false);
	const [cadencesDropdown, setCadencesDropdown] = useState(false);
	const [errorDropdown, setErrorDropdown] = useState(false);
	//states
	const [list, setList] = useState([]);
	const [checkedLeads, setCheckedLeads] = useState([]);
	const [progress, setProgress] = useState(0);
	const [isAdding, setIsAdding] = useState(false);
	//modals
	const [deleteModal, setDeleteModal] = useState(false);
	const [linkLeadsModal, setLinkLeadsModal] = useState(false);
	const [leadDetailsModal, setLeadDetailsModal] = useState(null);
	const [leadsLimitModal, setLeadsLimitModal] = useState(false);
	const [importSuccessModal, setImportSuccessModal] = useState(false);
	const [errorModal, setErrorModal] = useState(false);
	//api
	const cadenceImportDataAccess = useCadenceImportGoogleSheets({
		sheet_url,
		sheet_field_map,
		cadence_id,
		enabled: true,
	});

	const { importLeads, importLoading, importError, addList, isAddSuccess } =
		cadenceImportDataAccess;

	//funtions

	const handleImportSocket = (data, id) => {
		if (loader.current.ids.loader3 !== id) return;
		let totalProgress = (data.index / data.size) * 100;
		setProgress(Math.floor(totalProgress));
	};

	const handleImportResponse = data => {
		setCheckedLeads([]);
		let errorLeads = [...(data?.element_error || [])];
		let successLeads = [...(data?.element_success || [])];
		let newLeads = [...errorLeads, ...successLeads];
		setList(prev =>
			prev
				.filter(lead => newLeads.find(newLead => newLead.sr_no === lead.sr_no))
				.map(lead => {
					let errorLead = errorLeads.find(errLead => errLead.sr_no === lead.sr_no);
					let successLead = successLeads.find(succLead => succLead.sr_no === lead.sr_no);
					if (errorLead)
						return { ...lead, error: { msg: errorLead.msg, type: errorLead.type } };
					return { ...lead, success: true, success_lead_id: successLead.lead_id };
				})
				.sort(a => {
					if (a.error) return -1;
					if (a.success) return 1;
					return 0;
				})
		);
		setImportSuccessModal({
			successCount: successLeads.length,
			errorCount: errorLeads.length,
			show: true,
			cadence_id,
		});
		setTimeout(() => setProgress(0), 1000);
		setIsAdding(false);
	};

	//handle loader socket function for both loaders that adds both loader values and show it in the progress bar
	const handleAddSocket = (data, id) => {
		if (loader.current.ids.loader1 !== id && loader.current.ids.loader2 !== id) return;
		if (loader.current.ids.loader1 === id) loader1.current = data.index;
		if (loader.current.ids.loader2 === id) loader2.current = data.index;

		let totalProgress =
			((loader1.current + loader2.current) / loader.current.length) * 100;
		setProgress(Math.floor(totalProgress));
	};

	const handleCadencesClick = (lead, e) => {
		e.stopPropagation();
		if (lead.sr_no === cadencesDropdown.sr_no) setCadencesDropdown(false);
		else setCadencesDropdown({ sr_no: lead.sr_no, cadences: lead.cadences });
	};

	const handleErrorClick = ({ id, error, e }) => {
		e.stopPropagation();
		if (id === errorDropdown.id) setErrorDropdown(false);
		else setErrorDropdown({ id, error });
	};

	const handleMenuClick = (id, e) => {
		e.stopPropagation();
		if (id === optionsDropdown) setOptionsDropdown(false);
		else setOptionsDropdown(id);
	};

	const handleDelete = () => {
		setCheckedLeads(prev => prev.filter(lead => lead !== deleteModal.id));
		setList(prev => prev.filter(lead => lead.sr_no !== deleteModal.id));
	};

	const handleAddToCadence = (lead, stopPreviousCadences) => {
		loader.current = {
			ids: {
				loader1: uuidv4(),
			},
			length: list.filter(
				lead =>
					checkedLeads.includes(lead.sr_no) &&
					lead.status === LEAD_STATUS.LEAD_ABSENT_IN_TOOL
			).length,
		};
		socket1.current.emit("join-room", loader.current.ids.loader1);
		resetDropdowns();
		let body = {};
		if (lead.status === LEAD_STATUS.LEAD_ABSENT_IN_TOOL) {
			body.add = {
				loaderId: loader.current.ids.loader1,
				leads: [lead].map(l => {
					delete l.error;
					delete l.success;
					return l;
				}),
			};
			body.link = {};
		}
		addList(body);
	};

	const resetDropdowns = () => {
		setProgress(0);
		setLinkLeadsModal(false);
	};

	//sideeffects

	//create 2 socket connections for 2 loaders (add, link)
	useEffect(() => {
		//add/link
		socket1.current.on("cadence-import-loader", data =>
			handleAddSocket(data, loader.current.ids.loader1)
		);
		socket2.current.on("cadence-import-loader", data =>
			handleAddSocket(data, loader.current.ids.loader2)
		);
		//import
		socket3.current.on("cadence-import-loader", data =>
			handleImportSocket(data, loader.current.ids.loader3)
		);
		//response
		socket1.current.on("cadence-import-response", data => handleImportResponse(data));
	}, []);

	useEffect(() => {
		loader.current = {
			ids: {
				loader3: uuidv4(),
			},
		};
		socket3.current.emit("join-room", loader.current.ids.loader3);
		importLeads(
			{
				loaderId: loader.current.ids.loader3,
			},
			{
				onSuccess(data) {
					setList(data);
					if (getLeadsExcludingError(data).length > 1000) {
						setLeadsLimitModal(true);
						setCheckedLeads(getLeadsExcludingError(data).slice(0, 1000));
					} else setCheckedLeads(getLeadsExcludingError(data));
				},
			}
		);
	}, []);

	const textDelete = COMMON_TRANSLATION.DELETE[user?.language?.toUpperCase()];
	//constants

	const TABLE_COLUMNS = [
		<Checkbox
			className={styles.checkBox}
			checked={
				checkedLeads?.length === getLeadsExcludingError(list)?.length && list?.length > 0
			}
			onChange={() => {
				if (list?.length > 0) {
					if (
						checkedLeads?.length !== getLeadsExcludingError(list).slice(0, 1000).length
					) {
						if (getLeadsExcludingError(list).length > 1000) setLeadsLimitModal(true);
						setCheckedLeads(getLeadsExcludingError(list).slice(0, 1000));
					} else setCheckedLeads([]);
				}
			}}
			disabled={isAddSuccess}
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

	const handleLeadClick = lead => {
		setLeadDetailsModal(lead);
	};

	return (
		<PageContainer className={styles.pageContainer}>
			<div className={styles.header}>
				<BackButton onClick={() => navigate(`/cadence/${cadence_id}?view=list`)} />
				<div className={styles.backToCSV}>
					<Tooltip text="Column mapping" className={styles.csvTooltip}>
						<ThemedButton
							theme={ThemedButtonThemes.WHITE}
							onClick={() =>
								cadence_id
									? navigate(
											`/import-csv?cadence_id=${cadence_id}&cadence_name=${cadence_name}`
									  )
									: navigate("/cadence")
							}
							width="fit-content"
							disabled={isAddSuccess}
						>
							<ColumnMapping />
						</ThemedButton>
					</Tooltip>
				</div>
			</div>
			{importError?.error ? (
				<div className={styles.error}>
					<ErrorGradient size="38px" />
					<span className={styles.importFailed}>
						{COMMON_TRANSLATION.IMPORT_FAILED[user?.language?.toUpperCase()]}
					</span>
					<span>{importError.msg}</span>
				</div>
			) : importLoading || isAdding ? (
				<div className={styles.loading}>
					<span className={styles.text}>
						{importLoading ? `Importing Leads` : `Adding - ${progress}%`}
					</span>
					{isAdding && (
						<span className={styles.cadence}>
							<Cadences /> Adding {checkedLeads.length}{" "}
							{COMMON_TRANSLATION.PEOPLE_IN[user?.language?.toUpperCase()]} {cadence_name}
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
						list={list}
						resetDropdowns={resetDropdowns}
						loader={loader}
						socket1={socket1}
						setIsAdding={setIsAdding}
					/>
					<Table
						loading={importLoading}
						columns={TABLE_COLUMNS}
						noOfRows={6}
						className={styles.table}
						theme={TableThemes.WHITE_AND_LIGHT_PURPLE}
						height="calc(100vh - 190px)"
					>
						{list?.map((lead, index) => (
							<tr
								key={lead.sr_no}
								onClick={() => {
									handleLeadClick(lead);
								}}
							>
								<td onClick={e => e.stopPropagation()}>
									<Checkbox
										className={styles.checkBox}
										checked={checkedLeads?.includes(lead.sr_no)}
										disabled={isLeadError(lead) || isAddSuccess}
										onChange={() => {
											checkedLeads.includes(lead.sr_no)
												? setCheckedLeads(prevState =>
														prevState.filter(item => item !== lead.sr_no)
												  )
												: checkedLeads.length === 1000
												? setLeadsLimitModal(true)
												: setCheckedLeads(prevState => [...prevState, lead.sr_no]);
										}}
									/>
								</td>
								<td>{index + 1}</td>
								<td className={styles.name}>
									<div>
										{lead.success_lead_id && (
											<CadenceBox
												size="2rem"
												onClick={e => {
													e.stopPropagation();
													window.open(`/crm/leads/${lead.success_lead_id}`);
												}}
												style={{ cursor: "pointer" }}
											/>
										)}{" "}
										<div title={`${lead.first_name} ${lead.last_name}`}>
											{lead.first_name} {lead.last_name}
										</div>
									</div>
								</td>
								<td>
									<div title={lead.company}>{lead.company} </div>
								</td>
								<td>
									<div title={lead.job_position ?? "NA"}>{lead.job_position ?? "NA"}</div>
								</td>
								<td>
									<div title={lead.primary_phone ?? "NA"}>
										{lead.primary_phone ?? "NA"}
									</div>
								</td>
								<td>
									<div title={lead?.primary_email ?? "NA"}>
										{lead?.primary_email ?? "NA"}
									</div>
								</td>
								<td title={lead.Owner?.Name}>
									<div>{lead.Owner?.Name}</div>
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
										{(lead.status === LEAD_STATUS.USER_NOT_PRESENT ||
											lead.status === LEAD_STATUS.ANOTHER) && (
											<ThemedButton
												// onClick={e =>
												// 	handleErrorClick({
												// 		id: lead.sr_no,
												// 		error:
												// 			lead.status === LEAD_STATUS.USER_NOT_PRESENT
												// 				? "User not present in cadence"
												// 				: lead.fieldStatus,
												// 		e: e,
												// 	})
												// }
												onClick={e => {
													e.preventDefault();
													e.stopPropagation();
													setErrorModal({
														type: lead?.error?.type ?? "default",
														msg:
															lead.status === LEAD_STATUS.USER_NOT_PRESENT
																? "User not present in cadence"
																: lead.fieldStatus,
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
												// onClick={e =>
												// 	handleErrorClick({
												// 		id: lead.sr_no,
												// 		error: lead.error?.msg,
												// 		e: e,
												// 	})
												// }
												onClick={e => {
													// handleErrorClick({
													// 	id: lead.Id,
													// 	error: lead.error ? lead.error?.msg : lead.status,
													// 	e: e,
													// });
													e.preventDefault();
													e.stopPropagation();
													setErrorModal({
														type: lead?.error?.type ?? "default",
														msg: lead.error ? lead.error?.msg : lead.status,
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
											lead.sr_no === cadencesDropdown.sr_no ? styles.isActive : ""
										}`}
										ref={cadencesDropdownRef}
									>
										{cadencesDropdown?.cadences?.length ? (
											cadencesDropdown?.cadences?.map(cadence => (
												<div>{cadence.name}</div>
											))
										) : (
											<div>
												{COMMON_TRANSLATION.NO_CADENCES[user?.language?.toUpperCase()]}
											</div>
										)}
									</div>
									<div
										className={`${styles.dropDownMenu} ${styles.cadences} ${
											lead.sr_no === errorDropdown.id ? styles.isActive : ""
										}`}
										ref={errorDropdownRef}
									>
										<div>{errorDropdown?.error}</div>
									</div>
								</td>
								<td className={styles.actions}>
									<Tooltip text={COMMON_TRANSLATION.MORE[user?.language?.toUpperCase()]}>
										<ThemedButton
											className={styles.dotsBtn}
											theme={ThemedButtonThemes.GREY}
											onClick={e => {
												handleMenuClick(lead.sr_no, e);
											}}
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
											lead.sr_no === optionsDropdown ? styles.isActive : ""
										}`}
										// ref={optionsDropdownRef}
									>
										<Button
											disabled={isLeadError(lead)}
											onClick={e => {
												lead.status === LEAD_STATUS.LEAD_PRESENT_IN_TOOL
													? setLinkLeadsModal(lead)
													: handleAddToCadence(lead);
												e.stopPropagation();
											}}
										>
											<Cadences />
											Add to cadence
										</Button>
										<Button
											onClick={e => {
												setDeleteModal({
													name: `${lead.first_name} ${lead.last_name}`,
													id: lead.sr_no,
												});
												e.stopPropagation();
											}}
											className={styles.deleteBtn}
										>
											<Trash />
											{textDelete.slice(0, 1).toUpperCase() + textDelete.slice(1)}
										</Button>
									</div>
								</td>
							</tr>
						))}
					</Table>
					<LeadDetailsModal modal={leadDetailsModal} setModal={setLeadDetailsModal} />
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
					<LeadsLimitModal modal={leadsLimitModal} setModal={setLeadsLimitModal} />
					<ImportSuccessModal
						modal={importSuccessModal}
						setModal={setImportSuccessModal}
						cadenceSelected={{ id: cadence_id }}
					/>
					<ErrorModal modal={errorModal} setModal={setErrorModal} />
				</>
			)}
		</PageContainer>
	);
};

export default CadenceImport;
