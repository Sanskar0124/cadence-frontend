export const CHANGE_TYPES = {
	INTEGRATION_CHANGE: "integration_change",
	EMAIL_CHANGE: "email_change",
};

export const INTEGRATION_CHANGE_OPTIONS = {
	START_FROM_SCRATCH: "start_from_scratch",
	KEEP_CADENCES_AND_SETTINGS: "keep_cadences_and_settings",
	KEEP_EVERYTHING: "keep_everything",
};

export const INTEGRATION_CHANGE_EFFECTS = {
	keep_everything: ["All leads present in the previous CRM have been deleted"],
	keep_cadences_and_settings: [
		"All leads present in the previous CRM have been deleted",
		"All workflows have been deleted",
	],
	start_from_scratch: [
		"All leads present in the previous CRM have been deleted",
		"All cadences have been deleted",
		"All settings have been reset to their defaults",
		"All workflows have been deleted",
	],
};
