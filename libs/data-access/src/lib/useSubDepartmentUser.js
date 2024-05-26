/* eslint-disable no-console */
import { AuthorizedApi } from "./api";
import { useMutation, useQuery, useQueryClient } from "react-query";

const ENABLED_DEFAULT = {
	ringoverUsers: false,
};

const useSubDepartmentUser = (enabled, sd_id) => {
	enabled = { ...ENABLED_DEFAULT, ...enabled };
	const queryClient = useQueryClient();

	const addUserApi = body =>
		AuthorizedApi.post("/v2/sales/sub-department/user", {
			...body,
			sd_id: sd_id !== "admin" ? sd_id : null,
		}).then(res => res.data);

	const { mutate: addUser, isLoading: addUserLoading } = useMutation(addUserApi, {
		onSettled: () => {
			queryClient.invalidateQueries(["sub-department-users", sd_id]);
		},
	});

	const updateUserApi = body =>
		AuthorizedApi.put("/v2/admin/user", {
			...body,
			sd_id: sd_id !== "admin" ? sd_id : null,
		}).then(res => res.data);

	const { mutate: updateUser, isLoading: updateUserLoading } = useMutation(
		updateUserApi,
		{
			onSettled: () => {
				queryClient.invalidateQueries(["sub-department-users", sd_id]);
			},
		}
	);

	const removeUserApi = body =>
		AuthorizedApi.delete("/v2/user", { data: body }).then(res => res.data);

	const { mutate: removeUser, isLoading: removeUserLoading } = useMutation(
		removeUserApi,
		{
			onSettled: () => {
				queryClient.invalidateQueries(["sub-department-users", sd_id]);
			},
		}
	);

	const getRingoverUserApi = () =>
		AuthorizedApi.get("/v2/sales/sub-department/ringover-users").then(
			res => res.data.data
		);

	const {
		data: ringoverUsers,
		isLoading: ringoverUsersLoading,
		error: ringoverUsersError,
	} = useQuery("ringover-users", getRingoverUserApi, {
		enabled: enabled.ringoverUsers,
	});

	return {
		addUser,
		addUserLoading,
		updateUser,
		updateUserLoading,
		removeUser,
		removeUserLoading,
		ringoverUsers,
		ringoverUsersLoading,
		ringoverUsersError,
	};
};

export default useSubDepartmentUser;
