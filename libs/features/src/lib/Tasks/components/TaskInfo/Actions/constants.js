import { INTEGRATION_TYPE, LEAD_INTEGRATION_TYPES } from "@cadence-frontend/constants";

export const VIEWS_SALESFORCE = {
	LEAD: "lead",
	CONTACT: "contact",
	ACCOUNT: "account",
};
export const VIEWS_ZOHO = {
	LEAD: "lead",
	CONTACT: "contact",
	ACCOUNT: "account",
};

export const VIEWS_BULLHORN = {
	LEAD: "lead",
	CONTACT: "contact",
	ACCOUNT: "account",
	CANDIDATE: "candidate",
	CLIENT_CONTACT: "clientContact",
	CLIENT_CORPORATION: "clientCorporation",
};

export const FIELDS_SALESFORCE = {
	[VIEWS_SALESFORCE.LEAD]: {},
	[VIEWS_SALESFORCE.CONTACT]: {},
	[VIEWS_SALESFORCE.ACCOUNT]: {},
};
export const FIELDS_ZOHO = {
	[VIEWS_ZOHO.LEAD]: {},
	[VIEWS_ZOHO.CONTACT]: {},
	[VIEWS_ZOHO.ACCOUNT]: {},
};

export const FIELDS_BULLHORN = {
	[VIEWS_BULLHORN.LEAD]: {},
	[VIEWS_BULLHORN.CONTACT]: {},
	[VIEWS_BULLHORN.ACCOUNT]: {},
	[VIEWS_BULLHORN.CANDIDATE]: {},
};

export const VIEWS_PIPEDRIVE = {
	PERSON: "person",
	ORGANIZATION: "organization",
};
export const FIELDS_PIPEDRIVE = {
	[VIEWS_PIPEDRIVE.PERSON]: {},
	[VIEWS_PIPEDRIVE.ORGANIZATION]: {},
};
export const VIEWS_HUBSPOT = {
	CONTACT: "contact",
	COMPANY: "company",
};
export const FIELDS_HUBSPOT = {
	[VIEWS_HUBSPOT.COMPANY]: {},
	[VIEWS_HUBSPOT.CONTACT]: {},
};
export const VIEWS_SELLSY = {
	CONTACT: "contact",
	COMPANY: "company",
};
export const FIELDS_SELLSY = {
	[VIEWS_SELLSY.COMPANY]: {},
	[VIEWS_SELLSY.CONTACT]: {},
};
export const VIEWS_DYNAMICS = {
	LEAD: "lead",
	CONTACT: "contact",
	ACCOUNT: "account",
};
export const FIELDS_DYNAMICS = {
	[VIEWS_DYNAMICS.LEAD]: {},
	[VIEWS_DYNAMICS.CONTACT]: {},
	[VIEWS_DYNAMICS.ACCOUNT]: {},
};

export const LEAD_STATUS_LABEL_MAP = {
	trash: "disqualified",
	converted: "converted",
};

export const getQualificationsByLeadIntegration = integration_type => {
	switch (integration_type) {
		case LEAD_INTEGRATION_TYPES.SALESFORCE_LEAD:
		case LEAD_INTEGRATION_TYPES.SALESFORCE_CONTACT:
		case LEAD_INTEGRATION_TYPES.PIPEDRIVE_PERSON:
		case LEAD_INTEGRATION_TYPES.HUBSPOT_CONTACT:
		case LEAD_INTEGRATION_TYPES.SELLSY_CONTACT:
		case LEAD_INTEGRATION_TYPES.ZOHO_LEAD:
		case LEAD_INTEGRATION_TYPES.ZOHO_CONTACT:
		case LEAD_INTEGRATION_TYPES.BULLHORN_LEAD:
		case LEAD_INTEGRATION_TYPES.BULLHORN_CONTACT:
		case LEAD_INTEGRATION_TYPES.BULLHORN_CANDIDATE:
		case LEAD_INTEGRATION_TYPES.DYNAMICS_LEAD:
		case LEAD_INTEGRATION_TYPES.DYNAMICS_CONTACT:
			return true;

		default:
			return false;
	}
};

