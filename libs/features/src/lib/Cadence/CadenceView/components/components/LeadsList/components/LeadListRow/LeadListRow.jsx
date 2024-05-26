import { useContext, forwardRef } from "react";
import moment from "moment-timezone";

import { Tooltip } from "@cadence-frontend/components";
import { ThemedButton, Checkbox, DropDown } from "@cadence-frontend/widgets";
import { MessageContext } from "@cadence-frontend/contexts";
import { ThemedButtonThemes, TooltipThemes } from "@cadence-frontend/themes";
import {
	getSalesforceUrl,
	getPipedriveUrl,
	getHubspotUrl,
	getGoogleSheetUrl,
	getSellsyUrl,
	getDynamicsUrl,
	getZohoUrl,
	getIntegrationIconForLead,
	getBullhornUrl,
	capitalize,
} from "@cadence-frontend/utils";
import {
	Play,
	Pause,
	Paused,
	Refresh,
	Leads,
	Building,
	More,
	Delete,
	ReAssign,
	CadenceBox,
	Hot,
	Export,
} from "@cadence-frontend/icons";
import { getExportByLeadIntegration, getLabelFromEnum } from "./constants";
import {
	CADENCE_STATUS,
	STATUS_LABELS_CL_NAMES,
	ACTIONS,
} from "../../../../../../constants";
import { Colors } from "@cadence-frontend/utils";

import { isActionPermitted, isMoreOptionsEnabled } from "../../../../../../utils";
import styles from "../../LeadsList.module.scss";
import Placeholder from "../Placeholder/Placeholder";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";
import {
	CADENCE_INTEGRATION_TYPE,
	INTEGRATION_TYPE,
	LEAD_INTEGRATION_TYPES,
	LEAD_WARMTH,
} from "@cadence-frontend/constants";
import { SHOW_REASSIGNMENT_MODAL } from "../../constants";
import { Cadence as CADENCE_TRANSLATION } from "@cadence-frontend/languages";
import { BULK_LEADS_SELECTION_OPTIONS } from "../SelectLeadsModal/constant";

