import { InputThemes, ThemedButtonThemes } from "@cadence-frontend/themes";
import { userInfo } from "@cadence-frontend/atoms";
import { Modal, Title } from "@cadence-frontend/components";
import { Input, Label, ThemedButton } from "@cadence-frontend/widgets";
import { useState, useContext } from "react";
import { useRecoilValue } from "recoil";
import { useNavigate } from "react-router-dom";
import styles from "./ImportSheetModal.module.scss";
import { getSampleSheetsUrl, navigateToSheetsImport } from "../../constants";
import { MessageContext } from "@cadence-frontend/contexts";

const ImportSheetModal = ({ modal, setModal, cadence }) => {
	const navigate = useNavigate();
	const user = useRecoilValue(userInfo);
	const { addError } = useContext(MessageContext);
	const [sheetUrl, setSheetUrl] = useState("");

	const onImport = async () => {
		if (sheetUrl.split("/").length !== 7) return addError({ text: "Invalid Sheet Url" });
		navigateToSheetsImport(sheetUrl, user.integration_type, cadence, navigate);
	};

	const onClose = () => {
		setSheetUrl("");
		setModal(false);
	};

	return (
		<Modal
			isModal={modal}
			onClose={onClose}
			showCloseButton
			leftCloseIcon
			className={styles.importSheetModal}
		>
			<Title size="1.1rem" className={styles.title}>
				Import leads
			</Title>
			<div className={styles.inputGroup}>
				<Label>Enter Google sheet link</Label>
				<Input
					height="50px"
					name="google_sheet_link"
					value={sheetUrl}
					setValue={setSheetUrl}
					className={styles.input}
					placeholder="Enter link"
					theme={InputThemes.WHITE}
				/>
			</div>
			<div className={styles.sampleLink}>
				<a
					href={getSampleSheetsUrl(user?.integration_type)}
					target="_blank"
					rel="noreferrer"
					download
				>
					Sample Google sheet
				</a>
			</div>
			<ThemedButton onClick={onImport} theme={ThemedButtonThemes.PRIMARY}>
				Import leads
			</ThemedButton>
		</Modal>
	);
};

export default ImportSheetModal;
