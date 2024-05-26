import { useState, useEffect, useContext } from "react";

import { Div, ErrorBoundary, Tooltip } from "@cadence-frontend/components";
import {
	BackButton,
	ThemedButton,
	GlobalModals,
	DropDown,
} from "@cadence-frontend/widgets";
import { MessageContext } from "@cadence-frontend/contexts";
import {
	useLeadSalesforce,
	useCustomObject,
	useLead,
} from "@cadence-frontend/data-access";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import {
	GLOBAL_MODAL_TYPES,
	INTEGRATION_TYPE,
	IS_CUSTOM_VARS_AVL_FOR_LEAD_INTEGRATION,
	LANGUAGES,
	LEAD_INTEGRATION_TYPES,
	LEAD_STATUS,
} from "@cadence-frontend/constants";

import { QualificationsModal, AccountProgressModal } from "@cadence-frontend/widgets";
import {
	getAccountProgressByIntegration,
	getQualificationsByLeadIntegration,
	FIELDS_SALESFORCE,
	FIELDS_PIPEDRIVE,
	FIELDS_HUBSPOT,
	fetchCustom,
	buttonFormSet,
	FIELDS_ZOHO,
	FIELDS_BULLHORN,
	VIEWS_HUBSPOT,
	LEAD_STATUS_LABEL_MAP,
	getExportByLeadIntegration,
	FIELDS_DYNAMICS,
	VIEWS_SALESFORCE,
	VIEWS_BULLHORN,
} from "./constants";

import styles from "./LeadHeader.module.scss";
import {
	Tasks as TASKS_TRANSLATION,
	People as PEOPLE_TRANSLATION,
	Common as COMMON_TRANSLATION,
	Cadence as CADENCE_TRANSLATION,
} from "@cadence-frontend/languages";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";
import LeadExportModal from "../../../Cadence/CadenceView/components/components/LeadsList/components/LeadExportModal/LeadExportModal";
import { PlusOutline } from "@cadence-frontend/icons";

