import { useState, useEffect, useContext } from "react";
import { useUserInviteNJoin } from "@cadence-frontend/data-access";
import { MessageContext } from "@cadence-frontend/contexts";

import styles from "./InvitationModal.module.scss";
import { Modal } from "@cadence-frontend/components";
import { Label, ThemedButton } from "@cadence-frontend/widgets";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import {
	Common as COMMON_TRANSLATION,
	Settings as SETTINGS_TRANSLATION,
} from "@cadence-frontend/languages";
import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue } from "recoil";
import BoxInvite from "./components/BoxInvite/BoxInvite";

const InvitationModal = ({ modal, setModal, invitingMembers }) => {
	const { sendRequest, sendRequestLoading } = useUserInviteNJoin();
	const { addError, addSuccess } = useContext(MessageContext);
	const user = useRecoilValue(userInfo);

	const [invitees, setInvitees] = useState([]);

	useEffect(() => {
		if (invitingMembers && modal) {
			setInvitees(invitingMembers);
		}
	}, [invitingMembers, modal]);

	const handleClose = () => {
		setModal(false);
		setInvitees([]);
	};

	const handleSubmit = () => {
		if (invitees.length === 0) {
			addError({ text: "No invitee is added!" });
			return;
		}

		sendRequest(
			invitees.map(invitee => invitee.user_id),
			{
				onError: err => {
					addError({
						text:
							err.response?.data?.msg ??
							"Some error occured while sending invitation request!",
						desc: err?.response?.data?.error ?? "Please contact support",
						cId: err?.response?.data?.correlationId,
					});
				},
				onSuccess: res => addSuccess(res.msg),
			}
		);
		handleClose();
	};

	return (
		<Modal
			isModal={modal}
			className={styles.invitationModal}
			onClose={handleClose}
			showCloseButton
		>
			<div className={styles.heading}>
				<h3>
					{SETTINGS_TRANSLATION.SEND_INVITATION_REQUEST[user?.language?.toUpperCase()]}
				</h3>
			</div>
			<div className={styles.main}>
				<div className={styles.inputGroup}>
					<Label>{COMMON_TRANSLATION?.TO[user?.language?.toUpperCase()]}</Label>
					<BoxInvite invitees={invitees} setInvitees={setInvitees} />
				</div>
			</div>
			<div className={styles.footer}>
				<ThemedButton
					className={styles.sendBtn}
					theme={ThemedButtonThemes.PRIMARY}
					onClick={handleSubmit}
					loading={sendRequestLoading}
				>
					<div>{COMMON_TRANSLATION.SEND_REQUEST[user?.language?.toUpperCase()]}</div>
				</ThemedButton>
			</div>
		</Modal>
	);
};

export default InvitationModal;
