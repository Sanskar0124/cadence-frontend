import { userInfo } from "@cadence-frontend/atoms";
import {
	Button,
	DeleteModal,
	PageContainer,
	Spinner,
	Title,
	Tooltip,
} from "@cadence-frontend/components";
import { MessageContext } from "@cadence-frontend/contexts";
import { useCadenceImportHubspot, useSocket } from "@cadence-frontend/data-access";
import { ENV } from "@cadence-frontend/environments";
import {
	CadenceBox,
	Cadences,
	ErrorGradient,
	Hubspot,
	More,
	NoTasks,
	Trash,
} from "@cadence-frontend/icons";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import { TableThemes, ThemedButtonThemes } from "@cadence-frontend/themes";
import { getHubspotUrl, useQuery } from "@cadence-frontend/utils";
import { BackButton, Checkbox, Table, ThemedButton } from "@cadence-frontend/widgets";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { v4 as uuidv4 } from "uuid";
import LinkLeadsModal from "../../components/LinkLeadsModal/LinkLeadsModal";
import LeadDetailsModal from "../components/LeadDetailsModal/LeadDetailsModal";
import styles from "./CadenceImport.module.scss";
import Actions from "./components/Actions/Actions";
import {
	getLeadsExcludingError,
	isLeadError,
	isLeadSuccess,
	LEAD_ERROR_MSG_MAP,
	LEAD_STATUS,
} from "./constants";
import ImportSuccessModal from "../../components/ImportSuccessModal/ImportSuccessModal";
import ErrorModal from "../../components/ErrorModal/ErrorModal";
import FilterView from "./components/FilterView/FilterView";

