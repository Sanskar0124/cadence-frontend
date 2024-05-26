import React, { useContext, useEffect, useRef, useState } from "react";
import styles from "./CadenceImport.module.scss";
import {
	Button,
	DeleteModal,
	PageContainer,
	Spinner,
	Title,
	Tooltip,
} from "@cadence-frontend/components";
import {
	BackButton,
	Checkbox,
	CollapseContainer,
	Table,
	ThemedButton,
} from "@cadence-frontend/widgets";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import {
	useCSVImportZoho,
	useCadenceImportZoho,
	useSocket,
} from "@cadence-frontend/data-access";
import { ENV } from "@cadence-frontend/environments";
import { userInfo } from "@cadence-frontend/atoms";
import { MessageContext } from "@cadence-frontend/contexts";
import { useQuery } from "@cadence-frontend/utils";
import Actions from "./components/Actions/Actions";
import {
	LEAD_STATUS,
	getLeadsExcludingError,
	getShortName,
	handleZohoIconClick,
	isLeadError,
	DATA_CATEGORY,
	isLeadSuccesss,
	LEAD_ERROR_MSG_MAP,
} from "./constants";
import {
	Bullhorn,
	CadenceBox,
	Cadences,
	Dynamics,
	ErrorGradient,
	More,
	Trash,
	ColumnMapping,
	GoogleSheets,
	Excel,
	Zoho,
} from "@cadence-frontend/icons";
import { TableThemes, ThemedButtonThemes } from "@cadence-frontend/themes";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import { v4 as uuidv4 } from "uuid";
import LeadDetailsModal from "./components/LeadDetailsModal/LeadDetailsModal";
import LinkLeadsModal from "../../components/LinkLeadsModal/LinkLeadsModal";
import ImportSuccessModal from "../../components/ImportSuccessModal/ImportSuccessModal";
import ErrorModal from "../../components/ErrorModal/ErrorModal";
import { LEAD_INTEGRATION_TYPES } from "@cadence-frontend/constants";

