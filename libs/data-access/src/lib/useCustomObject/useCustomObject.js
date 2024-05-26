import { AuthorizedApi } from "../api";
import { useMutation, useQuery } from "react-query";
import {
	getDescribeLeadURL,
	getDescribeAccountURL,
	describeLeadStrategy,
	describeAccountStrategy,
	customObjStrategy,
	getCustomObjectDetailsURL,
	customObjectDetailsStrategy,
} from "./useCustomObject.strategy";
import { INTEGRATION_TYPE } from "@cadence-frontend/constants";
import { inputDataTypeDynamics } from "./constant";

const user = JSON.parse(localStorage.getItem("userInfo"))?.userInfo ?? {};

const useCustomObject = (enabled = false) => {
	//Get Lead fields

	const getRingoverMatchFieldsApi = () => {
		let URL = "/v2/admin/company-settings/company-field-map";
		return AuthorizedApi.get(URL).then(res => res.data?.data);
	};
	const {
		data: customObj,
		refetch: fetchCustomObject,
		error: customObjectError,
	} = useQuery("customObject", getRingoverMatchFieldsApi, {
		refetch: true,
		enabled: enabled,
	});

	const setTestApi = body => {
		return AuthorizedApi.post(
			"/v2/admin/company-settings/company-field-map/custom-object/test",
			body
		);
	};
	const { mutate: setTest, isLoading: setTestLoading } = useMutation(setTestApi);

	const setCustomObjectDataApi = body => {
		return AuthorizedApi.post("/v2/sales/lead/custom-object", body);
	};
	const { mutate: setCustomObject, isLoading: setCustomObjectLoading } =
		useMutation(setCustomObjectDataApi);

	const setCustomObjectApi = body => {
		return AuthorizedApi.post(
			"/v2/admin/company-settings/company-field-map/custom-object",
			body
		);
	};
	const { mutate: setCustomObjectForm, isLoading: setCustomObjectFormLoading } =
		useMutation(setCustomObjectApi, {
			onSuccess: () => {
				fetchCustomObject();
			},
		});

	/**
	 * Lead Object for frontend:
	 * 1. Salesforce lead is a lead
	 * 2. Pipedrive person will also be treated as a lead
	 * 3. Hubspot Contact will also be treated as a lead
	 *  */
	const getLeadFields = () =>
		user?.integration_type === INTEGRATION_TYPE.DYNAMICS
			? Promise.all(
					getDescribeLeadURL({
						integration_type: user?.integration_type,
					}).map(option => AuthorizedApi.get(option))
			  ).then(res =>
					describeLeadStrategy({
						integration_type: user?.integration_type,
						res,
					})
			  )
			: AuthorizedApi.get(
					getDescribeLeadURL({
						integration_type: user?.integration_type,
					})
			  ).then(res =>
					describeLeadStrategy({
						integration_type: user?.integration_type,
						res,
					})
			  );

	const { mutate: fetchLeadFields, isLoading: leadFieldsLoading } =
		useMutation(getLeadFields);

	/* DYNAMICS LEAD */
	/**
	 *  Get Contact fields
	 * 	Contacts: Salesforce Contacts
	 * */
	const getContactFields = () =>
		AuthorizedApi.get(
			"/v2/admin/company-settings/company-field-map/describe/contact"
		).then(res =>
			res?.data.data.map(item => {
				let obj = {
					name: item.name,
					label: item.label,
					type: item.type,
					editable: item.updateable,
				};
				if (obj.type === "picklist" || obj.type === "multipicklist")
					obj.picklistValues = item.picklistValues;
				if (obj.type === "reference") {
					obj.reference_to = item.referenceTo;
				}
				return obj;
			})
		);

	const { mutate: fetchContactFields, isLoading: contactFieldsLoading } =
		useMutation(getContactFields);

	/**ZOHO */
	const getContactZohoFields = () =>
		AuthorizedApi.get(
			"/v2/admin/company-settings/company-field-map/describe/contact"
		).then(res =>
			res?.data.data.map(item => {
				let obj = {
					name: item.api_name,
					label: item.display_label,
					type: item.data_type,
					editable: item.allowed_permissions_to_update.read_write,
					types: item.json_type,
				};
				if (obj.type === "picklist" || obj.type === "multipicklist")
					obj.picklistValues = item.pick_list_values;
				return obj;
			})
		);

	const { mutate: fetchContactZohoFields, isLoading: contactZohoFieldsLoading } =
		useMutation(getContactZohoFields);

	/** HUBSPOT **/
	const getContactHpApi = type => {
		let URL = `/v2/admin/company-settings/company-field-map/describe/contact`;
		return AuthorizedApi.get(URL).then(res =>
			res.data?.data?.results?.map(item => {
				const obj = {
					name: item.name,
					label: item.label,
					editable: !item.modificationMetadata.readOnlyValue,
				}; //setting defaultType to string
				if (
					item?.type === "date" ||
					item?.type === "datetime" ||
					item?.type === "number"
				) {
					obj.type = item?.type;
				} else if (item?.fieldType === "phonenumber") {
					obj.type = "text";
				} else if (item?.type === "enumeration" || item?.type === "string") {
					obj.type = item?.fieldType;
				} else if (item?.type === "bool") {
					obj.type = "booleancheckbox";
				}
				if (
					obj.type === "select" ||
					obj.type === "checkbox" ||
					obj.type === "radio" ||
					obj.type === "booleancheckbox"
				)
					obj.picklist_values = item.options.map(pv => ({
						label: pv?.label,
						value: pv?.value,
					}));
				return obj;
			})
		);
	};

	const { mutate: fetchContactHpFields, isLoading: fetchContactHpFieldsLoading } =
		useMutation(getContactHpApi);

	const getCompanyHpApi = type => {
		let URL = `/v2/admin/company-settings/company-field-map/describe/company`;
		return AuthorizedApi.get(URL).then(res =>
			res.data?.data?.results?.map(item => {
				const obj = {
					name: item.name,
					label: item.label,
					editable: !item.modificationMetadata.readOnlyValue,
				}; //setting defaultType to string
				if (
					item?.type === "date" ||
					item?.type === "datetime" ||
					item?.type === "number"
				) {
					obj.type = item?.type;
				} else if (item?.fieldType === "phonenumber") {
					obj.type = "text";
				} else if (item?.type === "enumeration" || item?.type === "string") {
					obj.type = item?.fieldType;
				} else if (item?.type === "bool") {
					obj.type = "booleancheckbox";
				}
				if (
					obj.type === "select" ||
					obj.type === "checkbox" ||
					obj.type === "radio" ||
					obj.type === "booleancheckbox"
				)
					obj.picklist_values = item.options.map(pv => ({
						label: pv?.label,
						value: pv?.value,
					}));
				return obj;
			})
		);
	};

	const { mutate: fetchCompanyHpFields, isLoading: fetchCompanyHpFieldsLoading } =
		useMutation(getCompanyHpApi);

	/** PIPEDRIVE **/
	const getPersonFields = () =>
		AuthorizedApi.get(
			"/v2/admin/company-settings/company-field-map/describe/person"
		).then(res =>
			res?.data.data.data.map(item => {
				let obj = {
					name: item.key,
					label: item.name,
					type: item.field_type,
					editable: item.bulk_edit_allowed,
				};
				if (obj.type === "enum") obj.picklistValues = item.options;
				// if (obj.type === "reference") {
				//  obj.reference_to = item.referenceTo;
				// }
				return obj;
			})
		);

	const { mutate: fetchPersonFields, isLoading: personFieldsLoading } =
		useMutation(getPersonFields);

	const getOrganizationFields = () =>
		AuthorizedApi.get(
			"/v2/admin/company-settings/company-field-map/describe/organization"
		).then(res =>
			res?.data.data.data.map(item => {
				let obj = {
					name: item.key,
					label: item.name,
					type: item.field_type,
					editable: item.bulk_edit_allowed,
				};
				if (obj.type === "enum") obj.picklistValues = item.options;
				// if (obj.type === "reference") {
				//  obj.reference_to = item.referenceTo;
				// }
				return obj;
			})
		);

	const { mutate: fetchOrganizationFields, isLoading: organizationFieldsLoading } =
		useMutation(getOrganizationFields);

	/** BULLHORN **/
	const getContactBullhornFieldsApi = () =>
		AuthorizedApi.get(
			"/v2/admin/company-settings/company-field-map/describe/clientContact"
		).then(res =>
			res?.data.data.fields
				?.filter(
					item =>
						Object.keys(item).includes("dataType") &&
						item.dataType !== "Address" &&
						item.dataType !== "SecondaryAddress" &&
						item.dataType !== "OnboardingReceivedSent" &&
						item.dataType !== "BillingAddress" &&
						item.name !== "id"
				)
				?.filter(item =>
					item.dataType === "Timestamp"
						? Object.keys(item).includes("dataSpecialization")
						: true
				)
				?.map(item => {
					let obj = {
						name: item.name,
						label: item.label,
						type:
							Object.keys(item).includes("inputType") &&
							Object.keys(item).includes("options")
								? item.inputType
								: item.dataType,
						editable: item.readOnly,
					};

					if (
						Object.keys(item).includes("inputType") &&
						Object.keys(item).includes("options")
					) {
						obj.picklistValues = item.options;
						obj.multiValue = item.multiValue;
					}

					if (
						obj.type === "Timestamp" &&
						Object.keys(item).includes("dataSpecialization")
					) {
						obj.dateType = item.dataSpecialization;
					}
					return obj;
				})
		);

	const { mutate: fetchContactBullhornFields, isLoading: contactBullhornFieldsLoading } =
		useMutation(getContactBullhornFieldsApi);
	/* DYNAMICS */
	const getContactDynamicsFields = () =>
		Promise.all([
			AuthorizedApi.get("/v2/admin/company-settings/company-field-map/describe/contact"),
			AuthorizedApi.get(
				"/v2/admin/company-settings/company-field-map/describePicklist/contact"
			),
		]).then(res =>
			res[0]?.data.data
				.filter(
					item =>
						item.AttributeType !== "Virtual" &&
						item.AttributeType !== "Lookup" &&
						item.AttributeType !== "EntityName" &&
						item.AttributeType !== "Customer" &&
						item.AttributeType !== "Uniqueidentifier" &&
						item.AttributeType !== "Owner"
				)
				.map(item => {
					let obj = {
						name: item.LogicalName,
						label: item.DisplayName.LocalizedLabels?.[0]?.Label ?? item.SchemaName,
						type: inputDataTypeDynamics(
							item?.LogicalName === "anniversary" || item?.LogicalName === "birthdate"
								? "date"
								: item.AttributeType.toLowerCase()
						),
						editable: item.IsValidForUpdate,
					};
					if (obj.type === "picklist")
						obj.picklistValues = res[1]?.data?.data
							.find(i => i.LogicalName === item.LogicalName)
							.OptionSet.Options.map(pv => ({
								label: pv?.Label.LocalizedLabels?.[0]?.Label,
								value: pv?.Value,
							}));
					return obj;
				})
		);

	const { mutate: fetchContactDynamicsFields, isLoading: contactDynamicsFieldsLoading } =
		useMutation(getContactDynamicsFields);
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
						item.dataType !== "BillingAddress" &&
						item.name !== "id"
				)
				?.filter(item =>
					item.dataType === "Timestamp"
						? Object.keys(item).includes("dataSpecialization")
						: true
				)
				?.map(item => {
					const obj = {
						name: item.name,
						label: item.label,
						type:
							Object.keys(item).includes("inputType") &&
							Object.keys(item).includes("options")
								? item.inputType
								: item.dataType,
						editable: item.readOnly,
					};

					if (
						Object.keys(item).includes("inputType") &&
						Object.keys(item).includes("options")
					) {
						obj.picklistValues = item.options;
						obj.multiValue = item.multiValue;
					}

					if (
						obj.type === "Timestamp" &&
						Object.keys(item).includes("dataSpecialization")
					) {
						obj.dateType = item.dataSpecialization;
					}
					return obj;
				})
		);
	};

	const { mutate: fetchCandidateFields, isLoading: fetchCondidateFieldsLoading } =
		useMutation(getCandidateSfFieldsApi);

	/**
	 * Account Object for Frontend:
	 * 1. Salesforce Account is an account
	 * 2. Pipedrive Organization is an account
	 * 4. Google Sheets Companies are also accounts
	 * 3. Hubspot Company is an account
	 */
	const getAccountFields = () =>
		user?.integration_type === INTEGRATION_TYPE.DYNAMICS
			? Promise.all(
					getDescribeAccountURL({
						integration_type: user?.integration_type,
					}).map(option => AuthorizedApi.get(option))
			  ).then(res =>
					describeAccountStrategy({
						integration_type: user?.integration_type,
						res,
					})
			  )
			: AuthorizedApi.get(
					getDescribeAccountURL({
						integration_type: user.integration_type,
					})
			  ).then(res =>
					describeAccountStrategy({
						integration_type: user.integration_type,
						res,
					})
			  );
	const { mutate: fetchAccountFields, isLoading: accountFieldsLoading } =
		useMutation(getAccountFields);

	/**
	 * Custom Objects for all integrations will be the same
	 *
	 */
	const fetchCustomObjectDetailsApi = body =>
		user?.integration_type === INTEGRATION_TYPE?.PIPEDRIVE
			? AuthorizedApi.get(
					getCustomObjectDetailsURL({
						integration_type: user?.integration_type,
						id: body?.id,
					}),
					body
			  ).then(res =>
					customObjectDetailsStrategy({
						integration_type: user?.integration_type,
						res,
					})
			  )
			: user?.integration_type === INTEGRATION_TYPE?.HUBSPOT
			? AuthorizedApi.post(
					getCustomObjectDetailsURL({
						integration_type: user?.integration_type,
						id: body?.id,
					}),
					body?.properties
			  ).then(res =>
					customObjectDetailsStrategy({
						integration_type: user?.integration_type,
						res,
					})
			  )
			: user?.integration_type === INTEGRATION_TYPE?.SELLSY ||
			  user?.integration_type === INTEGRATION_TYPE?.DYNAMICS
			? AuthorizedApi.post(
					getCustomObjectDetailsURL({
						integration_type: user?.integration_type,
					}),
					body
			  ).then(res =>
					customObjectDetailsStrategy({
						integration_type: user?.integration_type,
						res,
					})
			  )
			: AuthorizedApi.post(
					getCustomObjectDetailsURL({
						integration_type: user?.integration_type,
						id: body?.id,
					}),
					body
			  ).then(res =>
					customObjectDetailsStrategy({
						integration_type: user?.integration_type,
						res,
					})
			  );

	const { isLoading: fetchCustomObjectDetailsLoading, mutate: fetchCustomObjectDetails } =
		useMutation(fetchCustomObjectDetailsApi);

	const searchOptionsApi = body => {
		return AuthorizedApi.get(
			`/v2/sales/lead/custom-object/search?sObject=${body.sObject}&search_term=${body.search_term}&reference_field_name=${body.reference_field_name}`
		).then(res => res?.data.data);
	};
	const {
		mutate: fetchReferenceFieldOptions,
		isLoading: fetchReferenceFieldOptionsLoading,
	} = useMutation(searchOptionsApi);

	/** FETCH CUSTOM OBJECT PIPEDRIVE **/
	const fetchCustomObjectDetailsPipedriveApi = body =>
		AuthorizedApi.get(
			`/v2/admin/company-settings/company-field-map/pipedrive/person/${body.id}`,
			body
		).then(res => res?.data.data);

	const {
		isLoading: fetchCustomObjectDetailsPipedriveLoading,
		mutate: fetchCustomObjectDetailsPipedrive,
	} = useMutation(fetchCustomObjectDetailsPipedriveApi);

	/** FETCH CUSTOM OBJECT HUBSPOT **/
	const fetchCustomObjectDetailsHubspotApi = body =>
		AuthorizedApi.post(
			`/v2/admin/company-settings/company-field-map/hubspot/contact/${body?.id}`,
			body?.properties
		).then(res => res?.data.data);

	const {
		isLoading: fetchCustomObjectDetailsHubspotLoading,
		mutate: fetchCustomObjectDetailsHubspot,
	} = useMutation(fetchCustomObjectDetailsHubspotApi);

	return {
		customObj,
		fetchCustomObject,
		customObjectError,
		fetchLeadFields,
		fetchAccountFields,
		fetchContactFields,

		loading:
			leadFieldsLoading ||
			contactFieldsLoading ||
			accountFieldsLoading ||
			contactZohoFieldsLoading ||
			contactDynamicsFieldsLoading ||
			contactBullhornFieldsLoading ||
			fetchCondidateFieldsLoading,
		setCustomObjectForm,
		setCustomObjectFormLoading,
		setCustomObject,
		setCustomObjectLoading,
		fetchCustomObjectDetails,
		fetchCustomObjectDetailsLoading,

		fetchReferenceFieldOptions,
		fetchReferenceFieldOptionsLoading,
		setTest,
		setTestLoading,
		fetchContactZohoFields,
		contactZohoFieldsLoading,
		fetchContactDynamicsFields,
		contactDynamicsFieldsLoading,

		/*--Bullhorn--*/
		fetchContactBullhornFields,
		fetchCandidateFields,

		/*--HUBSPOT--*/
		fetchContactHpFields,
		fetchCompanyHpFields,
		hLoading: fetchContactHpFieldsLoading || fetchCompanyHpFieldsLoading,

		/*--PIPEDRIVE--*/
		fetchPersonFields,
		fetchOrganizationFields,
		ploading: personFieldsLoading || organizationFieldsLoading,

		/*--FETCH CUSTOM OBJECT PIPEDRIVE --*/
		fetchCustomObjectDetailsPipedrive,
		fetchCustomObjectDetailsPipedriveLoading,

		/*--FETCH CUSTOM OBJECT HUBSPOT --*/
		fetchCustomObjectDetailsHubspot,
		fetchCustomObjectDetailsHubspotLoading,
	};
};
export default useCustomObject;
