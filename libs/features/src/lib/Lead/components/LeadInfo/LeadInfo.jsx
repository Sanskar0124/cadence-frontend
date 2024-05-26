import { MessageContext } from "@cadence-frontend/contexts";
import { CallIframeContext } from "@salesforce/context";
import moment from "moment";
import { useCallback, useContext, useEffect, useRef, useState } from "react";

import {
	Button,
	Div,
	ErrorBoundary,
	Skeleton,
	Tooltip,
} from "@cadence-frontend/components";
import {
	CADENCE_STATUS,
	ENUMS,
	GLOBAL_MODAL_TYPES,
	INTEGRATION_TYPE,
	LEAD_WARMTH,
	LEAD_INTEGRATION_TYPES,
	PHONE_INTEGRATIONS,
	IS_CUSTOM_VARS_AVL_FOR_LEAD_INTEGRATION,
	CADENCE_INTEGRATION_TYPE,
} from "@cadence-frontend/constants";
import {
	useCadenceForLead,
	useLead,
	useLeadSalesforce,
	useRelatedLeads,
	useCadenceSettings,
} from "@cadence-frontend/data-access";
import {
	AtrManualEmail,
	Briefcase,
	BriefcaseBox,
	Building,
	CadencesGradient,
	Calendar,
	Call,
	Delete,
	Edit,
	Email,
	Home,
	HotLead,
	Info2,
	InfoCircleGradient,
	LinkBox,
	LinkedinBox,
	Location,
	Message,
	Minus,
	Pause,
	Phone,
	Play,
	Plus,
	PlusOutline,
	Refresh,
	Stop,
	Timezone,
	View,
	Whatsapp,
	ZoomInfo,
} from "@cadence-frontend/icons";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import {
	Colors,
	capitalize,
	getIntegrationIcon,
	getIntegrationIconForLead,
	getLabelFromEnum,
	getMailData,
	getTaskEnum,
	getValidLink,
} from "@cadence-frontend/utils";
import {
	CalendarEventsModal,
	GlobalModals,
	LocalModals,
	ReplaceCadenceModal,
	ThemedButton,
} from "@cadence-frontend/widgets";
import {
	LeadCadencesPlaceholder,
	LeadDetailsPlaceholder,
	LeadNamePlaceholder,
} from "../Placeholders/LeadInfoPlaceholder";
import {
	Common as COMMON_TRANSLATION,
	People as PEOPLE_TRANSLATION,
	Tasks as TASKS_TRANSLATION,
	Cadence as CADENCE_TRANSLATION,
} from "@cadence-frontend/languages";
import styles from "./LeadInfo.module.scss";

import { userInfo } from "@cadence-frontend/atoms";
import { LOCAL_MODAL_TYPES } from "@cadence-frontend/constants";
import { useRecoilValue } from "recoil";
import {
	getIntegrationDetailAvailability,
	getLeadIntegrationUrl,
} from "@cadence-frontend/utils";
import PhoneEmailAbsentModal from "./PhoneEmailAbsentModal/PhoneEmailAbsentModal";
import AddCadenceModal from "../LeadInfo/AddCadenceModal/AddCadenceModal";
import { CUSTOM_VARIABLE_FIELD_AVAILABLE } from "../../../Tasks/components/TaskInfo/Details/constants";
import {
	getAccountVariables,
	getContactVariables,
	getLeadVariables,
} from "libs/widgets/src/lib/GlobalModals/EditLeadIMC/constants";
import CustomVariableButtons from "./CustomVariablesButtons/CustomVariableButtons";

