import { useState, useEffect } from "react";
import { AuthorizedApi } from "../api";
import { useMutation, useQuery } from "react-query";

const TYPES = {
	CONTACT: "contact",
	LIST: "list",
};
const ENABLED_DEFAULT = {
	leads: false,
	cadences: false,
};

// const useCadenceImportHubspot = ({ webhook }, enabled) => {
const useCadenceImportHubspot = ({ id, type, webhook }, enabled) => {
	enabled = { ...ENABLED_DEFAULT, ...(enabled ?? {}) };

	const [progress, setProgress] = useState(0);

	//get leads
	const onProgress = progressEvent => {
		let percentCompleted = Math.floor((progressEvent.loaded * 100) / progressEvent.total);
		setProgress(percentCompleted);
	};
	// const getList = async () =>
	// 	AuthorizedApi.get("/v2/sales/department/cadence/import/hubspot").then(res =>
	// 		parseLeads(res.data.data, webhook)
	// 	);

	// const {
	// 	data: leads,
	// 	isLoading: importLoading,
	// 	isRefetching: importRefetching,
	// 	isError: importError,
	// 	error: importErrorMessage,
	// } = useQuery(["leads-list"], getList, { enabled: enabled.leads });

	const getList = async () => {
		let URL = "";
		if (type === TYPES.CONTACT) {
			URL = `/v2/sales/department/cadence/import/hubspot/extension/preview/${type}/${id}`;
			return AuthorizedApi.get(URL, {
				onDownloadProgress: progressEvent => onProgress(progressEvent),
			}).then(res => parseSingleLead(res.data.data.contact));
		} else {
			URL = `/v2/sales/department/cadence/import/hubspot/extension/preview/${type}/${id}`;
			return AuthorizedApi.get(URL, {
				onDownloadProgress: progressEvent => onProgress(progressEvent),
			}).then(res => parseLeads(res.data.data));
		}
	};

	const {
		data: leads,
		isLoading: importLoading,
		isRefetching: importRefetching,
		isError: importError,
		error: importErrorMessage,
	} = useQuery(["leads-list"], getList, { enabled: enabled.leads });

	const addListApi = async body => {
		setProgress(0);
		let add;
		let link;

		add =
			body.add?.contacts?.length > 0 &&
			AuthorizedApi.post(
				type === "create_lead"
					? `/v2/sales/department/cadence/import/hubspot/temp-contacts`
					: `/v2/sales/department/cadence/import/hubspot/csv/add`,
				{
					...body.add,
					contacts: body.add.contacts,
				}
			).then(res => res.data.data);

		link =
			body.link?.contacts?.length > 0 &&
			AuthorizedApi.post(`/v2/sales/department/cadence/import/hubspot/csv/link`, {
				...body.link,
				contacts: body.link.contacts,
			}).then(res => res.data.data);

		return Promise.all([add, link]);
	};

	const {
		mutate: addList,
		isLoading: addLoading,
		isSuccess: isAddSuccess,
	} = useMutation(addListApi);

	const deleteLeadApi = async ({ contact_id }) =>
		AuthorizedApi.delete(`/v2/sales/department/cadence/import/hubspot/${contact_id}`);

	const { mutate: deleteLead, isLoading: deleteLoading } = useMutation(deleteLeadApi);

	// Get leade via filter view
	const getFilterViewContactApi = view => {
		return (
			view?.id &&
			webhook === "true" &&
			AuthorizedApi.get(
				`/v2/sales/department/cadence/import/hubspot/extension/preview/${view?.type}/${view?.id}`
			).then(res => parseLeads(res.data.data))
		);
	};

	const { mutate: getFilterViewContact, isLoading: getFilterViewContactLoading } =
		useMutation(getFilterViewContactApi);

	return {
		leads,
		importLoading: importLoading || importRefetching,
		progress,
		addList,
		addLoading,
		isAddSuccess,
		deleteLead,
		deleteLoading,
		importError: { error: importError, msg: importErrorMessage?.response?.data?.msg },

		//filter view
		getFilterViewContact,
		getFilterViewContactLoading,
	};
};

