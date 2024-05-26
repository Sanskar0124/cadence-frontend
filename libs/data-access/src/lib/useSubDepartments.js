/* eslint-disable no-console */
import { useState } from "react";
import { AuthorizedApi } from "./api";
import { useMutation, useQuery, useQueryClient } from "react-query";
import useUser from "./useUser/useUser";

const useSubDepartments = (enabled = true, withUsers = false) => {
	const { user } = useUser({ user: true });

	const queryClient = useQueryClient();
	const [uploadProgress, setUploadProgress] = useState(null);

	const getSubDepartments = async ({ queryKey }) => {
		const withUsers = queryKey[1];
		let URL = withUsers
			? "/v2/sales/sub-department/with-users"
			: "/v2/sales/sub-department";
		const {
			data: { data },
		} = await AuthorizedApi.get(URL);

		let subDepartments = [];
		if (withUsers) {
			subDepartments.push({
				Users: data?.allAdmins ?? [],
				users_count: data?.allAdmins?.length,
				department_id: data?.subDepartments[0]?.department_id ?? user?.department_id,
				is_profile_picture_present: false,
				name: "Admin",
				sd_id: "admin",
			});
			if (data?.subDepartments) {
				subDepartments = [
					...subDepartments,
					...(data?.subDepartments ?? []).map(sd => ({
						...sd,
						users_count: sd?.Users?.length,
					})),
				];
			}
		} else {
			subDepartments = data;
		}

		return subDepartments;
	};

	const { data: subDepartments, isLoading: subDepartmentsLoading } = useQuery(
		["sub-departments", withUsers],
		getSubDepartments,
		{
			enabled,
		}
	);

	const createSubDepartmentApi = async ({ name, imageFile }) => {
		const formData = new FormData();
		formData.append("name", name);
		formData.append("department_id", user?.department_id);

		if (imageFile) {
			formData.append("image", imageFile);
		}

		const res = await AuthorizedApi.post("/v2/sales/sub-department", formData, {
			onUploadProgress: progressEvent => {
				setUploadProgress(progressEvent.loaded / progressEvent.total);
			},
		});
		return res.data;
	};

	const { mutate: createSubDepartment, isLoading: createLoading } = useMutation(
		createSubDepartmentApi,
		{
			onSettled: () => {
				queryClient.invalidateQueries("sub-departments");
			},
		}
	);

	const changeTeamApi = async body => {
		const res = await AuthorizedApi.post("/v2/sales/sub-department/team-change", body);
		return res.data;
	};

	const { mutate: changeTeam, isLoading: changeTeamLoading } = useMutation(changeTeamApi);

	const countInfoApi = async memberId => {
		const res = await AuthorizedApi.get(`/v2/sales/sub-department/user-info/${memberId}`);
		return res.data;
	};
	const { mutate: countInfo, isLoading: countInfoLoading } = useMutation(countInfoApi);

	return {
		subDepartments,
		subDepartmentsLoading,
		createSubDepartment,
		createLoading,
		changeTeam,
		changeTeamLoading,
		countInfo,
		countInfoLoading,
		uploadProgress,
	};
};

export default useSubDepartments;
