const addUnSubscribeVariable = (setInput, defaultLinkText) => {
	let unsubscribeRegex = /\{.*?\}/g;
	if (defaultLinkText.match(unsubscribeRegex)?.length) {
		defaultLinkText = defaultLinkText.replace("{", "{{unsubscribe(");
		defaultLinkText = defaultLinkText.replace("}", ")}}");
		setInput(prev => ({
			...prev,
			body: `${prev.body}<p>&nbsp;</p><p>${defaultLinkText}</p>`,
		}));
	} else {
		setInput(prev => ({
			...prev,
			body: `${
				prev.body
			}<p>&nbsp;</p><p>${"{{unsubscribe("}${defaultLinkText}${")}}"}</p>`,
		}));
	}
};

export default addUnSubscribeVariable;
