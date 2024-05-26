/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-console */
import moment from "moment-timezone";
import "moment-timezone";
import { useCallback, useContext, useEffect, useState, useRef } from "react";

import {
	Button,
	Div,
	ErrorBoundary,
	Skeleton,
	Tooltip,
} from "@cadence-frontend/components";
import {
	Briefcase,
	BriefcaseBox,
	Building,
	CadenceLogo,
	CadenceLogoOrange,
	Clock,
	Crm,
	Edit,
	Email,
	Home,
	HotLead,
	Info2,
	LinkBox,
	LinkedinBox,
	Location,
	Minus,
	More,
	Phone,
	PotentialLicence,
	TaskComplete,
	TaskSkipped,
	Timer,
	Timezone,
	View,
} from "@cadence-frontend/icons";
import { ThemedButtonThemes, TooltipThemes } from "@cadence-frontend/themes";
import {
	Colors,
	capitalize,
	getIntegrationDetailAvailability,
	getIntegrationIconForLead,
	getLeadIntegrationUrl,
	getValidLink,
} from "@cadence-frontend/utils";
import {
	CalendarEventsModal,
	DropDown,
	GlobalModals,
	LocalModals,
	ReplaceCadenceModal,
	ThemedButton,
	TourCallDialer,
} from "@cadence-frontend/widgets";
import { getMailData, getTaskEnum } from "../../utils";
import { CUSTOM_VARIABLE_FIELD_AVAILABLE, TASKS } from "./constants";
import { removeCurrentHotLeadsFromTask } from "../constants";
import { powerInfo, tourInfo, userInfo } from "@cadence-frontend/atoms";
import {
	CUSTOM_TASK_NODE_IDS,
	GLOBAL_MODAL_TYPES,
	INTEGRATION_TYPE,
	LEAD_WARMTH,
	LANGUAGES,
	LEAD_INTEGRATION_TYPES,
	LOCAL_MODAL_TYPES,
	PHONE_INTEGRATIONS,
	POWER_STATUS,
	IS_CUSTOM_VARS_AVL_FOR_LEAD_INTEGRATION,
	PRODUCT_TOUR_STATUS,
	INITIAL_TOUR_STEPS_ENUM,
	LOCAL_STORAGE_KEYS,
} from "@cadence-frontend/constants";
import { MessageContext } from "@cadence-frontend/contexts";
import {
	useLead,
	useRelatedLeads,
	useCadenceForLead,
	useProductTour,
	useUser,
} from "@cadence-frontend/data-access";
import {
	Common as COMMON_TRANSLATION,
	Tasks as TASKS_TRANSLATION,
	Cadence as CADENCE_TRANSLATION,
} from "@cadence-frontend/languages";
import { CallIframeContext } from "@salesforce/context";
import { useRecoilState, useRecoilValue } from "recoil";
import TaskButton from "./components/TaskButton/TaskButton";
import styles from "./Details.module.scss";
import PhoneDetails from "./components/PhoneDetails";
import {
	getAccountVariables,
	getContactVariables,
	getLeadVariables,
} from "libs/widgets/src/lib/GlobalModals/EditLeadIMC/constants";
import CustomVariableButtons from "./components/CustomVariablesButtons/CustomVariableButtons";
import { useNavigate } from "react-router-dom";

