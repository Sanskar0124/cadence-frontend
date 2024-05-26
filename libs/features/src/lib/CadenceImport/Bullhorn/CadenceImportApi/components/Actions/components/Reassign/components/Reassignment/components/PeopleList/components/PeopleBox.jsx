import { SalesforceBox } from "@cadence-frontend/icons";
import { Title } from "@cadence-frontend/components";
import { Close } from "@cadence-frontend/icons";
import React, { useState } from "react";
import styles from "./PeopleBox.module.scss";
import { useUser } from "@cadence-frontend/data-access";
import { TYPES } from "../../../constants";
function PeopleBox({ lead, type, update, removed, onRemove, onAddBack }) {
	const { user } = useUser({ user: true });
	const url = `${user?.Salesforce_Token?.instance_url}/lightning/r/${
		type === TYPES.LEAD ? "Lead" : "Contact"
	}/${lead.Id}/view`;

	const [tool, setTool] = useState(false);

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
			<div
				className={styles.right}
				onClick={() => {
					update(lead?.lead_id);
				}}
			>
				{tool ? (
					<span
						className={styles.addBack}
						onClick={() => {
							setTool(!true);
							onAddBack(lead?.lead_id);
						}}
					>
						Add back
					</span>
				) : (
					<span
						onClick={() => {
							onRemove(lead?.lead_id);
							setTool(!false);
						}}
					>
						<Close className={styles.close} />
					</span>
				)}
			</div>
		</div>
	);
}

export default PeopleBox;
