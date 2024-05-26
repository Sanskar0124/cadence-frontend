import { userInfo } from "@cadence-frontend/atoms";
import {
	getIntegrationDetailAvailability,
	getIntegrationIconForLead,
	getLeadIntegrationUrl,
} from "@cadence-frontend/utils";
import { useRecoilValue } from "recoil";
import styles from "../../PauseOrStopRelatedLeadsModal.module.scss";
import { LEAD_INTEGRATION_TYPES } from "@cadence-frontend/constants";

function LeadWrapper({ checkBox, lead }) {
	const user = useRecoilValue(userInfo);

	const INTEGRATION_ICON = getIntegrationIconForLead({
		lead_integration_type: lead?.integration_type,
		box: true,
	});

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

	return (
		<div className={styles.leadWrapper}>
			<INTEGRATION_ICON
				style={{
					height: "28px",
					width: "28px",
					cursor: "pointer",
				}}
				onClick={handleIntegrationIconClick}
				disabled={Boolean(
					!getIntegrationDetailAvailability({
						user,
						lead,
					})
				)}
			/>
			<div>
				<div className={styles.leadName}>{`${lead?.first_name} ${lead?.last_name}`}</div>
				<div>{lead?.email}</div>
			</div>
			{checkBox}
		</div>
	);
}

export default LeadWrapper;
