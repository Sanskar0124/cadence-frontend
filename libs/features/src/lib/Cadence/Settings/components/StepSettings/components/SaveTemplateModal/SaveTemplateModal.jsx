import React, { useContext, useState, useEffect, useCallback } from "react";
import { Modal, Title } from "@cadence-frontend/components";
import styles from "./SaveTemplateModal.module.scss";
import { useTemplate } from "@cadence-frontend/data-access";
import { Input, Label, Select, ThemedButton } from "@cadence-frontend/widgets";
import { MessageContext } from "@cadence-frontend/contexts";
import { InputThemes, ThemedButtonThemes } from "@cadence-frontend/themes";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";
import {
	TEMPLATE_LEVELS_OPTIONS,
	TEMPLATE_LEVELS,
	TEMPLATE_TYPES,
} from "../../../../../../Templates/constants";
import { ROLES } from "@cadence-frontend/constants";

import { useSubDepartments } from "@cadence-frontend/data-access";
import {
	getTeamsOptions,
	getUsersOptions,
} from "../../../../../components/CreateCadenceModal/utils";
import { getCreateTemplateOptions } from "../../../../../../Templates/utils";
import {
	Common as COMMON_TRANSLATION,
	Cadence as CADENCE_TRANSLATION,
} from "@cadence-frontend/languages";
import { Templates as TEMPLATES_TRANSLATION } from "@cadence-frontend/languages";

const TEMPLATE_ID_TYPES = {
	sms: "mt_id",
	email: "et_id",
	linkedin: "lt_id",
	script: "st_id",
	whatsapp: "wt_id",
};

const SaveTemplateModal = ({ modal, setModal, setInput, setTemplate, setFiles }) => {
	const { addError, addSuccess } = useContext(MessageContext);
	const [name, setName] = useState("");
	const user = useRecoilValue(userInfo);

	const { subDepartments } = useSubDepartments(true);

	const [userInput, setUserInput] = useState({
		level: TEMPLATE_LEVELS.USER,
		sd_id: null,
		company_id: null,
	});

	const { createTemplate, KEY, queryClient, createLoading } = useTemplate({
		templateLevel: userInput.level,
		templateType: modal?.type,
	});

	useEffect(() => {
		switch (userInput.level) {
			case TEMPLATE_LEVELS.COMPANY:
				setUserInput({
					...userInput,
					sd_id: null,
					company_id: user.company_id,
				});
				break;
			default:
				setUserInput({
					...userInput,
					sd_id: null,
					company_id: null,
				});
				break;
		}
	}, [userInput.level]);

	const onClose = () => {
		setModal(false);
		setName("");
	};

	const findGroupId = () => {
		if (userInput.level === TEMPLATE_LEVELS.SUB_DEPARTMENT) {
			if (user.role === ROLES.SALES_MANAGER) return user.sd_id;
			else if (user.role === ROLES.ADMIN || user.role === ROLES.SUPER_ADMIN)
				return userInput.sd_id;
		} else return null;
	};

	const onSave = () => {
		let body;
		if (modal.type === "email") {
			const formData = new FormData();
			formData.append("name", name);
			formData.append("subject", modal.body.subject);
			formData.append("body", modal.body.body);
			formData.append("linkText", modal.body.linkText);
			formData.append("redirectUrl", modal.body.redirectUrl);
			formData.append("level", userInput.level);
			formData.append("type", TEMPLATE_TYPES.EMAIL);
			formData.append("sd_id", findGroupId());
			formData.append(
				"company_id",
				userInput.level === TEMPLATE_LEVELS.COMPANY ? user.company_id : null
			);
			for (let i = 0; i < modal.body.attachments?.length; i++) {
				formData.append(`attachments`, modal.body.attachments[i]);
			}
			body = {
				name: name?.trim(),
				subject: modal?.body?.subject,
				body: modal?.body?.body,
				linkText: modal?.body?.linkText ?? "undefined",
				redirectUrl: modal.body.redirectUrl ?? "undefined",
				level: userInput?.level,
				type: TEMPLATE_TYPES.EMAIL,
				sd_id: findGroupId(),
				company_id: userInput.level === TEMPLATE_LEVELS.COMPANY ? user.company_id : null,
				attachment_ids: modal.body.attachments?.map(
					attachment => attachment?.attachment_id
				),
			};
		} else {
			body = { name, ...modal.body, type: modal.type, ...userInput };
			body.sd_id = findGroupId();
			body.company_id =
				userInput.level === TEMPLATE_LEVELS.COMPANY ? user.company_id : null;
		}

		createTemplate(body, {
			onError: (err, _, context) => {
				addError({
					text: err.response?.data?.msg,
					desc: err?.response?.data?.error ?? "Please contact support",
					cId: err?.response?.data?.correlationId,
				});
				queryClient.setQueryData(KEY, context.previousTemplates);
			},
			onSuccess: data => {
				setTemplate(data.data);
				addSuccess("Template saved");
				onClose();
				if (modal.type === "email") {
					setInput(prev => ({ ...prev, et_id: data.data?.et_id }));
					setFiles(modal.body.attachments);
				} else {
					setInput(prev => ({
						...prev,
						template_id: data.data?.[TEMPLATE_ID_TYPES[modal.type]],
						template_type: modal.type,
					}));
					setFiles(modal.body.attachments);
				}
			},
		});
	};

	const renderDropdown = () => {
		if (user?.role === ROLES.ADMIN || user?.role === ROLES.SUPER_ADMIN)
			switch (userInput?.level) {
				case TEMPLATE_LEVELS.SUB_DEPARTMENT:
					return (
						<div className={styles.groupInputBox}>
							<Label>
								{COMMON_TRANSLATION.GROUP_NAME[user?.language?.toUpperCase()]}
							</Label>
							<Select
								options={getTeamsOptions(subDepartments)}
								value={userInput}
								setValue={setUserInput}
								name="sd_id"
								isSearchable={true}
								placeholder={COMMON_TRANSLATION.SELECT[user?.language?.toUpperCase()]}
							/>
						</div>
					);

				default:
					return null;
			}
	};

	return (
		<Modal
			isModal={modal ? true : false}
			onClose={onClose}
			className={styles.modal}
			showCloseButton
		>
			<Title size="1.2rem" className={styles.title}>
				{TEMPLATES_TRANSLATION.SAVE_AS_TEMPLATE[user?.language?.toUpperCase()]}
			</Title>
			<div className={styles.inputBox}>
				<Label required>
					{CADENCE_TRANSLATION?.TEMPLATE_NAME?.[user?.language?.toUpperCase()]}
				</Label>
				<Input
					value={name}
					setValue={setName}
					placeholder="Enter name"
					theme={InputThemes.WHITE}
				/>
			</div>
			<div className={styles.inputBox}>
				<Label>
					{TEMPLATES_TRANSLATION.TEMPLATE_LEVEL[user?.language?.toUpperCase()]}
				</Label>
				<Select
					options={getCreateTemplateOptions(user?.role, user)}
					value={userInput}
					setValue={setUserInput}
					name="level"
					placeholder={COMMON_TRANSLATION.SELECT[user?.language?.toUpperCase()]}
				/>
			</div>
			{renderDropdown()}
			{
				<ThemedButton
					className={styles.saveBtn}
					loading={createLoading}
					theme={ThemedButtonThemes.PRIMARY}
					onClick={onSave}
				>
					{COMMON_TRANSLATION.SAVE[user?.language?.toUpperCase()]}
				</ThemedButton>
			}
		</Modal>
	);
};

export default SaveTemplateModal;
