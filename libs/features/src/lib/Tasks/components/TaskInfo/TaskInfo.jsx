/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-console */
import { useContext, useEffect, useState } from "react";
import styles from "./TaskInfo.module.scss";
import Actions from "./Actions/Actions";
import Details from "./Details/Details";
import LeadActivity from "./LeadActivities/LeadActivity";
import { useLead, useLeadSalesforce, useUser } from "@cadence-frontend/data-access";
//constants
import { ACCOUNT_STAGES, LEAD_STAGES } from "../../constants";
import { tempActivities } from "./LeadActivities/tempData";
import { useTasks } from "@cadence-frontend/data-access";
import { powerInfo, tourInfo, userInfo } from "@cadence-frontend/atoms";
import { useRecoilState, useRecoilValue } from "recoil";
import { Close } from "@cadence-frontend/icons";
import moment from "moment-timezone";
import { ThemedButton } from "@cadence-frontend/widgets";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { MessageContext } from "@cadence-frontend/contexts";
import { handleReceivedActivity } from "./utils";
import { ErrorBoundary, Tooltip } from "@cadence-frontend/components";
import { SocketContext } from "@cadence-frontend/contexts";
import {
	ACTIVITY_TYPES,
	INITIAL_TOUR_STEPS_ENUM,
	INTEGRATION_TYPE,
	LEAD_INTEGRATION_TYPES,
	POWER_MODAL_TYPES,
	POWER_STATUS,
	POWER_TASK_STATUS,
	PRODUCT_TOUR_STATUS,
	SOCKET_ON_EVENTS,
} from "@cadence-frontend/constants";
import {
	Common as COMMON_TRANSLATION,
	Tasks as TASKS_TRANSLATION,
} from "@cadence-frontend/languages";
import { removeCurrentHotLeadsFromTask, setCurrentHotLeadsFromTask } from "./constants";

