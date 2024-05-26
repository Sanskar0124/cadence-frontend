/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable no-console */
/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
	useCadenceForLead,
	useLead,
	useLeadFieldMap,
	useUser,
} from "@cadence-frontend/data-access";
import { TableThemes, ThemedButtonThemes } from "@cadence-frontend/themes";
import {
	Checkbox,
	DragNDropFile,
	Table,
	ThemedButton,
	ReplaceCadenceModal,
} from "@cadence-frontend/widgets";
import { useQuery } from "@cadence-frontend/utils";

import { VIEW_MODES } from "../../../constants";
import {
	CSV_IMPORT_AVAILABLE,
	getSampleCsvUrl,
	getTableColumns,
	getTypeOptions,
	getViewModeTableColumns,
	ownerReassignmentSupport,
	importCsvDocsUrl,
	navigateToCsvImport,
	SHOW_REASSIGNMENT_MODAL,
	TYPE_OPTIONS,
	showLeadExportModal,
} from "./constants";

import Sidebar from "../../Sidebar/Sidebar";
import LeadDetailsModal from "./components/LeadDetailsModal/LeadDetailsModal";
import LeadListRow from "./components/LeadListRow/LeadListRow";
import Reassignment from "./components/Reassignment/Reassignment";

import {
	ActionModal,
	DeleteModal,
	ErrorBoundary,
	Title,
} from "@cadence-frontend/components";
import {
	Delete,
	Download,
	NoLeads2,
	Pause,
	Play,
	ReAssign,
	Refresh,
	Stop,
} from "@cadence-frontend/icons";
import {
	Cadence as CADENCE_TRANSLATION,
	Common as COMMON_TRANSLATION,
	Settings as SETTINGS_TRANSLATION,
} from "@cadence-frontend/languages";
import styles from "./LeadsList.module.scss";

// Recoil
import { tourInfo, userInfo } from "@cadence-frontend/atoms";
import {
	CADENCE_INTEGRATION_TYPE,
	CADENCE_STATUS,
	INITIAL_TOUR_STEPS_ENUM,
	INTEGRATION_TYPE,
	LEAD_INTEGRATION_TYPES,
	PRODUCT_TOUR_STATUS,
} from "@cadence-frontend/constants";
import { MessageContext } from "@cadence-frontend/contexts";
import { useRecoilState, useRecoilValue } from "recoil";
import { ACTIONS } from "../../../../constants";
import { isActionPermitted } from "../../../../utils";
import DeleteLeadsModal from "./components/DeleteLeadsModal/DeleteLeadsModal";
import LeadExportModal from "./components/LeadExportModal/LeadExportModal";
import ImportGSLeads from "./components/ImportGSLeads/ImportGSLeads";
import ImportLeads from "./components/ImportLeads/ImportLeads";
import SelectLeads from "./components/SelectLeadsModal/SelectLeads";
import ImportLeadsForTour from "./components/ImportLeadsForTour/ImportLeadsForTour";
import { useQueryClient } from "react-query";

