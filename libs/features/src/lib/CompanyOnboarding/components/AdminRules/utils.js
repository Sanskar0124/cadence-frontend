export const deleteExceptionsFromObject = settings => {
	const settingsObject = structuredClone(settings);

	delete settingsObject.Automated_Task_Settings["exceptions"];
	delete settingsObject.Bounced_Mail_Settings["exceptions"];
	delete settingsObject.Unsubscribe_Mail_Settings["exceptions"];
	if (settingsObject.Task_Settings) delete settingsObject.Task_Settings["exceptions"];
	if (settingsObject.Skip_Settings) delete settingsObject.Skip_Settings["exceptions"];
	delete settingsObject.Custom_Domain_Settings;
	if (settingsObject.Lead_Score_Settings)
		delete settingsObject.Lead_Score_Settings["exceptions"];

	return settingsObject;
};
