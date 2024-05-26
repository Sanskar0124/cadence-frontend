/* eslint-disable no-console */
import { useRef, useState, useEffect } from "react";

//components
import {
	Container,
	Div,
	Image,
	ProgressiveImg,
	Tooltip,
} from "@cadence-frontend/components";
import { DropDown, ThemedButton } from "@cadence-frontend/widgets";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import {
	Templates as TEMPLATES_TRANSLATION,
	Common as COMMON_TRANSLATION,
} from "@cadence-frontend/languages";
import {
	Trash,
	TestMail,
	UnsubscribeRed,
	Bounced,
	ReplyGradient,
	ViewGradient,
	ClickGradient,
	Edit,
	More,
	TimerGradient,
	WatchGradient,
	MailGradient,
	Copy,
	Share,
	Email,
	AtrManualEmail,
} from "@cadence-frontend/icons";
import SendTestMailModal from "../SendTestMailModal/SendTestMailModal";

//constants
import {
	TEMPLATE_LEVELS,
	TEMPLATE_TYPES,
	EMAIL_TYPES,
	TEMPLATE_LEVELS_OPTIONS,
	TEMPLATE_SIDEBAR_OPTIONS,
} from "../../constants";

import { ACTIONS } from "../../constants";

import styles from "./TemplateCard.module.scss";
import { StripHtml } from "@cadence-frontend/utils";
import { isActionPermitted, isDropDownEnabled } from "../../utils";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";
import { forwardRef } from "react";
const ICON_SIZE = "18px";

const TEMPLATE_STATS_TYPE = {
	CLICKED: "clicked",
	BOUNCED: "bounced",
	REPLIED: "replied",
	VIEWED: "viewed",
	UNSUBSCRIBED: "unsubscribed",
};

