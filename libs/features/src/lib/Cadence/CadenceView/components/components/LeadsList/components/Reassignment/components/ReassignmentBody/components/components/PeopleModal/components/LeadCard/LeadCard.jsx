import { MinusOutline } from "@cadence-frontend/icons";
import { getIntegrationIconForLead } from "@cadence-frontend/utils";

import styles from "./LeadCard.module.scss";

const LeadCard = ({ lead, onRemove }) => {
	const INTEGRATION_ICON = getIntegrationIconForLead({
		lead_integration_type: lead?.integration_type,
		box: true,
	});
	return (
		<div className={styles.lead}>
			<div className={styles.left}>
				<INTEGRATION_ICON
					style={{
						color: "#0077b5",
					}}
					size={40}
				/>
				<div className={styles.info}>
					<p>
						{lead?.User?.first_name} {lead?.User?.last_name}
					</p>
					<p>
						{lead?.first_name} {lead?.last_name}
					</p>
				</div>
			</div>

			<div className={styles.right}>
				<MinusOutline className={styles.close} onClick={onRemove} />
			</div>
		</div>
	);
};

export default LeadCard;
