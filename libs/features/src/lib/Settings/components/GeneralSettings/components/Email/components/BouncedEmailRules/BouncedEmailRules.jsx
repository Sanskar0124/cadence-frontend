import { useContext, useState, useRef, useEffect } from "react";

import { MessageContext } from "@cadence-frontend/contexts";

//components
import { Title, Button } from "@cadence-frontend/components";
import { ThemedButton } from "@cadence-frontend/widgets";
import { CollapseContainer } from "@cadence-frontend/widgets";
import SingleBounceSetting from "./components/SingleBounceSetting/SingleBounceSetting";

import { SETTING_PRIORITY, SETTING_TYPES } from "@cadence-frontend/constants";
import { getTempTeamExceptionData, getTempUserExceptionData } from "./constants";
import { getTeamName, getUserName } from "../../../../utils";
import { Settings as SETTINGS_TRANSLATION } from "@cadence-frontend/languages";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue } from "recoil";

import styles from "./BouncedEmailRules.module.scss";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { SEARCH_OPTIONS } from "../../../../../Search/constants";

const SETTING_TYPE = SETTING_TYPES.BOUNCED_MAIL_SETTING;

const BouncedEmailRules = ({
	isAdmin,
	bouncedMailSettings: data,
	setBouncedMailSettings: setData,
	users,
	subDepartments,
	settingsDataAccess,
	setDeleteModal,
}) => {
	const { addError, addSuccess } = useContext(MessageContext);
	const user = useRecoilValue(userInfo);

	const exceptionRef = useRef(null);

	const {
		createException,
		updateException,
		deleteException,
		createExceptionLoading,
		updateExceptionLoading,
		deleteExceptionLoading,
	} = settingsDataAccess;

	const [activeException, setActiveException] = useState(null);
	const [newExceptionAdded, setNewExceptionAdded] = useState(false); // for scroll animation

	useEffect(() => {
		if (newExceptionAdded) {
			scrollToExceptionAndClick();
			setNewExceptionAdded(false);
		}
	}, [newExceptionAdded]);

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
		exception.automatic_bounced_data.reply_to = true;
		exception.semi_automatic_bounced_data.reply_to = true;
		exception.automatic_bounced_data.automated_reply_to = true;
		exception.semi_automatic_bounced_data.automated_reply_to = true;

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
						text: err?.response?.data?.msg,
						desc: err?.response?.data?.error,
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
						text: err?.response?.data?.msg,
						desc: err?.response?.data?.error,
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
			const body = { type: SETTING_TYPE, id: exception.bounced_settings_id };
			deleteException(body, {
				onError: err => {
					addError({
						text: err?.response?.data?.msg,
						desc: err?.response?.data?.error,
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
		<div className={styles.container} id={SEARCH_OPTIONS.BOUNCED_EMAIL_RULES}>
			<div className={styles.title}>
				<h2>{SETTINGS_TRANSLATION.BOUNCED_EMAIL_RULES[user?.language?.toUpperCase()]}</h2>
				<p>
					{SETTINGS_TRANSLATION.BOUNCED_EMAIL_RULES_DESC[user?.language?.toUpperCase()]}
				</p>
				<div className={styles.exceptions}>
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
				<div className={styles.setting}>
					<h2>
						{SETTINGS_TRANSLATION.TASKS_SKIPPED_IF_BOUNCED[user?.language?.toUpperCase()]}
					</h2>
					<p>
						{
							SETTINGS_TRANSLATION.TASK_SKIPPED_IF_EMAIL_BOUNCES[
								user?.language?.toUpperCase()
							]
						}
					</p>
					{data && <SingleBounceSetting data={data} setData={setData} />}
				</div>
				<div className={styles.exceptions}>
					{data?.exceptions?.length > 0 &&
						data.exceptions.map((exception, index) => {
							const isLastException = index === data.exceptions.length - 1;
							return isLastException ? (
								<CollapseContainer
									openByDefault={false}
									className={styles.collapsibleContainer}
									key={exception.bounced_settings_id ?? index}
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
									<SingleBounceSetting
										exception={true}
										users={users}
										subDepartments={subDepartments}
										data={exception}
										setData={val =>
											setData({
												...data,
												exceptions: data.exceptions.map((ex, jindex) => {
													if (jindex === index) return val;
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
									key={exception.bounced_settings_id ?? index}
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
									<SingleBounceSetting
										exception={true}
										users={users}
										subDepartments={subDepartments}
										data={exception}
										setData={val =>
											setData({
												...data,
												exceptions: data.exceptions.map((ex, jindex) => {
													if (jindex === index) return val;
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

export default BouncedEmailRules;
