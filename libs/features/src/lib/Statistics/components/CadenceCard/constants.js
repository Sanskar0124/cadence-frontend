import {
	Cadence,
	CadenceGreenGradient,
	PlayGreenGradient,
	PauseGradient,
	CadenceYellowGradient,
	ClockGrayGradient,
	PauseYellowGradient,
} from "@cadence-frontend/icons";
import { Colors } from "@cadence-frontend/utils";
import {
	Tasks as TASKS_TRANSLATION,
	Cadence as CADENCE_TRANSLATIONS,
} from "@cadence-frontend/languages";
export const cadenceConstants = [
	{
		name: "ActiveCadence_data",
		relativeIcon: <CadenceGreenGradient />,
		absoluteIcon: <PlayGreenGradient />,
		activeCadence: 27,
		status: "active",
	},
	{
		name: "PausedCadence_data",
		relativeIcon: <CadenceYellowGradient />,
		absoluteIcon: <PauseYellowGradient />,
		activeCadence: 5,
		status: "paused",
	},
	{
		name: "NotStartedCadence_data",
		relativeIcon: <Cadence color={Colors.veryLightBlue} />,
		absoluteIcon: <ClockGrayGradient color={Colors.veryLightBlue} />,
		activeCadence: 2,
		status: "Not started",
	},
];
export const CADENCE_STATUS = {
	in_progress: TASKS_TRANSLATION.ACTIVE,
	paused: CADENCE_TRANSLATIONS.PAUSED,
	not_started: CADENCE_TRANSLATIONS.NOT_STARTED,
};