export const getAccountProgressByIntegration = (integration_type, lead, fieldMap) => {
	switch (integration_type) {
		case INTEGRATION_TYPE.HUBSPOT:
			return true;

		case INTEGRATION_TYPE.SALESFORCE:
			return lead?.integration_type === LEAD_INTEGRATION_TYPES.SALESFORCE_CONTACT
				? Boolean(
						fieldMap?.Company_Setting?.Integration_Field_Map?.account_map
							?.integration_status?.name
				  )
				: lead?.integration_type === LEAD_INTEGRATION_TYPES.SALESFORCE_LEAD
				? Boolean(
						fieldMap?.Company_Setting?.Integration_Field_Map?.lead_map?.integration_status
							?.name
				  )
				: true;

		case INTEGRATION_TYPE.BULLHORN:
			return true;
		default:
			return false;
	}
};

export const getExportByLeadIntegration = lead_integration_type => {
	switch (lead_integration_type) {
		case LEAD_INTEGRATION_TYPES.SALESFORCE_CSV_LEAD:
		case LEAD_INTEGRATION_TYPES.SALESFORCE_GOOGLE_SHEET_LEAD:
		case LEAD_INTEGRATION_TYPES.PIPEDRIVE_CSV_PERSON:
		case LEAD_INTEGRATION_TYPES.PIPEDRIVE_GOOGLE_SHEET_PERSON:
		case LEAD_INTEGRATION_TYPES.HUBSPOT_CSV_CONTACT:
		case LEAD_INTEGRATION_TYPES.HUBSPOT_GOOGLE_SHEET_CONTACT:
		case LEAD_INTEGRATION_TYPES.ZOHO_CSV_LEAD:
		case LEAD_INTEGRATION_TYPES.ZOHO_GOOGLE_SHEET_LEAD:
		case LEAD_INTEGRATION_TYPES.SELLSY_CSV_CONTACT:
		case LEAD_INTEGRATION_TYPES.SELLSY_GOOGLE_SHEET_CONTACT:
		case LEAD_INTEGRATION_TYPES.BULLHORN_CSV_LEAD:
		case LEAD_INTEGRATION_TYPES.BULLHORN_GOOGLE_SHEET_LEAD:
			return true;

		default:
			return false;
	}
};

const buttonFormSetSalesforce = ({ lead, fieldMap, setButtonText, setForm }) => {
	if (
		lead.integration_type === LEAD_INTEGRATION_TYPES.SALESFORCE_CONTACT &&
		lead.integration_id
	) {
		if (fieldMap?.Company_Setting.Integration_Field_Map.contact_custom_object != null) {
			setButtonText(
				fieldMap.Company_Setting.Integration_Field_Map.contact_custom_object[0]
					.button_text
			);
			setForm(
				fieldMap.Company_Setting.Integration_Field_Map.contact_custom_object[0].form
			);
		} else {
			setButtonText("Qualification");
			setForm([]);
		}
	} else {
		if (fieldMap?.Company_Setting.Integration_Field_Map?.lead_custom_object != null) {
			setButtonText(
				fieldMap.Company_Setting.Integration_Field_Map?.lead_custom_object[0].button_text
			);
			setForm(fieldMap.Company_Setting.Integration_Field_Map?.lead_custom_object[0].form);
		} else {
			setButtonText("Qualification");
			setForm([]);
		}
	}
};

