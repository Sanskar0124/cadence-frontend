/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { useEffect, useState, useContext } from "react";

import { MessageContext } from "@cadence-frontend/contexts";

//components
import { Title, Button } from "@cadence-frontend/components";
// import { ThemedButton, CollapseContainer } from "@cadence-frontend/widgets";
// import { validateTaskSetting, getTotalTasks } from "./utils";
import SingleTaskSetting from "./SingleTaskSetting/SingleTaskSetting";
// import SplitTaskModal from "./SplitTaskModal/SplitTaskModal";

import { SETTING_PRIORITY, SETTING_TYPES } from "@cadence-frontend/constants";
// import { getTempTeamExceptionData, getTempUserExceptionData } from "./constants";

import styles from "./MaximumTasks.module.scss";
import { Settings as SETTINGS_TRANSLATION } from "@cadence-frontend/languages";
import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue } from "recoil";

// const SETTING_TYPE = SETTING_TYPES.TASK_SETTING;

const MaximumTasks = ({
	settings,
	setSettings,
	// isAdmin,
	// users,
	// subDepartments,
	// settingsDataAccess,
	forceUpdate,
	setForceUpdate,
}) => {
	const { addError, addSuccess } = useContext(MessageContext);
	const user = useRecoilValue(userInfo);

	// const {
	// 	createException,
	// 	updateException,
	// 	deleteException,
	// 	createExceptionLoading,
	// 	updateExceptionLoading,
	// 	deleteExceptionLoading,
	// } = settingsDataAccess;

	const [taskSettings, setTaskSettings] = useState(settings?.Task_Settings);
	// const [activeException, setActiveException] = useState(null);
	// const [modal, setModal] = useState(null);
	const [forceUpdateTaskSettings, setForceUpdateTaskSettings] = useState(false);

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

	// const addTeamException = () => {
	// 	setTaskSettings(prev => ({
	// 		...prev,
	// 		exceptions: [...prev.exceptions, getTempTeamExceptionData(taskSettings)],
	// 	}));
	// };

	// const addUserException = () => {
	// 	setTaskSettings(prev => ({
	// 		...prev,
	// 		exceptions: [...prev.exceptions, getTempUserExceptionData(taskSettings)],
	// 	}));
	// };

	// const handleSaveClick = (e, exception, index) => {
	// 	e.stopPropagation();

	// 	if (exception.priority === SETTING_PRIORITY.USER && !exception.user_id) {
	// 		addError("Please select a user.");
	// 		return;
	// 	}
	// 	if (exception.priority === SETTING_PRIORITY.SUB_DEPARTMENT && !exception.sd_id) {
	// 		addError("Please select a team.");
	// 		return;
	// 	}

	// 	const [isValid, validationErr] = validateTaskSetting(exception);
	// 	if (!isValid) {
	// 		addError(validationErr);
	// 		return;
	// 	}

	// 	setActiveException(index);

	// 	const remainingTasks = exception.max_tasks - getTotalTasks(exception);

	// 	if (remainingTasks > 0)
	// 		setModal({
	// 			exception,
	// 			index,
	// 			remainingTasks,
	// 		});
	// 	else handleSave(exception);
	// };

	// const handleSave = exception => {
	// 	let body = { type: SETTING_TYPE, body: { ...exception } };
	// 	if (exception.is_new) {
	// 		delete body.body.is_new;

	// 		// add sd_id field in body if it's user exception
	// 		if (exception.priority === SETTING_PRIORITY.USER)
	// 			body = {
	// 				...body,
	// 				body: {
	// 					...body.body,
	// 					sd_id: users?.filter(user => user.value === exception.user_id)[0].sd_id,
	// 				},
	// 			};

	// 		createException(body, {
	// 			onError: err => {
	// 				addError(err?.response?.data?.msg, err?.response?.data?.error);
	// 			},
	// 			onSuccess: () => {
	// 				addSuccess("Successfully created new exception.");
	// 				setModal(null);
	// 			},
	// 			onSettled: () => {
	// 				setActiveException(null);
	// 			},
	// 		});
	// 	} else {
	// 		updateException(body, {
	// 			onError: err => {
	// 				addError(err?.response?.data?.msg, err?.response?.data?.error);
	// 			},
	// 			onSuccess: () => {
	// 				addSuccess("Successfully updated exception.");
	// 				setModal(null);
	// 			},
	// 			onSettled: () => {
	// 				setActiveException(null);
	// 			},
	// 		});
	// 	}
	// };

	// const handleDelete = (e, exception, index) => {
	// 	e.stopPropagation();

	// 	setActiveException(index);

	// 	if (exception.is_new) {
	// 		setTaskSettings(prev => ({
	// 			...prev,
	// 			exceptions: prev.exceptions.filter((_, i) => i !== index),
	// 		}));
	// 		setActiveException(null);
	// 		addSuccess("Successfully deleted exception.", true);
	// 	} else {
	// 		const body = { type: SETTING_TYPE, id: exception.task_settings_id };
	// 		deleteException(body, {
	// 			onError: err => {
	// 				addError(err?.response?.data?.msg, err?.response?.data?.error);
	// 			},
	// 			onSuccess: () => {
	// 				addSuccess("Successfully deleted exception.", true);
	// 			},
	// 			onSettled: () => {
	// 				setActiveException(null);
	// 			},
	// 		});
	// 	}
	// };

	return (
		<div className={styles.taskCadenceSettings} id="max_tasks">
			<div className={styles.header}>
				<Title size="1.3rem" className={styles.title}>
					{SETTINGS_TRANSLATION.MAXIMUM_TASKS[user?.language?.toUpperCase()]}
				</Title>
				{/* <div className={styles.exceptions}>
					{isAdmin && (
						<ThemedButton
							className={styles.teamExceptionButton}
							theme="GREY"
							onClick={() => addTeamException()}>
							Add a Team Exception
						</ThemedButton>
					)}
					<ThemedButton
						className={styles.teamExceptionButton}
						theme="GREY"
						onClick={() => addUserException()}>
						Add a User Exception
					</ThemedButton>
				</div> */}
			</div>
			{/* <div className={styles.right}> */}
			{taskSettings && (
				<SingleTaskSetting
					data={taskSettings}
					setData={setTaskSettings}
					forceUpdate={forceUpdateTaskSettings}
					setForceUpdate={setForceUpdateTaskSettings}
				/>
			)}
			{/* <div className={styles.exceptions}>
					{taskSettings?.exceptions?.map((exception, index) => {
						return (
							<CollapseContainer
								openByDefault={false}
								className={styles.collapsibleContainer}
								key={exception.task_settings_id ?? index}
								title={
									<div className={styles.header}>
										<Title className={styles.title} size="1.1rem">
											{exception.priority === SETTING_PRIORITY.USER
												? "User Exception"
												: "Team Exception"}
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
												onClick={e => handleSaveClick(e, exception, index)}>
												Save
											</Button>
											<Button
												loading={deleteExceptionLoading && activeException === index}
												disabled={
													(createExceptionLoading || updateExceptionLoading) &&
													activeException === index
												}
												className={styles.deleteBtn}
												spinnerClassName={styles.spinner}
												onClick={e => handleDelete(e, exception, index)}>
												Delete
											</Button>
										</div>
									</div>
								}>
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
				</div> */}
			{/* </div> */}
			{/* <SplitTaskModal
				modal={modal}
				setModal={setModal}
				handleSave={handleSave}
				setActiveException={setActiveException}
				loading={
					(createExceptionLoading || updateExceptionLoading) &&
					activeException === modal?.index
				}
			/> */}
		</div>
	);
};

export default MaximumTasks;
