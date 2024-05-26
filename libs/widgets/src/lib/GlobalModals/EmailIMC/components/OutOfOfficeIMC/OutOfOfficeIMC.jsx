import { useState, useEffect } from "react";

import { ThemedButton } from "@cadence-frontend/widgets";
import { useCadenceSettings, useEmail, useUser } from "@cadence-frontend/data-access";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { Colors, getMailData, getLabelFromEnum } from "@cadence-frontend/utils";
import { Tooltip } from "@cadence-frontend/components";

import { Pause, Stop } from "@cadence-frontend/icons";
import styles from "../../EmailIMC.module.scss";
import oofStyles from "./OutOfOfficeIMC.module.scss";
import ShortEmailView from "../ShortEmailView/ShortEmailView";
import {
	AVAILABLE_MAIL_ACTIONS,
	GLOBAL_MODAL_TYPES,
	CADENCE_STATUS,
} from "@cadence-frontend/constants";

const OutOfOfficeIMC = ({
	setInnerModalState,
	//typeSpecificProps
	lead,
	replied_node_id,
	toReplyMail,
	markTaskAsCompleteIfCurrent,
	incoming,
	data: { message_id, sent_message_id, cadence_id, ...info },
	//modalProps
	onClose,
	replyType,
	refetchLead,
	...rest
}) => {
	const { user } = useUser({ user: true });
	const sentMailAccess = useEmail({
		message_id: sent_message_id,
	});
	const receivedMailAccess = useEmail({
		message_id: message_id,
	});
	useCadenceSettings({ companySettings: true });

	const {
		fetchedMailData: sentMail,
		refetchMail: refetchSentMail,
		loadingMail: loadingSentMail,
		isDeleted: isSentDeleted,
		isProhibited: isSentProhibited,
		isTokenExpired: isSentTokenExpired,
	} = sentMailAccess;

	const {
		fetchedMailData: toReplyMailState,
		refetchMail: refetchReceivedMail,
		loadingMail: loadingReceivedMail,
		isDeleted: isReceivedDeleted,
		isProhibited: isReceivedProhibited,
		isTokenExpired: isReceivedTokenExpired,
	} = receivedMailAccess;

	const [cadence, setCadence] = useState();
	const changeView = ({ type, typeSpecificProps }) => {
		if (type) {
			setInnerModalState({
				type: type,
				typeSpecificProps,
				modalProps: {
					isModal: true,
					leftCloseIcon: true,
					onClose: () =>
						setInnerModalState(prev => ({
							...prev,
							modalProps: { ...prev.modalProps, isModal: false },
						})),
					goBackTo: GLOBAL_MODAL_TYPES.OUT_OF_OFFICE,
				},
			});
		}
	};

	const handleCadence = ({ type }) => {
		changeView({
			type: type,
			typeSpecificProps: {
				cadence_id,
				lead,
				refetchLead,
				activity: { ...info, cadence_id },
			},
		});
	};
	useEffect(() => {
		if (isSentDeleted || isReceivedDeleted)
			changeView({ type: GLOBAL_MODAL_TYPES.MAIL_DELETED });
		if (isSentProhibited || isReceivedProhibited)
			changeView({ type: GLOBAL_MODAL_TYPES.MAIL_PROHIBTED });
		if (isSentTokenExpired || isReceivedTokenExpired)
			changeView({
				type: GLOBAL_MODAL_TYPES.MAIL_INTEGRATION_EXPIRED,
				typeSpecificProps: { title: AVAILABLE_MAIL_ACTIONS.VIEW.error },
			});
	}, [
		isSentDeleted,
		isReceivedDeleted,
		isSentProhibited,
		isReceivedProhibited,
		isSentTokenExpired,
		isReceivedTokenExpired,
	]);

	useEffect(() => {
		refetchSentMail();
	}, [sent_message_id]);

	useEffect(() => {
		refetchReceivedMail();
	}, [message_id]);

	useEffect(() => {
		if (lead && cadence_id) {
			if (lead?.LeadToCadences?.[0]?.Cadences)
				setCadence(
					lead?.LeadToCadences?.filter(
						cadence => cadence.Cadences?.[0]?.cadence_id === cadence_id
					)?.[0]
				);
			else
				setCadence(
					lead?.LeadToCadences?.filter(
						cadence => parseInt(cadence?.cadence_id) === cadence_id
					)?.[0]
				);
		}
	}, [lead, cadence_id]);

	return (
		<div className={styles.innerModalComponent}>
			<div className={styles.subjectHeader}>
				Subject <span>{toReplyMailState?.headers?.subject}</span>
			</div>
			<ShortEmailView
				replyToMailData={getMailData({
					subject: sentMail?.headers?.subject,
					timeStamp: sentMail?.headers?.date,
					body: sentMail?.textHtml,
					from: sentMail?.headers?.from.substring(
						sentMail?.headers?.from.indexOf("<") + 1,
						sentMail?.headers?.from.indexOf(">")
					),
					cc: sentMail?.headers?.cc,
					bcc: sentMail?.headers?.bcc,
					from_full_name: user?.first_name + " " + user?.last_name,
				})}
				loading={loadingReceivedMail || loadingSentMail}
				incoming={incoming}
			/>
			<div className={styles.body}>
				<ShortEmailView
					replyToMailData={getMailData({
						subject: toReplyMailState?.headers?.subject,
						timeStamp: toReplyMailState?.headers?.date,
						body: toReplyMailState?.textHtml,
						from: toReplyMailState?.headers?.from.substring(
							toReplyMailState?.headers?.from.indexOf("<") + 1,
							toReplyMailState?.headers?.from.indexOf(">")
						),
						cc: toReplyMailState?.headers?.cc,
						bcc: toReplyMailState?.headers?.bcc,
						from_full_name: lead?.full_name,
					})}
					loading={loadingReceivedMail || loadingSentMail}
					incoming={true}
					second={true}
				/>
			</div>
			<div className={oofStyles.footer}>
				{cadence_id && (
					<div className={oofStyles.cadence}>
						<Tooltip
							text={
								cadence?.Cadence?.[0]?.status === CADENCE_STATUS.NOT_STARTED ||
								cadence?.Cadence?.[0]?.status === CADENCE_STATUS.PAUSED ||
								cadence?.Cadence?.[0]?.status === CADENCE_STATUS.PROCESSING
									? `Cadence ${getLabelFromEnum(cadence.status)}`
									: cadence?.status === CADENCE_STATUS.STOPPED
									? "Lead Stopped"
									: "Stop for lead"
							}
							className={styles.stopTooltip}
						>
							<ThemedButton
								width="fit-content"
								theme={ThemedButtonThemes.GREY}
								style={{
									fontWeight: 600,
									height: "3em",
									minWidth: "6em",
									borderRadius: "10px",
								}}
								disabled={
									cadence?.Cadence?.[0]?.status === CADENCE_STATUS.NOT_STARTED ||
									cadence?.Cadence?.[0]?.status === CADENCE_STATUS.PAUSED ||
									cadence?.Cadence?.[0]?.status === CADENCE_STATUS.PROCESSING ||
									cadence?.status === CADENCE_STATUS.STOPPED ||
									cadence?.status === CADENCE_STATUS.PAUSED
								}
								onClick={() => handleCadence({ type: GLOBAL_MODAL_TYPES.PAUSE_CADENCE })}
							>
								<Pause color={Colors.lightBlue} />
								<span>Pause Cadence</span>
							</ThemedButton>
						</Tooltip>
						<Tooltip
							text={
								cadence?.Cadence?.[0]?.status === CADENCE_STATUS.NOT_STARTED ||
								cadence?.Cadence?.[0]?.status === CADENCE_STATUS.PAUSED ||
								cadence?.Cadence?.[0]?.status === CADENCE_STATUS.PROCESSING
									? `Cadence ${getLabelFromEnum(cadence.status)}`
									: cadence?.status === CADENCE_STATUS.STOPPED
									? "Lead Stopped"
									: cadence?.status === CADENCE_STATUS.PAUSED
									? "Lead Paused"
									: "Pause for lead"
							}
							className={styles.stopTooltip}
						>
							<ThemedButton
								width="fit-content"
								theme={ThemedButtonThemes.GREY}
								style={{
									fontWeight: 600,
									height: "3em",
									minWidth: "6em",
									borderRadius: "10px",
								}}
								disabled={
									cadence?.Cadence?.[0]?.status === CADENCE_STATUS.NOT_STARTED ||
									cadence?.Cadence?.[0]?.status === CADENCE_STATUS.PAUSED ||
									cadence?.Cadence?.[0]?.status === CADENCE_STATUS.PROCESSING ||
									cadence?.status === CADENCE_STATUS.STOPPED
								}
								// onClick={() => handleReply({ replyAll: true })}
								onClick={() => handleCadence({ type: GLOBAL_MODAL_TYPES.STOP_CADENCE })}
							>
								<Stop color={Colors.lightBlue} />
								<span>Stop Cadence</span>
							</ThemedButton>
						</Tooltip>
					</div>
				)}
			</div>
		</div>
	);
};

export default OutOfOfficeIMC;
