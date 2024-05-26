import React, { useState, useEffect, useRef, useContext } from "react";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";
import { Button, Title } from "@cadence-frontend/components";
import {
	Common as COMMON_TRANSLATION,
	Settings as SETTINGS_TRANSLATION,
} from "@cadence-frontend/languages";
import styles from "./LeadScoring.module.scss";
import { CollapseContainer, ThemedButton } from "@cadence-frontend/widgets";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import Rubriks from "./components/Rubriks/Rubriks";
import { SETTING_PRIORITY, SETTING_TYPES } from "@cadence-frontend/constants";
import { getUserName, getTeamName } from "../../../../utils";
import {
	getTeamLeadScoreSettingExceptions,
	getUserLeadScoreSettingExceptions,
} from "./constants";
import { MessageContext } from "@cadence-frontend/contexts";
import { SEARCH_OPTIONS } from "../../../../../Search/constants";
import { useSettings } from "@cadence-frontend/data-access";
import { getConstructedStatusObject } from "./components/Rubriks/components/Status/constants";

const SETTING_TYPE = SETTING_TYPES.LEAD_SCORE_SETTING;

function LeadScoring({
	isAdmin,
	settings,
	setSettings,
	users,
	subDepartments,
	settingsDataAccess,
	setDeleteModal,
	...rest
}) {
	const user = useRecoilValue(userInfo);
	const [leadScoreSettings, setLeadScoreSettings] = useState(
		settings?.Lead_Score_Settings
	);
	const exceptionRef = useRef();
	// eslint-disable-next-line no-console
	const { addError, addSuccess } = useContext(MessageContext);

	const {
		createException,
		updateException,
		deleteException,
		createExceptionLoading,
		updateExceptionLoading,
		deleteExceptionLoading,
		refetch,
	} = settingsDataAccess;

	const { fetchSfMap, fetchSfMapLoading } = useSettings({
		role: user.role,
		enabled: false,
	});

	const [activeException, setActiveException] = useState(null);
	const [newExceptionAdded, setNewExceptionAdded] = useState(false);
	const [isRefetch, setIsRefetch] = useState(false);

	const [picklistValues, setPicklistValues] = useState({
		salesforce_lead: "",
		salesforce_contact: "",
		hubspot_contact: "",
	});

	useEffect(() => {
		fetchSfMap(null, {
			onSuccess: data => {
				setPicklistValues(prev => ({
					...prev,
					salesforce_contact: data?.account_map?.integration_status?.picklist_values,
					salesforce_lead: data?.lead_map?.integration_status?.picklist_values,
					hubspot_contact: data?.contact_map?.integration_status?.picklist_values,
				}));
			},
			onFailure: () => {
				//
			},
		});
	}, []);

	useEffect(() => {
		if (newExceptionAdded) {
			scrollToExceptionAndClick();
			setNewExceptionAdded(false);
		}
	}, [newExceptionAdded]);

	useEffect(() => {
		if (isRefetch) {
			setLeadScoreSettings({ ...settings?.Lead_Score_Settings });
		}
		setIsRefetch(false);
	}, [settings]);

	const scrollToExceptionAndClick = () => {
		if (exceptionRef.current) {
			exceptionRef.current.scrollIntoView({ behavior: "smooth" });
			exceptionRef.current.click();
		}
	};

	const addTeamException = () => {
		setLeadScoreSettings(prev => ({
			...(prev ?? []),
			exceptions: [
				...(prev?.exceptions ?? []),
				getTeamLeadScoreSettingExceptions(leadScoreSettings),
			],
		}));
		setNewExceptionAdded(true);
	};

	const addUserException = () => {
		setLeadScoreSettings(prev => ({
			...(prev ?? []),
			exceptions: [
				...(prev?.exceptions ?? []),
				getUserLeadScoreSettingExceptions(leadScoreSettings),
			],
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
			setLeadScoreSettings(prev => ({
				...prev,
				exceptions: prev.exceptions.filter((_, i) => i !== index),
			}));
			setActiveException(null);
			addSuccess("Successfully deleted exception.", true);
		} else {
			const body = { type: SETTING_TYPE, id: exception?.ls_settings_id };
			deleteException(body, {
				onError: err => {
					addError({
						text: err?.response?.data?.msg,
						desc: err?.response?.data?.error,
						cId: err?.response?.data?.correlationId,
					});
				},
				onSuccess: () => {
					setLeadScoreSettings(prev => ({
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

	useEffect(() => {
		setSettings(prev => ({ ...prev, Lead_Score_Settings: leadScoreSettings }));
	}, [leadScoreSettings]);

	return (
		<div className={styles.container} id={SEARCH_OPTIONS.LEAD_SCORING}>
			<div className={styles.title}>
				<h2>{COMMON_TRANSLATION.LEAD_SCORE_SETTINGS[user?.language?.toUpperCase()]}</h2>
				<p>
					{
						COMMON_TRANSLATION.LEAD_SCORE_SETTINGS_DESCRIPTION[
							user?.language?.toUpperCase()
						]
					}
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
					<h2>{COMMON_TRANSLATION.LEAD_SCORE[user?.language?.toUpperCase()]}</h2>
					<p>
						{COMMON_TRANSLATION.LEAD_SCORE_DESCRIPTION[user?.language?.toUpperCase()]}
					</p>
					<Rubriks
						data={leadScoreSettings}
						setData={setLeadScoreSettings}
						exception={false}
						isAdmin={isAdmin}
						users={users}
						subDepartments={subDepartments}
						//New
						picklistValues={picklistValues}
						setPicklistValues={setPicklistValues}
						fetchSfMapLoading={fetchSfMapLoading}
					/>
				</div>
				<div className={styles.exceptions}>
					{leadScoreSettings?.exceptions?.length > 0 &&
						leadScoreSettings.exceptions.map((exception, index) => {
							const isLastException = index === leadScoreSettings.exceptions?.length - 1;
							return isLastException ? (
								<CollapseContainer
									openByDefault={false}
									className={styles.collapsibleContainer}
									key={exception.ls_settings_id ?? index}
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
									<Rubriks
										exception={true}
										users={users}
										subDepartments={subDepartments}
										data={exception}
										setData={val =>
											setLeadScoreSettings({
												...leadScoreSettings,
												exceptions: leadScoreSettings?.exceptions?.map((ex, jindex) => {
													if (jindex === index) return val;
													return ex;
												}),
											})
										}
										//New
										picklistValues={picklistValues}
										setPicklistValues={setPicklistValues}
										fetchSfMapLoading={fetchSfMapLoading}
									/>
								</CollapseContainer>
							) : (
								<CollapseContainer
									openByDefault={false}
									className={styles.collapsibleContainer}
									key={exception.ls_settings_id ?? index}
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
									<Rubriks
										exception={true}
										users={users}
										subDepartments={subDepartments}
										data={exception}
										setData={val =>
											setLeadScoreSettings({
												...leadScoreSettings,
												exceptions: leadScoreSettings?.exceptions?.map((ex, jindex) => {
													if (jindex === index) return val;
													return ex;
												}),
											})
										}
										//New
										picklistValues={picklistValues}
										setPicklistValues={setPicklistValues}
										fetchSfMapLoading={fetchSfMapLoading}
									/>
								</CollapseContainer>
							);
						})}
				</div>
			</div>
		</div>
	);
}

export default LeadScoring;
