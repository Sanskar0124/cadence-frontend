import { AuthorizedApi } from "./api";
import { useMutation, useQuery, useQueryClient } from "react-query";

const KEY = "users";
const OWNER_KEY = "change_owners";
const GROUP_MEM = "groupMembers";

const ENABLED_DEFAULT = {
	users: true,
	owners: false,
	companyUsers: false,
};

const useUsers = enabled => {
	enabled = { ...ENABLED_DEFAULT, ...enabled };
	if (enabled?.users === undefined) {
		enabled.users = true; //default has to be true if its undefined
	}

	const fetchUsersApi = () =>
		AuthorizedApi.get("/v2/user/get-users").then(res => res.data.data);

	const { data: users, isLoading: usersLoading } = useQuery(KEY, fetchUsersApi, {
		enabled: enabled.users,
		refetchOnReconnect: false,
	});

	const fetchCompanyUsersApi = () =>
		AuthorizedApi.get("/v2/user/get-company-users").then(res => res.data.data);

	const { data: companyUsers, isLoading: companyUsersLoading } = useQuery(
		KEY,
		fetchCompanyUsersApi,
		{
			enabled: enabled.companyUsers,
			refetchOnReconnect: false,
		}
	);

	const searchGroupMembersApi = async query => {
		return AuthorizedApi.get(`/v2/sales/department/employees/search?q=${query}`).then(
			res => res?.data?.data
		);
	};

	const { mutate: groupMembers, isLoading: groupMembersLoading } =
		useMutation(searchGroupMembersApi);

	const changeOwnerApi = () =>
		AuthorizedApi.get("/v2/user/change-owner").then(res => res.data.data);

	const { data: owners, isLoading: ownersLoading } = useQuery(OWNER_KEY, changeOwnerApi, {
		enabled: enabled.owners,
		refetchOnReconnect: false,
	});

	return {
		users,
		usersLoading,
		companyUsers,
		companyUsersLoading,
		groupMembers,
		groupMembersLoading,
		owners,
		ownersLoading,
	};
};

export default useUsers;
