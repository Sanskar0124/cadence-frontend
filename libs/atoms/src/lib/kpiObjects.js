import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

const kpiObjects = atom({
	key: "selectedKpiObjects",
	default: {
		selected: [],
		responseData: [],
		cardData: [
			{
				data: null,
				cadence_id: null,
				isSelected: false,
				indexOfBtn: 0,
			},
			{
				data: null,
				cadence_id: null,
				isSelected: false,
				indexOfBtn: 1,
			},
			{
				data: null,
				cadence_id: null,
				isSelected: false,
				indexOfBtn: 2,
			},
			{
				data: null,
				cadence_id: null,
				isSelected: false,
				indexOfBtn: 3,
			},
		],
	},
	effects_UNSTABLE: [persistAtom],
});

export default kpiObjects;