const buttonFormSetZoho = ({ lead, fieldMap, setButtonText, setForm }) => {
	if (
		lead.integration_type === LEAD_INTEGRATION_TYPES.ZOHO_CONTACT &&
		lead.integration_id
	) {
		if (fieldMap?.Company_Setting.Integration_Field_Map.contact_custom_object != null) {
			setButtonText(
				fieldMap.Company_Setting.Integration_Field_Map.contact_custom_object[0]
					.button_text
			);
			setForm(
				fieldMap.Company_Setting.Integration_Field_Map.contact_custom_object[0].form
			);
		} else {
			setButtonText("Qualification");
			setForm([]);
		}
	} else {
		if (fieldMap?.Company_Setting.Integration_Field_Map?.lead_custom_object != null) {
			setButtonText(
				fieldMap.Company_Setting.Integration_Field_Map?.lead_custom_object[0].button_text
			);
			setForm(fieldMap.Company_Setting.Integration_Field_Map?.lead_custom_object[0].form);
		} else {
			setButtonText("Qualification");
			setForm([]);
		}
	}
};

const buttonFormSetPipedrive = ({ lead, fieldMap, setButtonText, setForm }) => {
	if (fieldMap?.Company_Setting.Integration_Field_Map.person_custom_object != null) {
		setButtonText(
			fieldMap.Company_Setting.Integration_Field_Map.person_custom_object[0].button_text
		);
		setForm(
			lead?.account_id != null
				? fieldMap.Company_Setting.Integration_Field_Map.person_custom_object[0].form
				: fieldMap.Company_Setting.Integration_Field_Map.person_custom_object[0].form.filter(
						i => i.integration_endpoint !== "organization"
				  )
		);
	} else {
		setButtonText("Qualification");
		setForm([]);
	}
};
const buttonFormSetHubspot = ({ lead, fieldMap, setButtonText, setForm }) => {
	if (fieldMap?.Company_Setting.Integration_Field_Map.contact_custom_object != null) {
		setButtonText(
			fieldMap.Company_Setting.Integration_Field_Map.contact_custom_object[0].button_text
		);

		setForm(
			lead?.account_id != null
				? fieldMap.Company_Setting.Integration_Field_Map.contact_custom_object[0].form
				: fieldMap.Company_Setting.Integration_Field_Map.contact_custom_object[0].form.filter(
						i => i.integration_endpoint !== "company"
				  )
		);
	} else {
		setButtonText("Qualification");
		setForm([]);
	}
};
const buttonFormSetSellsy = ({ lead, fieldMap, setButtonText, setForm }) => {
	if (fieldMap?.Company_Setting.Integration_Field_Map.contact_custom_object != null) {
		setButtonText(
			fieldMap.Company_Setting.Integration_Field_Map.contact_custom_object.button_text
		);
		setForm(
			lead?.account_id != null
				? fieldMap.Company_Setting.Integration_Field_Map.contact_custom_object.form
				: fieldMap.Company_Setting.Integration_Field_Map.contact_custom_object.form.filter(
						i => i.integration_endpoint !== "company"
				  )
		);
	} else {
		setButtonText("Qualification");
		setForm([]);
	}
};

