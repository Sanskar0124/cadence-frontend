import {
	Button,
	DeleteModal,
	PageContainer,
	Spinner,
	Title,
	Tooltip,
} from "@cadence-frontend/components";
import { MessageContext } from "@cadence-frontend/contexts";
import {
	useCadenceImportSellsy,
	useCSVImportSellsy,
	useSocket,
	useUser,
} from "@cadence-frontend/data-access";
import { ENV } from "@cadence-frontend/environments";
import {
	Cadences,
	ColumnMapping,
	ErrorGradient,
	Sellsy,
	More,
	Trash,
	CadenceBox,
	GoogleSheets,
	Excel,
} from "@cadence-frontend/icons";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import { TableThemes, ThemedButtonThemes } from "@cadence-frontend/themes";
import { useQuery } from "@cadence-frontend/utils";
import { BackButton, Checkbox, Table, ThemedButton } from "@cadence-frontend/widgets";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import LinkLeadsModal from "../../../components/LinkLeadsModal/LinkLeadsModal";
import styles from "./CadenceImport.module.scss";
import Actions from "./components/Actions/Actions";
import {
	getLeadsExcludingError,
	isLeadError,
	isLeadSuccesss,
	getFormDataLeads,
	getFormDataContacts,
	LEAD_ERROR_MSG_MAP,
	LEAD_STATUS,
} from "./constants";
import ImportSuccessModal from "../../../components/ImportSuccessModal/ImportSuccessModal";
import ErrorModal from "../../../components/ErrorModal/ErrorModal";
import LeadDetailsModal from "./components/LeadDetailsModal/LeadDetailsModal";
import { LEAD_INTEGRATION_TYPES } from "@cadence-frontend/constants";

