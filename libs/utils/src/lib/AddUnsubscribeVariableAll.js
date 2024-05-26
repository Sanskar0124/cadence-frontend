import checkUnSubscribeIsPresent from "./CheckIfUnsubscribePresent";

const addUnSubscribeVariableAll = (
	setAllTemplates,
	setInput,
	setBody,
	companySettings
) => {
	if (companySettings.unsubscribe_link_madatory_for_semi_automated_mails) {
		if (companySettings.default_unsubscribe_link_text.match(/\{.*?\}/g)?.length) {
			let defaultUnsubText = companySettings.default_unsubscribe_link_text;
			defaultUnsubText = defaultUnsubText.replace("{", "{{unsubscribe(");
			defaultUnsubText = defaultUnsubText.replace("}", ")}}");
			setInput(prev => ({
				...prev,
				body: checkUnSubscribeIsPresent(prev.body)
					? prev.body
					: `${prev.body}<p>&nbsp;</p><p>${defaultUnsubText}</p>`,
			}));
			setAllTemplates(prev =>
				prev.map((item, i) => {
					if (checkUnSubscribeIsPresent(item.body)) {
						return item;
					} else {
						return {
							...item,
							body: `${item.body}<p>&nbsp;</p><p>${defaultUnsubText}</p>`,
						};
					}
				})
			);
			setBody(prev =>
				prev.map((item, i) => {
					if (checkUnSubscribeIsPresent(item)) {
						return item;
					} else {
						return `${item}<p>&nbsp;</p><p>${defaultUnsubText}</p>`;
					}
				})
			);
		} else {
			setInput(prev => ({
				...prev,
				body: checkUnSubscribeIsPresent(prev.body)
					? prev.body
					: `${prev.body}<p>&nbsp;</p><p>${"{{unsubscribe("}${
							companySettings.default_unsubscribe_link_text
					  }${")}}"}</p>`,
			}));
			setAllTemplates(prev =>
				prev.map((item, i) => {
					if (checkUnSubscribeIsPresent(item.body)) {
						return item;
					} else {
						return {
							...item,
							body: checkUnSubscribeIsPresent(prev.body)
								? prev.body
								: `${item.body}<p>&nbsp;</p><p>${"{{unsubscribe("}${
										companySettings.default_unsubscribe_link_text
								  }${")}}"}</p>`,
						};
					}
				})
			);
		}
		setBody(prev =>
			prev.map((item, i) => {
				if (checkUnSubscribeIsPresent(item)) {
					return item;
				} else {
					return `${item}<p>&nbsp;</p><p>${"{{unsubscribe("}${
						companySettings.default_unsubscribe_link_text
					}${")}}"}</p>`;
				}
			})
		);
	}
};

export default addUnSubscribeVariableAll;