function Details({
	activeTaskInfo,
	lead,
	fieldMap,
	leadLoading,
	companyAddress,
	fetchAddressesLoading,
	setTasks,
	markTaskAsComplete,
	markTaskAsCompleteLoading,
	setTaskToBeRemoved,
	nextNode,
	taskToBeRemoved,
	refetchLead,
	userId,
	userTimezone,
	leadSalesforceDataAccess,
	stopPower,
	changeToNextPowerTask,
	hotLeadFromSocket,
	setHotLeadFromSocket,
	updatePowerTaskStatus,
	countries,
	refetchTasks,
}) {
	const navigate = useNavigate();
	const power = useRecoilValue(powerInfo);
	const [tour, setTour] = useRecoilState(tourInfo);
	const { addError, addSuccess } = useContext(MessageContext);
	const { simpleSDK, forceUpdate, loading: callLoading } = useContext(CallIframeContext);
	const { salesforceQuery, salesforceContactQuery, salesforceSuccess } =
		leadSalesforceDataAccess;
	const user = useRecoilValue(userInfo);
	const { data: relatedLeadData, relatedLeadLoading } = useRelatedLeads({
		lead,
		enabled: Boolean(lead),
	});
	const {
		crmLeadInfo,
		refetchCrmLeadInfo,
		crmLeadInfoLoading,
		refetchingCrmLeadInfo,
		crmLeadInfoError,
		removeHotLeadStatus,
		removeHotLeadStatusLoading,
	} = useLead(
		null,
		false,
		lead?.lead_id,
		false,
		IS_CUSTOM_VARS_AVL_FOR_LEAD_INTEGRATION.includes(lead?.integration_type)
	);
	const { markSampleTaskComplete, markSampleTaskCompleteLoading } = useProductTour();
	const { updateUser } = useUser();
	const [activeModalParams, setActiveModalParams] = useState();
	const [primaryPhone, setPrimaryPhone] = useState(null);
	const [cadenceState, setCadenceState] = useState({
		isPaused: false,
		isStopped: false,
	});

	const [timeString, setTimestring] = useState("");
	const [calendarModal, setCalendarModal] = useState(false);
	const [localModal, setLocalModal] = useState(false);
	const [showBriefcase, setShowBriefcase] = useState(false);
	const [showRemoveHotLead, setShowRemoveHotLead] = useState(false);
	const [showHotLead, setShowHotLead] = useState(true);
	const [replaceCadenceModal, setReplaceCadenceModal] = useState(null);
	const [customvariableOptions, setCustomvariableOptions] = useState([]);
	const [tourDialer, setTourDialer] = useState(false);
	const stepName = getTaskEnum(activeTaskInfo);
	const salesforceLoading =
		salesforceQuery.isLoading ||
		salesforceQuery.isRefetching ||
		crmLeadInfoLoading ||
		refetchingCrmLeadInfo;
	// const insights = salesforceQuery.data?.insights;
	const crm = salesforceQuery.data?.crm;
	const potentialLicence = salesforceQuery.data?.potentialLicence;

	const INTEGRATION_ICON = getIntegrationIconForLead({
		lead_integration_type: lead?.integration_type,
		box: true,
	});
	// usecadenceForLead takes 4 parameter {cadenceId,enabled:true,serachValue,selectAllLeads:false}
	const cadenceLeadsDataAccess = useCadenceForLead(
		{ cadenceId: activeTaskInfo?.Cadence?.cadence_id },
		true,
		"",
		false
	);

	//set phoneNumbers
	useEffect(() => {
		const phoneNumbers = lead?.Lead_phone_numbers?.filter(pn => pn.phone_number) ?? [];
		if (lead && phoneNumbers?.length > 0)
			setPrimaryPhone(
				phoneNumbers.filter(phone => phone.is_primary)[0] ?? phoneNumbers[0]
			);
		else {
			const accountNumber = lead?.Account?.phone_number;
			if (accountNumber) {
				const accountNumberObj = {
					lpn_id: crypto.randomUUID(),
					is_primary: false,
					is_account: true,
					phone_number: accountNumber,
					formatted_phone_number: accountNumber,
				};
				setPrimaryPhone(accountNumberObj);
			} else setPrimaryPhone(null);
		}
	}, [lead?.Lead_phone_numbers, lead]);

	//set timeString based upon primary phone
	useEffect(() => {
		if (primaryPhone?.timezone) {
			setTimestring(
				`${moment().tz(primaryPhone?.timezone).format("hh:mm A")}, ${
					primaryPhone?.timezone
				}`
			);
		} else {
			setTimestring(null);
		}
	}, [primaryPhone]);

	//related leads
	useEffect(() => {
		if (!relatedLeadData) setShowBriefcase(false);
		if (relatedLeadData?.length < 1) setShowBriefcase(false);
		if (relatedLeadData?.length === 1 && !checkIfSameLead(relatedLeadData[0]))
			setShowBriefcase(false);
		if (relatedLeadData?.length > 1) setShowBriefcase(true);
	}, [relatedLeadData]);

	useEffect(() => {
		if (cadenceState.isStopped || cadenceState.isPaused)
			setCadenceState({
				...cadenceState,
				isStopped: false,
				isPaused: false,
			});
	}, [activeTaskInfo]);

	useEffect(() => {
		if (
			crmLeadInfoError &&
			IS_CUSTOM_VARS_AVL_FOR_LEAD_INTEGRATION.includes(lead?.integration_type)
		)
			addError({
				text: crmLeadInfoError?.response?.data?.msg,
				desc: crmLeadInfoError?.response?.data?.error,
				cId: crmLeadInfoError?.response?.data?.correlationId,
			});
	}, [crmLeadInfoError]);

	// current/overall steps
	const calculateSteps = () => {
		if (activeTaskInfo?.Cadence?.Nodes.length >= 1) {
			return (
				<span>
					{COMMON_TRANSLATION.STEP[user?.language?.toUpperCase()]}{" "}
					{activeTaskInfo?.Node?.step_number}/{activeTaskInfo?.Cadence?.Nodes.length}
				</span>
			);
		}
		return null;
	};

	//calculate total steps completed
	const calculateCompletion = () => {
		if (
			activeTaskInfo?.Cadence?.Nodes.length >= 1 &&
			!taskToBeRemoved &&
			!activeTaskInfo?.completed
		) {
			return (
				<span>
					{Math.round(
						((parseInt(activeTaskInfo?.Node?.step_number) - 1) /
							parseInt(activeTaskInfo?.Cadence?.Nodes.length)) *
							100
					)}
					% {COMMON_TRANSLATION.DONE[user?.language?.toUpperCase()]}
				</span>
			);
		} else if (
			activeTaskInfo?.Cadence?.Nodes.length >= 1 &&
			(taskToBeRemoved || activeTaskInfo?.completed)
		) {
			return (
				<span>
					{Math.round(
						(parseInt(activeTaskInfo?.Node?.step_number) /
							parseInt(activeTaskInfo?.Cadence?.Nodes.length)) *
							100
					)}
					% {COMMON_TRANSLATION.FILTERS[user?.language?.toUpperCase()]}
				</span>
			);
		}
		return null;
	};

	const moveToNextProductTourStep = () => {
		localStorage.removeItem(LOCAL_STORAGE_KEYS.NEXT_TASK_ID_FOR_TOUR);
		let updatedStep = {};
		setTour(prev => {
			updatedStep.step =
				tour?.steps_order[tour?.steps_order.indexOf(prev.currentStep) + 1];
			updatedStep.url = `${window.location.pathname}${window.location.search}${window.location.hash}`;

			return prev;
		});
		updateUser(
			{
				product_tour_step: {
					step: updatedStep.step,
					url: updatedStep.url,
				},
			},
			{
				onSuccess: () => {
					setTour(prev => ({
						...prev,
						currentStep: updatedStep.step,
						currentUrl: updatedStep.url,
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
						currentStepCompleted: false,
						isError: true,
					}));
				},
			}
		);
	};

	//complete current task
	const markTaskAsCompleteIfCurrent = async (type, body, cb = () => null) => {
		if (getTaskEnum(activeTaskInfo) === type) {
			if (body && body?.isSampleTaskForTour) {
				const data = {
					task_id: activeTaskInfo?.task_id,
					...body,
				};
				delete data.isSampleTaskForTour;
				let currentStep = data.currentStep;
				delete data.currentStep;
				markSampleTaskComplete(data, {
					onSuccess: () => {
						cb();
						setTaskToBeRemoved({
							task_id: data?.task_id,
							lead_id: activeTaskInfo?.Lead?.lead_id,
							action: data?.is_scheduled ? "task_scheduled" : "task_completed",
						});
						if (currentStep === INITIAL_TOUR_STEPS_ENUM.CLICK_SEND_LINKEDIN_CONNECTION) {
							updateUser(
								{
									product_tour_step: {
										step: INITIAL_TOUR_STEPS_ENUM.DEMO_COMPLETED_MODAL,
										url: "/crm/tasks",
									},
								},
								{
									onSuccess: () =>
										setTour(prev => ({
											...prev,
											currentStep: INITIAL_TOUR_STEPS_ENUM.DEMO_COMPLETED_MODAL,
											currentUrl: "/crm/tasks",
											currentStepCompleted: false,
										})),
									onError: err =>
										addError({
											text: err?.response?.data?.msg,
											desc: err?.response?.data?.error,
											cId: err?.response?.data?.correlationId,
										}),
								}
							);
						} else {
							refetchTasks();
							moveToNextProductTourStep();
						}
					},
					onError: err => {
						addError({
							text: err?.response?.data?.msg,
							desc: err?.response?.data?.error,
							cId: err?.response?.data?.correlationId,
						});
						setTour(prev => ({
							...prev,
							currentStepCompleted: false,
							isError: true,
						}));
					},
				});
			} else {
				const data = {
					task_id: activeTaskInfo?.task_id,
					body: {
						template_id: activeTaskInfo?.Node?.data?.template_id ?? null,
						template_type: activeTaskInfo?.Node?.data?.template_type ?? null,
						...(body ?? {}),
					},
				};
				if (power.status === POWER_STATUS.BOOSTED && ["mail", "reply_to"].includes(type))
					data.body.isFocus = true;

				markTaskAsComplete(data, {
					onSuccess: () => {
						cb();
						setTaskToBeRemoved({
							task_id: data?.task_id,
							lead_id: activeTaskInfo?.Lead?.lead_id,
							action: data?.is_scheduled ? "task_scheduled" : "task_completed",
						});
						changeToNextPowerTask();
					},
					onError: err => {
						if (
							err?.response?.data?.msg?.includes("already completed") ||
							err?.response?.data?.msg?.includes("already scheduled")
						) {
							setTaskToBeRemoved({
								task_id: data?.task_id,
								lead_id: activeTaskInfo?.Lead?.lead_id,
								action: "task_completed",
							});
							changeToNextPowerTask();
						}
					},
				});
			}
		}
	};

	//handle CTA click
	const handleActionClick = ({ type, customFields, validateTask = true }) => {
		setActiveModalParams({
			type: type ?? getTaskEnum(activeTaskInfo),
			typeSpecificProps: {
				...customFields,
				validateTask,
				lead,
				fieldMap,
				cadence: activeTaskInfo?.Cadence,
				node: activeTaskInfo?.Node,
				refetchLead,
				markTaskAsCompleteIfCurrent: async (body, cb) =>
					await markTaskAsCompleteIfCurrent(getTaskEnum(activeTaskInfo), body, cb),
				stopPower,
				activeTaskId: activeTaskInfo?.task_id,
				countries,
			},
			modalProps: {
				isModal: true,
				onClose: () => {
					//remember this setState not only closes the modal but also reinitalizes all keys back to their original values,
					//if there was a change innerModalState(inside GlobalModals) its values will be reinitialized with isModal:false
					navigate(`?task_id=${activeTaskInfo?.task_id}`);
					setActiveModalParams(null);
				},
			},
		});
	};

	const isCallAndSmsDisabled = useCallback(
		() => user?.phone_system === PHONE_INTEGRATIONS.NONE,
		[user]
	);

	const validateTask = async () =>
		await markTaskAsCompleteIfCurrent(getTaskEnum(activeTaskInfo));

	const handleCallClick = number => {
		if (
			isCallAndSmsDisabled() &&
			tour?.status !== PRODUCT_TOUR_STATUS.AFTER_ONBOARDING_PENDING
		) {
			addError({ text: "No phone system selected." });
			return;
		}
		if (tour?.status === PRODUCT_TOUR_STATUS.AFTER_ONBOARDING_PENDING) {
			setTourDialer({
				name: `${lead?.first_name} ${lead?.last_name}`,
				job_position: lead?.job_position,
				email: lead?.Lead_emails?.find(em => em.is_primary).email_id,
				from_number: user?.primary_phone_number,
				to_number: lead?.Lead_phone_numbers?.find(pn => pn.is_primary).phone_number,
				task_id: activeTaskInfo?.task_id,
			});
			return;
		}

		simpleSDK.show();
		simpleSDK.dial(number);
		forceUpdate();

		const obj = {
			lead_id: lead?.lead_id,
			task_id: activeTaskInfo?.task_id,
			node_id: activeTaskInfo?.Node?.node_id,
			task_name: activeTaskInfo?.Node?.type ?? activeTaskInfo?.name,
			minimum_time_for_call_validation:
				fieldMap?.Company_Setting?.minimum_time_for_call_validation,
			cadence_id: activeTaskInfo?.Cadence?.cadence_id ?? null,
			Node: activeTaskInfo?.Node,
		};
		localStorage.setItem("current_lead_and_task", JSON.stringify(obj));
	};

	const getLeadInfo = () => {
		switch (lead?.integration_type) {
			case LEAD_INTEGRATION_TYPES.SALESFORCE_LEAD:
			case LEAD_INTEGRATION_TYPES.SALESFORCE_CONTACT:
			case LEAD_INTEGRATION_TYPES.HUBSPOT_CONTACT:
			case LEAD_INTEGRATION_TYPES.PIPEDRIVE_PERSON:
			case LEAD_INTEGRATION_TYPES.ZOHO_LEAD:
			case LEAD_INTEGRATION_TYPES.ZOHO_CONTACT:
			case LEAD_INTEGRATION_TYPES.SELLSY_CONTACT:
			case LEAD_INTEGRATION_TYPES.BULLHORN_LEAD:
			case LEAD_INTEGRATION_TYPES.BULLHORN_CONTACT:
			case LEAD_INTEGRATION_TYPES.BULLHORN_CANDIDATE:
				return crmLeadInfo;
			default:
				return null;
		}
	};

	const refetchInfo = () => {
		switch (lead?.integration_type) {
			case LEAD_INTEGRATION_TYPES.SALESFORCE_LEAD:
			case LEAD_INTEGRATION_TYPES.SALESFORCE_CONTACT:
			case LEAD_INTEGRATION_TYPES.HUBSPOT_CONTACT:
			case LEAD_INTEGRATION_TYPES.PIPEDRIVE_PERSON:
			case LEAD_INTEGRATION_TYPES.ZOHO_LEAD:
			case LEAD_INTEGRATION_TYPES.ZOHO_CONTACT:
			case LEAD_INTEGRATION_TYPES.SELLSY_CONTACT:
			case LEAD_INTEGRATION_TYPES.BULLHORN_LEAD:
			case LEAD_INTEGRATION_TYPES.BULLHORN_CONTACT:
			case LEAD_INTEGRATION_TYPES.BULLHORN_CANDIDATE:
				refetchCrmLeadInfo();
		}
	};

	const handleIntegrationIconClick = () => {
		switch (lead?.integration_type) {
			case LEAD_INTEGRATION_TYPES.SALESFORCE_CSV_LEAD:
			case LEAD_INTEGRATION_TYPES.SALESFORCE_GOOGLE_SHEET_LEAD:
			case LEAD_INTEGRATION_TYPES.PIPEDRIVE_CSV_PERSON:
			case LEAD_INTEGRATION_TYPES.PIPEDRIVE_GOOGLE_SHEET_PERSON:
			case LEAD_INTEGRATION_TYPES.HUBSPOT_CSV_CONTACT:
			case LEAD_INTEGRATION_TYPES.HUBSPOT_GOOGLE_SHEET_CONTACT:
			case LEAD_INTEGRATION_TYPES.ZOHO_CSV_LEAD:
			case LEAD_INTEGRATION_TYPES.ZOHO_GOOGLE_SHEET_LEAD:
			case LEAD_INTEGRATION_TYPES.SELLSY_CSV_CONTACT:
			case LEAD_INTEGRATION_TYPES.SELLSY_GOOGLE_SHEET_CONTACT:
			case LEAD_INTEGRATION_TYPES.BULLHORN_CSV_LEAD:
			case LEAD_INTEGRATION_TYPES.BULLHORN_GOOGLE_SHEET_LEAD: {
				break;
			}
			default: {
				window.open(
					getLeadIntegrationUrl({
						user,
						lead,
					}),
					"_blank"
				);
			}
		}
	};

	const getTextForIntegrationIcon = () => {
		switch (lead?.integration_type) {
			case LEAD_INTEGRATION_TYPES.SALESFORCE_CSV_LEAD:
			case LEAD_INTEGRATION_TYPES.ZOHO_CSV_LEAD:
			case LEAD_INTEGRATION_TYPES.BULLHORN_CSV_LEAD:
				return "CSV Lead";
			case LEAD_INTEGRATION_TYPES.SALESFORCE_GOOGLE_SHEET_LEAD:
			case LEAD_INTEGRATION_TYPES.ZOHO_GOOGLE_SHEET_LEAD:
			case LEAD_INTEGRATION_TYPES.BULLHORN_GOOGLE_SHEET_LEAD:
				return "Google Sheet Lead";
			case LEAD_INTEGRATION_TYPES.PIPEDRIVE_CSV_PERSON:
				return "CSV Person";
			case LEAD_INTEGRATION_TYPES.PIPEDRIVE_GOOGLE_SHEET_PERSON:
				return "Google Sheet Person";
			case LEAD_INTEGRATION_TYPES.HUBSPOT_CSV_CONTACT:
			case LEAD_INTEGRATION_TYPES.SELLSY_CSV_CONTACT:
				return "CSV Contact";
			case LEAD_INTEGRATION_TYPES.HUBSPOT_GOOGLE_SHEET_CONTACT:
			case LEAD_INTEGRATION_TYPES.SELLSY_GOOGLE_SHEET_CONTACT:
				return "Google Sheet Contact";
			default:
				return `Open in ${capitalize(user?.integration_type.replace("_", " "))}`;
		}
	};

	const renderTaskStatus = () => {
		if (
			taskToBeRemoved !== null &&
			activeTaskInfo?.Lead?.lead_id !== taskToBeRemoved?.lead_id
		)
			return null;
		if (
			taskToBeRemoved?.action === "task_completed" ||
			activeTaskInfo?.completed === true
		) {
			return <TaskComplete className={styles.taskComplete} />;
		}
		if (
			taskToBeRemoved?.action === "task_scheduled" ||
			activeTaskInfo?.status === "scheduled"
		) {
			return <TaskScheduled activeTaskInfo={activeTaskInfo} />;
		}
		if (taskToBeRemoved?.action === "task_skipped")
			return <TaskSkipped className={styles.taskComplete} />;
		if (taskToBeRemoved?.action === "task_to_be_removed") return <div></div>;
	};

	// check if same Lead
	const checkIfSameLead = fetchedLead => {
		if (
			fetchedLead?.lead_id_db === lead?.lead_id ||
			fetchedLead?.lead_id === lead?.lead_id
		) {
			return false;
		}
		if (fetchedLead?.lead_id_db === null) {
			if (
				fetchedLead?.attributes.type === "Lead" &&
				fetchedLead?.Id === lead?.salesforce_lead_id
			) {
				return false;
			} else if (
				fetchedLead?.attributes.type === "Contact" &&
				fetchedLead?.Id === lead?.salesforce_contact_id
			) {
				return false;
			}
		}
		return true;
	};

	const handleSkipTask = async () => {
		setLocalModal({
			modalType: LOCAL_MODAL_TYPES.SKIP_TASK,
			cadence: activeTaskInfo?.Cadence,
			id: activeTaskInfo?.task_id,
			activeTaskInfo: activeTaskInfo,
		});
	};

	const handleDeleteHotLead = async () => {
		try {
			let body = {
				lead_id: lead?.lead_id,
			};
			removeHotLeadStatus(body, {
				onSuccess: () => {
					addSuccess("Hot Lead Status Successfully Removed");
					setShowHotLead(false);
					setHotLeadFromSocket(false);
					setTasks(prev =>
						removeCurrentHotLeadsFromTask({
							tasks: prev,
							activeTaskInfo,
						})
					);
				},
				onFailure: () => {
					addError({ text: "Unable to remove hot lead status" });
				},
			});
		} catch (err) {
			addError({ text: "Unable to remove hot lead status" });
		}
	};

	return (
		<>
			<div className={styles.container}>
				<div className={styles.tags}>
					{lead?.duplicate && (
						<span
							className={styles.duplicateTag}
							onClick={() =>
								setLocalModal({
									modalType: LOCAL_MODAL_TYPES.DUPLICATES_LEAD,
									lead,
								})
							}
						>
							{COMMON_TRANSLATION.DUPLICATE[user?.language?.toUpperCase()]}
						</span>
					)}
					{(hotLeadFromSocket ||
						(showHotLead && lead?.lead_warmth === LEAD_WARMTH.HOT_LEAD)) && (
						<div
							className={`${styles.hotLead} ${
								showRemoveHotLead ? styles.showRemove : ""
							}`}
							onMouseEnter={() => setShowRemoveHotLead(true)}
							onMouseLeave={() => setShowRemoveHotLead(false)}
						>
							<span>
								<HotLead />
							</span>
							<span
								className={`${styles.hotLeadActions} ${
									showRemoveHotLead ? styles.visible : styles.hidden
								}`}
							>
								<Minus
									onClick={() =>
										setLocalModal({
											modalType: LOCAL_MODAL_TYPES.REMOVE_HOT_LEAD_TAG,
											onDelete: handleDeleteHotLead,
											lead,
										})
									}
								/>
								<View
									onClick={() =>
										setLocalModal({
											modalType: LOCAL_MODAL_TYPES.LEAD_SCORE_REASONS,
											lead,
										})
									}
								/>
							</span>
						</div>
					)}
				</div>
				{/* TOP LAYER LOGOS BELOW */}
				{tour?.status !== PRODUCT_TOUR_STATUS.AFTER_ONBOARDING_PENDING && (
					<span className={styles.logos}>
						{getIntegrationDetailAvailability({
							user,
							lead,
						}) && (
							<Tooltip text={getTextForIntegrationIcon()} className={styles.editTooltip}>
								<INTEGRATION_ICON
									style={
										lead?.integration_type === LEAD_INTEGRATION_TYPES.ZOHO_LEAD ||
										lead?.integration_type === LEAD_INTEGRATION_TYPES.ZOHO_CONTACT
											? {
													width: "3.5rem",
													height: "3.5rem",
													cursor: "pointer",
											  }
											: {
													width: "2.85rem",
													height: "2.85rem",
													cursor: "pointer",
											  }
									}
									onClick={handleIntegrationIconClick}
								/>
							</Tooltip>
						)}
						{lead?.linkedin_url && (
							<Tooltip
								text={COMMON_TRANSLATION.OPEN_IN_LINKEDIN[user?.language?.toUpperCase()]}
								className={styles.editTooltip}
							>
								<LinkedinBox
									style={{ cursor: "pointer" }}
									size="2.85rem"
									color={"#0077b5"}
									onClick={() => window.open(getValidLink(lead?.linkedin_url))}
								/>
							</Tooltip>
						)}
						{lead?.Account?.url && (
							<Tooltip
								text={COMMON_TRANSLATION.COMPANY_LINK[user?.language?.toUpperCase()]}
								className={styles.editTooltip}
							>
								<LinkBox
									size="2.8rem"
									color={"##5671"}
									style={{ cursor: "pointer" }}
									back
									onClick={() => window.open(getValidLink(lead?.Account?.url))}
								/>
							</Tooltip>
						)}
						{salesforceLoading ? (
							<Skeleton className={styles.salesforceLoading} />
						) : salesforceSuccess ? (
							showBriefcase ? (
								<Tooltip
									text={
										COMMON_TRANSLATION.OPEN_RELATED_LEADS[user?.language?.toUpperCase()]
									}
									className={`${styles.relatedLeadsBtn} ${styles.editTooltip}`}
								>
									<BriefcaseBox
										style={{ cursor: "pointer" }}
										onClick={() =>
											setLocalModal({
												modalType: LOCAL_MODAL_TYPES.RELATED_LEAD,
												lead,
												data: relatedLeadData,
												relatedLeadLoading,
											})
										}
									/>
									<span className={styles.count}>
										{relatedLeadData?.filter(lead => checkIfSameLead(lead)).length}
									</span>
								</Tooltip>
							) : null
						) : null}
						{(user?.integration_type === INTEGRATION_TYPE.ZOHO ||
							user?.integration_type === INTEGRATION_TYPE.DYNAMICS ||
							user?.integration_type === INTEGRATION_TYPE.SELLSY) && (
							<div>
								{relatedLeadLoading ? (
									<Skeleton className={styles.salesforceLoading} />
								) : (
									showBriefcase && (
										<Tooltip
											text={
												COMMON_TRANSLATION.OPEN_RELATED_LEADS[
													user?.language?.toUpperCase()
												]
											}
											className={`${styles.relatedLeadsBtn} ${styles.editTooltip}`}
										>
											<BriefcaseBox
												style={{ width: "3em", height: "3em", cursor: "pointer" }}
												onClick={() =>
													setLocalModal({
														modalType: LOCAL_MODAL_TYPES.RELATED_LEAD,
														lead,
														data: relatedLeadData,
														relatedLeadLoading,
													})
												}
											/>
											<span className={styles.count}>
												{relatedLeadData?.filter(lead => checkIfSameLead(lead)).length}
											</span>
										</Tooltip>
									)
								)}
							</div>
						)}
					</span>
				)}
				{/* NAME INFO BELOW */}
				<Div
					span={true}
					loading={leadLoading}
					className={styles.leadNameContainer}
					style={{
						marginTop: leadLoading ? "0.15em" : "",
					}}
				>
					<span onClick={() => window.open(`/crm/leads/${lead?.lead_id}`)}>
						{lead?.first_name ?? ""} {lead?.last_name ?? ""}
					</span>
					{timeString && (
						<Tooltip text={timeString} theme={TooltipThemes.BOTTOM}>
							<Timezone
								color={
									moment.tz(userTimezone).format("z") ===
									moment.tz(primaryPhone?.timezone).format("z")
										? Colors.lightBlue
										: Colors.orange
								}
								size="2.1rem"
							/>
						</Tooltip>
					)}
					<Button
						onClick={() =>
							setActiveModalParams({
								type: GLOBAL_MODAL_TYPES.EDIT_LEAD,
								typeSpecificProps: {
									countries,
									lead,
									fieldMap,
									refetchLead,
									info: getLeadInfo(),
									refetchInfo,
								},
								modalProps: {
									isModal: true,
									onClose: () => setActiveModalParams(null),
								},
							})
						}
						className={styles.editLeadBtn}
						btnwidth="1.7rem"
						btnheight="1.7rem"
						disabled={salesforceLoading}
					>
						<Tooltip
							text={COMMON_TRANSLATION.EDIT[user?.language?.toUpperCase()]}
							className={styles.editTooltip}
						>
							<Edit size="1rem" />
						</Tooltip>
					</Button>
				</Div>
				<div>
					{/* COMPANY INFO BELOW */}
					<Div
						span={true}
						loading={leadLoading}
						style={{
							marginTop: leadLoading ? "0.25em" : "",
						}}
						className={styles.companyInfo}
					>
						{(lead?.job_position || lead?.Account?.name) && (
							<>
								<Briefcase size="1.1em" />
								<p>
									{lead?.job_position ? (
										<span className={styles.jobPosition} title={lead?.job_position}>
											{lead?.job_position}
										</span>
									) : (
										COMMON_TRANSLATION.WORKS[user?.language?.toUpperCase()]
									)}{" "}
									{lead?.Account?.name &&
										COMMON_TRANSLATION.AT[user?.language?.toUpperCase()]}{" "}
									<span className={styles.companyName} title={lead?.Account?.name}>
										{lead?.Account?.name}
									</span>{" "}
									{lead?.Account?.size ? `with ${lead?.Account?.size} people` : ""}
								</p>
							</>
						)}
					</Div>
					{/* EMAIL INFO BELOW */}
					<Div
						loading={leadLoading}
						style={{
							marginTop: leadLoading ? "0.15em" : "",
						}}
						className={styles.emailContainer}
					>
						{lead?.Lead_emails &&
							lead?.Lead_emails.length > 0 &&
							lead?.Lead_emails.filter(em => em.email_id.length).map((email, index) => {
								return (
									<span
										key={email.lem_id}
										onClick={() => {
											handleActionClick({
												type: "mail",
												customFields: {
													mailData: getMailData({
														lead: lead,
														to: email.email_id,
														cadence_id: activeTaskInfo?.Cadence?.cadence_id,
														node_id: activeTaskInfo?.Node?.node_id,
														cc: activeTaskInfo?.Node?.data?.cc,
														bcc: activeTaskInfo?.Node?.data?.bcc,
														et_id: activeTaskInfo?.Node?.data?.et_id,
													}),
												},
												validateTask: false,
											});
										}}
										className={styles.emails}
									>
										<Email size="1.2rem" />
										<a>
											{!email?.email_id || email?.email_id === ""
												? "NA"
												: email?.email_id}
										</a>
									</span>
								);
							})}
					</Div>
					{/* PHONE NUMBER INFO BELOW */}
					<Div
						className={styles.phoneNumbers}
						loading={leadLoading}
						style={{
							marginTop: leadLoading ? "0.15em" : "",
						}}
					>
						{lead?.Account?.phone_number && (
							<PhoneDetails
								phone={lead?.Account?.phone_number}
								setActiveModalParams={setActiveModalParams}
								lead={lead}
								fieldMap={fieldMap}
								refetchLead={refetchLead}
								handleCallClick={handleCallClick}
							/>
						)}
						{lead?.Lead_phone_numbers?.filter(phone => phone.phone_number.length > 0).map(
							phone => (
								<PhoneDetails
									phone={phone}
									setActiveModalParams={setActiveModalParams}
									lead={lead}
									fieldMap={fieldMap}
									refetchLead={refetchLead}
									handleCallClick={handleCallClick}
								/>
							)
						)}
					</Div>
					{/* ZIPCODE, COUNTRY */}
					<Div
						className={styles.zipCountry}
						loading={leadLoading || fetchAddressesLoading}
						style={{
							marginTop: leadLoading || fetchAddressesLoading ? "0.15em" : "",
						}}
					>
						{user?.integration_type === INTEGRATION_TYPE.SELLSY
							? (companyAddress?.postal_code || companyAddress?.country) && (
									<>
										<Location size="1.2rem" /> {companyAddress?.postal_code}
										{companyAddress?.postal_code && companyAddress?.country && ", "}
										{companyAddress?.country}
									</>
							  )
							: (lead?.Account?.zipcode || lead?.Account?.country) && (
									<>
										<Location size="1.2rem" /> {lead?.Account?.zipcode}
										{lead?.Account?.zipcode && lead?.Account?.country && ", "}
										{lead?.Account?.country}
									</>
							  )}
					</Div>

					<Div
						className={styles.variables}
						loading={leadLoading || salesforceLoading}
						style={{
							marginTop: leadLoading ? "0.15em" : ".3em",
							cursor: "pointer",
							minHeight: "12px",
							display: CUSTOM_VARIABLE_FIELD_AVAILABLE.includes(lead?.integration_type)
								? "flex"
								: "none",
						}}
					>
						<CustomVariableButtons
							styles={styles}
							customVariables={
								lead?.integration_type === LEAD_INTEGRATION_TYPES.SALESFORCE_LEAD
									? getLeadVariables(lead, fieldMap, getLeadInfo())
									: getContactVariables(lead, fieldMap, getLeadInfo())
							}
							setActiveModalParams={setActiveModalParams}
							countries={countries}
							lead={lead}
							fieldMap={fieldMap}
							refetchInfo={refetchInfo}
							refetchLead={refetchLead}
							getLeadInfo={getLeadInfo}
							salesforceLoading={salesforceLoading}
							scrollType={
								lead?.integration_type === LEAD_INTEGRATION_TYPES.SALESFORCE_LEAD
									? LEAD_INTEGRATION_TYPES.SALESFORCE_LEAD
									: LEAD_INTEGRATION_TYPES.SALESFORCE_CONTACT
							}
							tooltipText={
								lead?.integration_type === LEAD_INTEGRATION_TYPES.SALESFORCE_LEAD
									? "Lead variable"
									: "Contact variable"
							}
						/>

						{CUSTOM_VARIABLE_FIELD_AVAILABLE.includes(
							LEAD_INTEGRATION_TYPES.SALESFORCE_CONTACT
						) &&
							getAccountVariables(lead, fieldMap, getLeadInfo())?.length > 0 && (
								<CustomVariableButtons
									styles={styles}
									customVariables={getAccountVariables(lead, fieldMap, getLeadInfo())}
									setActiveModalParams={setActiveModalParams}
									countries={countries}
									lead={lead}
									fieldMap={fieldMap}
									refetchInfo={refetchInfo}
									refetchLead={refetchLead}
									getLeadInfo={getLeadInfo}
									salesforceLoading={salesforceLoading}
									tooltipText={"Account variable"}
									scrollType={"salesforce_account"}
								/>
							)}
					</Div>

					<Div className={styles.salesforceData}>
						{/* POTENTICAL LICENSE INFO BELOW */}
						{potentialLicence && (
							<Div
								loading={salesforceQuery.isLoading}
								className={styles.potentialLicence}
							>
								<PotentialLicence />
								{potentialLicence}
							</Div>
						)}
						{/* CRM INSIGHT BELOW */}
						{crm?.length > 0 && crm?.[0] !== "None" && (
							<Div loading={salesforceQuery.isLoading} className={styles.crm}>
								<Crm />
								{crm?.length > 0 ? crm[0] : null}
								{crm?.length > 1 && `, ${crm[1].slice(0, 5)}..`}
								<button
									onClick={() =>
										setLocalModal({
											title: "CRMs",
											data: crm,
											modalType: LOCAL_MODAL_TYPES.INSIGHTS,
										})
									}
								>
									{crm?.length > 1 && `(+${crm?.length - 1})`}
								</button>
							</Div>
						)}
					</Div>
					{/* CADENCE INFO BELOW */}

					{!activeTaskInfo?.completed && (
						<Div loading={leadLoading} className={styles.cadenceDetails}>
							{activeTaskInfo?.Cadence &&
								!leadLoading &&
								activeTaskInfo?.Node?.step_number > 0 && (
									<>
										<p
											onClick={() =>
												setLocalModal({
													modalType: LOCAL_MODAL_TYPES.NODES_POPUP,
													cadence: activeTaskInfo?.Cadence,
												})
											}
											className={styles.clickable}
										>
											{activeTaskInfo?.Cadence?.name}
										</p>
										<i>•</i>
										<span>{calculateCompletion()}</span>
										<i>•</i>
										<span>{calculateSteps()}</span>
									</>
								)}
							{(stepName?.toLowerCase() === "call" ||
								stepName?.toLowerCase() === "callback") &&
								activeTaskInfo?.Node?.data?.script &&
								activeTaskInfo?.Node?.data?.script !== "" && (
									<>
										{activeTaskInfo?.Cadence && <i>•</i>}
										<span
											onClick={() => {
												handleActionClick({
													type: "view_script",
													customFields: { disableEdit: true },
													validateTask: false,
												});
											}}
											className={styles.viewScript}
										>
											Script
										</span>
									</>
								)}

							{/* TO USE DROPDOWN COMPONENT HERE */}

							{/* {(!cadenceState.isPaused ||
								!cadenceState.isStopped ||
								taskToBeRemoved?.lead_id !== activeTaskInfo?.Lead?.lead_id) && ( */}
							<div className={styles.moreBtnWrapper}>
								<DropDown
									tooltipText={COMMON_TRANSLATION.MORE[user?.language?.toUpperCase()]}
									btn={
										<ThemedButton
											height="40px"
											width="fit-content"
											theme={ThemedButtonThemes.GREY}
											className={styles.btnMore}
										>
											<More />
										</ThemedButton>
									}
									right={"0rem"}
									width={
										user?.language === LANGUAGES.SPANISH
											? "220px"
											: user?.language === LANGUAGES.FRENCH
											? "170px"
											: "150px"
									}
								>
									{taskToBeRemoved?.lead_id !== activeTaskInfo?.Lead?.lead_id && (
										<button className={styles.menuOptionBtn} onClick={handleSkipTask}>
											{TASKS_TRANSLATION.SKIP_TASK[user?.language?.toUpperCase()]}
										</button>
									)}
									{!CUSTOM_TASK_NODE_IDS.includes(activeTaskInfo?.Node?.node_id) && (
										<>
											{!cadenceState.isPaused && (
												<button
													className={styles.menuOptionBtn}
													onClick={() =>
														setLocalModal({
															modalType: LOCAL_MODAL_TYPES.PAUSE_CADENCE,
															...activeTaskInfo?.Cadence,
															...lead,
														})
													}
												>
													{TASKS_TRANSLATION.PAUSE_CADENCE[user?.language?.toUpperCase()]}
												</button>
											)}
											{!cadenceState.isStopped && (
												<button
													className={styles.menuOptionBtn}
													onClick={() =>
														setLocalModal({
															modalType: LOCAL_MODAL_TYPES.STOP_CADENCE,
															...activeTaskInfo?.Cadence,
															...lead,
														})
													}
												>
													{TASKS_TRANSLATION.STOP_CADENCE[user?.language?.toUpperCase()]}
												</button>
											)}
											<button
												className={styles.menuOptionBtn}
												onClick={() => setCalendarModal(true)}
											>
												{TASKS_TRANSLATION.BOOK_A_DEMO[user?.language?.toUpperCase()]}
											</button>
										</>
									)}
									{lead?.integration_type !==
										LEAD_INTEGRATION_TYPES.GOOGLE_SHEETS_LEAD && (
										<button
											className={styles.menuOptionBtn}
											onClick={() =>
												setReplaceCadenceModal({
													lead_ids: [lead?.lead_id],
													cadence_id: activeTaskInfo?.Cadence.cadence_id,
													option: "selected",
												})
											}
										>
											<span>
												{
													CADENCE_TRANSLATION?.MOVE_TO_ANOTHER_CADENCE?.[
														user?.language?.toUpperCase()
													]
												}
											</span>
										</button>
									)}
								</DropDown>
							</div>
						</Div>
					)}
				</div>

				{/* RENDER TASK STATUS BELOW*/}
				{renderTaskStatus() ?? (
					<TaskButton
						handleActionClick={handleActionClick}
						handleCallClick={handleCallClick}
						validateTask={validateTask}
						activeTaskInfo={activeTaskInfo}
						lead={lead}
						loading={
							leadLoading || markTaskAsCompleteLoading || markSampleTaskCompleteLoading
						}
						callLoading={callLoading}
						userId={userId}
						primaryPhone={primaryPhone}
						setPrimaryPhone={setPrimaryPhone}
					/>
				)}
				{/* NEXT NODE INFO BELOW*/}
				{taskToBeRemoved?.action !== "task_to_be_removed" &&
					!activeTaskInfo?.completed &&
					activeTaskInfo?.Cadence &&
					activeTaskInfo?.Node?.next_node_id &&
					nextNode &&
					nextNode?.type !== "end" &&
					!leadLoading && (
						<div className={styles.futureStep}>
							<p>
								{COMMON_TRANSLATION.NEXT_STEP[user?.language?.toUpperCase()]}&nbsp;
								{parseInt(nextNode.wait_time) === 0
									? "Instant"
									: moment(
											parseInt(
												moment().add(parseInt(nextNode.wait_time), "minutes").format("x")
											)
									  ).fromNow()}{" "}
								{COMMON_TRANSLATION?.WITH?.[user?.language?.toUpperCase()]}{" "}
								<span>{TASKS[nextNode.type]}</span>
							</p>
						</div>
					)}
				<GlobalModals {...activeModalParams} />
			</div>
			<CalendarEventsModal
				isOpen={calendarModal}
				onClose={setCalendarModal}
				selectedLead={lead}
			/>
			<LocalModals
				lead={lead}
				leadLoading={leadLoading}
				refetchLead={refetchLead}
				modal={localModal}
				setModal={setLocalModal}
				cadenceState={cadenceState}
				setCadenceState={setCadenceState}
				changeToNextPowerTask={changeToNextPowerTask}
				updatePowerTaskStatus={updatePowerTaskStatus}
			/>
			{replaceCadenceModal && (
				<ReplaceCadenceModal
					modal={replaceCadenceModal}
					setModal={setReplaceCadenceModal}
					dataAccess={cadenceLeadsDataAccess}
					user={user}
				/>
			)}
			{tourDialer && (
				<TourCallDialer
					dialer={tourDialer}
					setDialer={setTourDialer}
					markTaskAsComplete={(body, cb) =>
						markTaskAsCompleteIfCurrent(getTaskEnum(activeTaskInfo), body, cb)
					}
				/>
			)}
		</>
	);
}

export default Details;

const TaskScheduled = ({ activeTaskInfo }) => {
	return (
		<div className={styles.taskScheduled}>
			<div className={styles.content}>
				<div className={styles.icon}>
					<Clock size="1rem" />
				</div>
				<span>
					Mail scheduled, task will be validated by{" "}
					{moment(activeTaskInfo?.start_time).format("Do MMM, hh:mm A")}
				</span>
				<p>Activity wil be created when the mail is sent</p>
			</div>
			<div className={styles.bgLogo1}>
				<CadenceLogoOrange size="100px" />
			</div>
			<div className={styles.bgLogo2}>
				<CadenceLogoOrange size="120px" />
			</div>
		</div>
	);
};
