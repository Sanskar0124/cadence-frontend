import { SalesforceBox, SalesforceBoxDisabled } from "@cadence-frontend/icons";
import styles from "./PauseOrStopRelatedLeadsModal.module.scss";

function LeadsWrapper({ checkBox, relatedLead, lead }) {
	const handleSalesforceIconClick = e => {
		e.stopPropagation();
		const instance_url = lead?.User?.User_Token?.salesforce_instance_url;

		let URL = "";
		if (relatedLead.attributes.type === "Lead")
			URL = `${instance_url}/lightning/r/Lead/${relatedLead?.Id}/view`;
		else if (relatedLead.attributes.type === "Contact")
			URL = `${instance_url}/lightning/r/Contact/${relatedLead?.Id}/view`;
		if (URL) window.open(URL, "_blank");
	};

	return (
		<div className={styles.LeadsWrapper}>
			{relatedLead.integration_id ? (
				<span>
					<SalesforceBox
						style={{
							height: "28px",
							width: "28px",
							cursor: "pointer",
						}}
						onClick={e => handleSalesforceIconClick(e)}
						color="#00A1E0"
					/>
				</span>
			) : (
				<SalesforceBox style={{ height: "28px", width: "28px" }} color="#E4E6EA" />
			)}
			<div style={{ maxWidth: "75%", overflowX: "hidden" }}>
				<div
					style={{
						fontWeight: "600",
						color: "#394759",
					}}
				>
					{`${relatedLead?.first_name} ${relatedLead?.last_name}`}
				</div>
				<div
					style={{
						fontWeight: "400",
						color: "#567191",
					}}
				>
					{relatedLead?.email}
				</div>
			</div>
			{checkBox}
		</div>
	);
}

export default LeadsWrapper;
