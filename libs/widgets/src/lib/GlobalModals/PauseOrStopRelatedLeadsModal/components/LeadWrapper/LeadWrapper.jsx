import { userInfo } from "@cadence-frontend/atoms";
import { LEAD_INTEGRATION_TYPES } from "@cadence-frontend/constants";
import { SalesforceBox, SalesforceBoxDisabled } from "@cadence-frontend/icons";
import { useRecoilValue } from "recoil";
import styles from "../../PauseOrStopRelatedLeadsModal.module.scss";

function LeadWrapper({ checkBox, lead }) {
	const instance_url = useRecoilValue(userInfo).instance_url;
	const handleSalesforceIconClick = e => {
		e.stopPropagation();
		let URL = "";
		if (lead?.integration_type === LEAD_INTEGRATION_TYPES.SALESFORCE_LEAD)
			URL = `${instance_url}/lightning/r/Lead/${lead.integration_id}/view`;
		else if (lead?.integration_type === LEAD_INTEGRATION_TYPES.SALESFORCE_CONTACT)
			URL = `${instance_url}/lightning/r/Contact/${lead.integration_id}/view`;
		if (URL) window.open(URL, "_blank");
	};

	return (
		<div className={styles.leadWrapper}>
			{lead.integration_id && instance_url ? (
				<SalesforceBox
					style={{
						height: "28px",
						width: "28px",
						cursor: "pointer",
					}}
					onClick={e => handleSalesforceIconClick(e)}
					color="#00A1E0"
				/>
			) : (
				<SalesforceBox style={{ height: "28px", width: "28px" }} color="#E4E6EA" />
			)}
			<div>
				<div className={styles.leadName}>{`${lead?.first_name} ${lead?.last_name}`}</div>
				<div>{lead?.email}</div>
			</div>
			{checkBox}
		</div>
	);
}

export default LeadWrapper;
