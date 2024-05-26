import React, { useEffect, useState } from "react";
import { Div, Modal } from "@cadence-frontend/components";
import styles from "./ImportTemplateModal.module.scss";
import { useTemplateImport } from "@cadence-frontend/data-access";
import { Checkbox, InputRadio, ThemedButton } from "@cadence-frontend/widgets";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import {
	Templates as TEMPLATES_TRANSLATION,
	Common as COMMON_TRANSLATION,
} from "@cadence-frontend/languages";
import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue } from "recoil";

const TEMPLATE_ID_TYPES = {
	sms: "mt_id",
	email: "et_id",
	linkedin: "lt_id",
	script: "st_id",
	whatsapp: "wt_id",
};

const ImportTemplateModal = ({ modal, setModal, setTemplate }) => {
	const [isAutoMail, setIsAutoMail] = useState(false);
	const [selected, setSelected] = useState(null);
	const onClose = () => {
		setModal(false);
		setSelected(null);
		setIsAutoMail(false);
	};
	const user = useRecoilValue(userInfo);
	const {
		templates: templatesData,
		templateLoading,
		refetch,
	} = useTemplateImport({
		templateLevel: null,
		templateType: modal?.type,
	});

	useEffect(() => {
		if (modal) {
			refetch();
			if (modal.type === "email") {
				if (modal.mailType === "auto") {
					setIsAutoMail(true);
					setSelected([]);
				}
			}
		}
	}, [modal]);

	const onSave = template => {
		let templateToSave = template;
		setTemplate(templateToSave);
		onClose();
	};

	const onAddBlankTempalte = () => {
		setTemplate([
			{
				name: "New mail",
				subject: "",
				body: "",
				Attachments: [],
			},
		]);
		onClose();
	};
	console.log(selected, templatesData, "HelloooWhatsaop");
	return (
		<Modal
			isModal={modal ? true : false}
			onClose={onClose}
			className={styles.modal}
			showCloseButton
		>
			<h2 className={styles.title}>
				{TEMPLATES_TRANSLATION.CHOOSE_TEMPLATE[user?.language?.toUpperCase()]}
			</h2>
			{templateLoading ? (
				<div className={styles.placeholder}>
					{[...Array(3).keys()].map(() => (
						<Div loading />
					))}
				</div>
			) : (
				<div className={styles.templateBox}>
					{templatesData?.length > 0 ? (
						templatesData?.map(template => (
							<div className={styles.template}>
								{isAutoMail ? (
									<Checkbox
										className={styles.checkbox}
										checked={selected?.includes(template)}
										value={template}
										onChange={() => {
											selected?.includes(template)
												? setSelected(prev =>
														prev.filter(m => m.et_id !== template.et_id)
												  )
												: setSelected(prev => [...prev, template]);
										}}
									/>
								) : (
									<InputRadio
										size={24}
										className={styles.radio}
										checked={
											selected?.[TEMPLATE_ID_TYPES[modal?.type]] ===
											template[TEMPLATE_ID_TYPES[modal?.type]]
										}
										value={template}
										onChange={() => setSelected(template)}
									/>
								)}
								<span className={styles.name}>{template.name}</span>
							</div>
						))
					) : (
						<span className={styles.fallback}>
							{TEMPLATES_TRANSLATION.NO_TEMPLATES_PRESENT[user?.language?.toUpperCase()]}
						</span>
					)}
				</div>
			)}
			{isAutoMail && (
				<ThemedButton
					width="fit-content"
					className={styles.blankBtn}
					theme={ThemedButtonThemes.GREY}
					onClick={onAddBlankTempalte}
				>
					{TEMPLATES_TRANSLATION.ADD_BLANK_TEMPLATE[user?.language?.toUpperCase()]}
				</ThemedButton>
			)}
			<ThemedButton
				className={styles.saveBtn}
				theme={ThemedButtonThemes.PRIMARY}
				onClick={() => onSave(selected)}
			>
				{COMMON_TRANSLATION.SAVE[user?.language?.toUpperCase()]}
			</ThemedButton>
		</Modal>
	);
};

export default ImportTemplateModal;