const LeadsList = ({
	viewMode,
	searchValue,
	setViewMode,
	filtersCount,
	setFiltersCount,
	showReassignment,
	setShowReassignment,
	cadenceSettingsDataAccess,
	cadenceLeadsStats,
	setLeadsData,
}) => {
	let { id: cadenceId } = useParams();
	cadenceId = parseInt(cadenceId);
	const query = useQuery();
	const leadId = query.get("lead_id");
	const { user, updateUser } = useUser({ user: true });
	const [tour, setTour] = useRecoilState(tourInfo);
	const { addSuccess, addError } = useContext(MessageContext);
	const user_info = useRecoilValue(userInfo);
	const TABLE_COLUMNS = getTableColumns(user_info?.integration_type, user_info?.language);
	const VIEW_MODE_TABLE_COLUMNS = getViewModeTableColumns(user_info);
	const observer = useRef();
	const [modal, setModal] = useState(false);
	const [selectAllLeads, setSelectAllLeads] = useState(false);
	const [active, setActive] = useState("");
	const [deleteLeadsOption, setDeleteLeadsOption] = useState({
		cadence_option: "selected",
	});

	const { cadence, cadenceDropdown } = cadenceSettingsDataAccess;
	const queryClient = useQueryClient();

	const cadenceLeadsDataAccess = useCadenceForLead(
		{ cadenceId },
		true,
		searchValue,
		selectAllLeads
	);
	const {
		leadsData,
		fetchNextPage,
		hasNextPage,
		isFetching,
		isFetchingNextPage,
		filters,
		setFilters,
		deleteLeads,
		deleteLeadsLoading,
		refetchLeads,
		bulkPauseCadence,
		bulkPauseLoading,
		bulkStopCadence,
		bulkStopLoading,
		bulkResumeCadence,
		bulkResumeLoading,
	} = cadenceLeadsDataAccess;

	const { fieldMap } = useLeadFieldMap({ fieldMap: true });

	const [leads, setLeads] = useState([]);
	const [owner, setOwner] = useState([]);
	const [selectedLead, setSelectedLead] = useState(null);
	const [checkedLeads, setCheckedLeads] = useState([]);
	const [refreshInternalState, setRefreshInternalState] = useState(false);
	const [sidebarWidth, setSidebarWidth] = useState("0%");
	const [leadDetailsModal, setLeadDetailsModal] = useState(null);
	const [replaceCadenceModal, setReplaceCadenceModal] = useState(null);
	const [actionDisabled, setActionDisabled] = useState(false);
	const [deleteModal, setDeleteModal] = useState(false);
	const [actionModal, setActionModal] = useState(false);
	const [exportLeadModal, setExportLeadModal] = useState(false);
	const [redirectLeadDetailsModal, setRedirectLeadDetailsModal] = useState(false);
	const onSidebarClose = () => setViewMode(null);

	const handleDeleteLeads = () => {
		deleteLeads(
			{
				lead_ids: selectedLead ? [selectedLead?.lead_id] : checkedLeads,
				option: selectAllLeads ? "all" : "selected",
				cadence_id: cadenceId,
				cadence_option: deleteLeadsOption.cadence_option,
			},
			{
				onSuccess: res => {
					setCheckedLeads([]);
					setRefreshInternalState(prev => !prev);
					addSuccess("Leads deleted", true);
					queryClient.invalidateQueries(["cadence", cadenceId]);
				},
				onError: err =>
					addError({
						text: err?.response?.data?.msg,
						desc: err?.response?.data?.error,
						cId: err?.response?.data?.correlationId,
					}),
			}
		);
	};

	const handleCadenceAction = () => {
		if (
			actionModal.buttonText === CADENCE_TRANSLATION.STOP[user?.language?.toUpperCase()]
		)
			handleBulkStop();
		if (
			actionModal.buttonText === CADENCE_TRANSLATION.RESUME[user?.language?.toUpperCase()]
		)
			handleBulkResume();
		if (
			actionModal.buttonText === CADENCE_TRANSLATION.PAUSE[user?.language?.toUpperCase()]
		)
			handleBulkPause();
	};

	const handleBulkPause = () => {
		try {
			bulkPauseCadence(
				{
					lead_ids: selectedLead ? [selectedLead?.lead_id] : checkedLeads,
					cadence_id: cadenceId,
					option: selectAllLeads ? "all" : "selected",
				},
				{
					onError: err => {
						addError({
							text: err?.response?.data?.msg || "Something went wrong!",
							desc: err?.response?.data?.error,
							cId: err?.response?.data?.correlationId,
						});
					},
					onSuccess: res => {
						addSuccess(res.msg || "Paused cadence for lead(s) successfully");
						setCheckedLeads([]);
						setRefreshInternalState(prev => !prev);
						// if (typeof refetchLeads === "function") refetchLeads();
					},
				}
			);
		} catch (err) {
			addError({ text: err?.message || "Unable to pause " });
		}
	};

	const handleBulkResume = () => {
		try {
			bulkResumeCadence(
				{
					lead_ids: selectedLead ? [selectedLead?.lead_id] : checkedLeads,
					cadence_id: cadenceId,
					option: selectAllLeads ? "all" : "selected",
				},
				{
					onError: err => {
						addError({
							text: err?.response?.data?.msg || "Something went wrong!",
							desc: err?.response?.data?.error,
							cId: err?.response?.data?.correlationId,
						});
					},
					onSuccess: res => {
						addSuccess(res.msg || "Resumed cadence for lead(s) successfully");
						setCheckedLeads([]);
						setRefreshInternalState(prev => !prev);
						// if (typeof refetchLeads === "function") refetchLeads();
					},
				}
			);
		} catch (err) {
			addError({ text: err.message || "Unable to resume " });
		}
	};

	const handleBulkStop = () => {
		try {
			bulkStopCadence(
				{
					lead_ids: selectedLead ? [selectedLead?.lead_id] : checkedLeads,
					cadence_id: cadenceId,
					option: selectAllLeads ? "all" : "selected",
				},
				{
					onError: err => {
						addError({
							text: err?.response?.data?.msg || "Something went wrong!",
							desc: err?.response?.data?.error,
							cId: err?.response?.data?.correlationId,
						});
					},
					onSuccess: res => {
						addSuccess(res.msg || "Stoped cadence for lead(s) successfully");
						setCheckedLeads([]);
						setRefreshInternalState(prev => !prev);
						// if (typeof refetchLeads === "function") refetchLeads();
					},
				}
			);
		} catch (err) {
			addError({ text: err.message || "Unable to stop " });
		}
	};

	const leadsUnavailable = () => {
		const types = ownerReassignmentSupport(user_info);
		return (
			leads?.filter(
				lead =>
					checkedLeads.includes(lead?.lead_id) && types?.includes(lead.integration_type)
			)?.length === 0
		);
	};

	useEffect(onSidebarClose, []);

	// useEffect(() => {
	// 	if (!reassignmentModal && !deleteModal) setSelectedLead(null);
	// }, [reassignmentModal, deleteModal]);
	useEffect(() => {
		if (!showReassignment && !deleteModal) setSelectedLead(null);
	}, [showReassignment, deleteModal]);

	useEffect(() => {
		setFilters(prev => ({
			...prev,
			user_ids: owner ? owner?.map(o => o.user_id) : null,
		}));
	}, [owner]);

	useEffect(() => {
		if (leadsData) {
			setLeads(leadsData);
			setLeadsData(leadsData);
			//As soon as leadsdata is fetched for first time, the state is set to true
			leadsData && setRedirectLeadDetailsModal(true);

			if (tour?.status === PRODUCT_TOUR_STATUS.AFTER_ONBOARDING_PENDING) {
				if (
					tour?.currentStep !== INITIAL_TOUR_STEPS_ENUM.CLICK_PEOPLE &&
					tour?.currentStep !== INITIAL_TOUR_STEPS_ENUM.IMPORT_DUMMY_LEADS
				)
					return;

				if (!tour?.currentStepCompleted) return;
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
						onSuccess: () => {
							setTour(prev => ({
								...prev,
								currentStep: NEW_STEP,
								currentUrl: `${window.location.pathname}${window.location.search}${window.location.hash}`,
								currentStepCompleted: false,
							}));
						},
						onError: err => {
							addError({
								text: err?.response?.data?.msg,
								desc: err?.response?.data?.error,
								cId: err?.response?.data?.correlationId,
							});
							setTour(prev => ({
								...prev,
								isError: true,
								currentStepCompleted: false,
							}));
						},
					}
				);
			}
		}
	}, [leadsData]);

	//RedirectLeadDetailsModal value changes for only one time and therefore only first time useEffect is called and lead details modal appears.
	useEffect(() => {
		if (redirectLeadDetailsModal) {
			const lead = leadsData?.find(lead => lead.lead_id === parseInt(leadId));
			lead && setLeadDetailsModal(lead);
		}
	}, [redirectLeadDetailsModal]);

	useEffect(() => {
		if (viewMode === VIEW_MODES.STATS || viewMode === VIEW_MODES.FILTER)
			setSidebarWidth("31.5%");
		else setSidebarWidth("0%");
	}, [viewMode]);

	useEffect(() => {
		let count = 0;
		for (const filter of Object.keys(filters))
			if (Array.isArray(filters[filter]) ? filters[filter].length : filters[filter])
				count++;
		setFiltersCount(count);
	}, [filters, owner, setFiltersCount]);

	const lastLeadRef = useCallback(
		leadNode => {
			if (isFetchingNextPage || isFetching) return;
			if (observer.current) observer.current.disconnect();
			observer.current = new IntersectionObserver(entries => {
				if (entries[0].isIntersecting && hasNextPage) fetchNextPage();
			});
			if (leadNode) observer.current.observe(leadNode);
		},
		[isFetchingNextPage, isFetching, hasNextPage]
	);

	return (
		<ErrorBoundary>
			{showReassignment ? (
				<Reassignment
					setShowReassignment={setShowReassignment}
					leads={leads}
					checkedLeads={checkedLeads}
					setCheckedLeads={setCheckedLeads}
					selectedLead={selectedLead}
					selectAllLeads={selectAllLeads}
					setSelectAllLeads={setSelectAllLeads}
					cadenceLeadsDataAccess={cadenceLeadsDataAccess}
				/>
			) : (
				<>
					{checkedLeads.length > 0 && (
						<div className={styles.midBar}>
							<div className={styles.leftSectn}>
								<p>{COMMON_TRANSLATION.BULK_ACTIONS[user?.language?.toUpperCase()]}</p>
								<Title size={16}>
									{selectAllLeads
										? `Selected all ${cadenceLeadsStats?.totalLeads} leads`
										: `${
												CADENCE_TRANSLATION?.PEOPLE_SELECTED?.[
													user?.language?.toUpperCase()
												]
										  } - ${checkedLeads.length} out of ${leads?.length}`}
								</Title>
							</div>
							<div className={styles.rightSectn}>
								{SHOW_REASSIGNMENT_MODAL(user_info.integration_type) && (
									<ThemedButton
										disabled={
											!isActionPermitted(
												ACTIONS.UPDATE,
												cadence?.type,
												user?.role,
												cadence?.user_id === user?.user_id
											) || leadsUnavailable()
										}
										theme={ThemedButtonThemes.WHITE}
										onClick={() => setShowReassignment(true)}
										width="fit-content"
									>
										<ReAssign size={17} />
										<div>
											{
												CADENCE_TRANSLATION.OWNER_REASSIGNMENT[
													user?.language?.toUpperCase()
												]
											}
										</div>
									</ThemedButton>
								)}
								{cadence?.integration_type !== CADENCE_INTEGRATION_TYPE.SHEETS && (
									<ThemedButton
										disabled={
											!isActionPermitted(
												ACTIONS.UPDATE,
												cadence?.type,
												user?.role,
												cadence?.user_id === user?.user_id
											)
										}
										theme={ThemedButtonThemes.WHITE}
										onClick={() =>
											setReplaceCadenceModal({
												lead_ids: checkedLeads,
												cadence_id: cadenceId,
												cadenceType: cadence?.type,
												option: selectAllLeads ? "all" : "selected",
											})
										}
										width="fit-content"
									>
										<Refresh size={14} />
										<span>
											{
												CADENCE_TRANSLATION?.MOVE_TO_ANOTHER_CADENCE?.[
													user?.language?.toUpperCase()
												]
											}
										</span>
									</ThemedButton>
								)}

								<ThemedButton
									disabled={
										!isActionPermitted(
											ACTIONS.UPDATE,
											cadence?.type,
											user?.role,
											cadence?.user_id === user?.user_id
										) || cadence?.status === CADENCE_STATUS.NOT_STARTED
									}
									theme={ThemedButtonThemes.WHITE}
									width="fit-content"
									loading={bulkPauseLoading}
									onClick={() =>
										setActionModal({
											cadence: cadence,
											buttonText:
												CADENCE_TRANSLATION.PAUSE[user?.language?.toUpperCase()],
											message: "you want to pause the leads ?",
											description:
												"Leads that are stopped, completed or already paused will not be affected by this.",
										})
									}
									loadingText="Pausing"
								>
									<Pause size={16} />
									<span>
										{CADENCE_TRANSLATION?.PAUSE?.[user?.language?.toUpperCase()]}
									</span>
								</ThemedButton>

								<ThemedButton
									disabled={
										!isActionPermitted(
											ACTIONS.UPDATE,
											cadence?.type,
											user?.role,
											cadence?.user_id === user?.user_id
										) || cadence?.status === CADENCE_STATUS.NOT_STARTED
									}
									theme={ThemedButtonThemes.WHITE}
									width="fit-content"
									loading={bulkStopLoading}
									onClick={() =>
										setActionModal({
											cadence: cadence,
											buttonText: CADENCE_TRANSLATION.STOP[user?.language?.toUpperCase()],
											message: "you want to stop the leads ?",
											description:
												"Leads that are stopped or completed will not be affected by this.",
										})
									}
									loadingText="Stopping"
								>
									<Stop size={16} />
									<span>
										{CADENCE_TRANSLATION?.STOP?.[user?.language?.toUpperCase()]}
									</span>
								</ThemedButton>

								<ThemedButton
									disabled={
										!isActionPermitted(
											ACTIONS.UPDATE,
											cadence?.type,
											user?.role,
											cadence?.user_id === user?.user_id
										) || cadence?.status === CADENCE_STATUS.NOT_STARTED
									}
									theme={ThemedButtonThemes.WHITE}
									width="fit-content"
									loading={bulkResumeLoading}
									onClick={() =>
										setActionModal({
											cadence: cadence,
											buttonText:
												CADENCE_TRANSLATION.RESUME[user?.language?.toUpperCase()],
											message: "you want to resume the leads ?",
											description:
												"Leads that are stopped or completed will not be affected by this.",
										})
									}
									loadingText="Resuming"
								>
									<Play size={16} />
									<span>
										{CADENCE_TRANSLATION?.RESUME?.[user?.language?.toUpperCase()]}
									</span>
								</ThemedButton>

								<ThemedButton
									disabled={
										deleteLeadsLoading ||
										!isActionPermitted(
											ACTIONS.UPDATE,
											cadence?.type,
											user?.role,
											cadence?.user_id === user?.user_id
										)
									}
									theme={ThemedButtonThemes.WHITE}
									width="fit-content"
									loading={deleteLeadsLoading}
									onClick={() => setDeleteModal(true)}
									loadingText="Deleting leads"
								>
									<Delete size={16} />
									<span>
										{COMMON_TRANSLATION?.DELETE?.[user?.language?.toUpperCase()]}
									</span>
								</ThemedButton>
							</div>
						</div>
					)}
					<div className={styles.body} style={{ gap: viewMode ? "10px" : "" }}>
						<div className={styles.leadsContainer}>
							<ErrorBoundary>
								<Table
									loading={isFetching && !isFetchingNextPage}
									columns={[
										<Checkbox
											className={styles.checkBox}
											checked={
												leads?.length > 0 &&
												checkedLeads.length ===
													leads?.filter(lead => lead?.lead_id).length
											}
											onClick={() => {
												if (cadenceLeadsStats?.totalLeads > 20) {
													setModal(prev => !prev);
												} else {
													if (leads?.length > 0)
														checkedLeads?.length !==
														leads?.filter(lead => lead.lead_id).length
															? setCheckedLeads(
																	leads
																		.filter(lead => lead?.lead_id)
																		.map(lead => lead.lead_id)
															  )
															: setCheckedLeads([]);
												}
											}}
										/>,
										viewMode ? [...VIEW_MODE_TABLE_COLUMNS] : [...TABLE_COLUMNS],
									].flat()}
									noOfRows={10}
									height={
										checkedLeads.length > 0
											? "calc(100vh - 240px)"
											: "calc(100vh - 180px)"
									}
									className={styles.table}
									theme={TableThemes.WHITE_AND_LIGHT_PURPLE}
								>
									{leads?.length > 0 ? (
										<>
											{leads?.map((lead, index) => {
												const isLastLead = index === leads.length - 1;
												return isLastLead ? (
													<>
														<LeadListRow
															index={index}
															lead={lead}
															totalLeads={leads?.length}
															cadence={cadence}
															user={user}
															setSelectedLead={setSelectedLead}
															setDeleteModal={setDeleteModal}
															setShowReassignment={setShowReassignment}
															setLeadDetailsModal={setLeadDetailsModal}
															setReplaceCadenceModal={setReplaceCadenceModal}
															setExportLeadModal={setExportLeadModal}
															checkedLeads={checkedLeads}
															setCheckedLeads={setCheckedLeads}
															viewMode={viewMode}
															actionDisabled={actionDisabled}
															setActionDisabled={setActionDisabled}
															cadenceLeadsDataAccess={cadenceLeadsDataAccess}
															ref={leads?.length > 19 ? lastLeadRef : null}
															selectAllLeads={selectAllLeads}
															setSelectAllLeads={setSelectAllLeads}
															setActive={setActive}
															cadenceTotalLeads={cadenceLeadsStats?.totalLeads}
															fieldMap={fieldMap}
														/>
														{isFetchingNextPage && (
															<LeadListRow
																index={index}
																lead={lead}
																totalLeads={leads?.length}
																cadence={cadence}
																user={user}
																setSelectedLead={setSelectedLead}
																setDeleteModal={setDeleteModal}
																setShowReassignment={setShowReassignment}
																setLeadDetailsModal={setLeadDetailsModal}
																setReplaceCadenceModal={setReplaceCadenceModal}
																setExportLeadModal={setExportLeadModal}
																checkedLeads={checkedLeads}
																setCheckedLeads={setCheckedLeads}
																viewMode={viewMode}
																actionDisabled={actionDisabled}
																setActionDisabled={setActionDisabled}
																cadenceLeadsDataAccess={cadenceLeadsDataAccess}
																noOfColumns={
																	viewMode
																		? VIEW_MODE_TABLE_COLUMNS.length
																		: TABLE_COLUMNS.length
																}
																loading={isFetchingNextPage}
																setSelectAllLeads={setSelectAllLeads}
																setActive={setActive}
																cadenceTotalLeads={cadenceLeadsStats?.totalLeads}
																fieldMap={fieldMap}
															/>
														)}
													</>
												) : (
													<LeadListRow
														index={index}
														lead={lead}
														totalLeads={leads?.length}
														cadence={cadence}
														user={user}
														setSelectedLead={setSelectedLead}
														setDeleteModal={setDeleteModal}
														setShowReassignment={setShowReassignment}
														setLeadDetailsModal={setLeadDetailsModal}
														setReplaceCadenceModal={setReplaceCadenceModal}
														setExportLeadModal={setExportLeadModal}
														checkedLeads={checkedLeads}
														setCheckedLeads={setCheckedLeads}
														viewMode={viewMode}
														actionDisabled={actionDisabled}
														setActionDisabled={setActionDisabled}
														cadenceLeadsDataAccess={cadenceLeadsDataAccess}
														setSelectAllLeads={setSelectAllLeads}
														setActive={setActive}
														cadenceTotalLeads={cadenceLeadsStats?.totalLeads}
														fieldMap={fieldMap}
													/>
												);
											})}
										</>
									) : (
										<NoLeadsComponent
											cadence={cadence}
											user_info={user_info}
											user={user}
											refetchLeads={refetchLeads}
										/>
									)}
								</Table>
							</ErrorBoundary>
						</div>
						<div
							className={styles.leadStatistics}
							style={{
								width: sidebarWidth,
								transition: "0.25s ease-in-out",
							}}
						>
							{(viewMode === VIEW_MODES.FILTER || viewMode === VIEW_MODES.STATS) && (
								<Sidebar
									viewMode={viewMode}
									cadenceName={cadence?.name}
									filtersProps={{ filters, setFilters, filtersCount }}
									additionalFilterProps={{ owner, setOwner }}
									onSidebarClose={onSidebarClose}
									statsData={cadenceLeadsStats}
									leadsLoading={isFetching}
									height={
										checkedLeads.length > 0
											? "calc(100vh - 255px)"
											: "calc(100vh - 195px)"
									}
								/>
							)}
						</div>
						<LeadDetailsModal modal={leadDetailsModal} setModal={setLeadDetailsModal} />
						<ReplaceCadenceModal
							modal={replaceCadenceModal}
							setModal={setReplaceCadenceModal}
							dataAccess={cadenceLeadsDataAccess}
							cadenceDropdown={cadenceDropdown}
							user={user}
						/>
						{user_info.integration_type === INTEGRATION_TYPE.GOOGLE_SHEETS ||
						user_info.integration_type === INTEGRATION_TYPE.EXCEL ||
						user_info.integration_type === INTEGRATION_TYPE.SHEETS ? (
							<DeleteModal
								modal={deleteModal}
								setModal={setDeleteModal}
								item={selectedLead ? "lead" : "leads"}
								onDelete={handleDeleteLeads}
								loading={deleteLeadsLoading}
							/>
						) : (
							<DeleteLeadsModal
								modal={deleteModal}
								setModal={setDeleteModal}
								onDelete={handleDeleteLeads}
								loading={deleteLeadsLoading}
								deleteLeadsOption={deleteLeadsOption}
								setDeleteLeadsOption={setDeleteLeadsOption}
							/>
						)}
						<ActionModal
							buttonText={actionModal?.buttonText}
							message={actionModal?.message}
							description={actionModal?.description}
							modal={actionModal}
							handleClose={() => setActionModal(false)}
							onAction={() => handleCadenceAction()}
						/>
						{showLeadExportModal(user_info) && (
							<LeadExportModal
								modal={exportLeadModal}
								setModal={setExportLeadModal}
								refetch={refetchLeads}
							/>
						)}
					</div>

					<SelectLeads
						modal={modal}
						refreshInternalState={refreshInternalState}
						setModal={setModal}
						checkedLeads={checkedLeads}
						setCheckedLeads={setCheckedLeads}
						leads={leadsData}
						cadenceLeadsStats={cadenceLeadsStats}
						ref={lastLeadRef}
						refetchLeads={refetchLeads}
						setSelectAllLeads={setSelectAllLeads}
						selectAllLeads={selectAllLeads}
						filtersCount={filtersCount}
						isFetching={isFetching}
						active={active}
						setActive={setActive}
					/>
				</>
			)}
		</ErrorBoundary>
	);
};

