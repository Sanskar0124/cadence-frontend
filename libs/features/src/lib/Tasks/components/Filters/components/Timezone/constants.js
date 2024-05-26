export const convert12HourTo24Hour = time => {
	let convertedTime = new Date("1970-01-01 " + time)
		.toLocaleTimeString("en-US", {
			hour12: false,
		})
		.split(":");
	convertedTime = `${convertedTime[0]}:${convertedTime[1]}`;
	return convertedTime;
};

export const getGMTtext = timezone => {
	let timeZoneText = timezone;
	let date = new Date();
	let options = {
		timeZone: timeZoneText,
		timeZoneName: "short",
	};

	let gmtTimeZone = date.toLocaleString("en-US", options);
	if (gmtTimeZone.includes("GMT")) {
		const startIndex = gmtTimeZone.indexOf("G");
		const result = gmtTimeZone.substring(startIndex);
		return result ? `(${result})` : "";
	} else {
		return "";
	}
};