export default useCadenceImportHubspot;

export const parseLeads = leads => {
	let contacts = {};
	let users = {};
	let accounts = {};
	leads.contacts.forEach(
		contact =>
			(contacts[contact.integration_id] = {
				lead_id: contact.lead_id,
				cadences: contact.LeadToCadences,
			})
	);
	leads.users.forEach(
		user =>
			(users[user.integration_id] = {
				owner: `${user?.first_name} ${user?.last_name}`,
				Owner: {
					Name: `${user?.first_name} ${user?.last_name}`,
					OwnerId: user?.integration_id,
					user_id: user?.user_id,
				},
			})
	);

	leads.accounts.forEach(
		account =>
			(accounts[account.integration_id] = {
				Account: account,
			})
	);

	let parsedLeads = leads.hubspotContactsInList.map(lead => {
		let hsLead = {
			...lead,
			...users[lead.hubspot_owner_id],
			...(lead.associatedcompanyid
				? accounts[lead.associatedcompanyid]
				: { Account: null }),
		};

		// Replaced lead.Id with lead.id
		delete hsLead.Id;
		hsLead["id"] = lead.Id;

		if (!users[lead.hubspot_owner_id]?.Owner?.user_id) {
			hsLead.status = "user_not_present";
		} else if (!contacts?.[lead.Id]) {
			hsLead.status = "lead_absent_in_tool";
		} else {
			hsLead.status = "lead_present_in_tool";
			hsLead = { ...hsLead, ...contacts?.[lead.Id] };
		}
		return hsLead;
	});

	return parsedLeads;
};
export const parseSingleLead = lead => {
	let hsLead = { ...lead };
	delete hsLead.Id;
	delete hsLead.LeadToCadences;
	delete hsLead.Owner;
	hsLead = {
		...hsLead,
		id: lead.Id,
		...(lead.hubspot_owner_id && {
			owner: `${lead?.Owner?.first_name} ${lead?.Owner?.last_name}`,
		}),
		...(lead.hubspot_owner_id && {
			Owner: {
				Name: `${lead?.Owner?.first_name} ${lead?.Owner?.last_name}`,
				OwnerId: lead?.Owner?.integration_id,
				user_id: lead?.Owner?.user_id,
			},
		}),
		cadences: lead.LeadToCadences,
	};

	if (!hsLead.Owner?.user_id) {
		hsLead.status = "user_not_present";
	} else if (!hsLead?.lead_id) {
		hsLead.status = "lead_absent_in_tool";
	} else {
		hsLead.status = "lead_present_in_tool";
		hsLead["cadences"] = lead.LeadToCadences;
	}
	return [hsLead];
};
// export const parseLeads = (leads, webhook) => {
// 	if (webhook) {
// 		return leads?.map(lead => {
// 			let parsed = {
// 				...lead,
// 				...lead.contact,
// 				id: lead.contact_id,
// 				status: lead.status,
// 			};
// 			delete parsed.contact_id;
// 			delete parsed.contact;
// 			return parsed;
// 		});
// 	}
// 	return leads;
// };

// export const unParseLeads = (leads, webhook, link = false) => {
// 	if (webhook) {
// 		return leads?.map(lead => {
// 			let unParsed = {
// 				contact: {
// 					first_name: lead.first_name,
// 					last_name: lead.last_name,
// 					job_position: lead.job_position,
// 					owner: lead.owner,
// 					emails: lead.emails,
// 					phone_numbers: lead.phone_numbers,
// 					account: lead.account,
// 					...(lead.cadences && { cadences: lead.cadences }),
// 				},
// 				[link ? "id" : "contact_id"]: lead.id,
// 				...(lead.lead_id && { lead_id: lead.lead_id }),
// 				status: lead.status,
// 				company_id: lead.company_id,
// 				created_at: lead.created_at,
// 				hubspot_import_id: lead.hubspot_import_id,
// 				updated_at: lead.updated_at,
// 			};
// 			return unParsed;
// 		});
// 	}
// 	return leads;
// };
