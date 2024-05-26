/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { useEffect, useState, useContext, useRef } from "react";

import { MessageContext } from "@cadence-frontend/contexts";

//components
import { Title, Button } from "@cadence-frontend/components";
import { ThemedButton, CollapseContainer } from "@cadence-frontend/widgets";
import SingleTaskSetting from "./SingleTaskSetting/SingleTaskSetting";

import { SETTING_PRIORITY, SETTING_TYPES } from "@cadence-frontend/constants";
import { getTempTeamExceptionData, getTempUserExceptionData } from "./constants";

import { getTeamName, getUserName } from "../../../../utils";
import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue } from "recoil";

import styles from "./MaximumTasks.module.scss";
import { Settings as SETTINGS_TRANSLATION } from "@cadence-frontend/languages";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { SEARCH_OPTIONS } from "../../../../../Search/constants";

const SETTING_TYPE = SETTING_TYPES.TASK_SETTING;

const MaximumTasks = ({
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

	const [taskSettings, setTaskSettings] = useState(settings?.Task_Settings);
	const [activeException, setActiveException] = useState(null);
	const [forceUpdateTaskSettings, setForceUpdateTaskSettings] = useState(false);
	const [newExceptionAdded, setNewExceptionAdded] = useState(false); // for scroll animation

	useEffect(() => {
		if (newExceptionAdded) {
			scrollToExceptionAndClick();
			setNewExceptionAdded(false);
		}
	}, [newExceptionAdded]);

	useEffect(() => {
		setSettings(prev => ({ ...prev, Task_Settings: taskSettings }));
	}, [taskSettings]);

	useEffect(() => {
		if (forceUpdate) {
			setTaskSettings(settings.Task_Settings);
			setForceUpdateTaskSettings(true);
			setForceUpdate(false);
		}
	}, [forceUpdate]);

	const addTeamException = () => {
		setTaskSettings(prev => ({
			...prev,
			exceptions: [...prev.exceptions, getTempTeamExceptionData(taskSettings)],
		}));
		setNewExceptionAdded(true);
	};

	const addUserException = () => {
		setTaskSettings(prev => ({
			...prev,
			exceptions: [...prev.exceptions, { ...getTempUserExceptionData(taskSettings) }],
		}));
		setNewExceptionAdded(true);
	};

	const scrollToExceptionAndClick = () => {
		if (exceptionRef.current) {
			exceptionRef.current.scrollIntoView({ behavior: "smooth" });
			exceptionRef.current.click();
		}
	};

	const handleSaveClick = (e, exception, index) => {
		e.stopPropagation();

		if (exception.priority === SETTING_PRIORITY.USER && !exception.user_id) {
			addError({ text: "Please select a user." });
			return;
		}
		if (exception.priority === SETTING_PRIORITY.SUB_DEPARTMENT && !exception.sd_id) {
			addError({ text: "Please select a team." });
			return;
		}

		// const [isValid, validationErr] = validateTaskSetting(exception);
		// if (!isValid) {
		// 	addError(validationErr);
		// 	return;
		// }

		setActiveException(index);
		handleSave(exception);
	};

	const handleSave = exception => {
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
			setTaskSettings(prev => ({
				...prev,
				exceptions: prev.exceptions.filter((_, i) => i !== index),
			}));
			setActiveException(null);
			addSuccess("Successfully deleted exception.", true);
		} else {
			const body = { type: SETTING_TYPE, id: exception.task_settings_id };
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
		<div className={styles.container} id={SEARCH_OPTIONS.TASK_SETTINGS}>
			<div className={styles.title}>
				<h2>{SETTINGS_TRANSLATION.TASK_SETTINGS[user?.language?.toUpperCase()]}</h2>
				<p>{SETTINGS_TRANSLATION.TASK_SETTINGS_DESC[user?.language?.toUpperCase()]}</p>
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
				{taskSettings && (
					<SingleTaskSetting
						data={taskSettings}
						setData={setTaskSettings}
						exception={false}
						forceUpdate={forceUpdateTaskSettings}
						setForceUpdate={setForceUpdateTaskSettings}
					/>
				)}
				<div className={styles.exceptions}>
					{taskSettings?.exceptions?.map((exception, index) => {
						const isLastException = index === taskSettings.exceptions?.length - 1;
						return isLastException ? (
							<CollapseContainer
								openByDefault={false}
								className={styles.collapsibleContainer}
								key={exception.task_settings_id ?? index}
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
												onClick={e => handleSaveClick(e, exception, index)}
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
								<SingleTaskSetting
									exception={true}
									users={users}
									subDepartments={subDepartments}
									data={exception}
									forceUpdate={forceUpdateTaskSettings}
									setForceUpdate={setForceUpdateTaskSettings}
									setData={val =>
										setTaskSettings(prev => ({
											...prev,
											exceptions: prev.exceptions?.map((ex, jindex) => {
												if (jindex === index) return val;
												return ex;
											}),
										}))
									}
								/>
							</CollapseContainer>
						) : (
							<CollapseContainer
								openByDefault={false}
								className={styles.collapsibleContainer}
								key={exception.task_settings_id ?? index}
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
												onClick={e => handleSaveClick(e, exception, index)}
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
								<SingleTaskSetting
									exception={true}
									users={users}
									subDepartments={subDepartments}
									data={exception}
									forceUpdate={forceUpdateTaskSettings}
									setForceUpdate={setForceUpdateTaskSettings}
									setData={val =>
										setTaskSettings(prev => ({
											...prev,
											exceptions: prev.exceptions?.map((ex, jindex) => {
												if (jindex === index) return val;
												return ex;
											}),
										}))
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

export default MaximumTasks;
