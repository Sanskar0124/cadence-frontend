import { LEADS_CURRENT_VIEWS, VIEWS } from "../../../../constants";

export const getPlaceholder = (isOnboarding, leadsCurrentView, current_view) => {
	if (
		(isOnboarding && leadsCurrentView === LEADS_CURRENT_VIEWS.LEADS_ACCOUNTS) ||
		(!isOnboarding && current_view === VIEWS.LEAD)
	) {
		return "https://cls91.bullhornstaffing.com/BullhornSTAFFING/OpenWindow.cfm?Entity=Lead&id=14156";
	} else if (
		(isOnboarding && leadsCurrentView === LEADS_CURRENT_VIEWS.CONTACTS_ACCOUNTS) ||
		(!isOnboarding && current_view === VIEWS.CONTACT)
	) {
		return "https://cls91.bullhornstaffing.com/BullhornSTAFFING/OpenWindow.cfm?Entity=ClientContact&id=14153";
	} else if (
		(isOnboarding && leadsCurrentView === LEADS_CURRENT_VIEWS.CANDIDATE) ||
		(!isOnboarding && current_view === VIEWS.CANDIDATE)
	) {
		return "https://cls91.bullhornstaffing.com/BullhornSTAFFING/OpenWindow.cfm?Entity=Candidate&id=14171";
	}
};

export const getTestText = (isOnboarding, leadsCurrentView, current_view) => {
	if (
		(isOnboarding && leadsCurrentView === LEADS_CURRENT_VIEWS.LEADS_ACCOUNTS) ||
		(!isOnboarding && current_view === VIEWS.LEAD)
	) {
		return VIEWS.LEAD;
	} else if (
		(isOnboarding && leadsCurrentView === LEADS_CURRENT_VIEWS.CONTACTS_ACCOUNTS) ||
		(!isOnboarding && current_view === VIEWS.CONTACT)
	) {
		return VIEWS.CONTACT;
	} else if (
		(isOnboarding && leadsCurrentView === LEADS_CURRENT_VIEWS.CANDIDATE) ||
		(!isOnboarding && current_view === VIEWS.CANDIDATE)
	) {
		return VIEWS.CANDIDATE;
	}
};

export const conditionForLead = (isOnboarding, leadsCurrentView, current_view) =>
	(isOnboarding && leadsCurrentView === LEADS_CURRENT_VIEWS.LEADS_ACCOUNTS) ||
	(!isOnboarding && current_view === VIEWS.LEAD);

export const conditionForContact = (isOnboarding, leadsCurrentView, current_view) =>
	(isOnboarding && leadsCurrentView === LEADS_CURRENT_VIEWS.CONTACTS_ACCOUNTS) ||
	(!isOnboarding && current_view === VIEWS.CONTACT);

export const conditionForCandidate = (isOnboarding, leadsCurrentView, current_view) =>
	(isOnboarding && leadsCurrentView === LEADS_CURRENT_VIEWS.CANDIDATE) ||
	(!isOnboarding && current_view === VIEWS.CANDIDATE);