const CadenceImport = () => {
	const navigate = useNavigate();
	const user = useRecoilValue(userInfo);
	const { addError, addSuccess } = useContext(MessageContext);
	const [socket1] = useSocket(ENV.BACKEND, "/socket-service/socket");
	const [socket2] = useSocket(ENV.BACKEND, "/socket-service/socket");
	const query = useQuery();
	const webhook = query.get("webhook");
	const importFrom = query.get("import");
	const cadence_id = query.get("cadence_id");
	const cadence_name = query.get("cadence_name");

	//refs
	const loader = useRef({ ids: { loader1: "", loader2: "" }, length: 0 });
	const loader1 = useRef(0);
	const loader2 = useRef(0);

	//dropdowns
	const [optionsDropdown, setOptionsDropdown] = useState(false);
	const [cadencesDropdown, setCadencesDropdown] = useState({ lead_id: "", cadences: "" });
	const [errorDropdown, setErrorDropdown] = useState(false);
	//states
	const [list, setList] = useState([]);
	const [checkedLeads, setCheckedLeads] = useState([]);
	const [cadenceSelected, setCadenceSelected] = useState({ id: "", name: "" });
	const [progress, setProgress] = useState(0);
	const [isAdding, setIsAdding] = useState(false);
	const [filterView, setFilterView] = useState("");
	//modals
	const [deleteModal, setDeleteModal] = useState(false);
	const [linkLeadsModal, setLinkLeadsModal] = useState(false);
	const [leadDetailsModal, setLeadDetailsModal] = useState(null);
	const [importSuccessModal, setImportSuccessModal] = useState({
		successCount: 0,
		errorCount: 0,
	});
	const [errorModal, setErrorModal] = useState(false);
	//api

	const cadenceImportDataAccess = useCadenceImportHubspot({ webhook }, { leads: false });

	const {
		importLoading,
		importError,
		addList,
		deleteLoading,
		isAddSuccess,

		//filter view
		getFilterViewContact,
		getFilterViewContactLoading,
	} = cadenceImportDataAccess;

	//funtions
	const handleImportResponse = (data, typeOfAction) => {
		let absent = list.filter(
			item =>
				checkedLeads.includes(item.id) && item.status === LEAD_STATUS.LEAD_ABSENT_IN_TOOL
		).length;
		let present = list.filter(
			item =>
				checkedLeads.includes(item.id) && item.status === LEAD_STATUS.LEAD_PRESENT_IN_TOOL
		).length;
		let errorLeads = [...(data?.element_error || [])];
		let successLeads = [...(data?.element_success || [])];

		setList(prev =>
			prev
				.map(lead => {
					let errorLead = errorLeads.find(errLead =>
						errLead.integration_id
							? errLead.integration_id === lead.id
							: errLead.id === lead.id
					);
					let successLead = successLeads.find(succLead =>
						succLead.integration_id
							? succLead.integration_id === lead.id
							: succLead.id === lead.id
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

		setTimeout(() => setProgress(0), 1000);
		setIsAdding(false);
		setImportSuccessModal(prev => ({
			...prev,
			successCount: prev?.successCount + successLeads?.length,
			errorCount: prev.errorCount + errorLeads.length,
			[typeOfAction]: true,
			show: checkedLeads.length === absent || checkedLeads.length === present,
			cadence_id,
		}));
		setCheckedLeads([]);
	};
	const handleCadencesClick = (lead, e) => {
		e.stopPropagation();
		resetDropdowns();
		if (lead.lead_id === cadencesDropdown.lead_id)
			setCadencesDropdown({ lead_id: "", cadences: "" });
		else setCadencesDropdown({ lead_id: lead.lead_id, cadences: lead.cadences });
	};

	const handleMenuClick = (id, e) => {
		e.stopPropagation();
		resetDropdowns();
		if (id === optionsDropdown) setOptionsDropdown(false);
		else setOptionsDropdown(id);
	};

	const handleDelete = () => {
		resetDropdowns();
		setList(prev => prev.filter(lead => lead.id !== deleteModal.id));
		setCheckedLeads(prev => prev.filter(lead => lead !== deleteModal.id));
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
						checkedLeads.includes(lead.id) &&
						lead.status === LEAD_STATUS.LEAD_ABSENT_IN_TOOL
				).length +
				list.filter(
					lead =>
						checkedLeads.includes(lead.id) &&
						lead.status === LEAD_STATUS.LEAD_PRESENT_IN_TOOL
				).length,
		};
		socket1.current.emit("join-room", loader.current.ids.loader1);
		socket2.current.emit("join-room", loader.current.ids.loader2);
		resetDropdowns();
		if (!cadenceSelected.id) return addError({ text: "Please select a cadence" });
		setCheckedLeads([lead.id]);
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
		if (lead.status === LEAD_STATUS.LEAD_PRESENT_IN_TOOL) {
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
		setCadencesDropdown({ lead_id: "", cadences: "" });
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
		if (webhook && filterView) {
			getFilterViewContact(
				{
					type: "list",
					id: filterView?.listId,
				},
				{
					onSuccess: data => {
						setList(data?.map(item => ({ ...item, shown: true })));
						setCheckedLeads(getLeadsExcludingError(data));
					},
					onError: err => {
						addError({
							text: err?.response?.data?.msg,
							desc: err?.response?.data?.error,
							cId: err?.response?.data?.correlationId,
						});
						setList([]);
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
		socket1.current.on("cadence-import-response", data =>
			handleImportResponse(data, "add")
		);
		socket2.current.on("cadence-import-loader", data =>
			handleImportSocket(data, loader.current.ids.loader2)
		);
		socket2.current.on("cadence-import-response", data =>
			handleImportResponse(data, "link")
		);
	}, []);

	useEffect(() => {
		if (cadence_id && cadence_name)
			setCadenceSelected({ id: cadence_id, name: cadence_name });
	}, []);

	const handleHubspotIconClick = (e, lead) => {
		e.stopPropagation();
		let url = "";
		if (user?.company_integration_id && lead?.id) {
			url = `https://app.hubspot.com/contacts/${user?.company_integration_id}/contact/${lead?.id}`;
		} else url = "";

		if (url) window.open(url, "_blank");
		else addError({ text: "This lead does not have the required info." });
	};

	//constants

	const TABLE_COLUMNS = [
		<Checkbox
			className={styles.checkBox}
			checked={
				checkedLeads?.length > 0 &&
				checkedLeads?.length === getLeadsExcludingError(list)?.length &&
				list?.length > 0
			}
			onChange={() => {
				if (list?.length > 0)
					checkedLeads?.length !==
					getLeadsExcludingError(list?.filter(lead => lead.shown)).length
						? setCheckedLeads(getLeadsExcludingError(list))
						: setCheckedLeads([]);
			}}
			disabled={
				getLeadsExcludingError(list?.filter(lead => lead.shown))?.length === 0 ||
				isAddSuccess
			}
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
				<div className={styles.left}>
					<BackButton
						onClick={() => {
							sessionStorage.clear();
							cadence_id
								? navigate(`/cadence/${cadence_id}?view=list`)
								: navigate("/cadence");
						}}
					/>

					{!isAdding && !importLoading && (
						<Title className={styles.title} size="20px">
							{isAddSuccess ? "Successful imports" : "Import"}
						</Title>
					)}
				</div>

				{!isAdding && !importLoading && !isAddSuccess && (
					<FilterView
						leadType={"contacts"}
						filterView={filterView}
						setFilterView={setFilterView}
						isAddSuccess={isAddSuccess}
					/>
				)}
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
						{importLoading ? "Importing Leads" : `Adding - ${progress ?? 0}%`}
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
							cadenceImportDataAccess={cadenceImportDataAccess}
							checkedLeads={checkedLeads}
							setCheckedLeads={setCheckedLeads}
							list={list}
							importFrom={importFrom}
							setList={setList}
							setIsAdding={setIsAdding}
							cadenceSelected={cadenceSelected}
							setCadenceSelected={setCadenceSelected}
							resetDropdowns={resetDropdowns}
							loader={loader}
							socket1={socket1}
							socket2={socket2}
							setProgress={setProgress}
							setImportSuccessModal={setImportSuccessModal}
						/>
					)}

					{
						<div className={`${webhook ? styles.body : ""}`}>
							{list?.length ? (
								<Table
									loading={getFilterViewContactLoading}
									columns={TABLE_COLUMNS}
									noOfRows={6}
									className={styles.table}
									theme={TableThemes.WHITE_AND_LIGHT_PURPLE}
									// height={`calc(100vh - "230px")`}
									height={`calc(100vh - ${
										importFrom === "csv" ? "230px" : isAddSuccess ? "150px" : "190px"
									})`}
								>
									{list
										?.filter(item => item.shown === true)
										?.map((lead, index) => (
											<tr
												key={lead.id}
												onClick={() => {
													handleLeadClick(lead);
												}}
											>
												<td onClick={e => e.stopPropagation()}>
													<Checkbox
														className={styles.checkBox}
														checked={checkedLeads?.includes(lead.id)}
														disabled={
															isLeadError(lead) || isLeadSuccess(lead) || isAddSuccess
														}
														onChange={() => {
															checkedLeads.includes(lead.id)
																? setCheckedLeads(prevState =>
																		prevState.filter(item => item !== lead.id)
																  )
																: setCheckedLeads(prevState => [...prevState, lead.id]);
														}}
													/>
												</td>
												<td>{index + 1}</td>
												<td className={styles.name}>
													<div>
														<Hubspot
															size="2rem"
															onClick={e => handleHubspotIconClick(e, lead)}
														/>
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
														<div
															title={`${lead.first_name ?? ""} ${lead.last_name ?? ""}`}
														>
															{lead.first_name ?? ""} {lead.last_name ?? ""}
														</div>
													</div>
												</td>
												<td>
													<div title={lead.company_name ?? lead.Account?.name ?? ""}>
														{lead.company_name ?? lead.Account?.name ?? ""}{" "}
													</div>
												</td>
												<td>
													<div title={lead.job_position ?? "NA"}>
														{lead.job_position ?? "NA"}
													</div>
												</td>

												<td>
													<div
														title={lead?.phone_numbers?.map((ph, index) =>
															ph.type === "phone"
																? ph.phone_number
																	? ph.phone_number
																	: "NA"
																: null
														)}
													>
														{lead?.phone_numbers?.map((ph, index) =>
															ph.type === "phone"
																? ph.phone_number
																	? ph.phone_number
																	: "NA"
																: null
														)}
													</div>
												</td>
												<td>
													<div
														title={lead.emails?.find(em => em.email_id)?.email_id ?? "NA"}
													>
														{lead.emails?.find(em => em.email_id)?.email_id ?? "NA"}
													</div>
												</td>
												<td>
													<div
														title={
															lead.owner?.first_name
																? `${lead.owner?.first_name ?? ""} ${
																		lead.owner?.last_name ?? ""
																  }`
																: lead.owner ?? "NA"
														}
													>
														{lead.owner?.first_name
															? `${lead.owner?.first_name ?? ""} ${
																	lead.owner?.last_name ?? ""
															  }`
															: lead.owner ?? "NA"}
													</div>
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
																		type: lead?.error?.type ?? "default",
																		msg:
																			lead?.error?.msg ?? LEAD_ERROR_MSG_MAP[lead.status],
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
															lead.lead_id === cadencesDropdown?.lead_id
																? styles.isActive
																: ""
														}`}
													>
														{cadencesDropdown?.cadences?.length ? (
															cadencesDropdown?.cadences?.map(cadence => (
																<div>{cadence.Cadences[0]?.name}</div>
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
														className={`${styles.dropDownMenu} ${styles.cadences} ${
															lead.id === errorDropdown.id ? styles.isActive : ""
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
															onClick={e => handleMenuClick(lead.id, e)}
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
															lead.id === optionsDropdown ? styles.isActive : ""
														}`}
													>
														<Button
															disabled={isLeadError(lead) || !cadenceSelected?.id}
															onClick={e => {
																e.stopPropagation();
																lead.status === LEAD_STATUS.LEAD_PRESENT_IN_TOOL
																	? setLinkLeadsModal(lead)
																	: handleAddToCadence(lead);
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
																e.stopPropagation();
																setDeleteModal({
																	name: `${lead.first_name ?? ""} ${
																		lead.last_name ?? ""
																	}`,
																	id: lead.id,
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
													</div>
												</td>
											</tr>
										))}
								</Table>
							) : webhook ? (
								<>
									<Table
										columns={TABLE_COLUMNS}
										noOfRows={6}
										className={styles.table}
										theme={TableThemes.WHITE_AND_LIGHT_PURPLE}
										height="auto"
										loading={getFilterViewContactLoading}
									></Table>
									{!getFilterViewContactLoading && (
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
							) : null}
						</div>
					}
					<LeadDetailsModal modal={leadDetailsModal} setModal={setLeadDetailsModal} />
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
				</>
			)}
		</PageContainer>
	);
};

export default CadenceImport;
