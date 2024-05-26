import { LOCAL_STORAGE_KEYS } from "@cadence-frontend/constants";
import { AuthorizedApi } from "./api";
import { useMutation } from "react-query";

const useProductTour = () => {
	const importSampleLeadsApi = body =>
		AuthorizedApi.post("/v2/user/product-tour/leads", body).then(res => res.data);

	const { isLoading: importSampleLeadsLoading, mutate: importSampleLeads } =
		useMutation(importSampleLeadsApi);

	const markSampleTaskCompleteApi = body =>
		AuthorizedApi.post(`/v2/sales/department/task/complete/dummy-lead`, body).then(
			res => {
				if (res?.data?.data?.data?.task_id)
					localStorage.setItem(
						LOCAL_STORAGE_KEYS.NEXT_TASK_ID_FOR_TOUR,
						res?.data?.data?.data?.task_id
					);
				return res;
			}
		);

	const { isLoading: markSampleTaskCompleteLoading, mutate: markSampleTaskComplete } =
		useMutation(markSampleTaskCompleteApi);

	const markProductTourCompletedApi = () =>
		AuthorizedApi.get("/v2/user/product-tour/completed").then(res => res.data);

	const { isLoading: markProductTourCompleteLoading, mutate: markProductTourComplete } =
		useMutation(markProductTourCompletedApi);

	const launchProductTourCadenceApi = cadence_id =>
		AuthorizedApi.get(
			`/v2/sales/department/cadence/launch/product-tour/${cadence_id}`
		).then(res => res.data);

	const { isLoading: launchProductTourCadenceLoading, mutate: launchProductTourCadence } =
		useMutation(launchProductTourCadenceApi);

	return {
		importSampleLeads,
		importSampleLeadsLoading,
		markSampleTaskComplete,
		markSampleTaskCompleteLoading,
		markProductTourComplete,
		markProductTourCompleteLoading,
		launchProductTourCadence,
		launchProductTourCadenceLoading,
	};
};

export default useProductTour;
