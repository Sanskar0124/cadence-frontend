import { LEAD_WARMTH } from "@cadence-frontend/constants";
import { ENUMS, REASON_TYPES, WARMTH } from "../../constants";

const renderReasonIcon = reason => {
	// if lead has become hot lead, return hot lead icon
	if (reason?.has_warmth_changed && reason?.lead_warmth === LEAD_WARMTH.HOT_LEAD)
		return WARMTH?.icon?.hot;
	else if (reason?.has_warmth_changed && reason?.lead_warmth === LEAD_WARMTH.COLD_LEAD)
		return WARMTH?.icon?.cold;
	return ENUMS[reason?.reason]?.icon?.default;
};

export default renderReasonIcon;
