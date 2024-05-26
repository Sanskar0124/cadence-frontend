import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import moment from "moment-timezone";

import {
	Div,
	Title,
	Button,
	Tooltip,
	ActionModal,
	ErrorBoundary,
} from "@cadence-frontend/components";
import {
	TabNavSlider,
	SearchBar,
	BackButton,
	ThemedButton,
	DropDown,
	GlobalModals,
} from "@cadence-frontend/widgets";
import {
	TabNavThemes,
	ThemedButtonThemes,
	TooltipThemes,
} from "@cadence-frontend/themes";
import {
	Edit,
	Statistics as StatisticsIcon,
	Sort as SortIcon,
	CopyBlank,
	Description,
	Download,
	Refresh,
	Link,
	Settings,
	Share,
	Trash,
	Copy,
	More,
	Play,
	Pause,
	ColumnMapping,
	SalesforceBox,
	Excel,
	GoogleSheets,
	PlusOutline,
	Star,
} from "@cadence-frontend/icons";
import {
	useCadenceSettings,
	useCadenceLeadsStats,
	useCadenceImportGoogleSheets,
	useCadence,
	useCadenceWorkflows,
	useWorkflows,
	useUser,
	useProductTour,
} from "@cadence-frontend/data-access";

import List from "./components/List/List";
import Steps from "./components/Steps/Steps";
import { crmRedirectionURL, getTabOptions, getTotalDurationOfCadence } from "./utils";
import { isActionPermitted, isMoreOptionsEnabled } from "../utils";

import {
	CADENCE_INTEGRATION_TYPE,
	CADENCE_STATUS,
	CADENCE_TYPES,
	GLOBAL_MODAL_TYPES,
	INTEGRATION_TYPE,
	PRODUCT_TOUR_STATUS,
	ROLES,
} from "@cadence-frontend/constants";
import {
	TABS,
	LIST_DROPDOWN_VALUES,
	VIEW_MODES,
	FILTERVIEW_AVAILABILITY,
} from "./constants";
import { ACTIONS } from "../constants";

import styles from "./CadenceView.module.scss";
import { useRecoilState, useRecoilValue } from "recoil";
import { tourInfo, userInfo } from "@cadence-frontend/atoms";
import { Cadence as CADENCE_TRANSLATION } from "@cadence-frontend/languages";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import {
	Templates as TEMPLATES_TRANSLATION,
	Salesforce as SALESFORCE_TRANSLATION,
} from "@cadence-frontend/languages";
import {
	Colors,
	TRIGGER_NAMES,
	getGoogleSheetUrl,
	capitalize,
	getIntegrationIcon,
	useQuery,
} from "@cadence-frontend/utils";
import { MessageContext } from "@cadence-frontend/contexts";
import ImportCsvModal from "./components/components/LeadsList/components/ImportCsvModal/ImportCsvModal";
import ImportSheetModal from "./components/components/LeadsList/components/ImportSheetModal/ImportSheetModal";
import { useQueryClient } from "react-query";
import DuplicateCadenceModal from "../components/DuplicateCadenceModal/DuplicateCadenceModal";
import ShareCadenceModal from "../components/ShareCadenceModal/ShareCadenceModal";
import { DeleteModal } from "@cadence-frontend/components";
import SettingsModal from "../components/SettingsModal/SettingsModal";
import { CSV_IMPORT_AVAILABLE } from "./components/components/LeadsList/constants";
import Workflow from "./components/Workflow/Workflow";
import CadenceGropuUserModal from "./components/CadenceGroupUsersModal/CadenceGropuUserModal";

