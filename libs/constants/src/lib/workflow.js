import INTEGRATION_TYPE from "./integrationType";

const LEAD_INTEGRATION_NAME_MAP = {
	[INTEGRATION_TYPE.SALESFORCE]: "lead/contact",
	[INTEGRATION_TYPE.HUBSPOT]: "contact",
	[INTEGRATION_TYPE.PIPEDRIVE]: "person",
	[INTEGRATION_TYPE.SELLSY]: "contact",
	[INTEGRATION_TYPE.DYNAMICS]: "lead/contact",
	[INTEGRATION_TYPE.ZOHO]: "contact",
	[INTEGRATION_TYPE.BULLHORN]: "lead/contact/candidate",
	[INTEGRATION_TYPE.SHEETS]: "lead",
};

const LEAD_INTEGRATION_STATUS_NAME_MAP = {
	[INTEGRATION_TYPE.SALESFORCE]: "lead",
	[INTEGRATION_TYPE.HUBSPOT]: "contact",
	[INTEGRATION_TYPE.BULLHORN]: "lead",
};

export const ORIGINAL_TRIGGERS = (integration_type, phone_system) => {
	let result = [
		{ label: "When an email bounces", value: "when_an_email_bounces" },
		{ label: "When people unsubscribe", value: "when_people_unsubscribe" },
		{
			label: "When a cadence is manually stopped",
			value: "when_a_cadence_is_manually_stopped",
		},
		{
			label: "When a cadence is paused (for a specific lead)",
			value: "when_a_cadence_is_paused",
		},
		{ label: "When you create a custom task", value: "when_you_create_custom_task" },
		{ label: "When people reply to email", value: "when_people_reply_to_email" },
		{ label: "When a cadence ends", value: "when_a_cadence_ends" },
		{ label: "When a owner changes", value: "when_a_owner_changes" },
		{
			label: "When a demo is booked via calendly",
			value: "when_a_demo_is_booked_via_calendly",
		},
		{ label: "When a task is skipped", value: "when_a_task_is_skipped" },
		{ label: "When a custom link is clicked", value: "when_a_custom_link_clicked" },
		{
			label: "When first automated task is completed",
			value: "when_first_automated_task_is_completed",
		},
		{
			label: "When first manual task is completed",
			value: "when_first_manual_task_is_completed",
		},
		{
			label: `When a ${LEAD_INTEGRATION_NAME_MAP[integration_type]} is added to cadence`,
			value: "when_a_lead_is_added_to_cadence",
		},
		{
			label: "When an email is opened",
			value: "when_an_email_is_open",
		},
	];
	if (
		integration_type === INTEGRATION_TYPE.SALESFORCE ||
		integration_type === INTEGRATION_TYPE.HUBSPOT ||
		integration_type === INTEGRATION_TYPE.BULLHORN
	) {
		result.push({
			label: `When a ${LEAD_INTEGRATION_STATUS_NAME_MAP[integration_type]} integration status is updated`,
			value: "when_a_lead_integration_status_is_updated",
		});
	}
	if (
		integration_type === INTEGRATION_TYPE.SALESFORCE ||
		integration_type === INTEGRATION_TYPE.BULLHORN
	) {
		result.push(
			{
				label: "When a contact integration status is updated",
				value: "when_a_contact_integration_status_is_updated",
			},
			{
				label: "When a account integration status is updated",
				value: "when_a_account_integration_status_is_updated",
			}
		);
	}

	if (integration_type === INTEGRATION_TYPE.BULLHORN) {
		result.push({
			label: "When a candidate integration status is updated",
			value: "when_a_candidate_integration_status_is_updated",
		});
	}

	if (phone_system !== "none") {
		result.push(
			{ label: "When users get incoming call ", value: "when_people_call" },
			{
				label: "When call duration is greater than",
				value: "when_call_duration_is_greater_than",
			}
		);
	}

	return result;
};

export const ACTIONS = {
	change_owner: {
		label: "Change owner",
		value: "change_owner",
	},
	stop_cadence: {
		label: "Stop cadence (for lead)",
		value: "stop_cadence",
	},
	pause_cadence: {
		label: "Pause cadence (for lead)",
		value: "pause_cadence",
	},
	continue_cadence: {
		label: "Continue cadence (for lead)",
		value: "continue_cadence",
	},
	move_to_another_cadence: {
		label: "Move to another cadence",
		value: "move_to_another_cadence",
	},
	change_integration_status: {
		label: "Change integration status",
		value: "change_integration_status",
	},
	go_to_last_step_of_cadence: {
		label: "Go to last step of cadence",
		value: "go_to_last_step_of_cadence",
	},
};

