import { Colors, getIntegrationIconForLead } from "@cadence-frontend/utils";

import styles from "./LeadTag.module.scss";

const LeadTag = ({ lead }) => {
	const INTEGRATION_ICON = getIntegrationIconForLead({
		lead_integration_type: lead.integration_type,
		box: true,
	});
	return (
		<div className={styles.leadTag}>
			<div className={styles.icon}>
				<INTEGRATION_ICON size={"2rem"} color={Colors.salesforce} />
			</div>
			<div className={styles.leadName}>{`${lead.first_name} ${lead.last_name}`}</div>
		</div>
	);
};

export default LeadTag;