const TaskInfo = ({
	activeTaskInfo,
	setActiveTaskInfo,
	tasks,
	setTasks,
	onSidebarClose,
	userId,
	stopPower,
	refetchTasks,
}) => {
	//hooks
	const user = useRecoilValue(userInfo);
	const [power, setPower] = useRecoilState(powerInfo);
	const [tour, setTour] = useRecoilState(tourInfo);
	const { addError } = useContext(MessageContext);
	const {
		leadInfo,
		leadInfoRefetch,
		leadInfoLoading,
		fieldMap,
		fieldMapLoading,
		fieldMapRefetch,
		cadenceListRefetch,
		leadActivities,
		activitiesLoading,
		activitiesRefetch,
		fetchAddresses,
		fetchAddressesLoading,
		setActiveLeadId,
		setNextNodeId,
		leadCountryData,
	} = useLead(null, { cadenceList: false });
	const { markTaskAsComplete, markTaskAsCompleteLoading, readActivity } = useTasks();
	const { updateUser } = useUser();
	const { addSocketHandler } = useContext(SocketContext);
	const [hotLeadFromSocket, setHotLeadFromSocket] = useState(false);
	const [countries, setCountries] = useState([]);

	useState(() => {
		if (user.integration_type === INTEGRATION_TYPE.BULLHORN) {
			leadCountryData(null, {
				onSuccess: data => {
					setCountries(data?.data);
				},
				onError: err => {
					addError({
						text: err.response?.data?.msg ?? "Error while fetching country",
						desc: err.response?.data?.error,
						cId: err?.response?.data?.correlationId,
					});
				},
			});
		}
	}, []);

	useEffect(() => {
		addSocketHandler({
			event_name: SOCKET_ON_EVENTS.ACTIVITY,
			key: "task_quickview",
			handler: activity => setLatestActivityFromSocket(activity),
		});
	}, [activeTaskInfo]);

	//states
	const [lead, setLead] = useState({});
	const [nextNode, setNextNode] = useState(null);
	const [isSalesforceAccount, setIsSalesforceAccount] = useState(false);
	const [isBullhornAccount, setIsBullhornAccount] = useState(false);
	const [activities, setActivities] = useState(tempActivities);
	const [latestActivityFromSocket, setLatestActivityFromSocket] = useState();
	const [taskToBeRemoved, setTaskToBeRemoved] = useState(null);
	const [companyAddress, setCompanyAddress] = useState([]);
	const [integrationStatusPicklist, setIntegrationStatusPicklist] = useState({});
	const [integrationStatusMap, setIntegrationStatusMap] = useState({});

	/**
	 * Salesforce Specific Fields
	 */

	const leadSalesforceDataAccess = useLeadSalesforce(
		{
			integration_id: lead?.integration_id,
			integration_type: lead?.integration_type,
			account_integration_id: lead?.Account?.integration_id,
			lead: fieldMap?.Company_Setting?.Integration_Field_Map,
		},
		lead?.integration_id && user?.integration_type === INTEGRATION_TYPE.SALESFORCE
	);

	//change active lead and next node states based upon active task
	useEffect(() => {
		if (activeTaskInfo?.Lead?.lead_id) {
			setActiveLeadId(activeTaskInfo?.Lead?.lead_id);
			setNextNodeId(activeTaskInfo?.Node?.next_node_id);
		} else {
			setLead(null);
			setActivities(null);
			setNextNodeId(null);
		}
		cleanTasks();
	}, [activeTaskInfo]);

	const cleanTasksAndCloseSidebar = () => {
		cleanTasks();
		onSidebarClose();
	};

	const refetchLeadDetails = () => {
		leadInfoRefetch();
		fieldMapRefetch();
		cadenceListRefetch();
		activitiesRefetch();
	};

	//remove unwanted tasks
	const cleanTasks = () => {
		if (taskToBeRemoved) {
			setTasks(prev => prev.filter(task => task.task_id !== taskToBeRemoved.task_id));
			setTaskToBeRemoved(null);
		}
	};

	//power
	const changeToNextPowerTask = () => {
		if (power.status !== POWER_STATUS.BOOSTED) return;
		let isLastTask;
		setPower(prev => {
			let tasks = prev.tasks;
			tasks = tasks.map((task, index, orgArr) => {
				if (task.active && index === orgArr.length - 1) {
					isLastTask = true;
					return { ...task, active: false, status: POWER_TASK_STATUS.COMPLETED };
				}
				if (task.active) {
					return { ...task, active: true, status: POWER_TASK_STATUS.COMPLETED };
				}
				return task;
			});
			return { ...prev, tasks };
		});
		if (isLastTask) stopPower(POWER_MODAL_TYPES.POWER_COMPLETE);
	};

	//function to avoid task recalculation if the cadence is Paused/Stopped
	const updatePowerTaskStatus = () => {
		if (power.status !== POWER_STATUS.BOOSTED) return;
		setPower(prev => {
			let tasks = prev.tasks;
			tasks = tasks.map(task => {
				if (task.active) {
					return { ...task, dontRecalculate: true };
				}
				return task;
			});
			return { ...prev, tasks };
		});
	};

	//set lead data to all states after fetching it from server based upon current active task
	useEffect(() => {
		if (leadInfo) {
			const leadData = leadInfo?.lead?.data;
			if (leadInfo?.lead?.success) {
				setLead(leadData);
				setNextNode(leadInfo?.nextNode);
				if (user?.integration_type === INTEGRATION_TYPE.SELLSY) {
					leadData?.Account?.integration_id &&
						fetchAddresses(leadData?.Account?.integration_id, {
							onSuccess: data => {
								setCompanyAddress(data?.[0]);
							},
							onError: err => {
								addError({
									text: err?.response?.data?.msg,
									desc: err?.response?.data?.error,
									cId: err?.response?.data?.correlationId,
								});
							},
						});
				}

				if (tour?.status === PRODUCT_TOUR_STATUS.AFTER_ONBOARDING_PENDING) {
					if (
						![
							INITIAL_TOUR_STEPS_ENUM.CLICK_FIRST_TASK,
							INITIAL_TOUR_STEPS_ENUM.CLICK_SECOND_TASK,
							INITIAL_TOUR_STEPS_ENUM.CLICK_THIRD_TASK,
							INITIAL_TOUR_STEPS_ENUM.CLICK_FOURTH_TASK,
						].includes(tour?.currentStep)
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
			} else addError({ text: "Lead failed to fetch" });
		}
	}, [leadInfo]);

	useEffect(() => {
		if (leadInfo && fieldMap && leadInfo?.lead?.success) {
			const leadData = leadInfo?.lead?.data;
			const fieldMaps = fieldMap?.Company_Setting?.Integration_Field_Map;
			let statusPicklist = { lead: [], contact: [], account: [], candidate: [] };
			/**
			 * Salesforce & Hubspot Specific : Other Integrations will not pass the following checks
			 */

			if (user.integration_type === INTEGRATION_TYPE.SALESFORCE) {
				if (
					leadData?.integration_type === LEAD_INTEGRATION_TYPES.SALESFORCE_LEAD &&
					leadData?.integration_id &&
					fieldMaps?.lead_map?.integration_status
				) {
					setIsSalesforceAccount(false);
					if (fieldMaps?.lead_map?.integration_status?.disqualified) {
						statusPicklist.lead.push(
							fieldMaps?.lead_map?.integration_status?.disqualified
						);
					}
					statusPicklist.lead.push(
						...fieldMaps?.lead_map?.integration_status?.picklist_values.filter(
							op =>
								op.value !== fieldMaps?.lead_map?.integration_status?.converted?.value &&
								op.value !== fieldMaps?.lead_map?.integration_status?.disqualified?.value
						)
					);
					if (fieldMaps?.lead_map?.integration_status?.converted) {
						statusPicklist.lead.push(fieldMaps?.lead_map?.integration_status?.converted);
					}
					setIntegrationStatusMap({
						lead: {
							converted: fieldMaps?.lead_map?.integration_status?.converted,
							disqualified: fieldMaps?.lead_map?.integration_status?.disqualified,
							custom_actions: fieldMaps?.lead_map?.integration_status?.custom_actions,
						},
					});
				} else if (
					leadData?.integration_type === LEAD_INTEGRATION_TYPES.SALESFORCE_CONTACT &&
					leadData?.integration_id
				) {
					setIsSalesforceAccount(true);
					if (fieldMaps?.contact_map?.integration_status) {
						if (fieldMaps?.contact_map?.integration_status?.disqualified) {
							statusPicklist.contact.push(
								fieldMaps?.contact_map?.integration_status?.disqualified
							);
						}
						statusPicklist.contact.push(
							...fieldMaps?.contact_map?.integration_status?.picklist_values.filter(
								op =>
									op.value !==
										fieldMaps?.contact_map?.integration_status?.converted?.value &&
									op.value !==
										fieldMaps?.contact_map?.integration_status?.disqualified?.value
							)
						);
						if (fieldMaps?.contact_map?.integration_status?.converted) {
							statusPicklist.contact.push(
								fieldMaps?.contact_map?.integration_status?.converted
							);
						}
						setIntegrationStatusMap(prev => ({
							...prev,
							contact: {
								converted: fieldMaps?.contact_map?.integration_status?.converted,
								disqualified: fieldMaps?.contact_map?.integration_status?.disqualified,
								custom_actions:
									fieldMaps?.contact_map?.integration_status?.custom_actions,
							},
						}));
					}
					if (fieldMaps?.account_map?.integration_status) {
						if (fieldMaps?.account_map?.integration_status?.disqualified) {
							statusPicklist.account.push(
								fieldMaps?.account_map?.integration_status?.disqualified
							);
						}
						statusPicklist.account.push(
							...fieldMaps?.account_map?.integration_status?.picklist_values.filter(
								op =>
									op.value !==
										fieldMaps?.account_map?.integration_status?.converted?.value &&
									op.value !==
										fieldMaps?.account_map?.integration_status?.disqualified?.value
							)
						);
						if (fieldMaps?.account_map?.integration_status?.converted) {
							statusPicklist.account.push(
								fieldMaps?.account_map?.integration_status?.converted
							);
						}
						setIntegrationStatusMap(prev => ({
							...prev,
							account: {
								converted: fieldMaps?.account_map?.integration_status?.converted,
								disqualified: fieldMaps?.account_map?.integration_status?.disqualified,
								custom_actions:
									fieldMaps?.account_map?.integration_status?.custom_actions,
							},
						}));
					}
				}
			} else if (user.integration_type === INTEGRATION_TYPE.HUBSPOT) {
				if (leadData?.integration_id && fieldMaps?.contact_map?.integration_status) {
					if (fieldMaps?.contact_map?.integration_status?.disqualified) {
						statusPicklist.contact.push(
							fieldMaps?.contact_map?.integration_status?.disqualified
						);
					}
					statusPicklist.contact.push(
						...fieldMaps?.contact_map?.integration_status?.picklist_values.filter(
							op =>
								op.value !==
									fieldMaps?.contact_map?.integration_status?.converted?.value &&
								op.value !==
									fieldMaps?.contact_map?.integration_status?.disqualified?.value
						)
					);
					if (fieldMaps?.contact_map?.integration_status?.converted) {
						statusPicklist.contact.push(
							fieldMaps?.contact_map?.integration_status?.converted
						);
					}
					setIntegrationStatusMap({
						contact: {
							converted: fieldMaps?.contact_map?.integration_status?.converted,
							disqualified: fieldMaps?.contact_map?.integration_status?.disqualified,
							custom_actions: fieldMaps?.contact_map?.integration_status?.custom_actions,
						},
					});
				}
			} else if (user.integration_type === INTEGRATION_TYPE.BULLHORN) {
				if (
					lead.integration_type === LEAD_INTEGRATION_TYPES.BULLHORN_LEAD &&
					lead.integration_id
				) {
					setIsBullhornAccount(true);

					if (fieldMaps?.lead_map?.integration_status) {
						if (fieldMaps?.lead_map?.integration_status?.disqualified) {
							statusPicklist.lead.push(
								fieldMaps?.lead_map?.integration_status?.disqualified
							);
						}

						statusPicklist.lead.push(
							...fieldMaps?.lead_map?.integration_status?.picklist_values.filter(
								op =>
									op.value !==
										fieldMaps?.lead_map?.integration_status?.converted?.value &&
									op.value !==
										fieldMaps?.lead_map?.integration_status?.disqualified?.value
							)
						);

						if (fieldMaps?.lead_map?.integration_status?.converted) {
							statusPicklist.lead.push(
								fieldMaps?.lead_map?.integration_status?.converted
							);
						}

						setIntegrationStatusMap({
							lead: {
								converted: fieldMaps?.lead_map?.integration_status?.converted,
								disqualified: fieldMaps?.lead_map?.integration_status?.disqualified,
								custom_actions: fieldMaps?.lead_map?.integration_status?.custom_actions,
							},
						});
					}

					if (fieldMaps?.account_map?.integration_status) {
						if (fieldMaps?.account_map?.integration_status?.disqualified) {
							statusPicklist.account.push(
								fieldMaps?.account_map?.integration_status?.disqualified
							);
						}
						statusPicklist.account.push(
							...fieldMaps?.account_map?.integration_status?.picklist_values.filter(
								op =>
									op.value !==
										fieldMaps?.account_map?.integration_status?.converted?.value &&
									op.value !==
										fieldMaps?.account_map?.integration_status?.disqualified?.value
							)
						);
						if (fieldMaps?.account_map?.integration_status?.converted) {
							statusPicklist.account.push(
								fieldMaps?.account_map?.integration_status?.converted
							);
						}
						setIntegrationStatusMap(prev => ({
							...prev,
							account: {
								converted: fieldMaps?.account_map?.integration_status?.converted,
								disqualified: fieldMaps?.account_map?.integration_status?.disqualified,
								custom_actions:
									fieldMaps?.account_map?.integration_status?.custom_actions,
							},
						}));
					}
				} else if (
					lead.integration_type === LEAD_INTEGRATION_TYPES.BULLHORN_CONTACT &&
					lead.integration_id
				) {
					setIsBullhornAccount(true);
					if (fieldMaps?.contact_map?.integration_status) {
						if (fieldMaps?.contact_map?.integration_status?.disqualified) {
							statusPicklist.contact.push(
								fieldMaps?.contact_map?.integration_status?.disqualified
							);
						}
						statusPicklist.contact.push(
							...fieldMaps?.contact_map?.integration_status?.picklist_values.filter(
								op =>
									op.value !==
										fieldMaps?.contact_map?.integration_status?.converted?.value &&
									op.value !==
										fieldMaps?.contact_map?.integration_status?.disqualified?.value
							)
						);
						if (fieldMaps?.contact_map?.integration_status?.converted) {
							statusPicklist.contact.push(
								fieldMaps?.contact_map?.integration_status?.converted
							);
						}
						setIntegrationStatusMap(prev => ({
							...prev,
							contact: {
								converted: fieldMaps?.contact_map?.integration_status?.converted,
								disqualified: fieldMaps?.contact_map?.integration_status?.disqualified,
								custom_actions:
									fieldMaps?.contact_map?.integration_status?.custom_actions,
							},
						}));
					}
					if (fieldMaps?.account_map?.integration_status) {
						if (fieldMaps?.account_map?.integration_status?.disqualified) {
							statusPicklist.account.push(
								fieldMaps?.account_map?.integration_status?.disqualified
							);
						}
						statusPicklist.account.push(
							...fieldMaps?.account_map?.integration_status?.picklist_values.filter(
								op =>
									op.value !==
										fieldMaps?.account_map?.integration_status?.converted?.value &&
									op.value !==
										fieldMaps?.account_map?.integration_status?.disqualified?.value
							)
						);
						if (fieldMaps?.account_map?.integration_status?.converted) {
							statusPicklist.account.push(
								fieldMaps?.account_map?.integration_status?.converted
							);
						}
						setIntegrationStatusMap(prev => ({
							...prev,
							account: {
								converted: fieldMaps?.account_map?.integration_status?.converted,
								disqualified: fieldMaps?.account_map?.integration_status?.disqualified,
								custom_actions:
									fieldMaps?.account_map?.integration_status?.custom_actions,
							},
						}));
					}
				} else if (
					lead.integration_type === LEAD_INTEGRATION_TYPES.BULLHORN_CANDIDATE &&
					lead.integration_id
				) {
					setIsBullhornAccount(false);
					if (fieldMaps?.candidate_map?.integration_status?.disqualified) {
						statusPicklist.candidate.push(
							fieldMaps?.candidate_map?.integration_status?.disqualified
						);
					}
					statusPicklist.candidate.push(
						...fieldMaps?.candidate_map?.integration_status?.picklist_values.filter(
							op =>
								op.value !==
									fieldMaps?.candidate_map?.integration_status?.converted?.value &&
								op.value !==
									fieldMaps?.candidate_map?.integration_status?.disqualified?.value
						)
					);
					if (fieldMaps?.candidate_map?.integration_status?.converted) {
						statusPicklist.candidate.push(
							fieldMaps?.candidate_map?.integration_status?.converted
						);
					}
					setIntegrationStatusMap({
						candidate: {
							converted: fieldMaps?.candidate_map?.integration_status?.converted,
							disqualified: fieldMaps?.candidate_map?.integration_status?.disqualified,
							custom_actions:
								fieldMaps?.candidate_map?.integration_status?.custom_actions,
						},
					});
				}
			}

			setIntegrationStatusPicklist(statusPicklist);
		}
	}, [leadInfo, fieldMap]);

	useEffect(() => {
		if (!activitiesLoading) {
			if (leadActivities) setActivities([...leadActivities].reverse());
			else addError({ text: "Activity failed to fetch" });
		}
	}, [activitiesLoading, leadActivities]);

	///////SOCKET ARENA STARTED///////

	const addActivityIfDistinct = activity => {
		if (parseInt(activity.lead_id) === parseInt(activeTaskInfo?.Lead?.lead_id)) {
			setActivities(prevState => {
				//check activity if it exists
				const existingActivity = prevState.find(
					prev => activity.activity_id === prev.activity_id
				);
				//add if doesnot exists and return
				return existingActivity ? prevState : [activity, ...prevState];
			});
		}
	};

	useEffect(() => {
		if (latestActivityFromSocket) {
			addActivityIfDistinct(latestActivityFromSocket);
			// set hot lead to true if such is the case
			if (
				latestActivityFromSocket.type === ACTIVITY_TYPES.HOT_LEAD &&
				lead.lead_id === latestActivityFromSocket.lead_id
			) {
				setHotLeadFromSocket(true);
				setTasks(prev =>
					setCurrentHotLeadsFromTask({
						tasks: prev,
						activeTaskInfo,
						lead_id: latestActivityFromSocket.lead_id,
					})
				);
			}

			//skipping completion removal from activity is done within this fn
			handleReceivedActivity({
				activeTaskInfo,
				setTaskToBeRemoved,
				latestActivityFromSocket,
				changeToNextPowerTask,
			});
		}
		setLatestActivityFromSocket(null);
	}, [latestActivityFromSocket]);

	///////SOCKET ARENA ENDED///////

	return (
		<ErrorBoundary>
			<div className={styles.taskInfo}>
				<ThemedButton
					onClick={cleanTasksAndCloseSidebar}
					className={styles.closeBtn}
					theme={ThemedButtonThemes.ICON}
					disabled={
						power.status === POWER_STATUS.PAUSED || power.status === POWER_STATUS.BOOSTED
					}
				>
					<Tooltip
						text={
							power.status === POWER_STATUS.PAUSED ||
							power.status === POWER_STATUS.BOOSTED
								? "Power is running"
								: COMMON_TRANSLATION.CLOSE[user?.language?.toUpperCase()]
						}
						className={styles.closeTooltip}
					>
						<Close color={"#000"} />
					</Tooltip>
				</ThemedButton>
				<Actions
					activeTaskInfo={activeTaskInfo}
					lead={lead}
					leadInfoLoading={leadInfoLoading}
					fieldMap={fieldMap}
					fieldMapLoading={fieldMapLoading}
					refetchLead={refetchLeadDetails}
					integrationStatusPicklist={integrationStatusPicklist}
					isSalesforceAccount={isSalesforceAccount || isBullhornAccount}
					leadLoading={leadInfoLoading || fieldMapLoading}
					onSidebarClose={cleanTasksAndCloseSidebar}
					leadSalesforceDataAccess={leadSalesforceDataAccess}
					integrationStatusMap={integrationStatusMap}
					changeToNextPowerTask={changeToNextPowerTask}
				/>
				<div className={styles.taskId}>
					<span>
						{TASKS_TRANSLATION.TASK_ID[user?.language?.toUpperCase()]}:{" "}
						{activeTaskInfo?.task_id} |
					</span>
					<span>
						{TASKS_TRANSLATION.LEAD_ID[user?.language?.toUpperCase()]}: {lead?.lead_id} |{" "}
					</span>
					<span>
						{TASKS_TRANSLATION.CREATED_AT[user?.language?.toUpperCase()]}
						{moment(lead?.created_at).format("DD/MM/YYYY, hh:mm A")}{" "}
					</span>
				</div>
				<Details
					activeTaskInfo={activeTaskInfo}
					setActiveTaskInfo={setActiveTaskInfo}
					lead={lead}
					fieldMap={fieldMap}
					tasks={tasks}
					setTasks={setTasks}
					leadLoading={leadInfoLoading || fieldMapLoading}
					companyAddress={companyAddress}
					fetchAddressesLoading={fetchAddressesLoading}
					markTaskAsComplete={markTaskAsComplete}
					markTaskAsCompleteLoading={markTaskAsCompleteLoading}
					setTaskToBeRemoved={setTaskToBeRemoved}
					nextNode={nextNode}
					taskToBeRemoved={taskToBeRemoved}
					refetchLead={refetchLeadDetails}
					userId={userId}
					userTimezone={user.timezone}
					leadSalesforceDataAccess={leadSalesforceDataAccess}
					stopPower={stopPower}
					changeToNextPowerTask={changeToNextPowerTask}
					hotLeadFromSocket={hotLeadFromSocket}
					setHotLeadFromSocket={setHotLeadFromSocket}
					updatePowerTaskStatus={updatePowerTaskStatus}
					countries={countries}
					cleanTasksAndCloseSidebar={cleanTasksAndCloseSidebar}
					refetchTasks={refetchTasks}
				/>
				<LeadActivity
					activities={activities}
					lead={lead}
					refetchLead={refetchLeadDetails}
					leadLoading={leadInfoLoading || activitiesLoading}
					userId={userId}
					readActivity={readActivity}
				/>
			</div>
		</ErrorBoundary>
	);
};

export default TaskInfo;
