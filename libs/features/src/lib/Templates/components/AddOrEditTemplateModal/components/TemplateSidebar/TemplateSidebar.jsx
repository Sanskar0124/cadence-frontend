import { useState, useContext, useEffect } from "react";
import ReactHtmlParser from "react-html-parser";
import {
	AtrManualEmail,
	Bounced,
	ClickGradient,
	Close,
	Copy,
	CopyBlank,
	Download,
	Edit,
	More,
	ReplyGradient,
	Share,
	Statistics,
	Trash,
	UnsubscribeRed,
	ViewGradient,
} from "@cadence-frontend/icons";
import { Button, Tooltip } from "@cadence-frontend/components";
import {
	TEMPLATE_LEVELS,
	TEMPLATE_SIDEBAR_OPTIONS,
	TEMPLATE_TYPES,
} from "../../../../constants";
import { DropDown, ThemedButton } from "@cadence-frontend/widgets";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import SendTestMailModal from "../../../SendTestMailModal/SendTestMailModal";
import styles from "./TemplateSidebar.module.scss";
import { isActionPermitted, isDropDownEnabled } from "../../../../utils";
import { ACTIONS } from "../../../../constants";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";
import {
	Templates as TEMPLATES_TRANSLATION,
	Common as COMMON_TRANSLATION,
	Statistics as STATISTICS_TRANSLATION,
} from "@cadence-frontend/languages";
import { TemplateSidebarPlayer } from "@cadence-frontend/widgets";
import { useAttachments } from "@cadence-frontend/data-access";
import { MessageContext } from "@cadence-frontend/contexts";
const ICON_SIZE = "18px";

