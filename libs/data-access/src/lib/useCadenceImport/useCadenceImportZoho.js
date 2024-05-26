import { useEffect, useState } from "react";
import { AuthorizedApi } from "../api";
import { useMutation, useInfiniteQuery, useQuery } from "react-query";
import * as moment from "moment";

const TYPES = {
	LEAD: "lead",
	CONTACT: "contact",
	LEAD_LIST: "lead_list",
	CONTACT_LIST: "contact_list",
};

const BASICS_OPEARATOS = [">", "<", ">=", "<=", "=", "!="];
const BETWEEN_OPERATORS = ["between", "not between"];

const ALL_DATA_TYPE = {
	BOOLEAN: "boolean",
	EMAIL: "email",
	TEXT: "text",
	PICKLIST: "picklist",
	DATE: "date",
	DATETIME: "datetime",
	NUMBER: "number",
	CURRENCY: "currency",
	OWNER_LOOKUP: "ownerlookup",
	INTEGER: "integer",
	TEXTAREA: "textarea",
	PROFILE_IMAGE: "profileimage",
	WEBSITE: "website",
	PHONE: "phone",
};

const All_SUPPORTED_OPERATOR = {
	EQUAL: "=",
	NOT_EQUAL: "!=",
	GREATER_THAN_OR_EUQAL_TO: ">=",
	GREATER_THAN: ">",
	LESS_THAN: "<",
	LESS_THAN_OR_EUQAL_TO: "<=",
	IN: "in",
	NOT_IN: "not in",
	IS_NULL: "is null",
	IS_NOT_NULL: "is not null",
	BETWEEN: "between",
	NOT_BETWEEN: "not between",
	LIKE: "like",
	NOT_LIKE: "not like",
};

const LEAD_URL = "v2/sales/department/cadence/import/zoho/leads";
const CONTACT_URL = "v2/sales/department/cadence/import/zoho/contacts";

const parseSimpleDate = (date, flr) => {
	if (
		flr.operator === All_SUPPORTED_OPERATOR.IS_NULL ||
		flr.operator === All_SUPPORTED_OPERATOR.IS_NOT_NULL
	)
		return "";
	let actualDate = date;
	let newDate = `${actualDate["YYYY"]}-${actualDate["MM"]}-${actualDate["DD"]}`;
	return newDate;
};

const parseBetweenDate = (date, flr) => {
	if (
		flr.operator === All_SUPPORTED_OPERATOR.IS_NULL ||
		flr.operator === All_SUPPORTED_OPERATOR.IS_NOT_NULL
	)
		return "";
	let actualDate = date.split("-").map(f => parseSimpleDate(f, flr));
	return { starts: actualDate[0], ends: actualDate[1] };
};

const parseDateTime = (datetime, flr) => {
	let actualDate = [];
	let actualTime = "";
	//DD.MM.YYYY
	//HH:MM

	if (
		flr.operator === All_SUPPORTED_OPERATOR.IS_NULL ||
		flr.operator === All_SUPPORTED_OPERATOR.IS_NOT_NULL
	)
		return "";

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

	return parsedDateTime.toISOString();
};

const parseDateTimeRange = (datetimerange, flr) => {
	if (
		flr.operator === All_SUPPORTED_OPERATOR.IS_NULL ||
		flr.operator === All_SUPPORTED_OPERATOR.IS_NOT_NULL
	)
		return "";

	let startDate = datetimerange?.date.starts;
	let endDate = datetimerange?.date.ends;
	let timeStart = `${datetimerange?.time.starts}:00`;
	let timeEnd = `${datetimerange?.time.ends}:00`;

	let actualStartDate = `${startDate.DD}:${startDate.MM}:${startDate.YYYY}`;
	let actualEndDate = `${endDate.DD}:${endDate.MM}:${endDate.YYYY}`;

	const parseStartDateTime = moment(
		`${actualStartDate} ${timeStart}`,
		"DD.MM.YYYY HH:mm:ss"
	);
	const parseEndDateTime = moment(`${actualEndDate} ${timeEnd}`, "DD.MM.YYYY HH:mm:ss");

	return {
		starts: parseStartDateTime.toISOString(),
		ends: parseEndDateTime.toISOString(),
	};
};

const getCurrencyParse = curreny => {
	const actualValue = curreny.split("-");
	return { starts: actualValue[0].trim(), ends: actualValue[1].trim() };
};

const formData = {
	zoho_field: "",
	operator: "",
	value: "",
	type: "",
	dateTime: {},
};

