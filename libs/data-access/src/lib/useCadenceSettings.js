import moment from "moment-timezone";
import { useState, useEffect } from "react";
import { AuthorizedApi } from "./api";
import { useMutation, useQuery, useQueryClient } from "react-query";

// ENABLED ENUM
const ENABLED_DEFAULT = {
	cadence: false,
	cadenceDropdown: false,
	companySettings: false,
	stepsStats: false,
	allowedStatuses: false,
};

const useCadenceSettings = (enabled, cadence_id) => {
	enabled = { ...ENABLED_DEFAULT, ...enabled };

	const queryClient = useQueryClient();
	const [lastSaved, setLastSaved] = useState(null);

	//get cadence
	const getCadence = () =>
		AuthorizedApi.get(`/v2/sales/department/cadence/${cadence_id}`)
			.then(res => res.data.data)
			.catch(error => {
				switch (error.response.status) {
					case 404:
						return (window.location.href = `/crm/404?type=cadence`);
					case 400:
						return (window.location.href = `/crm/404?type=cadence_not_associated`);
				}
			});

	const {
		data: cadence,
		isLoading: cadenceLoading,
		isRefetching: cadenceRefetching,
		isError,
	} = useQuery(["cadence", cadence_id], getCadence, {
		enabled: enabled.cadence,
	});

	//get cadence dropdown
	const getCadenceDropdown = () =>
		AuthorizedApi.get(`/v2/sales/department/cadence/move-cadence`).then(
			res => res.data.data
		);

	const { data: cadenceDropdown } = useQuery("cadenceDropdown", getCadenceDropdown, {
		enabled: enabled.cadenceDropdown,
	});

	//add node
	const addNodeApi = body =>
		AuthorizedApi.post(`/v1/sales/department/node`, body.stepToAdd).then(res => res.data);

	const { mutate: addNode, isLoading: addLoading } = useMutation(addNodeApi, {
		onSettled: () => {
			queryClient.invalidateQueries(["cadence", cadence_id]);
		},
	});

	///upload attachments
	const uploadAttachmentsApi = attachments =>
		AuthorizedApi.post("/v1/sales/attachments", attachments).then(res => res.data);

	const { mutate: uploadAttachments, isLoading: attachmentsLoading } =
		useMutation(uploadAttachmentsApi);

	//update node
	const updateNodeApi = params =>
		AuthorizedApi.put(`/v1/sales/department/node/${params.node_id}`, params.body).then(
			res => res.data
		);

	const { mutate: updateNode, isLoading: updateLoading } = useMutation(updateNodeApi, {
		onSuccess: () => {
			const time = moment();
			setLastSaved({ time });
			let savedData = localStorage.getItem("last_saved");
			if (!savedData) savedData = {};
			else savedData = JSON.parse(savedData);
			savedData[cadence_id] = { time };
			localStorage.setItem("last_saved", JSON.stringify(savedData));
		},
		onMutate: async params => {
			await queryClient.cancelQueries(["cadence", cadence_id]);
			const previousCadence = queryClient.getQueryData(["cadence", cadence_id]);
			queryClient.setQueryData(["cadence", cadence_id], prev => {
				return {
					...prev,
					sequence: prev?.sequence?.map(node => {
						if (node.node_id === params.node_id)
							return {
								...node,
								...(params.type === "mail" || params.type === "automated_mail"
									? params.dataToStore
									: params.body),
							};
						return node;
					}),
				};
			});

			return { previousCadence };
		},
		onSettled: () => {
			queryClient.invalidateQueries(["cadence", cadence_id]);
		},
	});

	//delete node
	const deleteNodeApi = node_id =>
		AuthorizedApi.delete(`/v1/sales/department/node/${node_id}`).then(res => res.data);

	const { mutate: deleteNode, isLoading: deleteLoading } = useMutation(deleteNodeApi, {
		onMutate: async node_id => {
			await queryClient.cancelQueries(["cadence", cadence_id]);
			const previousCadence = queryClient.getQueryData(["cadence", cadence_id]);
			queryClient.setQueryData(["cadence", cadence_id], prev => {
				return {
					...prev,
					sequence: prev.sequence.filter(s => node_id !== s.node_id),
				};
			});
			return { previousCadence };
		},
		onSettled: () => {
			queryClient.invalidateQueries(["cadence", cadence_id]);
		},
	});

	//company settings for cadence

	const getCompanySettings = () =>
		AuthorizedApi.get(`/v1/sales/department/cadence/company-settings`).then(
			res => res.data.data.Company.Company_Setting
		);

	const { data: companySettings } = useQuery("companySettings", getCompanySettings, {
		enabled: enabled.companySettings,
	});

	//get stats for steps

	const getStepsStats = async () => {
		const res = await AuthorizedApi.get(
			`/v2/sales/department/cadence/statistics/${cadence_id}`
		);
		let stepStats = res.data.data.nodeStats?.map(node => {
			let stats = {
				...node,
				convertedLeadsCount: 0,
				disqualifiedLeadsCount: 0,
				doneTasksCount: 0,
				skippedTasksCount: 0,
				scheduledLeadsCount: 0,
				currentLeadsCount: 0,
			};
			if (stats?.aBTestEnabled && stats?.data?.length) {
				let statsData = {};
				stats?.data?.forEach(item => {
					statsData[item?.ab_template_id] = item;
				});
				stats.data = statsData;
			} else if (stats?.data?.length) stats.data = stats?.data[0];
			else delete stats?.data;
			if (stats?.doneAndSkippedTasksForCurrentNode?.length) {
				stats.doneTasksCount =
					stats?.doneAndSkippedTasksForCurrentNode[0]?.completed_count;
				stats.skippedTasksCount =
					stats?.doneAndSkippedTasksForCurrentNode[0]?.skipped_count;
			}
			if (stats?.leadsOnCurrentNode?.length) {
				stats.scheduledLeadsCount = stats?.leadsOnCurrentNode[0]?.scheduled_count;
				stats.currentLeadsCount = stats?.leadsOnCurrentNode[0]?.current_count;
			}
			if (stats?.disqualifedAndConvertedLeads?.length) {
				stats?.disqualifedAndConvertedLeads.forEach(lead => {
					switch (lead?.status) {
						case "converted":
							stats.convertedLeadsCount += lead?.count ?? 1;
							break;
						case "trash":
							stats.disqualifiedLeadsCount += lead?.count ?? 1;
					}
				});
			}
			delete stats?.leadsOnCurrentNode;
			delete stats?.doneAndSkippedTasksForCurrentNode;
			delete stats?.disqualifedAndConvertedLeads;
			return stats;
		});
		return stepStats;
	};

	const { data: stepsStats, isLoading: stepsStatsLoading } = useQuery(
		["steps-stats", cadence_id],
		getStepsStats,
		{
			enabled: enabled.stepsStats,
		}
	);

	//get allowed statuses

	const getAllowedStatuses = () =>
		AuthorizedApi.get(`/v2/sales/department/cadence/allowed-statuses`).then(
			res => res.data.data
		);

	const { data: allowedStatuses } = useQuery("allowedStatuses", getAllowedStatuses, {
		enabled: enabled.allowedStatuses,
	});

	useEffect(() => {
		let storedData = localStorage.getItem("last_saved");
		if (!storedData) return;
		storedData = JSON.parse(storedData);
		if (!storedData[cadence_id]) return;

		let cadenceData = storedData[cadence_id];
		// const lastSavedTime = moment(cadenceData.time);
		// cadenceData.duration = moment().diff(lastSavedTime, "seconds");
		setLastSaved(cadenceData);

		storedData[cadence_id] = cadenceData;
		localStorage.setItem("last_saved", JSON.stringify(storedData));

		// return () => {
		// 	let storedData = localStorage.getItem("last_saved");
		// 	if (!storedData) return;
		// 	storedData = JSON.parse(storedData);
		// 	if (!storedData[cadence_id]) return;

		// 	delete storedData[cadence_id];
		// 	if (JSON.stringify(storedData) === JSON.stringify({}))
		// 		localStorage.removeItem("last_saved");
		// 	else localStorage.setItem("last_saved", JSON.stringify(storedData));
		// };
	}, []);

	// useEffect(() => {
	// 	if (!lastSaved) return;
	// 	if (lastSaved.duration === 0) {
	// 		let savedData = localStorage.getItem("last_saved");
	// 		if (!savedData) savedData = {};
	// 		else savedData = JSON.parse(savedData);
	// 		savedData[cadence_id] = lastSaved;
	// 		localStorage.setItem("last_saved", JSON.stringify(savedData));
	// 	}

	// 	// const currInterval = setInterval(() => {
	// 	// 	setLastSaved(prev => ({
	// 	// 		...prev,
	// 	// 		duration: prev.duration + 1,
	// 	// 	}));
	// 	// }, 1000);
	// 	// return () => clearInterval(currInterval);
	// }, [lastSaved]);

	// Cadence group info

	const cadenceGroupInfoApi = cadenceId => {
		return AuthorizedApi.get(`/v2/sales/department/cadence/${cadenceId}/group_info`).then(
			res => res.data.data
		);
	};

	const { mutate: getGroupInfo, isLoading: groupInfoLoading } =
		useMutation(cadenceGroupInfoApi);

	return {
		cadence,
		cadenceDropdown,
		companySettings,
		cadenceLoading,
		cadenceRefetching,
		addNode,
		addLoading,
		deleteLoading,
		updateNode,
		uploadAttachments,
		updateLoading,
		lastSaved,
		deleteNode,
		stepsStats,
		stepsStatsLoading,
		allowedStatuses,
		error: isError,

		getGroupInfo,
		groupInfoLoading,
	};
};

export default useCadenceSettings;
