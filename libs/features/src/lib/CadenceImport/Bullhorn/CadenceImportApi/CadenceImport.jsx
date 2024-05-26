/* eslint-disable react/jsx-no-useless-fragment */
import {
	PageContainer,
	Spinner,
	Title,
	Tooltip,
	DeleteModal,
	Button,
} from "@cadence-frontend/components";
import styles from "./CadenceImport.module.scss";
import React, { useCallback } from "react";
import {
	BackButton,
	Checkbox,
	CollapseContainer,
	Table,
	Tabs,
	ThemedButton,
} from "@cadence-frontend/widgets";
import {
	TabNavBtnThemes,
	TabNavThemes,
	TableThemes,
	ThemedButtonThemes,
} from "@cadence-frontend/themes";
import {
	DEFAULT_BF_FIELDS_STRUCT,
	LEADTYPE,
	LEAD_STATUS,
	LEAD_TYPE,
	VIEWS,
	VIEW_MODES,
	getLeadsExcludingError,
	getShortName,
	handleBullhornIconClick,
	isLeadError,
	DATA_CATEGORY,
	isLeadSuccesss,
} from "../constants";
import { MessageContext } from "@cadence-frontend/contexts";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";
import { useOutsideClickHandler, useQuery } from "@cadence-frontend/utils";
import { useContext, useEffect, useRef, useState } from "react";

import {
	useBullhornFilter,
	useCadenceImportBullhorn,
	useSocket,
} from "@cadence-frontend/data-access";
import { ENV } from "@cadence-frontend/environments";
import {
	ErrorGradient,
	Sort as SortIcon,
	Bullhorn,
	Cadences,
	CadenceBox,
	NoTasks,
	More,
	Trash,
} from "@cadence-frontend/icons";
import Actions from "./components/Actions/Actions";
import WarningModal from "./components/WarningModal/WarningModal";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import { v4 as uuidv4 } from "uuid";
import Placeholder from "./components/Placeholder/Placeholder";
import Sidebar from "./components/Sidebar/Sidebar";
import LinkLeadsModal from "../../components/LinkLeadsModal/LinkLeadsModal";
import LeadDetailsModal from "../components/LeadDetailsModal/LeadDetailsModal";
import ErrorModal from "../../components/ErrorModal/ErrorModal";
import ImportSuccessModal from "../../components/ImportSuccessModal/ImportSuccessModal";
import FilterView from "./components/FilterView/FilterView";
import { LEAD_INTEGRATION_TYPES } from "@cadence-frontend/constants";

