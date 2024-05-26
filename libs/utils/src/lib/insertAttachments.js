const insertAttachments = file => {
	try {
		//attachment support will not work if environment is not a web browser
		if (!window) return;
		window.sessionStorage.setItem(
			`${file.original_name}-attachment`,
			JSON.stringify(file)
		);
	} catch (err) {
		// eslint-disable-next-line no-console
		console.log(err);
		return;
	}
};

export default insertAttachments;
