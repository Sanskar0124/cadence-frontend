/* eslint-disable no-console */
import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import { AuthorizedApi } from "./api";
import { ROLES } from "@cadence-frontend/constants";

const EXCLUDE_ENUMS = {
	END: "end",
	DATA_CHECK: "data_check",
	CADENCE_CUSTOM: "cadence_custom",
};

const useAdminStats = ({ role }) => {
	const [users, setUsers] = useState([]);
	const [activityFollowUpStats, setActivityFollowUpStats] = useState([]);
	const [activityFollowUpStatsForUser, setActivityFollowUpStatsForUser] = useState([]);

	const [cadenceFollowUpStats, setCadenceFollowUpStats] = useState([]);
	const [cadenceContactsOverview, setCadenceContactsOverview] = useState([]);
	const [cadenceActivity, setCadenceActivity] = useState([]);

	const [cadenceByUsers, setCadenceByUsers] = useState([]);
	const [nodeByCadence, setNodeByCadence] = useState([]);
	const [nodeActivities, setNodeActivities] = useState([]);

	const [disqualifications, setDisqualifications] = useState([]);
	const cadenceURL =
		role === ROLES.ADMIN
			? "/v2/admin/cadences/"
			: "/v2/sales/department/cadence/task-filter";

	const fetchUsers = async () => {
		try {
			const URL = "v2/user/get-users";
			const res = await AuthorizedApi.get(URL);
			setUsers(res.data.data);
		} catch (err) {
			console.log(err);
		}
	};

	const fetchActivityFollowUpStatsApi = body =>
		AuthorizedApi.post("/v2/admin/statistics/activityfollowup", body).then(
			res => res.data.data
		);

	const { mutate: fetchActivityFollowUpStats, isLoading: activityFollowUpStatsLoading } =
		useMutation(fetchActivityFollowUpStatsApi, {
			onSuccess: data => {
				setActivityFollowUpStats(
					Object.keys(data).map(cadenceId => ({ ...data[cadenceId] }))
				);
			},
		});

	const fetchActivityFollowUpStatsForUserApi = body =>
		AuthorizedApi.post("/v2/admin/statistics/useractivity", body).then(
			res => res.data.data
		);

	const {
		mutate: fetchActivityFollowUpStatsForUser,
		isLoading: activityFollowUpStatsForUserLoading,
	} = useMutation(fetchActivityFollowUpStatsForUserApi, {
		onSuccess: data => {
			setActivityFollowUpStatsForUser(
				Object.keys(data).map(cadenceId => ({ ...data[cadenceId] }))
			);
		},
	});

	const fetchAllCadencesApi = () =>
		AuthorizedApi.get(cadenceURL).then(res => res.data.data);

	const { data: cadences, refetch: fetchAllCadences } = useQuery(
		"cadencesInStatistics",
		fetchAllCadencesApi,
		{
			enabled: false,
			select: data => {
				if (data.length > 0)
					return data.map(cadence => ({
						label: cadence.name,
						value: cadence.cadence_id,
					}));
			},
		}
	);

	const fetchCadenceFollowUpStatsApi = body =>
		AuthorizedApi.post("/v2/admin/statistics/cadencefollowup", body).then(
			res => res.data.data
		);

	const { mutate: fetchCadenceFollowUpStats, isLoading: cadenceStatsLoading } =
		useMutation(fetchCadenceFollowUpStatsApi, {
			onSuccess: data => {
				setCadenceFollowUpStats(
					Object.keys(data).map(user => ({ ...data[user], user_id: user }))
				);
			},
		});

	const fetchCadenceContactsOverviewApi = body =>
		AuthorizedApi.post("/v2/admin/statistics/cadencecontact", body).then(
			res => res.data.data
		);

	const {
		mutate: fetchCadenceContactsOverview,
		isLoading: cadenceContactsOverviewLoading,
	} = useMutation(fetchCadenceContactsOverviewApi, {
		onSuccess: data => {
			setCadenceContactsOverview(Object.keys(data).map(user => ({ ...data[user] })));
		},
	});

	const fetchCadenceActivitiesApi = body =>
		AuthorizedApi.post("/v2/admin/statistics/cadenceactivity", body).then(
			res => res.data.data
		);

	const { mutate: fetchCadenceActivity, isLoading: cadenceActivityLoading } = useMutation(
		fetchCadenceActivitiesApi,
		{
			onSuccess: data => {
				setCadenceActivity(Object.keys(data).map(user => ({ ...data[user] })));
			},
		}
	);

	//Node Statistics

	const fetchCadenceByUserApi = body =>
		AuthorizedApi.post("/v2/admin/statistics/filter-by-cadence", body).then(
			res => res.data.data
		);

	const { mutate: fetchCadenceByUser, isLoading: cadenceByUserLoading } = useMutation(
		fetchCadenceByUserApi,
		{
			onSuccess: data => {
				setCadenceByUsers(
					data.map(cadence => ({ value: cadence.cadence_id, label: cadence.name }))
				);
			},
		}
	);

	const fetchNodesByCadenceApi = body =>
		AuthorizedApi.post("/v2/admin/statistics/fetch-cadence-nodes", body).then(
			res => res.data.data
		);

	const { mutate: fetchNodesByCadence, isLoading: nodesByCadenceLoading } = useMutation(
		fetchNodesByCadenceApi,
		{
			onSuccess: data => {
				setNodeByCadence(
					data
						.map(node => ({
							value: node.node_id,
							label: `${node.name} : STEP ${node.step_number}`,
							type: node.type,
						}))
						.filter(node => !Object.values(EXCLUDE_ENUMS).includes(node.type))
				);
			},
		}
	);

	const fetchNodeActivityApi = body =>
		AuthorizedApi.post("/v2/admin/statistics/nodeactivity", body).then(
			res => res.data.data
		);

	const { mutate: fetchNodeActivity, isLoading: nodeActivityLoading } = useMutation(
		fetchNodeActivityApi,
		{
			onSuccess: data => {
				if (data.email)
					setNodeActivities(Object.keys(data).map(node => ({ ...data[node] })));
				else setNodeActivities(data);
			},
		}
	);

	//disqualification
	const fetchDisqualificationsApi = body =>
		AuthorizedApi.post("/v2/admin/statistics/disqualifications", body).then(
			res => res.data.data
		);

	const { mutate: fetchDisqualifications, isLoading: disqualificationsLoading } =
		useMutation(fetchDisqualificationsApi, {
			onSuccess: data => {
				setDisqualifications(data);
			},
		});

	return {
		users,
		fetchUsers,
		fetchActivityFollowUpStats,
		activityFollowUpStats,
		activityFollowUpStatsLoading,
		activityFollowUpStatsForUser,
		fetchActivityFollowUpStatsForUser,
		activityFollowUpStatsForUserLoading,
		fetchCadenceFollowUpStats,
		cadenceFollowUpStats,
		cadenceStatsLoading,
		cadences,
		fetchAllCadences,
		fetchCadenceContactsOverview,
		cadenceContactsOverview,
		cadenceContactsOverviewLoading,
		cadenceActivity,
		fetchCadenceActivity,
		cadenceActivityLoading,
		//Node Stats
		fetchCadenceByUser,
		cadenceByUserLoading,
		fetchNodesByCadence,
		nodesByCadenceLoading,
		fetchNodeActivity,
		nodeActivityLoading,
		cadenceByUsers,
		nodeByCadence,
		nodeActivities,
		//disqualifications
		fetchDisqualifications,
		disqualificationsLoading,
		disqualifications,
	};
};

export default useAdminStats;
