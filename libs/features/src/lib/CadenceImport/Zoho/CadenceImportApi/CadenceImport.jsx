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
	Cadences,
	ErrorGradient,
	Sort as SortIcon,
	NoTasks,
	ZohoBox,
	CadenceBox,
} from "@cadence-frontend/icons";
import { MessageContext } from "@cadence-frontend/contexts";
import {
	BackButton,
	SearchBar,
	ThemedButton,
	Checkbox,
	CollapseContainer,
} from "@cadence-frontend/widgets";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";
import { useOutsideClickHandler, useQuery } from "@cadence-frontend/utils";
import { useContext, useEffect, useRef, useState } from "react";
import {
	TabNavBtnThemes,
	TabNavThemes,
	ThemedButtonThemes,
	TableThemes,
} from "@cadence-frontend/themes";
import { Tabs, Table } from "@cadence-frontend/widgets";
import {
	LEAD_STATUS,
	LEAD_TYPE,
	VIEW_MODES,
	getLeadsExcludingError,
	isLeadError,
	DEFAULT_SF_FIELDS_STRUCT,
	VIEWS,
	getShortName,
	fetchZFields,
	handleZohoIconClick,
} from "./constants";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import Actions from "./components/Actions/Actions";
import Sidebar from "./components/Sidebar/Sidebar";
import {
	useCadenceImportZoho,
	useSocket,
	useZohoFilters,
} from "@cadence-frontend/data-access";
import { ENV } from "@cadence-frontend/environments";
import { useCallback } from "react";
import Placeholder from "./components/Placeholder/Placeholder";
import { v4 as uuidv4 } from "uuid";
import LinkLeadsModal from "../../components/LinkLeadsModal/LinkLeadsModal";
import LeadDetailsModal from "./components/LeadDetailsModal/LeadDetailsModal";
import WarningModal from "./components/WarningModal/WarningModal";
import ImportSuccessModal from "../../components/ImportSuccessModal/ImportSuccessModal";
import ErrorModal from "../../components/ErrorModal/ErrorModal";
import FilterView from "./components/FilterView/FilterView";
import { LEAD_ERROR_MSG_MAP } from "../CadenceImportCsv/constants";

