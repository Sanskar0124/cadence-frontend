import ReassignmentCard from "./components/ReassignmentCard/ReassignmentCard";

import styles from "./ReassignmentBody.module.scss";

const ReassignmentBody = ({
	reassignmentOption,
	groupedLeads,
	setGroupedLeads,
	previousOwners,
	reassignedTo,
	setReassignedTo,
	options,
}) => {
	return (
		<div className={styles.selectedLeads}>
			<div className={styles.header}>
				<div>{`Selected ${reassignmentOption}(s)`}</div>
				<div>Current owner</div>
				<div>New owner (s)</div>
			</div>
			<div className={styles.leads}>
				{Object.keys(previousOwners?.[reassignmentOption])?.map((ownerid, index) => (
					<>
						<ReassignmentCard
							reassignmentOption={reassignmentOption}
							ownerid={ownerid}
							previousOwners={previousOwners}
							groupedLeads={groupedLeads}
							setGroupedLeads={setGroupedLeads}
							reassignedTo={reassignedTo}
							setReassignedTo={setReassignedTo}
							options={options}
						/>
						{Object.keys(previousOwners?.[reassignmentOption])?.length - 1 !== index && (
							<div className={styles.separator}></div>
						)}
					</>
				))}
			</div>
		</div>
	);
};

export default ReassignmentBody;
