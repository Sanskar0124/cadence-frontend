import { userInfo } from "@cadence-frontend/atoms";
import { LEAD_INTEGRATION_TYPES, LEAD_WARMTH } from "@cadence-frontend/constants";
import { CadenceBox, Hot } from "@cadence-frontend/icons";
import {
	getIntegrationDetailAvailability,
	getIntegrationIconForLead,
	getLeadIntegrationUrl,
} from "@cadence-frontend/utils";
import { forwardRef } from "react";
import { useRecoilValue } from "recoil";
import styles from "./NodeMailStats.module.scss";

const LeadsWrapper = ({ lead, cadence }, ref) => {
	const user = useRecoilValue(userInfo);

	const integrationDetailAvailability = getIntegrationDetailAvailability({
		lead,
		user,
		cadence,
	});
	const integrationLeadURL = getLeadIntegrationUrl({
		lead,
		user,
		cadence,
	});
	const INTEGRATION_ICON = getIntegrationIconForLead({
		lead_integration_type: lead?.integration_type,
		box: true,
	});

	const handleIntegrationIconClick = e => {
		e.stopPropagation();
		e.preventDefault();
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
			case LEAD_INTEGRATION_TYPES.BULLHORN_GOOGLE_SHEET_LEAD:
				break;
			default:
				window.open(integrationLeadURL);
		}
	};

	const formatScheduledTime = start_time => {
		let formatedTime = "";
		let timeDiff = start_time - new Date().getTime();
		let mins = Math.ceil(timeDiff / (1000 * 60));
		let hrs = Math.floor(mins / 60);
		let days = Math.floor(hrs / 24);
		if (days > 0) {
			formatedTime += `${days}d `;
			hrs = hrs - days * 24;
			mins = mins - days * 24 * 60;
		}
		if (hrs > 0) {
			formatedTime += `${hrs}hr `;
			mins = mins - hrs * 60;
		}
		formatedTime += `${mins}min`;
		return formatedTime;
	};

	return (
		<div ref={ref} className={styles.leads}>
			<div className={styles.namesWrapper}>
				{lead?.start_time && (
					<span className={styles.scheduledTime}>{`Scheduled in ${formatScheduledTime(
						lead?.start_time
					)}`}</span>
				)}
				<span className={styles.username}>
					{lead?.User?.first_name} {lead?.User?.last_name}
				</span>
				<span className={styles.leadname}>
					{lead?.first_name} {lead?.last_name}
				</span>
			</div>
			<div className={styles.iconsWrapper}>
				{lead?.lead_warmth === LEAD_WARMTH.HOT_LEAD && (
					<span style={{ marginRight: "5px" }}>
						<Hot size="2em" className={styles.integrationBox} />
					</span>
				)}
				<span style={{ marginRight: "5px" }}>
					<INTEGRATION_ICON
						onClick={handleIntegrationIconClick}
						size="2em"
						className={styles.integrationBox}
						disabled={!integrationDetailAvailability}
					/>
				</span>
				<span>
					<CadenceBox
						size="2em"
						style={{ cursor: "pointer" }}
						onClick={e => {
							e.stopPropagation();
							e.preventDefault();
							window.open(`/crm/leads/${lead?.lead_id}`);
						}}
						color="white"
					/>
				</span>
			</div>
		</div>
	);
};

export default forwardRef(LeadsWrapper);