const parseDateRange = (daterange, flr) => {
	//YYYY-MM-DD
	if (
		flr.operator === All_SUPPORTED_OPERATOR.IS_NULL ||
		flr.operator === All_SUPPORTED_OPERATOR.IS_NOT_NULL
	)
		return "";

	let daterangeStart = daterange.starts;
	let daterangeEnd = daterange.ends;
	return {
		starts: `${daterangeStart.YYYY}-${daterangeStart.MM}-${daterangeStart.DD}`,
		ends: `${daterangeEnd.YYYY}-${daterangeEnd.MM}-${daterangeEnd.DD}`,
	};
};

const parseArray = array => {
	let arr = array?.map(flr => {
		if (
			flr.operator === All_SUPPORTED_OPERATOR.IS_NULL ||
			flr.operator === All_SUPPORTED_OPERATOR.IS_NOT_NULL
		) {
			delete flr.dateTime;
			delete flr.daterange;
			delete flr.datetimerange;
			delete flr.metaData;
			return { ...flr, value: "" };
		} else if (flr.zoho_field === "Account_Name") {
			delete flr.dateTime;
			delete flr.daterange;
			delete flr.datetimerange;
			delete flr.metaData;
			return { ...flr, zoho_field: "Account_Name.Account_Name" };
		} else if (
			flr.type === ALL_DATA_TYPE.DATE &&
			BASICS_OPEARATOS.includes(flr.operator)
		) {
			delete flr.dateTime;
			delete flr.daterange;
			delete flr.datetimerange;
			delete flr.metaData;
			return { ...flr, value: parseSimpleDate(flr.value, flr) };
		} else if (flr.type === "date" && BETWEEN_OPERATORS.includes(flr.operator)) {
			delete flr.dateTime;
			delete flr.datetimerange;
			delete flr.metaData;
			return {
				zoho_field: flr.zoho_field,
				operator: flr.operator,
				value: parseDateRange(flr.daterange, flr),
				type: flr.type,
			};
		} else if (
			flr.type === ALL_DATA_TYPE.DATETIME &&
			BASICS_OPEARATOS.includes(flr.operator) &&
			flr?.dateTime &&
			Object.keys(formData)?.includes("dateTime")
		) {
			delete flr.daterange;
			delete flr.datetimerange;
			delete flr.metaData;
			return {
				zoho_field: flr.zoho_field,
				operator: flr.operator,
				value: parseDateTime(flr.dateTime, flr),
				type: flr.type,
			};
		} else if (
			flr.type === ALL_DATA_TYPE.DATETIME &&
			BETWEEN_OPERATORS.includes(flr.operator)
		) {
			delete flr.daterange;
			delete flr.dateTime;
			delete flr.metaData;
			return {
				zoho_field: flr.zoho_field,
				type: flr.type,
				operator: flr.operator,
				value: parseDateTimeRange(flr.datetimerange, flr),
			};
		} else if (
			(flr.type === ALL_DATA_TYPE.CURRENCY ||
				flr.type === ALL_DATA_TYPE.INTEGER ||
				flr.type === ALL_DATA_TYPE.NUMBER) &&
			BETWEEN_OPERATORS.includes(flr.operator)
		) {
			delete flr.daterange;
			delete flr.dateTime;
			delete flr.datetimerange;
			delete flr.metaData;
			return { ...flr, value: { starts: flr.value.starts, ends: flr.value.ends } };
		} else if (flr.operator === "like") {
			delete flr.daterange;
			delete flr.dateTime;
			delete flr.datetimerange;

			return { ...flr };
		} else {
			delete flr.metaData;
			delete flr.daterange;
			delete flr.dateTime;
			delete flr.datetimerange;
			return { ...flr, value: flr.value };
		}
	});
	return arr;
};
const KEY = "leads-list";