const CadenceImport = () => {
	const navigate = useNavigate();
	const { user } = useUser({ user: true });
	const { addError, addSuccess } = useContext(MessageContext);
	const [socket1] = useSocket(ENV.BACKEND, "/socket-service/socket");
	const [socket2] = useSocket(ENV.BACKEND, "/socket-service/socket");
	const query = useQuery();
	const webhook = query.get("webhook");
	const cadence_id = query.get("cadence_id");
	const cadence_name = query.get("cadence_name");
	const type = query.get("type");
	const import_type = query.get("import_type");

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
	const [cadencesDropdown, setCadencesDropdown] = useState({ sr_no: "", cadences: "" });
	const [errorDropdown, setErrorDropdown] = useState(false);
	//states
	const [list, setList] = useState([]);
	const [checkedLeads, setCheckedLeads] = useState([]);
	const [cadenceSelected, setCadenceSelected] = useState({ id: "", name: "" });
	const [progress, setProgress] = useState(0);
	const [isAdding, setIsAdding] = useState(false);
	const [isPreviewing, setIsPreviewing] = useState(true);
	const [roomJoined, setRoomJoined] = useState(false);
	//modals
	const [deleteModal, setDeleteModal] = useState(false);
	const [linkLeadsModal, setLinkLeadsModal] = useState(false);
	const [importSuccessModal, setImportSuccessModal] = useState({
		successCount: 0,
		errorCount: 0,
	});
	const [errorModal, setErrorModal] = useState(false);
	const [leadDetailsModal, setLeadDetailsModal] = useState(null);

	//api
	const cadenceImportDataAccess = useCadenceImportSellsy(
		{ type },
		{ leads: Boolean(webhook) }
	);
	const csvImportSellsyDataAccess = useCSVImportSellsy();

	const { addList, addLoading, deleteLead, deleteLoading, isAddSuccess } =
		cadenceImportDataAccess;
	const {
		previewLeadsViaCSV,
		previewLeadsViaCSVLoading,
		previewLeadsViaSheets,
		previewLeadsViaSheetsLoading,
		postContactsMutation,
		postContactsLoading,
	} = csvImportSellsyDataAccess;
	//funtions
	const handleImportResponse = data => {
		// let absent = list.filter(
		// 	item =>
		// 		checkedLeads.includes(item.sr_no) &&
		// 		item.status === LEAD_STATUS.LEAD_ABSENT_IN_TOOL
		// ).length;
		// let present = list.filter(
		// 	item =>
		// 		checkedLeads.includes(item.sr_no) &&
		// 		item.status === LEAD_STATUS.LEAD_PRESENT_IN_TOOL
		// ).length;
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
								? errLead.contact_preview_id === lead.sr_no
								: errLead.sr_no === lead.sr_no
						);
						let successLead = successLeads.find(successLead =>
							type === "create_lead"
								? successLead.contact_preview_id === lead.sr_no
								: successLead.sr_no === lead.sr_no
						);
						if (errorLead)
							return {
								...lead,
								error: { msg: errorLead.msg, type: errorLead.type },
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
			console.log("Count Ref", countRef);
			console.log("checkedLeadsRef", checkedLeadsRef);
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
	const handleRoomJoined = data => {
		setRoomJoined(true);
	};
	const handleCadencesClick = lead => {
		resetDropdowns();
		if (lead.sr_no === cadencesDropdown.sr_no)
			setCadencesDropdown({ lead_id: "", cadences: "" });
		else setCadencesDropdown({ sr_no: lead.sr_no, cadences: lead.cadences });
	};
	const handleSellsyIconClick = (lead, e) => {
		e.stopPropagation();
		let url = "";
		if (!lead.id) return "";
		url = `https://www.sellsy.com/peoples/${lead.id}`;
		if (url) window.open(url, "_blank");
		else addError({ text: "This lead does not have the required info." });
	};
	const handleMenuClick = id => {
		resetDropdowns();
		if (id === optionsDropdown) setOptionsDropdown(false);
		else setOptionsDropdown(id);
	};

	const handleDelete = () => {
		resetDropdowns();
		setList(prev => prev.filter(lead => lead.sr_no !== deleteModal.id));
		setCheckedLeads(prev => prev.filter(sr_no => sr_no !== deleteModal.id));
	};

	const handleAddToCadence = (lead, stopPreviousCadences) => {
		setIsAdding(true);
		loader.current = {
			...loader.current,
			length:
				list.filter(
					lead =>
						checkedLeads.includes(lead.sr_no) &&
						lead.status === LEAD_STATUS.LEAD_ABSENT_IN_TOOL
				).length +
				list.filter(
					lead =>
						checkedLeads.includes(lead.sr_no) &&
						(lead.status === LEAD_STATUS.LEAD_PRESENT_IN_TOOL ||
							lead.status === LEAD_STATUS.LEAD_INACTIVE)
				).length,
		};
		// socket1.current.emit("join-room", loader.current.ids.loader1);
		// socket2.current.emit("join-room", loader.current.ids.loader2);
		resetDropdowns();
		if (!cadenceSelected.id) return addError({ text: "Please select a cadence" });
		setCheckedLeads([lead.sr_no]);
		let body = {};
		if (lead.status === LEAD_STATUS.LEAD_ABSENT_IN_TOOL) {
			body.add = {
				loaderId: loader.current.ids.loader1,
				cadence_id: cadenceSelected.id.toString(),
				contacts: [lead].map(l => {
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
				contacts: [lead].map(l => {
					delete l.error;
					delete l.success;
					return l;
				}),
			};
		}
		setList(prev => prev.map(i => ({ ...i, shown: false })));
		addList(body);
	};

	const resetDropdowns = () => {
		setOptionsDropdown(false);
		setCadencesDropdown({ sr_no: "", cadences: "" });
		setErrorDropdown(false);
		setLinkLeadsModal(false);
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

	//sideeffects

	// useEffect(() => {
	// 	const contactsArr = JSON.parse(
	// 		sessionStorage.getItem(`contacts-cadence-${cadence_id}`)
	// 	);
	// 	setList(contactsArr.map(item => ({ ...item, shown: true })));
	// 	setCheckedLeads(getLeadsExcludingError(contactsArr));
	// }, []);

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
					{ field_map: preview_body, loaderId: loader.current.ids.loader1 },
					{
						onError: error => {
							addError({ text: "Error occured while trying to save mappings" });
							cadence_id
								? navigate(`/cadence/${cadence_id}?tab=list`)
								: navigate("/cadence");
						},
					}
				);
			} else {
				postContactsMutation(
					getFormDataContacts(preview_body, loader.current.ids.loader1),
					{
						onError: err => {
							addError({
								text:
									err.response?.data?.msg ??
									"Error Occured while trying to save mappings",
								desc: err?.response?.data?.error,
								cId: err?.response?.data?.correlationId,
							});
							cadence_id
								? navigate(`/cadence/${cadence_id}?tab=list`)
								: navigate("/cadence");
						},
					}
				);
			}
		}
	}, [roomJoined]);
	//constants

	const TABLE_COLUMNS = [
		<Checkbox
			className={styles.checkBox}
			disabled={getLeadsExcludingError(list?.filter(lead => lead.shown))?.length === 0}
			checked={
				checkedLeads?.length > 0 &&
				checkedLeads?.length ===
					getLeadsExcludingError(list?.filter(lead => lead.shown))?.length &&
				list?.length > 0
			}
			onChange={() => {
				if (list?.length > 0)
					checkedLeads?.length !==
					getLeadsExcludingError(list?.filter(lead => lead.shown)).length
						? setCheckedLeads(getLeadsExcludingError(list))
						: setCheckedLeads([]);
			}}
		/>,
		"Sno.",
		"Name",
		"Company",
		"Title",
		"Email",
		"Owner",
		"Cadence",
		"Action",
	];

	return (
		<PageContainer className={styles.pageContainer}>
			<div className={styles.header}>
				<BackButton
					onClick={() => {
						sessionStorage.clear();
						cadence_id
							? navigate(`/cadence/${cadence_id}?tab=list`)
							: navigate("/cadence");
					}}
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
			{isAdding || isPreviewing ? (
				<div className={styles.loading}>
					<span className={styles.text}>{`${
						isAdding ? "Adding" : "Fetching Contacts"
					} - ${progress}%`}</span>
					{isAdding && (
						<span className={styles.cadence}>
							<Cadences /> Adding {checkedLeads.length}{" "}
							{COMMON_TRANSLATION.PEOPLE_IN[user?.language?.toUpperCase()]}{" "}
							{cadenceSelected.name}
						</span>
					)}
					<progress max="100" value={progress}></progress>
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
						setImportSuccessModal={setImportSuccessModal}
					/>
					<Table
						columns={TABLE_COLUMNS}
						noOfRows={6}
						className={styles.table}
						theme={TableThemes.WHITE_AND_LIGHT_PURPLE}
						// height={`calc(100vh - ${webhook ? "190px" : "230px"})`}
						height="calc(100vh - 230px)"
					>
						{list
							?.filter(item => item.shown === true)
							?.map((lead, index) => (
								<tr key={lead.sr_no} onClick={() => setLeadDetailsModal(lead)}>
									<td onClick={e => e.stopPropagation()}>
										<Checkbox
											className={styles.checkBox}
											checked={checkedLeads?.includes(lead.sr_no)}
											disabled={isLeadError(lead) || isLeadSuccesss(lead)}
											onChange={() => {
												checkedLeads.includes(lead.sr_no)
													? setCheckedLeads(prevState =>
															prevState.filter(item => item !== lead.sr_no)
													  )
													: setCheckedLeads(prevState => [...prevState, lead.sr_no]);
											}}
										/>
									</td>
									<td>{index + 1}</td>
									<td className={styles.name}>
										<div>
											{lead?.integration_type ===
											LEAD_INTEGRATION_TYPES.SELLSY_GOOGLE_SHEET_CONTACT ? (
												<GoogleSheets size={30} />
											) : lead?.integration_type ===
											  LEAD_INTEGRATION_TYPES.SELLSY_CSV_CONTACT ? (
												<Excel size={30} />
											) : (
												<Sellsy
													size="2rem"
													onClick={e => handleSellsyIconClick(lead, e)}
												/>
											)}
											<div title={`${lead.first_name} ${lead.last_name}`}>
												{lead.first_name} {lead.last_name}
											</div>
										</div>
									</td>
									<td>
										{" "}
										<div
											title={
												lead.company_name ?? lead.account?.name ?? lead.Account?.name
											}
										>
											{lead.company_name ?? lead.account?.name ?? lead.Account?.name}{" "}
										</div>
									</td>
									<td>
										{" "}
										<div title={lead.job_position ?? "NA"}>
											{lead.job_position ?? "NA"}
										</div>
									</td>
									<td>
										<div title={lead.emails?.find(em => em.email_id)?.email_id ?? "NA"}>
											{lead.emails?.find(em => em.email_id)?.email_id ?? "NA"}
										</div>
									</td>
									<td>
										<div title={lead.owner?.owner_name || lead.Owner?.owner_name}>
											{lead.owner?.owner_name || lead.Owner?.owner_name}
										</div>
									</td>
									<td className={styles.actions}>
										<div className={styles.buttons}>
											{lead.status === LEAD_STATUS.LEAD_PRESENT_IN_TOOL &&
												!lead.error &&
												!lead.success && (
													<ThemedButton
														onClick={e => {
															handleCadencesClick(lead);
															e.stopPropagation();
														}}
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
												lead.sr_no === cadencesDropdown?.sr_no ? styles.isActive : ""
											}`}
										>
											{cadencesDropdown?.cadences?.length ? (
												cadencesDropdown?.cadences?.map(cadence => (
													<div>{cadence.Cadences[0]?.name}</div>
												))
											) : (
												<div>
													{COMMON_TRANSLATION.NO_CADENCES[user?.language?.toUpperCase()]}
												</div>
											)}
										</div>
									</td>
									<td className={styles.actions}>
										<Tooltip
											text={COMMON_TRANSLATION.MORE[user?.language?.toUpperCase()]}
										>
											<ThemedButton
												className={styles.dotsBtn}
												theme={ThemedButtonThemes.GREY}
												onClick={e => {
													handleMenuClick(lead.sr_no);
													e.stopPropagation();
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
										>
											<Button
												disabled={
													isLeadError(lead) ||
													isLeadSuccesss(lead) ||
													!cadenceSelected?.id
												}
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
											{/* <Button>
											<ReAssign />
											Re-assign
										</Button> */}
											<Button
												onClick={e => {
													setDeleteModal({
														name: `${lead.first_name ?? ""} ${lead.last_name ?? ""}`,
														id: lead.sr_no,
													});
													e.stopPropagation();
												}}
												className={styles.deleteBtn}
											>
												<Trash />
												{COMMON_TRANSLATION.DELETE[user?.language?.toUpperCase()]
													?.slice(0, 1)
													.toUpperCase() +
													COMMON_TRANSLATION.DELETE[user?.language?.toUpperCase()]?.slice(
														1
													)}
											</Button>
										</div>
									</td>
								</tr>
							))}
					</Table>
					<DeleteModal
						modal={deleteModal}
						setModal={setDeleteModal}
						item={deleteModal?.name}
						onDelete={handleDelete}
						loading={deleteLoading}
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
					<LeadDetailsModal modal={leadDetailsModal} setModal={setLeadDetailsModal} />
				</>
			)}
		</PageContainer>
	);
};

export default CadenceImport;