const CadenceImport = () => {
	const navigate = useNavigate();
	const user = useRecoilValue(userInfo);
	const { addError } = useContext(MessageContext);
	const [socket1] = useSocket(ENV.BACKEND, "/socket-service/socket");
	const [socket2] = useSocket(ENV.BACKEND, "/socket-service/socket");
	const query = useQuery();
	const cadence_id = query.get("cadence_id");
	const cadence_name = query.get("cadence_name");
	const type = query.get("type");
	const import_type = query.get("import_type");
	const [errorModal, setErrorModal] = useState(false);

	//refs
	const loader = useRef({ ids: { loader1: uuidv4(), loader2: uuidv4() }, length: 0 });
	const loader1 = useRef(0);
	const loader2 = useRef(0);
	const leadsPreviewedRef = useRef(false);
	const roomJoinedRef = useRef(false);

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
	const [isPreviewing, setIsPreviewing] = useState(true);
	const [roomJoined, setRoomJoined] = useState(false);

	//modals
	const [deleteModal, setDeleteModal] = useState(false);
	const [linkLeadsModal, setLinkLeadsModal] = useState(false);
	const [leadDetailsModal, setLeadDetailsModal] = useState(null);
	const [importSuccessModal, setImportSuccessModal] = useState({
		successCount: 0,
		errorCount: 0,
	});

	let moreBtnPressed = false;

	//API

	const csvImportZohoDataAccess = useCSVImportZoho();
	const {
		previewLeadsViaCSV,
		previewLeadsViaCSVLoading,
		previewLeadsViaSheets,
		previewLeadsViaSheetsLoading,
	} = csvImportZohoDataAccess;

	const cadenceImportDataAccess = useCadenceImportZoho({
		enabled: false,
		leadType: type,
	});

	const { addList, isAddSuccess, importError, addLoading } = cadenceImportDataAccess;

	const handleRoomJoined = data => {
		setRoomJoined(true);
	};

	//create 2 socket connections for 2 loaders (add, link)
	useEffect(() => {
		socket1.current.on("cadence-import-loader", data =>
			handleImportSocket(data, loader.current.ids.loader1)
		);
		socket1.current.on("cadence-import-response", data => handleImportResponse(data));
		socket1.current.on("msg", data => handleRoomJoined(data));
		socket2.current.on("cadence-import-loader", data =>
			handleImportSocket(data, loader.current.ids.loader2)
		);
		socket2.current.on("cadence-import-response", data => handleImportResponse(data));
		socket1.current.emit("join-room", loader.current.ids.loader1);
		socket2.current.emit("join-room", loader.current.ids.loader2);

		//To handle if room not joins for more than 10s
		const timeout = setTimeout(() => {
			if (!roomJoinedRef.current) {
				cadence_id ? navigate(`/cadence/${cadence_id}?tab=list`) : navigate("/cadence");
			}
		}, 10000);
		return () => {
			clearTimeout(timeout);
		};
	}, []);

	useEffect(() => {
		if (!isPreviewing) {
			leadsPreviewedRef.current = !isPreviewing;
		}
	}, [isPreviewing]);

	useEffect(() => {
		checkedLeadsRef.current = checkedLeads;
	}, [checkedLeads]);

	useEffect(() => {
		roomJoinedRef.current = roomJoined;
	}, [roomJoined]);

	useEffect(() => {
		if (cadence_id && cadence_name)
			setCadenceSelected({ id: cadence_id, name: cadence_name });
	}, []);

	const getFormDataLeads = (object, previewLoaderId) => {
		const formData = new FormData();
		const fieldMap = {};
		Object.keys(object).forEach(key => {
			if (
				key === "emails" ||
				key === "phone_numbers" ||
				key === "first_name" ||
				key === "last_name" ||
				key === "linkedin_url" ||
				key === "job_position" ||
				key === "company_name" ||
				key === "url" ||
				key === "country" ||
				key === "size" ||
				key === "zip_code" ||
				key === "zoho_owner_id"
			)
				fieldMap[key] = object[key];
		});
		formData.append("field_map", JSON.stringify(fieldMap));
		formData.append("loaderId", previewLoaderId);
		return formData;
	};

	useEffect(() => {
		if (roomJoined) {
			const preview_body = JSON.parse(sessionStorage.getItem(`preview-body`));

			if (import_type === "csv") {
				previewLeadsViaCSV(getFormDataLeads(preview_body, loader.current.ids.loader1), {
					onError: error => {
						addError({ text: "Error occured while trying to save mappings" });
						cadence_id
							? navigate(`/cadence/${cadence_id}?tab=list`)
							: navigate("/cadence");
					},
				});
			} else if (import_type === "sheets") {
				previewLeadsViaSheets(
					{
						cadence_id: cadence_id,
						field_map: preview_body,
						loaderId: loader.current.ids.loader1,
					},
					{
						onError: error => {
							addError({ text: "Error occured while trying to save mappings" });
							cadence_id
								? navigate(`/cadence/${cadence_id}?tab=list`)
								: navigate("/cadence");
						},
					}
				);
			}
		}
	}, [roomJoined]);

	// socket function
	//funtions
	const handleImportResponse = (data, typeOfAction) => {
		if (leadsPreviewedRef?.current) {
			let errorLeads = [...(data?.element_error || [])];
			let successLeads = [...(data?.element_success || [])];

			//CountRef stores number of results fetched
			countRef.current += errorLeads.length + successLeads.length;
			//checks if the number of responses from socket is equal to the number of checkedLeads(number of leads selected to add or import)
			let showModal = checkedLeadsRef.current.length === countRef.current;

			setList(prev =>
				prev
					.map(lead => {
						let errorLead = errorLeads.find(errLead =>
							type === "create_lead"
								? errLead.lead_preview_id === lead.Id
								: errLead.integration_id === lead.Id
						);
						let successLead = successLeads.find(succLead =>
							type === "create_lead"
								? succLead.lead_preview_id === lead.Id
								: succLead.integration_id === lead.Id
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
				cadence_id,
			}));
		} else {
			if (data?.error) {
				addError({ text: data?.error ?? "Error in fetching contacts" });
				cadence_id ? navigate(`/cadence/${cadence_id}?tab=list`) : navigate("/cadence");
			} else {
				const contactsArr = ["sheets", "csv"]?.includes(import_type)
					? data?.leads
					: data?.contacts;
				setList(contactsArr.map(item => ({ ...item, shown: true })));
				setCheckedLeads(getLeadsExcludingError(contactsArr));
			}
			setProgress(0);
			loader1.current = 0;
			setIsPreviewing(false);
		}
	};

	//handle loader socket function for both loaders that adds both loader values and show it in the progress bar
	const handleImportSocket = (data, id) => {
		if (loader.current.ids.loader1 !== id && loader.current.ids.loader2 !== id) return;
		if (loader.current.ids.loader1 === id) loader1.current = data.index;
		if (loader.current.ids.loader2 === id) loader2.current = data.index;

		let totalLeads = isAddSuccess ? loader.current.length : data.size;

		let totalProgress = ((loader1.current + loader2.current) / totalLeads) * 100;
		setProgress(Math.floor(totalProgress));
	};

	// Handle add To cadence a Particular  lead
	const handleAddToCadence = (lead, stopPreviousCadences) => {
		setIsAdding(true);
		loader.current = {
			...loader.current,

			length:
				list?.filter(
					lead =>
						checkedLeads.includes(lead.Id) &&
						lead.status === LEAD_STATUS.LEAD_ABSENT_IN_TOOL
				).length +
				list?.filter(
					lead =>
						checkedLeads.includes(lead.Id) &&
						(lead.status === LEAD_STATUS.LEAD_PRESENT_IN_TOOL ||
							lead.status === LEAD_STATUS.LEAD_INACTIVE)
				).length,
		};

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

		if (
			lead.status === LEAD_STATUS.LEAD_PRESENT_IN_TOOL ||
			lead.status === LEAD_STATUS.LEAD_INACTIVE
		) {
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

		addList(body);
		setList(prev => prev.map(i => ({ ...i, shown: false })));
	};

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

	// Reset drop downs
	const resetDropdowns = () => {
		setOptionsDropdown(false);
		setCadencesDropdown({ sr_no: "", cadences: "" });
		setErrorDropdown(false);
		setLinkLeadsModal(false);
	};

	// handle to go back setting page
	const handleGoToProfileClick = () => {
		navigate("/settings?view=my_connections");
	};

	// Delete Lead
	const handleDelete = () => {
		setCheckedLeads(prev => prev.filter(lead => lead !== deleteModal.id));
		setList(prev => prev.filter(lead => lead.Id !== deleteModal.id));
	};

	const handleMenuClick = (id, e) => {
		e.stopPropagation();
		resetDropdowns();
		if (id === optionsDropdown) setOptionsDropdown(false);
		else setOptionsDropdown(id);
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

	const handleCadencesClick = (lead, e) => {
		e.stopPropagation();
		resetDropdowns();
		if (lead.Id === cadencesDropdown.id) setCadencesDropdown(false);
		else {
			let cadences = [];
			if (lead.Cadences) {
				cadences = lead.Cadences.map(cad => ({
					name: cad.Cadences[0]?.name,
					cadence_id: cad.Cadences[0]?.cadence_id,
				}));
			}

			if (lead.cadences) {
				cadences = lead.cadences.map(cad => ({
					name: cad?.name,
					cadence_id: cad?.cadence_id,
				}));
			}

			setCadencesDropdown({
				id: lead.Id,
				cadences,
			});
		}
	};

	// Table column names
	const TABLE_COLUMNS = [
		<Checkbox
			className={styles.checkBox}
			disabled={
				getLeadsExcludingError(list?.filter(lead => lead.shown))?.length === 0 ||
				isAddSuccess
			}
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

	return (
		<PageContainer className={styles.pageContainer}>
			<div className={styles.header}>
				<BackButton
					text={cadenceSelected.id ? "Back to cadence" : "Back to home"}
					onClick={() =>
						navigate(
							cadenceSelected?.id ? `/cadence/${cadenceSelected?.id}?view=list` : "/home"
						)
					}
				/>
				{!addLoading && !isAddSuccess && !isPreviewing && (
					<div className={styles.backToCSV}>
						<ThemedButton
							theme={ThemedButtonThemes.WHITE}
							onClick={() =>
								cadence_id
									? type === "create_lead"
										? navigate(
												`/import-csv?type=${import_type}&cadence_id=${cadence_id}&cadence_name=${cadence_name}`
										  )
										: navigate(
												`/import-csv?cadence_id=${cadence_id}&cadence_name=${cadence_name}`
										  )
									: navigate("/cadence")
							}
							height={"44px"}
							width="fit-content"
						>
							<ColumnMapping />
							Column Remapping
						</ThemedButton>
					</div>
				)}
			</div>

			{importError?.error ? (
				<div className={styles.error}>
					<ErrorGradient size="38px" />
					<span className={styles.importFailed}>
						{COMMON_TRANSLATION.IMPORT_FAILED[user?.language?.toUpperCase()]}
					</span>
					<span>{importError.msg}</span>
					{importError.msg === "Kindly log in with zoho" ? (
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
									<Zoho /> Zoho error message
								</div>
							}
						>
							<div className={styles.sfError}>{importError.zohoErrorMessage}</div>
						</CollapseContainer>
					)}
				</div>
			) : addLoading || isAdding || isPreviewing ? (
				<div className={styles.loading}>
					<span className={styles.text}>{`${
						isAdding ? "Adding" : "Fetching Leads"
					} - ${progress}%`}</span>

					{isAdding && (
						<span className={styles.cadence}>
							<Cadences /> Adding {checkedLeads.length}{" "}
							{COMMON_TRANSLATION.PEOPLE_IN[user?.language?.toUpperCase()]}{" "}
							{cadenceSelected.name}
						</span>
					)}
					{/* {addLoading ? (
						<Spinner className={styles.spinner} />
					) : (
						<progress max="100" value={progress}></progress>
					)} */}

					<progress max="100" value={progress}></progress>
				</div>
			) : (
				<>
					<Title className={styles.title} size="20px">
						{isAddSuccess ? "Successful imports" : "Import"}
					</Title>

					{!isAddSuccess && (
						<Actions
							cadenceImportDataAccess={cadenceImportDataAccess}
							checkedLeads={checkedLeads}
							setCheckedLeads={setCheckedLeads}
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
					)}

					<Table
						loading={addLoading}
						columns={TABLE_COLUMNS}
						noOfRows={9}
						className={styles.table}
						theme={TableThemes.WHITE_AND_LIGHT_PURPLE}
						height="calc(100vh - 190px)"
					>
						{list
							?.filter(item => item.shown === true)
							?.map((lead, index, array) => {
								return (
									<tr
										key={lead.Id}
										onClick={() => {
											setLeadDetailsModal(lead);
										}}
									>
										<td onClick={e => e.stopPropagation()}>
											<Checkbox
												className={styles.checkBox}
												checked={checkedLeads?.includes(lead?.Id)}
												disabled={isLeadError(lead) || isAddSuccess}
												onChange={() => {
													checkedLeads.includes(lead.Id)
														? setCheckedLeads(prevState =>
																prevState.filter(item => item !== lead?.Id)
														  )
														: setCheckedLeads(prevState => [...prevState, lead?.Id]);
												}}
											/>
										</td>
										<td>{index + 1}</td>
										<td className={styles.name}>
											<div>
												{lead?.integration_type ===
												LEAD_INTEGRATION_TYPES.ZOHO_GOOGLE_SHEET_LEAD ? (
													<GoogleSheets size={30} />
												) : lead?.integration_type ===
												  LEAD_INTEGRATION_TYPES.ZOHO_CSV_LEAD ? (
													<Excel size={30} />
												) : (
													<Zoho
														onClick={e =>
															handleZohoIconClick(lead, e, user, addError, type)
														}
														size={"40px"}
													/>
												)}
												{lead?.success_lead_id && (
													<CadenceBox
														size="2rem"
														onClick={e => {
															e.stopPropagation();
															window.open(`/crm/leads/${lead.success_lead_id}`);
														}}
														style={{ cursor: "pointer" }}
													/>
												)}
												<span title={`${lead.first_name ?? ""} ${lead.last_name ?? ""}`}>
													{getShortName(
														`${lead.first_name ?? ""} ${lead.last_name ?? ""}`
													)}
												</span>
											</div>
										</td>
										<td title={lead.Account?.name ?? ""}>{lead.Account?.name ?? "NA"}</td>
										<td title={lead.job_position ?? "NA"}>{lead.job_position ?? "NA"}</td>

										<td
											title={
												lead?.phone_numbers?.find((ph, index) => ph.phone_number)
													?.phone_number ?? "NA"
											}
										>
											{lead?.phone_numbers.length
												? lead?.phone_numbers?.find((ph, index) => ph.phone_number)
														?.phone_number ?? "NA"
												: "NA"}
										</td>

										<td
											title={
												lead?.emails?.find((mail, index) => mail?.email_id)?.email_id ??
												"NA"
											}
										>
											{lead?.emails.length
												? lead?.emails?.find((mail, index) => mail?.email_id)?.email_id ??
												  "NA"
												: "NA"}
										</td>
										<td title={lead.Owner?.Name ?? ""}>{lead.Owner?.Name ?? ""}</td>

										<td className={styles.actions}>
											<div className={styles.buttons}>
												{lead.status === LEAD_STATUS.LEAD_PRESENT_IN_TOOL &&
													!lead.success &&
													!lead.error && (
														<ThemedButton
															onClick={e => handleCadencesClick(lead, e)}
															theme={ThemedButtonThemes.GREEN}
															className={styles.cadenceStatus}
															height="30px"
														>
															Active
														</ThemedButton>
													)}
												{isLeadError(lead) && (
													<ThemedButton
														onClick={e => {
															e.preventDefault();
															e.stopPropagation();
															setErrorModal({
																type: lead?.error?.type ?? "default",
																msg: lead.error
																	? lead.error?.msg
																	: LEAD_ERROR_MSG_MAP[lead.status] ?? lead.status,
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
												// ref={cadenceRef}
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
												text={
													!isAddSuccess &&
													COMMON_TRANSLATION.MORE[user?.language?.toUpperCase()]
												}
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
						leadType={type}
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