const CadenceImport = () => {
	const navigate = useNavigate();
	const [socket1] = useSocket(ENV.BACKEND, "/socket-service/socket");
	const [socket2] = useSocket(ENV.BACKEND, "/socket-service/socket");
	const user = useRecoilValue(userInfo);
	const { addError } = useContext(MessageContext);
	const query = useQuery();
	const cadence_id = query.get("cadence_id");
	const cadence_name = query.get("cadence_name");
	const [viewMode, setViewMode] = useState("");
	const [leadType, setLeadType] = useState(VIEWS.LEAD);
	const [list, setList] = useState({ lead: [], contact: [] });
	const [filterView, setFilterView] = useState("");

	const [searchValue, setSearchValue] = useState("");
	const [sidebarWidth, setSidebarWidth] = useState("0%");
	const [checkedLeads, setCheckedLeads] = useState([]);
	const [addLeadsBtn, showAddLeadsBtn] = useState(true);
	const [warningModal, setWarningModal] = useState(false);

	//dropdowns
	const [optionsDropdown, setOptionsDropdown] = useState(false);
	const [cadencesDropdown, setCadencesDropdown] = useState(false);
	const [errorDropdown, setErrorDropdown] = useState(false);
	const [cadenceSelected, setCadenceSelected] = useState({
		id: parseInt(cadence_id),
		name: cadence_name,
	});
	const [progress, setProgress] = useState(0);
	const [isSearchBar] = useState(false);
	const [isAdding, setIsAdding] = useState(false);
	const [isPreviewing, setIsPreviewing] = useState(false);
	const [roomJoined, setRoomJoined] = useState(false);

	//modals
	const [linkLeadsModal, setLinkLeadsModal] = useState(false);
	const [leadDetailsModal, setLeadDetailsModal] = useState(null);
	const [importSuccessModal, setImportSuccessModal] = useState({
		successCount: 0,
		errorCount: 0,
	});
	const [errorModal, setErrorModal] = useState(false);

	//ref
	const cadenceRef = useRef(null);
	const checkedLeadsRef = useRef([]);
	const countRef = useRef(0);
	const loader = useRef({ ids: { loader1: uuidv4(), loader2: uuidv4() }, length: 0 });
	const loader1 = useRef(0);
	const loader2 = useRef(0);
	const leadTypeRef = useRef(VIEWS.LEAD);

	const leadsPreviewedRef = useRef(false);
	const roomJoinedRef = useRef(false);

	//api

	useOutsideClickHandler(cadenceRef, () => setCadencesDropdown(false));
	const cadenceImportDataAccess = useCadenceImportZoho({
		enabled: false,
		leadType: leadType,
		filterView: filterView,
	});

	const {
		// import
		addList,
		addLoading,
		isAddSuccess,
		importError,

		getLeadList,
		getLeadListError,
		getLeadListLoading,
	} = cadenceImportDataAccess;

	const handleRoomJoined = data => {
		setRoomJoined(true);
	};

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

	// useEffect(() => {
	// 	if (!isPreviewing) {
	// 		leadsPreviewedRef.current = isPreviewing;
	// 	}
	// }, [isPreviewing]);

	useEffect(() => {
		roomJoinedRef.current = roomJoined;
	}, [roomJoined]);

	const resetStates = () => {
		setProgress(0);
		setIsPreviewing(false);
		setList(prev => ({ ...prev, [leadType]: [] }));
		setCheckedLeads([]);
		loader.current.length = 0;
	};

	useEffect(() => {
		if (filterView) {
			setIsPreviewing(true);
			getLeadList(
				{ loaderId: loader.current.ids.loader1, custom_view_id: filterView.id },

				{
					onError: err => {
						resetStates();
						addError({
							text: err?.response?.data?.msg,
							desc: err?.response?.data?.error,
							cId: err?.response?.data?.correlationId,
						});
					},

					onSuccess: data => {
						if (data?.length === 0) {
							resetStates();
						}
					},
				}
			);
		}
		leadsPreviewedRef.current = false;
		leadTypeRef.current = leadType;
	}, [filterView]);

	useEffect(() => {
		checkedLeadsRef.current = checkedLeads;
	}, [checkedLeads]);

	//Functions

	const handleImportResponse = data => {
		if (leadsPreviewedRef?.current) {
			let errorLeads = [...(data?.element_error || [])];
			let successLeads = [...(data?.element_success || [])];
			//CountRef stores number of results fetched
			countRef.current += errorLeads.length + successLeads.length;
			//checks if the number of responses from socket is equal to the number of checkedLeads(number of leads selected to add or import)
			let showModal = checkedLeadsRef.current.length === countRef.current;

			setList(prev => ({
				...prev,
				[leadTypeRef.current]: prev[leadTypeRef.current]
					?.map(lead => {
						let errorLead = errorLeads.find(
							errLead => errLead.integration_id === lead.Id
						);
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
					}),
			}));

			//As soon as we get both the responses from socket,
			// unselect the leads selected(set checkedLeads to empty array)
			if (showModal) {
				setTimeout(() => setProgress(0), 1000);
				setIsAdding(false);
				setCheckedLeads([]);
			}
			setImportSuccessModal(prev => ({
				...prev,
				successCount: prev?.successCount + successLeads?.length,
				errorCount: prev?.errorCount + errorLeads?.length,
				show: showModal,
				cadence_id,
			}));
		} else {
			if (data?.error) {
				addError({ text: data?.error ?? `Error in fetching ${leadType}s` });
				cadence_id ? navigate(`/cadence/${cadence_id}?tab=list`) : navigate("/cadence");
			} else {
				setList(prev => ({
					...prev,
					[leadTypeRef.current]: data?.leads?.map(item => ({ ...item, shown: true })),
				}));
				setCheckedLeads(getLeadsExcludingError(data?.leads));
			}

			setProgress(0);
			loader1.current = 0;
			leadsPreviewedRef.current = true;
			setIsPreviewing(false);
		}
	};

	//handle loader socket function for both loaders that adds both loader values and show it in the progress bar
	const handleImportSocket = (data, id) => {
		if (loader.current.ids.loader1 !== id && loader.current.ids.loader2 !== id) return;
		if (loader.current.ids.loader1 === id) loader1.current = data.index;
		if (loader.current.ids.loader2 === id) loader2.current = data.index;

		let totalLeads = loader.current.length ? loader.current.length : data.size;
		let totalProgress = ((loader1.current + loader2.current) / totalLeads) * 100;
		setProgress(Math.floor(totalProgress));
	};

	const handleAddToCadence = (lead, stopPreviousCadences) => {
		setIsAdding(true);
		loader.current = {
			...loader.current,
			// ids: {
			// 	loader1: uuidv4(),
			// 	loader2: uuidv4(),
			// },
			length:
				list[leadType]?.filter(
					lead =>
						checkedLeads.includes(lead.Id) &&
						lead.status === LEAD_STATUS.LEAD_ABSENT_IN_TOOL
				).length +
				list[leadType]?.filter(
					lead =>
						checkedLeads.includes(lead.Id) &&
						(lead.status === LEAD_STATUS.LEAD_PRESENT_IN_TOOL ||
							lead.status === LEAD_STATUS.LEAD_INACTIVE)
				).length,
		};
		//socket1.current.emit("join-room", loader.current.ids.loader1);
		//socket2.current.emit("join-room", loader.current.ids.loader2);
		resetDropdowns();

		if (!cadenceSelected.id) return addError({ text: "Please select a cadence" });
		setCheckedLeads([lead.Id]);

		let body = {};

		if (lead.status === LEAD_STATUS.LEAD_ABSENT_IN_TOOL) {
			body.add = {
				loaderId: loader.current.ids.loader1,
				cadence_id: cadenceSelected.id.toString(),

				[leadType + "s"]: [lead].map(l => {
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
				[leadType + "s"]: [lead].map(l => {
					delete l.error;
					delete l.success;
					return l;
				}),
			};
		}

		addList(body);

		setList(prev => ({
			...prev,
			[leadType]: prev[leadType].map(i => ({ ...i, shown: false })),
		}));
	};

	const resetDropdowns = () => {
		setOptionsDropdown(false);
		setCadencesDropdown(false);
		setErrorDropdown(false);
		setLinkLeadsModal(false);
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

	const TABLE_COLUMNS = [
		<Checkbox
			className={styles.checkBox}
			checked={
				checkedLeads?.length > 0 &&
				checkedLeads?.length === getLeadsExcludingError(list[leadType])?.length &&
				list[leadType]?.length > 0
			}
			onChange={() => {
				if (list[leadType]?.length > 0)
					checkedLeads?.length !== getLeadsExcludingError(list[leadType]).length
						? setCheckedLeads(getLeadsExcludingError(list[leadType]))
						: setCheckedLeads([]);
			}}
			disabled={isAddSuccess || !list[leadType]?.length}
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
				<div>
					<BackButton
						text={"Back to cadence"}
						onClick={() => {
							loader.current.length = 0;
							navigate(`/cadence/${cadence_id}?view=list`);
						}}
					/>
					{!isAdding && !isPreviewing && (
						<Title className={styles.title} size="20px">
							{isAddSuccess ? "Successful imports" : "Import"}
						</Title>
					)}
				</div>

				{!isAddSuccess && !isPreviewing && !importError?.error && !isAdding && (
					<div className={styles.right}>
						<div className={styles.filterView}>
							<FilterView
								leadType={leadType}
								filterView={filterView}
								setFilterView={setFilterView}
								isAddSuccess={isAddSuccess}
								checkedLeads={checkedLeads}
								setLeadType={setLeadType}
								setWarningModal={setWarningModal}
							/>
						</div>
					</div>
				)}
			</div>

			{importError?.error ? (
				<div className={styles.error}>
					<ErrorGradient size="38px" />
					<span className={styles.importFailed}>
						{COMMON_TRANSLATION.IMPORT_FAILED[user?.language?.toUpperCase()]}
					</span>
					<span>{importError?.msg}</span>
					{importError.msg === "Kindly log in with zoho" ? (
						<ThemedButton
							className={styles.btn}
							width="180px"
							onClick={() => navigate("/settings?view=my_connections")}
							theme={ThemedButtonThemes.WHITE}
						>
							Go to profile page
						</ThemedButton>
					) : (
						<CollapseContainer
							className={styles.errorCollapse}
							openByDefault={false}
							title={
								<div className={styles.header2nd}>
									<ZohoBox size={"30px"} /> Zoho error message
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
							<Cadences /> Adding {checkedLeads?.length}{" "}
							{COMMON_TRANSLATION.PEOPLE_IN[user?.language?.toUpperCase()]}{" "}
							{cadenceSelected.name}
						</span>
					)}

					<progress max="100" value={progress}></progress>
				</div>
			) : (
				<>
					{checkedLeads?.length > 0 && (
						<Actions
							cadenceSelected={cadenceSelected}
							setCadenceSelected={setCadenceSelected}
							checkedLeads={checkedLeads}
							setCheckedLeads={setCheckedLeads}
							list={list[leadType]}
							setList={setList}
							resetDropdowns={resetDropdowns}
							loader={loader}
							socket1={socket1}
							socket2={socket2}
							setProgress={setProgress}
							leadType={leadType}
							cadenceImportDataAccess={cadenceImportDataAccess}
							addLeadsBtn={addLeadsBtn}
							showAddLeadsBtn={showAddLeadsBtn}
							setImportSuccessModal={setImportSuccessModal}
							setIsAdding={setIsAdding}
						/>
					)}

					<div
						className={`${styles.body}`}
						style={{ width: !viewMode ? `calc(100%-${sidebarWidth})` : "100%" }}
					>
						<div className={styles.leadsContainer}>
							{list[leadType]?.length > 0 ? (
								<Table
									loading={getLeadListLoading}
									columns={TABLE_COLUMNS}
									noOfRows={9}
									className={styles.table}
									theme={TableThemes.WHITE_AND_LIGHT_PURPLE}
									height={`calc(100vh - ${checkedLeads?.length > 0 ? "180px" : "130px"})`}
								>
									{list[leadType]
										?.filter(item => item.shown === true)
										?.map((lead, index, array) => {
											return (
												<tr
													key={lead.Id}
													// ref={array?.length > 199 ? lastLeadRef : null}
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
																	: setCheckedLeads(prevState => [
																			...prevState,
																			lead?.Id,
																	  ]);
															}}
														/>
													</td>

													<td>{index + 1}</td>

													<td className={styles.name}>
														<div>
															<ZohoBox
																onClick={e =>
																	handleZohoIconClick(lead, e, user, leadType, addError)
																}
																// size={"50px"}
																width="50px"
																height="40px"
															/>
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
															<span
																title={`${lead.first_name ?? ""} ${lead.last_name ?? ""}`}
															>
																{getShortName(
																	`${lead.first_name ?? ""} ${lead.last_name ?? ""}`
																)}
															</span>
														</div>
													</td>

													<td title={lead.Account?.name ?? ""}>
														{lead.Account?.name ?? ""}
													</td>

													<td title={lead.job_position ?? "NA"}>
														{lead.job_position ?? "NA"}
													</td>

													<td
														title={lead?.phone_numbers?.map((ph, index) =>
															ph.type === "Phone"
																? ph.phone_number
																	? ph.phone_number
																	: "NA"
																: null
														)}
													>
														{lead?.phone_numbers?.map((ph, index) =>
															ph.type === "Phone"
																? ph.phone_number
																	? ph.phone_number
																	: "NA"
																: null
														)}
													</td>

													<td
														title={lead?.emails?.map(
															(mail, index) => index === 0 && mail.email_id
														)}
													>
														{lead?.emails?.map(
															(mail, index) => index === 0 && mail.email_id
														)}
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
																		// handleErrorClick({
																		// 	id: lead.Id,
																		// 	error: "User not present in cadence",
																		// 	e: e,
																		// })
																		e.preventDefault();
																		e.stopPropagation();
																		// setErrorModal({
																		// 	type: "default",
																		// 	msg:
																		// 		lead.status === LEAD_STATUS.USER_NOT_PRESENT
																		// 			? "User not present in cadence"
																		// 			: lead.status ?? false,
																		// });

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
															{/* {lead.error && (
														 <ThemedButton
															 onClick={e => {
																 e.preventDefault();
																 e.stopPropagation();
																 // setErrorModal({
																 // 	type: lead?.error?.type ?? "default",
																 // 	msg: lead.error ? lead.error?.msg : lead.status,
																 // });

																 setErrorModal({
																	 type: lead?.error?.type ?? "default",
																	 msg: lead.error
																		 ? lead.error?.msg
																		 : LEAD_ERROR_MSG_MAP[lead.status] ??
																		   lead.status,
																 });
															 }}
															 theme={ThemedButtonThemes.RED}
															 className={styles.cadenceStatus}
															 height="30px"
														 >
															 Error
														 </ThemedButton>
													 )} */}
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
															ref={cadenceRef}
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
														<Tooltip text={"Add to cadence"}>
															<ThemedButton
																className={styles.dotsBtn}
																theme={ThemedButtonThemes.GREY}
																onClick={e => {
																	handleMenuClick(lead.Id, e);
																	lead.status === LEAD_STATUS.LEAD_PRESENT_IN_TOOL
																		? !cadenceSelected.id
																			? addError({ text: "Please select a cadence." })
																			: setLinkLeadsModal(lead)
																		: handleAddToCadence(lead);
																}}
																height="40px"
																width="60px"
																disabled={isAddSuccess || isLeadError(lead)}
															>
																<div>
																	<Cadences />
																</div>
															</ThemedButton>
														</Tooltip>
														{/* <div
												 className={`${styles.dropDownMenu} ${
													 lead.Id === optionsDropdown ? styles.isActive : ""
												 }`}
											 >
												 <Button
													 disabled={isLeadError(lead)}
													 onClick={e => {
														 e.stopPropagation();
														 lead.status === LEAD_STATUS.LEAD_PRESENT_IN_TOOL
															 ? !cadenceSelected.id
																 ? addError("Please select a cadence.")
																 : setLinkLeadsModal(lead)
															 : handleAddToCadence(lead);
													 }}
												 >
													 <Cadences />
													 Add to cadence
												 </Button>

												 <Button
													 onClick={e => {
														 e.stopPropagation();
														 setDeleteModal({
															 name: `${lead.first_name ?? ""} ${
																 lead.last_name ?? ""
															 }`,
															 id: lead.Id,
														 });
													 }}
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
											 </div> */}
													</td>
												</tr>
											);
										})}
								</Table>
							) : (
								<>
									<Table
										columns={TABLE_COLUMNS}
										noOfRows={7}
										className={styles.table}
										theme={TableThemes.WHITE_AND_LIGHT_PURPLE}
										height="auto"
										loading={getLeadListLoading}
									></Table>
									{!getLeadListLoading && (
										<div className={styles.noLeads}>
											<NoTasks />
											<h4>
												{COMMON_TRANSLATION.NO_LEADS_FOUND[user?.language?.toUpperCase()]}
											</h4>
										</div>
									)}
								</>
							)}
						</div>
					</div>
					<LeadDetailsModal
						modal={leadDetailsModal}
						setModal={setLeadDetailsModal}
						leadType={leadType}
					/>

					{/* <DeleteModal
						modal={deleteModal}
						setModal={setDeleteModal}
						item={deleteModal?.name}
						onDelete={handleDelete}
					/> */}

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
						isAddSuccess={isAddSuccess}
						cadenceSelected={cadenceSelected}
					/>
					<WarningModal modal={warningModal} setModal={setWarningModal} />
					<ErrorModal setModal={setErrorModal} modal={errorModal} />
				</>
			)}
		</PageContainer>
	);
};

export default CadenceImport;
