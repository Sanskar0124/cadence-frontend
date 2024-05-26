import { Cadence as CADENCE_TRANSLATION } from "@cadence-frontend/languages";

export const DEFAULT_FILTER_OPTIONS = {
	status: null,
	user_ids: [],
};

export const CADENCE_STATUS_ENUMS = {
	paused: CADENCE_TRANSLATION.PAUSED,
	in_progress: CADENCE_TRANSLATION.IN_PROGRESS,
	stopped: CADENCE_TRANSLATION.STOPPED,
	completed: CADENCE_TRANSLATION.COMPLETED,
	// paused: {
	// 	ENGLISH: "Paused",
	// 	FRENCH: "En pause",
	// 	SPANISH: "En pausa",
	// },
	// in_progress: {
	// 	ENGLISH: "In progress",
	// 	FRENCH: "En cours",
	// 	SPANISH: "En curso",
	// },
	// stopped: {
	// 	ENGLISH: "Stopped",
	// 	FRENCH: "Arrêté",
	// 	SPANISH: "Detenida",
	// },
	// completed: {
	// 	ENGLISH: "Completed",
	// 	FRENCH: "Fini",
	// 	SPANISH: "Terminado",
	// },
};
