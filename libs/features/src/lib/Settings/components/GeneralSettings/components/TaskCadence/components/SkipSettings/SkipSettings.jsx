import { Button, Title } from "@cadence-frontend/components";
import React, { useContext, useEffect, useRef, useState } from "react";
import styles from "./SkipSettings.module.scss";
import { Settings as SETTINGS_TRANSLATION } from "@cadence-frontend/languages";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";
import { CollapseContainer, TaskStack, ThemedButton } from "@cadence-frontend/widgets";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import { SETTING_PRIORITY, SETTING_TYPES } from "@cadence-frontend/constants";
import { getTeamName, getUserName } from "../../../../utils";
import SingleSkipSettings from "./components/SingleSkipSettings/SingleSkipSettings";
import AddReasons from "./components/AddReasons/AddReasons";
import {
	getTeamSkipSettingExceptions,
	getTempTeamExceptionData,
	getTempUserExceptionData,
	getUserSkipSettingExceptions,
} from "../MaximumTasks/constants";
import { MessageContext } from "@cadence-frontend/contexts";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { SEARCH_OPTIONS } from "../../../../../Search/constants";

const SETTING_TYPE = SETTING_TYPES.SKIP_SETTING;

const SkipSettings = ({
	settings,
	setSettings,
	isAdmin,
	users,
	subDepartments,
	settingsDataAccess,
	forceUpdate,
	setForceUpdate,
	setDeleteModal,
}) => {
	const user = useRecoilValue(userInfo);
	const { addError, addSuccess } = useContext(MessageContext);
	const [taskSettings, setTaskSettings] = useState(settings?.Skip_Settings);
	const [isRefetch, setIsRefetch] = useState(false);
	const exceptionRef = useRef(null);

	useEffect(() => {
		if (isRefetch) {
			setTaskSettings({ ...settings?.Skip_Settings });
		}
		setIsRefetch(false);
	}, [settings]);

	useEffect(() => {
		let temp = { ...taskSettings };
		delete temp?.skip_allowed_tasks["automated_message"];
		delete temp?.skip_allowed_tasks["automated_mail"];
		temp.skip_allowed_tasks.reply_to = Boolean(temp.skip_allowed_tasks.mail);

		if (user.role === "manager") {
			temp.sd_id = user.sd_id;
			temp.priority = 2;
		}
		setSettings(prev => ({ ...prev, Skip_Settings: temp }));
	}, [taskSettings]);

	const {
		createException,
		updateException,
		deleteException,
		createExceptionLoading,
		updateExceptionLoading,
		deleteExceptionLoading,
		refetch,
	} = settingsDataAccess;

	const [activeException, setActiveException] = useState(null);
	const [newExceptionAdded, setNewExceptionAdded] = useState(false);

	useEffect(() => {
		if (newExceptionAdded) {
			scrollToExceptionAndClick();
			setNewExceptionAdded(false);
		}
	}, [newExceptionAdded]);

	const scrollToExceptionAndClick = () => {
		if (exceptionRef.current) {
			exceptionRef.current.scrollIntoView({ behavior: "smooth" });
			exceptionRef.current.click();
		}
	};

	const addTeamException = () => {
		setTaskSettings(prev => ({
			...prev,
			exceptions: [...prev.exceptions, getTeamSkipSettingExceptions(taskSettings)],
		}));
		setNewExceptionAdded(true);
	};

	const addUserException = () => {
		setTaskSettings(prev => ({
			...prev,
			exceptions: [...prev.exceptions, getUserSkipSettingExceptions(taskSettings)],
		}));
		setNewExceptionAdded(true);
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
					setIsRefetch(true);
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
			setTaskSettings(prev => ({
				...prev,
				exceptions: prev.exceptions.filter((_, i) => i !== index),
			}));
			setActiveException(null);
			addSuccess("Successfully deleted exception.", true);
		} else {
			const body = { type: SETTING_TYPE, id: exception.skip_settings_id };
			deleteException(body, {
				onError: err => {
					addError({
						text: err?.response?.data?.msg,
						desc: err?.response?.data?.error,
						cId: err?.response?.data?.correlationId,
					});
				},
				onSuccess: () => {
					setTaskSettings(prev => ({
						...prev,
						exceptions: prev.exceptions.filter((_, i) => i !== index),
					}));
					addSuccess("Successfully deleted exception.", true);
				},
				onSettled: () => {
					setActiveException(null);
				},
			});
		}
	};
	return (
		<div className={styles.container} id={SEARCH_OPTIONS.SKIP_TASK_SETTINGS}>
			<div className={styles.title}>
				<h2>{SETTINGS_TRANSLATION.SKIP_TASK_SETTINGS[user?.language?.toUpperCase()]}</h2>
				<p>
					{SETTINGS_TRANSLATION.SKIP_TASK_SETTINGS_DESC[user?.language?.toUpperCase()]}
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
						{
							SETTINGS_TRANSLATION.SKIP_TASK_SETTINGS_REASONS[
								user?.language?.toUpperCase()
							]
						}
					</h2>
					<p>
						{SETTINGS_TRANSLATION.SKIP_TASK_REASONS_LIMIT[user?.language?.toUpperCase()]}
					</p>
					<AddReasons
						reasons={taskSettings?.skip_reasons}
						taskSettings={taskSettings}
						setTaskSettings={setTaskSettings}
					/>
				</div>
				<div className={styles.setting}>
					<h2>{SETTINGS_TRANSLATION.SKIP_TASK_TASKS[user?.language?.toUpperCase()]}</h2>
					<p className={styles.description}>
						{SETTINGS_TRANSLATION.SKIP_TASK_SELECT_TASK[user?.language?.toUpperCase()]}
					</p>
					<TaskStack
						value={taskSettings}
						setValue={val => {
							setTaskSettings(val);
						}}
						name={["skip_allowed_tasks"]}
					/>
				</div>
				<div className={styles.exceptions}>
					{taskSettings?.exceptions?.length > 0 &&
						taskSettings.exceptions.map((exception, index) => {
							const isLastException = index === taskSettings.exceptions.length - 1;
							return isLastException ? (
								<CollapseContainer
									openByDefault={false}
									className={styles.collapsibleContainer}
									key={exception.skip_settings_id ?? index}
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
									<SingleSkipSettings
										exception={true}
										users={users}
										subDepartments={subDepartments}
										data={exception}
										setData={val =>
											setTaskSettings({
												...taskSettings,
												exceptions: taskSettings.exceptions.map((ex, jindex) => {
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
									key={exception.skip_settings_id ?? index}
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
									<SingleSkipSettings
										exception={true}
										users={users}
										subDepartments={subDepartments}
										data={exception}
										setData={val =>
											setTaskSettings({
												...taskSettings,
												exceptions: taskSettings.exceptions.map((ex, jindex) => {
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

export default SkipSettings;
