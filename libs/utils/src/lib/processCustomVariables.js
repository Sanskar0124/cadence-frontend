import moment from "moment-timezone";
const translate = (variable_type, day) => {
	const en_weekday = [
		"sunday",
		"monday",
		"tuesday",
		"wednesday",
		"thursday",
		"friday",
		"saturday",
	];
	const fr_weekday = [
		"dimanche",
		"lundi",
		"mardi",
		"mercredi",
		"jeudi",
		"vendredi",
		"samedi",
	];
	const fr_weekday_capital = [
		"Dimanche",
		"Lundi",
		"Mardi",
		"Mercredi",
		"Jeudi",
		"Vendredi",
		"Samedi",
	];
	const es_weekday = [
		"domingo",
		"lunes",
		"martes",
		"miércoles",
		"jueves",
		"viernes",
		"sábado",
	];
	const es_weekday_capital = [
		"Domingo",
		"Lunes",
		"Martes",
		"Miércoles",
		"Jueves",
		"Viernes",
		"Sábado",
	];
	let weekday = "";
	switch (variable_type) {
		case "{{today_day(en)}}":
			weekday = `${en_weekday[day]}`;
			break;
		case "{{tomorrow_day(en)}}":
			weekday = `${en_weekday[day]}`;
			break;
		case "{{today_day(fr)}}":
			weekday = `${fr_weekday[day]}`;
			break;
		case "{{tomorrow_day(fr)}}":
			weekday = `${fr_weekday[day]}`;
			break;
		case "{{today_day(es)}}":
			weekday = `${es_weekday[day]}`;
			break;
		case "{{tomorrow_day(es)}}":
			weekday = `${es_weekday[day]}`;
			break;
		case "en":
			weekday = `${en_weekday[day]}`;
			break;
		case "fr":
			weekday = `${fr_weekday[day]}`;
			break;
		case "es":
			weekday = `${es_weekday[day]}`;
			break;
		case "en_capital":
			weekday = `${en_weekday[day]}`;
			break;
		case "fr_capital":
			weekday = `${fr_weekday_capital[day]}`;
			break;
		case "es_capital":
			weekday = `${es_weekday_capital[day]}`;
			break;
		case "":
			weekday = `variable mismatch`;
	}
	return weekday;
};
const getMatchedFallbackVariables = (variable, variables, fallback) => {
	let customVariableValue = "";
	const {
		//prospect
		first_name,
		last_name,
		company,
		signature,
		email,
		phone_number,
		occupation,
		owner,
		//account
		linkedin_url,
		account_linkedin_url,
		account_website_url,
		account_size,
		account_zipcode,
		account_country,
		account_phone_number,
		//sender
		sender_first_name,
		sender_last_name,
		sender_name,
		sender_email,
		sender_phone_number,
		sender_company,
		//Date variables
		today,
		today_day,
		tomorrow,
		tomorrow_day,
		fromTimezone,
		calendly_link,
		//other
		zoom_info,
	} = variables;
	switch (variable) {
		case "first_name":
			customVariableValue = first_name?.toString().length > 0 ? first_name : fallback;
			break;
		case "last_name":
			customVariableValue = last_name?.toString().length > 0 ? last_name : fallback;
			break;
		case "full_name":
			customVariableValue =
				`${first_name} ${last_name}`?.toString().length > 0
					? `${first_name} ${last_name}`
					: fallback;
			break;
		case "email":
			customVariableValue = email?.toString().length > 0 ? email?.toString() : fallback;
			break;
		case "phone":
			customVariableValue =
				phone_number?.toString().length > 0 ? phone_number?.toString() : fallback;
			break;
		case "owner":
			customVariableValue = owner?.toString().length > 0 ? owner?.toString() : fallback;
			break;
		case "linkedin_url":
			customVariableValue =
				linkedin_url?.toString().length > 0 ? linkedin_url?.toString() : fallback;
			break;
		case "occupation":
			customVariableValue =
				occupation?.toString().length > 0 ? occupation?.toString() : fallback;
			break;
		case "company_linkedin_url":
			customVariableValue =
				account_linkedin_url?.toString().length > 0
					? account_linkedin_url?.toString()
					: fallback;
			break;
		case "website":
			customVariableValue =
				account_website_url?.toString().length > 0
					? account_website_url?.toString()
					: fallback;
			break;
		case "size":
			customVariableValue =
				account_size?.toString().length > 0 ? account_size?.toString() : fallback;
			break;
		case "zipcode":
			customVariableValue =
				account_zipcode?.toString().length > 0 ? account_zipcode?.toString() : fallback;
			break;
		case "country":
			customVariableValue =
				account_country?.toString().length > 0 ? account_country?.toString() : fallback;
			break;
		case "company_name":
			customVariableValue =
				company?.toString().length > 0 ? company?.toString() : fallback;
			break;
		case "company_phone_number":
			customVariableValue =
				account_phone_number?.toString().length > 0
					? account_phone_number?.toString()
					: fallback;
			break;
		case "sender_first_name":
			customVariableValue =
				sender_first_name?.toString().length > 0
					? sender_first_name?.toString()
					: fallback;
			break;
		case "sender_last_name":
			customVariableValue =
				sender_last_name?.toString().length > 0 ? sender_last_name?.toString() : fallback;
			break;
		case "sender_name":
			customVariableValue =
				sender_name?.toString().length > 0 ? sender_name?.toString() : fallback;
			break;
		case "sender_email":
			customVariableValue =
				sender_email?.toString().length > 0 ? sender_email?.toString() : fallback;
			break;
		case "sender_phone_number":
			customVariableValue =
				sender_phone_number?.toString().length > 0
					? sender_phone_number?.toString()
					: fallback;
			break;
		case "sender_company":
			customVariableValue =
				sender_company?.toString().length > 0 ? sender_company?.toString() : fallback;
			break;

		case "":
			customVariableValue = `variable mismatch`;
	}
	return customVariableValue;
};
const workingDateNDaysAgo = (days, timezone) => {
	let date = new Date();
	let day = date.getDay();
	date = new Date(date.getTime());
	// date.setDate( date.getDate() + days + (day === 6 ? 2 : +!day) + Math.floor((days - 1 + (day % 6 || 1)) / 5) * 2 );
	date.setDate(
		date.getDate() -
			days -
			(day === 0 ? 2 : +!(day - 1)) -
			Math.floor((days - 1 + (day % 7 || 6)) / 7) * 2
	);
	return date;
};
const workingDateNDaysFromNow = (days, timezone) => {
	let date = new Date();
	let day = date.getDay();

	date = new Date(date.getTime());
	date.setDate(
		date.getDate() +
			days +
			(day === 6 ? 2 : +!day) +
			Math.floor((days - 1 + (day % 6 || 1)) / 5) * 2
	);
	return date;
};

