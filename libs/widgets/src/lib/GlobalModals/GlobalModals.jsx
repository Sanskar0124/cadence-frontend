import { useEffect, useState } from "react";
import styles from "./GlobalModals.module.scss";
import { GLOBAL_MODAL_TYPES } from "@cadence-frontend/constants";
import { Modal } from "@cadence-frontend/components";
import NoteIMC from "./NoteIMC/NoteIMC";
import MessageIMC from "./MessageIMC/MessageIMC";
import EmailIMC from "./EmailIMC/EmailIMC";
import LinkedinIMC from "./LinkedinIMC/LinkedinIMC";
import WhatsappIMC from "./WhatsappIMC/WhatsappIMC";
import CadenceCustomIMC from "./CadenceCustomIMC/CadenceCustomIMC";
import IntegrationExpiredIMC from "./IntegrationExpiredIMC/IntegrationExpiredIMC";
import ReplyEmailIMC from "./EmailIMC/components/ReplyEmailIMC/ReplyEmailIMC";
import DeletedEmailIMC from "./EmailIMC/components/DeletedEmailIMC/DeletedEmailIMC";
import MailIntegrationTokenExpiredIMC from "./MailIntegrationTokenExpiredIMC/MailIntegrationTokenExpiredIMC";
import ProhibitedEmailIMC from "./EmailIMC/components/ProhibitedEmailIMC/ProhibitedEmailIMC";
import OutOfOfficeIMC from "./EmailIMC/components/OutOfOfficeIMC/OutOfOfficeIMC";
import PauseOrStopRelatedLeadsModalDriver from "./PauseOrStopRelatedLeadsModal/PauseOrStopRelatedLeadsModalDriver";
import LinkedinCookieErrorIMC from "./LinkedinCookieErrorIMC/LinkedinCookieErrorIMC";
import CustomTaskModal from "./CustomTaskModal/CustomTaskModal";
import EditLeadIMC from "./EditLeadIMC/EditLeadIMC";
// Note  :-
// if we dont send an onClose it makes a simple onClose on its own
// use GLOBAL_MODAL_TYPES constants
// In order to switch b/w diff modals check ViewEmailIMC
// to pass customClassName, pass className prop within modalProps

const GlobalModals = ({ type, modalProps, typeSpecificProps, templateId }) => {
	//state is necessary for internal switching of modals b/w one another
	const [innerModalState, setInnerModalState] = useState({
		type,
		modalProps,
		typeSpecificProps,
	});

	useEffect(() => {
		setInnerModalState({
			type,
			modalProps,
			typeSpecificProps,
		});
	}, [type, modalProps, typeSpecificProps]);

	const renderInnerModalComponent = props => {
		//spread complete innerModalState
		switch (props.type) {
			case GLOBAL_MODAL_TYPES.NOTE:
				return <NoteIMC {...props} />;
			case GLOBAL_MODAL_TYPES.MESSAGE:
				return <MessageIMC {...props} />;
			case GLOBAL_MODAL_TYPES.MAIL:
				return <EmailIMC {...props} templateId={templateId} />;
			case GLOBAL_MODAL_TYPES.MAIL_DELETED:
				return <DeletedEmailIMC {...props} />;
			case GLOBAL_MODAL_TYPES.MAIL_PROHIBTED:
				return <ProhibitedEmailIMC {...props} />;
			case GLOBAL_MODAL_TYPES.REPLY_TO:
				return <ReplyEmailIMC {...props} />;
			case GLOBAL_MODAL_TYPES.OUT_OF_OFFICE:
				return <OutOfOfficeIMC {...props} />;
			case GLOBAL_MODAL_TYPES.LINKEDIN_CONNECTION:
			case GLOBAL_MODAL_TYPES.LINKEDIN_INTERACT:
			case GLOBAL_MODAL_TYPES.LINKEDIN_PROFILE:
			case GLOBAL_MODAL_TYPES.LINKEIDN_MESSAGE:
			case GLOBAL_MODAL_TYPES.LINKEDIN:
				return <LinkedinIMC {...props} />;
			case GLOBAL_MODAL_TYPES.CADENCE_CUSTOM:
			case GLOBAL_MODAL_TYPES.VIEW_SCRIPT:
			case GLOBAL_MODAL_TYPES.OTHER:
				return <CadenceCustomIMC {...props} />;
			case GLOBAL_MODAL_TYPES.SALESFORCE_TOKEN_EXPIRED:
			case GLOBAL_MODAL_TYPES.INTEGRATION_TOKEN_EXPIRED:
				return <IntegrationExpiredIMC {...props} />;
			case GLOBAL_MODAL_TYPES.MAIL_INTEGRATION_EXPIRED:
				return <MailIntegrationTokenExpiredIMC {...props} />;
			case GLOBAL_MODAL_TYPES.STOP_CADENCE:
			case GLOBAL_MODAL_TYPES.PAUSE_CADENCE:
				return <PauseOrStopRelatedLeadsModalDriver {...props} />;
			case GLOBAL_MODAL_TYPES.LINKEDIN_COOKIE_ERROR:
				return <LinkedinCookieErrorIMC {...props} />;
			case GLOBAL_MODAL_TYPES.CUSTOM_TASK:
				return <CustomTaskModal {...props} />;
			case GLOBAL_MODAL_TYPES.DATA_CHECK:
			case GLOBAL_MODAL_TYPES.EDIT_LEAD:
				return <EditLeadIMC {...props} />;
			case GLOBAL_MODAL_TYPES.WHATSAPP:
				return <WhatsappIMC {...props} />;
			default:
				return null;
		}
	};

	//using our simple onClose fn if developer forgets to sends custom onClose
	const onClose = () => {
		//clear session storage
		setInnerModalState(prev => ({
			...prev,
			modalProps: { ...prev.modalProps, isModal: false },
		}));
	};

	return (
		<Modal
			showCloseButton={true}
			disableOutsideClick={true}
			onClose={onClose}
			{...innerModalState.modalProps}
			//className should not beoveridden
			className={
				styles.modalContainer + " " + innerModalState?.modalProps?.className ?? ""
			}
		>
			{renderInnerModalComponent({
				type: innerModalState.type,
				...innerModalState.typeSpecificProps,
				...innerModalState.modalProps,
				innerModalState,
				setInnerModalState,
			})}
		</Modal>
	);
};

export default GlobalModals;
