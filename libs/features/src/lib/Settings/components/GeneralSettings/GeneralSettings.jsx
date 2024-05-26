import { useContext, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";

import { userInfo } from "@cadence-frontend/atoms";
import { MessageContext } from "@cadence-frontend/contexts";

//components
import { DeleteModal, Title } from "@cadence-frontend/components";
import {
	useSettings,
	useSubDepartments,
	useUser,
	useUsers,
} from "@cadence-frontend/data-access";
import { deepEqual, useQuery } from "@cadence-frontend/utils";
import { validateSendingCalendarSetting } from "./components/Email/components/SendingCalendar/utils";
import Placeholder from "./components/Placeholder/Placeholder";
import { deleteExceptionsFromObject } from "./utils";

import { ROLES, SETTING_PRIORITY } from "@cadence-frontend/constants";
import { SETTINGS_OPTIONS } from "./constants";

import styles from "./GeneralSettings.module.scss";
import { useNavigate } from "react-router-dom";

const GeneralSettings = ({ postDataRef, setIfUnsavedChanges, setSaveBtnLoading }) => {
	const userObj = useRecoilValue(userInfo);
	const role = userObj.role;
	const navigate = useNavigate();

	const query = useQuery();
	const searchParam = query.get("search");

	const settingsDataAccess = useSettings({ role });
	const {
		settings: data,
		updateSettings,
		settingsLoading,
		updateLoading,
	} = settingsDataAccess;
	const { subDepartments } = useSubDepartments();
	const { users } = useUsers();
	const { user } = useUser({ user: true });

	const { addError, addSuccess } = useContext(MessageContext);

	const [settings, setSettings] = useState(null);
	const [forceUpdate, setForceUpdate] = useState(false);
	const [deleteModal, setDeleteModal] = useState(false);
	const [saveAvailable, setSaveAvailable] = useState(false);

	useEffect(() => {
		if (data) {
			let newData = {
				...data,
			};
			setSettings(newData);
			setForceUpdate(true);
		}
	}, [data]);

	useEffect(() => {
		postDataRef.current = () => handleSaveClick(settings);
	}, [settings]);

	useEffect(() => {
		if (!settingsLoading && data && settings) {
			if (!saveAvailable) setTimeout(() => setSaveAvailable(true), 3000);
		}
		if (typeof setIfUnsavedChanges === "function" && data && settings && saveAvailable)
			setIfUnsavedChanges(() => () => checkIfSettingsChanged(data, settings));
	}, [data, settings, settingsLoading, saveAvailable]);

	useEffect(() => {
		if (searchParam) {
			let element = document.getElementById(searchParam);
			if (element) {
				element?.scrollIntoView({ behavior: "smooth", block: "start" });
				element.style.background = "#cbeff3bc";
				setTimeout(() => (element.style.background = "none"), 1000);
				navigate("?view=general_settings");
			}
		}
	}, [settings]);

	useEffect(() => {
		setSaveBtnLoading(updateLoading);
	}, [updateLoading]);

	const checkIfSettingsChanged = (data, settings) => {
		const dataWithoutExceptions = deleteExceptionsFromObject(data);
		const settingsWithoutExceptions = deleteExceptionsFromObject(settings);
		return !deepEqual(dataWithoutExceptions, settingsWithoutExceptions);
	};

	const handleSaveClick = settings => {
		let body = deleteExceptionsFromObject(settings);

		// validate Sending Calendar Settings
		const [isValidAtSetting, validationErrAtSetting] = validateSendingCalendarSetting(
			body.Automated_Task_Settings
		);
		if (!isValidAtSetting) {
			addError({ text: validationErrAtSetting });
			return;
		}

		handleSave(body);
	};

	const handleSave = body => {
		//temp fix for Send Reply to always send true and hidden in the UI
		body.Bounced_Mail_Settings.automatic_bounced_data.reply_to = true;
		body.Bounced_Mail_Settings.semi_automatic_bounced_data.reply_to = true;
		body.Unsubscribe_Mail_Settings.automatic_unsubscribed_data.reply_to = true;
		body.Unsubscribe_Mail_Settings.semi_automatic_unsubscribed_data.reply_to = true;
		body.Bounced_Mail_Settings.automatic_bounced_data.automated_reply_to = true;
		body.Bounced_Mail_Settings.semi_automatic_bounced_data.automated_reply_to = true;
		body.Unsubscribe_Mail_Settings.automatic_unsubscribed_data.automated_reply_to = true;
		body.Unsubscribe_Mail_Settings.semi_automatic_unsubscribed_data.automated_reply_to = true;
		if (role === ROLES.MANAGER) {
			body.Skip_Settings.priority = 2;
			body.Skip_Settings.sd_id = userObj.sd_id;
		}

		//remove unsubscribe link settings fetched while updating
		delete body.Unsubscribe_Mail_Settings.custom_domain;
		delete body.Unsubscribe_Mail_Settings.default_unsubscribe_link_text;
		delete body.Unsubscribe_Mail_Settings.unsubscribe_link_madatory_for_automated_mails;
		delete body.Unsubscribe_Mail_Settings
			.unsubscribe_link_madatory_for_semi_automated_mails;

		if (role === ROLES.ADMIN || role === ROLES.SUPER_ADMIN)
			updateSettings(body, {
				onError: err => {
					addError({
						text: err?.response?.data?.msg,
						desc: err?.response?.data?.error,
						cId: err?.response?.data?.correlationId,
					});
				},
				onSuccess: () => {
					addSuccess("Settings updated");
				},
			});
		else {
			// Exceptions removed from Fetched Data to check deep equality
			const {
				Automated_Task_Settings: automatedTaskSettings,
				Unsubscribe_Mail_Settings: unsubscribeMailSettings,
				Bounced_Mail_Settings: bouncedMailSettings,
				Task_Settings: taskSettings,
				Lead_Score_Settings: leadScoreSettings,
			} = deleteExceptionsFromObject(data);

			if (!deepEqual(body.Automated_Task_Settings, automatedTaskSettings)) {
				body.Automated_Task_Settings.priority = SETTING_PRIORITY.SUB_DEPARTMENT;
				body.Automated_Task_Settings.sd_id = user.sd_id;
				// delete body.Automated_Task_Settings.at_settings_id;
			}
			if (!deepEqual(body.Unsubscribe_Mail_Settings, unsubscribeMailSettings)) {
				body.Unsubscribe_Mail_Settings.priority = SETTING_PRIORITY.SUB_DEPARTMENT;
				body.Unsubscribe_Mail_Settings.sd_id = user.sd_id;
				delete body.Unsubscribe_Mail_Settings.unsubscribe_settings_id;
			}
			if (!deepEqual(body.Bounced_Mail_Settings, bouncedMailSettings)) {
				body.Bounced_Mail_Settings.priority = SETTING_PRIORITY.SUB_DEPARTMENT;
				body.Bounced_Mail_Settings.sd_id = user.sd_id;
				delete body.Bounced_Mail_Settings.bounced_settings_id;
			}
			if (!deepEqual(body.Task_Settings, taskSettings)) {
				body.Task_Settings.priority = SETTING_PRIORITY.SUB_DEPARTMENT;
				body.Task_Settings.sd_id = user.sd_id;
				delete body.Task_Settings.task_settings_id;
			}
			if (!deepEqual(body.Lead_Score_Settings, leadScoreSettings)) {
				body.Lead_Score_Settings.priority = SETTING_PRIORITY.SUB_DEPARTMENT;
				body.Lead_Score_Settings.sd_id = user.sd_id;
				delete body.Lead_Score_Settingss.ls_settings_id;
			}
			updateSettings(body, {
				onError: err => {
					addError({
						text: err?.response?.data?.msg,
						desc: err?.response?.data?.error,
						cId: err?.response?.data?.correlationId,
					});
				},
				onSuccess: () => {
					addSuccess("Settings updated");
				},
			});
		}
	};

	const isAdmin = role === ROLES.ADMIN || role === ROLES.SUPER_ADMIN;

	return (
		<div className={styles.generalSettings}>
			{/* <Div className={styles.headerOptions} loading={settingsLoading}>
				{data && settings && checkIfSettingsChanged() && (
					<ThemedButton
						loading={updateLoading}
						onClick={handleSaveClick}
						theme={ThemedButtonThemes.PINK}
						loadingText={"Saving"}
						width="fit-content"
					>
						Save
					</ThemedButton>
				)}
			</Div> */}
			{settings ? (
				SETTINGS_OPTIONS.map(({ name, component }, index) => {
					return (
						<div className={styles.settingBlock + " " + styles[name]} key={index}>
							<Title size="1.1rem">{name[user?.language?.toUpperCase()]}</Title>
							<div className={styles.divider} />
							<div>
								{component({
									settingsDataAccess,
									settings,
									setSettings,
									isAdmin,
									forceUpdate,
									setForceUpdate,
									setDeleteModal,
									users: users?.map(user => ({
										label: `${user.first_name} ${user.last_name}`,
										value: user.user_id,
										sd_id: user.sd_id,
									})),
									subDepartments: subDepartments?.map(sd => ({
										label: sd.name,
										value: sd.sd_id,
									})),
									user,
								})}
							</div>
						</div>
					);
				})
			) : (
				<Placeholder />
			)}
			<DeleteModal
				modal={deleteModal}
				setModal={setDeleteModal}
				onDelete={deleteModal?.onDelete}
				itemType={deleteModal?.itemType}
				item={deleteModal?.item}
			/>
		</div>
	);
};

export default GeneralSettings;