const LeadListRow = forwardRef(
	(
		{
			index,
			lead,
			totalLeads,
			cadence,
			user,
			setSelectedLead,
			setDeleteModal,
			// setReassignmentModal,
			setShowReassignment,
			setLeadDetailsModal,
			setReplaceCadenceModal,
			setExportLeadModal,
			checkedLeads,
			setCheckedLeads,
			viewMode,
			actionDisabled,
			setActionDisabled,
			cadenceLeadsDataAccess,
			noOfColumns,
			loading,
			selectAllLeads,
			setSelectAllLeads,
			setActive,
			cadenceTotalLeads,
			fieldMap,
		},
		ref
	) => {
		const user_info = useRecoilValue(userInfo);
		const { addError, addSuccess } = useContext(MessageContext);
		const INTEGRATION_ICON = getIntegrationIconForLead({
			lead_integration_type: lead.integration_type,
			box: true,
		});
		const {
			pauseCadenceForLead,
			resumeCadenceForLead,
			pauseLoading,
			resumeLoading,
			deleteLeadsLoading,
		} = cadenceLeadsDataAccess;

		const cadenceId = cadence?.cadence_id;
		let moreBtnPressed = false;

		const getTypeIcon = lead => {
			if (lead.integration_type === LEAD_INTEGRATION_TYPES.SALESFORCE_LEAD)
				return <Leads size="1.3rem" title="Lead" />;
			else if (lead.integration_type === LEAD_INTEGRATION_TYPES.SALESFORCE_CONTACT)
				return <Building size="1.3rem" title="Contact" />;
			else return "";
		};

		const handleCadencePause = async (e, lead) => {
			setActionDisabled(lead.lead_id);
			e.stopPropagation();

			const body = { ...lead, cadence_ids: [cadenceId], lead_id: lead.lead_id };
			pauseCadenceForLead(body, {
				onError: err =>
					addError({
						text: err?.response?.data?.msg,
						desc: err?.response?.data?.error,
						cId: err?.response?.data?.correlationId,
					}),
				onSuccess: res => {
					addSuccess(res.msg || "Paused cadence for lead successfully");
				},
			});
		};

		const handleCadenceResume = async (e, lead) => {
			setActionDisabled(lead.lead_id);
			e.stopPropagation();

			const body = { ...lead, cadence_ids: [cadenceId], lead_id: lead.lead_id };
			resumeCadenceForLead(body, {
				onError: err =>
					addError({
						text: err?.response?.data?.msg,
						desc: err?.response?.data?.error,
						cId: err?.response?.data?.correlationId,
					}),
				onSuccess: res => {
					addSuccess(res.msg || "Resumed cadence for lead successfully");
				},
			});
		};

		const handleIntegrationIconClick = (e, lead) => {
			e.stopPropagation();
			let URL;
			switch (lead?.integration_type) {
				case LEAD_INTEGRATION_TYPES.SALESFORCE_LEAD:
				case LEAD_INTEGRATION_TYPES.SALESFORCE_CONTACT: {
					URL = getSalesforceUrl(lead, user_info?.instance_url);
					break;
				}
				case LEAD_INTEGRATION_TYPES.PIPEDRIVE_PERSON: {
					URL = getPipedriveUrl(lead?.integration_id, user_info?.instance_url);
					break;
				}
				case LEAD_INTEGRATION_TYPES.GOOGLE_SHEETS_LEAD: {
					URL = getGoogleSheetUrl(cadence?.salesforce_cadence_id);
					break;
				}
				case LEAD_INTEGRATION_TYPES.HUBSPOT_CONTACT: {
					URL = getHubspotUrl(lead.integration_id, user_info?.company_integration_id);
					break;
				}
				case LEAD_INTEGRATION_TYPES.SELLSY_CONTACT: {
					URL = getSellsyUrl(lead.integration_id);
					break;
				}
				case LEAD_INTEGRATION_TYPES.ZOHO_LEAD:
				case LEAD_INTEGRATION_TYPES.ZOHO_CONTACT: {
					URL = getZohoUrl(lead, user_info?.instance_url);
					break;
				}
				case LEAD_INTEGRATION_TYPES.BULLHORN_LEAD:
				case LEAD_INTEGRATION_TYPES.BULLHORN_CONTACT:
				case LEAD_INTEGRATION_TYPES.BULLHORN_CANDIDATE: {
					URL = getBullhornUrl(lead, user_info?.instance_url);
					break;
				}
				case LEAD_INTEGRATION_TYPES.DYNAMICS_LEAD:
				case LEAD_INTEGRATION_TYPES.DYNAMICS_CONTACT: {
					URL = getDynamicsUrl(lead, user_info?.instance_url);
					break;
				}
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
					addError({ text: "This lead does not have the required info." });
				}
			}
			if (URL) window.open(URL, "_blank");
		};

		const handleLeadClick = () => {
			if (!moreBtnPressed) setLeadDetailsModal(lead);
		};

		const handleDropdownBtnClick = (event, setModal, value) => {
			event.stopPropagation();
			moreBtnPressed = true;
			setModal(value);
			window.onmousedown = e => {
				moreBtnPressed = false;
				if (e.target !== event.target) setModal(null);
				window.onmousedown = null;
			};
		};

		const getLeadStatus = lead => {
			if (lead.lead_cadence_status === CADENCE_STATUS.STOPPED)
				return lead.lead_cadence_status;
			if (lead.lead_cadence_status === CADENCE_STATUS.NOT_STARTED)
				return lead.lead_cadence_status;
			if (lead.lead_cadence_status === CADENCE_STATUS.COMPLETED)
				return lead.lead_cadence_status;
			if (cadence?.status === CADENCE_STATUS.PAUSED) return CADENCE_STATUS.PAUSED;
			return lead.lead_cadence_status;
		};

		const getSfStatus = lead => {
			switch (user_info?.integration_type) {
				case INTEGRATION_TYPE.SALESFORCE:
					return lead.integration_type === LEAD_INTEGRATION_TYPES.SALESFORCE_CONTACT
						? fieldMap?.Company_Setting?.Integration_Field_Map
								?.default_integration_status === "contact"
							? lead?.integration_status ?? "NA"
							: lead?.Account?.integration_status ?? "NA"
						: lead?.integration_status ?? "NA";

				case INTEGRATION_TYPE.BULLHORN:
					// if lead.integration_type is bullhorn lead or bullhorn contact
					// will take value from default_integration_status?.contact or default_integration_status?.lead
					// default_integration_status?.contact === "contact"
					// default_integration_status?.lead === "lead"
					// will show value of lead?.integration_status
					// else lead?.Account?.integration_status
					//  if lead.integration_type is bullhorn candidate, will show value from lead?.integration_status

					return lead.integration_type === LEAD_INTEGRATION_TYPES.BULLHORN_CONTACT ||
						lead.integration_type === LEAD_INTEGRATION_TYPES.BULLHORN_LEAD
						? fieldMap?.Company_Setting?.Integration_Field_Map?.default_integration_status
								?.contact === "contact" ||
						  fieldMap?.Company_Setting?.Integration_Field_Map?.default_integration_status
								?.lead === "lead"
							? lead?.integration_status ?? "NA"
							: lead?.Account?.integration_status ?? "NA"
						: lead?.integration_status ?? "NA";
				default:
					return "NA";
			}
		};

		const positionProps = (() => {
			const props = { right: "10px" };
			if (totalLeads > 3 && index >= totalLeads - 2) props.bottom = "50px";
			else props.top = "50px";
			return props;
		})();

		return loading ? (
			<Placeholder noOfColumns={noOfColumns} />
		) : (
			<tr key={lead.lead_id} onClick={handleLeadClick} ref={ref}>
				<td onClick={e => e.stopPropagation()}>
					<Checkbox
						className={styles.checkBox}
						checked={checkedLeads?.includes(lead.lead_id)}
						onChange={() => {
							if (cadenceTotalLeads > 20) {
								setSelectAllLeads(false);
								setActive("");
							}

							checkedLeads.includes(lead.lead_id)
								? setCheckedLeads(prevState =>
										prevState.filter(item => item !== lead.lead_id)
								  )
								: setCheckedLeads(prevState => [...prevState, lead.lead_id]);
						}}
					/>
				</td>
				<td className={styles.name} title={`${lead.first_name} ${lead.last_name}`}>
					<div>
						<span>
							<span>
								<INTEGRATION_ICON
									size={
										lead.integration_type === LEAD_INTEGRATION_TYPES.ZOHO_LEAD ||
										lead.integration_type === LEAD_INTEGRATION_TYPES.ZOHO_CONTACT
											? "2.5rem"
											: "2rem"
									}
									onClick={e => handleIntegrationIconClick(e, lead)}
									color={Colors.salesforce}
								/>
								<CadenceBox
									size="2rem"
									style={{ cursor: "pointer" }}
									onClick={e => {
										e.stopPropagation();
										e.preventDefault();
										window.open(`/crm/leads/${lead.lead_id}`);
									}}
									color="white"
								/>
								<Tooltip text={lead.Account?.name} theme={TooltipThemes.RIGHT}>
									{getTypeIcon(lead)}
								</Tooltip>
							</span>
							<span>{`${lead.first_name ?? ""} ${lead.last_name ?? ""}`}</span>
						</span>

						<div className={styles.hotLead}>
							{lead?.lead_warmth === LEAD_WARMTH.HOT_LEAD && <Hot />}
						</div>
					</div>
				</td>

				{!viewMode && (
					<>
						<td
							className={styles.phone}
							title={
								lead?.Lead_phone_numbers.filter(phone => phone.phone_number.length > 0)
									.length > 1
									? lead?.Lead_phone_numbers?.filter(
											phone => phone.phone_number.length > 0
									  )?.map(p => `${p?.phone_number}`)
									: lead?.Lead_phone_numbers.filter(
											phone => phone.phone_number.length > 0
									  )[0]?.phone_number
							}
						>
							{lead?.Lead_phone_numbers.filter(phone => phone.phone_number.length > 0)
								.length > 1
								? lead?.Lead_phone_numbers.filter(
										phone => phone.phone_number.length > 0
								  ).filter(phone => phone?.is_primary)[0]?.phone_number
									? `${
											lead?.Lead_phone_numbers.filter(
												phone => phone.phone_number.length > 0
											).filter(phone => phone?.is_primary)[0]?.phone_number
									  }...`
									: "NA"
								: lead?.Lead_phone_numbers.filter(
										phone => phone.phone_number.length > 0
								  )[0]?.phone_number ?? "NA"}
						</td>

						<td
							className={styles.email}
							title={
								lead?.Lead_emails.filter(email => email.email_id.length > 0).length > 1
									? lead?.Lead_emails?.filter(email => email.email_id.length > 0)?.map(
											p => `${p?.email_id},`
									  )
									: lead?.Lead_emails.filter(email => email.email_id.length > 0)[0]
											?.email_id
							}
						>
							{lead?.Lead_emails.filter(email => email.email_id.length > 0).length > 1
								? lead?.Lead_emails.filter(email => email.email_id.length > 0).filter(
										email => email?.is_primary
								  )[0]?.email_id
									? `${
											lead?.Lead_emails.filter(email => email.email_id.length > 0).filter(
												email => email?.is_primary
											)[0]?.email_id
									  }...`
									: "NA"
								: lead?.Lead_emails.filter(email => email.email_id.length > 0)[0]
										?.email_id ?? "NA"}
						</td>
					</>
				)}
				<td
					className={styles.ownerName}
					title={`${lead.User?.first_name} ${lead.User?.last_name}`}
				>
					{`${lead.User?.first_name} ${lead.User?.last_name}`}
				</td>
				{(user_info?.integration_type === INTEGRATION_TYPE.SALESFORCE ||
					user_info?.integration_type === INTEGRATION_TYPE.BULLHORN) &&
					!viewMode && (
						<td className={styles.integrationStatus} title={getSfStatus(lead)}>
							{getSfStatus(lead)}
						</td>
					)}
				<td className={styles.status}>
					<span className={`${styles[STATUS_LABELS_CL_NAMES[getLeadStatus(lead)]]}`}>
						{getLabelFromEnum(getLeadStatus(lead), user)}
						{lead.lead_cadence_status === CADENCE_STATUS.PAUSED && lead.unix_resume_at && (
							<span tooltip={`Until ${moment(lead.unix_resume_at).format("LLL")}`}>
								<Paused />
							</span>
						)}
					</span>
				</td>
				<td className={styles.actions}>
					<div>
						{lead.lead_cadence_status === CADENCE_STATUS.IN_PROGRESS ? (
							<Tooltip
								text={
									!isActionPermitted(
										ACTIONS.UPDATE,
										cadence?.type,
										user?.role,
										cadence?.user_id === user?.user_id
									)
										? "This has been disabled as it is a personal cadence"
										: CADENCE_TRANSLATION.PAUSE[user?.language?.toUpperCase()]
								}
								theme={
									!isActionPermitted(
										ACTIONS.UPDATE,
										cadence?.type,
										user?.role,
										cadence?.user_id === user?.user_id
									)
										? TooltipThemes.LEFT
										: TooltipThemes.BOTTOM
								}
							>
								<ThemedButton
									width="50px"
									height="40px"
									disabled={
										cadence?.status === CADENCE_STATUS.PAUSED ||
										cadence?.status === CADENCE_STATUS.NOT_STARTED ||
										cadence?.status === CADENCE_STATUS.STOPPED ||
										!isActionPermitted(
											ACTIONS.UPDATE,
											cadence?.type,
											user?.role,
											cadence?.user_id === user?.user_id
										)
									}
									theme={ThemedButtonThemes.GREY}
									loading={actionDisabled === lead.lead_id ? pauseLoading : false}
									onClick={e => handleCadencePause(e, lead)}
								>
									<div>
										<Pause />
									</div>
								</ThemedButton>
							</Tooltip>
						) : (
							<Tooltip
								text={
									!isActionPermitted(
										ACTIONS.UPDATE,
										cadence?.type,
										user?.role,
										cadence?.user_id === user?.user_id
									)
										? "This has been disabled as it is a personal cadence"
										: CADENCE_TRANSLATION.RESUME[user?.language?.toUpperCase()]
								}
								theme={
									!isActionPermitted(
										ACTIONS.UPDATE,
										cadence?.type,
										user?.role,
										cadence?.user_id === user?.user_id
									)
										? TooltipThemes.LEFT
										: TooltipThemes.BOTTOM
								}
							>
								<ThemedButton
									width="50px"
									height="40px"
									theme={ThemedButtonThemes.GREY}
									disabled={
										lead.lead_cadence_status === CADENCE_STATUS.STOPPED ||
										cadence?.status === CADENCE_STATUS.NOT_STARTED ||
										!isActionPermitted(
											ACTIONS.UPDATE,
											cadence?.type,
											user?.role,
											cadence?.user_id === user?.user_id
										)
									}
									loading={actionDisabled === lead.lead_id ? resumeLoading : false}
									onClick={e => handleCadenceResume(e, lead)}
								>
									<div>
										<Play />
									</div>
								</ThemedButton>
							</Tooltip>
						)}
						<DropDown
							width="max-content"
							btn={
								<ThemedButton
									height="40px"
									width="50px"
									className={styles.dotsBtn}
									theme={ThemedButtonThemes.GREY}
									disabled={
										!isMoreOptionsEnabled(
											cadence?.type,
											user?.role,
											user?.user_id === cadence?.user_id
										) ||
										!isActionPermitted(
											ACTIONS.UPDATE,
											cadence?.type,
											user?.role,
											cadence?.user_id === user?.user_id
										)
									}
								>
									<div>
										<More />
									</div>
								</ThemedButton>
							}
							tooltipText={"More"}
							disabled={
								!isMoreOptionsEnabled(
									cadence?.type,
									user?.role,
									user?.user_id === cadence?.user_id
								) ||
								!isActionPermitted(
									ACTIONS.UPDATE,
									cadence?.type,
									user?.role,
									cadence?.user_id === user?.user_id
								)
							}
							{...positionProps}
						>
							{SHOW_REASSIGNMENT_MODAL(user_info.integration_type) &&
								![
									LEAD_INTEGRATION_TYPES.SALESFORCE_GOOGLE_SHEET_LEAD,
									LEAD_INTEGRATION_TYPES.SALESFORCE_CSV_LEAD,
									LEAD_INTEGRATION_TYPES.SELLSY_CSV_CONTACT,
									LEAD_INTEGRATION_TYPES.SELLSY_GOOGLE_SHEET_CONTACT,
								].includes(lead?.integration_type) && (
									<button
										className={styles.dropdownBtn}
										onClick={event => {
											setSelectedLead(lead);
											event.stopPropagation();
											setShowReassignment(true);
										}}
										disabled={
											!isActionPermitted(
												ACTIONS.UPDATE,
												cadence?.type,
												user?.role,
												cadence?.user_id === user?.user_id
											)
										}
									>
										<div>
											<ReAssign size={18} />
										</div>
										<div>
											{
												CADENCE_TRANSLATION.OWNER_REASSIGNMENT[
													user?.language?.toUpperCase()
												]
											}
										</div>
									</button>
								)}
							{cadence?.integration_type !== CADENCE_INTEGRATION_TYPE.SHEETS &&
								user_info.integration_type !== INTEGRATION_TYPE.GOOGLE_SHEETS && (
									<button
										className={styles.dropdownBtn}
										onClick={event =>
											handleDropdownBtnClick(event, setReplaceCadenceModal, {
												lead_ids: [lead?.lead_id],
												cadence_id: cadence?.cadence_id,
												cadenceType: cadence?.type,
												option: selectAllLeads ? "all" : "selected",
											})
										}
										disabled={
											!isActionPermitted(
												ACTIONS.UPDATE,
												cadence?.type,
												user?.role,
												cadence?.user_id === user?.user_id
											)
										}
									>
										<div>
											<Refresh size={14} />
										</div>
										<span>
											{
												CADENCE_TRANSLATION?.MOVE_TO_ANOTHER_CADENCE?.[
													user?.language?.toUpperCase()
												]
											}
										</span>
									</button>
								)}
							<button
								className={styles.dropdownBtn}
								onClick={event => {
									setSelectedLead(lead);
									handleDropdownBtnClick(event, setDeleteModal, true);
								}}
								disabled={
									deleteLeadsLoading ||
									!isActionPermitted(
										ACTIONS.UPDATE,
										cadence?.type,
										user?.role,
										cadence?.user_id === user?.user_id
									)
								}
							>
								<div>
									<Delete size={14} />
								</div>
								<span>
									{CADENCE_TRANSLATION?.DELETE_LEAD?.[user?.language?.toUpperCase()]}
								</span>
							</button>
							{getExportByLeadIntegration(lead.integration_type) && (
								<button
									className={styles.dropdownBtn}
									onClick={event =>
										handleDropdownBtnClick(event, setExportLeadModal, {
											lead_id: lead.lead_id,
										})
									}
									disabled={
										!isActionPermitted(
											ACTIONS.UPDATE,
											cadence?.type,
											user?.role,
											cadence?.user_id === user?.user_id
										)
									}
								>
									<div>
										<Export size={16} />
									</div>
									<span>{`Export To ${capitalize(user_info?.integration_type)}`}</span>
								</button>
							)}
						</DropDown>
					</div>
				</td>
			</tr>
		);
	}
);

export default LeadListRow;
