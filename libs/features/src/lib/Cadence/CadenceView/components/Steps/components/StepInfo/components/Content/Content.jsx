import { getLabelFromEnum } from "@cadence-frontend/utils";

import styles from "./Content.module.scss";
import { Editor, Label } from "@cadence-frontend/widgets";

import { CADENCE_NODE_TYPES, LANGUAGES } from "@cadence-frontend/constants";
import { STEP_FIELD_NAME } from "../../constants";
import ReactHtmlParser from "html-react-parser";
import { useContext, useEffect, useState } from "react";
import {
	Common as COMMON_TRANSLATION,
	Cadence as CADENCE_TRANSLATION,
} from "@cadence-frontend/languages";
import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue } from "recoil";
import { Download, Leads } from "@cadence-frontend/icons";
import { useAttachments } from "@cadence-frontend/data-access";
import { MessageContext } from "@cadence-frontend/contexts";

const Content = ({ step, templateIndex, cadence }) => {
	const { downloadAttachmentURL } = useAttachments();
	const { addError } = useContext(MessageContext);
	const user = useRecoilValue(userInfo);
	const renderBody = () => {
		const value = step?.data?.aBTestEnabled
			? step?.data?.templates?.[
					templateIndex < step?.data?.templates?.length ? templateIndex : 0
			  ]?.[STEP_FIELD_NAME[step?.type]]
			: step?.data?.[STEP_FIELD_NAME[step?.type]];

		return value;
	};
	const renderAttachments = () => {
		const attachments = step?.data?.aBTestEnabled
			? step?.data?.templates?.[
					templateIndex < step?.data?.templates?.length ? templateIndex : 0
			  ]?.["attachments"]
			: step?.data?.["attachments"];
		return attachments;
	};
	const [content, setContent] = useState(renderBody());
	const [attachments, setAttachments] = useState(renderAttachments());
	const renderSubject = () => {
		if (
			step?.type === CADENCE_NODE_TYPES.REPLY_TO ||
			step?.type === CADENCE_NODE_TYPES.AUTOMATED_REPLY_TO
		) {
			let orignal = cadence?.sequence?.find(
				st => st.node_id === step?.data.replied_node_id
			);
			if (!orignal) return;
			if (orignal?.data.aBTestEnabled) return;
			return `Re: ${orignal?.data.subject}`;
		}
		if (step?.data?.aBTestEnabled)
			return step?.data?.templates?.[
				templateIndex < step?.data?.templates?.length ? templateIndex : 0
			]?.subject;
		else return step?.data?.subject;
	};

	useEffect(() => {
		setContent(renderBody());
		setAttachments(renderAttachments());
	}, [step, templateIndex]);

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
					desc: err?.response?.data?.error,
					cId: err?.response?.data?.correlationId,
				}),
		});
	};

	const renderComponent = stepType => {
		switch (stepType) {
			case "reply_to":
			case "automated_reply_to":
				return content ? (
					<div
						className={`${styles.content} ${
							step?.data?.aBTestEnabled ? styles.isAbTestEnabled : ""
						}`}
					>
						{renderSubject() && (
							<div className={styles.subject}>
								<Label>{COMMON_TRANSLATION.SUBJECT[user?.language?.toUpperCase()]}</Label>
								<p>{renderSubject()}</p>
							</div>
						)}

						<div className={styles.body}>
							{content && <Label>{getLabelFromEnum(STEP_FIELD_NAME[step?.type])}</Label>}
							{step && ReactHtmlParser(content)}
						</div>

						<div className={styles.attachment}>
							{attachments?.length > 0 && <Label>Attachments</Label>}
							{attachments?.length > 0 &&
								attachments?.map(attachment => (
									<div className={styles.attachmentContainer}>
										<p>{attachment?.original_name}</p>
										<Download onClick={() => downloadAttachment(attachment)} />
									</div>
								))}
						</div>
					</div>
				) : (
					<Empty user={user} />
				);

			case "automated_mail":
			case "mail":
				return renderSubject() || content ? (
					<div
						className={`${styles.content} ${
							step?.data?.aBTestEnabled ? styles.isAbTestEnabled : ""
						}`}
					>
						{renderSubject() && (
							<div className={styles.subject}>
								<Label>{COMMON_TRANSLATION.SUBJECT[user?.language?.toUpperCase()]}</Label>
								<p>{renderSubject()}</p>
							</div>
						)}
						<div className={styles.body}>
							{content && <Label>{getLabelFromEnum(STEP_FIELD_NAME[step?.type])}</Label>}
							{step && ReactHtmlParser(content)}
						</div>

						<div className={styles.attachment}>
							{attachments?.length > 0 && <Label>Attachments</Label>}
							{attachments?.length > 0 &&
								attachments?.map(attachment => (
									<div className={styles.attachmentContainer}>
										<p>{attachment?.original_name}</p>
										<Download onClick={() => downloadAttachment(attachment)} />
									</div>
								))}
						</div>
					</div>
				) : (
					<Empty user={user} />
				);

			case CADENCE_NODE_TYPES.MESSAGE:
			case CADENCE_NODE_TYPES.AUTOMATED_MESSAGE:
				return content ? (
					<div
						className={`${styles.content} ${
							step?.data?.aBTestEnabled ? styles.isAbTestEnabled : ""
						}`}
					>
						<div className={styles.body}>{step && ReactHtmlParser(content)}</div>
					</div>
				) : (
					<Empty user={user} />
				);

			default:
				return (
					<div
						className={`${styles.content} ${
							step?.data?.aBTestEnabled ? styles.isAbTestEnabled : ""
						}`}
					>
						{renderSubject() && (
							<div className={styles.subject}>
								<Label>{COMMON_TRANSLATION.SUBJECT[user?.language?.toUpperCase()]}</Label>
								<p>{renderSubject()}</p>
							</div>
						)}
						<div className={styles.body}>
							{content && <Label>{getLabelFromEnum(STEP_FIELD_NAME[step?.type])}</Label>}
							{step && content ? ReactHtmlParser(content) : <Empty user={user} />}
						</div>
					</div>
				);
		}
	};

	return (
		<>
			{/* {renderSubject() && (
				<div className={styles.subject}>
					<Label>{COMMON_TRANSLATION.SUBJECT[user?.language?.toUpperCase()]}</Label>
					<p>{renderSubject()}</p>
				</div>
			)}
			<div className={styles.body}>
				{content && <Label>{getLabelFromEnum(STEP_FIELD_NAME[step?.type])}</Label>}
				{step && content ? (
					ReactHtmlParser(
						step?.type === CADENCE_NODE_TYPES.AUTOMATED_MAIL ||
							step?.type === CADENCE_NODE_TYPES.MAIL ||
							step?.type === CADENCE_NODE_TYPES.REPLY_TO ||
							step?.type === CADENCE_NODE_TYPES.AUTOMATED_REPLY_TO
							? step?.data?.aBTestEnabled
								? step?.data?.templates?.[
										templateIndex < step?.data?.templates?.length ? templateIndex : 0
								  ]?.[STEP_FIELD_NAME[step?.type]]
								: step?.data?.[STEP_FIELD_NAME[step?.type]]
							: step?.data[STEP_FIELD_NAME[step?.type]]
					)
				) : (
					<Empty />
				)}
			</div> */}

			{renderComponent(step?.type)}
		</>
	);
};

export default Content;

const Empty = user => {
	return (
		<div className={styles.emptySpaceWrapper}>
			<div className={styles.emptySpace}>
				<div className={styles.title}>
					{CADENCE_TRANSLATION.NO_SELECTIONS_MADE[user?.user?.language?.toUpperCase()]}
				</div>
				<div
					className={`${styles.subTitle} ${
						user?.user?.language === LANGUAGES.FRENCH ? styles.frenchSubTitle : ""
					}`}
				>
					<span>
						{
							CADENCE_TRANSLATION.TO_MAKE_CHANGES_CLICK_ON[
								user?.user?.language?.toUpperCase()
							]
						}
					</span>
					<span className={styles.highlated}>
						{CADENCE_TRANSLATION.EDIT_STEPS[user?.user?.language?.toUpperCase()]}
					</span>
				</div>
			</div>
		</div>
	);
};
