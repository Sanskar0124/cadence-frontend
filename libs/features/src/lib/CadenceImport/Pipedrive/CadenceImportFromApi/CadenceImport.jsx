import React, { useContext, useRef, useState, useEffect } from "react";

import styles from "./CadenceImport.module.scss";
import {
	Button,
	DeleteModal,
	PageContainer,
	Spinner,
	Title,
	Tooltip,
	Div,
} from "@cadence-frontend/components";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSocket, useCadenceImportPipedrive } from "@cadence-frontend/data-access";
import { ENV } from "@cadence-frontend/environments";
import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue } from "recoil";
import { MessageContext } from "@cadence-frontend/contexts";
import { useQuery } from "@cadence-frontend/utils";
import {
	BackButton,
	Checkbox,
	CollapseContainer,
	Table,
	ThemedButton,
} from "@cadence-frontend/widgets";
import { TableThemes, ThemedButtonThemes } from "@cadence-frontend/themes";
import FilterView from "./components/FilterView/FilterView";
import Actions from "./components/Actions/Actions";
import {
	isLeadError,
	isLeadSuccesss,
	LEAD_STATUS,
	LEADTYPE,
	getLeadsExcludingError,
	LEAD_ERROR_MSG_MAP,
} from "../constants";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import {
	CadenceBox,
	Cadences,
	ErrorGradient,
	More,
	NoTasks,
	Pipedrive,
	PipedriveBox,
	Trash,
} from "@cadence-frontend/icons";
import { v4 as uuidv4 } from "uuid";
import LeadDetailsModal from "../CadenceImport/components/LeadDetailsModal/LeadDetailsModal";
import ErrorModal from "../../components/ErrorModal/ErrorModal";
import ImportSuccessModal from "../../components/ImportSuccessModal/ImportSuccessModal";
import LinkLeadsModal from "../../components/LinkLeadsModal/LinkLeadsModal";
import { getPipedriveUrl } from "@cadence-frontend/utils";

