import { INTEGRATION_TYPE } from "@cadence-frontend/constants";
import { AuthorizedApi } from "../api";

const CIVILITY_SELLSY = [
	{
		label: "Mr.",
		value: "mr",
	},
	{
		label: "Ms.",
		value: "ms",
	},
	{
		label: "Mrs.",
		value: "mrs",
	},
];
const NUMBER_OF_EMPLOYEES = [
	{ label: "None", value: 0 },
	{ label: "1 to 5", value: 1 },
	{ label: "6 to 10", value: 6 },
	{ label: "11 to 49", value: 11 },
	{ label: "50 or more", value: 51 },
];
export const optionsStrategy = ({ integration_type, trigger }) => {
	switch (integration_type) {
		case INTEGRATION_TYPE.SALESFORCE:
		case INTEGRATION_TYPE.ZOHO:
			return trigger === "when_a_lead_is_added_to_org" ||
				trigger === "when_a_lead_is_updated"
				? [
						"/v2/admin/company-settings/company-field-map/describe/lead",
						"/v2/admin/company-settings/company-field-map/describe/user",
				  ]
				: [
						"/v2/admin/company-settings/company-field-map/describe/contact",
						"/v2/admin/company-settings/company-field-map/describe/user",
						"/v2/admin/company-settings/company-field-map/describe/account",
				  ];
		case INTEGRATION_TYPE.PIPEDRIVE:
			return [
				"/v2/admin/company-settings/company-field-map/describe/person",
				"/v2/admin/company-settings/company-field-map/describe/organization",
				"/v2/admin/company-settings/company-field-map/describe/user",
			];
		case INTEGRATION_TYPE.HUBSPOT:
			return [
				"/v2/admin/company-settings/company-field-map/describe/contact",
				"/v2/admin/company-settings/company-field-map/describe/company",
				"/v2/admin/company-settings/company-field-map/describe/user",
			];
		case INTEGRATION_TYPE.SELLSY:
			return [
				"/v2/admin/company-settings/company-field-map/describe/contact",
				"/v2/admin/company-settings/company-field-map/describe/company",
				"/v2/admin/company-settings/company-field-map/describe/user",
			];
		case INTEGRATION_TYPE.BULLHORN:
			return trigger === "when_a_lead_is_added_to_org" ||
				trigger === "when_a_lead_is_updated"
				? [
						"/v2/admin/company-settings/company-field-map/describe/lead",
						"/v2/admin/company-settings/company-field-map/describe/corporateUser",
						"/v2/admin/company-settings/company-field-map/describe/clientCorporation",
				  ]
				: trigger === "when_a_contact_is_added_to_org" ||
				  trigger === "when_a_contact_is_updated"
				? [
						"/v2/admin/company-settings/company-field-map/describe/clientContact",
						"/v2/admin/company-settings/company-field-map/describe/corporateUser",
						"/v2/admin/company-settings/company-field-map/describe/clientCorporation",
				  ]
				: [
						"/v2/admin/company-settings/company-field-map/describe/candidate",
						"/v2/admin/company-settings/company-field-map/describe/corporateUser",
				  ];
		case INTEGRATION_TYPE.DYNAMICS:
			return trigger === "when_a_lead_is_added_to_org" ||
				trigger === "when_a_lead_is_updated"
				? [
						"/v2/admin/company-settings/company-field-map/describe/lead",
						"/v2/admin/company-settings/company-field-map/describePicklist/lead",
						"/v2/admin/company-settings/company-field-map/describe/systemuser",
						"/v2/admin/company-settings/company-field-map/describePicklist/systemuser",
				  ]
				: [
						"/v2/admin/company-settings/company-field-map/describe/contact",
						"/v2/admin/company-settings/company-field-map/describePicklist/contact",
						"/v2/admin/company-settings/company-field-map/describe/account",
						"/v2/admin/company-settings/company-field-map/describePicklist/account",
						"/v2/admin/company-settings/company-field-map/describe/systemuser",
						"/v2/admin/company-settings/company-field-map/describePicklist/systemuser",
				  ];
	}
};

