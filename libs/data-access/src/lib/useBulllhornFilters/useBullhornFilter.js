import { useMutation } from "react-query";
import { AuthorizedApi } from "../api";
import { describeFieldStrategy } from "./useBullhornFilter.strategy";

const useBullhornFilter = (enabled = false) => {
	// fetch lead, contact, candidate

	// LEAD
	const getBullhornLeadFieldsApi = () => {
		let URL = "/v2/admin/company-settings/company-field-map/describe/lead";

		return AuthorizedApi.get(URL).then(res => {
			let result = describeFieldStrategy(res.data.data.fields);

			return result && result;
		});
	};

	const { mutate: fetchLeadBfFields, isLoading: fetchLeadFieldsLoading } = useMutation(
		getBullhornLeadFieldsApi
	);

	// CONTACT
	const getContactBullhornFieldsApi = () => {
		let URL = "/v2/admin/company-settings/company-field-map/describe/clientContact";

		return AuthorizedApi.get(URL).then(res => {
			let result = describeFieldStrategy(res.data.data.fields);

			return result && result;
		});
	};

	const { mutate: fetchContactBfFields, isLoading: fetchContactFieldsLoading } =
		useMutation(getContactBullhornFieldsApi);
	// CANDIDATE
	const getCandidateBullhronFieldsApi = () => {
		let URL = `/v2/admin/company-settings/company-field-map/describe/candidate`;

		return AuthorizedApi.get(URL).then(res => {
			let result = describeFieldStrategy(res.data.data.fields);

			return result && result;
		});
	};

	const { mutate: fetchCandidateBfFields, isLoading: fetchCandidateFieldsLoading } =
		useMutation(getCandidateBullhronFieldsApi);

	return { fetchLeadBfFields, fetchCandidateBfFields, fetchContactBfFields };
};

export default useBullhornFilter;
