import { LEAD_INTEGRATION_TYPES } from "@cadence-frontend/constants";
import { Settings as SETTINGS_TRANSLATION } from "@cadence-frontend/languages";

const equalsCheck = (a, b) => a.length === b.length && a.every((v, i) => v === b[i]);

/**
 *
 * Expected Formats
 * picklist_from_server: [{label: x, value: y}, ...]
 * picklist_from_settings: {label: score, ...}
 *
 * Necessary Condition: Labels should match in order
 */
export const getConstructedStatusObject = ({
	picklist_from_server,
	picklist_from_settings,
}) => {
	try {
		// check if picklist from server and settings have same keys
		// CASE 1: Status Scores have not been set
		// CASE 2: Status Values have been changed in integration
		// RECOURSE: Return obj with status values from server
		if (picklist_from_server.length <= 0) return {};
		// construct obj from server value
		let picklist_obj_server = picklist_from_server?.reduce((prev, curr, ind, array) => {
			return {
				...prev,
				[array?.[ind]?.label]: 0,
			};
		}, {});
		// Status Update Values Have Not Been Set
		if (!picklist_from_settings || picklist_from_settings?.length <= 0) {
			return picklist_obj_server;
		}

		// Compare Objects
		if (
			!equalsCheck(
				Object.keys(picklist_obj_server)?.sort(),
				Object.keys(picklist_from_settings)?.sort()
			)
		) {
			return picklist_obj_server;
		}
		return picklist_from_settings;
	} catch (err) {
		return {};
	}
};
export const RUBRIK_STATUS = {
	"Lead Status Update": SETTINGS_TRANSLATION.LEAD_STATUS_UPDATE,
	"Contact Status Update": SETTINGS_TRANSLATION.CONTACT_STATUS_UPDATE,
	"Status Update": SETTINGS_TRANSLATION.STATUS_UPDATE,
};
