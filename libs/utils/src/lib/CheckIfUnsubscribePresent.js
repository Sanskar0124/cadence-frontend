const checkUnSubscribeIsPresent = input => {
	let unsubscribe = input?.match(/\{\{unsubscribe\((.*?)\)\}\}/m) ?? [];
	if (unsubscribe.length > 0) {
		let unsubscribeEmail = unsubscribe[1];
		if (unsubscribeEmail && unsubscribeEmail !== "") {
			return true;
		} else {
			return false;
		}
	} else {
		return false;
	}
};

export default checkUnSubscribeIsPresent;