const LeadHeader = ({
	lead,
	fieldMap,
	leadLoading,
	refetchLead,
	handleCustomTaskModal,
	leadSalesforceDataAccess,
}) => {
	const { addError } = useContext(MessageContext);
	const user = useRecoilValue(userInfo);

	const {
		salesforceQuery,
		updateSalesforceQualifications,
		isTokenExpired,
		setIsTokenExpired,
	} = leadSalesforceDataAccess;

	const { crmLeadInfo, crmLeadInfoLoading } = useLead(
		null,
		false,
		lead?.lead_id,
		false,
		user?.integration_type === INTEGRATION_TYPE.SALESFORCE ||
			user?.integration_type === INTEGRATION_TYPE.HUBSPOT
	);

	const { fetchCustomObjectDetails, fetchCustomObjectDetailsLoading } = useCustomObject();

	const [integrationStatus, setIntegrationStatus] = useState("INVALID");
	const [integrationStatusPicklist, setIntegrationStatusPicklist] = useState({});
	const [isSalesforceAccount, setIsSalesforceAccount] = useState(false);
	const [isBullhornAccount, setIsBullhornAccount] = useState(false);
	const [showAccountStatusModal, setShowAccountStatusModal] = useState(false);
	const [showQualificationsModal, setShowQualificationsModal] = useState(false);
	const [showExportLeadModal, setShowExportLeadModal] = useState(false);
	const [buttonText, setButtonText] = useState("Qualification");
	const [form, setForm] = useState([]);
	const [showNoteModal, setShowNoteModal] = useState(false);
	const [integrationStatusMap, setIntegrationStatusMap] = useState({});
	const [fields, setFields] = useState(
		user?.integration_type === INTEGRATION_TYPE.SALESFORCE
			? FIELDS_SALESFORCE
			: user?.integration_type === INTEGRATION_TYPE?.PIPEDRIVE
			? FIELDS_PIPEDRIVE
			: user?.integration_type === INTEGRATION_TYPE.ZOHO
			? FIELDS_ZOHO
			: user?.integration_type === INTEGRATION_TYPE.BULLHORN
			? FIELDS_BULLHORN
			: user?.integration_type === INTEGRATION_TYPE.DYNAMICS
			? FIELDS_DYNAMICS
			: FIELDS_HUBSPOT
	);

	//set status
	useEffect(() => {
		if (!crmLeadInfo || !fieldMap) return;
		let fmap = fieldMap?.Company_Setting?.Integration_Field_Map;

		if (user.integration_type === INTEGRATION_TYPE.SALESFORCE) {
			if (
				lead?.integration_type === LEAD_INTEGRATION_TYPES.SALESFORCE_LEAD &&
				Object.keys(crmLeadInfo?.[VIEWS_SALESFORCE.LEAD]).length > 0 &&
				fmap?.lead_map.integration_status
			) {
				setIntegrationStatus({
					[VIEWS_SALESFORCE.LEAD]:
						crmLeadInfo?.[VIEWS_SALESFORCE.LEAD][fmap?.lead_map.integration_status.name],
				});
			}
			if (
				lead?.integration_type === LEAD_INTEGRATION_TYPES.SALESFORCE_CONTACT &&
				Object.keys(crmLeadInfo?.[VIEWS_SALESFORCE.CONTACT]).length > 0 &&
				Object.keys(crmLeadInfo?.[VIEWS_SALESFORCE.ACCOUNT]).length > 0
			) {
				setIntegrationStatus({
					...(fmap?.contact_map.integration_status && {
						[VIEWS_SALESFORCE.CONTACT]:
							crmLeadInfo?.[VIEWS_SALESFORCE.CONTACT][
								fmap?.contact_map.integration_status.name
							],
					}),
					...(fmap?.account_map.integration_status && {
						[VIEWS_SALESFORCE.ACCOUNT]:
							crmLeadInfo?.[VIEWS_SALESFORCE.ACCOUNT][
								fmap?.account_map.integration_status.name
							],
					}),
				});
			}
		}
		if (user.integration_type === INTEGRATION_TYPE.HUBSPOT) {
			if (
				Object.keys(crmLeadInfo?.[VIEWS_HUBSPOT.CONTACT]).length > 0 &&
				fmap?.contact_map.integration_status
			) {
				setIntegrationStatus({
					[VIEWS_HUBSPOT.CONTACT]:
						crmLeadInfo?.[VIEWS_HUBSPOT.CONTACT][
							fmap?.contact_map.integration_status.name
						],
				});
			}
		}
		if (user.integration_type === INTEGRATION_TYPE.BULLHORN) {
			if (
				lead?.integration_type === LEAD_INTEGRATION_TYPES.BULLHORN_LEAD &&
				Object.keys(crmLeadInfo?.[VIEWS_BULLHORN.LEAD]).length > 0 &&
				fmap?.lead_map.integration_status
			) {
				// setIntegrationStatus({
				// 	[VIEWS_BULLHORN.LEAD]:
				// 		crmLeadInfo?.[VIEWS_BULLHORN.LEAD][fmap?.lead_map.integration_status.name],
				// });

				setIntegrationStatus({
					...(fmap?.lead_map.integration_status && {
						[VIEWS_BULLHORN.LEAD]:
							crmLeadInfo?.[VIEWS_BULLHORN.LEAD][fmap?.lead_map.integration_status.name],
					}),
					...(fmap?.account_map.integration_status &&
						crmLeadInfo?.account && {
							[VIEWS_BULLHORN.ACCOUNT]:
								crmLeadInfo?.[VIEWS_BULLHORN.ACCOUNT][
									fmap?.account_map?.integration_status?.name
								],
						}),
				});
			}

			if (
				lead?.integration_type === LEAD_INTEGRATION_TYPES.BULLHORN_CONTACT &&
				Object.keys(crmLeadInfo?.[VIEWS_BULLHORN.CONTACT]).length > 0 &&
				fmap?.contact_map.integration_status
			) {
				setIntegrationStatus({
					...(fmap?.contact_map.integration_status && {
						[VIEWS_BULLHORN.CONTACT]:
							crmLeadInfo?.[VIEWS_BULLHORN.CONTACT][
								fmap?.contact_map?.integration_status?.name
							],
					}),
					...(fmap?.account_map.integration_status && {
						[VIEWS_BULLHORN.ACCOUNT]:
							crmLeadInfo?.[VIEWS_BULLHORN.ACCOUNT][
								fmap?.account_map?.integration_status?.name
							],
					}),
				});
			}

			if (
				lead?.integration_type === LEAD_INTEGRATION_TYPES.BULLHORN_CANDIDATE &&
				Object.keys(crmLeadInfo?.[VIEWS_BULLHORN.CANDIDATE]).length > 0 &&
				fmap?.candidate_map.integration_status
			) {
				setIntegrationStatus({
					[VIEWS_BULLHORN.CANDIDATE]:
						crmLeadInfo?.[VIEWS_BULLHORN.CANDIDATE][
							fmap?.candidate_map?.integration_status?.name
						],
				});
			}
		}
	}, [crmLeadInfo, lead, fieldMap]);

	//set status options & converted/dq
	useEffect(() => {
		if (lead && fieldMap) {
			const fieldMaps = fieldMap?.Company_Setting?.Integration_Field_Map;
			let statusPicklist = { lead: [], contact: [], account: [], candidate: [] };

			if (user.integration_type === INTEGRATION_TYPE.SALESFORCE) {
				if (
					lead.integration_type === LEAD_INTEGRATION_TYPES.SALESFORCE_LEAD &&
					lead.integration_id &&
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
					lead.integration_type === LEAD_INTEGRATION_TYPES.SALESFORCE_CONTACT &&
					lead.integration_id
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
				if (lead.integration_id && fieldMaps?.contact_map?.integration_status) {
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
			buttonFormSet({ user, lead, fieldMap, setButtonText, setForm });
		}
	}, [lead, fieldMap]);

	useEffect(() => {
		form.length &&
			fieldMap &&
			fetchCustom({
				user,
				lead,
				fieldMap,
				form,
				fields,
				setFields,
				addError,
				fetchCustomObjectDetails,
			});
	}, [form]);

	const isValidLead =
		lead?.status !== LEAD_STATUS.CONVERTED && lead?.status !== LEAD_STATUS.TRASH;

	//handlers
	const handleAccountStatusModal = () => {
		setShowAccountStatusModal(prev => !prev);
	};

	const handleQualificationsModal = () => {
		setShowQualificationsModal(prev => !prev);
	};

	const handleNoteModal = () => {
		setShowNoteModal(prev => !prev);
	};

	const handleExportLeadModal = () => {
		if (showExportLeadModal) setShowExportLeadModal(false);
		else setShowExportLeadModal({ lead_id: lead.lead_id });
	};

	const getFieldByIntegration = () => {
		if (user?.integration_type === INTEGRATION_TYPE.HUBSPOT) return VIEWS_HUBSPOT.CONTACT;
		if (user?.integration_type === INTEGRATION_TYPE.SALESFORCE)
			return isSalesforceAccount
				? fieldMap?.Company_Setting?.Integration_Field_Map?.default_integration_status
				: VIEWS_SALESFORCE.LEAD;

		if (user?.integration_type === INTEGRATION_TYPE.BULLHORN)
			return isBullhornAccount
				? lead.integration_type === LEAD_INTEGRATION_TYPES.BULLHORN_LEAD
					? fieldMap?.Company_Setting?.Integration_Field_Map?.default_integration_status
							?.lead
					: fieldMap?.Company_Setting?.Integration_Field_Map?.default_integration_status
							?.contact
				: VIEWS_BULLHORN.CANDIDATE;
	};

	return (
		<ErrorBoundary>
			<div className={styles.leadHeader}>
				<div className={styles.left}>
					<BackButton
						text={PEOPLE_TRANSLATION.PEOPLE_LIST[user?.language?.toUpperCase()]}
						link="/leads"
					/>
					<h4>
						{lead?.first_name ?? ""} {lead?.last_name ?? ""}
					</h4>
				</div>
				<div className={styles.right}>
					{getAccountProgressByIntegration(user.integration_type, lead, fieldMap) && (
						<Div
							loading={salesforceQuery?.isLoading || leadLoading || crmLeadInfoLoading}
						>
							<Tooltip
								text={
									isValidLead
										? `Change ${getFieldByIntegration()} status`
										: `Lead ${LEAD_STATUS_LABEL_MAP[lead?.status]}`
								}
								className={styles.showTooltip}
								style={{
									visibility: integrationStatus === "INVALID" ? "hidden" : "visible",
								}}
							>
								<ThemedButton
									width="fit-content"
									height="40px"
									theme={ThemedButtonThemes.GREY}
									className={styles.btn}
									style={{
										minWidth: "8em",
									}}
									onClick={handleAccountStatusModal}
									disabled={!isValidLead}
								>
									<div className={styles.btnContent}>
										{integrationStatusPicklist[getFieldByIntegration()]?.find(
											op => op.value === integrationStatus[getFieldByIntegration()]
										)?.label || "Status"}
									</div>
								</ThemedButton>
							</Tooltip>
						</Div>
					)}
					{getQualificationsByLeadIntegration(lead?.integration_type) && form.length > 0 && (
						<Div
							loading={
								salesforceQuery?.isLoading ||
								leadLoading ||
								fetchCustomObjectDetailsLoading
							}
						>
							<ThemedButton
								height="40px"
								theme={ThemedButtonThemes.GREY}
								className={styles.btn}
								onClick={handleQualificationsModal}
							>
								<div className={`${styles.qual}`}>
									{/* <PlusOutline /> */}
									{buttonText}
								</div>
							</ThemedButton>
						</Div>
					)}
					{getExportByLeadIntegration(lead?.integration_type) && (
						<ThemedButton
							width="fit-content"
							height="40px"
							theme={ThemedButtonThemes.GREY}
							className={styles.btn}
							onClick={handleExportLeadModal}
						>
							<div className={styles.btnContent}>
								{/* <Export /> */}
								Export lead
							</div>
						</ThemedButton>
					)}
					<ThemedButton
						width="fit-content"
						height="40px"
						theme={ThemedButtonThemes.GREY}
						className={styles.btn}
						onClick={handleCustomTaskModal}
					>
						<PlusOutline />
						<div className={styles.btnContent}>
							{TASKS_TRANSLATION.REMINDER[user?.language?.toUpperCase()]}
						</div>
					</ThemedButton>
					<ThemedButton
						width="fit-content"
						height="40px"
						theme={ThemedButtonThemes.GREY}
						className={styles.btn}
						onClick={handleNoteModal}
					>
						<PlusOutline />
						<div className={styles.btnContent}>
							{TASKS_TRANSLATION.NOTE[user?.language?.toUpperCase()]}
						</div>
					</ThemedButton>
				</div>
				{getAccountProgressByIntegration(user.integration_type, lead, fieldMap) && (
					<AccountProgressModal
						isOpen={showAccountStatusModal}
						integrationStatus={integrationStatus}
						setIntegrationStatus={setIntegrationStatus}
						onClose={handleAccountStatusModal}
						integrationStatusPicklist={integrationStatusPicklist}
						updateSalesforceQualifications={updateSalesforceQualifications}
						isSalesforceAccount={isSalesforceAccount || isBullhornAccount}
						salesforceQuery={salesforceQuery}
						lead={lead}
						fieldMap={fieldMap}
						integrationStatusMap={integrationStatusMap}
					/>
				)}
				{getQualificationsByLeadIntegration(lead?.integration_type) && (
					<QualificationsModal
						modal={showQualificationsModal}
						onClose={handleQualificationsModal}
						form={form}
						buttonText={buttonText}
						fields={fields}
						fetchCustomObjectDetailsLoading={fetchCustomObjectDetailsLoading}
						lead={lead}
					/>
				)}
				{getExportByLeadIntegration(lead?.integration_type) && (
					<LeadExportModal
						modal={showExportLeadModal}
						setModal={setShowExportLeadModal}
						refetch={refetchLead}
					/>
				)}
				<GlobalModals
					type="note"
					modalProps={{
						isModal: showNoteModal,
						onClose: handleNoteModal,
						disableOutsideClick: true,
					}}
					typeSpecificProps={{
						lead,
					}}
				>
					<div className={styles.btnContent}>
						{TASKS_TRANSLATION.ADD_NOTE[user?.language?.toUpperCase()]}
					</div>
				</GlobalModals>
				<GlobalModals
					type={GLOBAL_MODAL_TYPES.SALESFORCE_TOKEN_EXPIRED}
					modalProps={{
						isModal: isTokenExpired,
						onClose: () => setIsTokenExpired(false),
					}}
				/>
			</div>
		</ErrorBoundary>
	);
};

export default LeadHeader;