const NoLeadsComponent = ({ cadence, user_info, user, refetchLeads }) => {
	const navigate = useNavigate();
	const tour = useRecoilValue(tourInfo);
	const [file, setFile] = useState(null);
	const [type, setType] = useState("lead");

	useEffect(() => {
		if (file) {
			navigateToCsvImport(file, user_info.integration_type, cadence, navigate, type);
		}
	}, [file]);

	if (tour?.status === PRODUCT_TOUR_STATUS.AFTER_ONBOARDING_PENDING)
		return <ImportLeadsForTour refetchLeads={refetchLeads} />;
	if (
		!isActionPermitted(
			ACTIONS.UPDATE,
			cadence?.type,
			user?.role,
			user?.user_id === cadence?.user_id
		)
	)
		return (
			<div className={styles.noLeads}>
				<div className={styles.noLeadsSectn}>
					<NoLeads2 />
					<span>
						{CADENCE_TRANSLATION.CURRENTLY_NO_LEADS_PRESENT[user?.language.toUpperCase()]}
					</span>
				</div>
			</div>
		);
	if (user_info?.integration_type === INTEGRATION_TYPE.GOOGLE_SHEETS)
		return <ImportGSLeads cadence={cadence} />;
	if (
		user_info?.integration_type === INTEGRATION_TYPE.SALESFORCE ||
		user_info?.integration_type === INTEGRATION_TYPE.PIPEDRIVE ||
		user_info?.integration_type === INTEGRATION_TYPE.HUBSPOT ||
		user_info?.integration_type === INTEGRATION_TYPE.ZOHO ||
		user_info?.integration_type === INTEGRATION_TYPE.SELLSY ||
		user_info?.integration_type === INTEGRATION_TYPE.BULLHORN ||
		user_info?.integration_type === INTEGRATION_TYPE.SHEETS
	)
		return <ImportLeads cadence={cadence} user={user} user_info={user_info} />;

	return (
		<div className={styles.noLeads}>
			<div className={styles.noLeadsSectn}>
				<NoLeads2 />
				<span>
					{CADENCE_TRANSLATION.CURRENTLY_NO_LEADS_PRESENT[user?.language.toUpperCase()]}
				</span>
				{CSV_IMPORT_AVAILABLE.includes(user_info.integration_type) && (
					<>
						<p>{CADENCE_TRANSLATION.ADD_CSV_FILE[user?.language.toUpperCase()]}</p>
						<a
							href={getSampleCsvUrl(user_info.integration_type, type)}
							target="_blank"
							rel="noreferrer"
							download
						>
							<ThemedButton theme={ThemedButtonThemes.TRANSPARENT} width="fit-content">
								<Download size={15} />{" "}
								{user_info?.integration_type === INTEGRATION_TYPE.DYNAMICS
									? type === "lead"
										? COMMON_TRANSLATION.SAMPLE_LEAD_XLSX_FILE[
												user_info?.language?.toUpperCase()
										  ]
										: COMMON_TRANSLATION.SAMPLE_CONTACT_XLSX_FILE[
												user_info?.language?.toUpperCase()
										  ]
									: COMMON_TRANSLATION.SAMPLE_CSV_FILE[
											user_info?.language?.toUpperCase()
									  ]}
							</ThemedButton>
						</a>
						{(user_info?.integration_type === INTEGRATION_TYPE.HUBSPOT ||
							user_info?.integration_type === INTEGRATION_TYPE.SELLSY) && (
							<div className={styles.helpLinks}>
								<a
									href={importCsvDocsUrl(user_info?.integration_type)}
									target="_blank"
									rel="noreferrer"
								>
									{
										SETTINGS_TRANSLATION.READ_SUPPORT_DOCUMENTATION[
											user?.language?.toUpperCase()
										]
									}
								</a>
							</div>
						)}
					</>
				)}
			</div>
			{CSV_IMPORT_AVAILABLE.includes(user_info.integration_type) && (
				<div className={styles.dragNDropSectn}>
					<div>
						<DragNDropFile
							droppedFile={file}
							setDroppedFile={setFile}
							type={type}
							setType={setType}
							options={getTypeOptions(user_info?.integration_type)}
							integrationType={user_info?.integration_type}
							showFileDetails={false}
							extnsAllowed={
								user_info.integration_type === INTEGRATION_TYPE.SHEETS
									? ["xlsx", "xls", "xlsm", "xlsb", "xml", "csv", "tsv", "txt"]
									: user_info.integration_type === INTEGRATION_TYPE.DYNAMICS
									? ["xlsx"]
									: ["csv"]
							}
							maxSize={5000000}
						/>
					</div>
				</div>
			)}
		</div>
	);
};

export default LeadsList;
