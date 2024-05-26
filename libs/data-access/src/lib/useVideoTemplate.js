import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { AuthorizedApi } from "./api";

const useVideoTemplate = () => {
	const config = {
		headers: {
			"Content-Type": "multipart/form-data",
			"Access-Control-Allow-Origin": "*",
		},
	};

	const getVideoLinkApi = async body => {
		const res = await AuthorizedApi.post(
			"v2/sales/department/video/upload-video",
			body,
			config
		);
		return res.data;
	};

	const { mutate: uploadVideo, isLoading: embedLinkLoading } = useMutation(
		getVideoLinkApi,
		{}
	);

	const getThumbnailLinkApi = async body => {
		const res = await AuthorizedApi.patch(
			"v2/sales/department/video/set-thumbnail",
			body,
			config
		);
		return res.data;
	};

	const { mutate: uploadThumbnail, isLoading: uploadThumbnailLoading } = useMutation(
		getThumbnailLinkApi,
		{}
	);

	const updateVideoStatsApi = async body => {
		const res = await AuthorizedApi.post(
			`v2/sales/department/video/tracking/${body.video_tracking_id}?watch_duration=${body.watch_duration}`
		);
		return res.data;
	};

	const { mutate: updateVideoStats } = useMutation(updateVideoStatsApi, {});

	const getVideoDataAPI = async body => {
		const res = await AuthorizedApi.get(
			`v2/sales/department/video/${body.video_tracking_id}`,

			{
				headers: {
					"Access-Control-Allow-Origin": "*",
				},
			}
		);
		return res.data;
	};

	const { mutate: getVideo } = useMutation(getVideoDataAPI, {});
	const deleteVideoAPI = async body => {
		console.log(body);
		const res = await AuthorizedApi.delete(`v2/sales/department/video/${body}`);
		return res.data;
	};

	const { mutate: deleteVideo, isLoading: deleteLoading } = useMutation(deleteVideoAPI);

	return {
		uploadVideo,
		embedLinkLoading,
		uploadThumbnail,
		uploadThumbnailLoading,
		updateVideoStats,
		getVideo,
		deleteVideo,
		deleteLoading,
	};
};

export default useVideoTemplate;
