import { useEffect, useState, useContext } from "react";

import { Label, SearchBar } from "@cadence-frontend/widgets";
import { MessageContext } from "@cadence-frontend/contexts";
import { Modal } from "@cadence-frontend/components";

import LeadCard from "./components/LeadCard/LeadCard";

import styles from "./PeopleModal.module.scss";

const PeopleModal = ({
	modal,
	setModal,
	groupedLeads,
	setGroupedLeads,
	reassignmentOption,
	reassignedTo,
	setReassignedTo,
	handleAutoDistribution,
	ownerid,
	previousOwners,
}) => {
	//Context
	const { addError } = useContext(MessageContext);

	//States
	const [searchValue, setSearchValue] = useState("");
	const [peopleList, setPeopleList] = useState(
		groupedLeads?.[reassignmentOption]?.[ownerid]
	);

	useEffect(() => {
		const filter = groupedLeads?.[reassignmentOption]?.[ownerid]?.filter(lead => {
			const searchElement = `${lead?.full_name ?? ""} ${lead?.User?.first_name ?? ""} ${
				lead?.User?.last_name ?? ""
			} ${lead?.last_name ?? ""} ${lead?.first_name ?? ""}`;

			return searchElement.toLowerCase().includes(searchValue.toLowerCase());
		});

		setPeopleList(filter);
	}, [searchValue, groupedLeads]);

	/*Handle removal of lead */
	const onRemove = leadId => {
		const currentLeads = groupedLeads?.[reassignmentOption]?.[ownerid]?.length;
		const currentReassignedOwners =
			reassignedTo?.[reassignmentOption]?.[ownerid]?.reassignedOwners?.length;
		if (currentLeads <= currentReassignedOwners) {
			return addError({
				text: `Cannot delete this ${reassignmentOption} as each new owner should have atleast one reassigned ${reassignmentOption}.`,
			});
		}
		setReassignedTo(prev => {
			const distributionNumber = handleAutoDistribution(
				currentLeads - 1,
				prev?.[reassignmentOption]?.[ownerid]?.reassignedOwners?.length
			);

			return {
				...prev,
				[reassignmentOption]: {
					...prev[reassignmentOption],
					[ownerid]: {
						...prev[reassignmentOption][ownerid],
						...(prev[reassignmentOption][ownerid].autoDistribution && {
							reassignedOwners: prev[reassignmentOption][ownerid]?.reassignedOwners.map(
								(newOwner, i) => ({
									...newOwner,
									count: distributionNumber[i],
								})
							),
						}),
					},
				},
			};
		});
		setGroupedLeads(prev => ({
			...prev,
			[reassignmentOption]: {
				...prev?.[reassignmentOption],
				[ownerid]: prev?.[reassignmentOption]?.[ownerid]?.filter(
					lead => lead.lead_id !== leadId
				),
			},
		}));
	};

	return (
		<Modal
			isModal={modal}
			className={styles.peopleModal}
			onClose={() => setModal(false)}
			showCloseButton
		>
			<div className={styles.heading}>
				{`${groupedLeads?.[reassignmentOption]?.[ownerid]?.length} Selected leads (${previousOwners?.[reassignmentOption]?.[ownerid]?.first_name} ${previousOwners?.[reassignmentOption]?.[ownerid]?.last_name} )`}
			</div>
			<div className={styles.body}>
				<Label>Selected leads ({peopleList.length})</Label>
				<SearchBar
					width="100%"
					height="50px"
					value={searchValue}
					setValue={setSearchValue}
					placeholder="Search for a lead"
					className={styles.searchBar}
				/>
				<div className={styles.leadsList}>
					{peopleList.map(lead => {
						return (
							<LeadCard
								key={lead.lead_id}
								lead={lead}
								onRemove={() => onRemove(lead.lead_id)}
							/>
						);
					})}
				</div>
			</div>
		</Modal>
	);
};
export default PeopleModal;