const LeadInfo = ({
	lead,
	fieldMap,
	cadenceList,
	leadLoading,
	companyAddress,
	fetchAddressesLoading,
	refetchLead,
	userTimeZone,
	hotLeadFromSocket,
	setHotLeadFromSocket,
	countries,
	leadSalesforceDataAccess,
}) => {
	const user = useRecoilValue(userInfo);
	const { simpleSDK, forceUpdate } = useContext(CallIframeContext);
	const { addError, addSuccess } = useContext(MessageContext);
	const { resumeCadenceForLead, resumeLoading } = useCadenceForLead({}, false);
	const [activeModalParams, setActiveModalParams] = useState();
	const [localModal, setLocalModal] = useState(false);
	const [primaryPhone, setPrimaryPhone] = useState(null);
	const [timeString, setTimestring] = useState("");
	const [showCalendarModal, setShowCalendarModal] = useState(false);
	const [showBriefcase, setShowBriefcase] = useState(false);
	const [showPhoneEmailAbsentModal, setPhoneEmailAbsentModal] = useState(null);
	const [showRemoveHotLead, setShowRemoveHotLead] = useState(false);
	const [showHotLead, setShowHotLead] = useState(true);
	const [isEmailNum, setIsEmailNum] = useState({
		emailPresent: false,
		phonePresent: false,
	});
	const [replaceCadenceModal, setReplaceCadenceModal] = useState(null);
	const [addCadenceModal, setAddCadenceModal] = useState(false);
	const [cadenceId, setCadenceId] = useState(null);

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

	const INTEGRATION_ICON = getIntegrationIconForLead({
		lead_integration_type: lead?.integration_type,
		box: true,
	});

	const { salesforceSuccess, salesforceQuery } = leadSalesforceDataAccess;

	const salesforceLoading = crmLeadInfoLoading || refetchingCrmLeadInfo;

	const cadenceLeadsDataAccess = useCadenceForLead(
		{ cadenceId },
		Boolean(replaceCadenceModal),
		"",
		false
	);

	useEffect(() => {
		setIsEmailNum({
			emailPresent: Boolean(
				lead?.Lead_emails?.filter(em => em.email_id.length).length > 0
			),
			phonePresent: Boolean(
				lead?.Lead_phone_numbers?.filter(ph => ph.phone_number.length).length > 0
			),
		});
		const phoneNumbers = lead?.Lead_phone_numbers?.filter(pn => pn.phone_number) ?? [];
		if (lead && phoneNumbers?.length > 0) {
			setPrimaryPhone(
				phoneNumbers.filter(phone => phone.is_primary)[0] ?? phoneNumbers[0]
			);
		} else {
			const accountNumber = lead?.Account?.phone_number;
			if (accountNumber) {
				const accountNumberObj = {
					is_primary: false,
					is_account: true,
					phone_number: accountNumber,
					formatted_phone_number: accountNumber,
				};
				setPrimaryPhone(accountNumberObj);
			} else {
				setPrimaryPhone(null);
			}
		}
	}, [lead?.Lead_phone_numbers, lead]);

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

	const isCallAndSmsDisabled = useCallback(
		() => user?.phone_system === PHONE_INTEGRATIONS.NONE,
		[user]
	);

	const handleCallClick = number => {
		if (isCallAndSmsDisabled()) {
			addError({ text: "No phone system selected." });
			return;
		}
		simpleSDK.show();
		simpleSDK.dial(number);
		forceUpdate();

		const obj = {
			lead_id: lead?.lead_id,
			minimum_time_for_call_validation:
				fieldMap?.Company_Setting?.minimum_time_for_call_validation,
		};
		localStorage.setItem("current_lead_and_task", JSON.stringify(obj));
	};

	const handleActionClick = ({ type, customFields }) => {
		setActiveModalParams({
			type,
			typeSpecificProps: {
				lead,
				fieldMap,
				validateTask: false,
				...customFields,
			},
			modalProps: {
				isModal: true,
				onClose: () => {
					//remember this setState not only closes the modal but also reinitalizes all keys back to their original values,
					//if there was a change innerModalState(inside GlobalModals) its values will be reinitialized with isModal:false
					setActiveModalParams(prev => ({ ...prev, modalProps: { isModal: false } }));
				},
			},
		});
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
				const integrationUrl = getLeadIntegrationUrl({
					user,
					lead,
				});
				if (!integrationUrl)
					addError({ text: "This lead does not have the required info." });
				else window.open(integrationUrl, "_blank");
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

	const handleCadenceResume = ltd => {
		const body = { cadence_ids: [ltd.cadence_id], lead_id: lead.lead_id };
		resumeCadenceForLead(body, {
			onError: err => {
				addError({
					text: err?.response?.data?.msg,
					desc: err?.response?.data?.error,
					cId: err?.response?.data?.correlationId,
				});
			},
			onSuccess: res => {
				addSuccess("Cadence resumed");
				refetchLead();
			},
		});
	};

	const handleCalendarModal = () => {
		setShowCalendarModal(prev => !prev);
	};

	// check if same Lead
	const checkIfSameLead = fetchedLead => {
		if (
			fetchedLead?.lead_id_db === lead.lead_id ||
			fetchedLead?.lead_id === lead.lead_id
		) {
			return false;
		}
		if (fetchedLead?.lead_id_db === null) {
			if (
				fetchedLead?.attributes.type === "Lead" &&
				fetchedLead?.Id === lead.salesforce_lead_id
			) {
				return false;
			} else if (
				fetchedLead?.attributes.type === "Contact" &&
				fetchedLead?.Id === lead.salesforce_contact_id
			) {
				return false;
			}
		}
		return true;
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

	const getUpperText = (cadence, lead, index) => {
		if (lead.status === CADENCE_STATUS.COMPLETED)
			return `${COMMON_TRANSLATION.COMPLETED[user?.language.toUpperCase()]}`;

		if (lead.status === CADENCE_STATUS.NOT_STARTED)
			return `${COMMON_TRANSLATION.NOT_STARTED[user?.language.toUpperCase()]}`;

		if (lead?.status === CADENCE_STATUS.IN_PROGRESS)
			if (lead?.Tasks?.length === 0) {
				return `${CADENCE_TRANSLATION.IN_PROGRESS[user?.language.toUpperCase()]}`;
			} else {
				if (lead?.Tasks[0]?.Node === null) {
					const nodestep = lead?.Tasks?.find(item => item?.Node !== null);
					if (!nodestep) {
						return `${CADENCE_TRANSLATION.IN_PROGRESS[user?.language.toUpperCase()]}`;
					}
					return `${COMMON_TRANSLATION.STEP[user?.language.toUpperCase()]} ${
						nodestep?.Node?.step_number
					}/${cadence?.Nodes}`;
				}
				if (lead?.Tasks?.every(item => item?.Node === null)) return;
				return `${COMMON_TRANSLATION.STEP[user?.language.toUpperCase()]} ${
					lead?.Tasks[0]?.Node?.step_number
				}/${cadence?.Nodes}`;
			}

		if (lead?.status === CADENCE_STATUS.PAUSED)
			if (lead?.Tasks?.length === 0) {
				return `${CADENCE_TRANSLATION.PAUSED[user?.language.toUpperCase()]}`;
			} else {
				if (lead?.Tasks[0]?.Node === null) {
					const nodestep = lead?.Tasks?.find(item => item?.Node !== null);
					if (!nodestep) {
						return `${CADENCE_TRANSLATION.PAUSED[user?.language.toUpperCase()]}`;
					}
					return `${PEOPLE_TRANSLATION.LEAD_PAUSED_AT[user?.language.toUpperCase()]}${
						nodestep?.Node?.step_number
					}`;
				}
				if (lead?.Tasks?.every(item => item?.Node === null)) return;
				return `${PEOPLE_TRANSLATION.LEAD_PAUSED_AT[user?.language.toUpperCase()]} ${
					lead?.Tasks[0]?.Node?.step_number
				}`;
			}

		if (lead?.status === CADENCE_STATUS.STOPPED) {
			if (lead?.Tasks?.length === 0) {
				return `${PEOPLE_TRANSLATION.LEAD_STOPPED[user?.language.toUpperCase()]}`;
			} else {
				if (lead?.Tasks[0]?.Node === null) {
					const nodestep = lead?.Tasks?.find(item => item?.Node !== null);
					if (!nodestep) {
						return `${PEOPLE_TRANSLATION.LEAD_STOPPED[user?.language.toUpperCase()]}`;
					}
					return `${PEOPLE_TRANSLATION.LEAD_STOPPED_AT[user?.language.toUpperCase()]}${
						nodestep?.Node?.step_number
					}`;
				}
				if (lead?.Tasks?.every(item => item?.Node === null)) return;
				return `${PEOPLE_TRANSLATION.LEAD_STOPPED_AT[user?.language.toUpperCase()]} ${
					lead?.Tasks[0]?.Node?.step_number
				}`;
			}
		}
		// if (lead?.Tasks?.length === 0)
		// 	return `${TASKS_TRANSLATION.COMPLETED[user?.language.toUpperCase()]}`;
		// switch (lead?.status) {
		// 	case CADENCE_STATUS.PAUSED:
		// 		return `${PEOPLE_TRANSLATION.PAUSED_AT[user?.language.toUpperCase()]} ${
		// 			lead?.Tasks[0]?.Node?.step_number
		// 		}`;
		// 	case CADENCE_STATUS.STOPPED:
		// 		return `${PEOPLE_TRANSLATION.STOPPED_AT[user?.language.toUpperCase()]} ${
		// 			lead?.Tasks[0]?.Node?.step_number
		// 		}`;
		// 	default:
		// 		break;
		// }
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
				},
				onFailure: () => {
					addError({ text: "Unable to remove hot lead status" });
				},
			});
		} catch (err) {
			addError({ text: "Unable to remove hot lead status" });
		}
	};

	useEffect(() => {
		if (!relatedLeadData) setShowBriefcase(false);
		if (relatedLeadData?.length < 1) setShowBriefcase(false);
		if (relatedLeadData?.length === 1 && !checkIfSameLead(relatedLeadData[0]))
			setShowBriefcase(false);
		if (relatedLeadData?.length > 1) setShowBriefcase(true);
	}, [relatedLeadData]);

	return (
		<ErrorBoundary>
			<div className={styles.leadInfo}>
				<div className={styles.leadDetails}>
					<div className={styles?.leadTags}>
						{lead?.duplicate && (
							<Tooltip text="Show duplicate leads" className={styles.editTooltip}>
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
							</Tooltip>
						)}
						{((lead?.lead_warmth === LEAD_WARMTH.HOT_LEAD && showHotLead) ||
							hotLeadFromSocket) && (
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
					<div className={styles.icons}>
						{getIntegrationDetailAvailability({
							lead,
							user,
						}) && (
							<Tooltip text={getTextForIntegrationIcon()} className={styles.editTooltip}>
								<INTEGRATION_ICON
									style={
										lead?.integration_type === LEAD_INTEGRATION_TYPES.ZOHO_LEAD ||
										lead?.integration_type === LEAD_INTEGRATION_TYPES.ZOHO_CONTACT
											? {
													width: "4em",
													height: "4em",
													cursor: "pointer",
											  }
											: {
													width: "3em",
													height: "3em",
													color: "#0077b5",
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
									style={{
										width: "3em",
										height: "3em",
										color: "#0077b5",
										cursor: "pointer",
									}}
									onClick={() => window.open(lead?.linkedin_url)}
								/>
							</Tooltip>
						)}
						{lead?.Account?.url && (
							<Tooltip
								text={COMMON_TRANSLATION.COMPANY_LINK[user?.language?.toUpperCase()]}
								className={styles.editTooltip}
							>
								<LinkBox
									style={{ cursor: "pointer" }}
									onClick={() => window.open(getValidLink(lead?.Account?.url))}
								/>
							</Tooltip>
						)}

						{user?.integration_type === INTEGRATION_TYPE.SALESFORCE && (
							<div>
								{salesforceLoading ? (
									<Skeleton className={styles.salesforceLoading} />
								) : showBriefcase ? (
									<Tooltip
										text={
											COMMON_TRANSLATION.OPEN_RELATED_LEADS[user?.language?.toUpperCase()]
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
								) : null}
							</div>
						)}
						{(user?.integration_type === INTEGRATION_TYPE.ZOHO ||
							user?.integration_type === INTEGRATION_TYPE.DYNAMICS ||
							user?.integration_type === INTEGRATION_TYPE.SELLSY) && (
							<div>
								{relatedLeadLoading ? (
									<Skeleton className={styles.salesforceLoading} />
								) : showBriefcase ? (
									<Tooltip
										text={
											COMMON_TRANSLATION.OPEN_RELATED_LEADS[user?.language?.toUpperCase()]
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
								) : null}
							</div>
						)}
						{/* {user?.integration_type === INTEGRATION_TYPE.SALESFORCE && getZoomInfo() && (
							<Tooltip text="Open in Zendesk" className={styles.editTooltip}>
								<ZoomInfo
									size="3em"
									color={Colors.zoomInfo}
									onClick={() => window.open(`${getZoomInfo()}`, "_blank")}
								/>
							</Tooltip>
						)} */}
					</div>

					{leadLoading ? (
						<LeadNamePlaceholder />
					) : (
						<div className={styles.leadNameContainer}>
							<h3 className={styles.leadName}>{`${lead?.first_name ?? ""} ${
								lead?.last_name ?? ""
							}`}</h3>
							{timeString && (
								<p className={styles.timezone}>
									<Timezone
										color={
											moment.tz(userTimeZone).format("z") ===
											moment.tz(primaryPhone?.timezone).format("z")
												? Colors.lightBlue
												: Colors.orange
										}
										size="23px"
									/>
									{timeString}
								</p>
							)}
							<Button
								onClick={() =>
									setActiveModalParams({
										type: GLOBAL_MODAL_TYPES.EDIT_LEAD,
										typeSpecificProps: {
											countries: countries,
											lead,
											fieldMap,
											refetchLead,
											info: getLeadInfo(),
											refetchInfo,
										},
										modalProps: {
											isModal: true,
											onClose: () =>
												setActiveModalParams(prev => ({
													...prev,
													modalProps: { isModal: false },
												})),
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
									<Edit size="1.25rem" />
								</Tooltip>
							</Button>
						</div>
					)}
					{leadLoading ? (
						<LeadDetailsPlaceholder />
					) : (
						<div className={styles.details}>
							<div className={styles.accountName}>
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
											{lead?.Account?.size
												? `${COMMON_TRANSLATION.WITH[user?.language.toUpperCase()]} ${
														lead?.Account?.size
												  } ${COMMON_TRANSLATION.PEOPLE[user?.language.toUpperCase()]}`
												: ""}
										</p>
									</>
								)}
							</div>
							<div className={styles.emails}>
								{lead?.Lead_emails &&
									lead?.Lead_emails.length > 0 &&
									lead?.Lead_emails.filter(em => em.email_id.length > 0).map(email => {
										return (
											<span
												key={email.lem_id}
												onClick={() => {
													handleActionClick({
														type: GLOBAL_MODAL_TYPES.MAIL,
														customFields: {
															mailData: getMailData({
																lead: lead,
																to: email.email_id,
															}),
														},
													});
												}}
												className={styles.emails}
											>
												<Email size="1.1em" />
												<a title={email?.email_id}>{email?.email_id}</a>
											</span>
										);
									})}
							</div>
							<div className={styles.phoneNumbers}>
								{lead?.Account?.phone_number && (
									<span
										className={styles.mobile}
										onClick={() => handleCallClick(lead.Account?.phone_number)}
									>
										{" "}
										<Building
											style={{
												width: "1.1em",
												height: "1.1em",
											}}
										/>
										<a title={lead.Account.phone_number}>{lead.Account.phone_number}</a>
									</span>
								)}
								{lead?.Lead_phone_numbers?.filter(
									phone => phone.phone_number.length > 0
								).map((phone, index) => {
									return (
										<span
											key={phone.lpn_id}
											onClick={() => handleCallClick(phone.formatted_phone_number)}
											className={styles.mobile}
										>
											{phone.is_primary ? (
												<Phone
													style={{
														width: "1.1em",
														height: "1.1em",
													}}
												/>
											) : (
												<Home
													style={{
														width: "1.1em",
														height: "1.1em",
													}}
												/>
											)}
											<a title={phone?.phone_number}>{phone?.phone_number}</a>
										</span>
									);
								})}
							</div>
							<div className={styles.zipCountry}>
								{user?.integration_type === INTEGRATION_TYPE.SELLSY ? (
									<Div loading={fetchAddressesLoading} className={styles.sellsyAddress}>
										{(companyAddress?.postal_code || companyAddress?.country) && (
											<>
												<Location size="1.2rem" /> {companyAddress?.postal_code}
												{companyAddress?.postal_code && companyAddress?.country && ", "}
												{companyAddress?.country}
											</>
										)}
									</Div>
								) : (
									(lead?.Account?.zipcode || lead?.Account?.country) && (
										<>
											<Location size="1.2rem" /> {lead?.Account?.zipcode}
											{lead?.Account?.zipcode && lead?.Account?.country && ", "}
											{lead?.Account?.country}
										</>
									)
								)}
							</div>

							<Div
								className={styles.variables}
								loading={leadLoading || salesforceLoading}
								style={{
									marginTop: leadLoading ? "0.15em" : ".3em",
									cursor: "pointer",
									minHeight: "12px",
									display: CUSTOM_VARIABLE_FIELD_AVAILABLE.includes(
										lead?.integration_type
									)
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
									tooltipText={
										lead?.integration_type === LEAD_INTEGRATION_TYPES.SALESFORCE_LEAD
											? "Lead variable"
											: "Contact variable"
									}
									scrollType={
										lead?.integration_type === LEAD_INTEGRATION_TYPES.SALESFORCE_LEAD
											? LEAD_INTEGRATION_TYPES.SALESFORCE_LEAD
											: LEAD_INTEGRATION_TYPES.SALESFORCE_CONTACT
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
						</div>
					)}

					<div className={styles.actionBtns}>
						<Tooltip text={TASKS_TRANSLATION.CALL[user?.language?.toUpperCase()]}>
							<ThemedButton
								width="40px"
								height="40px"
								theme={ThemedButtonThemes.PRIMARY}
								onClick={() => {
									handleCallClick(primaryPhone?.phone_number);
								}}
								className={styles.actionBtn}
								disabled={isCallAndSmsDisabled()}
							>
								<Call />
							</ThemedButton>
						</Tooltip>
						<Tooltip text={TASKS_TRANSLATION.SMS[user?.language?.toUpperCase()]}>
							<ThemedButton
								width="40px"
								height="40px"
								onClick={() => {
									isEmailNum.phonePresent
										? handleActionClick({ type: GLOBAL_MODAL_TYPES.MESSAGE })
										: setPhoneEmailAbsentModal({
												isOpen: true,
												type: "phone",
										  });
								}}
								theme={ThemedButtonThemes.PRIMARY}
								className={styles.actionBtn}
								disabled={isCallAndSmsDisabled()}
							>
								<Message />
							</ThemedButton>
						</Tooltip>
						<Tooltip text={COMMON_TRANSLATION.EMAIL[user?.language?.toUpperCase()]}>
							<ThemedButton
								width="40px"
								height="40px"
								onClick={() => {
									isEmailNum.emailPresent
										? handleActionClick({
												type: GLOBAL_MODAL_TYPES.MAIL,
												customFields: {
													mailData: getMailData({
														lead: lead,
													}),
												},
										  })
										: setPhoneEmailAbsentModal({
												isOpen: true,
												type: "email",
										  });
								}}
								theme={ThemedButtonThemes.PRIMARY}
								className={styles.actionBtn}
							>
								<AtrManualEmail />
							</ThemedButton>
						</Tooltip>
						<Tooltip text={TASKS_TRANSLATION.BOOK_A_DEMO[user?.language?.toUpperCase()]}>
							<ThemedButton
								width="40px"
								height="40px"
								onClick={handleCalendarModal}
								theme={ThemedButtonThemes.PRIMARY}
								className={styles.actionBtn}
							>
								<Calendar />
							</ThemedButton>
						</Tooltip>
						<Tooltip text="Whatsapp">
							<ThemedButton
								width="40px"
								height="40px"
								theme={ThemedButtonThemes.PRIMARY}
								className={styles.actionBtn}
								onClick={() =>
									handleActionClick({
										type: GLOBAL_MODAL_TYPES.WHATSAPP,
									})
								}
							>
								<Whatsapp size="20px" />
							</ThemedButton>
						</Tooltip>
					</div>
				</div>
				<div className={styles.cadenceInfo}>
					<h3>{CADENCE_TRANSLATION.CADENCE[user?.language.toUpperCase()]}</h3>
					<div className={styles.cadences}>
						{leadLoading ? (
							<LeadCadencesPlaceholder rows={3} />
						) : cadenceList?.length > 0 ? (
							cadenceList?.map((ltd, index) => {
								const cadence = ltd.Cadences[0];
								let taskEnum = null;
								if (ltd.Tasks?.length) taskEnum = ENUMS[getTaskEnum(ltd.Tasks[0])];
								return (
									<div className={styles.cadence}>
										<div className={styles.left}>
											<div className={styles.gradientIcon}>
												{taskEnum?.icon?.gradient ??
													(ENUMS["linkedin"]?.type[taskEnum] ? (
														ENUMS["linkedin"].icon?.gradient
													) : (
														<CadencesGradient />
													))}
											</div>
											<div className={styles.stepInfo}>
												<div>{getUpperText(cadence, ltd, index)}</div>
												<p
													className={styles.cadenceName}
													onClick={() =>
														setLocalModal({
															modalType: LOCAL_MODAL_TYPES.NODES_POPUP,
															cadence,
														})
													}
												>
													{cadence?.name}
												</p>
											</div>
										</div>
										<div className={styles.right}>
											{lead?.integration_type !==
												LEAD_INTEGRATION_TYPES.GOOGLE_SHEETS_LEAD && (
												<Tooltip
													text={
														CADENCE_TRANSLATION.MOVE_TO_ANOTHER_CADENCE[
															user?.language?.toUpperCase()
														]
													}
													className={styles.stopTooltip}
												>
													<ThemedButton
														width="50px"
														height="40px"
														className={styles.cadenceBtn}
														theme={ThemedButtonThemes.GREY}
														onClick={() => {
															setCadenceId(ltd?.cadence_id);
															setReplaceCadenceModal({
																lead_ids: [lead?.lead_id],
																cadence_id: parseInt(ltd?.cadence_id),
																option: "selected",
															});
														}}
													>
														<Refresh />
													</ThemedButton>
												</Tooltip>
											)}
											{ltd.status === CADENCE_STATUS.IN_PROGRESS &&
											cadence?.status !== CADENCE_STATUS.PAUSED &&
											cadence?.status !== CADENCE_STATUS.STOPPED ? (
												<Tooltip
													text={
														COMMON_TRANSLATION.PAUSE_FOR_LEAD[
															user?.language?.toUpperCase()
														]
													}
												>
													<ThemedButton
														width="50px"
														height="40px"
														className={styles.cadenceBtn}
														theme={ThemedButtonThemes.GREY}
														disabled={cadence?.status === CADENCE_STATUS.PROCESSING}
														onClick={() =>
															setLocalModal({
																modalType: LOCAL_MODAL_TYPES.PAUSE_CADENCE,
																...cadence,
																...lead,
															})
														}
													>
														<Pause />
													</ThemedButton>
												</Tooltip>
											) : (
												<Tooltip
													text={
														cadence?.status === CADENCE_STATUS.NOT_STARTED ||
														cadence?.status === CADENCE_STATUS.PAUSED ||
														cadence?.status === CADENCE_STATUS.PROCESSING
															? `Cadence ${getLabelFromEnum(cadence.status)}`
															: ltd.status === CADENCE_STATUS.STOPPED
															? TASKS_TRANSLATION.LEAD_STOPPED[
																	user?.language?.toUpperCase()
															  ]
															: ltd.status === CADENCE_STATUS.COMPLETED
															? TASKS_TRANSLATION.CADENCE_COMPLETED[
																	user?.language?.toUpperCase()
															  ]
															: "Resume for lead"
													}
												>
													<ThemedButton
														width="50px"
														height="40px"
														className={styles.cadenceBtn}
														disabled={
															cadence?.status === CADENCE_STATUS.NOT_STARTED ||
															cadence?.status === CADENCE_STATUS.PAUSED ||
															cadence?.status === CADENCE_STATUS.PROCESSING ||
															ltd.status === CADENCE_STATUS.STOPPED ||
															ltd.status === CADENCE_STATUS.COMPLETED ||
															resumeLoading
														}
														theme={ThemedButtonThemes.GREY}
														onClick={() => handleCadenceResume(cadence)}
													>
														<Play />
													</ThemedButton>
												</Tooltip>
											)}
											<Tooltip
												text={
													cadence?.status === CADENCE_STATUS.NOT_STARTED ||
													cadence?.status === CADENCE_STATUS.PAUSED ||
													cadence?.status === CADENCE_STATUS.PROCESSING
														? `Cadence ${getLabelFromEnum(cadence.status)}`
														: ltd.status === CADENCE_STATUS.STOPPED
														? TASKS_TRANSLATION.LEAD_STOPPED[
																user?.language?.toUpperCase()
														  ]
														: ltd.status === CADENCE_STATUS.COMPLETED
														? TASKS_TRANSLATION.CADENCE_COMPLETED[
																user?.language?.toUpperCase()
														  ]
														: COMMON_TRANSLATION.STOP_FOR_LEAD[
																user?.language?.toUpperCase()
														  ]
												}
												className={styles.stopTooltip}
											>
												<ThemedButton
													width="50px"
													height="40px"
													className={styles.cadenceBtn}
													theme={ThemedButtonThemes.GREY}
													disabled={
														cadence?.status === CADENCE_STATUS.NOT_STARTED ||
														cadence?.status === CADENCE_STATUS.PAUSED ||
														cadence?.status === CADENCE_STATUS.PROCESSING ||
														ltd.status === CADENCE_STATUS.STOPPED ||
														ltd.status === CADENCE_STATUS.COMPLETED
													}
													onClick={() =>
														setLocalModal({
															modalType: LOCAL_MODAL_TYPES.STOP_CADENCE,
															...cadence,
															...lead,
														})
													}
												>
													<Stop />
												</ThemedButton>
											</Tooltip>
										</div>
									</div>
								);
							})
						) : (
							<div className={styles.noCadBtn}>
								<p className={styles.noCadences}>No cadence associated</p>
								<ThemedButton
									width="fit-content"
									height="50px"
									className={styles.addCad}
									theme={ThemedButtonThemes.GREY}
									onClick={() => setAddCadenceModal(true)}
								>
									<PlusOutline />
									Add to cadence
								</ThemedButton>
							</div>
						)}
					</div>
				</div>
				<CalendarEventsModal
					isOpen={showCalendarModal}
					onClose={handleCalendarModal}
					selectedLead={lead}
				/>
				{showPhoneEmailAbsentModal && (
					<PhoneEmailAbsentModal
						modal={showPhoneEmailAbsentModal}
						setModal={setPhoneEmailAbsentModal}
					/>
				)}
				<AddCadenceModal
					modal={addCadenceModal}
					setModal={setAddCadenceModal}
					lead={lead}
					refetchLead={refetchLead}
				/>
				<GlobalModals {...activeModalParams} />
				<LocalModals
					lead={lead}
					cadenceList={cadenceList}
					leadLoading={leadLoading}
					refetchLead={refetchLead}
					modal={localModal}
					setModal={setLocalModal}
				/>
				{replaceCadenceModal && (
					<ReplaceCadenceModal
						modal={replaceCadenceModal}
						setModal={setReplaceCadenceModal}
						dataAccess={cadenceLeadsDataAccess}
						user={user}
					/>
				)}
			</div>
		</ErrorBoundary>
	);
};

export default LeadInfo;
