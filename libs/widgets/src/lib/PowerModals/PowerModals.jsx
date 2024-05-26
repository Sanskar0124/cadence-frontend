import { POWER_MODAL_TYPES } from "@cadence-frontend/constants";
import PowerCompleteModal from "./components/PowerCompleteModal/PowerCompleteModal";
import PowerStoppedModal from "./components/PowerStoppedModal/PowerStoppedModal";
import CadenceStoppedModal from "./components/CadenceStoppedModal/CadenceStoppedModal";
import StopPowerModal from "./components/StopPowerModal/StopPowerModal";
import PowerPausedModal from "./components/PowerPausedModal/PowerPausedModal";
import InsufficientDataModal from "./components/InsufficientDataModal/InsufficientDataModal";

const PowerModals = ({ modal, ...rest }) => {
	switch (modal?.modalType) {
		case POWER_MODAL_TYPES.CADENCE_STOPPED:
			return <CadenceStoppedModal modal={modal} {...rest} />;
		case POWER_MODAL_TYPES.MAILS_LIMIT_REACHED:
		case POWER_MODAL_TYPES.ALL_CADENCES_STOPPED:
			return <PowerStoppedModal modal={modal} {...rest} />;
		case POWER_MODAL_TYPES.POWER_COMPLETE:
			return <PowerCompleteModal modal={modal} {...rest} />;
		case POWER_MODAL_TYPES.STOP_POWER:
			return <StopPowerModal modal={modal} {...rest} />;
		case POWER_MODAL_TYPES.POWER_PAUSED:
			return <PowerPausedModal modal={modal} {...rest} />;
		case POWER_MODAL_TYPES.INSUFFICIENT_DATA:
			return <InsufficientDataModal modal={modal} {...rest} />;
		default:
			return null;
	}
};

export default PowerModals;