const useCadenceImportZoho = ({
	enabled = null,
	leadType = null,

	type = null,
	ids = null,
	loaderId = null,
}) => {
	const [filters, setFilters] = useState(() => {
		const savedFilters = JSON.parse(sessionStorage.getItem("zoho-filters"));

		if (savedFilters?.lead?.length || savedFilters?.contact?.length) {
			return savedFilters;
		} else {
			return { lead: [], contact: [] };
		}
	});

	// useEffect(() => {
	// 	sessionStorage.setItem("zoho-filters", JSON.stringify(filters));
	// }, [filters]);

	const getLeadContactApi = filterView => {
		if (leadType === TYPES.LEAD) {
			return AuthorizedApi.post(LEAD_URL, filterView).then(res => res.data?.data);
		} else if (leadType === TYPES.CONTACT) {
			return AuthorizedApi.post(CONTACT_URL, filterView).then(res => res.data?.data);
		}
	};

	const {
		mutate: getLeadList,
		isLoading: getLeadListLoading,
		error: getLeadListError,
	} = useMutation(getLeadContactApi);

	// const {
	// 	data: leadsData,
	// 	fetchNextPage,
	// 	hasNextPage,
	// 	isLoading: leadLoading,
	// 	isFetching,
	// 	isFetchingNextPage,
	// } = useInfiniteQuery([KEY, { leadType, filters, filterView }], getLeadContactApi, {
	// 	enabled,
	// 	getNextPageParam: (lastPage, pages) => {
	// 		if (!lastPage?.length) return undefined;
	// 		return pages.length * 200;
	// 	},
	// 	select: data => data?.pages?.map(page => page)?.flat(),
	// });

	const addListApi = body => {
		let add;
		let link;

		if (leadType === "create_lead") {
			body.add?.leads?.length > 0 &&
				(add = AuthorizedApi.post(
					`/v2/sales/department/cadence/import/zoho/temp-leads`,
					body.add
				).then(res => res.data.data));
		} else if (type === TYPES.LEAD || leadType === TYPES.LEAD) {
			body.add?.leads?.length > 0 &&
				(add = AuthorizedApi.post(
					`/v2/sales/department/cadence/import/zoho/leads/import`,
					body.add
				).then(res => res.data.data));

			body.link?.leads?.length > 0 &&
				(link = AuthorizedApi.post(
					"/v2/sales/department/cadence/import/zoho/link/leads",
					body.link
				).then(res => res.data.data));
		} else if (type === TYPES.CONTACT || leadType === TYPES.CONTACT) {
			body.add?.contacts?.length > 0 &&
				(add = AuthorizedApi.post(
					`/v2/sales/department/cadence/import/zoho/contacts/import`,
					body.add
				).then(res => res.data.data));

			body.link?.contacts?.length > 0 &&
				(link = AuthorizedApi.post(
					"/v2/sales/department/cadence/import/zoho/link/contacts",
					body.link
				).then(res => res.data.data));
		}

		return Promise.all([add, link]);
	};

	const {
		mutate: addList,
		isLoading: addLoading,
		isSuccess: isAddSuccess,
		isError: importError,
		error: importErrorMessage,
	} = useMutation(addListApi);

	// get zoho uesrs
	const getZohoUserApi = () => {
		return AuthorizedApi.get("/v2/sales/department/cadence/import/zoho/user").then(
			res => res.data.data
		);
	};

	const { mutate: getZohoUsers, isLoading: getZohoUsersLoding } =
		useMutation(getZohoUserApi);

	// FOR CRM LEAD IMPORT
	const getZohoLeadsContactsApi = async () => {
		if (type === TYPES.LEAD) {
			return await AuthorizedApi.post(LEAD_URL, {
				leadIds: ids,
				loaderId: loaderId,
			}).then(res => res.data?.data);
		} else if (type === TYPES.CONTACT) {
			return await AuthorizedApi.post(CONTACT_URL, {
				contactIds: ids,
				loaderId: loaderId,
			}).then(res => res.data?.data);
		}
	};

	const {
		data: leads,
		isLoading: leadsAddLoading,
		isError: leadsAddError,
		error: leadsAddErrorMessage,
	} = useQuery([KEY], getZohoLeadsContactsApi, {
		enabled: enabled,
	});

	return {
		addList,
		addLoading: leadsAddLoading || addLoading,
		isAddSuccess,
		setFilters,
		filters,

		// related to Infinte scroll code
		// leadsData,
		// fetchNextPage,
		// hasNextPage,
		// leadLoading,
		// isFetching,
		// isFetchingNextPage,

		//zoho users
		getZohoUsers,
		getZohoUsersLoding,

		importError: {
			error: importError || leadsAddError,
			msg:
				importErrorMessage?.response?.data?.msg ??
				leadsAddErrorMessage?.response?.data?.msg,
			zohoErrorMessage:
				importErrorMessage?.response?.data?.error ??
				leadsAddErrorMessage?.response?.data?.error,
		},

		// CRM LEADS
		crmLeads: leads,
		// After refactoring
		getLeadList,
		getLeadListLoading,
		getLeadListError,
	};
};

export default useCadenceImportZoho;