const TemplateSidebar = ({
	sidebarState,
	onSidebarClose,
	template,
	templateType,
	setTemplate,
	setShareModal,

	setDuplicateModal,
	setAddEditModal,
	setDeleteModal,
	templateLevel,
	setSendTestMailModal,
}) => {
	const onClose = e => {
		onSidebarClose(e);
		e.stopPropagation();
	};

	const { downloadAttachmentURL } = useAttachments();
	const { addError } = useContext(MessageContext);
	const user = useRecoilValue(userInfo);
	const [usedTimes, setUsedTimes] = useState(0);

	useEffect(() => {
		if (template) {
			let usedTimesValue = 0;
			switch (templateType) {
				case TEMPLATE_TYPES.VIDEO:
					usedTimesValue = template?.Video_Trackings[0]?.sent ?? 0;
					break;

				default:
					usedTimesValue = template.sent ?? 0;
					break;
			}
			setUsedTimes(usedTimesValue);
		}
	}, [template]);

	const handleModifyClick = e => {
		setTemplate(template);
		setAddEditModal(true);
		e.stopPropagation();
	};

	const handleDeleteClick = e => {
		setTemplate(template);
		setDeleteModal(true);
		e.stopPropagation();
	};

	const handleShareClick = (e, template) => {
		e.stopPropagation();
		setShareModal(template);
	};

	const handleDuplicateClick = (e, template) => {
		setDuplicateModal(template);
		e.stopPropagation();
	};
	const handleSendTestEmailClick = e => {
		e.stopPropagation();
		setSendTestMailModal(template);
	};

	const renderText = () => {
		switch (templateType) {
			case TEMPLATE_TYPES.EMAIL:
				return ReactHtmlParser(template?.body) || "";

			case TEMPLATE_TYPES.SMS:
			case TEMPLATE_TYPES.LINKEDIN:
			case TEMPLATE_TYPES.WHATSAPP:
				return template?.message;

			case TEMPLATE_TYPES.SCRIPT:
				return ReactHtmlParser(template?.script) || "";

			default:
				return "";
		}
	};

	const isDropDownDisabled = !isDropDownEnabled(
		[ACTIONS.DUPLICATE, ACTIONS.SHARE, ACTIONS.DELETE],
		templateLevel,
		user.role,
		user.user_id === template?.user_id
	);

	const showFilter = sidebarState === TEMPLATE_SIDEBAR_OPTIONS.FILTER;
	const showCard = sidebarState === TEMPLATE_SIDEBAR_OPTIONS.TEMPLATE_DATA;
	const showStats = sidebarState === TEMPLATE_SIDEBAR_OPTIONS.STAT_DATA;

	const downloadAttachment = file => {
		if (!document || !file?.attachment_id) return;
		downloadAttachmentURL(file?.attachment_id, {
			onSuccess: res => {
				const link = document.createElement("a");
				link.href = res;
				link.setAttribute("download", file?.original_name ?? "download");
				document.body?.appendChild(link);
				link.click();
				link.remove();
			},
			onError: err =>
				addError({
					text: err?.response?.data?.msg,
					desc: err?.response?.data?.error ?? "Please contact support",
					cId: err?.response?.data?.correlationId,
				}),
		});
	};

	return (
		<div
			className={`${styles.sidebar}  ${
				showCard
					? styles.preview
					: showCard && !showFilter && !showStats
					? styles.launch
					: styles.close
			} `}
		>
			<div className={styles.header}>
				<ThemedButton
					onClick={onClose}
					className={styles.closeBtn}
					theme={ThemedButtonThemes.ICON}
				>
					<Tooltip text="Close">
						<Close color={"#000"} />
					</Tooltip>
				</ThemedButton>
				<div className={styles.templateSidebarActions}>
					<Tooltip text={COMMON_TRANSLATION.EDIT[user?.language?.toUpperCase()]}>
						<ThemedButton
							theme={ThemedButtonThemes.GREY}
							width="fit-content"
							height="40px"
							disabled={
								!isActionPermitted(
									ACTIONS.UPDATE,
									templateLevel,
									user.role,
									user?.user_id === template?.user_id
								)
							}
							onClick={handleModifyClick}
						>
							<div>
								<Edit />
							</div>
						</ThemedButton>
					</Tooltip>
					{templateType === TEMPLATE_TYPES.EMAIL && (
						<DropDown
							btn={
								<ThemedButton
									theme={ThemedButtonThemes.GREY}
									width="fit-content"
									height="40px"
								>
									<div>
										<Statistics />
									</div>
								</ThemedButton>
							}
							tooltipText={
								STATISTICS_TRANSLATION.STATISTICS[user?.language?.toUpperCase()]
							}
							top={"50px"}
							right={"10px"}
						>
							<button className={`${styles.menuOptionBtn} ${styles.stat}`}>
								<div>
									<div>
										<ViewGradient size="16px" />
									</div>
									<div className={styles.viewed}>
										{COMMON_TRANSLATION.VIEWED[user?.language?.toUpperCase()]}
									</div>
								</div>
								<div>{template?.opened}</div>
							</button>
							<button className={`${styles.menuOptionBtn} ${styles.stat}`}>
								<div>
									<div>
										<ReplyGradient size="16px" />
									</div>
									<div>{COMMON_TRANSLATION.REPLIED[user?.language?.toUpperCase()]}</div>
								</div>
								<div>{template?.replied}</div>
							</button>
							<button className={`${styles.menuOptionBtn} ${styles.stat}`}>
								<div>
									<div>
										<ClickGradient size="16px" />
									</div>
									<div className={styles.clickedBtn}>
										{COMMON_TRANSLATION.CLICKED[user?.language?.toUpperCase()]}
									</div>
								</div>
								<div>{template?.clicked}</div>
							</button>
							<button className={`${styles.menuOptionBtn} ${styles.statRed}`}>
								<div>
									<div>
										<Bounced size="16px" />
									</div>
									<div>{COMMON_TRANSLATION.BOUNCED[user?.language?.toUpperCase()]}</div>
								</div>
								<div>{template?.bounced}</div>
							</button>
							<button className={`${styles.menuOptionBtn} ${styles.statRed}`}>
								<div>
									<div>
										<UnsubscribeRed size="16px" />
									</div>
									<div className={styles.unsubscribed}>
										{COMMON_TRANSLATION.UNSUBSCRIBED[user?.language?.toUpperCase()]}
									</div>
								</div>
								<div>{template?.unsubscribed}</div>
							</button>
						</DropDown>
					)}

					<div className={styles.modeDropDownWrapper}>
						<DropDown
							disabled={isDropDownDisabled}
							btn={
								<ThemedButton
									theme={ThemedButtonThemes.GREY}
									width="fit-content"
									height="40px"
									className={styles.moreBtn}
									disabled={isDropDownDisabled}
								>
									<div>
										<More />
									</div>
								</ThemedButton>
							}
							width="auto"
							top="50px"
							right="10px"
							customStyles={styles.moreBtnDropDown}
							tooltipText={COMMON_TRANSLATION.MORE[user?.language?.toUpperCase()]}
						>
							{templateType === TEMPLATE_TYPES.EMAIL ? (
								<button
									onClick={handleSendTestEmailClick}
									className={styles.moreOptionBtn}
								>
									<div>
										<AtrManualEmail size={ICON_SIZE} />
									</div>
									{TEMPLATES_TRANSLATION.SEND_TEST_EMAIL[user?.language?.toUpperCase()]}
								</button>
							) : (
								<></>
							)}
							{isActionPermitted(
								ACTIONS.DUPLICATE,
								templateLevel,
								user.role,
								user.user_id === template?.user_id
							) && (
								<button
									onClick={e => handleDuplicateClick(e, template)}
									className={styles.moreOptionBtn}
								>
									<div>
										<Copy size={ICON_SIZE} />
									</div>
									{COMMON_TRANSLATION.DUPLICATE[user?.language?.toUpperCase()]}
								</button>
							)}

							{isActionPermitted(
								ACTIONS.SHARE,
								templateLevel,
								user.role,
								user.user_id === template?.user_id
							) && (
								<button
									onClick={e => handleShareClick(e, template)}
									className={styles.moreOptionBtn}
								>
									<div>
										<Share size={ICON_SIZE} />
									</div>
									{COMMON_TRANSLATION.SHARE[user?.language?.toUpperCase()]}
								</button>
							)}
							{isActionPermitted(
								ACTIONS.DELETE,
								templateLevel,
								user.role,
								user.user_id === template?.user_id
							) && (
								<button onClick={handleDeleteClick} className={styles.moreOptionBtn}>
									<div>
										<Trash size={ICON_SIZE} />
									</div>
									{COMMON_TRANSLATION.DELETE[user?.language?.toUpperCase()]}
								</button>
							)}
						</DropDown>
					</div>
				</div>
			</div>
			<div className={styles.body}>
				<div className={styles.templateName}>{template?.name}</div>
				<div className={styles.templateUnseen}>{`Used ${usedTimes} times`}</div>

				{templateType === TEMPLATE_TYPES.EMAIL ? (
					<div className={styles.templateSubject}>
						<div className={styles.templateSubjectHeader}>Subject</div>
						<div className={styles.templateSubjectBody}> {template?.subject}</div>
					</div>
				) : (
					<></>
				)}
				{templateType === TEMPLATE_TYPES.VIDEO ? (
					<div className={styles.templateBody}>
						<div className={styles.videoTemplateHeader}></div>

						<div className={styles.player}>
							<TemplateSidebarPlayer
								videosrc={template?.Video?.video_url}
								thumbnailSrc={template?.Video?.thumbnail_url}
								duration={template?.Video?.video_duration}
							/>
						</div>
					</div>
				) : (
					<div className={styles.templateBody}>
						<div className={styles.templateBodyHeader}>
							{COMMON_TRANSLATION.BODY[user?.language?.toUpperCase()]}
						</div>
						<div className={styles.templateBodyBody}>{renderText()}</div>
					</div>
				)}
				{templateType === TEMPLATE_TYPES.EMAIL && template?.Attachments?.length > 0 && (
					<div className={styles.templateAttachments}>
						<div className={styles.templateAttachmentHeader}>Attachment</div>
						<div className={styles.templateAttachmentBody}>
							{template?.Attachments?.map(attachment => (
								<div className={styles.attachmentContainer}>
									<p>{attachment?.original_name}</p>
									<Download onClick={() => downloadAttachment(attachment)} />
								</div>
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default TemplateSidebar;
