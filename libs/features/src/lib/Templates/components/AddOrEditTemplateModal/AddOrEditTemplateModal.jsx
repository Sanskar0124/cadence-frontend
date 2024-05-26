// components
import { Modal } from "@cadence-frontend/components";
import EmailTemplateModal from "./components/EmailTemplateModal/EmailTemplateModal";
import LinkedinTemplateModal from "./components/LinkedinTemplateModal/LinkedinTemplateModal";
import ScriptTemplateModal from "./components/ScriptTemplateModal/ScriptTemplateModal";
import SmsTemplateModal from "./components/SmsTemplateModal/SmsTemplateModal";

// constants
import { TEMPLATE_TYPES } from "../../constants";
import { useState } from "react";
import styles from "./AddOrEditTemplateModal.module.scss";
import AddTemplateModal from "./components/AddTemplateModal/AddTemplateModal";
import EditVideoTemplateModal from "./components/VideoTemplateModal/EditVideoTemplateModal/EditVideoTemplateModal";
import WhatsappTemplateModal from "./components/WhatsappTemplateModal/WhatsappTemplateModal";

const AddOrEditTemplateModal = ({
	modal,
	duplicate,
	setModal,
	setDuplicateModal,
	setDeleteModal,
	template,
	setTemplate,
	templateType,
	templateLevel,
	dataAccess,
	setSidebarState,
}) => {
	const [isEmailType, setIsEmailType] = useState(true);
	const renderComponent = () => {
		if (modal?.isAdd === true) {
			return (
				<AddTemplateModal
					templateType={templateType}
					handleClose={handleClose}
					dataAccess={dataAccess}
					templateLevel={templateLevel}
					setIsEmailType={setIsEmailType}
				/>
			);
		} else {
			switch (templateType) {
				case TEMPLATE_TYPES.SMS:
					return (
						<SmsTemplateModal
							template={template}
							duplicate={duplicate}
							setTemplate={setTemplate}
							setDeleteModal={setDeleteModal}
							templateLevel={templateLevel}
							handleClose={handleClose}
							dataAccess={dataAccess}
							templateType={templateType}
						/>
					);

				case TEMPLATE_TYPES.LINKEDIN:
					return (
						<LinkedinTemplateModal
							template={template}
							duplicate={duplicate}
							setTemplate={setTemplate}
							setDeleteModal={setDeleteModal}
							templateLevel={templateLevel}
							handleClose={handleClose}
							dataAccess={dataAccess}
							templateType={templateType}
						/>
					);

				case TEMPLATE_TYPES.EMAIL:
					return (
						<EmailTemplateModal
							template={template}
							duplicate={duplicate}
							setTemplate={setTemplate}
							setDeleteModal={setDeleteModal}
							templateLevel={templateLevel}
							handleClose={handleClose}
							dataAccess={dataAccess}
							templateType={templateType}
						/>
					);

				case TEMPLATE_TYPES.SCRIPT:
					return (
						<ScriptTemplateModal
							template={template}
							duplicate={duplicate}
							setTemplate={setTemplate}
							setDeleteModal={setDeleteModal}
							templateLevel={templateLevel}
							handleClose={handleClose}
							dataAccess={dataAccess}
							templateType={templateType}
						/>
					);

				case TEMPLATE_TYPES.VIDEO:
					return (
						<EditVideoTemplateModal
							template={template}
							handleClose={handleClose}
							dataAccess={dataAccess}
						/>
					);
				case TEMPLATE_TYPES.WHATSAPP:
					return (
						<WhatsappTemplateModal
							template={template}
							duplicate={duplicate}
							setTemplate={setTemplate}
							setDeleteModal={setDeleteModal}
							templateLevel={templateLevel}
							handleClose={handleClose}
							dataAccess={dataAccess}
							templateType={templateType}
						/>
					);
				default:
					return null;
			}
		}
	};

	const handleClose = () => {
		setTemplate(null);
		setDeleteModal(false);
		setModal(false);
		setDuplicateModal(false);
		setSidebarState(null);
	};

	return (
		<Modal
			isModal={modal}
			onClose={handleClose}
			showCloseButton
			className={
				TEMPLATE_TYPES.VIDEO === templateType
					? styles.videoModal
					: isEmailType
					? styles.modal
					: styles.videoModal
			}
			disableOutsideClick
		>
			{renderComponent()}
		</Modal>
	);
};

export default AddOrEditTemplateModal;
