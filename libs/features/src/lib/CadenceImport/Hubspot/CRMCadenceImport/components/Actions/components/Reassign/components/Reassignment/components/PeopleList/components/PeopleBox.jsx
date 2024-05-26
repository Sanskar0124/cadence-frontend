import { SalesforceBox } from "@cadence-frontend/icons";
import { Title } from "@cadence-frontend/components";
import { Close } from "@cadence-frontend/icons";
import React from "react";
import styles from "./PeopleBox.module.scss";
import { useUser } from "@cadence-frontend/data-access";
import { TYPES } from "../../../constants";
function PeopleBox({ lead, type, update, removed }) {
	const { user } = useUser({ user: true });
	const url = `${user?.Salesforce_Token?.instance_url}/lightning/r/${
		type === TYPES.LEAD ? "Lead" : "Contact"
	}/${lead.Id}/view`;
	return (
		<div className={styles.lead}>
			<div className={styles.left}>
				<SalesforceBox
					color={"#00A1E0"}
					className={styles.salesforceBox}
					onClick={() => window.open(url, "_new")}
				/>

				<div className={styles.info}>
					<Title size={14}>{lead?.Owner?.Name}</Title>
					<p className={styles.name}>
						{lead?.first_name ?? ""} {lead?.last_name ?? ""}
					</p>
				</div>
			</div>
			<div className={styles.right} onClick={() => update(lead?.lead_id)}>
				{removed ? (
					<span className={styles.addBack}>Add back</span>
				) : (
					<Close className={styles.close} />
				)}
			</div>
		</div>
	);
}

export default PeopleBox;
