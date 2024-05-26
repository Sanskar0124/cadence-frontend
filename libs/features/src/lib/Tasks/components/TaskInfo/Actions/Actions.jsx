/* eslint-disable no-console */
import { useContext, useEffect, useState } from "react";

import { Div, ErrorBoundary, Tooltip } from "@cadence-frontend/components";
import {
	GLOBAL_MODAL_TYPES,
	INTEGRATION_TYPE,
	LEAD_INTEGRATION_TYPES,
	LEAD_STATUS,
	PRODUCT_TOUR_STATUS,
} from "@cadence-frontend/constants";
import { MessageContext } from "@cadence-frontend/contexts";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { useCustomObject, useLead } from "@cadence-frontend/data-access";
import {
	AccountProgressModal,
	GlobalModals,
	QualificationsModal,
	ThemedButton,
} from "@cadence-frontend/widgets";

//constants
import { tourInfo, userInfo } from "@cadence-frontend/atoms";
import {
	Tasks as TASKS_TRANSLATION,
	Common as COMMON_TRANSLATION,
} from "@cadence-frontend/languages";
import { getTaskEnum } from "@cadence-frontend/utils";
import { useRecoilValue } from "recoil";
import styles from "./Actions.module.scss";
import {
	getAccountProgressByIntegration,
	getQualificationsByLeadIntegration,
	FIELDS_SALESFORCE,
	FIELDS_PIPEDRIVE,
	FIELDS_HUBSPOT,
	FIELDS_ZOHO,
	FIELDS_BULLHORN,
	fetchCustom,
	buttonFormSet,
	VIEWS_HUBSPOT,
	getExportByLeadIntegration,
	FIELDS_DYNAMICS,
	VIEWS_SALESFORCE,
	LEAD_STATUS_LABEL_MAP,
	getExportLeadConditionByLeadIntegration,
	VIEWS_BULLHORN,
} from "./constants";
import LeadExportModal from "../../../../Cadence/CadenceView/components/components/LeadsList/components/LeadExportModal/LeadExportModal";
import { PlusOutline } from "@cadence-frontend/icons";

