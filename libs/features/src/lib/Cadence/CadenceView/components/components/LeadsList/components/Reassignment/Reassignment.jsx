import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";

import { INTEGRATION_TYPE, LEAD_INTEGRATION_TYPES } from "@cadence-frontend/constants";
import { userInfo } from "@cadence-frontend/atoms";
import { useEmployees } from "@cadence-frontend/data-access";

import ReassignmentHeader from "./components/ReassignmentHeader/ReassignmentHeader";
import ReassignmentBody from "./components/ReassignmentBody/ReassignmentBody";
import Placeholder from "./components/Placeholder/Placeholder";

import styles from "./Reassignment.module.scss";
import { VIEWS } from "./constants";

const Reassignment = ({
	setShowReassignment,
	cadenceLeadsDataAccess,
	leads,
	checkedLeads,
	setCheckedLeads,
	selectedLead,
	selectAllLeads,
	setSelectAllLeads,
}) => {
	//Data from recoil
	const user = useRecoilValue(userInfo);
	const role = user.role;

	//Data fetched
	const { employees, employeesLoading } = useEmployees(true, role);
	const { getAllLeadsData, getAllLeadsLoading } = cadenceLeadsDataAccess;

	//States
	/*Stores which option is selected(lead or contact if both options are there) in case of dynamics and salesforce
	but by default it is contact in case of sellsy as sellsy supports only contacts.*/
	const [reassignmentOption, setReassignmentOption] = useState(
		user?.integration_type === INTEGRATION_TYPE.SELLSY ? VIEWS.CONTACT : VIEWS.LEAD
	);

	/*Stores the array of leads selected from the cadence people page*/
	const [selectedLeads, setSelectedLeads] = useState([]);

	/*Stores array of reassigned owners, count of leads reassigned to each owner, 
	options for each reassigned owner and automatic distribution is on or not.*/
	const [reassignedTo, setReassignedTo] = useState({
		lead: {},
		contact: {},
	});

	/*An object which stores all the selected leads but grouped by their previous owners, and these are stored separately
	for leads and contacts*/
	const [groupedLeads, setGroupedLeads] = useState({
		lead: {},
		contact: {},
	});

	/*An object which stores the array of all previous owners(containing firstname,lastname and profile picture) mapped by ownerid
	grouped by leads and contact */
	const [previousOwners, setPreviousOwners] = useState({
		lead: {},
		contact: {},
	});

	/* Stores the list of all users(owners) which are reassigned leads  */
	const [options, setOptions] = useState([]);

	/*Function to group all leads by owners and store in "groupedLeads" state, to initialise "reassignedTo" state 
 grouped by owners, storing details of owners mapped by ownerid. All things are separately stored for leads
 and contacts */
	const group = (leads, type) => {
		let grouped = {};
		let owners = {};
		let reassignedOwners = {};
		const users = employees?.map(emp => ({
			label: `${emp?.first_name} ${emp?.last_name}`,
			value: emp?.user_id,
		}));
		const reassignmentDefault = {
			reassignedOwners: [{ user_id: "", count: 0 }],
			autoDistribution: false,
		};
		leads.forEach(lead => {
			if (grouped[lead.user_id]) {
				grouped[lead.user_id].push(lead);
			} else {
				grouped[lead.user_id] = [lead];
				reassignedOwners[lead.user_id] = { ...reassignmentDefault };
				reassignedOwners[lead.user_id].options = [
					users.filter(user => user?.value !== lead.user_id),
				];
				owners[lead.user_id] = lead.User;
			}
		});
		setGroupedLeads(prev => ({ ...prev, [type]: grouped }));
		setReassignedTo(prev => ({ ...prev, [type]: reassignedOwners }));
		setPreviousOwners(prev => ({ ...prev, [type]: owners }));
		setOptions(users);
	};

	/*If user has selected "select all leads" option from cadence people page then request is sent to backend 
	 to fetch all leads but if user has selected option "Select currently visible leads" or has manually 
	 selected already visible leads then no request is sent.*/
	useEffect(() => {
		if (selectAllLeads) {
			getAllLeadsData(null, {
				onSuccess: data => {
					setSelectedLeads(data);
				},
			});
		} else {
			if (selectedLead) {
				setSelectedLeads(leads?.filter(lead => lead?.lead_id === selectedLead?.lead_id));
			} else {
				setSelectedLeads(leads?.filter(lead => checkedLeads.includes(lead?.lead_id)));
			}
		}
	}, [selectAllLeads]);

	/*As soon as selected leads have been fetched(if not visible) and employees(new owners which are to be 
	reassigned) have been fetched, they are grouped by owners using group function */
	useEffect(() => {
		if (selectedLeads && employees) {
			const leads = selectedLeads.filter(
				lead =>
					lead.integration_type === LEAD_INTEGRATION_TYPES.SALESFORCE_LEAD ||
					lead.integration_type === LEAD_INTEGRATION_TYPES.DYNAMICS_LEAD
			);
			const contacts = selectedLeads.filter(
				lead =>
					lead.integration_type === LEAD_INTEGRATION_TYPES.SALESFORCE_CONTACT ||
					lead.integration_type === LEAD_INTEGRATION_TYPES.SELLSY_CONTACT ||
					lead.integration_type === LEAD_INTEGRATION_TYPES.DYNAMICS_CONTACT
			);
			setReassignmentOption(leads.length ? VIEWS.LEAD : VIEWS.CONTACT);
			group(leads, VIEWS.LEAD);
			group(contacts, VIEWS.CONTACT);
		}
	}, [selectedLeads, employees]);

	return (
		<div className={styles.reassignmentContainer}>
			{getAllLeadsLoading || employeesLoading ? (
				<Placeholder />
			) : (
				<>
					<ReassignmentHeader
						reassignmentOption={reassignmentOption}
						setReassignmentOption={setReassignmentOption}
						setShowReassignment={setShowReassignment}
						reassignedTo={reassignedTo}
						groupedLeads={groupedLeads}
						previousOwners={previousOwners}
						cadenceLeadsDataAccess={cadenceLeadsDataAccess}
						setCheckedLeads={setCheckedLeads}
						setSelectAllLeads={setSelectAllLeads}
					/>
					<ReassignmentBody
						reassignmentOption={reassignmentOption}
						groupedLeads={groupedLeads}
						setGroupedLeads={setGroupedLeads}
						previousOwners={previousOwners}
						reassignedTo={reassignedTo}
						setReassignedTo={setReassignedTo}
						options={options}
					/>
				</>
			)}
		</div>
	);
};
export default Reassignment;