const CadenceView = () => {
	let { id: cadence_id } = useParams();
	const query = useQuery();
	const searchQuery = query.get("search");
	cadence_id = parseInt(cadence_id);
	const queryClient = useQueryClient();
	const navigate = useNavigate();
	const { addError, addSuccess, addWarning } = useContext(MessageContext);
	const [tour, setTour] = useRecoilState(tourInfo);

	const cadenceSettingsDataAccess = useCadenceSettings(
		{
			cadence: true,
			stepsStats: true,
		},
		cadence_id
	);
	const { cadence, cadenceLoading, getGroupInfo, groupInfoLoading } =
		cadenceSettingsDataAccess;

	const cadenceDataAccess = useCadence(false);
	const {
		launchCadence,
		pauseCadence,
		deleteCadence,
		actionLoading,
		updateFavorite,
		deleteCadenceLoading,
	} = cadenceDataAccess;

	const { launchProductTourCadence, launchProductTourCadenceLoading } = useProductTour();

	const { cadenceLeadsStats } = useCadenceLeadsStats({ cadenceId: cadence_id });
	const { resyncSheet, resyncLoading } = useCadenceImportGoogleSheets({ enabled: false });
	const user = useRecoilValue(userInfo);
	const { user: userDetails, updateUser } = useUser({ user: true });
	const [viewMode, setViewMode] = useState(null);
	const [actionModal, setActionModal] = useState(false);
	const [duplicateCadenceModal, setDuplicateCadenceModal] = useState(null);
	const [shareCadenceModal, setShareCadenceModal] = useState(null);
	const [settingsModal, setSettingsModal] = useState(null);
	const [deleteModal, setDeleteModal] = useState(false);
	const [sidebarWidth, setSidebarWidth] = useState("0%");

	const [filtersCount, setFiltersCount] = useState(0);
	const [activeTab, setActiveTab] = useState(TABS.STEPS);
	const [searchValue, setSearchValue] = useState("");
	const [search, setSearch] = useState("");
	const [importCsvModal, setImportCsvModal] = useState(false);
	const [importSheetModal, setImportSheetModal] = useState(false);
	const [showExpirationModal, setShowExpirationModal] = useState(false);
	const [workflows, setWorkflows] = useState([]);
	const [activeWorkflow, setActiveWorkflow] = useState("");
	const [favorite, setFavorite] = useState(null);
	const [groupInfo, setGroupInfo] = useState({
		groupName: "",
		managers: [],
		members: [],
		cadenceType: "",
	});
	const [groupUsersModal, setGroupUsersModal] = useState(false);
	const [leadsData, setLeadsData] = useState([]);
	const [showReassignment, setShowReassignment] = useState(false);

	const { fetchCadenceWorkflows, cadenceWorkflowsLoading } = useCadenceWorkflows({
		cadence_id,
	});

	useEffect(() => {
		setWorkflows(
			fetchCadenceWorkflows?.map((item, index) => {
				const wflow = {
					...item,
					id: index + 1,
					index: index + 1,
				};
				if (wflow?.trigger === TRIGGER_NAMES.WHEN_CALL_DURATION_IS_GREATER_THAN) {
					if (wflow?.metadata) {
						const callDuration = wflow.metadata.trigger_call_duration;
						wflow.metadata = {
							value: callDuration
								? callDuration % 60 === 0
									? callDuration / 60
									: callDuration
								: 0,
							unit: callDuration
								? callDuration % 60 === 0
									? "min"
									: "second"
								: "second",
						};
					} else {
						wflow.metadata = {
							value: 0,
							unit: "second",
						};
					}
				}
				return wflow;
			}) ?? []
		);
	}, [fetchCadenceWorkflows]);

	const renderComponent = () => {
		switch (activeTab) {
			case TABS.LIST:
				return (
					<List
						viewMode={viewMode}
						cadenceid={cadence_id}
						setViewMode={setViewMode}
						searchValue={searchValue}
						filtersCount={filtersCount}
						setFiltersCount={setFiltersCount}
						showReassignment={showReassignment}
						setShowReassignment={setShowReassignment}
						cadenceSettingsDataAccess={cadenceSettingsDataAccess}
						user={user}
						cadenceLeadsStats={cadenceLeadsStats}
						activeTab={activeTab}
						setLeadsData={setLeadsData}
					/>
				);
			case TABS.STEPS:
				return (
					<Steps
						cadenceSettingsDataAccess={cadenceSettingsDataAccess}
						viewMode={viewMode}
						setViewMode={setViewMode}
						user={user}
						activeTab={activeTab}
					/>
				);
			case TABS.WORKFLOW:
				return (
					<Workflow
						viewMode={viewMode}
						setViewMode={setViewMode}
						user={user}
						activeTab={activeTab}
						sidebarWidth={sidebarWidth}
						setSidebarWidth={setSidebarWidth}
						cadence_id={cadence_id}
						workflows={workflows}
						setWorkflows={setWorkflows}
						cadenceWorkflowsLoading={cadenceWorkflowsLoading}
						activeWorkflow={activeWorkflow}
						setActiveWorkflow={setActiveWorkflow}
						addNewWorkflow={addNewWorkflow}
						cadence={cadence}
					/>
				);
			default:
				return (
					<Steps
						cadenceSettingsDataAccess={cadenceSettingsDataAccess}
						viewMode={viewMode}
						setViewMode={setViewMode}
						user={user}
						activeTab={activeTab}
					/>
				);
		}
	};

	// This useEffect is used when route contains search value
	useEffect(() => {
		if (searchQuery) setSearch(searchQuery);
	}, []);

	useEffect(() => {
		if (!search) setSearchValue("");
	}, [search]);

	const IntegrationIcon = getIntegrationIcon({
		integration_type: user?.integration_type,
		box: true,
	});

	const isIntegrationTokenExpired = () => {
		return userDetails?.Integration_Token?.is_logged_out ?? true;
	};

	const handleSearch = () => {
		setSearchValue(search);
	};

	const handleLaunchProductCadence = () => {
		launchProductTourCadence(cadence_id, {
			onError: err => {
				addError({
					text: err.response?.data?.msg || "Error while launching cadence",
					desc: err?.response?.data?.error,
					cId: err?.response?.data?.correlationId,
				});
				setTour(prev => ({
					...prev,
					isError: true,
					currentStepCompleted: false,
				}));
			},
			onSuccess: res => {
				addSuccess(res.msg);
				let NEW_STEP =
					tour?.steps_order[tour?.steps_order.indexOf(tour?.currentStep) + 1];
				updateUser(
					{
						product_tour_step: {
							step: NEW_STEP,
							url: `${window.location.pathname}${window.location.search}${window.location.hash}`,
						},
					},
					{
						onSuccess: () =>
							setTour(prev => ({
								...prev,
								currentStep: NEW_STEP,
								currentUrl: `${window.location.pathname}${window.location.search}${window.location.hash}`,
								currentStepCompleted: false,
							})),
						onError: () =>
							setTour(prev => ({
								...prev,
								isError: true,
								currentStepCompleted: false,
							})),
					}
				);
			},
		});
	};

	const handleCadenceResume = () => {
		launchCadence(cadence_id, {
			onError: err => {
				addError({
					text: err.response?.data?.msg || "Error while launching cadence",
					desc: err?.response?.data?.error,
					cId: err?.response?.data?.correlationId,
				});
			},
			onSuccess: res => addSuccess(res.msg),
		});
	};

	const handleCadencePause = () => {
		pauseCadence(
			{ cadence_id },
			{
				onError: err =>
					addError({
						text: err.response?.data?.msg || "Error while pausing cadence",
						desc: err?.response?.data?.error,
						cId: err?.response?.data?.correlationId,
					}),
				onSuccess: res => addSuccess(res.msg),
			}
		);
	};

	const handleCadenceDelete = () => {
		deleteCadence(deleteModal, {
			onError: err =>
				addError({
					text: err?.response?.data?.msg,
					desc: err?.response?.data?.error,
					cId: err?.response?.data?.correlationId,
				}),
			onSuccess: () => navigate("/cadence"),
		});
	};

	const handleCadenceAction = () => {
		if (
			actionModal.buttonText ===
				`${COMMON_TRANSLATION.LAUNCH[user?.language.toUpperCase()]}` ||
			actionModal.buttonText ===
				`${COMMON_TRANSLATION.RESUME[user?.language.toUpperCase()]}`
		)
			handleCadenceResume();
		if (
			actionModal.buttonText ===
			`${COMMON_TRANSLATION.PAUSE[user?.language.toUpperCase()]}`
		)
			handleCadencePause();
	};

	const handleDeleteModalClose = () => setDeleteModal(false);

	const handleDuplicateClick = (e, cadence) => {
		e.stopPropagation();
		setDuplicateCadenceModal(cadence);
	};

	const handleShareClick = (e, cadence) => {
		e.stopPropagation();
		setShareCadenceModal(cadence);
	};

	const handleDeleteClick = (e, cadence) => {
		e.stopPropagation();
		setDeleteModal(cadence);
	};
	const handleSettingsClick = (e, cadence) => {
		e.stopPropagation();
		setSettingsModal(cadence);
	};

	const handleSheetsLinkClick = () => {
		const URL = getGoogleSheetUrl(cadence?.salesforce_cadence_id);
		if (URL) window.open(URL, "_blank");
		else addError({ text: "This lead does not have the required info." });
	};

	const onResyncSheet = () =>
		resyncSheet(
			{ cadence_id },
			{
				onSuccess: res => {
					addWarning("Resync is in progress, Please check after sometime");
					queryClient.invalidateQueries(["cadence", cadence_id]);
				},
				onError: err =>
					addError({
						text: err.response?.data?.msg || "Error occured while resyncing",
						desc: err?.response?.data?.error,
						cId: err?.response?.data?.correlationId,
					}),
			}
		);

	const onRemap = () => {
		sessionStorage.setItem(`csv_field_map`, JSON.stringify(cadence?.field_map));
		sessionStorage.setItem(
			"sheet_url",
			getGoogleSheetUrl(cadence?.salesforce_cadence_id)
		);
		let importUrl = `/import-csv?type=sheets&cadence_id=${cadence?.cadence_id}&cadence_name=${cadence?.name}&edit=true`;
		navigate(importUrl);
	};

	const addNewWorkflow = () => {
		setSidebarWidth("66%");
		setWorkflows(prev =>
			[
				...prev,
				{
					cadence_id: cadence_id,
					name: "",
					trigger: "",
					metadata: {},
					actions: {},
					allow_edit: false,
				},
			]?.map((item, index) => ({ ...item, id: index + 1, index: index + 1 }))
		);
		setViewMode(VIEW_MODES.CADENCE_WORKFLOW);
	};

	useEffect(() => {
		if (workflows?.length !== fetchCadenceWorkflows?.length)
			setActiveWorkflow(workflows.slice(-1)[0]?.id);
	}, [workflows]);

	const handleFavouriteClick = fav => {
		setFavorite(!fav);
		updateFavorite(
			{ cadence_id: cadence?.cadence_id, favorite: !fav ? 1 : 0 },
			{
				onSuccess: () => addSuccess("Updated cadence"),
				onError: err => {
					addError({
						text: err?.response?.data?.msg,
						desc: err?.response?.data?.error,
						cId: err?.response?.data?.correlationId,
					});
					setFavorite(fav);
				},
			}
		);
	};

	useEffect(() => {
		setFavorite(cadence?.favorite);

		if (
			cadence?.type === CADENCE_TYPES.TEAM ||
			cadence?.type === CADENCE_TYPES.PERSONAL ||
			cadence?.type === CADENCE_TYPES.COMPANY
		) {
			getGroupInfo(cadence?.cadence_id, {
				onSuccess: data => {
					setGroupInfo(prev => ({
						...prev,
						cadenceType: cadence?.type,
						owner: data?.owner,
						groupName: data?.sub_department?.name,
						managers: data?.users.filter(
							user =>
								user.role === ROLES.SUPER_ADMIN ||
								user.role === ROLES.ADMIN ||
								user.role === ROLES.SALES_MANAGER
						),
						members: data?.users.filter(
							user =>
								user.role !== ROLES.SUPER_ADMIN &&
								user.role !== ROLES.ADMIN &&
								user.role !== ROLES.SALES_MANAGER
						),
					}));
				},
				onError: error => {
					console.log(error);
				},
			});
		}
	}, [cadence]);

	useEffect(() => {
		setShowReassignment(false);
	}, [activeTab]);

	return (
		<div className={styles.cadenceView}>
			<ErrorBoundary>
				<div className={styles.header}>
					<div className={styles.left}>
						<BackButton
							text={CADENCE_TRANSLATION.CADENCE_LIST[user?.language?.toUpperCase()]}
							link="/cadence"
							disabled={actionLoading}
						/>
						<Div loading={cadenceLoading} className={styles.heading}>
							<Star
								color={favorite ? "#FFB12A" : Colors.disabled}
								size="1.2rem"
								onClick={e => {
									e.stopPropagation();
									handleFavouriteClick(favorite);
								}}
								style={{ cursor: "pointer" }}
								disabled={
									!isActionPermitted(
										ACTIONS.UPDATE,
										cadence?.type,
										user?.role,
										user?.user_id === cadence?.user_id
									)
								}
							/>
							<Title size="1.5rem" className={styles.name} title={cadence?.name}>
								{cadence?.name}
							</Title>{" "}
							<Div
								className={styles.cadenceType}
								loading={groupInfoLoading}
								onClick={() => setGroupUsersModal(prev => !prev)}
							>
								{cadence?.type === CADENCE_TYPES.TEAM
									? groupInfo.groupName
									: CADENCE_TRANSLATION[cadence?.type?.toUpperCase()]?.[
											user?.language?.toUpperCase()
									  ]}
							</Div>
							{cadence?.salesforce_cadence_id &&
								cadence?.salesforce_cadence_id !== "product_tour_cadence" && (
									<div className={styles.id}>
										ID: <span>{cadence?.salesforce_cadence_id}</span>{" "}
										<CopyBlank
											size={14}
											color={Colors.lightBlue}
											onClick={() => {
												addSuccess("Copied to clipboard!");
												navigator.clipboard.writeText(cadence?.salesforce_cadence_id);
											}}
										/>
										{/* Google sheets code to be removed */}
										{user?.integration_type === INTEGRATION_TYPE?.GOOGLE_SHEETS && (
											<Link
												onClick={handleSheetsLinkClick}
												size={14}
												color={Colors.lightBlue}
											/>
										)}
										{/* End Comment */}
										{user?.integration_type === INTEGRATION_TYPE.SHEETS &&
											cadence?.integration_type === CADENCE_INTEGRATION_TYPE.SHEETS && (
												<Link
													onClick={handleSheetsLinkClick}
													size={14}
													color={Colors.lightBlue}
												/>
											)}
									</div>
								)}
						</Div>
						<Div loading={cadenceLoading} className={styles.createdAt}>
							<div>{CADENCE_TRANSLATION.CREATED_ON[user?.language?.toUpperCase()]}</div>
							{moment(cadence?.created_at).format("LL")} •{" "}
							<div>
								{CADENCE_TRANSLATION.TOTAL_DURATION[user?.language?.toUpperCase()]}:
							</div>
							{getTotalDurationOfCadence(cadence?.sequence)}{" "}
							{cadence?.description?.length ? (
								<>
									<span> • </span>
									<div className={styles.cadenceDescription}>
										<Tooltip
											text={cadence?.description || "No Description"}
											theme={TooltipThemes.RIGHT}
											className={styles.descriptionTool}
										>
											<Description className={styles.descriptionIcon} />
										</Tooltip>
									</div>
								</>
							) : null}
						</Div>
					</div>
					<div className={styles.right}>
						{cadence?.status === CADENCE_STATUS.IN_PROGRESS ||
						cadence?.status === CADENCE_STATUS.PROCESSING ? (
							<ThemedButton
								theme={ThemedButtonThemes.WHITE}
								onClick={() =>
									setActionModal({
										cadence: cadence,
										buttonText: `${
											COMMON_TRANSLATION.PAUSE[user?.language.toUpperCase()]
										}`,
										message: `${
											CADENCE_TRANSLATION.YOU_WANT_TO_PAUSE_THIS_CADENCE[
												user?.language.toUpperCase()
											]
										}`,
									})
								}
								loading={actionLoading}
								loadingText={`${
									CADENCE_TRANSLATION.PAUSING_CADENCE[user?.language.toUpperCase()]
								}`}
								spinnerClassName={styles.buttonLoader}
								disabled={
									cadence?.status === CADENCE_STATUS.PROCESSING ||
									!isActionPermitted(
										ACTIONS.UPDATE,
										cadence?.type,
										user?.role,
										user?.user_id === cadence?.user_id
									)
								}
								className={styles.optionBtn}
							>
								<Pause />{" "}
								<div>
									{cadence?.status === CADENCE_STATUS.PROCESSING
										? `${COMMON_TRANSLATION.PROCESSING[user?.language.toUpperCase()]}`
										: `${COMMON_TRANSLATION.PAUSE[user?.language.toUpperCase()]}`}{" "}
									{user?.language.toUpperCase() === "SPANISH" ? "la cadencia" : "cadence"}
								</div>
							</ThemedButton>
						) : (
							<ThemedButton
								theme={ThemedButtonThemes.WHITE}
								onClick={() => {
									if (tour?.status === PRODUCT_TOUR_STATUS.AFTER_ONBOARDING_PENDING)
										handleLaunchProductCadence();
									else {
										setActionModal({
											cadence: cadence,
											buttonText:
												cadence?.status === CADENCE_STATUS.NOT_STARTED
													? `${COMMON_TRANSLATION.LAUNCH[user?.language.toUpperCase()]}`
													: `${COMMON_TRANSLATION.RESUME[user?.language.toUpperCase()]}`,
											message:
												cadence?.status === CADENCE_STATUS.NOT_STARTED
													? `${
															CADENCE_TRANSLATION.YOU_WANT_TO_LAUNCH_THIS_CADENCE[
																user?.language.toUpperCase()
															]
													  }`
													: `${
															CADENCE_TRANSLATION.YOU_WANT_TO_RESUME_THIS_CADENCE[
																user?.language.toUpperCase()
															]
													  }`,
										});
									}
								}}
								loading={actionLoading || launchProductTourCadenceLoading}
								loadingText={
									cadence?.status === CADENCE_STATUS.NOT_STARTED
										? `${
												CADENCE_TRANSLATION.LAUNCHING_CADENCE[
													user?.language.toUpperCase()
												]
										  }`
										: `${
												CADENCE_TRANSLATION.RESUMING_CADENCE[user?.language.toUpperCase()]
										  }`
								}
								spinnerClassName={styles.buttonLoader}
								disabled={
									!isActionPermitted(
										ACTIONS.UPDATE,
										cadence?.type,
										user?.role,
										user?.user_id === cadence?.user_id
									)
								}
								className={styles.optionBtn}
								id="launch-cadence-btn"
							>
								<Play />
								<div>
									{cadence?.status === CADENCE_STATUS.NOT_STARTED
										? `${
												CADENCE_TRANSLATION.LAUNCH_CADENCE[user?.language.toUpperCase()]
										  }`
										: `${
												CADENCE_TRANSLATION.RESUME_CADENCE[user?.language.toUpperCase()]
										  }`}
								</div>
							</ThemedButton>
						)}

						<DropDown
							btn={
								<ThemedButton
									theme={ThemedButtonThemes.WHITE}
									className={styles.optionBtn}
									disabled={
										!isMoreOptionsEnabled(
											cadence?.type,
											user?.role,
											user?.user_id === cadence?.user_id
										)
									}
								>
									<More />
								</ThemedButton>
							}
							tooltipText={"More"}
							top={"50px"}
							right={"10px"}
							width={"150px"}
						>
							{isActionPermitted(
								ACTIONS.DUPLICATE,
								cadence?.type,
								user?.role,
								user?.user_id === cadence?.user_id
							) && (
								<button
									className={styles.dropdownBtn}
									onClick={e => handleDuplicateClick(e, cadence)}
								>
									<div>
										<Copy size="18px" />
									</div>
									<div>{COMMON_TRANSLATION.DUPLICATE[user?.language?.toUpperCase()]}</div>
								</button>
							)}

							{isActionPermitted(
								ACTIONS.SHARE,
								cadence?.type,
								user?.role,
								user?.user_id === cadence?.user_id
							) && (
								<button
									className={styles.dropdownBtn}
									onClick={e => handleShareClick(e, cadence)}
								>
									<div>
										<Share size="18px" />
									</div>
									<div>{COMMON_TRANSLATION.SHARE[user?.language?.toUpperCase()]}</div>
								</button>
							)}
							{isActionPermitted(
								ACTIONS.UPDATE,
								cadence?.type,
								user?.role,
								user?.user_id === cadence?.user_id
							) && (
								<button
									className={styles.dropdownBtn}
									onClick={e => handleSettingsClick(e, cadence)}
								>
									<div>
										<Settings size="18px" />
									</div>
									<div>
										{COMMON_TRANSLATION.EDIT_DETAILS[user?.language?.toUpperCase()]}
									</div>
								</button>
							)}
							{isActionPermitted(
								ACTIONS.DELETE,
								cadence?.type,
								user?.role,
								user?.user_id === cadence?.user_id
							) && (
								<button
									className={styles.dropdownBtn}
									onClick={e => handleDeleteClick(e, cadence)}
								>
									<div>
										<Trash size="18px" />
									</div>
									<div>{COMMON_TRANSLATION.DELETE[user?.language?.toUpperCase()]}</div>
								</button>
							)}
							{/* <button
							className={styles.menuOptionBtn}
							onClick={e => handleSetTimerClick(e, cadence)}
						>
							<Paused />
							Set timer
						</button> */}
						</DropDown>
					</div>
				</div>
				<div
					className={`${styles.subHeader} ${activeTab === TABS.STEPS && styles.steps}`}
				>
					<TabNavSlider
						theme={TabNavThemes.SLIDER}
						buttons={getTabOptions(
							cadence,
							cadenceLeadsStats?.totalLeads,
							user,
							workflows
						).filter(op =>
							op.value === TABS.WORKFLOW
								? Boolean(tour?.status !== PRODUCT_TOUR_STATUS.AFTER_ONBOARDING_PENDING)
								: true
						)}
						value={activeTab}
						setValue={setActiveTab}
						activeBtnClassName={styles.activeTab}
						btnClassName={styles.tabBtn}
						noAnimation
						name="view"
					/>

					<div className={styles.subHeaderRight}>
						{activeTab === TABS.LIST &&
						tour?.status !== PRODUCT_TOUR_STATUS.AFTER_ONBOARDING_PENDING ? (
							<>
								<SearchBar
									height="44px"
									value={search}
									setValue={setSearch}
									onSearch={handleSearch}
									className={styles.searchBar}
									disabled={showReassignment}
								/>
								{/* Google sheets code to be removed */}
								{user.integration_type === INTEGRATION_TYPE.GOOGLE_SHEETS &&
									cadence?.salesforce_cadence_id && (
										<>
											<ThemedButton
												height="44px"
												theme={ThemedButtonThemes.WHITE}
												width="fit-content"
												onClick={onResyncSheet}
												loading={resyncLoading}
												loadingText="Syncing"
												className={styles.primaryBtn}
												disabled={Boolean(cadence?.resynching)}
											>
												<Refresh size={16} />
												<div>
													{cadence?.resynching
														? "Resync in progress"
														: TEMPLATES_TRANSLATION.RE_SYNC_SHEET[
																user?.language?.toUpperCase()
														  ]}
												</div>
											</ThemedButton>
											<ThemedButton
												height="44px"
												theme={ThemedButtonThemes.WHITE}
												width="fit-content"
												onClick={onRemap}
												className={styles.primaryBtn}
											>
												<ColumnMapping size={16} />
												<div>Remap</div>
											</ThemedButton>
										</>
									)}
								{/* end comment */}
								{user.integration_type === INTEGRATION_TYPE.SHEETS &&
									cadence?.integration_type === CADENCE_INTEGRATION_TYPE.SHEETS &&
									cadence?.salesforce_cadence_id && (
										<>
											<ThemedButton
												height="44px"
												theme={ThemedButtonThemes.WHITE}
												width="fit-content"
												onClick={onResyncSheet}
												loading={resyncLoading}
												loadingText="Syncing"
												className={styles.primaryBtn}
												disabled={Boolean(cadence?.resynching)}
											>
												<Refresh size={16} />
												<div>
													{cadence?.resynching
														? "Resync in progress"
														: TEMPLATES_TRANSLATION.RE_SYNC_SHEET[
																user?.language?.toUpperCase()
														  ]}
												</div>
											</ThemedButton>
											<ThemedButton
												height="44px"
												theme={ThemedButtonThemes.WHITE}
												width="fit-content"
												onClick={onRemap}
												className={styles.primaryBtn}
											>
												<ColumnMapping size={16} />
												<div>Remap</div>
											</ThemedButton>
										</>
									)}
								{(user.integration_type === INTEGRATION_TYPE.SALESFORCE ||
									user.integration_type === INTEGRATION_TYPE.PIPEDRIVE ||
									user.integration_type === INTEGRATION_TYPE.HUBSPOT ||
									user.integration_type === INTEGRATION_TYPE.ZOHO ||
									user.integration_type === INTEGRATION_TYPE.SELLSY ||
									user.integration_type === INTEGRATION_TYPE.BULLHORN) && (
									<DropDown
										btn={
											<ThemedButton
												height="44px"
												theme={ThemedButtonThemes.WHITE}
												disabled={
													showReassignment ||
													!isActionPermitted(
														ACTIONS.UPDATE,
														cadence?.type,
														user?.role,
														user?.user_id === cadence?.user_id
													)
												}
											>
												<Download />
												<div>
													{COMMON_TRANSLATION.IMPORT[user?.language?.toUpperCase()]}
												</div>
											</ThemedButton>
										}
										top="60px"
										left="-75px"
										width={
											user?.language?.toUpperCase() === "ENGLISH" ? "260px" : "282px"
										}
										tooltipText=""
										customStyles={styles.dropDown}
									>
										{user.integration_type !== INTEGRATION_TYPE.SELLSY && (
											<Button
												onClick={e =>
													isIntegrationTokenExpired()
														? setShowExpirationModal(true)
														: window.open(
																crmRedirectionURL(
																	user.instance_url,
																	user.integration_type
																)
														  )
												}
											>
												<div>
													<IntegrationIcon size="20px" />
												</div>
												<div>{`Import from ${capitalize(user?.integration_type)}`}</div>
											</Button>
										)}

										<Button onClick={e => setImportCsvModal(true)}>
											<div>
												<Excel size="20px" />
											</div>
											<div>
												{
													COMMON_TRANSLATION.IMPORT_FROM_EXCEL[
														user?.language?.toUpperCase()
													]
												}
											</div>
										</Button>
										<Button onClick={e => setImportSheetModal(true)}>
											<div>
												<GoogleSheets size="20px" />
											</div>
											<div>
												{COMMON_TRANSLATION.IMPORT_FROM[user?.language?.toUpperCase()]}{" "}
												Google sheet
											</div>
										</Button>

										{FILTERVIEW_AVAILABILITY.includes(user?.integration_type) && (
											<Button
												onClick={e => {
													navigate(
														`/cadence-import?webhook=true&cadence_id=${cadence?.cadence_id}&cadence_name=${cadence?.name}`
													);
												}}
											>
												<div>
													<SortIcon size="20px" />
												</div>
												<div>Import from Filter view</div>
											</Button>
										)}
									</DropDown>
								)}

								{user.integration_type === INTEGRATION_TYPE.SHEETS && (
									<DropDown
										btn={
											<ThemedButton height="44px" theme={ThemedButtonThemes.WHITE}>
												<Download />
												<div>Import</div>
											</ThemedButton>
										}
										top="60px"
										left="-75px"
										width="260px"
										tooltipText=""
										customStyles={styles.dropDown}
									>
										<Button
											onClick={e => setImportCsvModal(true)}
											disabled={
												leadsData?.length === 0
													? [
															CADENCE_INTEGRATION_TYPE.EXCEL,
															CADENCE_INTEGRATION_TYPE.SHEETS,
													  ].includes(cadence?.integration_type)
														? Boolean(
																cadence?.integration_type !==
																	CADENCE_INTEGRATION_TYPE.EXCEL
														  )
														: false
													: Boolean(
															cadence?.integration_type !== CADENCE_INTEGRATION_TYPE.EXCEL
													  )
											}
										>
											<div>
												<Excel size="20px" />
											</div>
											<div>
												{
													COMMON_TRANSLATION.IMPORT_FROM_EXCEL[
														user?.language?.toUpperCase()
													]
												}{" "}
											</div>
										</Button>
										<Button
											onClick={e => setImportSheetModal(true)}
											disabled={
												leadsData?.length === 0
													? [
															CADENCE_INTEGRATION_TYPE.EXCEL,
															CADENCE_INTEGRATION_TYPE.SHEETS,
													  ].includes(cadence?.integration_type)
														? Boolean(
																cadence?.integration_type !==
																	CADENCE_INTEGRATION_TYPE.SHEETS
														  )
														: false
													: Boolean(
															cadence?.integration_type !==
																CADENCE_INTEGRATION_TYPE.SHEETS
													  )
											}
										>
											<div>
												<GoogleSheets size="20px" />
											</div>
											<div>Import from Google sheet</div>
										</Button>
									</DropDown>
								)}

								{/* {CSV_IMPORT_AVAILABLE.includes(user.integration_type) &&
									user?.integration_type !== INTEGRATION_TYPE.EXCEL &&
									user?.integration_type !== INTEGRATION_TYPE.DYNAMICS && (
										<ThemedButton
											height="44px"
											width="fit-content"
											theme={ThemedButtonThemes.WHITE}
											className={styles.primaryBtn}
											onClick={() => setImportCsvModal(true)}
											disabled={showReassignment}
										>
											<Download />
											<div>
												{" "}
												{
													COMMON_TRANSLATION.IMPORT_FROM[user?.language?.toUpperCase()]
												}{" "}
												CSV
											</div>
										</ThemedButton>
									)} */}
								{user.integration_type === INTEGRATION_TYPE.DYNAMICS && (
									<DropDown
										btn={
											<ThemedButton
												height="44px"
												theme={ThemedButtonThemes.WHITE}
												disabled={showReassignment}
											>
												<Download />
												<div>
													{COMMON_TRANSLATION.IMPORT[user?.language?.toUpperCase()]}
												</div>
											</ThemedButton>
										}
										top="60px"
										left="-75px"
										width="200px"
										tooltipText=""
										customStyles={styles.dropDown}
									>
										<Button onClick={e => window.open(user.instance_url)}>
											<div>
												{COMMON_TRANSLATION.IMPORT_FROM[user?.language?.toUpperCase()]}{" "}
												Dynamics
											</div>
										</Button>
										<Button onClick={e => setImportCsvModal(true)}>
											<div>
												{COMMON_TRANSLATION.IMPORT[user?.language?.toUpperCase()]} .xlsx
											</div>
										</Button>
									</DropDown>
								)}

								{user.integration_type === INTEGRATION_TYPE.EXCEL && (
									<ThemedButton
										height="44px"
										width="fit-content"
										theme={ThemedButtonThemes.WHITE}
										className={styles.primaryBtn}
										onClick={() => setImportCsvModal(true)}
									>
										<Download />
										<div> Import file</div>
									</ThemedButton>
								)}

								<ThemedButton
									height="44px"
									theme={ThemedButtonThemes.WHITE}
									className={`${styles.primaryBtn} ${
										viewMode === VIEW_MODES.STATS ? styles.active : ""
									} `}
									btnwidth="fit-content"
									onClick={() =>
										setViewMode(prev =>
											prev === VIEW_MODES.STATS ? null : VIEW_MODES.STATS
										)
									}
									disabled={showReassignment}
								>
									<StatisticsIcon />
									<div>{TEMPLATES_TRANSLATION.STATS[user?.language?.toUpperCase()]}</div>
								</ThemedButton>
								<ThemedButton
									height="44px"
									theme={ThemedButtonThemes.WHITE}
									className={`${styles.primaryBtn} ${
										viewMode === VIEW_MODES.FILTER || filtersCount ? styles.active : ""
									} `}
									onClick={() =>
										setViewMode(prev =>
											prev === VIEW_MODES.FILTER ? null : VIEW_MODES.FILTER
										)
									}
									btnwidth="fit-content"
									disabled={showReassignment}
								>
									<SortIcon />
									<div>
										{COMMON_TRANSLATION.FILTERS[user?.language?.toUpperCase()]}{" "}
										{filtersCount ? `(${filtersCount})` : ""}
									</div>
								</ThemedButton>
							</>
						) : activeTab === TABS.WORKFLOW ? (
							<ThemedButton
								height="44px"
								disabled={
									!isActionPermitted(
										ACTIONS.UPDATE,
										cadence?.type,
										user?.role,
										user?.user_id === cadence?.user_id
									)
								}
								onClick={() => {
									addNewWorkflow();
								}}
								theme={ThemedButtonThemes.WHITE}
								className={`${styles.primaryBtn} ${styles.workflowBtn}`}
							>
								<PlusOutline size="1rem" />
								<div>
									{CADENCE_TRANSLATION.ADD_WORKFLOW[user?.language?.toUpperCase()]}
								</div>
							</ThemedButton>
						) : activeTab === TABS.STEPS ? (
							<ThemedButton
								height="44px"
								disabled={
									cadence?.status === CADENCE_STATUS.IN_PROGRESS ||
									cadence?.status === CADENCE_STATUS.PROCESSING ||
									!isActionPermitted(
										ACTIONS.UPDATE,
										cadence?.type,
										user?.role,
										user?.user_id === cadence?.user_id
									)
								}
								onClick={() => navigate(`/cadence/edit/${cadence_id}`)}
								theme={ThemedButtonThemes.WHITE}
								className={styles.primaryBtn}
							>
								<Edit size="1rem" />
								<div>{CADENCE_TRANSLATION.EDIT_STEPS[user?.language?.toUpperCase()]}</div>
							</ThemedButton>
						) : null}
					</div>
				</div>
				<div>{renderComponent()}</div>
				<ActionModal
					buttonText={actionModal?.buttonText}
					message={actionModal?.message}
					modal={actionModal}
					handleClose={() => setActionModal(false)}
					onAction={() => handleCadenceAction()}
				/>{" "}
				<DuplicateCadenceModal
					modal={duplicateCadenceModal}
					setModal={setDuplicateCadenceModal}
					dataAccess={cadenceDataAccess}
				/>
				<ShareCadenceModal
					modal={shareCadenceModal}
					setModal={setShareCadenceModal}
					dataAccess={cadenceDataAccess}
				/>
				<DeleteModal
					modal={deleteModal}
					item={deleteModal?.name}
					handleClose={handleDeleteModalClose}
					onDelete={handleCadenceDelete}
					loading={deleteCadenceLoading}
				/>
				<SettingsModal
					modal={settingsModal}
					setModal={setSettingsModal}
					dataAccess={cadenceDataAccess}
				/>
				<ImportCsvModal
					modal={importCsvModal}
					setModal={setImportCsvModal}
					cadence={cadence}
				/>
				<ImportSheetModal
					modal={importSheetModal}
					setModal={setImportSheetModal}
					cadence={cadence}
				/>
				<GlobalModals
					type={GLOBAL_MODAL_TYPES.SALESFORCE_TOKEN_EXPIRED}
					modalProps={{
						isModal: showExpirationModal,
						setModal: setShowExpirationModal,
						onClose: () => setShowExpirationModal(false),
						disableOutsideClick: false,
					}}
				/>
				<CadenceGropuUserModal
					modal={groupUsersModal}
					setModal={setGroupUsersModal}
					groupInfo={groupInfo}
				/>
			</ErrorBoundary>
		</div>
	);
};

export default CadenceView;
