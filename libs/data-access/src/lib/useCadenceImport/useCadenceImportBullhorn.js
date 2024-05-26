import { useEffect, useState } from "react";
import { AuthorizedApi } from "../api";
import { useMutation, useInfiniteQuery, useQuery } from "react-query";
import * as moment from "moment";

const KEY = "leads-list";

const TYPES = {
	LEAD: "lead",
	CONTACT: "contact",
	CANDIDATE: "candidate",
	LEAD_LIST: "lead_list",
	CONTACT_LIST: "contact_list",
};
const ALL_DATATYPE = {
	STRING: "String",
	BOOLEAN: "Boolean",
	DATE: "DATE",
	DATETIME: "DATETIME",
	INTEGER: "Integer",
	BIG_DECIMAL: "BigDecimal",
	DOUBLE: "Double",
	TIMESTAMP: "Timestamp",
	SYSTEM: "SYSTEM",
	SELECT: "SELECT",
};

const All_SUPPORTED_OPERATOR = {
	EQUAL: "=",
	NOT_EQUAL: "<>",
	GREATER_THAN_OR_EUQAL_TO: ">=",
	GREATER_THAN: ">",
	LESS_THAN: "<",
	LESS_THAN_OR_EUQAL_TO: "<=",
	IN: "in",
	NOT_IN: "not in",
	IS_NULL: "is null",
	IS_NOT_NULL: "is not null",
	IS_EMPTY: "is empty",
	IS_NOT_EMPTY: "is not empty",
};

const parseSimpleDate = filter => {
	let actualDate = filter.value ?? filter;
	if (!actualDate) return "";
	let newDate = `${actualDate["YYYY"]}-${actualDate["MM"]}-${actualDate["DD"]}`;
	return newDate ?? "";
};

const convertDatetimeToISODate = datetime => {
	let actualDate = [];
	let actualTime = "";
	//DD.MM.YYYY
	//HH:MM

	Object.keys(datetime).forEach(f => {
		if (f === "time") {
			actualTime = datetime[f];
		} else {
			actualDate.push(datetime[f] + "");
		}
	});

	let date = `${actualDate[0]}:${actualDate[1]}:${actualDate[2]}`;
	let time = `${actualTime}:00`;

	let parsedDateTime = moment(`${date} ${time}`, "DD.MM.YYYY HH:mm:ss");

	return parsedDateTime && parsedDateTime.valueOf();
};

//for candidate
const parseCandidateFilter = candidateFilters => {
	let obj = {};
	let copied = [...candidateFilters];

	copied?.forEach(filter => {
		if (Object.keys(obj).some(f => obj[f].bullhorn_field === filter.bullhorn_field)) {
			const ArrayCheck = (val, filter) => {
				if (
					typeof val === "string" &&
					filter.type !== ALL_DATATYPE.DATE &&
					filter.type !== ALL_DATATYPE.SYSTEM &&
					filter.type !== ALL_DATATYPE.DATETIME
				) {
					return [val];
				} else if (
					filter.type === ALL_DATATYPE.DATE ||
					filter.type === ALL_DATATYPE.SYSTEM
				) {
					return [val];
				} else if (filter.type === ALL_DATATYPE.DATETIME) {
					return [val];
				} else {
					return [val];
				}
			};

			obj[filter.bullhorn_field] = {
				...obj[filter.bullhorn_field],
				value: [
					...ArrayCheck(obj[filter.bullhorn_field].value, filter),
					filter.type === ALL_DATATYPE.DATE || filter.type === ALL_DATATYPE.SYSTEM
						? new Date(parseSimpleDate(filter)).valueOf()
						: filter.type === ALL_DATATYPE.DATETIME
						? convertDatetimeToISODate(filter.dateTime)
						: filter.value,
				].join(" "),
			};
		} else {
			obj[filter.bullhorn_field] = {
				...filter,
				value:
					filter.type === ALL_DATATYPE.DATE || filter.type === ALL_DATATYPE.SYSTEM
						? new Date(parseSimpleDate(filter)).valueOf()
						: filter.type === ALL_DATATYPE.DATETIME
						? convertDatetimeToISODate(filter.dateTime)
						: filter.value,
			};
		}
	});

	return Object.keys(obj).map(f => {
		if (f) {
			return {
				// id: obj[f].id,
				value: obj[f].value,
				bullhorn_field: obj[f].bullhorn_field,
				// type:
				// 	obj[f].type === "DATE" || obj[f].type === "DATETIME"
				// 		? "Timestamp"
				// 		: obj[f].type === "SELECT"
				// 		? "String"
				// 		: obj[f].type,
			};
		}
	});
};

