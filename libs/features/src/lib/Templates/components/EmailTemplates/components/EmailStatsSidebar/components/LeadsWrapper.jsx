import { userInfo } from "@cadence-frontend/atoms";
import {
	CadenceBox,
	SalesforceBox,
	SalesforceBoxDisabled,
} from "@cadence-frontend/icons";
import {
	getSalesforceUrl,
	getIntegrationIcon,
	getLeadIntegrationUrl,
} from "@cadence-frontend/utils";
import { useRecoilValue } from "recoil";

// import styles from "../../../../../../../Manager/Cadence/CadenceView/components/Steps/components/NodeMailStats/NodeMailStats.module.scss";
import styles from "./LeadsWrapper.module.scss";
import { INTEGRATION_TYPE } from "@cadence-frontend/constants";
function LeadsWrapper({ lead }) {
	const user = useRecoilValue(userInfo);
	const INTEGRATION_ICON = getIntegrationIcon({
		integration_type: user?.integration_type,
		box: true,
	});
	console.log(lead, getLeadIntegrationUrl({ lead, user }), "LeadURL");
	return (
		<div className={styles.leads}>
			<div className={styles.namesWrapper}>
				<span className={styles.username}>
					{lead?.User?.first_name} {lead?.User?.last_name}
				</span>
				<span className={styles.leadname}>
					{lead.first_name} {lead.last_name}
				</span>
			</div>
			<div className={styles.iconsWrapper}>
				<span style={{ marginRight: "5px" }}>
					{user?.integration_type !== INTEGRATION_TYPE.GOOGLE_SHEETS &&
						user?.integration_type !== INTEGRATION_TYPE.EXCEL &&
						user?.integration_type !== INTEGRATION_TYPE.SHEETS &&
						getLeadIntegrationUrl({ lead, user }) && (
							<INTEGRATION_ICON
								disabled={!getLeadIntegrationUrl({ lead, user })}
								size="2em"
								onClick={e => {
									e.stopPropagation();
									e.preventDefault();
									window.open(getLeadIntegrationUrl({ lead, user }), "_new");
								}}
							/>
						)}
					{/* <SalesforceBox
							onClick={e => {
								e.stopPropagation();
								e.preventDefault();
								window.open(getSalesforceUrl(lead, user?.instance_url), "_new");
							}}
							size="2em"
							className={styles.salesforcebox}
							color="#00A1E0"
						/> */}
				</span>
				<span>
					<CadenceBox
						size="2em"
						style={{ cursor: "pointer" }}
						onClick={e => {
							e.stopPropagation();
							e.preventDefault();
							window.open(`/crm/leads/` + lead.lead_id);
						}}
						color="white"
					/>
				</span>
			</div>
		</div>
	);
}

export default LeadsWrapper;
