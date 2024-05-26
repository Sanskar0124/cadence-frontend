import { AuthorizedApi } from "./api";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";
import { TOKEN_COLUMNS } from "@cadence-frontend/constants";

const useTestEmail = () => {
	const user = useRecoilValue(userInfo);
	const fetchSubDeptUsersApi = cadence_id => {
		let url = "";
		if (window.location.href.includes("cadence/edit")) {
			url = `/v2/sales/department/cadence/test-mail-users?from=cadence&cadence_id=${cadence_id}`;
		} else {
			url = `/v2/sales/department/cadence/test-mail-users?from=template&cadence_id=`;
		}
		return AuthorizedApi.get(url).then(res => {
			return res.data.data.map(us => ({
				...us,
				is_token_expired:
					us.User_Token?.[TOKEN_COLUMNS[user?.mail_integration_type]?.is_token_expired],
			}));
		});
	};
	const { mutate: fetchSubDeptUsers, isLoading: usersLoading } =
		useMutation(fetchSubDeptUsersApi);

	const sendTestEmailApi = body => AuthorizedApi.post(`/mail/v2/send-test-mail`, body);

	const { mutate: sendTestEmail, isLoading: testEmailLoading } =
		useMutation(sendTestEmailApi);

	return { fetchSubDeptUsers, usersLoading, sendTestEmail, testEmailLoading };
};

export default useTestEmail;
