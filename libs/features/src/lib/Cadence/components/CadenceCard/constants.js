import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
export const getLabelFromEnum = (enumString, user) => {
	if (!enumString) return "";
	let label = enumString.toUpperCase();

	return COMMON_TRANSLATION?.[label]?.[user?.language?.toUpperCase()];
};
