import React, { useEffect, useState } from "react";
import LeadInfo from "./components/LeadInfo/LeadInfo";

import LinkedInUrl from "./components/LinkedInUrl/LinkedInUrl";
import Success from "./components/Success/Success";
import MultipleLeadsInfo from "./components/MultipleLeadsInfo/MultipleLeadsInfo";

const Extension = () => {
	const [activePage, setActivePage] = useState(1);
	const [user, setUser] = useState(null);
	const [lead, setLead] = useState(null);
	const [leads, setLeads] = useState();
	const [allLeadsFetched, setAllLeadsFetched] = useState(false);
	const [cadenceSelected, setCadenceSelected] = useState({
		id: "",
		name: "",
	});
	const [salesforceLeadUrl, setSalesforceLeadUrl] = useState("");

	useEffect(() => {
		// reset states
		if (activePage === 1) {
			setCadenceSelected({
				id: "",
				name: "",
			});
			setLead(null);
			setLeads([]);
			setAllLeadsFetched(false);
			setSalesforceLeadUrl("");
		}
	}, [activePage]);

	const renderPage = () => {
		switch (activePage) {
			case 1:
				return (
					<LinkedInUrl
						setActivePage={setActivePage}
						setLead={setLead}
						setLeads={setLeads}
						setUser={setUser}
					/>
				);

			// case 2:
			// 	return <SalesforceNotConnected />;

			case 3:
				return (
					<LeadInfo
						setActivePage={setActivePage}
						lead={lead}
						salesforceLeadUrl={salesforceLeadUrl}
						setSalesforceLeadUrl={setSalesforceLeadUrl}
						user={user}
						cadenceSelected={cadenceSelected}
						setCadenceSelected={setCadenceSelected}
					/>
				);

			case 4:
				return (
					<MultipleLeadsInfo
						setActivePage={setActivePage}
						leads={leads}
						setLeads={setLeads}
						allLeadsFetched={allLeadsFetched}
						setAllLeadsFetched={setAllLeadsFetched}
						cadenceSelected={cadenceSelected}
						setCadenceSelected={setCadenceSelected}
						user={user}
					/>
				);

			case 5:
				return (
					<Success salesforceLeadUrl={salesforceLeadUrl} setActivePage={setActivePage} />
				);

			default:
				return (
					<LinkedInUrl
						setActivePage={setActivePage}
						setLead={setLead}
						setLeads={setLeads}
						setUser={setUser}
					/>
				);
		}
	};

	return <>{renderPage()}</>;
};

export default Extension;
