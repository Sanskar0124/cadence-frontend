import { SalesforceBox, Sellsy } from "@cadence-frontend/icons";
import { Title } from "@cadence-frontend/components";
import { Close } from "@cadence-frontend/icons";
import React, { useState } from "react";
import styles from "./PeopleBox.module.scss";
// import { useUser } from "@cadence-frontend/data-access";
function PeopleBox({ lead, update, removed, onRemove, onAddBack }) {
	// const { user } = useUser({ user: true });
	// const url = `${user?.Salesforce_Token?.instance_url}/lightning/r/${"Contact"}/${
	// 	lead.Id
	// }/view`;
	const [tool, setTool] = useState(false);
	console.log(lead, "Leadd13");
	return (
		<div className={styles.lead}>
			<div className={styles.left}>
				<Sellsy
					className={styles.salesforceBox}
					// onClick={() => window.open(url, "_new")}
				/>

				<div className={styles.info}>
					<Title size={14}>{lead?.owner?.owner_name}</Title>
					<p className={styles.name}>
						{lead?.first_name ?? ""} {lead?.last_name ?? ""}
					</p>
				</div>
			</div>
			<div className={styles.right} onClick={() => update(lead?.id)}>
				{tool ? (
					<span
						className={styles.addBack}
						onClick={() => {
							setTool(!true);
							onAddBack(lead?.id);
						}}
					>
						Add back
					</span>
				) : (
					<span
						onClick={() => {
							onRemove(lead?.id);
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
