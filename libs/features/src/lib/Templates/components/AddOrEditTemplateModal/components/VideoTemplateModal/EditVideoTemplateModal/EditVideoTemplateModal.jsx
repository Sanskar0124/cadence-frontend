import { userInfo } from "@cadence-frontend/atoms";
import { ROLES } from "@cadence-frontend/constants";
import { Close } from "@cadence-frontend/icons";
import { InputThemes, ThemedButtonThemes } from "@cadence-frontend/themes";
import { Tooltip } from "@cadence-frontend/components";
import { MessageContext } from "@cadence-frontend/contexts";
import { Input, Label, ThemedButton } from "@cadence-frontend/widgets";
import { useContext, useState } from "react";
import { useRecoilValue } from "recoil";
import { TEMPLATE_LEVELS, TEMPLATE_TYPES } from "../../../../../constants";
import styles from "./EditVideoTemplateModal.module.scss";
import {
	Common as COMMON_TRANSLATION,
	Templates as TEMPLATES_TRANSLATION,
} from "@cadence-frontend/languages";

const EditVideoTemplateModal = ({ template, handleClose, dataAccess }) => {
	const user = useRecoilValue(userInfo);
	const { updateTemplate, updateLoading } = dataAccess;
	const [input, setInput] = useState({});
	const { addError, addSuccess } = useContext(MessageContext);

	const handleUpdateVideoTemplate = () => {
		if (!input?.name?.trim()) {
			addError({ text: "Please enter the template name." });
			return;
		}

		const body = {
			name: input.name?.trim(),
			type: TEMPLATE_TYPES.VIDEO,
			sd_id: template?.sd_id,
			vt_id: template?.vt_id,
			level: template?.level,
			// user_id,template?.user``
		};

		updateTemplate(JSON.stringify(body), {
			onError: () => addError({ text: "Failed to update template." }),
			onSuccess: () => {
				addSuccess("Template saved");
				handleClose();
			},
		});
	};

	return (
		<div className={styles.editVideoTemplateModal}>
			<h3>{`${COMMON_TRANSLATION.EDIT[user?.language.toUpperCase()]} ${
				TEMPLATES_TRANSLATION.TEMPLATE[user?.language.toUpperCase()]
			}`}</h3>
			<div className={styles.main}>
				<div className={styles.inputbox}>
					<Label required>
						{TEMPLATES_TRANSLATION.TEMPLATE_NAME[user?.language.toUpperCase()]}
					</Label>
					<Input
						value={input}
						setValue={setInput}
						name="name"
						placeholder={TEMPLATES_TRANSLATION.ADD_A_NAME[user?.language.toUpperCase()]}
						theme={InputThemes.WHITE}
					/>
				</div>
				<ThemedButton
					theme={ThemedButtonThemes.PRIMARY}
					className={styles.saveBtn}
					onClick={() => handleUpdateVideoTemplate()}
					loading={updateLoading}
					width="100%"
					height="40px"
				>
					{COMMON_TRANSLATION.SAVE[user?.language?.toUpperCase()]}
				</ThemedButton>
			</div>
		</div>
	);
};

export default EditVideoTemplateModal;
