import { atom, selector } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist({
	key: "userInfo",
});

const userInfo = atom({
	key: "userInfo",
	default: {
		ringover_tokens: {},
		user_id: "",
		sd_id: "",
		company_id: "",
		first_name: "",
		last_name: "",
		role: "",
		email: "",
		primary_email: null,
		linkedin_url: null,
		primary_phone_number: null,
		timezone: "",
		profile_picture: "",
		is_call_iframe_fixed: false,
		language: "english",
		integration_type: "",
		company_integration_id: null,
		instance_url: "",
		phone_system: "",
		mail_integration_type: "",
	},
	effects_UNSTABLE: [persistAtom],
});

export const accessToken = selector({
	key: "accessToken",
	get: ({ get }) => {
		const user = get(userInfo);
		return user.ringover_tokens?.id_token;
	},
});

export default userInfo;