const buttonFormSetBullhorn = ({ lead, fieldMap, setButtonText, setForm }) => {
	if (
		lead.integration_type === LEAD_INTEGRATION_TYPES.BULLHORN_CONTACT &&
		lead.integration_id
	) {
		if (fieldMap?.Company_Setting.Integration_Field_Map.contact_custom_object != null) {
			setButtonText(
				fieldMap.Company_Setting.Integration_Field_Map.contact_custom_object[0]
					.button_text
			);
			setForm(
				fieldMap.Company_Setting.Integration_Field_Map.contact_custom_object[0].form
			);
		} else {
			setButtonText("Qualification");
			setForm([]);
		}
	} else if (
		lead.integration_type === LEAD_INTEGRATION_TYPES.BULLHORN_LEAD &&
		lead.integration_id
	) {
		if (fieldMap?.Company_Setting.Integration_Field_Map?.lead_custom_object != null) {
			setButtonText(
				fieldMap.Company_Setting.Integration_Field_Map?.lead_custom_object[0].button_text
			);
			setForm(fieldMap.Company_Setting.Integration_Field_Map?.lead_custom_object[0].form);
		} else {
			setButtonText("Qualification");
			setForm([]);
		}
	} else {
		if (
			fieldMap?.Company_Setting.Integration_Field_Map?.candidate_custom_object != null
		) {
			setButtonText(
				fieldMap.Company_Setting.Integration_Field_Map?.candidate_custom_object[0]
					.button_text
			);
			setForm(
				fieldMap.Company_Setting.Integration_Field_Map?.candidate_custom_object[0].form
			);
		} else {
			setButtonText("Qualification");
			setForm([]);
		}
	}
};
const buttonFormSetDynamics = ({ lead, fieldMap, setButtonText, setForm }) => {
	if (
		lead.integration_type === LEAD_INTEGRATION_TYPES.DYNAMICS_CONTACT &&
		lead.integration_id
	) {
		if (fieldMap?.Company_Setting.Integration_Field_Map.contact_custom_object != null) {
			setButtonText(
				fieldMap.Company_Setting.Integration_Field_Map.contact_custom_object[0]
					.button_text
			);
			setForm(
				fieldMap.Company_Setting.Integration_Field_Map.contact_custom_object[0].form
			);
		} else {
			setButtonText("Qualification");
			setForm([]);
		}
	} else {
		if (fieldMap?.Company_Setting.Integration_Field_Map?.lead_custom_object != null) {
			setButtonText(
				fieldMap.Company_Setting.Integration_Field_Map?.lead_custom_object[0].button_text
			);
			setForm(fieldMap.Company_Setting.Integration_Field_Map?.lead_custom_object[0].form);
		} else {
			setButtonText("Qualification");
			setForm([]);
		}
	}
};
const fetchCustomSalesforce = ({
	lead,
	fieldMap,
	form,
	fields,
	setFields,
	addError,
	fetchCustomObjectDetails,
}) => {
	let body;
	if (lead.integration_id) {
		if (lead.integration_type === LEAD_INTEGRATION_TYPES.SALESFORCE_LEAD) {
			let references = [];
			form.forEach(item => {
				if (item.reference_field_name) {
					references.push({
						reference_to: item.reference_to,
						key: item.integration_field,
						reference_field_name: item.reference_field_name,
					});
				}
			});
			body = {
				id: lead.integration_id,
				type: "lead",
				references,
			};
		} else {
			let references_account = [];
			let references_contact = [];

			form.forEach(item => {
				if (item.reference_field_name) {
					if (item.integration_endpoint === VIEWS_SALESFORCE.ACCOUNT) {
						references_account.push({
							reference_to: item.reference_to,
							key: item.integration_field,
							reference_field_name: item.reference_field_name,
						});
					} else {
						references_contact.push({
							reference_to: item.reference_to,
							key: item.integration_field,
							reference_field_name: item.reference_field_name,
						});
					}
				}
			});
			body = {
				id: lead.integration_id,
				type: "contact",
				...(references_account.length > 0 && { references_account }),
				...(references_contact.length > 0 && { references_contact }),
			};
		}

		if (
			lead?.integration_type !== LEAD_INTEGRATION_TYPES.SALESFORCE_GOOGLE_SHEET_LEAD &&
			lead?.integration_type !== LEAD_INTEGRATION_TYPES.SALESFORCE_CSV_LEAD
		)
			fetchCustomObjectDetails(body, {
				onSuccess: data => {
					if (lead.integration_type === LEAD_INTEGRATION_TYPES.SALESFORCE_LEAD) {
						setFields(prev => ({ ...prev, [VIEWS_SALESFORCE.LEAD]: data }));
					} else {
						fields[VIEWS_SALESFORCE.CONTACT] = data.contact;
						fields[VIEWS_SALESFORCE.ACCOUNT] = data.account;
						setFields(prev => ({
							...prev,
							[VIEWS_SALESFORCE.CONTACT]: data.contact,
							[VIEWS_SALESFORCE.ACCOUNT]: data.account,
						}));
					}
				},
				onError: err => {
					addError({
						text: err.response?.data?.msg,
						desc: err?.response?.data?.error || "Please contact support",
						cId: err?.response?.data?.correlationId,
					});
					setFields(FIELDS_SALESFORCE);
				},
			});
	}
};
const fetchCustomPipedrive = ({
	lead,
	fieldMap,
	fields,
	setFields,
	addError,
	fetchCustomObjectDetails,
}) => {
	let body;
	body = {
		id: lead?.integration_id,
	};
	if (
		lead?.integration_type !== LEAD_INTEGRATION_TYPES.PIPEDRIVE_CSV_PERSON &&
		lead?.integration_type !== LEAD_INTEGRATION_TYPES.PIPEDRIVE_GOOGLE_SHEET_PERSON
	)
		fetchCustomObjectDetails(body, {
			onSuccess: data => {
				fields[VIEWS_PIPEDRIVE.PERSON] = data.data;
				fields[VIEWS_PIPEDRIVE.ORGANIZATION] =
					data.data.org_id != null ? data.data.org_id : {};
				setFields(prev => ({
					...prev,
					[VIEWS_PIPEDRIVE.PERSON]: data.data,
					[VIEWS_PIPEDRIVE.ORGANIZATION]:
						data.data.org_id != null ? data.data.org_id : {},
				}));
			},
			onError: err => {
				addError({
					text: err.response?.data?.msg,
					desc: err?.response?.data?.error,
					cId: err?.response?.data?.correlationId,
				});
				setFields(FIELDS_PIPEDRIVE);
			},
		});
};
const fetchCustomHubspot = ({
	lead,
	fieldMap,
	fields,
	form,
	setFields,
	addError,
	fetchCustomObjectDetails,
}) => {
	let body;
	if (lead.integration_id) {
		body = {
			id: lead?.integration_id,
			properties: {
				contact_properties: `${fieldMap.Company_Setting.Integration_Field_Map.contact_custom_object?.[0]?.form
					?.filter(i => i?.integration_endpoint === VIEWS_HUBSPOT.CONTACT)
					?.map(i => i?.integration_field)
					.toString()
					.concat(
						form?.filter(i => i?.integration_endpoint === VIEWS_HUBSPOT.CONTACT)
							.length === 0
							? "associatedcompanyid"
							: ",associatedcompanyid"
					)}${
					fieldMap.Company_Setting.Integration_Field_Map.contact_map.integration_status &&
					`,${fieldMap.Company_Setting.Integration_Field_Map.contact_map.integration_status.name}`
				}`,

				company_properties:
					fieldMap.Company_Setting.Integration_Field_Map.contact_custom_object?.[0]?.form
						?.filter(i => i?.integration_endpoint === VIEWS_HUBSPOT.COMPANY)
						?.map(i => i?.integration_field)
						.toString(),
			},
		};
		if (
			lead?.integration_type !== LEAD_INTEGRATION_TYPES.HUBSPOT_CSV_CONTACT &&
			lead?.integration_type !== LEAD_INTEGRATION_TYPES.HUBSPOT_GOOGLE_SHEET_CONTACT
		)
			fetchCustomObjectDetails(body, {
				onSuccess: data => {
					setFields(prev => ({
						...prev,
						[VIEWS_HUBSPOT.CONTACT]: data?.properties,
						[VIEWS_HUBSPOT.COMPANY]:
							data?.properties?.associatedcompany != null
								? data?.properties?.associatedcompany
								: {},
					}));
				},
				onError: err => {
					addError({
						text: err?.response?.data?.msg,
						desc: err?.response?.data?.error,
						cId: err?.response?.data?.correlationId,
					});
					setFields(FIELDS_HUBSPOT);
				},
			});
	}
};
const fetchCustomSellsy = ({
	lead,
	fieldMap,
	fields,
	form,
	setFields,
	addError,
	fetchCustomObjectDetails,
}) => {
	let body;
	if (lead.integration_id) {
		body = {
			contact_id: lead.integration_id,
			custom_object:
				fieldMap.Company_Setting.Integration_Field_Map.contact_custom_object?.form?.map(
					i => {
						let obj = {};
						Object.keys(i).forEach(field => {
							if (field === "integration_endpoint") {
								obj["sellsy_endpoint"] = i["integration_endpoint"];
							} else if (field === "integration_field") {
								obj["sellsy_field"] = i["integration_field"];
							} else if (field === "integration_label") {
								obj["sellsy_label"] = i["integration_label"];
							} else obj[field] = i[field];
						});
						return obj;
					}
				),
		};

		if (lead.integration_type === LEAD_INTEGRATION_TYPES.SELLSY_CONTACT)
			fetchCustomObjectDetails(body, {
				onSuccess: data => {
					setFields(prev => ({
						...prev,
						[VIEWS_SELLSY.CONTACT]: (() => {
							let obj = { ...(data?.contact ?? data) };
							if (Object.keys(obj).length === 0) return {};
							delete obj._embed;
							data?.contact?._embed
								? data?.contact?._embed.custom_fields?.forEach(
										i => (obj[i?.code] = i?.value)
								  )
								: data?._embed.custom_fields?.forEach(i => (obj[i?.code] = i?.value));
							obj["smart_tags"] =
								data?.contact?._embed?.smart_tags ?? data?._embed?.smart_tags ?? [];
							return obj;
						})(),
						[VIEWS_SELLSY.COMPANY]: (() => {
							let obj = { ...(data?.company ?? {}) };
							if (Object.keys(obj).length === 0) return {};
							delete obj._embed;
							data?.company?._embed &&
								data?.company?._embed.custom_fields?.forEach(
									i => (obj[i?.code] = i?.value)
								);
							obj["smart_tags"] = data?.company?._embed?.smart_tags ?? [];
							return obj;
						})(),
					}));
				},
				onError: err => {
					addError({
						text: err?.response?.data?.msg,
						desc: err?.response?.data?.error,
						cId: err?.response?.data?.correlationId,
					});
					setFields(FIELDS_SELLSY);
				},
			});
	}
};
const fetchCustomZoho = ({
	lead,
	fieldMap,
	form,
	fields,
	setFields,
	addError,
	fetchCustomObjectDetails,
}) => {
	let body;
	if (lead.integration_type === VIEWS_ZOHO.LEAD) {
		body = {
			id: lead.integration_id,
			type: lead.integration_type === "zoho_lead" ? "lead" : "contact",
		};
	} else {
		body = {
			id: lead.integration_id,
			type: lead.integration_type === "zoho_contact" ? "contact" : "lead",
		};
	}

	fetchCustomObjectDetails(body, {
		onSuccess: data => {
			if (lead.integration_type === "zoho_lead") {
				setFields(prev => ({ ...prev, [VIEWS_ZOHO.LEAD]: data }));
			} else {
				fields[VIEWS_ZOHO.CONTACT] = data.contact ?? data;
				fields[VIEWS_ZOHO.ACCOUNT] = data.account ?? data.Account_Name;
				setFields(prev => ({
					...prev,
					[VIEWS_ZOHO.CONTACT]: data.contact ?? data,
					[VIEWS_ZOHO.ACCOUNT]: data.account ?? data.Account_Name,
				}));
			}
		},
		onError: err => {
			addError({
				text: err.response?.data?.msg,
				desc: err?.response?.data?.error || "Please contact support",
				cId: err?.response?.data?.correlationId,
			});
		},
	});
};

