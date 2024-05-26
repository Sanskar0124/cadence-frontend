import { useContext, useEffect, useState, useRef } from "react";

import { MessageContext } from "@cadence-frontend/contexts";

//components
import { Title, Button } from "@cadence-frontend/components";
import { Input, Label, ThemedButton, Toggle } from "@cadence-frontend/widgets";
import { CollapseContainer } from "@cadence-frontend/widgets";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import SingleUnsubscribeSetting from "./components/SingleUnsubscribeSetting/SingleUnsubscribeSetting";

import { SETTING_PRIORITY, SETTING_TYPES } from "@cadence-frontend/constants";
import { getTempTeamExceptionData, getTempUserExceptionData } from "./constants";
import { getTeamName, getUserName } from "../../../../utils";
import { Settings as SETTINGS_TRANSLATION } from "@cadence-frontend/languages";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";

import styles from "./UnsubscribeRules.module.scss";
import { SEARCH_OPTIONS } from "../../../../../Search/constants";
import InputWithButton from "../../../../../InputWithButton/InputWithButton";

const SETTING_TYPE = SETTING_TYPES.UNSUBSCRIBED_MAIL_SETTING;

const UnsubscribeRules = ({
	isAdmin,
	unsubscribeMailSettings: data,
	setUnsubscribeMailSettings: setData,
	users,
	subDepartments,
	settingsDataAccess,
	user,
	setDeleteModal,
}) => {
	const { addError, addSuccess } = useContext(MessageContext);

	const exceptionRef = useRef(null);

	const {
		createException,
		updateException,
		deleteException,
		createExceptionLoading,
		updateExceptionLoading,
		deleteExceptionLoading,
		updateCompanySettings,
		updateCompanySettingsLoading,
	} = settingsDataAccess;

	const [activeException, setActiveException] = useState(null);
	const [companySettings, setCompanySettings] = useState({
		unsubscribe_link_madatory_for_semi_automated_mails: false,
		default_unsubscribe_link_text: "",
	});
	const [unsubTextLoading, setUnsubTextLoading] = useState(false);
	const [newExceptionAdded, setNewExceptionAdded] = useState(false); // for scroll animation

	useEffect(() => {
		setCompanySettings({
			unsubscribe_link_madatory_for_semi_automated_mails:
				data.unsubscribe_link_madatory_for_semi_automated_mails,
			default_unsubscribe_link_text: data.default_unsubscribe_link_text,
		});
	}, []);

	useEffect(() => {
		if (newExceptionAdded) {
			scrollToExceptionAndClick();
			setNewExceptionAdded(false);
		}
	}, [newExceptionAdded]);

	const onToggleChange = e => {
		if (!updateCompanySettingsLoading) {
			let updatedData = {
				...companySettings,
				unsubscribe_link_madatory_for_semi_automated_mails: e.target.checked,
			};
			setCompanySettings(updatedData);

			updateCompanySettings(
				{ data: updatedData, companyId: user?.company_id },
				{
					onSuccess: res => addSuccess("Settings updated successfully"),
					onError: err => {
						addError({
							text: err.response.data.msg,
							desc: err?.response?.data?.error ?? "Please contact support",
							cId: err?.response?.data?.correlationId,
						});
						//reverting back the toggle
						setCompanySettings(prev => ({
							...prev,
							unsubscribe_link_madatory_for_semi_automated_mails:
								!prev.unsubscribe_link_madatory_for_semi_automated_mails,
						}));
					},
				}
			);
		}
	};

	const onUnsubTextSave = () => {
		setUnsubTextLoading(true);
		updateCompanySettings(
			{ data: companySettings, companyId: user?.company_id },
			{
				onSuccess: () => addSuccess("Settings updated successfully"),
				onError: err =>
					addError({
						text: err.response.data.msg,
						desc: err?.response?.data?.error ?? "Please contact support",
						cId: err?.response?.data?.correlationId,
					}),
				onSettled: () => setUnsubTextLoading(false),
			}
		);
	};

	const addTeamException = () => {
		setData(prev => ({
			...prev,
			exceptions: [...data.exceptions, getTempTeamExceptionData(data)],
		}));
		setNewExceptionAdded(true);
	};

	const addUserException = () => {
		setData(prev => ({
			...prev,
			exceptions: [...prev.exceptions, getTempUserExceptionData(data)],
		}));
		setNewExceptionAdded(true);
	};

	const scrollToExceptionAndClick = () => {
		if (exceptionRef.current) {
			exceptionRef.current.scrollIntoView({ behavior: "smooth" });
			exceptionRef.current.click();
		}
	};

	const handleSave = (e, exception, index) => {
		e.stopPropagation();

		if (exception.priority === SETTING_PRIORITY.USER && !exception.user_id) {
			addError({ text: "Please select a user." });
			return;
		}
		if (exception.priority === SETTING_PRIORITY.SUB_DEPARTMENT && !exception.sd_id) {
			addError({ text: "Please Select a group." });
			return;
		}

		setActiveException(index);

		//temp fix for Send Reply to always send true and hidden in the UI
		exception.automatic_unsubscribed_data.reply_to = true;
		exception.semi_automatic_unsubscribed_data.reply_to = true;
		exception.automatic_unsubscribed_data.automated_reply_to = true;
		exception.semi_automatic_unsubscribed_data.automated_reply_to = true;

		let body = { type: SETTING_TYPE, body: { ...exception } };
		if (exception.is_new) {
			delete body.body.is_new;

			// add sd_id field in body if it's user exception
			if (exception.priority === SETTING_PRIORITY.USER)
				body = {
					...body,
					body: {
						...body.body,
						sd_id: users?.filter(user => user.value === exception.user_id)[0].sd_id,
					},
				};

			createException(body, {
				onError: err => {
					addError({
						text: err.response.data.msg,
						desc: err?.response?.data?.error ?? "Please contact support",
						cId: err?.response?.data?.correlationId,
					});
				},
				onSuccess: () => {
					addSuccess("New exception added");
				},
				onSettled: () => {
					setActiveException(null);
				},
			});
		} else {
			updateException(body, {
				onError: err => {
					addError({
						text: err.response.data.msg,
						desc: err?.response?.data?.error ?? "Please contact support",
						cId: err?.response?.data?.correlationId,
					});
				},
				onSuccess: () => {
					addSuccess("Successfully updated exception.");
				},
				onSettled: () => {
					setActiveException(null);
				},
			});
		}
	};

	const handleDelete = (e, exception, index) => {
		e.stopPropagation();

		setActiveException(index);

		if (exception.is_new) {
			setData(prev => ({
				...prev,
				exceptions: prev.exceptions.filter((_, i) => i !== index),
			}));
			setActiveException(null);
			addSuccess("Successfully deleted exception.", true);
		} else {
			const body = { type: SETTING_TYPE, id: exception.unsubscribe_settings_id };
			deleteException(body, {
				onError: err => {
					addError({
						text: err.response.data.msg,
						desc: err?.response?.data?.error ?? "Please contact support",
						cId: err?.response?.data?.correlationId,
					});
				},
				onSuccess: () => {
					addSuccess("Successfully deleted exception.", true);
				},
				onSettled: () => {
					setActiveException(null);
				},
			});
		}
	};

	return (
		<div className={styles.container} id={SEARCH_OPTIONS.UNSUBSCRIBE_RULES}>
			<div className={styles.title}>
				<h2>{SETTINGS_TRANSLATION.UNSUBSCRIBE_RULES[user?.language?.toUpperCase()]}</h2>
				<p>
					{SETTINGS_TRANSLATION.UNSUBSCRIBE_RULES_DESC[user?.language?.toUpperCase()]}
				</p>
				<div>
					{isAdmin && (
						<ThemedButton
							theme={ThemedButtonThemes.GREY}
							onClick={addTeamException}
							width="fit-content"
							height="40px"
						>
							<div>
								{COMMON_TRANSLATION.ADD_A_GROUP_EXCEPTION[user?.language?.toUpperCase()]}
							</div>
						</ThemedButton>
					)}
					<ThemedButton
						theme={ThemedButtonThemes.GREY}
						onClick={addUserException}
						width="fit-content"
						height="40px"
					>
						<div>
							{SETTINGS_TRANSLATION.ADD_A_USER_EXCEPTION[user?.language?.toUpperCase()]}
						</div>
					</ThemedButton>
				</div>
			</div>
			<div className={styles.settings}>
				{isAdmin && (
					<div className={styles.unsubToggleBox}>
						<span>
							{
								SETTINGS_TRANSLATION.UNSUBSCRIBE_LINK_MENDATORY_FOR_EMAILS[
									user?.language?.toUpperCase()
								]
							}
						</span>{" "}
						<Toggle
							checked={companySettings.unsubscribe_link_madatory_for_semi_automated_mails}
							onChange={onToggleChange}
							theme="PURPLE"
						/>
					</div>
				)}
				<div className={styles.setting}>
					<h2>
						{
							SETTINGS_TRANSLATION.TASK_TO_BE_SKIPPED_IF_UNSUBSCRIBE[
								user?.language?.toUpperCase()
							]
						}
					</h2>
					<p>
						{
							SETTINGS_TRANSLATION.TASK_SKIPPED_IF_UNSUBSCRIBE[
								user?.language?.toUpperCase()
							]
						}
					</p>
					{data && <SingleUnsubscribeSetting data={data} setData={setData} />}
				</div>
				{isAdmin && (
					<div className={styles.unsubscribeLinkSettings}>
						<Label>
							{
								SETTINGS_TRANSLATION.SET_DEFAULT_UNSUBSCRIBE_TEXT[
									user?.language?.toUpperCase()
								]
							}
						</Label>
						<div className={styles.subtitle}>
							{
								SETTINGS_TRANSLATION.TEXT_WHICH_WILL_BE_CLICKABLE[
									user?.language?.toUpperCase()
								]
							}
						</div>
						<InputWithButton
							btnText={COMMON_TRANSLATION.UPDATE[user?.language?.toUpperCase()]}
							inputProps={{
								value: companySettings.default_unsubscribe_link_text,
								setValue: value =>
									setCompanySettings(prev => ({
										...prev,
										default_unsubscribe_link_text: value,
									})),
								placeholder: "eg : Click here to unsubscribe",
							}}
							btnProps={{
								onClick: onUnsubTextSave,
								loading: unsubTextLoading,
							}}
							width="70%"
						/>
					</div>
				)}
				<div className={styles.exceptions}>
					{data?.exceptions?.length > 0 &&
						data.exceptions.map((exception, index) => {
							const isLastException = index === data.exceptions.length - 1;
							return isLastException ? (
								<CollapseContainer
									openByDefault={false}
									className={styles.collapsibleContainer}
									key={exception.unsubscribe_settings_id ?? index}
									ref={exceptionRef}
									title={
										<div className={styles.header}>
											<Title className={styles.title} size="1.1rem">
												{exception.priority === SETTING_PRIORITY.USER
													? `${
															COMMON_TRANSLATION.USER_EXCEPTION[
																user?.language?.toUpperCase()
															]
													  } (${getUserName(users, exception.user_id)})`
													: `${
															COMMON_TRANSLATION.GROUP_EXCEPTION[
																user?.language?.toUpperCase()
															]
													  } (${getTeamName(subDepartments, exception.sd_id)})`}
											</Title>
											<div className={styles.btns}>
												<Button
													loading={
														(createExceptionLoading || updateExceptionLoading) &&
														activeException === index
													}
													disabled={deleteExceptionLoading && activeException === index}
													className={styles.saveBtn}
													spinnerClassName={styles.spinner}
													onClick={e => handleSave(e, exception, index)}
												>
													{COMMON_TRANSLATION.SAVE[user?.language?.toUpperCase()]}
												</Button>
												<Button
													loading={deleteExceptionLoading && activeException === index}
													disabled={
														(createExceptionLoading || updateExceptionLoading) &&
														activeException === index
													}
													className={styles.deleteBtn}
													spinnerClassName={styles.spinner}
													onClick={e => {
														e.stopPropagation();
														setDeleteModal({
															onDelete: () => handleDelete(e, exception, index),
															item:
																exception.priority === SETTING_PRIORITY.USER
																	? `${
																			COMMON_TRANSLATION.USER_EXCEPTION[
																				user?.language?.toUpperCase()
																			]
																	  } (${getUserName(users, exception.user_id)})`
																	: `${
																			COMMON_TRANSLATION.GROUP_EXCEPTION[
																				user?.language?.toUpperCase()
																			]
																	  } (${getTeamName(subDepartments, exception.sd_id)})`,
															itemType: "exception",
														});
													}}
												>
													{COMMON_TRANSLATION.DELETE[user?.language?.toUpperCase()]}
												</Button>
											</div>
										</div>
									}
								>
									<SingleUnsubscribeSetting
										exception={true}
										users={users}
										subDepartments={subDepartments}
										data={exception}
										setData={val =>
											setData({
												...data,
												exceptions: data.exceptions.map((ex, jindex) => {
													if (jindex === index) {
														return val;
													}
													return ex;
												}),
											})
										}
									/>
								</CollapseContainer>
							) : (
								<CollapseContainer
									openByDefault={false}
									className={styles.collapsibleContainer}
									key={exception.unsubscribe_settings_id ?? index}
									title={
										<div className={styles.header}>
											<Title className={styles.title} size="1.1rem">
												{exception.priority === SETTING_PRIORITY.USER
													? `${
															COMMON_TRANSLATION.USER_EXCEPTION[
																user?.language?.toUpperCase()
															]
													  } (${getUserName(users, exception.user_id)})`
													: `${
															COMMON_TRANSLATION.GROUP_EXCEPTION[
																user?.language?.toUpperCase()
															]
													  } (${getTeamName(subDepartments, exception.sd_id)})`}
											</Title>
											<div className={styles.btns}>
												<Button
													loading={
														(createExceptionLoading || updateExceptionLoading) &&
														activeException === index
													}
													disabled={deleteExceptionLoading && activeException === index}
													className={styles.saveBtn}
													spinnerClassName={styles.spinner}
													onClick={e => handleSave(e, exception, index)}
												>
													{COMMON_TRANSLATION.SAVE[user?.language?.toUpperCase()]}
												</Button>
												<Button
													loading={deleteExceptionLoading && activeException === index}
													disabled={
														(createExceptionLoading || updateExceptionLoading) &&
														activeException === index
													}
													className={styles.deleteBtn}
													spinnerClassName={styles.spinner}
													onClick={e => {
														e.stopPropagation();
														setDeleteModal({
															onDelete: () => handleDelete(e, exception, index),
															item:
																exception.priority === SETTING_PRIORITY.USER
																	? `${
																			COMMON_TRANSLATION.USER_EXCEPTION[
																				user?.language?.toUpperCase()
																			]
																	  } (${getUserName(users, exception.user_id)})`
																	: `${
																			COMMON_TRANSLATION.GROUP_EXCEPTION[
																				user?.language?.toUpperCase()
																			]
																	  } (${getTeamName(subDepartments, exception.sd_id)})`,
															itemType: "exception",
														});
													}}
												>
													{COMMON_TRANSLATION.DELETE[user?.language?.toUpperCase()]}
												</Button>
											</div>
										</div>
									}
								>
									<SingleUnsubscribeSetting
										exception={true}
										users={users}
										subDepartments={subDepartments}
										data={exception}
										setData={val =>
											setData({
												...data,
												exceptions: data.exceptions.map((ex, jindex) => {
													if (jindex === index) {
														return val;
													}
													return ex;
												}),
											})
										}
									/>
								</CollapseContainer>
							);
						})}
				</div>
			</div>
		</div>
	);
};

export default UnsubscribeRules;
