import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist({
	key: "timeElapsed",
});

const timeElapsed = atom({
	key: "timeElapsed",
	default: {
		power: 0,
		powerDelay: 0,
	},
	effects_UNSTABLE: [persistAtom],
});

export default timeElapsed;
