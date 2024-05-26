import { useSettings } from "@cadence-frontend/data-access";
import { MessageContext } from "@cadence-frontend/contexts";
import { userInfo } from "@cadence-frontend/atoms";
import { useState, useEffect, useContext } from "react";
import { useRecoilValue } from "recoil";
import styles from "./AdminRules.module.scss";
import { NAV_SIDEBAR_OPTIONS } from "./constants";
import NavSidebar from "./components/NavSidebar/NavSidebar";
import Placeholder from "./components/Placeholder/Placeholder";
import { validateSendingCalendarSetting } from "./components/Email/components/SendingCalendar/utils";
import {
	getTotalTasks,
	validateTaskSetting,
} from "./components/TaskCadence/components/MaximumTasks/utils";
import SplitTaskModal from "./components/TaskCadence/components/MaximumTasks/SplitTaskModal/SplitTaskModal";
import { deleteExceptionsFromObject } from "./utils";

//components

//constants

const AdminRules = ({ postDataRef }) => {
	const userObj = useRecoilValue(userInfo);
	const role = userObj.role;

	const settingsDataAccess = useSettings({ role });
	const {
		settings: data,
		settingsLoading,
		updateSettings,
		updateLoading,
	} = settingsDataAccess;

	const { addError, addSuccess } = useContext(MessageContext);

	const [settings, setSettings] = useState(null);
	const [currentStep, setCurrentStep] = useState("email");
	const [taskSplitModal, setTaskSplitModal] = useState(null);
	const [forceUpdate, setForceUpdate] = useState(false);

	useEffect(() => {
		if (data) {
			setSettings(data);
			setForceUpdate(true);
		}
	}, [data]);

	useEffect(() => {
		postDataRef.current = handleSaveClick;
	}, [settings]);

	const handleSaveClick = ({ cb }) => {
		let body = deleteExceptionsFromObject(settings);

		// validate Sending Calendar Settings
		const [isValidAtSetting, validationErrAtSetting] = validateSendingCalendarSetting(
			body?.Automated_Task_Settings
		);
		if (!isValidAtSetting) {
			addError({ text: validationErrAtSetting });
			return;
		}

		handleSave({ body, cb });
	};

	const handleSave = ({ body, cb }) => {
		//temp fix for Send Reply to always send true and hidden in the UI
		body.Bounced_Mail_Settings.automatic_bounced_data.reply_to = true;
		body.Bounced_Mail_Settings.semi_automatic_bounced_data.reply_to = true;
		body.Unsubscribe_Mail_Settings.automatic_unsubscribed_data.reply_to = true;
		body.Unsubscribe_Mail_Settings.semi_automatic_unsubscribed_data.reply_to = true;
		body.Bounced_Mail_Settings.automatic_bounced_data.automated_reply_to = true;
		body.Bounced_Mail_Settings.semi_automatic_bounced_data.automated_reply_to = true;
		body.Unsubscribe_Mail_Settings.automatic_unsubscribed_data.automated_reply_to = true;
		body.Unsubscribe_Mail_Settings.semi_automatic_unsubscribed_data.automated_reply_to = true;

		//remove unsubscribe link settings fetched while updating
		delete body.Unsubscribe_Mail_Settings.custom_domain;
		delete body.Unsubscribe_Mail_Settings.default_unsubscribe_link_text;
		delete body.Unsubscribe_Mail_Settings.unsubscribe_link_madatory_for_automated_mails;
		delete body.Unsubscribe_Mail_Settings
			.unsubscribe_link_madatory_for_semi_automated_mails;

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
				if (typeof cb === "function") cb();
			},
			onSettled: () => {
				setTaskSplitModal(null);
			},
		});
	};

	return (
		<div className={styles.adminRules}>
			<div className={styles.navSidebar}>
				<NavSidebar setCurrentStep={setCurrentStep} currentStep={currentStep} />
			</div>
			<div className={styles.navSidebarView}>
				{settings ? (
					Object.keys(NAV_SIDEBAR_OPTIONS).map(
						key =>
							key === currentStep &&
							NAV_SIDEBAR_OPTIONS[key].component({
								settings,
								setSettings,
								// users,
								// subDepartments,
								settingsDataAccess,
								forceUpdate,
								setForceUpdate,
							})
					)
				) : (
					<Placeholder currentStep={currentStep} />
				)}
			</div>
			<SplitTaskModal
				modal={taskSplitModal}
				setModal={setTaskSplitModal}
				handleSave={handleSave}
				loading={updateLoading}
			/>
		</div>
	);
};

export default AdminRules;
