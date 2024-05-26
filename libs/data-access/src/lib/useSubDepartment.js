/* eslint-disable no-console */
import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { AuthorizedApi } from "./api";

const useSubDepartment = (sd_id, enabled = true) => {
	const queryClient = useQueryClient();

	const [subDepartment, setSubDepartment] = useState(null);
	const [uploadProgress, setUploadProgress] = useState(null);

	const getAdmins = () =>
		AuthorizedApi.get("/v2/sales/sub-department/employees/admin/admins").then(
			res => res.data.data
		);

	const { data: adminsData, isLoading: adminsLoading } = useQuery(
		["sub-department-users", sd_id],
		getAdmins,
		{
			refetchOnWindowFocus: false,
			enabled: enabled && sd_id === "admin",
		}
	);

	const getUsers = () =>
		AuthorizedApi.get(`/v2/sales/sub-department/employees/admin/${sd_id}`).then(
			res => res.data.data
		);

	const {
		data: usersData,
		isLoading: usersLoading,
		refetch: refetchUsers,
	} = useQuery(["sub-department-users", sd_id], getUsers, {
		refetchOnWindowFocus: false,
		enabled: enabled && Boolean(sd_id) && sd_id !== "admin",
	});

	const uploadUsersCSVApi = async csvFile => {
		const formData = new FormData();
		formData.append("file", csvFile);
		formData.append("sd_id", sd_id);

		const res = await AuthorizedApi.post("/v2/sales/sub-department/users", formData, {
			onUploadProgress: progressEvent => {
				setUploadProgress(progressEvent.loaded / progressEvent.total);
			},
		});
		return res.data;
	};

	const { mutate: uploadUsersCSV, isLoading: uploadCSVLoading } = useMutation(
		uploadUsersCSVApi,
		{
			onSettled: () => {
				queryClient.invalidateQueries(["sub-department-users", sd_id]);
			},
		}
	);

	const updateDataApi = body =>
		AuthorizedApi.patch(`/v2/sales/sub-department/${sd_id}`, body).then(res => res.data);

	const { mutate: updateData, isLoading: updateDataLoading } = useMutation(
		updateDataApi,
		{
			onSettled: () => {
				queryClient.invalidateQueries(["sub-department-users", sd_id]);
				queryClient.invalidateQueries("sub-departments");
			},
		}
	);

	const updateImageApi = async imageFile => {
		const formData = new FormData();
		formData.append("sd_id", sd_id);
		formData.append("image", imageFile);

		const res = await AuthorizedApi.post(
			"/v1/sales/sub-department/changeProfilePicture",
			formData,
			{
				onUploadProgress: progressEvent => {
					setUploadProgress(progressEvent.loaded / progressEvent.total);
				},
			}
		);
		return res.data;
	};

	const { mutate: updateImage, isLoading: updateImageLoading } = useMutation(
		updateImageApi,
		{
			onSettled: () => {
				queryClient.invalidateQueries(["sub-department-users", sd_id]);
				queryClient.invalidateQueries("sub-departments");
			},
		}
	);

	const deleteSubDepartmentApi = () =>
		AuthorizedApi.delete(`/v2/sales/sub-department/${sd_id}`).then(res => res.data);

	const { mutate: deleteSubDepartment, isLoading: deleteLoading } = useMutation(
		deleteSubDepartmentApi,
		{
			onSettled: () => {
				queryClient.invalidateQueries("sub-departments");
			},
		}
	);

	useEffect(() => {
		if (sd_id === "admin" && adminsData) {
			setSubDepartment({
				name: "Admin",
				sd_id: "admin",
				is_profile_picture_present: false,
				users_count: adminsData?.users?.length,
			});
		} else if (usersData) {
			setSubDepartment(
				usersData?.subDepartment
					? {
							...usersData?.subDepartment,
							users_count: usersData?.users?.length,
					  }
					: null
			);
		}
	}, [adminsData, usersData, sd_id]);

	return {
		subDepartment,
		subDepartmentLoading: sd_id === "admin" ? adminsLoading : usersLoading,
		users: sd_id === "admin" ? adminsData?.users : usersData?.users,
		usersLoading: sd_id === "admin" ? adminsLoading : usersLoading,
		refetchUsers,
		companySettings:
			sd_id === "admin" ? adminsData?.companySettings : usersData?.companySettings,
		settingsLoading: sd_id === "admin" ? adminsLoading : usersLoading,
		uploadUsersCSV,
		uploadCSVLoading,
		updateData,
		updateDataLoading,
		updateImage,
		updateImageLoading,
		uploadProgress,
		deleteSubDepartment,
		deleteLoading,
	};
};

export default useSubDepartment;
