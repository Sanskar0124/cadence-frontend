import AutoMail from "./components/AutoMail/AutoMail";
import Call from "./components/Call/Call";
import CustomTask from "./components/CustomTask/CustomTask";
import DataCheck from "./components/DataCheck/DataCheck";
import EndCadence from "./components/EndCadence/EndCadence";
import LinkedinConnection from "./components/LinkedinConnection/LinkedinConnection";
import LinkedinInteract from "./components/LinkedinInteract/LinkedinInteract";
import LinkedinMessage from "./components/LinkedinMessage/LinkedinMessage";
import LinkedinProfile from "./components/LinkedinProfile/LinkedinProfile";
import Whatsapp from "./components/Whatsapp/Whatsapp";
import Mail from "./components/Mail/Mail";
import Message from "./components/Message/Message";
import ReplyTo from "./components/ReplyTo/ReplyTo";
import Callback from "./components/Callback/Callback";

export const stepSetupMap = ({ type, step }) => {
	switch (type) {
		case "mail":
			return <Mail node={step} />;
		case "automated_mail":
			return <Mail node={step} />;
		case "reply_to":
			return <ReplyTo node={step} />;
		case "automated_reply_to":
			return <ReplyTo node={step} />;
		case "message":
			return <Message node={step} />;
		case "automated_message":
			return <Message node={step} />;
		case "call":
			return <Call node={step} />;
		case "callback":
			return <Callback node={step} />;
		case "cadence_custom":
			return <CustomTask node={step} />;
		case "data_check":
			return <DataCheck node={step} />;
		case "linkedin_connection":
			return <LinkedinConnection node={step} />;
		case "linkedin_message":
			return <LinkedinMessage node={step} />;
		case "linkedin_profile":
			return <LinkedinProfile node={step} />;
		case "linkedin_interact":
			return <LinkedinInteract node={step} />;
		case "whatsapp":
			return <Whatsapp node={step} />;
		case "end":
			return <EndCadence node={step} />;
	}
};

export const characterLimits = type => {
	switch (type) {
		case "linkedin_message":
		case "message":
		case "automated_message":
			return 1400;
		case "callback":
		case "call":
			return 15000;
		case "linkedin_connection":
			return 300;
		case "whatsapp":
			return 500;
	}
};

/**
 * TODO: DELETE THESE FUNCTIONS
 */

// export const checkIfFilesChanged = (initial, updated) => {
// 	if (initial.length !== updated.length) return true;
// 	let changed = false;
// 	updated.forEach((att, index) => {
// 		if (att.name !== initial[index].original_name) changed = true;
// 	});
// 	if (changed) return true;
// 	return false;
// };
// export const compareTwoArrayOfObjects = (
// 	array_of_objects_first,
// 	array_of_objects_second
// ) => {
// 	return (
// 		array_of_objects_first.length === array_of_objects_second.length &&
// 		array_of_objects_first.every(ele_1 =>
// 			array_of_objects_second.some(ele_2 =>
// 				Object.keys(ele_1).every(key =>
// 					key !== "attachments"
// 						? ele_1[key] === ele_2[key]
// 						: ele_1[key]?.length === ele_2[key]?.length &&
// 						  ele_2[key]?.every(item =>
// 								ele_1[key]?.some(i => i?.attachment_id === item?.attachment_id)
// 						  )
// 				)
// 			)
// 		)
// 	);
// };

// export const checkUnSubscribeIsPresent = input => {
// 	let unsubscribe = input?.match(/\{\{unsubscribe\((.*?)\)\}\}/m) ?? [];
// 	if (unsubscribe.length > 0) {
// 		let unsubscribeEmail = unsubscribe[1];
// 		if (unsubscribeEmail && unsubscribeEmail !== "") {
// 			return true;
// 		} else {
// 			return false;
// 		}
// 	} else {
// 		return false;
// 	}
// };

// export const addUnSubscribeVariable = (setInput, defaultLinkText) => {
// 	let unsubscribeRegex = /\{.*?\}/g;
// 	if (defaultLinkText.match(unsubscribeRegex)?.length) {
// 		defaultLinkText = defaultLinkText.replace("{", "{{unsubscribe(");
// 		defaultLinkText = defaultLinkText.replace("}", ")}}");
// 		setInput(prev => ({
// 			...prev,
// 			body: `${prev.body}<p>&nbsp;</p><p>${defaultLinkText}</p>`,
// 		}));
// 	} else {
// 		setInput(prev => ({
// 			...prev,
// 			body: `${
// 				prev.body
// 			}<p>&nbsp;</p><p>${"{{unsubscribe("}${defaultLinkText}${")}}"}</p>`,
// 		}));
// 	}
// };

// export const addUnSubscribeVariableAll = (
// 	setAllTemplates,
// 	setInput,
// 	setBody,
// 	defaultLinkText
// ) => {
// 	let unsubscribeRegex = /\{.*?\}/g;
// 	if (defaultLinkText.match(unsubscribeRegex)?.length) {
// 		defaultLinkText = defaultLinkText.replace("{", "{{unsubscribe(");
// 		defaultLinkText = defaultLinkText.replace("}", ")}}");
// 		setInput(prev => ({
// 			...prev,
// 			body: checkUnSubscribeIsPresent(prev.body)
// 				? prev.body
// 				: `${prev.body}<p>&nbsp;</p><p>${defaultLinkText}</p>`,
// 		}));
// 		setAllTemplates(prev =>
// 			prev.map((item, i) => {
// 				if (checkUnSubscribeIsPresent(item.body)) {
// 					return item;
// 				} else {
// 					return { ...item, body: `${item.body}<p>&nbsp;</p><p>${defaultLinkText}</p>` };
// 				}
// 			})
// 		);
// 		setBody(prev =>
// 			prev.map((item, i) => {
// 				if (checkUnSubscribeIsPresent(item)) {
// 					return item;
// 				} else {
// 					return `${item}<p>&nbsp;</p><p>${defaultLinkText}</p>`;
// 				}
// 			})
// 		);
// 	} else {
// 		setInput(prev => ({
// 			...prev,
// 			body: checkUnSubscribeIsPresent(prev.body)
// 				? prev.body
// 				: `${prev.body}<p>&nbsp;</p><p>${"{{unsubscribe("}${defaultLinkText}${")}}"}</p>`,
// 		}));
// 		setAllTemplates(prev =>
// 			prev.map((item, i) => {
// 				if (checkUnSubscribeIsPresent(item.body)) {
// 					return item;
// 				} else {
// 					return {
// 						...item,
// 						body: checkUnSubscribeIsPresent(prev.body)
// 							? prev.body
// 							: `${
// 									item.body
// 							  }<p>&nbsp;</p><p>${"{{unsubscribe("}${defaultLinkText}${")}}"}</p>`,
// 					};
// 				}
// 			})
// 		);
// 	}
// 	setBody(prev =>
// 		prev.map((item, i) => {
// 			if (checkUnSubscribeIsPresent(item)) {
// 				return item;
// 			} else {
// 				return `${item}<p>&nbsp;</p><p>${"{{unsubscribe("}${defaultLinkText}${")}}"}</p>`;
// 			}
// 		})
// 	);
// };
