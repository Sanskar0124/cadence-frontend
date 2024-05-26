import { Image } from "@cadence-frontend/components";
import { ENV } from "@cadence-frontend/environments";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { ThemedButton } from "@cadence-frontend/widgets";
import RHP from "html-react-parser";
import moment from "moment-timezone";
import { useEffect, useRef, useState } from "react";
import { CHATBOT_COMMAND_MESSAGES } from "../constants";
import styles from "./TextComponent.module.scss";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";

const TextComponent = ({
	userMsg,
	handleSendMessage,
	chatBotDataAccess,
	showResolved,
	setShowResolved,
	showAccessPermission,
	setShowAccessPermission,
}) => {
	const bottomRef = useRef(null);
	const { sendLoading, resolveConversation, resolveLoading, grantAccess } =
		chatBotDataAccess;
	const [isResolved, setIsResolved] = useState(false);
	const [isAccessGranted, setIsAccessGranted] = useState(false);
	const user = useRecoilValue(userInfo);

	useEffect(() => {
		//  scroll to bottom every time messages change
		bottomRef.current?.scrollIntoView({
			behavior: "smooth",
			block: "nearest",
			inline: "start",
		});
	}, [userMsg, showResolved, isResolved]);

	useEffect(() => {
		if (isResolved) setIsResolved(false);
		if (isAccessGranted) setIsAccessGranted(false);
	}, [userMsg]);

	const onIssueRemainsClick = () => {
		handleSendMessage({ userInput: "No, the issue remains" });
		setShowResolved(false);
	};

	const onAccessDenied = () => {
		handleSendMessage({ userInput: "Access Denied" });
		setShowAccessPermission(false);
	};

	const onResolveConversation = () => {
		resolveConversation(null, {
			onSuccess: () => {
				setShowResolved(false);
				setIsResolved(true);
			},
		});
	};

	const userLinkMessages = text => {
		var urlRegex = /(((http)|(www.))[^\s]+)/g;
		var regexWithSymbol = /(((<http)|(<www.))[^\s]+)/g;
		var mailRegexWithArrow =
			/(<mailto:["'>]?)([\w.-]+@[\w.-]+\.[\w.|]+@[\w.-]+\.[\w.|]+>)/gi;
		var mailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi;

		if (text.match(regexWithSymbol)) {
			if (text.includes("<")) {
				text = text.replace(/</g, "");
				if (text.includes("<")) {
					text = text.replace(/>/g, "");
				}
			}

			return text.replaceAll(urlRegex, function (url) {
				var customUrl;
				if (url.includes("|")) {
					customUrl = url.split("|")[0];
				} else if (url.includes("```")) {
					customUrl = url.replaceAll(/`/g, "").slice(1, -1);
				} else {
					customUrl = url?.slice(0, -1);
				}

				return `<a href="${customUrl}" target="_blank">${customUrl}</a>`;
			});
		} else if (text.match(mailRegexWithArrow)) {
			return text.replaceAll(mailRegexWithArrow, function (url) {
				let customUrl;
				let mailMessage;
				if (url.includes("|")) {
					customUrl = url.split("|")[0].slice(1);
					mailMessage = url.split("|")[1].slice(0, -1);
				}

				return `<a href="${customUrl}" target="_blank">${mailMessage}</a>`;
			});
		} else if (text.match(mailRegex)) {
			return text.replaceAll(mailRegex, function (url) {
				let customUrl = `mailto:${url}`;
				return `<a href="${customUrl}" target="_blank">${url}</a>`;
			});
		} else {
			return text.replaceAll(urlRegex, function (url) {
				var hyperlink = url;
				if (!hyperlink.match("^https?://")) {
					hyperlink = `http://${hyperlink}`;
				}

				return `<a href="${hyperlink}" target="_blank">${hyperlink}</a>`;
			});
		}
	};

	const onAccessGranted = () => {
		grantAccess(null, {
			onSuccess: () => {
				setShowAccessPermission(false);
				handleSendMessage({ userInput: "Access Granted" });
			},
		});
	};

	function botRenderMessage(text) {
		var urlRegex = /(((<http)|(<www.))[^\s]+)/g;
		var mailRegex = /(<mailto:["'>]?)([\w.-]+@[\w.-]+\.[\w.|]+@[\w.-]+\.[\w.|]+>)/gi;

		if (text.includes("`")) {
			text = text.replace(/`/g, "");
		}
		if (text.match(urlRegex)) {
			return text.replaceAll(urlRegex, function (url) {
				var customUrl;
				if (url.includes("|")) {
					customUrl = url.split("|")[0].slice(1);
				} else if (url.includes("```")) {
					customUrl = url.replaceAll(/`/g, "").slice(1, -1);
				} else {
					customUrl = url?.slice(1, -1);
				}

				return `<a href="${customUrl}" target="_blank">${customUrl}</a>`;
			});
		}
		if (text.match(mailRegex)) {
			return text.replaceAll(mailRegex, function (url) {
				let customUrl;
				let mailMessage;
				if (url.includes("|")) {
					customUrl = url.split("|")[0].slice(1);
					mailMessage = url.split("|")[1].slice(0, -1);
				}

				return `<a href="${customUrl}" target="_blank">${mailMessage}</a>`;
			});
		} else {
			return text;
		}
	}

	const AutomatedOrLinkMsg = text => {
		var accessLinkText = text?.includes(ENV.FRONTEND) || text?.includes("#Mentions");
		return !accessLinkText;
	};

	return (
		<div className={styles.container}>
			{userMsg?.length !== 0 ? (
				<div className={styles.chatsContainer}>
					<div className={styles.chats}>
						{userMsg
							?.filter(
								msg =>
									!CHATBOT_COMMAND_MESSAGES.includes(msg.text) &&
									AutomatedOrLinkMsg(msg.text)
							)
							?.map(msg => {
								if (msg?.files && msg.client_msg_id) {
									const id = msg?.files?.map(
										link => link.permalink_public?.substring(24).split("-")[1]
									);

									const public_url =
										msg?.files?.map(link => link.url_private) +
										"?pub_secret=" +
										msg?.files?.map(link => link.permalink_public?.split(id + "-")[1]);
									const mimetype = msg?.files?.map(type => type.mimetype.split("/")[0]);

									return (
										<div className={styles.botAttachmentsContainer}>
											<div
												className={`${styles.botAttachments} ${
													sendLoading ? styles.isfetching : ""
												}`}
											>
												{msg.text?.length ? (
													<p className={styles.text}>{msg.text}</p>
												) : null}
												{mimetype[0] == "image" ? (
													<Image src={public_url} className={styles.image} />
												) : (
													<video controls className={styles.video}>
														<source src={public_url} type="video/mp4" />
													</video>
												)}
											</div>
											<p className={styles.date}>
												Received
												{moment(`${msg?.ts.split(".")[0] + "000"}`, "x").format(
													"D MMMM YYYY, h:mm a"
												)}
											</p>
										</div>
									);
								} else if (msg?.files?.length) {
									const id = msg?.files?.map(
										link => link.permalink_public?.substring(24).split("-")[1]
									);
									const public_url =
										msg?.files?.map(link => link.url_private) +
										"?pub_secret=" +
										msg?.files?.map(link => link.permalink_public?.split(id + "-")[1]);
									const mimetype = msg?.files?.map(type => type.mimetype.split("/")[0]);
									return (
										<div className={styles.userAttachments}>
											<div
												className={`${styles.attachments} ${
													sendLoading ? styles.isfetching : ""
												}`}
											>
												{msg.text.length ? (
													<p className={styles.text}>{msg.text}</p>
												) : null}
												{mimetype[0] == "image" ? (
													<Image src={public_url} className={styles.image} />
												) : (
													<video controls className={styles.video}>
														<source src={public_url} type="video/mp4" />
													</video>
												)}
											</div>
											<p className={styles.date}>
												Sent{" "}
												{moment(`${msg?.ts.split(".")[0] + "000"}`, "x").format(
													"D MMMM YYYY, h:mm a"
												)}
											</p>
										</div>
									);
								} else if (msg.client_msg_id && msg.text) {
									return (
										<div
											className={`${styles.botChats} ${
												sendLoading ? styles.isfetching : ""
											}`}
										>
											<p className={styles.botText}>{RHP(botRenderMessage(msg.text))}</p>
											<p className={styles.date}>
												Received{" "}
												{moment(`${msg?.ts.split(".")[0] + "000"}`, "x").format(
													"D MMMM YYYY, h:mm a"
												)}
											</p>
										</div>
									);
								} else if (msg.bot_id && msg.text) {
									return (
										<div
											className={`${styles.userChats} ${
												sendLoading ? styles.isfetching : ""
											}`}
										>
											<p className={styles.userText}>{RHP(userLinkMessages(msg.text))}</p>
											<p className={styles.date}>
												Sent{" "}
												{moment(`${msg?.ts.split(".")[0] + "000"}`, "x").format(
													"D MMMM YYYY, h:mm a"
												)}
											</p>
										</div>
									);
								} else {
									return "";
								}
							})}
						{showResolved && !resolveLoading && (
							<div className={styles.suggestedMsg}>
								<ThemedButton
									width="fit-content"
									theme={ThemedButtonThemes.GREY}
									onClick={onResolveConversation}
								>
									Yes, the issue is solved
								</ThemedButton>
								<ThemedButton
									width="fit-content"
									theme={ThemedButtonThemes.GREY}
									onClick={onIssueRemainsClick}
								>
									No, the issue remains
								</ThemedButton>
							</div>
						)}
						{isResolved && (
							<div className={styles.convClosed}>The issue has been resolved</div>
						)}

						{showAccessPermission && (
							<div className={styles.suggestedMsg}>
								<ThemedButton
									width="fit-content"
									theme={ThemedButtonThemes.GREY}
									onClick={onAccessGranted}
								>
									Yes, grant access
								</ThemedButton>
								<ThemedButton
									width="fit-content"
									theme={ThemedButtonThemes.GREY}
									onClick={onAccessDenied}
								>
									Deny access
								</ThemedButton>
							</div>
						)}
						<div ref={bottomRef} />
					</div>
					{/* 
					<div className={styles.agentContainer}>
						<FaceAgent />
						<span className={styles.supportAgent}>Support agent </span> <span className={styles.supportAgentContinue}> joined the conversation</span>
					</div>
					 */}
				</div>
			) : (
				<div className={styles.welcomeMsg}>
					<img
						src="https://storage.googleapis.com/apt-cubist-307713.appspot.com/cadence/icons/waving_hand.svg"
						alt="Hi"
					/>
					<p>
						{COMMON_TRANSLATION.HOW_CAN_I_HELP_YOU_TODAY[user?.language?.toUpperCase()]}
					</p>
					<p>
						{COMMON_TRANSLATION.YOU_CAN_GO_OUR[user?.language.toUpperCase()]}{" "}
						<a
							href="https://support.ringover.com/hc/en-us"
							rel="noreferrer"
							target="_blank"
						>
							Ringover help center
						</a>{" "}
						{COMMON_TRANSLATION.AS_WELL[user?.language.toUpperCase()]}
					</p>
				</div>
			)}
		</div>
	);
};

export default TextComponent;
