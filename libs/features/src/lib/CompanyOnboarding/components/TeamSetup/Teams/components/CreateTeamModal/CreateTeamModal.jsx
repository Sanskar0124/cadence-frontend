/* eslint-disable no-console */
import { useState, useContext } from "react";
import { MessageContext } from "@cadence-frontend/contexts";

import styles from "./CreateTeamModal.module.scss";
import { Modal } from "@cadence-frontend/components";
import { DragNDropFile, Label, Input, ThemedButton } from "@cadence-frontend/widgets";
import { InputThemes, ThemedButtonThemes } from "@cadence-frontend/themes";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue } from "recoil";

const CreateTeamModal = ({ modal, setModal, dataAccess }) => {
	const { createSubDepartment: createTeam, createLoading, uploadProgress } = dataAccess;
	const { addError, addSuccess } = useContext(MessageContext);

	const [teamName, setTeamName] = useState("");
	const [teamLogo, setTeamLogo] = useState(null);
	const user = useRecoilValue(userInfo);

	// const [teamMembers, setTeamMembers] = useState(null);

	const handleClose = () => {
		setModal(false);
		setTeamName("");
		setTeamLogo(null);
		// setTeamMembers(null);
	};

	const handleSubmit = e => {
		e.preventDefault();
		if (teamName.trim() === "") {
			addError({ text: "Team name is required!" });
			return;
		}

		createTeam(
			{ name: teamName.trim(), imageFile: teamLogo },
			{
				onError: err => {
					addError({
						text: err.response?.data?.msg ?? "Some error occurred while creating team!",
						desc: err?.response?.data?.error ?? "Please contact support",
						cId: err?.response?.data?.correlationId,
					});
				},
				onSuccess: () => addSuccess("Team created successfully"),
			}
		);
		handleClose();
	};

	return (
		<Modal
			isModal={modal}
			className={styles.createCadenceModal}
			onClose={handleClose}
			showCloseButton
		>
			<div className={styles.heading}>
				<h3>{COMMON_TRANSLATION.SET_UP_NEW_GROUP[user?.language?.toUpperCase()]}</h3>
			</div>
			<div className={styles.main}>
				<div className={styles.inputGroup}>
					<Label required>
						{COMMON_TRANSLATION.GROUP_NAME[user?.language?.toUpperCase()]}
					</Label>
					<Input
						name="team name"
						value={teamName}
						setValue={setTeamName}
						className={styles.input}
						placeholder={COMMON_TRANSLATION.TYPE_HERE[user?.language?.toUpperCase()]}
						theme={InputThemes.WHITE_WITH_GREY_BORDER}
					/>
				</div>

				{/* <div className={styles.inputGroup}>
					<Label required>Team members</Label>
					<DragNDropFile
						placeholder="Drag and drop .csv file here"
						droppedFile={teamMembers}
						setDroppedFile={setTeamMembers}
						extnsAllowed={["csv"]}
					/>
				</div> */}

				<div className={styles.inputGroup}>
					<Label>{COMMON_TRANSLATION.GROUP_LOGO[user?.language?.toUpperCase()]}</Label>
					<DragNDropFile
						droppedFile={teamLogo}
						setDroppedFile={setTeamLogo}
						extnsAllowed={["jpeg", "png", "jpg"]}
					/>
				</div>
			</div>
			<div className={styles.footer}>
				<ThemedButton
					className={styles.createBtn}
					theme={ThemedButtonThemes.PRIMARY}
					onClick={handleSubmit}
					loading={createLoading}
				>
					<div>{COMMON_TRANSLATION.CREATE_NEW_GROUP[user?.language?.toUpperCase()]}</div>
				</ThemedButton>
			</div>
		</Modal>
	);
};

export default CreateTeamModal;
