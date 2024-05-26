import { AuthorizedApi } from "../api";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { INTEGRATION_TYPE, ROLES } from "@cadence-frontend/constants";
import {
	getFetchLeadURL,
	fetchIntegrationObjectStrategy,
	getFetchAccountURL,
	fieldMapStrategy,
	fetchUserWithActiveTokenStrategy,
} from "./useSettings.strategy";
const KEY = "settings";
const user = JSON.parse(localStorage.getItem("userInfo"))?.userInfo ?? {};
const SETTING_ID_TYPES = {
	"automated-task-settings": "at_settings_id",
	"unsubscribe-mail-settings": "unsubscribe_settings_id",
	"bounced-mail-settings": "bounced_settings_id",
	"task-settings": "task_settings_id",
	"skip-settings": "skip_settings_id",
	"lead-score-settings": "ls_settings_id",
};

const useSettings = ({ role, enabled = true }) => {
	const isAdmin = role === ROLES.ADMIN || role === ROLES.SUPER_ADMIN;

	//Get settings
	const fetchSettings = async () => {
		let URL = "";
		if (isAdmin) URL = "/v2/admin/company-settings/";
		else URL = "/v2/sales/sub-department/settings";

		return await AuthorizedApi.get(URL).then(res => res.data.data);
	};

	const {
		data: settings,
		isLoading: settingsLoading,
		refetch,
	} = useQuery(KEY, fetchSettings, {
		enabled,
		refetchOnMount: false,
		refetchOnReconnect: false,
	});

	//update settings
	const updateSettingsApi = async settings => {
		let URL = "";
		switch (role) {
			case ROLES.ADMIN:
			case ROLES.SUPER_ADMIN:
				URL = "/v2/admin/company-settings/";
				break;
			default:
				URL = "/v2/sales/sub-department/settings";
				break;
		}

		return await AuthorizedApi.patch(URL, settings);
	};

	const { mutate: updateSettings, isLoading: updateLoading } = useMutation(
		updateSettingsApi,
		{
			onSuccess: () => {
				refetch();
			},
		}
	);

	const createExceptionApi = ({ type, body }) => {
		let URL = "";
		if (isAdmin) URL = `/v2/admin/company-settings/${type}`;
		else URL = `/v2/sales/sub-department/settings/${type}`;
		return AuthorizedApi.post(URL, body).then(res => res.data);
	};

	const { mutate: createException, isLoading: createExceptionLoading } = useMutation(
		createExceptionApi,
		{
			onSuccess: () => {
				refetch();
			},
		}
	);

	const updateExceptionApi = ({ type, body }) => {
		const id = SETTING_ID_TYPES[type];
		let URL = "";
		if (isAdmin) URL = `/v2/admin/company-settings/${type}/${body[id]}`;
		else URL = `/v2/sales/sub-department/settings/${type}/${body[id]}`;
		return AuthorizedApi.patch(URL, body).then(res => res.data);
	};

	const { mutate: updateException, isLoading: updateExceptionLoading } = useMutation(
		updateExceptionApi,
		{
			onSuccess: () => {
				refetch();
			},
		}
	);

	const deleteExceptionApi = ({ type, id }) => {
		let URL = "";
		if (isAdmin) URL = `/v2/admin/company-settings/${type}/${id}`;
		else URL = `/v2/sales/sub-department/settings/${type}/${id}`;
		return AuthorizedApi.delete(URL).then(res => res.data);
	};

	const { mutate: deleteException, isLoading: deleteExceptionLoading } = useMutation(
		deleteExceptionApi,
		{
			onSuccess: () => {
				refetch();
			},
		}
	);

	//admin settings for custom domains
	//validate
	const validateCustomDomainApi = () => {
		let URL = "/v2/admin/company-settings/custom-domain-settings/validate";
		return AuthorizedApi.get(URL);
	};

	const { mutateAsync: validateDomain } = useMutation(validateCustomDomainApi);

	// Update email type integration

	const emailTypeUpdateApi = body => {
		let url = "/v2/admin/company-settings/mail-integration-type";
		return AuthorizedApi.patch(url, body).then(res => res.data);
	};

	const queryClient = useQueryClient();

	const {
		mutate: updateEmailType,
		isLoading: emailTypeUpdateLoading,
		status: emailUpdatingStatus,
	} = useMutation(emailTypeUpdateApi, {
		onSuccess: () => {
			queryClient.invalidateQueries("user");
		},
	});

	//add
	const addCustomDomainApi = body => {
		let URL = "/v2/admin/company-settings/custom-domain-settings";
		return AuthorizedApi.post(URL, body).then(res => res.data);
	};

	const { mutate: addCustomDomain, isLoading: addCustomDomainLoading } = useMutation(
		addCustomDomainApi,
		{
			onSuccess: () => refetch(),
		}
	);

	//update
	const updateCustomDomainApi = body => {
		let URL = "/v2/admin/company-settings/custom-domain-settings";
		return AuthorizedApi.patch(URL, body).then(res => res.data);
	};

	const { mutate: updateCustomDomain, isLoading: updateCustomDomainLoading } =
		useMutation(updateCustomDomainApi, {
			onSuccess: () => refetch(),
		});

	//delete
	const deleteCustomDomainApi = body => {
		let URL = "/v2/admin/company-settings/custom-domain-settings";
		return AuthorizedApi.delete(URL, body).then(res => res.data);
	};

	const { mutate: deleteCustomDomain, isLoading: deleteCustomDomainLoading } =
		useMutation(deleteCustomDomainApi, {
			onSuccess: () => refetch(),
		});

	//get salesforce fields
	const getRingoverMatchFieldsApi = () => {
		let URL = "/v2/admin/company-settings/company-field-map";
		return AuthorizedApi.get(URL).then(res => res.data?.data);
	};

	const { mutate: fetchRingoverFieldsMutate, isLoading: ringoverMatchFieldsLoading } =
		useMutation(getRingoverMatchFieldsApi);

	const getRingoverMatchFieldsApiExtension = () => {
		let URL = "/v2/admin/company-settings/extension-field-map";
		return AuthorizedApi.get(URL).then(res => res.data?.data);
	};

	const {
		mutate: fetchRingoverFieldsMutateExtension,
		isLoading: ringoverMatchFieldsLoadingExtension,
	} = useMutation(getRingoverMatchFieldsApiExtension);

	const updateRingoverMatchFieldsApi = body => {
		// console.log(body);
		let URL = "/v2/admin/company-settings/company-field-map/all";
		return AuthorizedApi.post(URL, body).then(res => res.data);
	};
	const {
		mutate: updateRingoverMatchFields,
		isLoading: updateRingoverMatchFieldsLoading,
	} = useMutation(updateRingoverMatchFieldsApi);

	const updateRingoverMatchFieldsApiExtension = body => {
		// console.log(body);
		let URL = "/v2/admin/company-settings/extension-field-map/all";
		return AuthorizedApi.post(URL, body).then(res => res.data);
	};

	const {
		mutate: updateRingoverMatchFieldsExtension,
		isLoading: updateRingoverMatchFieldsLoadingExtension,
	} = useMutation(updateRingoverMatchFieldsApiExtension);

	//get SF fields
	//Lead
	const getLeadFieldsApi = type => {
		let URL = getFetchLeadURL({
			integration_type: user?.integration_type,
		});
		return user?.integration_type === INTEGRATION_TYPE.DYNAMICS
			? Promise.all(URL.map(option => AuthorizedApi.get(option))).then(res =>
					fetchIntegrationObjectStrategy({
						integration_type: user?.integration_type,
						res,
					})
			  )
			: AuthorizedApi.get(URL).then(res =>
					fetchIntegrationObjectStrategy({
						integration_type: user?.integration_type,
						res,
					})
			  );
	};

	const { mutate: fetchLeadFieldsMutate, isLoading: fetchLeadFieldsLoading } =
		useMutation(getLeadFieldsApi);

	//For bullhorn only
	const getCandidateSfFieldsApi = type => {
		let URL = `/v2/admin/company-settings/company-field-map/describe/candidate`;
		return AuthorizedApi.get(URL).then(res =>
			res.data.data.fields
				?.filter(
					item =>
						Object.keys(item).includes("dataType") &&
						item.dataType !== "Address" &&
						item.dataType !== "SecondaryAddress" &&
						item.dataType !== "OnboardingReceivedSent" &&
						item.dataType !== "BillingAddress"
				)
				.filter(l =>
					l.dataType === "Timestamp"
						? Object.keys(l).includes("dataSpecialization") &&
						  l.dataSpecialization !== "SYSTEM"
						: true
				)
				.map(item => {
					const obj = {
						name: item.name,
						label: item.label,
						type:
							Object.keys(item).includes("inputType") &&
							Object.keys(item).includes("options")
								? "picklist"
								: "string",
						...(Object.keys(item).includes("inputType") &&
							Object.keys(item).includes("options") && {
								picklist_values: item.options?.map(item => ({
									value: item.value,
									label: item.label,
								})),
							}),
						dataType:
							item.dataType === "Timestamp" ? item.dataSpecialization : item.dataType,
						editable: item.readOnly === false,
					};

					return obj;
				})
		);
	};

	const { mutate: fetchCondidateSfFieldsApi, isLoading: fetchCondidateFieldsLoading } =
		useMutation(getCandidateSfFieldsApi);

	//contact
	const getContactSfFieldsApi = type => {
		let URL = `/v2/admin/company-settings/company-field-map/describe/${
			user.integration_type === "bullhorn" ? "clientContact" : "contact"
		}`;
		return user?.integration_type === INTEGRATION_TYPE.DYNAMICS
			? Promise.all([
					AuthorizedApi.get(
						"/v2/admin/company-settings/company-field-map/describe/contact"
					),
					AuthorizedApi.get(
						"/v2/admin/company-settings/company-field-map/describePicklist/contact"
					),
			  ]).then(res =>
					fetchIntegrationObjectStrategy({
						integration_type: user?.integration_type,
						res,
					})
			  )
			: AuthorizedApi.get(URL).then(res =>
					fetchIntegrationObjectStrategy({
						integration_type: user?.integration_type,
						res,
					})
			  );
	};

	const { mutate: fetchContactSfFieldsMutate, isLoading: fetchContactSfFieldsLoading } =
		useMutation(getContactSfFieldsApi);

	//account
	const getAccountFieldsApi = type => {
		let URL = getFetchAccountURL({
			integration_type: user?.integration_type,
		});
		return user?.integration_type === INTEGRATION_TYPE.DYNAMICS
			? Promise.all(URL.map(option => AuthorizedApi.get(option))).then(res =>
					fetchIntegrationObjectStrategy({
						integration_type: user?.integration_type,
						res,
					})
			  )
			: AuthorizedApi.get(URL).then(res =>
					fetchIntegrationObjectStrategy({
						integration_type: user?.integration_type,
						res,
					})
			  );
	};

	const { mutate: fetchAccountFieldsMutate, isLoading: fetchAccountFieldsLoading } =
		useMutation(getAccountFieldsApi);

	//PIPEDRIVE
	//Person
	const getPersonPdFieldsApi = type => {
		let URL = `/v2/admin/company-settings/company-field-map/describe/person`;
		return AuthorizedApi.get(URL).then(res =>
			res.data?.data?.data?.map(item => {
				const obj = {
					name: item.key,
					label: item.name,
					type: item.field_type,
					editable: item.bulk_edit_allowed ?? false,
				}; //setting defaultType to string
				if (obj.type === "enum")
					obj.picklist_values = item.options.map(pv => ({
						label: pv?.label,
						value: JSON.stringify(pv?.id),
					}));
				return obj;
			})
		);
	};

	const { mutate: fetchPersonPdFieldsMutate, isLoading: fetchPersonPdFieldsLoading } =
		useMutation(getPersonPdFieldsApi);

	//Organization
	const getOrganizationPdFieldsApi = type => {
		let URL = `/v2/admin/company-settings/company-field-map/describe/organization`;
		return AuthorizedApi.get(URL).then(res =>
			res.data?.data?.data?.map(item => {
				const obj = {
					name: item.key,
					label: item.name,
					type: item.field_type,
					editable: item.bulk_edit_allowed ?? false,
				}; //setting defaultType to string
				if (obj.type === "enum")
					obj.picklist_values = item.options.map(pv => ({
						label: pv?.label,
						value: JSON.stringify(pv?.id),
					}));
				return obj;
			})
		);
	};
	const {
		mutate: fetchOrganizationPdFieldsMutate,
		isLoading: fetchOrganizationPdFieldsLoading,
	} = useMutation(getOrganizationPdFieldsApi);

	//HUBSPOT
	//Contact
	const getContactHpApi = type => {
		let URL = `/v2/admin/company-settings/company-field-map/describe/contact`;
		return AuthorizedApi.get(URL).then(res =>
			res.data?.data?.results?.map(item => {
				const obj = {
					name: item.name,
					label: item.label,
					type: item.type,
					editable: !item.modificationMetadata?.readOnlyValue,
				}; //setting defaultType to string
				if (obj.type === "enumeration")
					obj.picklist_values = item.options.map(pv => ({
						label: pv?.label,
						value: pv?.value,
					}));
				return obj;
			})
		);
	};

	const { mutate: fetchContactHpFieldsMutate, isLoading: fetchContactHpFieldsLoading } =
		useMutation(getContactHpApi);

	//Company
	const getCompanyHpApi = type => {
		let URL = `/v2/admin/company-settings/company-field-map/describe/company`;
		return AuthorizedApi.get(URL).then(res =>
			res.data?.data?.results?.map(item => {
				const obj = {
					name: item.name,
					label: item.label,
					type: item.type,
					editable: !item.modificationMetadata?.readOnlyValue,
				}; //setting defaultType to string
				if (obj.type === "enumeration")
					obj.picklist_values = item.options.map(pv => ({
						label: pv?.label,
						value: pv?.value,
					}));
				return obj;
			})
		);
	};
	const { mutate: fetchCompanyHpFieldsMutate, isLoading: fetchCompanyHpFieldsLoading } =
		useMutation(getCompanyHpApi);

	//SELLSY
	//Contact
	const getContactSellsyApi = type => {
		let URL_CONTACT = `/v2/admin/company-settings/company-field-map/describe/contact`;
		return AuthorizedApi.get(URL_CONTACT).then(res => {
			const { contact_fields, custom_fields } = res.data?.data;
			let sellsy_fields = [];
			contact_fields?.forEach(cField => {
				const obj = {
					name: cField?.value,
					label: cField?.label,
					type: cField?.type,
					editable: cField?.editable ?? true,
				};
				sellsy_fields.push(obj);
			});

			custom_fields?.forEach(cField => {
				const obj = {
					name: cField?.code,
					label: cField?.name,
					type: cField?.type,
				};
				if (obj.type === "select" || obj.type === "checkbox" || obj.type === "radio")
					obj.picklist_values = cField?.parameters?.items?.map(pv => ({
						label: pv?.label,
						value: pv?.id,
					}));
				sellsy_fields.push(obj);
			});

			return sellsy_fields;
		});
	};
	const {
		mutate: fetchContactSellsyFieldsMutate,
		isLoading: fetchContactSellsyFieldsLoading,
	} = useMutation(getContactSellsyApi);

	//Company
	const getCompanySellsyApi = type => {
		let URL_COMPANY = `/v2/admin/company-settings/company-field-map/describe/company`;
		return AuthorizedApi.get(URL_COMPANY).then(res => {
			const { company_fields, custom_fields, address_fields } = res.data?.data;
			let sellsy_fields = [];
			company_fields?.forEach(cField => {
				const obj = {
					name: cField?.value,
					label: cField?.label,
					type: cField?.type,
					editable: cField?.editable ?? true,
				};
				sellsy_fields.push(obj);
			});
			address_fields?.forEach(cField => {
				const obj = {
					name: cField?.value,
					label: cField?.label,
					type: cField?.type,
				};
				sellsy_fields.push(obj);
			});
			custom_fields?.forEach(cField => {
				const obj = {
					name: cField?.code,
					label: cField?.name,
					type: cField?.type,
				};
				if (obj.type === "select" || obj.type === "checkbox" || obj.type === "radio")
					obj.picklist_values = cField?.parameters?.items?.map(pv => ({
						label: pv?.label,
						value: pv?.id,
					}));
				sellsy_fields.push(obj);
			});

			return sellsy_fields;
		});
	};

	const {
		mutate: fetchCompanySellsyFieldsMutate,
		isLoading: fetchCompanySellsyFieldsLoading,
	} = useMutation(getCompanySellsyApi);

	//test fields
	const testFieldsApi = ({ body, type }) => {
		let URL = `/v2/admin/company-settings/company-field-map/${type}/test`;
		return AuthorizedApi.post(URL, body).then(res => ({
			...res.data?.data,
			...(res.data?.data?.Account ? res.data?.data?.Account : res.data?.data?.account),
		}));
	};

	const { mutate: fetchTestFields, isLoading: fetchTestFieldsLoading } =
		useMutation(testFieldsApi);

	//fetch all admins and superadmins
	const fetchAdminSuperAdminsApi = () => {
		let URL = `/v2/admin/company-settings/admins`;
		return AuthorizedApi.get(URL).then(res => res.data?.data);
	};

	const { mutate: fetchAdminSuperAdmins, isLoading: fetchAdminSuperAdminsLoading } =
		useMutation(fetchAdminSuperAdminsApi);

	//fetch the user with active sf token
	const fetchUserWithActiveSFTokenApi = () => {
		let URL = `/v2/admin/company-settings/crm-user`;
		return AuthorizedApi.get(URL).then(res => res.data?.data);
	};

	const {
		mutate: fetchUserWithActiveSFToken,
		isLoading: fetchUserWithActiveSFTokenLoading,
	} = useMutation(fetchUserWithActiveSFTokenApi);

	//fetch the user with active sf token
	const fetchUserWithActiveTokenApi = () => {
		let URL = `/v2/admin/company-settings/crm-user`;
		return AuthorizedApi.get(URL).then(res =>
			fetchUserWithActiveTokenStrategy({
				data: res.data?.data,
				integration_type: user.integration_type,
			})
		);
	};

	const { mutate: fetchUserWithActiveToken, isLoading: fetchUserWithActiveTokenLoading } =
		useMutation(fetchUserWithActiveTokenApi);

	//update sf token by passing user_Id in body
	const updateUserWithActiveSFTokenApi = body => {
		let URL = `/v2/admin/company-settings/crm-user`;
		return AuthorizedApi.patch(URL, body).then(res => res.data?.data);
	};

	const {
		mutate: updateUserWithActiveSFToken,
		isLoading: updateUserWithActiveSFTokenLoading,
	} = useMutation(updateUserWithActiveSFTokenApi);

	//get salesforce fields
	const fetchSfMapApi = () => {
		let URL = "/v2/sales/department/salesforce-field-map";
		return AuthorizedApi.get(URL).then(res => {
			return fieldMapStrategy({
				integration_type: user?.integration_type,
				data: res?.data?.data,
			});
		});
	};

	const { mutate: fetchSfMap, isLoading: fetchSfMapLoading } = useMutation(fetchSfMapApi);

	//update company settings

	const updateCompanySettingsApi = ({ companyId, data }) => {
		let URL = `/v1/admin/company-settings/${companyId}`;
		return AuthorizedApi.put(URL, data).then(res => res.data);
	};

	const { mutate: updateCompanySettings, isLoading: updateCompanySettingsLoading } =
		useMutation(updateCompanySettingsApi, {
			onSuccess: () => queryClient.invalidateQueries(KEY),
		});

	const dataCenterApi = body => {
		let URL = `v2/oauth/zoho/data-center`;
		return body.dataCenter && AuthorizedApi.post(URL, body).then(res => res.data);
	};

	const { mutate: updateDataCenter, isLoading: dataCenterLoading } = useMutation(
		dataCenterApi,
		{
			onSettled: () => {
				queryClient.invalidateQueries("user");
			},
		}
	);

	// Email Scope level

	const emailScopeApi = body => {
		return AuthorizedApi.put(`v2/admin/company-settings/email-scope`, body).then(
			res => res.data
		);
	};

	const { mutate: emailScopeUpdate, isLoading: emailScopeLoading } =
		useMutation(emailScopeApi);

	return {
		settings,
		settingsLoading,
		refetch,
		updateSettings,
		updateLoading,
		createException,
		updateException,
		deleteException,
		createExceptionLoading,
		updateExceptionLoading,
		deleteExceptionLoading,
		emailTypeUpdateLoading,
		updateEmailType,
		emailUpdatingStatus,

		//customDomain
		//add
		addCustomDomain,
		addCustomDomainLoading,
		//update
		updateCustomDomain,
		updateCustomDomainLoading,
		//delete
		deleteCustomDomain,
		deleteCustomDomainLoading,
		// validate custom domains
		validateDomain,
		//ringover fields
		fetchRingoverFieldsMutate,
		ringoverMatchFieldsLoading,
		fetchRingoverFieldsMutateExtension,
		ringoverMatchFieldsLoadingExtension,
		updateRingoverMatchFields,
		updateRingoverMatchFieldsLoading,
		updateRingoverMatchFieldsExtension,
		updateRingoverMatchFieldsLoadingExtension,
		//lead pd
		fetchPersonPdFieldsMutate,
		fetchPersonPdFieldsLoading,
		//contact pd
		fetchOrganizationPdFieldsMutate,
		fetchOrganizationPdFieldsLoading,
		//contact Hp
		fetchContactHpFieldsMutate,
		fetchContactHpFieldsLoading,
		//company hp
		fetchCompanyHpFieldsMutate,
		fetchCompanyHpFieldsLoading,
		//contact sellsy
		fetchContactSellsyFieldsMutate,
		fetchContactSellsyFieldsLoading,
		//Company sellsy
		fetchCompanySellsyFieldsMutate,
		fetchCompanySellsyFieldsLoading,
		//test fields
		fetchTestFields,
		fetchTestFieldsLoading,
		//fetch admins and super admins
		fetchAdminSuperAdmins,
		fetchAdminSuperAdminsLoading,
		//fetch user whose sf token is being used currently
		fetchUserWithActiveSFToken,
		fetchUserWithActiveSFTokenLoading,
		fetchUserWithActiveToken,
		fetchUserWithActiveTokenLoading,
		//update user whose sf token will be used
		updateUserWithActiveSFToken,
		updateUserWithActiveSFTokenLoading,
		//using to fetch sf map for company size and all
		fetchSfMap,
		fetchSfMapLoading,
		//update company settings
		updateCompanySettings,
		updateCompanySettingsLoading,

		//lead sf
		fetchLeadFieldsMutate,
		fetchLeadFieldsLoading,
		//contact sf
		fetchContactSfFieldsMutate,
		fetchContactSfFieldsLoading,
		//account sf
		fetchAccountFieldsMutate,
		fetchAccountFieldsLoading,

		// bullhorn condidate field
		fetchCondidateSfFieldsApi,
		fetchCondidateFieldsLoading,

		//data center
		updateDataCenter,
		dataCenterLoading,

		// Email scope level
		emailScopeUpdate,
		emailScopeLoading,
	};
};

export default useSettings;
