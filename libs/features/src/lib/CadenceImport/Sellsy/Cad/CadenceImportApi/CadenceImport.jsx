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
	More,
	Trash,
	Sort as SortIcon,
	Sellsy,
	NoTasks,
	// ZohoBox,
	// Zoho,
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
import { base64ToFile, useQuery } from "@cadence-frontend/utils";
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
} from "./constants";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import Actions from "./components/Actions/Actions";
import Sidebar from "./components/Sidebar/Sidebar";
import {
	useCadenceImportSellsy,
	// useCadenceImportZoho,
	useSocket,
	useZohoFilters,
} from "@cadence-frontend/data-access";
import { ENV } from "@cadence-frontend/environments";
import { useCallback } from "react";
import Placeholder from "./components/Placeholder/Placeholder";
import { v4 as uuidv4 } from "uuid";
import LinkLeadsModal from "../../../components/LinkLeadsModal/LinkLeadsModal";
import LeadDetailsModal from "./components/LeadDetailsModal/LeadDetailsModal";

const CadenceImport = () => {
	const navigate = useNavigate();
	const [socket1] = useSocket(ENV.BACKEND, "/socket-service/socket");
	const [socket2] = useSocket(ENV.BACKEND, "/socket-service/socket");
	const user = useRecoilValue(userInfo);
	const { addError } = useContext(MessageContext);
	const query = useQuery();
	const webhook = query.get("webhook");
	const cadence_id = query.get("cadence_id");
	const cadence_name = query.get("cadence_name");
	const [viewMode, setViewMode] = useState("");
	const [list, setList] = useState([]);

	const [searchValue, setSearchValue] = useState("");
	const [sidebarWidth, setSidebarWidth] = useState("0%");

	// const [createFilter, setCreateFilter] = useState([]);
	// const [addFilterBtn, showAddFilterBtn] = useState(false);
	const [checkedLeads, setCheckedLeads] = useState([]);
	const [addToCadenceError, setAddtoCadenceError] = useState("");
	const [addLeadsBtn, showAddLeadsBtn] = useState(true);
	const [zohoUsers, setZohoUsers] = useState([]);
	const [originalSFFields, setOriginalSFFields] = useState(DEFAULT_SF_FIELDS_STRUCT);

	//dropdowns
	const [optionsDropdown, setOptionsDropdown] = useState(false);
	const [cadencesDropdown, setCadencesDropdown] = useState(false);
	const [errorDropdown, setErrorDropdown] = useState(false);

	const [cadenceSelected, setCadenceSelected] = useState({
		id: parseInt(cadence_id),
		name: cadence_name,
	});
	const [progress, setProgress] = useState(0);

	//modals
	const [deleteModal, setDeleteModal] = useState(false);
	const [linkLeadsModal, setLinkLeadsModal] = useState(false);
	const [leadDetailsModal, setLeadDetailsModal] = useState(null);

	//api
	// const { fetchLeadFields, fetchContactZohoFields } = useZohoFilters({ enabled: false });
	const cadenceImportDataAccess = useCadenceImportSellsy({ leads: Boolean(webhook) });
	const {
		addList,
		addLoading,
		isAddSuccess,
		setFilters,
		filters,
		contactData,
		contactLoading,
		getLeadListError,
		fetchNextPage,
		hasNextPage,
		isFetching,
		isFetchingNextPage,
	} = cadenceImportDataAccess;

	useEffect(() => {
		if (contactData) setList(contactData);
	}, [contactData]);

	useEffect(() => {
		getLeadListError && addError({ text: getLeadListError.message });
	}, [getLeadListError]);
	// useEffect(() => {
	// 	fetchZFields();
	// }, []);
	//useEffect to update originalSFFields dep-> 3 fetch APIs
	// const fetchZFields = () => {
	// 	fetchLeadFields(VIEWS.LEAD, {
	// 		onSuccess: sfFieldsFromServer => {
	// 			setOriginalSFFields(prev => ({
	// 				...prev,
	// 				[VIEWS.LEAD]: sfFieldsFromServer
	// 					?.sort((a, b) => a.label?.localeCompare(b.label))
	// 					?.map((field, i) => ({ index: i, ...field })), //will have name, type, picklistVlaues(conditionally)
	// 			}));
	// 		},
	// 		onError: () => addError("Make sure you have signed in with Zoho."),
	// 	});
	// 	fetchContactZohoFields(VIEWS.CONTACT, {
	// 		onSuccess: sfFieldsFromServer => {
	// 			setOriginalSFFields(prev => ({
	// 				...prev,
	// 				[VIEWS.CONTACT]: sfFieldsFromServer
	// 					?.sort((a, b) => a.label?.localeCompare(b.label))
	// 					?.map((field, i) => ({ index: i, ...field })), //will have name, type, picklistVlaues(conditionally)
	// 			}));
	// 		},
	// 	});
	// };

	//refs
	const loader = useRef({ ids: { loader1: "", loader2: "" }, length: 0 });
	const loader1 = useRef(0);
	const loader2 = useRef(0);

	useEffect(() => {
		if (viewMode === VIEW_MODES.FILTER) {
			setSidebarWidth("30%");
		} else if (viewMode === null) {
			setSidebarWidth("0%");
		}
		if (viewMode) resetDropdowns();
	}, [viewMode]);

	//create 2 socket connections for 2 loaders (add, link)
	useEffect(() => {
		socket1.current.on("cadence-import-loader", data =>
			handleImportSocket(data, loader.current.ids.loader1)
		);
		socket2.current.on("cadence-import-loader", data =>
			handleImportSocket(data, loader.current.ids.loader2)
		);
	}, []);

	const onClose = () => {
		setViewMode(null);
	};

	const handleAddToCadence = (lead, stopPreviousCadences) => {
		loader.current = {
			ids: {
				loader1: uuidv4(),
				loader2: uuidv4(),
			},
			length:
				list?.filter(
					lead =>
						checkedLeads.includes(lead.id) &&
						lead.status === LEAD_STATUS.LEAD_ABSENT_IN_TOOL
				).length +
				list?.filter(
					lead =>
						checkedLeads.includes(lead.id) &&
						(lead.status === LEAD_STATUS.LEAD_PRESENT_IN_TOOL ||
							lead.status === LEAD_STATUS.LEAD_INACTIVE)
				).length,
		};
		socket1.current.emit("join-room", loader.current.ids.loader1);
		socket2.current.emit("join-room", loader.current.ids.loader2);
		resetDropdowns();

		if (!cadenceSelected.id) return addError({ text: "Please select a cadence" });
		setCheckedLeads([lead.id]);

		let body = {
			add: {
				loaderId: loader.current.ids.loader1,
				cadence_id: cadenceSelected.id.toString(),

				contacts: [lead].map(l => {
					delete l.error;
					delete l.success;
					return l;
				}),
			},

			link: {
				stopPreviousCadences,
				loaderId: loader.current.ids.loader2,
				cadence_id: cadenceSelected.id.toString(),
				contacts: [lead].map(l => {
					delete l.error;
					delete l.success;
					return l;
				}),
			},
		};

		addList(body, {
			onSuccess: data => {
				setCheckedLeads([]);
				let errorLeads = [
					...(data[0]?.element_error || []),
					...(data[1]?.element_error || []),
				];
				let successLeads = [
					...(data[0]?.element_success || []),
					...(data[1]?.element_success || []),
				];

				const newLeads = [...errorLeads, ...successLeads];

				const leads = list
					?.filter(lead =>
						newLeads.find(errLead =>
							errLead.id ? errLead.id === lead.id : errLead?.integration_id === lead.id
						)
					)
					.map(lead => {
						let errorLead = errorLeads.find(errLead =>
							errLead.id ? errLead.id === lead.id : errLead?.integration_id === lead.id
						);
						let successLead = successLeads.find(succLead =>
							succLead.id ? succLead.id === lead.id : succLead?.integration_id === lead.id
						);
						if (errorLead) return { ...lead, error: { msg: errorLead.msg } };
						return { ...lead, success: true, success_lead_id: successLead.lead_id };
					});
				setList(leads);
			},

			onError: error =>
				addError({
					text: error?.response?.data?.msg || "Some error occured, please try again",
					desc: error?.response?.data?.error ?? "Please contact support",
					cId: error?.response?.data?.correlationId,
				}),
		});
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

	const handleSellsyIconClick = (lead, e) => {
		e.stopPropagation();
		let url = "";
		if (!lead.id) return "";
		url = `https://www.sellsy.com/peoples/${lead.id}`;
		if (url) window.open(url, "_blank");
		else addError({ text: "This lead does not have the required info." });
	};

	const handleCadencesClick = (lead, e) => {
		e.stopPropagation();
		resetDropdowns();
		if (lead.id === cadencesDropdown.id) setCadencesDropdown(false);
		else {
			let cadences = [];
			if (lead.Cadences)
				cadences = lead.Cadences.map(cad => ({
					name: cad.Cadences[0]?.name,
					cadence_id: cad.Cadences[0]?.cadence_id,
				}));
			if (lead.cadences)
				cadences = lead.cadences.map(cad => ({
					name: cad.Cadences[0]?.name,
					cadence_id: cad?.cadence_id,
				}));
			setCadencesDropdown({
				id: lead.id,
				cadences,
			});
		}
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
		const leadList = list?.filter(lead => lead.id !== deleteModal.id);
		setList(leadList);
	};

	const getSearchResult = zohoLeads => {
		if (!searchValue) {
			return zohoLeads;
		} else {
			return zohoLeads?.filter(
				zf =>
					zf.first_name?.toLowerCase().includes(searchValue.trim()?.toLowerCase()) ||
					zf.last_name?.toLowerCase().includes(searchValue.trim()?.toLowerCase())
			);
		}
	};

	const TABLE_COLUMNS = [
		<Checkbox
			className={styles.checkBox}
			checked={
				checkedLeads?.length === getLeadsExcludingError(getSearchResult(list))?.length &&
				list?.length > 0
			}
			onChange={() => {
				if (list?.length > 0)
					checkedLeads?.length !== getLeadsExcludingError(getSearchResult(list))?.length
						? setCheckedLeads(getLeadsExcludingError(getSearchResult(list)))
						: setCheckedLeads([]);
			}}
			disabled={isAddSuccess || !getSearchResult(list)?.length}
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

	const FILTER_TABLE_COLUMNS = [
		<Checkbox
			className={styles.checkBox}
			checked={
				checkedLeads?.length === getLeadsExcludingError(getSearchResult(list))?.length &&
				list?.length > 0
			}
			onChange={() => {
				if (list?.length > 0)
					checkedLeads?.length !== getLeadsExcludingError(getSearchResult(list)).length
						? setCheckedLeads(getLeadsExcludingError(getSearchResult(list)))
						: setCheckedLeads([]);
			}}
			disabled={isAddSuccess || !getSearchResult(list)?.length}
		/>,
		"Sno.",
		"Name",
		"Company",
		"Owner",
		"Status",
		"Action",
	];

	const observer = useRef();

	const lastLeadRef = useCallback(
		cadence => {
			if (isFetchingNextPage || isFetching) return;
			if (observer.current) observer.current.disconnect();
			observer.current = new IntersectionObserver(entries => {
				if (entries[0].isIntersecting && hasNextPage) fetchNextPage();
			});
			if (cadence) observer.current.observe(cadence);
		},
		[isFetchingNextPage, isFetching, hasNextPage]
	);

	const getShortName = name => {
		if (name?.split("")?.length > 15) {
			return name?.split("").slice(0, 12).join("") + "...";
		} else {
			return name;
		}
	};

	const handleLeadClick = lead => {
		setLeadDetailsModal(lead);
	};

	return (
		<PageContainer className={styles.pageContainer}>
			{(addLoading || addToCadenceError) && (
				<BackButton
					onClick={() => {
						sessionStorage.removeItem("api-import-filters");
						navigate(`/cadence/${cadence_id}?view=list`);
					}}
				/>
			)}

			{!addLoading && !addToCadenceError && (
				<div className={styles.header}>
					<div>
						<BackButton
							onClick={() =>
								isAddSuccess
									? window.location.reload(true)
									: (() => {
											sessionStorage.removeItem("api-import-filters");
											navigate(`/cadence/${cadence_id}?view=list`);
									  })()
							}
						/>
						<Title className={styles.title} size="20px">
							Import
						</Title>
					</div>

					<div className={styles.right}>
						<div className={styles.search}>
							<SearchBar value={searchValue} setValue={setSearchValue} />
						</div>

						<div className={styles.filter}>
							<ThemedButton
								onClick={() => {
									setViewMode(viewMode !== VIEW_MODES.FILTER ? VIEW_MODES.FILTER : null);
								}}
								theme={
									viewMode === VIEW_MODES.FILTER || Object.keys(filters)?.length > 0
										? ThemedButtonThemes.ACTIVE
										: ThemedButtonThemes.WHITE
								}
								className={styles.filterBtn}
								disabled={isAddSuccess}
							>
								<SortIcon />{" "}
								<div>
									Filter{" "}
									{Object.keys(filters)?.length
										? `(${Object.keys(filters)?.length})`
										: null}
								</div>
							</ThemedButton>
						</div>
					</div>
				</div>
			)}

			{addToCadenceError ? (
				<div className={styles.error}>
					<ErrorGradient size="38px" />
					<span className={styles.importFailed}>
						{COMMON_TRANSLATION.IMPORT_FAILED[user?.language?.toUpperCase()]}
					</span>
					{/* <span>User does not have access to list</span> */}
					<CollapseContainer
						className={styles.errorCollapse}
						openByDefault={false}
						title={
							<div className={styles.header2nd}>
								<Sellsy color="#00A1E0" size={"60px"} /> Zoho error message
							</div>
						}
					>
						<div className={styles.sfError}>{addToCadenceError}</div>
					</CollapseContainer>
				</div>
			) : addLoading ? (
				<div className={styles.loading}>
					{addLoading ? <Spinner className={styles.spinner} /> : null}

					{addLoading && (
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
					{checkedLeads?.length > 0 && (
						<Actions
							cadenceSelected={cadenceSelected}
							setCadenceSelected={setCadenceSelected}
							checkedLeads={checkedLeads}
							setCheckedLeads={setCheckedLeads}
							list={list}
							setList={setList}
							resetDropdowns={resetDropdowns}
							loader={loader}
							socket1={socket1}
							socket2={socket2}
							setProgress={setProgress}
							cadenceImportDataAccess={cadenceImportDataAccess}
							setAddtoCadenceError={setAddtoCadenceError}
							addLeadsBtn={addLeadsBtn}
							showAddLeadsBtn={showAddLeadsBtn}
						/>
					)}

					<div
						className={`${styles.body}`}
						style={{ width: !viewMode ? `calc(100%-${sidebarWidth})` : "100%" }}
					>
						<div className={styles.leadsContainer}>
							{getSearchResult(list)?.length ? (
								<Table
									loading={contactLoading}
									columns={!viewMode ? TABLE_COLUMNS : FILTER_TABLE_COLUMNS}
									noOfRows={9}
									className={styles.table}
									theme={TableThemes.WHITE_AND_LIGHT_PURPLE}
									height="calc(100vh - 130px)"
									//  header="85vh"
								>
									{getSearchResult(list)?.map((lead, index, array) => {
										const isLastLead = index === array?.length - 1;

										return isLastLead ? (
											<>
												{" "}
												<tr
													key={lead.id}
													ref={array?.length > 9 ? lastLeadRef : null}
													onClick={() => {
														handleLeadClick(lead);
													}}
												>
													<td onClick={e => e.stopPropagation()}>
														<Checkbox
															className={styles.checkBox}
															checked={checkedLeads?.includes(lead.id)}
															disabled={isLeadError(lead) || isAddSuccess}
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
															<Sellsy
																onClick={e => handleSellsyIconClick(lead, e)}
																size="2rem"
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
															<span title={`${lead.first_name} ${lead.last_name}`}>
																{getShortName(`${lead.first_name} ${lead.last_name}`)}
															</span>
														</div>
													</td>

													<td>{lead.account?.name}</td>
													{!viewMode && <td>{lead.job_position ?? "NA"}</td>}
													{!viewMode && (
														<td
															title={lead?.phone_numbers?.map((ph, index) =>
																ph.type === "phone_number"
																	? ph.phone_number
																		? ph.phone_number
																		: "NA"
																	: null
															)}
														>
															{lead?.phone_numbers?.map((ph, index) =>
																ph.type === "phone_number"
																	? ph.phone_number
																		? ph.phone_number
																		: "NA"
																	: null
															)}
														</td>
													)}

													{!viewMode && (
														<td
															title={lead?.emails?.map(
																(mail, index) => index === 0 && mail.email_id
															)}
														>
															{lead?.emails?.map(
																(mail, index) => index === 0 && mail.email_id
															)}
														</td>
													)}
													<td>{lead.owner?.owner_name}</td>

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
															{lead.status === LEAD_STATUS.USER_NOT_PRESENT && (
																<ThemedButton
																	onClick={e =>
																		handleErrorClick({
																			id: lead.id,
																			error: "User not present in cadence",
																			e: e,
																		})
																	}
																	theme={ThemedButtonThemes.RED}
																	className={styles.cadenceStatus}
																	height="30px"
																>
																	Error
																</ThemedButton>
															)}
															{lead.error && (
																<ThemedButton
																	onClick={e =>
																		handleErrorClick({
																			id: lead.id,
																			error: lead.error?.msg,
																			e: e,
																		})
																	}
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
																lead.id === cadencesDropdown.id ? styles.isActive : ""
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
																lead.id === errorDropdown.id ? styles.isActive : ""
															}`}
														>
															<div>{errorDropdown?.error}</div>
														</div>
													</td>

													<td className={styles.actions}>
														<Tooltip
															text={
																COMMON_TRANSLATION.MORE[user?.language?.toUpperCase()]
															}
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
																disabled={isLeadError(lead)}
																onClick={e => {
																	e.stopPropagation();
																	lead.status === LEAD_STATUS.LEAD_PRESENT_IN_TOOL
																		? !cadenceSelected.id
																			? addError({ text: "Please select a cadence." })
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
												{isFetchingNextPage && (
													<Placeholder
														noOfColumns={
															!viewMode
																? TABLE_COLUMNS.length
																: FILTER_TABLE_COLUMNS.length
														}
														noOfRows={1}
													/>
												)}
											</>
										) : (
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
														disabled={isLeadError(lead) || isAddSuccess}
														onChange={() => {
															checkedLeads?.includes(lead.id)
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
														<Sellsy
															onClick={e => handleSellsyIconClick(lead, e)}
															size="2rem"
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
														<span title={`${lead.first_name} ${lead.last_name}`}>
															{getShortName(`${lead.first_name} ${lead.last_name}`)}
														</span>
													</div>
												</td>

												<td>{lead.account?.name}</td>
												{!viewMode && <td>{lead.job_position ?? "NA"}</td>}
												{!viewMode && (
													<td
														title={lead?.phone_numbers?.map((ph, index) =>
															ph.type === "phone_number"
																? ph.phone_number
																	? ph.phone_number
																	: "NA"
																: null
														)}
													>
														{lead?.phone_numbers?.map((ph, index) =>
															ph.type === "phone_number"
																? ph.phone_number
																	? ph.phone_number
																	: "NA"
																: null
														)}
													</td>
												)}
												{!viewMode && (
													<td
														title={lead?.emails?.map(
															(mail, index) => index === 0 && mail.email_id
														)}
													>
														{lead?.emails?.map(
															(mail, index) => index === 0 && mail.email_id
														)}
													</td>
												)}
												<td>{lead.owner?.owner_name}</td>

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

														{lead.status === LEAD_STATUS.USER_NOT_PRESENT && (
															<ThemedButton
																onClick={e =>
																	handleErrorClick({
																		id: lead.id,
																		error: "User not present in cadence",
																		e: e,
																	})
																}
																theme={ThemedButtonThemes.RED}
																className={styles.cadenceStatus}
																height="30px"
															>
																Error
															</ThemedButton>
														)}
														{lead.error && (
															<ThemedButton
																onClick={e =>
																	handleErrorClick({
																		id: lead.id,
																		error: lead.error?.msg,
																		e: e,
																	})
																}
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
															lead.id === cadencesDropdown.id ? styles.isActive : ""
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
															disabled={isLeadError(lead)}
															onClick={e => {
																e.stopPropagation();
																lead.status === LEAD_STATUS.LEAD_PRESENT_IN_TOOL
																	? !cadenceSelected.id
																		? addError({ text: "Please select a cadence" })
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
										);
									})}
								</Table>
							) : (
								<>
									<Table
										columns={!viewMode ? TABLE_COLUMNS : FILTER_TABLE_COLUMNS}
										noOfRows={7}
										className={styles.table}
										theme={TableThemes.WHITE_AND_LIGHT_PURPLE}
										height="auto"
										loading={contactLoading}
									></Table>
									{!contactLoading && (
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

						<div
							style={{
								width: sidebarWidth,
								// display: sidebarWidth === "0%" ? "none" : "initial",
								transition: "0.25s ease-in-out",
								position: "relative",
							}}
						>
							{viewMode && (
								<Sidebar
									viewMode={viewMode}
									setViewMode={setViewMode}
									onClose={onClose}
									filters={filters}
									setFilters={setFilters}
									// createFilter={createFilter}
									// setCreateFilter={setCreateFilter}
									// addFilterBtn={addFilterBtn}
									// showAddFilterBtn={showAddFilterBtn}
									// zohoUsers={zohoUsers}
									// originalSFFields={originalSFFields}
									// setOriginalSFFields={setOriginalSFFields}
								/>
							)}
						</div>
					</div>
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
				</>
			)}
		</PageContainer>
	);
};

export default CadenceImport;
