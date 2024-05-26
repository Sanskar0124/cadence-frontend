import { useState, useContext, useEffect } from "react";
import { useRecoilValue } from "recoil";

import { MessageContext } from "@cadence-frontend/contexts";
import { Modal } from "@cadence-frontend/components";
import { Input, Label, ThemedButton } from "@cadence-frontend/widgets";
import { InputThemes, ThemedButtonThemes } from "@cadence-frontend/themes";
import { getDuplicateLevel, getTextByRole } from "./utils.js";
import { Templates as TEMPLATES_TRANSLATION } from "@cadence-frontend/languages";

import { cleanRequestBody } from "../../utils";

import styles from "./DuplicateTemplateModal.module.scss";
import { userInfo } from "@cadence-frontend/atoms";
import { TEMPLATE_LEVELS } from "../../constants.js";

const DuplicateTemplateModal = ({ modal, setModal, dataAccess }) => {
	const user = useRecoilValue(userInfo);
	const { addError, addSuccess } = useContext(MessageContext);
	const { duplicateTemplate, duplicateLoading, refetchCount } = dataAccess;
	const [input, setInput] = useState({});

	useEffect(() => {
		if (modal)
			setInput({
				...modal,
				name: `${modal.name} (copy)`,
			});
	}, [modal]);

	const handleClose = () => {
		setModal(null);
	};

	const handleSubmit = () => {
		const findSdId = () => {
			if (input.level == TEMPLATE_LEVELS.USER || input.level === TEMPLATE_LEVELS.COMPANY)
				return null;
			else if (input.level === TEMPLATE_LEVELS.SUB_DEPARTMENT) return user.sd_id;
		};

		const findCompanyId = () => {
			if (
				input.level == TEMPLATE_LEVELS.USER ||
				input.level === TEMPLATE_LEVELS.SUB_DEPARTMENT
			)
				return null;
			else if (input.level === TEMPLATE_LEVELS.COMPANY) return user.company_id;
		};

		const body = {
			...input,
			sd_id: findSdId(),
			level: getDuplicateLevel(input, user),
			company_id: findCompanyId(),
		};

		delete body.Attachments;

		duplicateTemplate(cleanRequestBody(body), {
			onSuccess: data => {
				addSuccess("Template duplicated");
				refetchCount();
				handleClose();
			},
			onError: err => {
				addError({
					text: err?.response?.data?.msg,
					desc: err?.response?.data?.error,
					cId: err?.response?.data?.correlationId,
				});
			},
		});
	};

	return (
		<Modal isModal={modal} onClose={handleClose} showCloseButton>
			<div className={styles.modal}>
				<div className={styles.header}>
					<h3>
						{TEMPLATES_TRANSLATION.DUPLICATE_TEMPLATE[user?.language?.toUpperCase()]}
					</h3>
				</div>
				<p className={styles.text}>{getTextByRole(user?.role)}</p>
				<div className={styles.main}>
					<div className={styles.inputGroup}>
						<Label>Template Name</Label>
						<Input
							value={input}
							setValue={setInput}
							name="name"
							theme={InputThemes.WHITE}
							className={styles.input}
						/>
					</div>
				</div>
				<div className={styles.footer}>
					<ThemedButton
						className={styles.btn}
						theme={ThemedButtonThemes.PRIMARY}
						loading={duplicateLoading}
						onClick={handleSubmit}
					>
						<div>
							{TEMPLATES_TRANSLATION.DUPLICATE_TEMPLATE[user?.language?.toUpperCase()]}
						</div>
					</ThemedButton>
				</div>
			</div>
		</Modal>
	);
};

export default DuplicateTemplateModal;