const parseArray = filters => {
	let copied = [...filters];

	let arr = copied.map(filter => {
		if (
			filter.operator === All_SUPPORTED_OPERATOR.IS_NULL ||
			filter.operator === All_SUPPORTED_OPERATOR.IS_NOT_NULL ||
			filter.operator === All_SUPPORTED_OPERATOR.IS_NOT_EMPTY ||
			filter.operator === All_SUPPORTED_OPERATOR.IS_EMPTY
		) {
			return {
				value: "",
				// id: filter.id,
				operator: filter.operator.toUpperCase(),
				bullhorn_field: filter.bullhorn_field,
				// type: filter.type === "SELECT" ? "String" : filter.type,
			};
		} else if (filter.type === ALL_DATATYPE.DATE || filter.type === ALL_DATATYPE.SYSTEM) {
			return {
				// id: filter.id,
				operator: filter.operator.toUpperCase(),
				bullhorn_field: filter.bullhorn_field,
				value: parseSimpleDate(filter.value),
				type:
					filter.type === ALL_DATATYPE.DATE || filter.type === ALL_DATATYPE.SYSTEM
						? "Timestamp"
						: filter.type === ALL_DATATYPE.SELECT
						? "String"
						: filter.type,
			};
		} else if (filter.type === ALL_DATATYPE.DATETIME) {
			return {
				// id: filter.id,
				operator: filter.operator.toUpperCase(),
				bullhorn_field: filter.bullhorn_field,
				value: convertDatetimeToISODate(filter.dateTime),
				type:
					filter.type === ALL_DATATYPE.DATETIME
						? "Timestamp"
						: filter.type === ALL_DATATYPE.SELECT
						? "String"
						: filter.type,
			};
		} else {
			return {
				// id: filter.id,
				operator: filter.operator.toUpperCase(),
				bullhorn_field: filter.bullhorn_field,
				value: filter.value,
				type: filter.type === ALL_DATATYPE.SELECT ? "String" : filter.type,
			};
		}
	});

	return arr ?? [];
};

// Bullhorn import injection
// parseLeads
const parseLeads = (leadData, type) => {
	const users = {}; // users for every Type
	const accounts = {};
	const allTypeLeads = {};

	// leads, contacts, candidates
	leadData[
		type?.toLowerCase() === TYPES.LEAD
			? "leads"
			: type?.toLowerCase() === TYPES.CANDIDATE
			? "candidates"
			: "contacts"
	].forEach(lead => {
		allTypeLeads[lead.integration_id] = {
			lead_id: lead.lead_id,
			cadences: lead.LeadToCadences,
		};
	});

	// Users
	leadData?.users?.forEach(user => {
		users[user.integration_id] = {
			Owner: {
				Name: `${user?.first_name} ${user?.last_name}`,
				OwnerId: user?.integration_id,
				user_id: user?.user_id,
				first_name: user?.first_name,
				last_name: user?.last_name,
			},
		};
	});

	// Account
	leadData?.accounts?.forEach(account => {
		accounts[account.integration_id] = {
			Account: { ...account, Id: account.integration_id },
		};
	});

	const parsedLeads = leadData[
		type?.toLowerCase() === TYPES.LEAD
			? "bullhornLeadsInList"
			: type?.toLowerCase() === TYPES.CANDIDATE
			? "bullhornCandidatesInList"
			: "bullhornContactsInList"
	]?.map(lead => {
		let bhLead = {
			...lead,
			...users[lead?.Owner?.integration_id],
			...(lead.associatedaccountid
				? accounts[lead?.associatedaccountid]
				: { Account: lead?.Account ? lead?.Account : null }),
		};

		delete bhLead?.Account?.integration_id;

		if (!users[lead?.Owner?.integration_id]?.Owner?.user_id) {
			bhLead.status = "user_not_present";
		} else if (!allTypeLeads?.[lead.Id]) {
			bhLead.status = "lead_absent_in_tool";
		} else {
			bhLead.status = "lead_present_in_tool";
			bhLead = { ...bhLead, ...allTypeLeads?.[lead.Id] };
		}

		return bhLead;
	});

	return parsedLeads;
};