function Actions({
	activeTaskInfo,
	lead,
	leadInfoLoading,
	fieldMap,
	fieldMapLoading,
	refetchLead,
	integrationStatusPicklist,
	isSalesforceAccount,
	onSidebarClose,
	leadSalesforceDataAccess,
	integrationStatusMap,
	changeToNextPowerTask,
}) {
	const [showAccountStatusModal, setShowAccountStatusModal] = useState(false);
	const user = useRecoilValue(userInfo);
	const tour = useRecoilValue(tourInfo);
	const [showQualificationsModal, setShowQualificationsModal] = useState(false);
	const [showExportLeadModal, setShowExportLeadModal] = useState(false);
	const [integrationStatus, setIntegrationStatus] = useState("INVALID");
	const [calendarDisplay, setCalendarDisplay] = useState(false);
	const [buttonText, setButtonText] = useState(
		COMMON_TRANSLATION.QUALIFICATION[user?.language?.toUpperCase()]
	);

	const [form, setForm] = useState([]);
	const [activeModalParams, setActiveModalParams] = useState({});
	const { addError } = useContext(MessageContext);
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
	//queries
	const { salesforceQuery, updateSalesforceQualifications } = leadSalesforceDataAccess;
	const { fetchCustomObjectDetails, fetchCustomObjectDetailsLoading } = useCustomObject();
	const { crmLeadInfo, crmLeadInfoLoading } = useLead(
		null,
		false,
		lead?.lead_id,
		false,
		user?.interation_type === INTEGRATION_TYPE.SALESFORCE ||
			user?.interation_type === INTEGRATION_TYPE.HUBSPOT
	);

	const handleActionClick = ({ type, customFields, onClose, ...rest }) => {
		setActiveModalParams({
			type: type ?? getTaskEnum(activeTaskInfo),
			typeSpecificProps: {
				...customFields,
				lead,
				cadence: activeTaskInfo?.Cadence,
				node: activeTaskInfo?.Node,
			},
			modalProps: {
				isModal: true,
				onClose: () => {
					if (typeof onClose === "function") onClose();
					//remember this setState not only closes the modal but also reinitalizes all keys back to their original values,
					//if there was a change innerModalState(inside GlobalModals) its values will be reinitialized with isModal:false
					setActiveModalParams(prev => ({
						...prev,
						modalProps: {
							...prev.modalProps,
							isModal: false,
						},
					}));
				},
			},
		});
	};

	//set status
	useEffect(() => {
		if (!crmLeadInfo || !fieldMap || !lead) return;
		let fmap = fieldMap?.Company_Setting?.Integration_Field_Map;
		if (user.integration_type === INTEGRATION_TYPE.SALESFORCE) {
			if (
				lead?.integration_type === LEAD_INTEGRATION_TYPES.SALESFORCE_LEAD &&
				Object.keys(crmLeadInfo?.[VIEWS_SALESFORCE.LEAD]).length > 0 &&
				fmap.lead_map.integration_status
			) {
				setIntegrationStatus({
					[VIEWS_SALESFORCE.LEAD]:
						crmLeadInfo?.[VIEWS_SALESFORCE.LEAD][fmap.lead_map.integration_status.name],
				});
			}
			if (
				lead?.integration_type === LEAD_INTEGRATION_TYPES.SALESFORCE_CONTACT &&
				Object.keys(crmLeadInfo?.[VIEWS_SALESFORCE.CONTACT]).length > 0 &&
				Object.keys(crmLeadInfo?.[VIEWS_SALESFORCE.ACCOUNT]).length > 0
			) {
				setIntegrationStatus({
					...(fmap.contact_map.integration_status && {
						[VIEWS_SALESFORCE.CONTACT]:
							crmLeadInfo?.[VIEWS_SALESFORCE.CONTACT][
								fmap.contact_map.integration_status.name
							],
					}),
					...(fmap.account_map.integration_status && {
						[VIEWS_SALESFORCE.ACCOUNT]:
							crmLeadInfo?.[VIEWS_SALESFORCE.ACCOUNT][
								fmap.account_map.integration_status.name
							],
					}),
				});
			}
		}
		if (user.integration_type === INTEGRATION_TYPE.HUBSPOT) {
			if (
				Object.keys(crmLeadInfo?.[VIEWS_HUBSPOT.CONTACT]).length > 0 &&
				fmap.contact_map.integration_status
			) {
				setIntegrationStatus({
					[VIEWS_HUBSPOT.CONTACT]:
						crmLeadInfo?.[VIEWS_HUBSPOT.CONTACT][
							fmap.contact_map.integration_status.name
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

	useEffect(() => {
		if (lead && Object.keys(lead).length !== 0)
			buttonFormSet({ user, lead, fieldMap, setButtonText, setForm });
	}, [lead, leadInfoLoading, fieldMapLoading]);

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
	}, [form, fieldMap]);

	const isValidLead = () =>
		lead?.status !== LEAD_STATUS.CONVERTED && lead?.status !== LEAD_STATUS.TRASH;

	//handlers
	const handleAccountStatusModal = () => {
		setShowAccountStatusModal(prev => !prev);
	};

	const handleQualificationsModal = () => {
		setShowQualificationsModal(false);
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
			return isSalesforceAccount
				? lead.integration_type === LEAD_INTEGRATION_TYPES.BULLHORN_LEAD
					? fieldMap?.Company_Setting?.Integration_Field_Map?.default_integration_status
							?.lead
					: fieldMap?.Company_Setting?.Integration_Field_Map?.default_integration_status
							?.contact
				: VIEWS_BULLHORN.CANDIDATE;
	};

	return (
		<ErrorBoundary>
			<>
				<div className={styles.container}>
					{tour?.status !== PRODUCT_TOUR_STATUS.AFTER_ONBOARDING_PENDING && (
						<>
							{getAccountProgressByIntegration(user.integration_type, lead, fieldMap) &&
								!leadInfoLoading && (
									<Div
										loading={
											salesforceQuery?.isLoading || leadInfoLoading || crmLeadInfoLoading
										}
									>
										<Tooltip
											text={
												isValidLead
													? `Change ${getFieldByIntegration()} status`
													: `Lead ${LEAD_STATUS_LABEL_MAP[lead?.status]}`
											}
											className={styles.showTooltip}
											style={{
												visibility:
													integrationStatus === "INVALID" ? "hidden" : "visible",
											}}
										>
											<ThemedButton
												width="fit-content"
												height="40px"
												theme={ThemedButtonThemes.GREY}
												style={{
													fontWeight: 600,
													height: "2.75em",
													minWidth: "8em",
													visibility:
														integrationStatus === "INVALID" || !isValidLead()
															? "hidden"
															: "visible",
												}}
												onClick={handleAccountStatusModal}
											>
												<div className={styles.status}>
													{integrationStatusPicklist[getFieldByIntegration()]?.find(
														op => op.value === integrationStatus[getFieldByIntegration()]
													)?.label || "Status"}
												</div>
											</ThemedButton>
										</Tooltip>
									</Div>
								)}
							{getQualificationsByLeadIntegration(lead?.integration_type) &&
								form.length > 0 &&
								!fieldMapLoading &&
								!leadInfoLoading && (
									<Div>
										{/* Qualifications */}
										<ThemedButton
											width="fit-content"
											height="40px"
											theme={ThemedButtonThemes.GREY}
											style={{
												fontWeight: 600,
												height: "2.75em",
											}}
											onClick={() => {
												setShowQualificationsModal(true);
												fetchCustom({
													lead,
													fieldMap,
													form,
													fields,
													setFields,
													addError,
													fetchCustomObjectDetails,
												});
											}}
										>
											<div title={buttonText} className={styles.qual}>
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
									style={{
										fontWeight: 600,
										height: "2.75em",
									}}
									onClick={handleExportLeadModal}
								>
									<div>Export lead</div>
								</ThemedButton>
							)}
						</>
					)}
					<ThemedButton
						width="fit-content"
						height="40px"
						theme={ThemedButtonThemes.GREY}
						style={{
							fontWeight: 600,
							height: "2.75em",
						}}
						onClick={() => {
							handleActionClick({
								type: GLOBAL_MODAL_TYPES.CUSTOM_TASK,
								customFields: {
									calendarDisplay,
									setCalendarDisplay,
								},
								onClose: () => {
									setCalendarDisplay(false);
								},
							});
						}}
					>
						<PlusOutline />
						<div>{TASKS_TRANSLATION.REMINDER[user?.language?.toUpperCase()]}</div>
					</ThemedButton>
					<ThemedButton
						width="fit-content"
						height="40px"
						theme={ThemedButtonThemes.GREY}
						style={{
							fontWeight: 600,
							height: "2.75em",
						}}
						onClick={() =>
							handleActionClick({
								type: GLOBAL_MODAL_TYPES.NOTE,
							})
						}
					>
						<PlusOutline />
						<div>{TASKS_TRANSLATION.NOTE[user?.language?.toUpperCase()]}</div>
					</ThemedButton>
				</div>
				<GlobalModals {...activeModalParams} />
				{getAccountProgressByIntegration(user.integration_type) && (
					<AccountProgressModal
						isOpen={showAccountStatusModal}
						integrationStatus={integrationStatus}
						setIntegrationStatus={setIntegrationStatus}
						onClose={handleAccountStatusModal}
						integrationStatusPicklist={integrationStatusPicklist}
						updateSalesforceQualifications={updateSalesforceQualifications}
						isSalesforceAccount={isSalesforceAccount}
						salesforceQuery={salesforceQuery}
						lead={lead}
						fieldMap={fieldMap}
						activeTaskInfo={activeTaskInfo}
						onSidebarClose={onSidebarClose}
						integrationStatusMap={integrationStatusMap}
						changeToNextPowerTask={changeToNextPowerTask}
					/>
				)}
				{getQualificationsByLeadIntegration(lead?.integration_type) && (
					<QualificationsModal
						modal={showQualificationsModal}
						onClose={handleQualificationsModal}
						form={form}
						buttonText={COMMON_TRANSLATION.QUALIFICATION[user?.language?.toUpperCase()]}
						// buttonText={buttonText}
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
			</>
		</ErrorBoundary>
	);
}

export default Actions;
