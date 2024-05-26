const stripTrackingImage = value => {
	try {
		const parser = new DOMParser();
		const doc = parser.parseFromString(value, "text/html");
		const trackingLink = doc.getElementById("lead_to_cadence");
		trackingLink.remove();
		const serializer = new XMLSerializer();
		let newValue = serializer.serializeToString(doc);
		return newValue;
	} catch (err) {
		return value;
	}
};

export default stripTrackingImage;