const parseSingleLead = lead => {
	let bhLead = { ...lead };

	delete bhLead.LeadToCadences;
	delete bhLead.Owner;
	bhLead = {
		...bhLead,
		...(lead?.bullhorn_owner_id && {
			Owner: {
				Name: `${lead?.Owner?.first_name} ${lead?.Owner?.last_name}`,
				OwnerId: lead?.Owner?.integration_id,
				user_id: lead?.Owner?.user_id,
			},
		}),

		cadences: lead.LeadToCadences,

		Account: { ...bhLead.Account, Id: bhLead.Account?.integration_id },
	};

	delete bhLead?.Account?.integration_id;

	if (!bhLead.Owner?.user_id) {
		bhLead.status = "user_not_present";
	} else if (!bhLead?.lead_id) {
		bhLead.status = "lead_absent_in_tool";
	} else {
		bhLead.status = "lead_present_in_tool";
		bhLead["cadences"] = lead.LeadToCadences;
	}
	return [bhLead];
};

const useCadenceImportBullhorn = ({
	enabled,
	type,
	bullhornQuery,
	id,
	importFrom,
	import_type,
	// filterView = null,
}) => {
	enabled = {
		// importApi: Boolean(importFrom !== "csv"),
		injectionImport: Boolean(
			importFrom !== "csv" && ((bullhornQuery && type) || (type && id))
		),
	};

	const [filters, setFilters] = useState(() => {
		const savedFilters = JSON.parse(sessionStorage.getItem("bullhorn-filters"));

		if (
			savedFilters?.lead?.length ||
			savedFilters?.contact?.length ||
			savedFilters?.candidate?.length
		) {
			return savedFilters;
		} else {
			return { lead: [], contact: [], candidate: [] };
		}
	});
	const [progress, setProgress] = useState(0);

	useEffect(() => {
		sessionStorage.setItem("bullhorn-filters", JSON.stringify(filters));
	}, [filters]);

	// const getLeadsApi = async ({ queryKey, pageParam: offset = 0 }) => {
	// 	let LEAD_URL = "v2/sales/department/cadence/import/bullhorn/leads";
	// 	let CONTACT_URL = "v2/sales/department/cadence/import/bullhorn/contacts";
	// 	let CANDIDATE_URL = "v2/sales/department/cadence/import/bullhorn/candidates";
	// 	if (filterView !== "csv") {
	// 		if (type === TYPES.LEAD) {
	// 			return await AuthorizedApi.post(LEAD_URL, {
	// 				start: offset,
	// 				filters: parseArray(filters[type]),
	// 				custom_view_id: filterView?.id,
	// 			}).then(res => res.data?.data);
	// 		} else if (type === TYPES.CONTACT) {
	// 			return await AuthorizedApi.post(CONTACT_URL, {
	// 				start: offset,
	// 				filters: parseArray(filters[type]),
	// 				custom_view_id: filterView?.id,
	// 			}).then(res => res.data?.data);
	// 		} else if (type === TYPES.CANDIDATE) {
	// 			return await AuthorizedApi.post(CANDIDATE_URL, {
	// 				start: offset,
	// 				filters: parseCandidateFilter(filters[type]),
	// 				custom_view_id: filterView?.id,
	// 			}).then(res => res.data?.data);
	// 		}
	// 	}
	// };

	// const {
	// 	data: leadsData,
	// 	fetchNextPage,
	// 	hasNextPage,
	// 	isLoading: leadLoading,
	// 	isFetching,
	// 	isFetchingNextPage,
	// 	error: getLeadListError,
	// } = useInfiniteQuery([KEY, { type, filters, filterView }], getLeadsApi, {
	// 	enabled: enabled.importApi,
	// 	getNextPageParam: (lastPage, pages) => {
	// 		if (!lastPage?.length) return undefined;
	// 		return pages.length * 10;
	// 	},
	// 	select: data => data?.pages?.map(page => page)?.flat(),
	// });

	//get leads
	const onProgress = progressEvent => {
		let percentCompleted = Math.floor((progressEvent.loaded * 100) / progressEvent.total);
		setProgress(percentCompleted);
	};

	const addExtensionList = async () => {
		let URL;
		if (type?.toLowerCase() === TYPES.CANDIDATE) {
			URL = bullhornQuery
				? `/v2/sales/department/cadence/import/bullhorn/extension/preview?query=${bullhornQuery}&type=${type}`
				: `v2/sales/department/cadence/import/bullhorn/extension/preview?type=${type}&id=${id}`;

			return AuthorizedApi.get(URL, {
				onDownloadProgress: progressEvent => onProgress(progressEvent),
			}).then(res =>
				bullhornQuery
					? parseLeads(res.data.data, type)
					: parseSingleLead(res.data.data[TYPES.CANDIDATE])
			);
		} else if (type?.toLowerCase() === TYPES.LEAD) {
			URL = bullhornQuery
				? `/v2/sales/department/cadence/import/bullhorn/extension/preview?query=${bullhornQuery}&type=${type}`
				: `v2/sales/department/cadence/import/bullhorn/extension/preview?type=${type}&id=${id}`;

			return AuthorizedApi.get(URL, {
				onDownloadProgress: progressEvent => onProgress(progressEvent),
			}).then(res =>
				bullhornQuery
					? parseLeads(res.data.data, type)
					: parseSingleLead(res.data.data[TYPES.LEAD])
			);
		} else if (type === "ClientContact") {
			URL = bullhornQuery
				? `/v2/sales/department/cadence/import/bullhorn/extension/preview?query=${bullhornQuery}&type=${type}`
				: `v2/sales/department/cadence/import/bullhorn/extension/preview?type=${type}&id=${id}`;

			return AuthorizedApi.get(URL, {
				onDownloadProgress: progressEvent => onProgress(progressEvent),
			}).then(res =>
				bullhornQuery
					? parseLeads(res.data.data, type)
					: parseSingleLead(res.data.data[TYPES.CONTACT])
			);
		}
	};

	const {
		data: extensionLeads,
		isLoading: extensionLeadsLoading,
		isRefetching: extensionImportRefetching,
		isError: extensionImportError,
		error: extensionImportErrorMessage,
	} = useQuery(["leads-list"], addExtensionList, {
		enabled: enabled.injectionImport,
	});

	const addListApi = body => {
		let add;
		let link;

		if (import_type === "create_lead") {
			body.add?.leads?.length > 0 &&
				(add = AuthorizedApi.post(
					`/v2/sales/department/cadence/import/bullhorn/temp-leads`,
					body.add
				).then(res => res.data.data));
		} else if (type.toLowerCase() === TYPES.LEAD) {
			body.add?.leads?.length > 0 &&
				(add = AuthorizedApi.post(
					`/v2/sales/department/cadence/import/bullhorn/leads/import`,
					body.add
				).then(res => res.data.data));

			body.link?.leads?.length > 0 &&
				(link = AuthorizedApi.post(
					"/v2/sales/department/cadence/import/bullhorn/link/leads",
					body.link
				).then(res => res.data.data));
		} else if (
			(type === "ClientContact" ? "contact" : type.toLowerCase()) === TYPES.CONTACT
		) {
			body.add?.contacts?.length > 0 &&
				(add = AuthorizedApi.post(
					`/v2/sales/department/cadence/import/bullhorn/contacts/import`,
					body.add
				).then(res => res.data.data));

			body.link?.contacts?.length > 0 &&
				(link = AuthorizedApi.post(
					"/v2/sales/department/cadence/import/bullhorn/link/contacts",
					body.link
				).then(res => res.data.data));
		} else {
			body.add?.candidates?.length > 0 &&
				(add = AuthorizedApi.post(
					`/v2/sales/department/cadence/import/bullhorn/candidates/import`,
					body.add
				).then(res => res.data.data));

			body.link?.candidates?.length > 0 &&
				(link = AuthorizedApi.post(
					"/v2/sales/department/cadence/import/bullhorn/link/candidates",
					body.link
				).then(res => res.data.data));
		}

		return Promise.all([add, link]);
	};

	const {
		mutate: addList,
		isLoading: importLoading,
		isSuccess: isAddSuccess,
		isError: importError,
		error: importErrorMessage,
	} = useMutation(addListApi);

	// Get lead via filter view
	const getFilterViewLeadApi = view => {
		return (
			view?.query &&
			AuthorizedApi.get(
				`/v2/sales/department/cadence/import/bullhorn/extension/preview?type=${view?.type}&query=${view?.query}`
			).then(res => parseLeads(res.data.data, view?.type))
		);
	};

	const { mutate: getFilterViewLead, isLoading: getFilterViewLeadLoading } =
		useMutation(getFilterViewLeadApi);

	return {
		filters,
		setFilters,
		// leadsData,
		// fetchNextPage,
		// hasNextPage,
		// leadLoading,
		// isFetching,
		// isFetchingNextPage,
		// getLeadListError,
		getFilterViewLead,
		getFilterViewLeadLoading,

		//importss
		addList,
		importLoading: importLoading || extensionLeadsLoading || extensionImportRefetching,
		isAddSuccess,
		importError: {
			error: importError || extensionImportError,
			msg:
				importErrorMessage?.response?.data?.msg ??
				extensionImportErrorMessage?.response?.data?.error,
			bullhornErrorMessage:
				importErrorMessage?.response?.data?.error ??
				extensionImportErrorMessage?.response?.data?.error,
		},

		// Injection import
		progress,
		extensionLeads,
		extensionImportError,
	};
};
export default useCadenceImportBullhorn;