const CadenceImport = () => {
	const navigate = useNavigate();
	const [socket1] = useSocket(ENV.BACKEND, "/socket-service/socket");
	const [socket2] = useSocket(ENV.BACKEND, "/socket-service/socket");

	const user = useRecoilValue(userInfo);
	const { addError } = useContext(MessageContext);
	const query = useQuery();
	const cadence_id = query.get("cadence_id");
	const cadence_name = query.get("cadence_name");

	// states
	const [isAdding, setIsAdding] = useState(false);
	const [progress, setProgress] = useState(0);
	const [leadType, setLeadType] = useState(LEADTYPE.LEAD);
	const [list, setList] = useState({ lead: [], contact: [], candidate: [] });
	const [checkedLeads, setCheckedLeads] = useState([]);
	const [addLeadsBtn, showAddLeadsBtn] = useState(true);
	const [warningModal, setWarningModal] = useState(false);
	const [filterView, setFilterView] = useState("");
	const [cadenceSelected, setCadenceSelected] = useState({
		id: parseInt(cadence_id),
		name: cadence_name,
	});

	//dropdowns
	const [optionsDropdown, setOptionsDropdown] = useState(false);
	const [cadencesDropdown, setCadencesDropdown] = useState(false);
	const [errorDropdown, setErrorDropdown] = useState(false);

	//modals
	const [linkLeadsModal, setLinkLeadsModal] = useState(false);
	const [leadDetailsModal, setLeadDetailsModal] = useState(null);
	const [errorModal, setErrorModal] = useState(false);
	const [importSuccessModal, setImportSuccessModal] = useState({
		successCount: 0,
		errorCount: 0,
	});
	const [deleteModal, setDeleteModal] = useState(false);

	//refs
	const loader = useRef({ ids: { loader1: "", loader2: "" }, length: 0 });
	const loader1 = useRef(0);
	const loader2 = useRef(0);
	const observer = useRef();
	const cadenceRef = useRef(null);
	//Made this ref to access the checkedLeads in the socket event handler
	const checkedLeadsRef = useRef([]);
	const leadTypeRef = useRef(LEADTYPE.LEAD);
	//To count how many results have been fetched from both add and link event handler
	const countRef = useRef(0);

	let moreBtnPressed = false;

	useOutsideClickHandler(cadenceRef, () => setCadencesDropdown(false));

	//API
	const cadenceImportDataAccess = useCadenceImportBullhorn({ type: leadType });
	const {
		leads,
		importLoading,
		addLoading,
		importError,
		addList,
		isAddSuccess,
		getFilterViewLead,
		getFilterViewLeadLoading,
	} = cadenceImportDataAccess;

	useEffect(() => {
		if (filterView) {
			getFilterViewLead(
				{
					type:
						leadType === LEADTYPE.LEAD
							? "Lead"
							: leadType === "contact"
							? "ClientContact"
							: "Candidate",
					query: filterView?.query,
				},
				{
					onSuccess: data => {
						setList(prev => ({
							...prev,
							[leadType]: data?.map(item => ({ ...item, shown: true })),
						}));
						setCheckedLeads(getLeadsExcludingError(data) ?? []);
					},
					onError: err => {
						addError({
							text: err?.response?.data?.msg,
							desc: err?.response?.data?.error,
							cId: err?.response?.data?.correlationId,
						});
						setList(prev => ({
							...prev,
							[leadType]: [],
						}));
						setCheckedLeads([]);
					},
				}
			);
		}
	}, [filterView]);

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

	useEffect(() => {
		checkedLeadsRef.current = checkedLeads;
		leadTypeRef.current = leadType;
	}, [checkedLeads, leadType]);

	// Table column names
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
			disabled={!list[leadType]?.length || isAddSuccess}
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

	// socket function
	const handleImportResponse = data => {
		let errorLeads = [...(data?.element_error || [])];
		let successLeads = [...(data?.element_success || [])];

		//CountRef stores number of results fetched
		countRef.current += errorLeads.length + successLeads.length;
		//checks if the number of responses from socket is equal to the number of checkedLeads(number of leads selected to add or import)
		let showModal = checkedLeadsRef.current.length === countRef.current;

		setList(prev => ({
			...prev,
			[leadTypeRef.current]: prev[leadTypeRef.current]
				.map(lead => {
					let errorLead = errorLeads.find(errLead => errLead?.integration_id === lead.Id);
					let successLead = successLeads.find(
						succLead => succLead?.integration_id === lead.Id
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

	//handle loader socket function for both loaders that adds both loader values and show it in the progress bar
	const handleImportSocket = (data, id) => {
		if (loader.current.ids.loader1 !== id && loader.current.ids.loader2 !== id) return;
		if (loader.current.ids.loader1 === id) loader1.current = data.index;
		if (loader.current.ids.loader2 === id) loader2.current = data.index;

		let totalLeads = isAddSuccess ? loader.current.length : data.size;

		let totalProgress =
			((loader1.current + loader2.current) / loader.current.length) * 100;

		setProgress(Math.floor(totalProgress));
	};

	// // Handle add To cadence a Particular  lead
	const handleAddToCadence = (lead, stopPreviousCadences) => {
		setIsAdding(true);
		loader.current = {
			ids: {
				loader1: uuidv4(),
				loader2: uuidv4(),
			},
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

	// Reset drop downs
	const resetDropdowns = () => {
		setOptionsDropdown(false);
		setCadencesDropdown(false);
		setErrorDropdown(false);
		setLinkLeadsModal(false);
	};
	//  lead details modal
	const handleLeadClick = lead => {
		if (!moreBtnPressed) setLeadDetailsModal(lead);
	};

	// handle to go back setting page
	const handleGoToProfileClick = () => {
		navigate("/settings?view=my_connections");
	};

	// // Delete Lead
	const handleDelete = () => {
		setCheckedLeads(prev => prev.filter(lead => lead !== deleteModal.id));
		setList(prev => ({
			...prev,
			[leadType]: prev[leadType].filter(lead => lead.Id !== deleteModal.id),
		}));
	};

	const handleMenuClick = (id, e) => {
		e.stopPropagation();
		resetDropdowns();
		if (id === optionsDropdown) setOptionsDropdown(false);
		else setOptionsDropdown(id);
	};

	const handleDropdownBtnClick = (event, setModal, value) => {
		event.stopPropagation();

		setModal(value);
		window.onmousedown = e => {
			// if (e.target !== event.target) setModal(null);
			window.onmousedown = null;
		};
	};

	const handleAddToCadenceBtClick = (event, lead) => {
		event.stopPropagation();
		handleAddToCadence(lead);
		window.onmousedown = e => {
			window.onmousedown = null;
		};
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
					name: cad?.Cadences[0].name,
					cadence_id: cad?.cadence_id,
				}));
			setCadencesDropdown({
				id: lead.Id,
				cadences,
			});
		}
	};

	// const handleRoomJoined = () => setRoomJoined(true);

	return (
		<PageContainer className={styles.pageContainer}>
			<div className={styles.header}>
				<div className={styles.left}>
					<BackButton
						text={"Back to cadence"}
						onClick={() =>
							navigate(
								cadenceSelected?.id
									? `/cadence/${cadenceSelected?.id}?view=list`
									: "/home"
							)
						}
					/>
					<Title className={styles.title} size="20px">
						{isAddSuccess ? "Successfully imported" : !isAdding && "Import"}
					</Title>
				</div>

				<div className={styles.right}>
					{!isAdding && (
						<FilterView
							leadType={leadType}
							filterView={filterView}
							setFilterView={setFilterView}
							isAddSuccess={isAddSuccess}
							isAdding={isAdding}
							setLeadType={setLeadType}
							setWarningModal={setWarningModal}
							checkedLeads={checkedLeads}
						/>
					)}
				</div>
			</div>

			{importError?.error ? (
				<div className={styles.error}>
					<ErrorGradient size="38px" />
					<span className={styles.importFailed}>
						{COMMON_TRANSLATION.IMPORT_FAILED[user?.language?.toUpperCase()]}
					</span>
					<span>{importError.msg}</span>
					{importError.msg === "Kindly log in with Bullhorn" ? (
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
								<div className={styles.header2nd}>
									<Bullhorn size={"50px"} /> Bullhorn error message
								</div>
							}
						>
							<div className={styles.sfError}>{importError.bullhornErrorMessage}</div>
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
							setIsAdding={setIsAdding}
							setImportSuccessModal={setImportSuccessModal}
						/>
					)}

					<div className={`${styles.body}`}>
						{list[leadType]?.length ? (
							<Table
								loading={getFilterViewLeadLoading}
								columns={TABLE_COLUMNS}
								noOfRows={6}
								className={styles.table}
								theme={TableThemes.WHITE_AND_LIGHT_PURPLE}
								height={
									isAddSuccess || checkedLeads?.length === 0
										? "calc(100vh - 150px)"
										: "calc(100vh - 192px)"
								}
							>
								{list[leadType]
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
														disabled={
															isLeadError(lead) || isLeadSuccesss(lead) || isAddSuccess
														}
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
														<Bullhorn
															size={40}
															onClick={e =>
																handleBullhornIconClick(lead, e, user, addError, leadType)
															}
														/>

														{lead.success_lead_id && (
															<CadenceBox
																size={30}
																onClick={e => {
																	e.stopPropagation();
																	window.open(`/crm/leads/${lead.success_lead_id}`);
																}}
																style={{ cursor: "pointer" }}
															/>
														)}
														<div
															className={styles.leadName}
															title={`${lead.first_name ?? ""} ${lead.last_name ?? ""}`}
														>
															{getShortName(
																`${lead.first_name ?? ""} ${lead.last_name ?? ""}`
															)}
														</div>
													</div>
												</td>

												<td title={lead.Account?.name ?? ""}>
													{lead.Account?.name ?? "NA"}
												</td>
												<td title={lead.job_position ?? ""}>
													{lead.job_position != "" ? lead?.job_position : "NA"}
												</td>
												<td
													title={lead?.phone_numbers?.map((ph, index) =>
														ph.type === "phone" ? ph.phone_number : ""
													)}
												>
													{/* {lead?.phone_numbers?.map(
											(ph, index) => index === 0 && ph.phone_number ?? "NA"
										)} */}
													{/* {lead?.phone_numbers?.map((ph, index) =>
											index === 0 && ph.phone_number ? ph.phone_number : "NA"
										)} */}
													{lead?.phone_numbers?.map((ph, index) =>
														ph.type === "phone"
															? ph.phone_number
																? ph.phone_number
																: "NA"
															: null
													)}
												</td>
												<td
													title={
														lead?.emails?.map(
															(mail, index) => index === 0 && mail.email_id
														) ?? ""
													}
												>
													{lead?.emails?.map(
														(mail, index) => index === 0 && mail.email_id
													) ?? "NA"}
												</td>
												<td title={`${lead.Owner?.first_name} ${lead?.Owner?.last_name}`}>
													{`${lead.Owner?.first_name ?? ""} ${
														lead?.Owner?.last_name ?? ""
													}` ?? "NA"}
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
															lead.status?.toLowerCase().includes("fields missing") ||
															lead.status?.toLowerCase().includes("does not exist") ||
															lead.status?.toLowerCase().includes("error")) && (
															<ThemedButton
																onClick={e => {
																	e.preventDefault();
																	e.stopPropagation();
																	setErrorModal({
																		type: "default",
																		msg:
																			lead.status === LEAD_STATUS.USER_NOT_PRESENT
																				? "User not present in cadence"
																				: lead.status ?? false,
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
														ref={cadenceRef}
													>
														{cadencesDropdown?.cadences?.length ? (
															cadencesDropdown?.cadences?.map(cadence => (
																<div title={cadence.name} key={cadence.cadence_id}>
																	{cadence.name}
																</div>
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
													{/* <div
														className={`${styles.dropDownMenu} ${styles.errorText} ${
															lead.Id === errorDropdown.id ? styles.isActive : ""
														}`}
													>
														<div>{errorDropdown?.error}</div>
													</div> */}
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
															disabled={isLeadError(lead) || isLeadSuccesss(lead)}
															onClick={event => {
																lead.status === LEAD_STATUS.LEAD_PRESENT_IN_TOOL
																	? !cadenceSelected.id
																		? addError({ text: "Please select a cadence" })
																		: handleDropdownBtnClick(
																				event,
																				setLinkLeadsModal,
																				lead
																		  )
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
																	name: `${lead.first_name ?? ""} ${
																		lead.last_name ?? ""
																	}`,
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
						) : (
							<>
								<Table
									columns={TABLE_COLUMNS}
									noOfRows={6}
									className={styles.table}
									theme={TableThemes.WHITE_AND_LIGHT_PURPLE}
									height="auto"
									loading={getFilterViewLeadLoading}
								></Table>
								{!getFilterViewLeadLoading && (
									<div className={styles.noLeads}>
										<NoTasks />
										<h4>
											{
												COMMON_TRANSLATION.NO_LEADS_FOUND_SELECT_VIEW[
													user?.language?.toUpperCase()
												]
											}
										</h4>
									</div>
								)}
							</>
						)}
					</div>
				</>
			)}

			<LeadDetailsModal
				modal={leadDetailsModal}
				setModal={setLeadDetailsModal}
				type={leadType}
			/>
			<DeleteModal
				modal={deleteModal}
				setModal={setDeleteModal}
				item={deleteModal?.name}
				onDelete={handleDelete}
			/>
			<ErrorModal modal={errorModal} setModal={setErrorModal} />
			<ImportSuccessModal
				modal={importSuccessModal}
				setModal={setImportSuccessModal}
				cadenceSelected={cadenceSelected}
			/>
			<LinkLeadsModal
				modal={linkLeadsModal}
				setModal={setLinkLeadsModal}
				onAdd={stopPreviousCadences => {
					handleAddToCadence(linkLeadsModal, stopPreviousCadences);
					resetDropdowns();
				}}
			/>
			<WarningModal modal={warningModal} setModal={setWarningModal} />
		</PageContainer>
	);
};

export default CadenceImport;
