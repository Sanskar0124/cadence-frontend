import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist({
	key: "tourInfo",
});

const tourInfo = atom({
	key: "tourInfo",
	default: {
		status: "not_started",
		currentStep: "",
		currentUrl: "",
		currentStepCompleted: false,
		steps_order: [],
		steps_map: {},
		isError: false,
		isLoading: false,
	},
	effects_UNSTABLE: [persistAtom],
});

export default tourInfo;