const CadenceImport = () => {
	const navigate = useNavigate();
	const [socket1] = useSocket(ENV.BACKEND, "/socket-service/socket");
	const [socket2] = useSocket(ENV.BACKEND, "/socket-service/socket");

	const user = useRecoilValue(userInfo);
	const { addError } = useContext(MessageContext);
	const query = useQuery();
	const cadence_id = query.get("cadence_id");
	const cadence_name = query.get("cadence_name");

	// States
	const [filterView, setFilterView] = useState("");
	const [list, setList] = useState([]);
	const [leadType, setLeadType] = useState(LEADTYPE.PEOPLE);
	const [progress, setProgress] = useState(0);
	const [isAdding, setIsAdding] = useState(false);
	const [checkedLeads, setCheckedLeads] = useState([]);
	const [checkedIssueLead, setCheckedIssueLead] = useState([]);
	const [isModal, setIsModal] = useState(false);

	//dropdowns
	const [optionsDropdown, setOptionsDropdown] = useState(false);
	const [cadencesDropdown, setCadencesDropdown] = useState(false);
	const [errorDropdown, setErrorDropdown] = useState(false);

	const [cadenceSelected, setCadenceSelected] = useState({
		id: parseInt(cadence_id),
		name: cadence_name,
	});

	//modals
	const [deleteModal, setDeleteModal] = useState(false);
	const [linkLeadsModal, setLinkLeadsModal] = useState(false);
	const [leadDetailsModal, setLeadDetailsModal] = useState(null);
	const [importSuccessModal, setImportSuccessModal] = useState(false);
	const [errorModal, setErrorModal] = useState(false);
	const [warningModal, setWarningModal] = useState(false);

	//refs
	const loader = useRef({ ids: { loader1: "", loader2: "" }, length: 0 });
	const loader1 = useRef(0);
	const loader2 = useRef(0);
	const observer = useRef();
	const cadenceRef = useRef(null);

	let moreBtnPressed = false;

	//API
	const cadenceImportDataAccess = useCadenceImportPipedrive({});

	const {
		leads,
		importLoading,
		addLoading,
		importError,
		addList,
		isAddSuccess,
		getFilterViewLead,
		getFilterViewLeadLoading,
		fetchCadenceAssociated,
		cadencesAssociated,
		cadencesAssociatedLoading,
	} = cadenceImportDataAccess;

	useEffect(() => {
		if (filterView) {
			getFilterViewLead(
				{
					type: leadType === LEADTYPE.PEOPLE ? "person" : "",
					id: filterView?.id,
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
	}, [leadType]);

	//handle loader socket function for both loaders that adds both loader values and show it in the progress bar
	const handleImportSocket = (data, id) => {
		if (loader.current.ids.loader1 !== id && loader.current.ids.loader2 !== id) return;
		if (loader.current.ids.loader1 === id) loader1.current = data.index;
		if (loader.current.ids.loader2 === id) loader2.current = data.index;

		let totalProgress =
			((loader1.current + loader2.current) / loader.current.length) * 100;
		setProgress(Math.floor(totalProgress));
	};

	// TABLE COLUMN
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
					checkedLeads?.length !== getLeadsExcludingError(list).length
						? setCheckedLeads(getLeadsExcludingError(list))
						: setCheckedLeads([]);
			}}
			disabled={getLeadsExcludingError(list?.filter(lead => lead.shown))?.length === 0}
		/>,
		"Sno.",
		"Name",
		"Company",
		"Title",
		"Phone",
		"Email",
		"Pipedrive Owner",
		"Status",
		"Action",
	];

	const resetDropdowns = () => {
		setOptionsDropdown(false);
		setCadencesDropdown(false);
		setErrorDropdown(false);
		setLinkLeadsModal(false);
	};

	//funtions
	const handleImportResponse = (data, type) => {
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
					let errorLead = errorLeads.find(errLead => errLead.integration_id === lead.Id);
					let successLead = successLeads.find(
						succLead => succLead.integration_id === lead.Id
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

		setTimeout(() => setProgress(0), 1000);
		setIsAdding(false);
		setImportSuccessModal(prev => ({
			...prev,
			successCount: prev?.successCount ?? 0 + successLeads.length,
			errorCount: prev?.errorCount ?? 0 + errorLeads.length,
			[type]: true,
			show: checkedLeads.length === absent || checkedLeads.length === present,
			cadence_id: cadenceSelected?.id,
		}));
		setCheckedLeads([]);
	};

	const handleCadencesClick = (id = 0, e) => {
		e.stopPropagation();
		resetDropdowns();
		if (id === cadencesDropdown) setCadencesDropdown(false);
		else setCadencesDropdown(id);
	};

	const handleErrorClick = ({ id, error, e }) => {
		e.stopPropagation();
		resetDropdowns();
		if (id === errorDropdown.id) setErrorDropdown(false);
		else setErrorDropdown({ id, error });
	};

	const handleMenuClick = (id, e) => {
		e.stopPropagation();
		resetDropdowns();
		if (id === optionsDropdown) setOptionsDropdown(false);
		else setOptionsDropdown(id);
	};

	const handleDelete = () => {
		setCheckedLeads(prev => prev.filter(lead => lead !== deleteModal.id));
		setList(prev => prev.filter(lead => lead.Id !== deleteModal.id));
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
						lead.status === LEAD_STATUS.LEAD_PRESENT_IN_TOOL
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
				persons: [lead].map(l => {
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
				persons: [lead].map(l => {
					delete l.error;
					delete l.success;
					return l;
				}),
			};
		}
		setList(prev => prev.map(i => ({ ...i, shown: false })));
		addList(body);
	};

	const handleIntegrationIconClick = (e, lead) => {
		e.stopPropagation();
		const url = getPipedriveUrl(lead.Id, user.instance_url);
		if (url) window.open(url, "_blank");
		else addError({ text: "This lead does not have the required info." });
	};

	useEffect(() => {
		if (cadencesDropdown) fetchCadenceAssociated(cadencesDropdown);
	}, [cadencesDropdown]);

	const handleLeadClick = lead => {
		setLeadDetailsModal(lead);
	};

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
					{!isAdding && !importLoading && (
						<Title className={styles.title} size="20px">
							{isAddSuccess ? "Successful imports" : "Import"}
						</Title>
					)}
				</div>

				<div className={styles.right}>
					{!isAdding && !isAddSuccess && (
						<FilterView
							leadType={leadType}
							filterView={filterView}
							setFilterView={setFilterView}
							isAddSuccess={isAddSuccess}
							isAdding={isAdding}
						/>
					)}
				</div>
			</div>

			{importError?.error ? (
				<div className={styles.error}>
					<span>{COMMON_TRANSLATION.IMPORT_FAILED[user?.language?.toUpperCase()]}</span>
					<span>{importError.msg}</span>
				</div>
			) : importLoading || isAdding ? (
				<div className={styles.loading}>
					<span className={styles.text}>
						{importLoading ? "Importing Leads" : `Adding - ${progress}%`}
					</span>
					{isAdding && (
						<span className={styles.cadence}>
							<Cadences />
							Adding {checkedLeads?.length}{" "}
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
							setList={setList}
							cadenceSelected={cadenceSelected}
							setCadenceSelected={setCadenceSelected}
							resetDropdowns={resetDropdowns}
							loader={loader}
							socket1={socket1}
							socket2={socket2}
							setIsAdding={setIsAdding}
							setProgress={setProgress}
							setImportSuccessModal={setImportSuccessModal}
						/>
					)}

					<div className={`${styles.body}`}>
						{list?.length > 0 ? (
							<Table
								loading={getFilterViewLeadLoading}
								columns={TABLE_COLUMNS}
								noOfRows={6}
								className={styles.table}
								theme={TableThemes.WHITE_AND_LIGHT_PURPLE}
								height={`calc(100vh - ${isAddSuccess ? "150px" : "190px"})`}
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
														disabled={isLeadError(lead) || isAddSuccess}
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
														<Pipedrive
															size={30}
															onClick={e => handleIntegrationIconClick(e, lead)}
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
														<span
															className={styles.firstname}
															title={`${lead.first_name ?? ""} ${lead.last_name ?? ""}`}
														>
															{lead.first_name ?? ""} {lead.last_name ?? ""}
														</span>
													</div>
												</td>

												<td title={lead.Account?.name ?? ""}>
													{lead.Account?.name ?? ""}
												</td>
												<td title={lead.job_position ?? ""}>
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
													{lead?.phone_numbers?.filter(
														ph => ph.type === "work" && ph.phone_number
													).length !== 0
														? lead?.phone_numbers
																?.filter(ph => ph.type === "work" && ph.phone_number)
																.map(ph => ph.phone_number + " ")
														: lead?.phone_numbers?.filter(ph => ph.phone_number !== "")
																.length !== 0
														? lead?.phone_numbers?.filter(ph => ph.phone_number !== "")[0]
																.phone_number
														: "NA"}
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
															!lead.error &&
															!lead.success && (
																<ThemedButton
																	onClick={e => handleCadencesClick(lead?.lead_id, e)}
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
																	// 	error: lead.error?.msg,
																	// 	e: e,
																	// });
																	e.preventDefault();
																	e.stopPropagation();
																	setErrorModal({
																		type: "default",
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
														{/* {(lead.error ||
															lead.status === LEAD_STATUS.USER_NOT_PRESENT ||
															lead.status === LEAD_STATUS.COMPANY_NOT_PRESENT ||
															lead.status?.toLowerCase().includes("is required") ||
															lead.status?.toLowerCase().includes("does not exist") ||
															lead.status?.toLowerCase().includes("error")) && (
															<ThemedButton
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
																		msg: lead?.error
																			? LEAD_ERROR_MSG_MAP(lead?.status)
																			: lead.status,
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
													>
														{cadencesAssociatedLoading ? (
															<Placeholder />
														) : cadencesAssociated?.length > 0 ? (
															cadencesAssociated?.map(cadence => (
																<div>{cadence.name}</div>
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
															disabled={isAddSuccess || isLeadError(lead)}
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
															disabled={isLeadError(lead)}
															onClick={e => {
																e.stopPropagation();
																if (!cadenceSelected?.name)
																	return addError({ text: "Please select a cadence" });
																lead.status === LEAD_STATUS.LEAD_PRESENT_IN_TOOL
																	? setLinkLeadsModal(lead)
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
			<ImportSuccessModal
				modal={importSuccessModal}
				setModal={setImportSuccessModal}
				cadenceSelected={cadenceSelected}
			/>
			<ErrorModal modal={errorModal} setModal={setErrorModal} />
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