const TemplateCard = forwardRef(
	(
		{
			template,
			type,
			className,
			onClick,
			Icon,
			templateLevel,
			setDuplicateModal,
			setTemplate,
			currentTemplate,
			setCurrentTemplate,
			setShareModal,
			setAddEditModal,
			setDeleteModal,
			loading,

			sidebarState,
			setSidebarState,
			handleOnClick,
			optionsOnTop,
			setSelectedStat,
			setSendTestMailModal,
		},
		ref
	) => {
		const user = useRecoilValue(userInfo);
		const [isDropDownActive, setIsDropDownActive] = useState(false);
		let showVideoStats = false;
		const EMAIL_TYPES = [
			"unseen",
			"bounced",
			"clicked",
			"replied",
			"opened",
			"unsubscribed",
		];
		let emailStats = {
			unseen: "",
			bounced: "",
			clicked: "",
			replied: "",
			opened: "",
			unsubscribed: "",
		};

		let videoStats = {
			clicked: "",
			sent: "",
			avgTime: "",
		};

		if (template) {
			let templatePercentage = null;
			if (type == TEMPLATE_TYPES.EMAIL) {
				const bouncedPercentage = (template.bounced / template.sent) * 100;
				const clickedPercentage = (template.clicked / template.sent) * 100;
				const repliedPercentage = (template.replied / template.sent) * 100;
				const openedPercentage = (template.opened / template.sent) * 100;
				const unsubscribedPercentage = (template.unsubscribed / template.sent) * 100;

				const formatPercentage = value => {
					return Number(value).toFixed();
				};

				templatePercentage = {
					bounced: Number.isNaN(bouncedPercentage)
						? ""
						: `${formatPercentage(bouncedPercentage)}`,
					clicked: Number.isNaN(clickedPercentage)
						? ""
						: `${formatPercentage(clickedPercentage)}`,
					replied: Number.isNaN(repliedPercentage)
						? ""
						: `${formatPercentage(repliedPercentage)}`,
					opened: Number.isNaN(openedPercentage)
						? ""
						: `${formatPercentage(openedPercentage)}`,
					unsubscribed: Number.isNaN(unsubscribedPercentage)
						? ""
						: `${formatPercentage(unsubscribedPercentage)}`,
				};
				emailStats = templatePercentage;
			} else if (type === TEMPLATE_TYPES.VIDEO) {
				const getTimeFromSeconds = seconds => {
					var hh = 0,
						mm = 0,
						ss = 0,
						t = "";

					if (seconds > 0) {
						// Multiply by 1000 because Date() requires miliseconds

						var date = new Date(seconds * 1000);
						hh = date.getUTCHours();
						mm = date.getUTCMinutes();
						ss = date.getSeconds();
					}

					// Make sure there are two-digits
					if (hh != 0) {
						if (hh < 10) {
							t += "0" + hh + ":";
						} else {
							t += hh + ":";
						}
					}
					if (mm < 10) {
						t += "0" + mm + ":";
					} else {
						t += mm + ":";
					}
					if (ss < 10) {
						t += "0" + ss;
					} else {
						t += ss;
					}
					return t;
				};
				if (template?.Video_Trackings?.length > 0) {
					videoStats.clicked = template?.Video_Trackings[0]?.clicked;
					videoStats.sent = template?.Video_Trackings[0]?.sent;
					videoStats.avgTime = getTimeFromSeconds(
						template?.Video_Trackings[0]?.total_duration /
							parseInt(template?.Video_Trackings[0]?.clicked)
					);
					showVideoStats = true;
				}
			}
		}

		const handleModifyClick = e => {
			setTemplate(template);
			setAddEditModal(true);
			e.stopPropagation();
		};

		const handleStatClick = () => {
			setSidebarState(TEMPLATE_SIDEBAR_OPTIONS.STAT_DATA);
			console.log("stat clicked");
		};

		const handleDeleteClick = e => {
			setTemplate(template);
			console.log(template, "Templatee");
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
		const handleMoreClick = e => {
			setCurrentTemplate(template);
			if (getID(template) === isDropDownActive) setIsDropDownActive(false);
			else setIsDropDownActive(getID(template));
			e.stopPropagation();
		};

		const onCardClick = e => {
			setCurrentTemplate(template);
			handleOnClick();
			e.stopPropagation();
		};

		const getID = templateTemplate => {
			switch (type) {
				case TEMPLATE_TYPES.EMAIL:
					return "et_id" + templateTemplate?.et_id;
				case TEMPLATE_TYPES.SMS:
					return "mt_id" + templateTemplate?.mt_id;
				case TEMPLATE_TYPES.LINKEDIN:
					return "lt_id" + templateTemplate?.lt_id;
				case TEMPLATE_TYPES.SCRIPT:
					return "st_id" + templateTemplate?.st_id;
				case TEMPLATE_TYPES.VIDEO:
					return "vt_id" + templateTemplate?.vt_id;
			}
		};

		const renderText = () => {
			switch (type) {
				case TEMPLATE_TYPES.EMAIL:
					return StripHtml(template?.body) || "";

				case TEMPLATE_TYPES.SMS:
				case TEMPLATE_TYPES.LINKEDIN:
				case TEMPLATE_TYPES.WHATSAPP:
					return template?.message;

				case TEMPLATE_TYPES.SCRIPT:
					return StripHtml(template?.script) || "";
				case TEMPLATE_TYPES.VIDEO:
					return StripHtml(template?.Video?.video_url);
				default:
					return "";
			}
		};

		const statsFetchHandler = (e, type) => {
			e.stopPropagation();
			setSelectedStat({
				stats: {
					sent: template.sent,
					[type === "opened" ? "viewed" : type]: template[type],
					percentage: emailStats[type],
				},
				et_id: template.et_id,
				type: type === "opened" ? "viewed" : type,
			});
			setSidebarState(TEMPLATE_SIDEBAR_OPTIONS.STAT_DATA);
		};

		return (
			<div>
				{type === TEMPLATE_TYPES.EMAIL
					? template && (
							<tr
								ref={ref}
								className={`${styles.templateCard} ${styles.email} ${
									sidebarState && styles.compressed
								}`}
								onClick={onCardClick}
							>
								<td className={styles.templateCardName}>
									<p className={styles.templateName}>{template?.name || ""}</p>
									<p className={styles.templateSentCount}>
										{COMMON_TRANSLATION.SENT[user?.language?.toUpperCase()]}{" "}
										{template?.sent}{" "}
										{Number(template?.sent) <= 1
											? COMMON_TRANSLATION.TIME[user?.language?.toUpperCase()]
											: COMMON_TRANSLATION.TIMES[user?.language?.toUpperCase()]}
									</p>
									<p className={styles.templateCreationDate}>
										{new Date(template?.created_at)?.toLocaleDateString("en-GB", {
											timeZone: user?.timezone,
										})}
									</p>
								</td>
								{!sidebarState && (
									<td className={styles.templateCardText}>
										<p>{template?.subject || ""}</p>
										<p>{renderText() || ""}</p>
									</td>
								)}
								<td className={styles.templateCardCreatedBy}>
									<span className={styles.profile}>
										<ProgressiveImg
											className={styles.userProfilePicture}
											src={template?.User?.profile_picture}
										/>
										<ProgressiveImg
											className={styles.subdepartmentProfilePicture}
											src={
												template?.User?.Sub_Department?.is_profile_picture_present
													? template?.User?.Sub_Department?.profile_picture
													: "https://cdn.ringover.com/img/users/default.jpg"
											}
										/>
									</span>
									<div className={styles.createdByDetails}>
										<span>
											{template?.User?.first_name} {template?.User?.last_name}
										</span>
										<span>{template?.User?.Sub_Department?.name ?? ""}</span>
									</div>
								</td>
								<td className={styles.templateCardStats}>
									<Div className={styles.statistics} loading={loading}>
										{template.opened !== "0" && (
											<Tooltip text={`Opened: ${template.opened}`}>
												<div
													className={styles.stat}
													onClick={e => statsFetchHandler(e, "opened")}
												>
													<ViewGradient size="16px" />
													<h3>{`${emailStats.opened}%`}</h3>
												</div>
											</Tooltip>
										)}

										{template.replied !== "0" && (
											<Tooltip text={`Replied: ${template.replied}`}>
												<div
													className={styles.stat}
													onClick={e => statsFetchHandler(e, TEMPLATE_STATS_TYPE.REPLIED)}
												>
													<ReplyGradient size="16px" />
													<h3>{`${emailStats.replied}%`}</h3>
												</div>
											</Tooltip>
										)}
										{template.clicked !== "0" && (
											<Tooltip text={`Clicked: ${template.clicked}`}>
												<div
													className={styles.stat}
													onClick={e => statsFetchHandler(e, TEMPLATE_STATS_TYPE.CLICKED)}
												>
													<ClickGradient size="16px" />
													<h3>{`${emailStats.clicked}%`}</h3>
												</div>
											</Tooltip>
										)}
										{template.bounced !== "0" && (
											<Tooltip text={`Bounced: ${template.bounced}`}>
												<div
													className={styles.statRed}
													onClick={e => statsFetchHandler(e, TEMPLATE_STATS_TYPE.BOUNCED)}
												>
													<Bounced size="16px" />
													<h3>{`${emailStats.bounced}%`}</h3>
												</div>
											</Tooltip>
										)}

										{template.unsubscribed !== "0" && (
											<Tooltip text={`Unsubscribed: ${template.unsubscribed}`}>
												<div
													className={styles.stat}
													onClick={e =>
														statsFetchHandler(e, TEMPLATE_STATS_TYPE.UNSUBSCRIBED)
													}
												>
													<UnsubscribeRed size="16px" />
													<h3>{`${emailStats.unsubscribed}%`}</h3>
												</div>
											</Tooltip>
										)}
									</Div>
								</td>
								{!sidebarState ? (
									<td className={styles.templateCardActions}>
										<div>
											<Tooltip
												text={COMMON_TRANSLATION.EDIT[user?.language?.toUpperCase()]}
											>
												<ThemedButton
													theme={ThemedButtonThemes.GREY}
													width="fit-content"
													height="40px"
													disabled={
														!isActionPermitted(
															ACTIONS.UPDATE,
															templateLevel,
															user.role,
															user.user_id === template.user_id
														)
													}
													onClick={handleModifyClick}
												>
													<div>
														<Edit />
													</div>
												</ThemedButton>
											</Tooltip>
											<DropDown
												disabled={
													!isDropDownEnabled(
														[ACTIONS.DUPLICATE, ACTIONS.SHARE, ACTIONS.DELETE],
														templateLevel,
														user.role,
														user.user_id === template.user_id
													)
												}
												tooltipText={
													COMMON_TRANSLATION.MORE[user?.language?.toUpperCase()]
												}
												btn={
													<ThemedButton
														height="40px"
														width="fit-content"
														theme={ThemedButtonThemes.GREY}
														className={styles.moreButton}
														disabled={
															!isDropDownEnabled(
																[ACTIONS.DUPLICATE, ACTIONS.SHARE, ACTIONS.DELETE],
																templateLevel,
																user.role,
																user.user_id === template.user_id
															)
														}
													>
														<div>
															<More />
														</div>
													</ThemedButton>
												}
												top={!optionsOnTop ? "120%" : "unset"}
												bottom={optionsOnTop ? "120%" : "unset"}
												right="0"
												width="max-content"
											>
												<button
													onClick={handleSendTestEmailClick}
													className={styles.menuOptionBtn}
												>
													<div>
														<AtrManualEmail size={ICON_SIZE} />
													</div>
													<div>
														{
															TEMPLATES_TRANSLATION.SEND_TEST_EMAIL[
																user?.language?.toUpperCase()
															]
														}
													</div>
												</button>

												{isActionPermitted(
													ACTIONS.SHARE,
													templateLevel,
													user.role,
													user.user_id === template.user_id
												) && (
													<button
														className={styles.menuOptionBtn}
														onClick={e => handleShareClick(e, template)}
													>
														<div>
															<Share size={ICON_SIZE} />
														</div>
														<div>
															{COMMON_TRANSLATION.SHARE[user?.language?.toUpperCase()]}
														</div>
													</button>
												)}
												{isActionPermitted(
													ACTIONS.DUPLICATE,
													templateLevel,
													user.role,
													user.user_id === template?.user_id
												) && (
													<button
														onClick={e => handleDuplicateClick(e, template)}
														className={styles.menuOptionBtn}
													>
														<div>
															<Copy size={ICON_SIZE} />
														</div>
														<div>
															{
																COMMON_TRANSLATION.DUPLICATE[
																	user?.language?.toUpperCase()
																]
															}
														</div>
													</button>
												)}
												{isActionPermitted(
													ACTIONS.DELETE,
													templateLevel,
													user.role,
													user.user_id === template.user_id
												) && (
													<button
														onClick={handleDeleteClick}
														className={styles.menuOptionBtn}
													>
														<div>
															<Trash size={ICON_SIZE} />
														</div>
														<div>
															{COMMON_TRANSLATION.DELETE[user?.language?.toUpperCase()]}
														</div>
													</button>
												)}
											</DropDown>
										</div>
									</td>
								) : null}
							</tr>
					  )
					: type === TEMPLATE_TYPES.VIDEO
					? template && (
							<tr
								ref={ref}
								className={`${styles.templateCard} ${styles.email} ${
									sidebarState && styles.compressed
								}`}
								onClick={onCardClick}
							>
								<td className={styles.templateCardName}>
									<p className={styles.templateName}>{template?.name || ""}</p>
									<p className={styles.templateCreationDate}>
										{new Date(template?.created_at).toLocaleDateString("en-GB", {
											timeZone: user?.timezone,
										})}
									</p>
								</td>
								{!sidebarState && (
									<td className={styles.templateCardText}>
										<p>{renderText() || ""}</p>
									</td>
								)}
								<td className={styles.templateCardCreatedBy}>
									<span className={styles.profile}>
										<ProgressiveImg
											className={styles.userProfilePicture}
											src={template?.User?.profile_picture}
										/>
										<ProgressiveImg
											className={styles.subdepartmentProfilePicture}
											src={
												template?.User?.Sub_Department?.is_profile_picture_present
													? template?.User?.Sub_Department?.profile_picture
													: "https://cdn.ringover.com/img/users/default.jpg"
											}
										/>
									</span>
									<div className={styles.createdByDetails}>
										<span>
											{template?.User?.first_name} {template?.User?.last_name}
										</span>
										<span>{template?.User?.Sub_Department?.name ?? ""}</span>
									</div>
								</td>
								<td className={styles.templateCardStats}>
									<Div className={styles.statistics} loading={loading}>
										{showVideoStats && videoStats.sent !== 0 && (
											<Tooltip text={`Sent: ${videoStats.sent}`}>
												<div className={styles.stat}>
													<MailGradient size="16px" />
													<h3>{`${videoStats.sent}`}</h3>
												</div>
											</Tooltip>
										)}
										{showVideoStats && videoStats.clicked !== 0 && (
											<Tooltip text={`Clicked: ${videoStats.clicked}`}>
												<div className={styles.stat}>
													<ClickGradient size="16px" />
													<h3>{`${videoStats.clicked}`}</h3>
												</div>
											</Tooltip>
										)}
										{showVideoStats &&
											template?.Video_Trackings[0]?.total_duration !== 0 && (
												<Tooltip text={`Average Time: ${videoStats.avgTime}s`}>
													<div className={styles.stat}>
														<WatchGradient size="16px" />
														<h3>{`${videoStats.avgTime}s`}</h3>
													</div>
												</Tooltip>
											)}
									</Div>
								</td>
								{!sidebarState ? (
									<td className={styles.templateCardActions}>
										<div>
											<Tooltip
												text={COMMON_TRANSLATION.EDIT[user?.language?.toUpperCase()]}
											>
												<ThemedButton
													theme={ThemedButtonThemes.GREY}
													width="fit-content"
													height="40px"
													disabled={
														!isActionPermitted(
															ACTIONS.UPDATE,
															templateLevel,
															user.role,
															user.user_id === template.user_id
														)
													}
													onClick={handleModifyClick}
												>
													<div>
														<Edit />
													</div>
												</ThemedButton>
											</Tooltip>
											<DropDown
												disabled={
													!isDropDownEnabled(
														[ACTIONS.DUPLICATE, ACTIONS.SHARE, ACTIONS.DELETE],
														templateLevel,
														user.role,
														user.user_id === template.user_id
													)
												}
												tooltipText={
													COMMON_TRANSLATION.MORE[user?.language?.toUpperCase()]
												}
												btn={
													<ThemedButton
														height="40px"
														width="fit-content"
														theme={ThemedButtonThemes.GREY}
														className={styles.moreButton}
														disabled={
															!isDropDownEnabled(
																[ACTIONS.DUPLICATE, ACTIONS.SHARE, ACTIONS.DELETE],
																templateLevel,
																user.role,
																user.user_id === template.user_id
															)
														}
													>
														<div>
															<More />
														</div>
													</ThemedButton>
												}
												top={!optionsOnTop ? "120%" : "unset"}
												bottom={optionsOnTop ? "120%" : "unset"}
												right="0"
												width="max-content"
											>
												{isActionPermitted(
													ACTIONS.DUPLICATE,
													templateLevel,
													user.role,
													user.user_id === template.user_id
												) && (
													<button
														className={styles.menuOptionBtn}
														onClick={e => handleDuplicateClick(e, template)}
													>
														<div>
															<Copy size={ICON_SIZE} />
														</div>
														<div>
															{
																COMMON_TRANSLATION.DUPLICATE[
																	user?.language?.toUpperCase()
																]
															}
														</div>
													</button>
												)}

												{isActionPermitted(
													ACTIONS.SHARE,
													templateLevel,
													user.role,
													user.user_id === template.user_id
												) && (
													<button
														className={styles.menuOptionBtn}
														onClick={e => handleShareClick(e, template)}
													>
														<div>
															<Share size={ICON_SIZE} />
														</div>
														<div>
															{COMMON_TRANSLATION.SHARE[user?.language?.toUpperCase()]}
														</div>
													</button>
												)}
												{isActionPermitted(
													ACTIONS.DELETE,
													templateLevel,
													user.role,
													user.user_id === template.user_id
												) && (
													<button
														onClick={handleDeleteClick}
														className={styles.menuOptionBtn}
													>
														<div>
															<Trash size={ICON_SIZE} />
														</div>
														<div>
															{COMMON_TRANSLATION.DELETE[user?.language?.toUpperCase()]}
														</div>
													</button>
												)}
											</DropDown>
										</div>
									</td>
								) : null}
							</tr>
					  )
					: template && (
							<tr
								ref={ref}
								className={`${styles.templateCard} ${styles.other} ${
									sidebarState && styles.compressed
								}`}
								onClick={onCardClick}
							>
								<td className={styles.templateCardName}>
									<p className={styles.templateName}>{template?.name || ""}</p>
									{/* <p className={styles.templateSentCount}>
									Sent {template?.sent} {Number(template?.sent) <= 1 ? "time" : "times"}
								</p> */}
									<p className={styles.templateCreationDate}>
										{new Date(template?.created_at).toLocaleDateString("en-GB", {
											timeZone: user?.timezone,
										})}
									</p>
								</td>
								<td className={styles.templateCardText}>
									<p>{renderText() || ""}</p>
								</td>
								<td className={styles.templateCardCreatedBy}>
									<span className={styles.profile}>
										<ProgressiveImg
											className={styles.userProfilePicture}
											src={template?.User?.profile_picture}
										/>
										<ProgressiveImg
											className={styles.subdepartmentProfilePicture}
											src={
												template?.User?.Sub_Department?.is_profile_picture_present
													? template?.User?.Sub_Department?.profile_picture
													: "https://cdn.ringover.com/img/users/default.jpg"
											}
										/>
									</span>
									<div className={styles.createdByDetails}>
										<span>
											{template?.User?.first_name} {template?.User?.last_name}
										</span>
										<span>{template?.User?.Sub_Department?.name}</span>
									</div>
								</td>
								{!sidebarState && (
									<td className={styles.templateCardActions}>
										<div>
											<Tooltip
												text={COMMON_TRANSLATION.EDIT[user?.language?.toUpperCase()]}
											>
												<ThemedButton
													height="40px"
													width="fit-content"
													theme={ThemedButtonThemes.GREY}
													className={styles.editButton}
													disabled={
														!isActionPermitted(
															ACTIONS.UPDATE,
															templateLevel,
															user.role,
															user.user_id === template?.user_id
														)
													}
													onClick={handleModifyClick}
												>
													<div>
														<Edit />
													</div>
												</ThemedButton>
											</Tooltip>
											<DropDown
												// disabled={!isDropDownEnabled}
												tooltipText={
													COMMON_TRANSLATION.MORE[user?.language?.toUpperCase()]
												}
												btn={
													<ThemedButton
														height="40px"
														width="fit-content"
														theme={ThemedButtonThemes.GREY}
														className={styles.moreButton}
														disabled={
															!isDropDownEnabled(
																[ACTIONS.DUPLICATE, ACTIONS.SHARE, ACTIONS.DELETE],
																templateLevel,
																user.role,
																user.user_id === template?.user_id
															)
														}
													>
														<div>
															<More />
														</div>
													</ThemedButton>
												}
												disabled={
													!isDropDownEnabled(
														[ACTIONS.DUPLICATE, ACTIONS.SHARE, ACTIONS.DELETE],
														templateLevel,
														user.role,
														user.user_id === template.user_id
													)
												}
												top={!optionsOnTop ? "120%" : "unset"}
												bottom={optionsOnTop ? "120%" : "unset"}
												right="0px"
												width="max-content"
											>
												{isActionPermitted(
													ACTIONS.DUPLICATE,
													templateLevel,
													user.role,
													user.user_id === template?.user_id
												) && (
													<button
														className={styles.menuOptionBtn}
														onClick={e => handleDuplicateClick(e, template)}
													>
														<div>
															<Copy size={ICON_SIZE} />
														</div>
														<div>
															{
																COMMON_TRANSLATION.DUPLICATE[
																	user?.language?.toUpperCase()
																]
															}
														</div>
													</button>
												)}

												{isActionPermitted(
													ACTIONS.SHARE,
													templateLevel,
													user.role,
													user.user_id === template?.user_id
												) && (
													<button
														className={styles.menuOptionBtn}
														onClick={e => handleShareClick(e, template)}
													>
														<div>
															<Share size={ICON_SIZE} />
														</div>
														<div>
															{COMMON_TRANSLATION.SHARE[user?.language?.toUpperCase()]}
														</div>
													</button>
												)}
												{isActionPermitted(
													ACTIONS.DELETE,
													templateLevel,
													user.role,
													user.user_id === template.user_id
												) && (
													<button
														onClick={handleDeleteClick}
														className={styles.menuOptionBtn}
													>
														<div>
															<Trash size={ICON_SIZE} />
														</div>
														<div>
															{COMMON_TRANSLATION.DELETE[user?.language?.toUpperCase()]}
														</div>
													</button>
												)}
											</DropDown>
										</div>
									</td>
								)}
							</tr>
					  )}
			</div>
		);
	}
);
export default TemplateCard;