const processCustomVariables = (body, lead, user) => {
	let text = body || "";
	const { Account } = lead;
	const VALUES = {
		//sender
		sender_phone_number: user?.primary_phone_number,
		sender_email: user?.primary_email,
		sender_name: `${user?.first_name} ${user?.last_name}`,
		sender_first_name: user?.first_name,
		sender_last_name: user?.last_name,
		sender_company: user?.Company?.name,
		calendly_link: user?.calendly_url,

		//Company
		country: Account?.country,
		zipcode: Account?.zipcode,
		size: Account?.size,
		website: Account?.url,
		account_linkedin_url: Account?.linkedin_url,
		company_name: Account?.name,
		company_phone_number: Account?.phone_number,

		//Person
		full_name: `${lead.first_name ?? ""} ${lead.last_name ?? ""}`,
		first_name: lead.first_name,
		last_name: lead.last_name,

		owner: `${user?.first_name} ${user?.last_name}`,
		phone:
			lead.Lead_phone_numbers.find(ph => ph.is_primary)?.phone_number ||
			lead.Lead_phone_numbers[0]?.phone_number,
		email:
			lead.Lead_emails.find(em => em.is_primary)?.email_id ||
			lead.Lead_emails[0]?.email_id,
		linkedin_url: lead.linkedin_url,
		job_position: lead.job_position,
	};

	//replace text variables
	Object.keys(CUSTOM_VARIABLES_TEXT_OPTIONS).forEach(custom_v => {
		text = text.replaceAll(
			custom_v,
			VALUES[CUSTOM_VARIABLES_TEXT_OPTIONS[custom_v]] ?? ""
		);
	});

	//Capitalize Dates
	const regex_caps = /(^|<p>|>|<br>|\.\s+)\{\{\s*([^}]+)\s*\}\}/g;
	const date_regex_caps = /\{\{\s*([^}]+)\s*\}\}/;
	let match_caps = text.match(regex_caps);

	match_caps?.forEach(n => {
		let beforeBrackets = n.split("{")[0];

		let date = n.match(date_regex_caps)[1];

		const replaceVal = `${beforeBrackets}{{${date}_capital}}`;
		date = `{{${date}}}`;

		if (
			date === "{{today_day(fr)}}" ||
			date === "{{tomorrow_day(fr)}}" ||
			date === "{{today_day(es)}}" ||
			date === "{{tomorrow_day(es)}}" ||
			date.match(/\{\{\d+_days_ago_day\((\w+)\)\}\}/) ||
			date.match(/\{\{\d+_days_day\((\w+)\)\}\}/) ||
			date.match(/\{\{\d+_week_days_from_now_day\((\w+)\)\}\}/) ||
			date.match(/\{\{\d+_week_days_ago_day\((\w+)\)\}\}/)
		) {
			text = text.replaceAll(n, replaceVal);
		}
	});

	//replate date variables
	text = text.replaceAll("{{today}}", moment().format("DD/MM"));
	text = text.replaceAll("{{tomorrow}}", moment().add(1, "days").format("DD/MM"));

	text = text.replaceAll(
		"{{today_day(en)}}",
		translate("{{today_day(en)}}", moment().day())
	);
	text = text.replaceAll(
		"{{tomorrow_day(en)}}",
		translate("{{tomorrow_day(en)}}", moment().add(1, "days").day())
	);

	text = text.replaceAll(
		"{{today_day(fr)}}",
		translate("{{today_day(fr)}}", moment().day())
	);
	text = text.replaceAll(
		"{{tomorrow_day(fr)}}",
		translate("{{tomorrow_day(fr)}}", moment().add(1, "days").day())
	);

	text = text.replaceAll(
		"{{today_day(es)}}",
		translate("{{today_day(es)}}", moment().day())
	);
	text = text.replaceAll(
		"{{tomorrow_day(es)}}",
		translate("{{tomorrow_day(es)}}", moment().add(1, "days").day())
	);

	const digits = /\d+/;
	//replace N_days variable
	const nDaysRegex = /\{\{\d+_days\}\}/g;
	let nDaysVariables = text.match(nDaysRegex);

	nDaysVariables?.forEach(n => {
		let n_days = parseInt(n.match(digits));
		text = text.replaceAll(n, moment().add(n_days, "days").format("DD/MM"));
	});

	//replace N_days Day variable
	const digits_day = /\d+/;
	const nDaysRegex_day = /\{\{\d+_days_day\((\w+)\)\}\}/g;
	const lang_regex_day = /([a-z]{2})\)/i;
	let nDaysVariables_day = text.match(nDaysRegex_day);
	nDaysVariables_day?.forEach(n => {
		let n_days = parseInt(n.match(digits_day));
		let language = n.match(lang_regex_day)[1];
		text = text.replaceAll(n, translate(language, moment().add(n_days, "days").day()));
	});

	//replace N_days Day variable Capital
	const digits_day_caps = /\d+/;
	const nDaysRegex_day_caps = /\{\{\d+_days_day\((\w+)\)_capital\}\}/g;
	const lang_regex_day_caps = /([a-z]{2})\)/i;
	let nDaysVariables_day_caps = text.match(nDaysRegex_day_caps);
	nDaysVariables_day_caps?.forEach(n => {
		let n_days = parseInt(n.match(digits_day_caps));
		let language = n.match(lang_regex_day_caps)[1];
		language = language + "_capital";
		text = text.replaceAll(n, translate(language, moment().add(n_days, "days").day()));
	});

	function addWeekdays(date, days) {
		date = moment(date); // use a clone
		while (days > 0) {
			date = date.add(1, "days");
			// decrease "days" only if it's a weekday.
			if (date.isoWeekday() !== 6 && date.isoWeekday() !== 7) {
				days -= 1;
			}
		}
		return date.format("DD/MM");
	}
	function addWeekdays_day(date, days) {
		date = moment(date); // use a clone
		while (days > 0) {
			date = date.add(1, "days");
			// decrease "days" only if it's a weekday.
			if (date.isoWeekday() !== 6 && date.isoWeekday() !== 7) {
				days -= 1;
			}
		}
		return date.day();
	}

	//replace N_week_days_from_now
	const nWeekDaysRegex = /\{\{\d+_week_days_from_now\}\}/g;
	let nWeekDaysVariables = text.match(nWeekDaysRegex);
	nWeekDaysVariables?.forEach(n => {
		let n_days = parseInt(n.match(digits));
		text = text.replaceAll(n, addWeekdays(moment(), n_days));
	});

	//replace N_week_days_from_now_day
	const digits_week_days_from_now_day = /\d+/;
	const nDaysRegex_week_days_from_now_day =
		/\{\{\d+_week_days_from_now_day\((\w+)\)\}\}/g;
	const lang_regex_week_days_from_now_day = /([a-z]{2})\)/i;
	let nWeekDaysVariables_day = text.match(nDaysRegex_week_days_from_now_day);
	nWeekDaysVariables_day?.forEach(n => {
		let n_days = parseInt(n.match(digits_week_days_from_now_day));
		let language = n.match(lang_regex_week_days_from_now_day)[1];
		text = text.replaceAll(n, translate(language, addWeekdays_day(moment(), n_days)));
	});

	//Fall Back Variables
	// const regex_fallback = /\{\{\s*([^|{}]+)\s*\|\s*([^|{}]+)\s*\}\}/g;
	// const variable_regex_fallback = /\{\{\s*([^|{}]+)\s*\|/;
	// const fallback_regex_fallback = /\|\s*([^|{}]+)\s*\}\}/;
	// let fallback_elem = text.match(regex_fallback);
	// fallback_elem?.forEach(n => {
	// 	let variable = n.match(variable_regex_fallback)[1].trim();
	// 	let fallback = n.match(fallback_regex_fallback)[1].trim();
	// 	text = text.replaceAll(n, getMatchedFallbackVariables(variable, VALUES, fallback));
	// });

	//N week days ago days
	const digits_nWeekDaysAgoDay = /\d+/;
	const regex_nWeekDaysAgoDay = /\{\{\d+_week_days_ago_day\((\w+)\)\}\}/g;
	const lang_regex_nWeekDaysAgoDay = /([a-z]{2})\)/i;
	let match_nWeekDaysAgoDay = text.match(regex_nWeekDaysAgoDay);
	match_nWeekDaysAgoDay?.forEach(n => {
		let n_days = parseInt(n.match(digits_nWeekDaysAgoDay));
		let language = n.match(lang_regex_nWeekDaysAgoDay)[1];
		let workingDateNDaysFromNow = workingDateNDaysAgo(n_days, moment.tz.guess());
		workingDateNDaysFromNow = new Date(workingDateNDaysFromNow).getDay();
		text = text.replaceAll(n, translate(language, workingDateNDaysFromNow));
	});

	//N week days ago days Capital
	const digits_nWeekDaysAgoDay_caps = /\d+/;
	const regex_nWeekDaysAgoDay_caps = /\{\{\d+_week_days_ago_day\((\w+)\)_capital\}\}/g;
	const lang_regex_nWeekDaysAgoDay_caps = /([a-z]{2})\)/i;
	let match_nWeekDaysAgoDay_caps = text.match(regex_nWeekDaysAgoDay_caps);
	match_nWeekDaysAgoDay_caps?.forEach(n => {
		let n_days = parseInt(n.match(digits_nWeekDaysAgoDay_caps));
		let language = n.match(lang_regex_nWeekDaysAgoDay_caps)[1];
		language = language + "_capital";
		let workingDateNDaysFromNow = workingDateNDaysAgo(n_days, moment.tz.guess());
		workingDateNDaysFromNow = new Date(workingDateNDaysFromNow).getDay();
		text = text.replaceAll(n, translate(language, workingDateNDaysFromNow));
	});

	//N week days from now days
	const digits_nWeekDaysFromNowDay = /\d+/;
	const regex_nWeekDaysFromNowDay = /\{\{\d+_week_days_from_now_day\((\w+)\)\}\}/g;
	const lang_regex_nWeekDaysFromNowDay = /([a-z]{2})\)/i;
	let match_nWeekDaysFromNowDay = text.match(regex_nWeekDaysFromNowDay);
	match_nWeekDaysFromNowDay?.forEach(n => {
		let n_days = parseInt(n.match(digits_nWeekDaysFromNowDay));
		let language = n.match(lang_regex_nWeekDaysFromNowDay)[1];
		let workingDateNDaysFromNow_val = workingDateNDaysFromNow(n_days, moment.tz.guess());
		workingDateNDaysFromNow_val = new Date(workingDateNDaysFromNow).getDay();
		text = text.replaceAll(n, translate(language, workingDateNDaysFromNow));
	});

	//N week days from now days Captial
	const digits_nWeekDaysFromNowDay_caps = /\d+/;
	const regex_nWeekDaysFromNowDay_caps =
		/\{\{\d+_week_days_from_now_day\((\w+)\)_capital\}\}/g;
	const lang_regex_nWeekDaysFromNowDay_caps = /([a-z]{2})\)/i;
	let match_nWeekDaysFromNowDay_caps = text.match(regex_nWeekDaysFromNowDay_caps);
	match_nWeekDaysFromNowDay_caps?.forEach(n => {
		let n_days = parseInt(n.match(digits_nWeekDaysFromNowDay_caps));
		let language = n.match(lang_regex_nWeekDaysFromNowDay_caps)[1];
		language = language + "_capital";
		let workingDateNDaysFromNow_val = workingDateNDaysFromNow(n_days, moment.tz.guess());
		workingDateNDaysFromNow_val = new Date(workingDateNDaysFromNow).getDay();
		text = text.replaceAll(n, translate(language, workingDateNDaysFromNow));
	});

	//N days ago day
	const digits_nDaysAgoDay = /\d+/;
	const regex_nDaysAgoDay = /\{\{\d+_days_ago_day\((\w+)\)\}\}/g;
	const lang_regex_nDaysAgoDay = /([a-z]{2})\)/i;
	let match_nDaysAgoDay = text.match(regex_nDaysAgoDay);
	match_nDaysAgoDay?.forEach(n => {
		let n_days = parseInt(n.match(digits_nDaysAgoDay));
		let language = n.match(lang_regex_nDaysAgoDay)[1];
		let nDaysDate = new Date();
		nDaysDate.setDate(nDaysDate.getDate() - n_days);
		nDaysDate = nDaysDate.getDay();
		text = text.replaceAll(n, translate(language, nDaysDate));
	});

	//N days ago day Capital
	const digits_nDaysAgoDay_caps = /\d+/;
	const regex_nDaysAgoDay_caps = /\{\{\d+_days_ago_day\((\w+)\)_capital\}\}/g;
	const lang_regex_nDaysAgoDay_caps = /([a-z]{2})\)/i;
	let match_nDaysAgoDay_caps = text.match(regex_nDaysAgoDay_caps);
	match_nDaysAgoDay_caps?.forEach(n => {
		let n_days = parseInt(n.match(digits_nDaysAgoDay_caps));
		let language = n.match(lang_regex_nDaysAgoDay_caps)[1];
		language = language + "_capital";
		let nDaysDate = new Date();
		nDaysDate.setDate(nDaysDate.getDate() - n_days);
		nDaysDate = nDaysDate.getDay();
		text = text.replaceAll(n, translate(language, nDaysDate));
	});

	//N week days ago
	const digits_nWeekDaysAgo = /\d+/;
	const regex_nWeekDaysAgo = /\{\{\d+_week_days_ago\}\}/g;
	let match_nWeekDaysAgo = text.match(regex_nWeekDaysAgo);
	match_nWeekDaysAgo?.forEach(n => {
		let n_days = parseInt(n.match(digits_nWeekDaysAgo));
		let workingDateNDaysFromNow = workingDateNDaysAgo(n_days, moment.tz.guess());
		workingDateNDaysFromNow = workingDateNDaysFromNow.toLocaleDateString("en-GB", {
			timeZone: moment.tz.guess(),
			day: "numeric",
			month: "numeric",
		});
		text = text.replaceAll(n, workingDateNDaysFromNow);
	});

	//N days ago
	const digits_nDaysAgo = /\d+/;
	const regex_nDaysAgo = /\{\{\d+_days_ago\}\}/g;
	let match_nDaysAgo = text.match(regex_nDaysAgo);
	match_nDaysAgo?.forEach(n => {
		let n_days = parseInt(n.match(digits_nDaysAgo));
		let nDaysDate = new Date();
		nDaysDate.setDate(nDaysDate.getDate() - n_days);
		nDaysDate = nDaysDate.toLocaleDateString("en-GB", {
			timeZone: moment.tz.guess(),
			day: "numeric",
			month: "numeric",
		});
		text = text.replaceAll(n, nDaysDate);
	});

	let replaceVal = "";
	const oneSignatureRegex = /\{\{user_signature\}\}/g;
	const allSignatureRegex = /\{\{user_signature\}\}\s*\(([^)]+)\)/g;
	const primarySignatureRegex = /\{\{user_signature_primary\}\}\s*\(([^)]+)\)/g;
	const signatureNameRegex = /\(([^)]+)\)/;

	//Replace {{user_signature_primary}} ( ) case
	const primarySignatureOccurences = [...new Set(body?.match(primarySignatureRegex))];
	primarySignatureOccurences.forEach(elem => {
		replaceVal = lead?.signature?.signature?.toString() ?? "";
		text = text.replaceAll(elem, replaceVal);
	});

	//First replace {{user_signature}} ( ) case
	const allSignatureoccurences = [...new Set(body?.match(allSignatureRegex))];
	allSignatureoccurences.forEach(elem => {
		let signatureName = elem.match(signatureNameRegex)[1].trim();
		if (lead?.allSignatures?.length !== 0 && lead?.allSignatures !== " ") {
			const foundItem = lead?.allSignatures?.find(item => signatureName === item.name);
			replaceVal = foundItem?.signature ?? "";
		}
		text = text.replaceAll(elem, replaceVal);
	});

	//Then replace only {{user_signature}} case
	const occurences = [...new Set(body?.match(oneSignatureRegex))];
	occurences.forEach(elem => {
		replaceVal = lead?.signature?.signature?.toString() ?? "";
		text = text.replaceAll(elem, replaceVal);
	});

	return text;
};

const CUSTOM_VARIABLES_TEXT_OPTIONS = {
	"{{first_name}}": "first_name",
	"{{last_name}}": "last_name",
	"{{company_name}}": "company_name",
	"{{full_name}}": "full_name",
	"{{email}}": "email",
	"{{phone}}": "phone",
	"{{owner}}": "owner",
	"{{linkedin_url}}": "linkedin_url",
	"{{job_position}}": "job_position",
	"{{account_linkedin_url}}": "account_linkedin_url",
	"{{website}}": "website",
	"{{size}}": "size",
	"{{zipcode}}": "zipcode",
	"{{country}}": "country",
	"{{sender_first_name}}": "sender_first_name",
	"{{sender_last_name}}": "sender_last_name",
	"{{sender_name}}": "sender_name",
	"{{sender_email}}": "sender_email",
	"{{sender_phone_number}}": "sender_phone_number",
	"{{sender_company}}": "sender_company",
	"{{calendly_link}}": "calendly_link",
};

export default processCustomVariables;