const fetchCustomBullhorn = ({
	lead,
	fieldMap,
	fields,
	form,
	setFields,
	addError,
	fetchCustomObjectDetails,
}) => {
	let body;

	body = {
		id: lead.integration_id,
		type:
			lead.integration_type === "bullhorn_contact"
				? "clientContact"
				: lead.integration_type === "bullhorn_lead"
				? "lead"
				: lead.integration_type === "bullhorn_candidate"
				? "candidate"
				: lead.integration_type,
	};

	if (lead.integration_type === LEAD_INTEGRATION_TYPES.BULLHORN_LEAD) {
		body.lead_fields =
			fieldMap?.Company_Setting?.Integration_Field_Map?.lead_custom_object?.[0]?.form
				?.filter(i => i?.bullhorn_endpoint === VIEWS_BULLHORN.LEAD)
				?.map(i => i?.bullhorn_field)
				?.toString();

		if (
			fieldMap?.Company_Setting?.Integration_Field_Map?.lead_custom_object?.[0]?.form?.filter(
				i => i?.bullhorn_endpoint === VIEWS_BULLHORN.CLIENT_CORPORATION
			)?.length > 0
		)
			body.account_fields =
				fieldMap?.Company_Setting?.Integration_Field_Map?.lead_custom_object?.[0]?.form
					?.filter(i => i?.bullhorn_endpoint === VIEWS_BULLHORN.CLIENT_CORPORATION)
					?.map(i => i?.bullhorn_field)
					?.toString();
	}

	if (lead.integration_type === LEAD_INTEGRATION_TYPES.BULLHORN_CONTACT) {
		body.lead_fields =
			fieldMap?.Company_Setting?.Integration_Field_Map?.contact_custom_object?.[0]?.form
				?.filter(i => i?.bullhorn_endpoint === VIEWS_BULLHORN.CLIENT_CONTACT)
				?.map(i => i?.bullhorn_field)
				?.toString();

		if (
			fieldMap?.Company_Setting?.Integration_Field_Map?.contact_custom_object?.[0]?.form?.filter(
				i => i?.bullhorn_endpoint === VIEWS_BULLHORN.CLIENT_CORPORATION
			)?.length > 0
		)
			body.account_fields =
				fieldMap?.Company_Setting?.Integration_Field_Map?.contact_custom_object?.[0]?.form
					?.filter(i => i?.bullhorn_endpoint === VIEWS_BULLHORN.CLIENT_CORPORATION)
					?.map(i => i?.bullhorn_field)
					?.toString();
	}

	if (lead.integration_type === LEAD_INTEGRATION_TYPES.BULLHORN_CANDIDATE) {
		body.lead_fields =
			fieldMap?.Company_Setting?.Integration_Field_Map?.candidate_custom_object?.[0]?.form
				?.filter(i => i?.bullhorn_endpoint === VIEWS_BULLHORN.CANDIDATE)
				?.map(i => i?.bullhorn_field)
				?.toString();
	}

	if (
		lead.integration_type === LEAD_INTEGRATION_TYPES.BULLHORN_LEAD ||
		lead.integration_type === LEAD_INTEGRATION_TYPES.BULLHORN_CONTACT ||
		lead.integration_type === LEAD_INTEGRATION_TYPES.BULLHORN_CANDIDATE
	)
		fetchCustomObjectDetails(body, {
			onSuccess: data => {
				if (lead.integration_type === LEAD_INTEGRATION_TYPES.BULLHORN_LEAD) {
					if (
						Object.keys(data).includes("account") &&
						Object.keys(data).includes("lead")
					) {
						fields[VIEWS_BULLHORN.ACCOUNT] = data[VIEWS_BULLHORN.ACCOUNT];
						fields[VIEWS_BULLHORN.LEAD] = data[VIEWS_BULLHORN.LEAD];
						setFields(prev => ({
							...prev,
							[VIEWS_BULLHORN.LEAD]: data[VIEWS_BULLHORN.LEAD],
							[VIEWS_BULLHORN.ACCOUNT]: data[VIEWS_BULLHORN.ACCOUNT],
						}));
					} else {
						fields[VIEWS_BULLHORN.LEAD] = data[VIEWS_BULLHORN.LEAD] ?? data;
						setFields(prev => ({
							...prev,
							[VIEWS_BULLHORN.LEAD]: data[VIEWS_BULLHORN.LEAD] ?? data,
						}));
					}
				} else if (lead.integration_type === LEAD_INTEGRATION_TYPES.BULLHORN_CONTACT) {
					fields[VIEWS_BULLHORN.CONTACT] = data.contact ?? data;
					fields[VIEWS_BULLHORN.ACCOUNT] = data.account ?? data.Account_Name;
					setFields(prev => ({
						...prev,
						[VIEWS_BULLHORN.CONTACT]: data.contact ?? data,
						[VIEWS_BULLHORN.ACCOUNT]: data.account ?? data.Account_Name,
					}));
				} else {
					fields[VIEWS_BULLHORN.CANDIDATE] = data.candidate ?? data;
					setFields(prev => ({
						...prev,
						[VIEWS_BULLHORN.CANDIDATE]: data.candidate ?? data,
					}));
				}
			},
			onError: err => {
				addError({
					text: err?.response?.data?.msg,
					desc: err?.response?.data?.error,
					cId: err?.response?.data?.correlationId,
				});
			},
		});
};
const fetchCustomDynamics = ({
	lead,
	fieldMap,
	form,
	fields,
	setFields,
	addError,
	fetchCustomObjectDetails,
}) => {
	let body;
	if (lead.integration_id) {
		body = {
			id: lead.integration_id,
			type:
				lead.integration_type === LEAD_INTEGRATION_TYPES.DYNAMICS_LEAD
					? "lead"
					: "contact",
		};
		fetchCustomObjectDetails(body, {
			onSuccess: data => {
				if (lead.integration_type === LEAD_INTEGRATION_TYPES.DYNAMICS_LEAD) {
					setFields(prev => ({ ...prev, [VIEWS_DYNAMICS.LEAD]: data }));
				} else {
					fields[VIEWS_DYNAMICS.CONTACT] = data.contact;
					fields[VIEWS_DYNAMICS.ACCOUNT] = data.account;
					setFields(prev => ({
						...prev,
						[VIEWS_DYNAMICS.CONTACT]: data.contact,
						[VIEWS_DYNAMICS.ACCOUNT]: data.account,
					}));
				}
			},
			onError: err => {
				addError({
					text: err.response?.data?.msg,
					desc: err?.response?.data?.error || "Please contact support",
					cId: err?.response?.data?.correlationId,
				});
				setFields(FIELDS_DYNAMICS);
			},
		});
	}
};
export const buttonFormSet = ({ user, ...rest }) => {
	switch (user?.integration_type) {
		case INTEGRATION_TYPE.SALESFORCE:
			return buttonFormSetSalesforce(rest);
		case INTEGRATION_TYPE.PIPEDRIVE:
			return buttonFormSetPipedrive(rest);
		case INTEGRATION_TYPE.HUBSPOT:
			return buttonFormSetHubspot(rest);
		case INTEGRATION_TYPE.SELLSY:
			return buttonFormSetSellsy(rest);
		case INTEGRATION_TYPE.DYNAMICS:
			return buttonFormSetDynamics(rest);
		case INTEGRATION_TYPE.ZOHO:
			return buttonFormSetZoho(rest);
		case INTEGRATION_TYPE.BULLHORN:
			return buttonFormSetBullhorn(rest);

		default:
			return false;
	}
};
export const fetchCustom = ({ user, ...rest }) => {
	switch (user?.integration_type) {
		case INTEGRATION_TYPE.SALESFORCE:
			return fetchCustomSalesforce(rest);
		case INTEGRATION_TYPE.PIPEDRIVE:
			return fetchCustomPipedrive(rest);
		case INTEGRATION_TYPE.HUBSPOT:
			return fetchCustomHubspot(rest);
		case INTEGRATION_TYPE.SELLSY:
			return fetchCustomSellsy(rest);
		case INTEGRATION_TYPE.ZOHO:
			return fetchCustomZoho(rest);
		case INTEGRATION_TYPE.DYNAMICS:
			return fetchCustomDynamics(rest);
		case INTEGRATION_TYPE.BULLHORN:
			return fetchCustomBullhorn(rest);
		default:
			return false;
	}
};