export const TRIGGER_SPECIFIC_ACTIONS = (triggerType, integrationType) => {
	let result = [];
	switch (triggerType) {
		case "when_an_email_bounces":
		case "when_people_unsubscribe":
		case "when_people_reply_to_email":
		case "when_a_cadence_ends":
		case "when_people_call":
		case "when_a_task_is_skipped":
		case "when_a_demo_is_booked_via_calendly":
		case "when_a_custom_link_clicked":
		case "when_first_automated_task_is_completed":
		case "when_first_manual_task_is_completed":
		case "when_call_duration_is_greater_than":
		case "when_an_email_is_open":
		case "when_a_lead_integration_status_is_updated":
		case "when_a_account_integration_status_is_updated":
		case "when_a_contact_integration_status_is_updated":
		case "when_a_candidate_integration_status_is_updated":
			result = [
				ACTIONS.stop_cadence,
				ACTIONS.pause_cadence,
				ACTIONS.move_to_another_cadence,
				ACTIONS.go_to_last_step_of_cadence,
			];
			break;
		case "when_a_lead_is_added_to_cadence":
			result = [
				ACTIONS.stop_cadence,
				ACTIONS.pause_cadence,
				ACTIONS.go_to_last_step_of_cadence,
			];
			break;
		case "when_a_cadence_is_manually_stopped":
		case "when_a_cadence_is_paused":
		case "when_you_create_custom_task":
			result = [ACTIONS.move_to_another_cadence];
			break;
		case "when_a_owner_changes":
			result = [ACTIONS.stop_cadence, ACTIONS.continue_cadence];
			break;
		default:
			break;
	}

	if (
		triggerType !== "when_a_owner_changes" &&
		triggerType !== "when_a_lead_integration_status_is_updated" &&
		triggerType !== "when_a_account_integration_status_is_updated" &&
		triggerType !== "when_a_contact_integration_status_is_updated" &&
		triggerType !== "when_a_candidate_integration_status_is_updated" &&
		(integrationType === INTEGRATION_TYPE.SALESFORCE ||
			integrationType === INTEGRATION_TYPE.BULLHORN)
	)
		result.push(ACTIONS.change_integration_status);

	if (
		triggerType !== "when_a_owner_changes" &&
		integrationType === INTEGRATION_TYPE.SALESFORCE
	)
		result.push(ACTIONS.change_owner);

	return result;
};

//actions is an array, triggerData is an object
export const MergeActionsIntoTrigger = (actions, triggerData) => {
	triggerData.actions = {};
	actions.forEach(({ name, data }) => {
		if (Object.keys(data).length === 0) {
			triggerData.actions[name] = "";
		} else {
			if (name !== "pause_cadence") {
				triggerData.actions[name] = data;
			} else {
				const actionObj = {};
				switch (data.unix_mode) {
					case "min":
						actionObj.unix_time = data.unix_time * 60;
						break;
					case "days":
						actionObj.unix_time = data.unix_time * 24 * 60 * 60;
						break;
					default:
						break;
				}
				triggerData.actions[name] = actionObj;
			}
		}
	});
	return triggerData;
};

export const validateWorkflow = wflow => {
	if (wflow.trigger === "") return "Please select a trigger.";
	if (Object.values(wflow.actions).length === 0)
		return "Please select at least one action.";
	if (Object.keys(wflow.actions).length < 1) {
		return "Please don't leave an action empty";
	}
	if (
		!Object.keys(wflow.actions).includes("stop_cadence") &&
		!Object.keys(wflow.actions).includes("continue_cadence") &&
		!Object.keys(wflow.actions).includes("go_to_last_step_of_cadence") &&
		Object.values(wflow.actions).includes("")
	) {
		return "Please don't leave an action empty";
	}
	return false;
};

export const CALLDURATION_TRIGGER_OPTIONS = () => {
	const options = [
		{ label: "Minutes", value: "min" },
		{ label: "Seconds", value: "second" },
	];
	return options;
};