export const functionStrategy = ({ integration_type, trigger }) => {
	switch (integration_type) {
		case INTEGRATION_TYPE.SALESFORCE:
			return trigger === "when_a_lead_is_added_to_org" ||
				trigger === "when_a_lead_is_updated"
				? res => {
						let totalLeadOptions = [];
						res.forEach((leadoptions, index) => {
							let model_type = index == "0" ? "lead" : "user";
							let option_type = index == "0" ? "Lead" : "User";

							totalLeadOptions = [
								...totalLeadOptions,
								...leadoptions?.data?.data
									?.filter(
										leadoption =>
											leadoption.type !== "multipicklist" &&
											leadoption.type !== "address" &&
											leadoption.type !== "boolean"
									)
									?.map(leadoption => ({
										label: leadoption.label,
										value: `${leadoption.name}.${model_type}`,
										data_type: leadoption.type,
										option_type,
										model_type,
										...(leadoption.type === "picklist" && {
											picklistValues: leadoption.picklistValues.map(i => ({
												label: i?.label,
												value: i?.value,
											})),
										}),
									})),
							];
						});
						return totalLeadOptions;
				  }
				: res => {
						let totalContactOptions = [];
						res.forEach((contactoptions, index) => {
							let model_type = index == "0" ? "lead" : index == "1" ? "user" : "account";
							let option_type =
								index == "0" ? "Contact" : index == "1" ? "User" : "Account";
							totalContactOptions = [
								...totalContactOptions,
								...contactoptions?.data?.data
									?.filter(
										contactoption =>
											contactoption.type !== "multipicklist" &&
											contactoption.type !== "address" &&
											contactoption.type !== "boolean"
									)
									?.map(contactoption => ({
										label: contactoption.label,
										value: `${contactoption.name}.${model_type}`,
										data_type: contactoption.type,
										option_type,
										model_type,
										...(contactoption.type === "picklist" && {
											picklistValues: contactoption.picklistValues.map(i => ({
												label: i?.label,
												value: i?.value,
											})),
										}),
									})),
							];
						});
						return totalContactOptions;
				  };
		case INTEGRATION_TYPE.PIPEDRIVE:
			return res => {
				let totalPersonOptions = [];
				res.forEach((personoptions, index) => {
					let model_type = index == "0" ? "lead" : index == "1" ? "account" : "user";
					let option_type =
						index == "0" ? "Person" : index == "1" ? "Organization" : "User";

					totalPersonOptions = [
						...totalPersonOptions,
						...personoptions?.data?.data?.data
							?.filter(
								personoption =>
									personoption.field_type !== "org" &&
									personoption.field_type !== "address" &&
									personoption.field_type !== "user" &&
									personoption.field_type !== "picture" &&
									personoption.field_type !== "visible_to" &&
									personoption.key !== "email" &&
									personoption.key !== "phone"
							)
							?.map(personoption => ({
								label: personoption.name,
								value: `${personoption.key}.${model_type}`,
								data_type: personoption.field_type,
								option_type,
								model_type,
								...(personoption.field_type === "enum" && {
									picklistValues: personoption.options.map(i => ({
										label: i?.label,
										value: i?.id,
									})),
								}),
							})),
					];
				});
				return totalPersonOptions;
			};
		case INTEGRATION_TYPE.HUBSPOT:
			return res => {
				let totalContactOptions = [];
				res.forEach((contactoptions, index) => {
					let model_type = index == "0" ? "lead" : index == "1" ? "account" : "user";
					let option_type = index == "0" ? "Contact" : index == "1" ? "Company" : "Owner";
					totalContactOptions = [
						...totalContactOptions,
						...contactoptions?.data?.data?.results
							?.filter(
								contactoption =>
									contactoption.type !== "file" && contactoption?.type !== "checkbox"
							)
							?.map(contactoption => {
								let type;
								if (
									contactoption?.type === "date" ||
									contactoption?.type === "datetime" ||
									contactoption?.type === "number"
								) {
									type = contactoption?.type;
								} else if (contactoption?.fieldType === "phonenumber") {
									type = "text";
								} else if (
									contactoption?.type === "enumeration" ||
									contactoption?.type === "string"
								) {
									type = contactoption?.fieldType;
								} else if (contactoption?.type === "bool") {
									type = "booleancheckbox";
								}

								return {
									label: contactoption.label,
									value: `${contactoption.name}.${model_type}`,
									data_type: type,
									option_type,
									model_type,
									...((type === "select" ||
										type === "radio" ||
										type === "booleancheckbox") && {
										picklistValues: contactoption.options.map(i => ({
											label: i?.label,
											value: i?.value,
										})),
									}),
								};
							}),
					];
				});
				return totalContactOptions;
			};
		case INTEGRATION_TYPE.SELLSY:
			return res => {
				let totalContactOptions = [];
				const { contact_fields, custom_fields } = res[0].data?.data;
				const {
					company_fields,
					address_fields,
					custom_fields: custom_fields_company,
				} = res[1].data?.data;

				let contact = [
					...contact_fields.map(item => ({
						...item,
						type:
							item.value === "civility"
								? "select"
								: item.value === "birth_date"
								? "date"
								: item?.type,
						...(item.value === "civility" && {
							options: CIVILITY_SELLSY,
						}),
					})),
					...custom_fields.map(item => ({
						label: item.name,
						value: item.code,
						type: item.type,
						...((item.type === "select" ||
							item.type === "checkbox" ||
							item.type === "radio") && {
							options: item?.parameters?.items?.map(pv => ({
								label: pv?.label,
								value: pv?.id,
							})),
						}),
					})),
				];
				let company = [
					...company_fields.map(item => ({
						...item,
						type: item.value === "number_of_employees.label" ? "select" : item?.type,
						...(item.value === "number_of_employees.label" && {
							options: NUMBER_OF_EMPLOYEES,
						}),
					})),
					...address_fields,
					...custom_fields_company.map(item => ({
						label: item.name,
						value: item.code,
						type: item.type,
						...((item.type === "select" ||
							item.type === "checkbox" ||
							item.type === "radio") && {
							options: item?.parameters?.items?.map(pv => ({
								label: pv?.label,
								value: pv?.id,
							})),
						}),
					})),
				];
				let user = res[2].data.data.map(item => ({
					...item,
					type: item.value === "civility" ? "select" : item?.type,
					...(item.value === "civility" && {
						options: CIVILITY_SELLSY,
					}),
				}));
				let response = [contact, company, user];

				response.forEach((contactoptions, index) => {
					let model_type = index == "0" ? "lead" : index == "1" ? "account" : "user";
					let option_type = index == "0" ? "Contact" : index == "1" ? "Company" : "Owner";
					totalContactOptions = [
						...totalContactOptions,
						...contactoptions
							?.filter(
								contactoption =>
									contactoption.type !== "radio" &&
									contactoption?.type !== "checkbox" &&
									contactoption?.type !== "array" &&
									contactoption?.type !== "boolean" &&
									contactoption?.type !== "time"
							)
							?.map(contactoption => {
								return {
									label: contactoption.label,
									value: `${contactoption.value}.${model_type}`,
									data_type: contactoption.type,
									option_type,
									model_type,
									...(contactoption.type === "select" && {
										picklistValues: contactoption.options,
									}),
								};
							}),
					];
				});
				return totalContactOptions;
			};
		case INTEGRATION_TYPE.ZOHO:
			return trigger === "when_a_lead_is_added_to_org" ||
				trigger === "when_a_lead_is_updated"
				? res => {
						let totalLeadOptions = [];
						res.forEach((leadoptions, index) => {
							let model_type = index == "0" ? "lead" : "user";
							let option_type = index == "0" ? "Lead" : "User";

							totalLeadOptions = [
								...totalLeadOptions,
								...leadoptions?.data?.data
									?.filter(
										leadoption =>
											leadoption.data_type !== "profileimage" &&
											leadoption.data_type !== "ownerlookup" &&
											leadoption.data_type !== "lookup" &&
											leadoption.data_type !== "phone" &&
											leadoption.data_type !== "email" &&
											leadoption.data_type !== "currency" &&
											leadoption.data_type !== "boolean"
									)
									?.map(leadoption => ({
										label: leadoption.display_label,
										value: `${leadoption.api_name}.${model_type}`,
										data_type: leadoption.data_type,
										option_type,
										model_type,
										...(leadoption.data_type === "picklist" && {
											picklistValues: leadoption.pick_list_values.map(i => ({
												label: i?.display_value,
												value: i?.actual_value,
											})),
										}),
									})),
							];
						});
						return totalLeadOptions;
				  }
				: res => {
						let totalContactOptions = [];
						res.forEach((contactoptions, index) => {
							let model_type = index == "0" ? "lead" : index == "1" ? "user" : "account";
							let option_type =
								index == "0" ? "Contact" : index == "1" ? "User" : "Account";
							totalContactOptions = [
								...totalContactOptions,
								...contactoptions?.data?.data
									?.filter(
										contactoption =>
											contactoption.data_type !== "profileimage" &&
											contactoption.data_type !== "ownerlookup" &&
											contactoption.data_type !== "lookup" &&
											contactoption.data_type !== "phone" &&
											contactoption.data_type !== "email" &&
											contactoption.data_type !== "currency" &&
											contactoption.data_type !== "boolean"
									)
									?.map(contactoption => ({
										label: contactoption.display_label,
										value: `${contactoption.api_name}.${model_type}`,
										data_type: contactoption.data_type,
										option_type,
										model_type,
										...(contactoption.data_type === "picklist" && {
											picklistValues: contactoption.pick_list_values.map(i => ({
												label: i?.display_value,
												value: i?.actual_value,
											})),
										}),
									})),
							];
						});
						return totalContactOptions;
				  };
		case INTEGRATION_TYPE.BULLHORN:
			return trigger === "when_a_candidate_is_added_to_org" ||
				trigger === "when_a_candidate_is_updated"
				? res => {
						let totalCandidateOptions = [];
						res.forEach((candidateOptions, index) => {
							let model_type = index == "0" ? "lead" : "user";
							let option_type = index == "0" ? "Candidate" : "User";

							totalCandidateOptions = [
								...totalCandidateOptions,
								...candidateOptions?.data?.data?.fields
									?.filter(
										candidateOption =>
											candidateOption.dataType === "String" ||
											candidateOption.dataType === "Integer" ||
											candidateOption.dataType === "Double" ||
											candidateOption.dataType === "BigDecimal" ||
											candidateOption.dataType === "Timestamp"
									)
									?.map(candidateOption => ({
										label: candidateOption.label,
										value: `${candidateOption.name}.${model_type}`,
										data_type:
											candidateOption.inputType === "SELECT" &&
											candidateOption.options?.length > 0
												? "picklist"
												: candidateOption.dataType === "Timestamp" &&
												  Object.keys(candidateOption).includes("dataSpecialization")
												? candidateOption.dataSpecialization === "SYSTEM"
													? "datetime"
													: candidateOption.dataSpecialization?.toLowerCase()
												: candidateOption.dataType === "Timestamp" &&
												  !Object.keys(candidateOption).includes("dataSpecialization")
												? "datetime"
												: candidateOption.dataType?.toLowerCase(),
										option_type,
										model_type,
										...(candidateOption.inputType === "SELECT" &&
											candidateOption.options?.length > 0 && {
												picklistValues: candidateOption.options
													.filter(i => i?.label?.length > 0 && i?.value?.length > 0)
													.map(i => ({
														label: i?.label,
														value: i?.value,
													})),
											}),
									})),
							];
						});

						return totalCandidateOptions?.filter(item => item.data_type !== "year");
				  }
				: res => {
						let totalLeadOptions = [];
						res.forEach((leadOptions, index) => {
							let model_type = index == "0" ? "lead" : index == "1" ? "user" : "account";
							let option_type;
							if (index == "0") {
								if (
									trigger === "when_a_lead_is_added_to_org" ||
									trigger === "when_a_lead_is_updated"
								)
									option_type = "Lead";
								else option_type = "Contact";
							} else if (index == "1") {
								option_type = "User";
							} else {
								option_type = "Account";
							}
							totalLeadOptions = [
								...totalLeadOptions,
								...leadOptions?.data?.data?.fields
									?.filter(
										leadOption =>
											leadOption.dataType === "String" ||
											leadOption.dataType === "Integer" ||
											leadOption.dataType === "Double" ||
											leadOption.dataType === "BigDecimal" ||
											leadOption.dataType === "Timestamp"
									)
									?.map(leadOption => {
										return {
											label: leadOption.label,
											value: `${leadOption.name}.${model_type}`,
											data_type:
												leadOption.inputType === "SELECT" &&
												leadOption.options?.length > 0
													? "picklist"
													: leadOption.dataType === "Timestamp" &&
													  Object.keys(leadOption).includes("dataSpecialization")
													? leadOption.dataSpecialization === "SYSTEM"
														? "datetime"
														: leadOption.dataSpecialization?.toLowerCase()
													: leadOption.dataType === "Timestamp" &&
													  !Object.keys(leadOption).includes("dataSpecialization")
													? "datetime"
													: leadOption.dataType?.toLowerCase(),
											option_type,
											model_type,
											...(leadOption.inputType === "SELECT" &&
												leadOption.options?.length > 0 && {
													picklistValues: leadOption.options
														.filter(i => i?.label?.length > 0 && i?.value?.length > 0)
														.map(i => ({
															label: i?.label,
															value: i?.value,
														})),
												}),
										};
									}),
							];
						});

						return totalLeadOptions?.filter(item => item.data_type !== "year");
				  };

		case INTEGRATION_TYPE.DYNAMICS:
			return trigger === "when_a_lead_is_added_to_org" ||
				trigger === "when_a_lead_is_updated"
				? res => {
						const response = [
							[...res[0]?.data.data, ...res[1]?.data.data],
							[...res[2]?.data.data, ...res[3]?.data.data],
						];
						let totalLeadOptions = [];
						response.forEach((leadoption, index) => {
							let model_type = index == "0" ? "lead" : "user";
							let option_type = index == "0" ? "Lead" : "User";
							totalLeadOptions = [
								...totalLeadOptions,
								...leadoption
									.filter(
										item =>
											item?.AttributeType !== "Virtual" &&
											item?.AttributeType !== "Lookup" &&
											item?.AttributeType !== "Boolean" &&
											item?.AttributeType !== "Customer" &&
											item?.AttributeType !== "Entityname" &&
											item?.AttributeType !== "Owner" &&
											item?.AttributeType !== "State" &&
											item?.AttributeType !== "Status" &&
											item?.AttributeType !== "Uniqueidentifier"
									)
									?.map(leadoption => {
										return {
											label:
												leadoption?.DisplayName?.LocalizedLabels?.[0]?.Label ??
												leadoption?.SchemaName,
											value: `${leadoption?.LogicalName}.${model_type}`,
											data_type: leadoption?.AttributeType?.toLowerCase(),
											option_type,
											model_type,
											...(leadoption?.AttributeType?.toLowerCase() === "picklist" && {
												picklistValues:
													res[1]?.data?.data
														?.find(i => i?.LogicalName === leadoption?.LogicalName)
														?.OptionSet.Options.map(pv => ({
															label: pv?.Label.LocalizedLabels?.[0]?.Label,
															value: (pv?.Value).toString(),
														})) ||
													res[3]?.data?.data
														?.find(i => i?.LogicalName === leadoption?.LogicalName)
														?.OptionSet.Options.map(pv => ({
															label: pv?.Label.LocalizedLabels?.[0]?.Label,
															value: (pv?.Value).toString(),
														})),
											}),
										};
									})
									.filter(item => item.label && item.data_type),
							];
						});
						// index = 0 => lead
						// index = 1 => lead Picklist
						// index = 3 => user
						return totalLeadOptions;
				  }
				: res => {
						// index = 0 => contact
						// index = 1 => contact Picklist
						// index = 2 => account
						// index = 3 => account Picklist
						// index = 4 => User
						const response = [
							[...res[0]?.data.data, ...res[1]?.data.data],
							[...res[2]?.data.data, ...res[3]?.data.data],
							[...res[4]?.data.data, ...res[5]?.data?.data],
						];

						let totalContactOptions = [];
						response.forEach((contactoption, index) => {
							let model_type =
								index == "0" ? "contact" : index == "1" ? "account" : "user";
							let option_type =
								index == "0" ? "Contact" : index == "1" ? "Account" : "User";
							totalContactOptions = [
								...totalContactOptions,
								...contactoption
									.filter(
										item =>
											item?.AttributeType !== "Virtual" &&
											item?.AttributeType !== "Lookup" &&
											item?.AttributeType !== "Boolean" &&
											item?.AttributeType !== "Customer" &&
											item?.AttributeType !== "Entityname" &&
											item?.AttributeType !== "Owner" &&
											item?.AttributeType !== "State" &&
											item?.AttributeType !== "Status" &&
											item?.AttributeType !== "Uniqueidentifier"
									)
									.map(contactoption => {
										return {
											label:
												contactoption?.DisplayName?.LocalizedLabels?.[0]?.Label ??
												contactoption?.SchemaName,
											value: `${contactoption?.LogicalName}.${model_type}`,
											data_type: contactoption?.AttributeType?.toLowerCase(),
											option_type,
											model_type,
											...(contactoption?.AttributeType?.toLowerCase() === "picklist" && {
												picklistValues:
													res[1]?.data?.data
														?.find(i => i?.LogicalName === contactoption?.LogicalName)
														?.OptionSet.Options.map(pv => ({
															label: pv?.Label.LocalizedLabels?.[0]?.Label,
															value: (pv?.Value).toString(),
														})) ||
													res[3]?.data?.data
														?.find(i => i?.LogicalName === contactoption?.LogicalName)
														?.OptionSet.Options.map(pv => ({
															label: pv?.Label.LocalizedLabels?.[0]?.Label,
															value: (pv?.Value).toString(),
														})) ||
													res[5]?.data?.data
														?.find(i => i?.LogicalName === contactoption?.LogicalName)
														?.OptionSet.Options.map(pv => ({
															label: pv?.Label.LocalizedLabels?.[0]?.Label,
															value: (pv?.Value).toString(),
														})),
											}),
										};
									})
									.filter(item => item.label && item.data_type),
							];
						});
						return totalContactOptions;
				  };
	}
};
