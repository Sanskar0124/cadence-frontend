const clearAttachments = () => {
	try {
		//attachment support will not work if environment is not a web browser
		if (!window) return;
		const attachments = Object.keys(window.sessionStorage).filter(key =>
			key.includes("attachment")
		);

		//delete all session storage attachments
		attachments.forEach(key => {
			window.sessionStorage.removeItem(key);
		});
	} catch (err) {
		// eslint-disable-next-line no-console
		console.log(err);
		return;
	}
};

export default clearAttachments;
