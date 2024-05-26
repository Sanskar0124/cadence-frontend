/* eslint-disable no-alert */
import { useContext, useState, useRef, useEffect } from "react";

import { MessageContext } from "@cadence-frontend/contexts";

//components
import { Title, Button } from "@cadence-frontend/components";
import { ThemedButton, CollapseContainer } from "@cadence-frontend/widgets";
import SingleCalendarSetting from "./components/SingleCalendarSetting";
import { getTempTeamExceptionData, getTempUserExceptionData } from "./constants";
import { SETTING_PRIORITY, SETTING_TYPES } from "@cadence-frontend/constants";
import { validateSendingCalendarSetting } from "./utils";
import { getUserName, getTeamName } from "../../../../utils";

import styles from "./SendingCalendar.module.scss";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import { Settings as SETTINGS_TRANSLATION } from "@cadence-frontend/languages";
import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue } from "recoil";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { SEARCH_OPTIONS } from "../../../../../Search/constants";

const SETTING_TYPE = SETTING_TYPES.AUTOMATED_TASK_SETTING;

const SendingCalendar = ({
	isAdmin,
	automatedTaskSettings: data,
	setAutomatedTaskSettings: setData,
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

		const [isValid, validationErr] = validateSendingCalendarSetting(exception);
		if (!isValid) {
			addError({ text: validationErr });
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
			const body = { type: SETTING_TYPE, id: exception.at_settings_id };
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
		<div className={styles.container} id={SEARCH_OPTIONS.SENDING_CALENDAR}>
			<div className={styles.title}>
				<h2>{SETTINGS_TRANSLATION.SENDING_CALENDER[user?.language?.toUpperCase()]}</h2>
				<p>{SETTINGS_TRANSLATION.SENDING_CALENDER_DESC[user?.language?.toUpperCase()]}</p>
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
				{data && (
					<SingleCalendarSetting data={data} setData={setData} exception={false} />
				)}
				<div className={styles.exceptions}>
					{data?.exceptions?.length > 0 &&
						data.exceptions.map((exception, index) => {
							const isLastException = index === data.exceptions.length - 1;
							return isLastException ? (
								<CollapseContainer
									openByDefault={false}
									className={styles.collapsibleContainer}
									key={exception.at_settings_id ?? index}
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
									<SingleCalendarSetting
										exception={true}
										users={users}
										subDepartments={subDepartments}
										data={exception}
										setData={val =>
											setData(prev => ({
												...prev,
												exceptions: prev.exceptions.map((ex, jindex) => {
													if (jindex === index) {
														return val;
													}
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
									key={exception.at_settings_id ?? index}
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
									<SingleCalendarSetting
										exception={true}
										users={users}
										subDepartments={subDepartments}
										data={exception}
										setData={val =>
											setData(prev => ({
												...prev,
												exceptions: prev.exceptions.map((ex, jindex) => {
													if (jindex === index) {
														return val;
													}
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

export default SendingCalendar;
