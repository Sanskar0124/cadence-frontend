import { userInfo } from "@cadence-frontend/atoms";
import { INTEGRATION_TYPE } from "@cadence-frontend/constants";
import { useRecoilValue } from "recoil";
import { IS_LEAD, IS_CONTACT } from "../constants";

import SalesforceReassignment from "./Salesforce/Reassignment/Reassignment";
import SellsyReassignment from "./Sellsy/Reassignment/Reassignment";

//constants

const Reassignment = ({
	viewPeopleList,
	dataAccess,
	setViewPeopleList,
	handleClose,
	setCb,
	leads,
}) => {
	let user = useRecoilValue(userInfo);
	switch (user?.integration_type) {
		case INTEGRATION_TYPE.SALESFORCE:
			return (
				<SalesforceReassignment
					active={!viewPeopleList}
					leadsCount={leads?.length}
					dataAccess={dataAccess}
					leadIds={leads.filter(item => IS_LEAD(item)).map(item => item.lead_id)}
					contactIds={leads.filter(item => IS_CONTACT(item)).map(item => item.lead_id)}
					ownerIds={leads.map(item => item.user_id)}
					setViewPeopleList={setViewPeopleList}
					handleClose={handleClose}
					setCb={setCb}
				/>
			);
		case INTEGRATION_TYPE.SELLSY:
			return (
				<SellsyReassignment
					active={!viewPeopleList}
					leadsCount={leads?.length}
					dataAccess={dataAccess}
					contactIds={leads.filter(item => IS_CONTACT(item)).map(item => item.lead_id)}
					ownerIds={leads.map(item => item.user_id)}
					setViewPeopleList={setViewPeopleList}
					handleClose={handleClose}
					setCb={setCb}
				/>
			);
		default:
			return null;
	}
};

export default Reassignment;
