export const deleteExceptionsFromObject = settings => {
	const settingsObject = JSON.parse(JSON.stringify(settings));

	delete settingsObject.Automated_Task_Settings["exceptions"];
	delete settingsObject.Bounced_Mail_Settings["exceptions"];
	delete settingsObject.Unsubscribe_Mail_Settings["exceptions"];
	if (settingsObject.Task_Settings) delete settingsObject.Task_Settings["exceptions"];
	delete settingsObject.Custom_Domain_Settings;
	if (settingsObject.Skip_Settings) delete settingsObject.Skip_Settings["exceptions"];
	if (settingsObject.Lead_Score_Settings)
		delete settingsObject.Lead_Score_Settings["exceptions"];
	return settingsObject;
};

export const getUserName = (users, user_id) => {
	if (!users?.length || !user_id) return "";

	return users?.filter(user => user.value === user_id)[0]?.label ?? "";
};

export const getTeamName = (teams, sd_id) => {
	if (!teams?.length || !sd_id) return "";

	return teams.filter(team => team.value === sd_id)[0]?.label;
};
