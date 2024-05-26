import NodesPopupModal from "./components/NodesPopupModal/NodesPopupModal";
import RelatedLeadsModal from "./components/RelatedLeadsModal/RelatedLeadsModal";
import ViewInsightsModal from "./components/ViewInsightsModal/ViewInsightsModal";
import { LOCAL_MODAL_TYPES } from "./constants";
import PauseOrStopRelatedLeadsModal from "./components/PauseOrStopRelatedLeadsModal/PauseOrStopRelatedLeadsModalDriver";
import DuplicatesModal from "./components/DuplicatesModal/DuplicatesModal";
import SkipTaskModal from "./components/SkipTaskModal/SkipTaskModal";
import RemoveHotLead from "./components/RemoveHotLead/RemoveHotLead";
import LeadScoreReasons from "./components/LeadScoreReasons/LeadScoreReasons";
import RelatedLeadsStopModal from "./components/RelatedLeadsStopModal/RelatedLeadsStopModal";
//components

//constants

const LocalModals = ({ modal, ...rest }) => {
	switch (modal?.modalType) {
		case LOCAL_MODAL_TYPES.INSIGHTS:
			return <ViewInsightsModal modal={modal} {...rest} />;
		case LOCAL_MODAL_TYPES.PAUSE_CADENCE:
			return <PauseOrStopRelatedLeadsModal modal={modal} operation="Pause" {...rest} />;
		case LOCAL_MODAL_TYPES.STOP_CADENCE:
			return <PauseOrStopRelatedLeadsModal modal={modal} operation="Stop" {...rest} />;
		case LOCAL_MODAL_TYPES.NODES_POPUP:
			return <NodesPopupModal modal={modal} {...rest} />; //working
		case LOCAL_MODAL_TYPES.SKIP_TASK:
			return <SkipTaskModal modal={modal} {...rest} />; //working
		case LOCAL_MODAL_TYPES.RELATED_LEAD:
			return <RelatedLeadsModal modal={modal} {...rest} />;
		case LOCAL_MODAL_TYPES.CONFIRM_RELATED_LEADS_STOP:
			return <RelatedLeadsStopModal modal={modal} {...rest} />;
		case LOCAL_MODAL_TYPES.DUPLICATES_LEAD:
			return <DuplicatesModal modal={modal} {...rest} />;
		case LOCAL_MODAL_TYPES.REMOVE_HOT_LEAD_TAG:
			return <RemoveHotLead modal={modal} {...rest} />;
		case LOCAL_MODAL_TYPES.LEAD_SCORE_REASONS:
			return <LeadScoreReasons modal={modal} {...rest} />;
		default:
			return null;
	}
};

export default LocalModals;
