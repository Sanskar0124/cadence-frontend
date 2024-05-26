import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useSubDepartment, useSubDepartments } from "@cadence-frontend/data-access";
import { MessageContext } from "@cadence-frontend/contexts";

import styles from "./TeamSettingsModal.module.scss";
import { Button, Modal } from "@cadence-frontend/components";
import { Delete } from "@cadence-frontend/icons";
import { DragNDropFile, Label, Input, ThemedButton } from "@cadence-frontend/widgets";
import { InputThemes, ThemedButtonThemes } from "@cadence-frontend/themes";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue } from "recoil";

import { VIEW_MODES } from "../../../constants";

const TeamSettingsModal = ({ modal, setModal, teamInfo, setViewMode }) => {
	const { addError, addSuccess } = useContext(MessageContext);
	const {
		updateData,
		updateDataLoading,
		updateImage,
		updateImageLoading,
		uploadProgress,
		deleteSubDepartment: deleteTeam,
		deleteLoading: deleteTeamLoading,
	} = useSubDepartment(teamInfo?.sd_id, false);

	const navigate = useNavigate();
	const [teamName, setTeamName] = useState("");
	const [teamLogo, setTeamLogo] = useState(null);
	const user = useRecoilValue(userInfo);

	useEffect(() => {
		if (teamInfo && modal) {
			setTeamName(teamInfo?.name);
		}
	}, [teamInfo, modal]);

	const handleClose = () => {
		setModal(false);
		setTeamName("");
		setTeamLogo(null);
	};

	const handleSubmit = e => {
		e.preventDefault();

		if (teamName.trim() === "") {
			addError({ text: "Group name is required!" });
			return;
		}

		if (teamName.trim() !== teamInfo?.name) {
			updateData(
				{ name: teamName.trim(), department_id: teamInfo.department_id },
				{
					onError: err => {
						addError({
							text: err.response?.data?.msg ?? "Failed to update group name!",
							desc: err?.response?.data?.error || "Please contact support",
							cId: err?.response?.data?.correlationId,
						});
					},
					onSuccess: () => addSuccess("Group name updated successfully"),
				}
			);
		}

		if (teamLogo) {
			updateImage(teamLogo, {
				onError: err => {
					addError({
						text: err.response?.data?.msg ?? "Failed to update group image!",
						desc: err?.response?.data?.error || "Please contact support",
						cId: err?.response?.data?.correlationId,
					});
				},
				onSuccess: () => addSuccess("Group image updated successfully"),
			});
		}

		handleClose();
	};

	const handleDelete = () => {
		deleteTeam(
			{},
			{
				onError: err => {
					addError({
						text: err.response?.data?.msg ?? "Error while deleting group!",
						desc: err?.response?.data?.error || "Please contact support",
						cId: err?.response?.data?.correlationId,
					});
				},
				onSuccess: () => {
					addSuccess("Group deleted successfully");
					setViewMode(VIEW_MODES.TEAMS);
				},
			}
		);
		handleClose();
	};

	return (
		<Modal
			isModal={modal}
			className={styles.teamSettingsModal}
			onClose={handleClose}
			showCloseButton
		>
			<div className={styles.heading}>
				<h3>{COMMON_TRANSLATION.GROUP_SETTINGS[user?.language?.toUpperCase()]}</h3>
				{teamInfo?.users_count > 1 && (
					<Button
						className={styles.deleteBtn}
						onClick={handleDelete}
						// disabled={teamInfo?.users_count === 0 ? false : true}
						btnwidth="fit-content"
					>
						<Delete /> {COMMON_TRANSLATION.DELETE_GROUP[user?.language?.toUpperCase()]}
					</Button>
				)}
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
						placeholder="Type here"
						theme={InputThemes.WHITE}
					/>
				</div>

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
					disabled={teamInfo?.name === teamName && !teamLogo}
					className={styles.saveBtn}
					theme={ThemedButtonThemes.PRIMARY}
					onClick={handleSubmit}
					loading={updateDataLoading || updateImageLoading || deleteTeamLoading}
					loadingText="Save changes"
				>
					<div>{COMMON_TRANSLATION.SAVE_CHANGES[user?.language?.toUpperCase()]}</div>
				</ThemedButton>
			</div>
		</Modal>
	);
};

export default TeamSettingsModal;
