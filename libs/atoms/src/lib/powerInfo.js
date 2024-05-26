import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist({
	key: "powerInfo",
});

const powerInfo = atom({
	key: "powerInfo",
	default: {
		filters: {
			task_type: [],
			task_tag: [],
			task_action: [],
			task_completion: [],
			task_cadences: [],
			company_size: [],
			task_step: "0",
			task_date_creation: [],
		},
		tasks: [],
		status: "stopped",
		showInfoByDefault: true,
	},
	effects_UNSTABLE: [persistAtom],
});

export default powerInfo;
