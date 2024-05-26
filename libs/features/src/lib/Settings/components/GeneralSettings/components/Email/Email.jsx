import { useEffect, useState } from "react";

//compoennts
import styles from "./Email.module.scss";
import BouncedEmailRules from "./components/BouncedEmailRules/BouncedEmailRules";
import CustomDomain from "./components/CustomDomain/CustomDomain";
import SendingCalendar from "./components/SendingCalendar/SendingCalendar";
import UnsubscribeRules from "./components/UnsubscribeRules/UnsubscribeRules";

const Email = ({
	settings,
	setSettings,
	isAdmin,
	users,
	subDepartments,
	settingsDataAccess,
	forceUpdate,
	setForceUpdate,
	setDeleteModal,
	user,
}) => {
	const [automatedTaskSettings, setAutomatedTaskSettings] = useState(
		settings?.Automated_Task_Settings
	);
	const [unsubscribeMailSettings, setUnsubscribeMailSettings] = useState(
		settings.Unsubscribe_Mail_Settings
	);
	const [bouncedMailSettings, setBouncedMailSettings] = useState(
		settings.Bounced_Mail_Settings
	);

	const [customDomainSettings, setCustomDomainSettings] = useState(
		settings?.Custom_Domain_Settings
	);

	useEffect(() => {
		setSettings(prev => ({ ...prev, Automated_Task_Settings: automatedTaskSettings }));
	}, [automatedTaskSettings]);

	useEffect(() => {
		setSettings(prev => ({
			...prev,
			Unsubscribe_Mail_Settings: unsubscribeMailSettings,
		}));
	}, [unsubscribeMailSettings]);

	useEffect(() => {
		setSettings(prev => ({ ...prev, Bounced_Mail_Settings: bouncedMailSettings }));
	}, [bouncedMailSettings]);

	useEffect(() => {
		if (forceUpdate) {
			setAutomatedTaskSettings(settings.Automated_Task_Settings);
			setUnsubscribeMailSettings(settings.Unsubscribe_Mail_Settings);
			setBouncedMailSettings(settings.Bounced_Mail_Settings);
			setForceUpdate(false);
		}
	}, [forceUpdate]);

	return (
		<div className={styles.emailSettings}>
			<SendingCalendar
				isAdmin={isAdmin}
				automatedTaskSettings={automatedTaskSettings}
				setAutomatedTaskSettings={setAutomatedTaskSettings}
				users={users}
				subDepartments={subDepartments}
				settingsDataAccess={settingsDataAccess}
				setDeleteModal={setDeleteModal}
			/>
			<div className={styles.divider} />
			<UnsubscribeRules
				isAdmin={isAdmin}
				unsubscribeMailSettings={unsubscribeMailSettings}
				setUnsubscribeMailSettings={setUnsubscribeMailSettings}
				users={users}
				subDepartments={subDepartments}
				settingsDataAccess={settingsDataAccess}
				user={user}
				setDeleteModal={setDeleteModal}
			/>
			<div className={styles.divider} />
			<BouncedEmailRules
				isAdmin={isAdmin}
				bouncedMailSettings={bouncedMailSettings}
				setBouncedMailSettings={setBouncedMailSettings}
				users={users}
				subDepartments={subDepartments}
				settingsDataAccess={settingsDataAccess}
				setDeleteModal={setDeleteModal}
			/>
			{isAdmin && (
				<>
					<div className={styles.divider} />
					<CustomDomain
						isAdmin={isAdmin}
						settingsDataAccess={settingsDataAccess}
						customDomainSettings={customDomainSettings}
						setCustomDomainSettings={setCustomDomainSettings}
					/>
				</>
			)}
		</div>
	);
};

export default Email;
