import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist({
	key: "statisticsSelectedTableColumn",
});

const selectedColumn = atom({
	key: "statisticsSelectedTableColumn",
	default: {
		selected: [
			"converted",
			"disqualified",
			"doneTasks",
			"totalTasks",
			"averageTime",
			"activeLeads",
		],
		allColumns: [],
	},
	effects_UNSTABLE: [persistAtom],
});

export default selectedColumn;
