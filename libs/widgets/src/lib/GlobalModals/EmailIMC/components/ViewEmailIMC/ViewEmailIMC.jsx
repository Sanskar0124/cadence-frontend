import { userInfo } from "@cadence-frontend/atoms";
import { Div } from "@cadence-frontend/components";
import { AVAILABLE_MAIL_ACTIONS, GLOBAL_MODAL_TYPES } from "@cadence-frontend/constants";
import { useEmail } from "@cadence-frontend/data-access";
import { Pause, Reply, ReplyAll, Stop } from "@cadence-frontend/icons";
import {
	Common as COMMON_TRANSLATION,
	Tasks as TASKS_TRANSLATION,
} from "@cadence-frontend/languages";
import { InputThemes, ThemedButtonThemes } from "@cadence-frontend/themes";
import { Colors, getMailData } from "@cadence-frontend/utils";
import { Editor, Input } from "@cadence-frontend/widgets";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import BackButton from "../../../../BackButton/BackButton";
import ThemedButton from "../../../../ThemedButton/ThemedButton";
import { REPLY_TYPES } from "../../constants";
import styles from "../../EmailIMC.module.scss";
import ReplyEmailIMC from "../ReplyEmailIMC/ReplyEmailIMC";

const ViewEmail = ({
	setInnerModalState,
	//typeSpecificProps
	message_id,
	lead,
	data,
	//modalProps
	onClose: modalOnClose,
	showPauseStopCadence,
	showPauseCadenceModal,
}) => {
	const user = useRecoilValue(userInfo);

	const mailDataAccess = useEmail({
		message_id,
	});
	const {
		fetchedMailData: mail,
		refetchMail,
		loadingMail,
		isDeleted,
		isProhibited,
		isTokenExpired,
	} = mailDataAccess;

	const [isReplyView, setIsReplyView] = useState(false);
	const [replyType, setReplyType] = useState(REPLY_TYPES.REPLY_NODE);
	const [mailData, setMailData] = useState({});
	const onClose = () => {
		if (typeof modalOnClose === "function") modalOnClose();
	};

	const handleReply = ({ replyAll }) => {
		// refetchMail();
		setIsReplyView(true);
		/*set reply type
		 * if replyAll is true, set reply type to reply all
		 * else set reply type to reply
		 * by default reply type should be reply node
		 */
		if (replyAll) setReplyType(REPLY_TYPES.REPLY_ALL);
		else setReplyType(REPLY_TYPES.REPLY);
	};

	useEffect(() => {
		refetchMail();
	}, [message_id]);

	const changeView = ({ type, typeSpecificProps }) => {
		if (type) {
			setInnerModalState({
				type: type,
				typeSpecificProps,
				modalProps: {
					isModal: true,
					onClose: () =>
						setInnerModalState(prev => ({
							...prev,
							modalProps: { ...prev.modalProps, isModal: false },
						})),
				},
			});
		}
	};

	useEffect(() => {
		if (isDeleted) changeView({ type: GLOBAL_MODAL_TYPES.MAIL_DELETED });
		if (isProhibited) changeView({ type: GLOBAL_MODAL_TYPES.MAIL_PROHIBTED });
		if (isTokenExpired)
			changeView({
				type: GLOBAL_MODAL_TYPES.MAIL_INTEGRATION_EXPIRED,
				typeSpecificProps: { title: AVAILABLE_MAIL_ACTIONS.VIEW.error },
			});
	}, [isDeleted, isProhibited, isTokenExpired]);

	useEffect(() => {
		setMailData(
			getMailData({
				lead: lead,
				to: mail?.sent ? mail?.to.address : mail?.from?.address,
				lead_full_name: `${lead?.first_name ?? ""} ${lead?.last_name ?? ""}`,
			})
		);
	}, [lead]);

	return (
		<div className={styles.viewEmailModal}>
			{isReplyView ? (
				<div className={styles.replyMailWrapper}>
					<div className={styles.header}>
						<div onClick={() => setIsReplyView(false)}>
							<BackButton
								text="back"
								onClick={() => {
									return null;
								}}
							/>
						</div>
					</div>
					<ReplyEmailIMC
						lead={lead}
						validateTask={false}
						incoming={data?.incoming}
						replyType={replyType}
						mailData={mailData}
						toReplyMail={mail}
						onClose={() => onClose()}
					/>
				</div>
			) : (
				<>
					<Div className={styles.from} loading={loadingMail}>
						<span>{COMMON_TRANSLATION.FROM[user?.language?.toUpperCase()]}</span>
						<Input
							value={mail?.from?.address}
							disabled={true}
							theme={InputThemes.TRANSPARENT}
						/>
					</Div>
					<Div className={styles.to} loading={loadingMail}>
						<span>{COMMON_TRANSLATION.TO[user?.language?.toUpperCase()]}</span>
						<Input
							value={mail?.to?.address}
							disabled={true}
							theme={InputThemes.TRANSPARENT}
						/>
					</Div>
					<Div className={styles.subject} loading={loadingMail}>
						<span>{COMMON_TRANSLATION.SUBJECT[user?.language?.toUpperCase()]}</span>{" "}
						<Input
							value={mail?.subject}
							theme={InputThemes.TRANSPARENT}
							disabled={true}
						/>
					</Div>
					<div className={styles.body}>
						<Editor
							height="50vh"
							width="50vw"
							value={mail?.textHtml ?? ""}
							files={mail?.attachments}
							setValue={val => null}
							loading={loadingMail}
							className={styles.editorContainer}
							disabled={true}
						></Editor>
					</div>
					{/* {data?.incoming && ( */}
					<div className={styles.viewMailFooter}>
						<ThemedButton
							width="fit-content"
							theme={ThemedButtonThemes.GREY}
							onClick={() => handleReply({ replyAll: false })}
							disabled={!mail}
						>
							<Reply color={Colors.lightBlue} /> <div>Reply</div>
						</ThemedButton>
						{(mail?.cc || mail?.bcc) && (
							<ThemedButton
								width="fit-content"
								theme={ThemedButtonThemes.GREY}
								onClick={() => handleReply({ replyAll: true })}
								disabled={!mail}
							>
								<ReplyAll size={"1em"} color={Colors.lightBlue} /> <div>Reply All</div>
							</ThemedButton>
						)}
						{/* <ThemedButton theme={ThemedButtonThemes.GREY} disabled={!mail}>
								{" "}
								<ArrowRight color={Colors.lightBlue} /> Forward{" "}
							</ThemedButton> */}
					</div>
					{/* )} */}
					{showPauseStopCadence && (
						<div className={styles.cadence}>
							<div className={styles.pause} onClick={showPauseCadenceModal}>
								<Pause color={Colors.lightBlue} />
								<span>
									{TASKS_TRANSLATION.PAUSE_CADENCE[user?.language?.toUpperCase()]}
								</span>
							</div>
							<div className={styles.stop}>
								<Stop color={Colors.lightBlue} />
								<span>
									{TASKS_TRANSLATION.STOP_CADENCE[user?.language?.toUpperCase()]}
								</span>
							</div>
						</div>
					)}
				</>
			)}
		</div>
	);
};

export default ViewEmail;
