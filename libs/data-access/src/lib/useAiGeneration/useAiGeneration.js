import { useMutation } from "react-query";
import { AuthorizedApi } from "../api";

const useAiGeneration = () => {
	//api /v2/ai/email-template
	// data '{
	//     "prompt" : "I just need this to work!",
	//     "value_proposition" : "People who are in tech",
	//     "problem_statement" : "I should be able to call users from one interface"
	// }'

	const templateGeneRationApi = body => {
		return AuthorizedApi.post("/v2/ai/email-template", body).then(res => res.data.data);
	};

	const {
		mutate: getEmailTemplate,
		isLoading: emailTemplateLoading,
		isSuccess,
	} = useMutation(templateGeneRationApi);

	return { getEmailTemplate, emailTemplateLoading, isSuccess };
};

export default useAiGeneration;
