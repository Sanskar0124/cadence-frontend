import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist({
	key: "powerDelay",
});

const powerDelay = atom({
	key: "powerDelay",
	default: 0,
	effects_UNSTABLE: [persistAtom],
});

export default powerDelay;
