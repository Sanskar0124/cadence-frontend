import { useEffect, useState } from "react";

//compoennts
import { Divider } from "@cadence-frontend/components";
import BouncedEmailRules from "./components/BouncedEmailRules/BouncedEmailRules";
import SendingCalendar from "./components/SendingCalendar/SendingCalendar";
import UnsubscribeRules from "./components/UnsubscribeRules/UnsubscribeRules";
import styles from "./Email.module.scss";

const Email = ({
	settings,
	setSettings,
	// users,
	// subDepartments,
	settingsDataAccess,
	forceUpdate,
	setForceUpdate,
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
			setAutomatedTaskSettings(settings?.Automated_Task_Settings);
			setUnsubscribeMailSettings(settings?.Unsubscribe_Mail_Settings);
			setBouncedMailSettings(settings?.Bounced_Mail_Settings);
			setForceUpdate(false);
		}
	}, [forceUpdate]);

	return (
		<div className={styles.emailSettings}>
			<SendingCalendar
				automatedTaskSettings={automatedTaskSettings}
				setAutomatedTaskSettings={setAutomatedTaskSettings}
			/>
			<Divider style={{ marginTop: "2.9rem", marginBottom: "2.9rem" }} />
			<UnsubscribeRules
				unsubscribeMailSettings={unsubscribeMailSettings}
				setUnsubscribeMailSettings={setUnsubscribeMailSettings}
			/>
			<Divider style={{ marginTop: "2.9rem", marginBottom: "2.9rem" }} />
			<BouncedEmailRules
				bouncedMailSettings={bouncedMailSettings}
				setBouncedMailSettings={setBouncedMailSettings}
			/>
		</div>
	);
};

export default Email;
