const getFileSizeFromBytes = sizeInBytes => {
	let size = Math.floor(sizeInBytes / (1000 * 1000 * 10)) / 100;
	if (size >= 0.9) {
		return `${size} GB`;
	}
	size = Math.floor(sizeInBytes / (1000 * 10)) / 100;
	if (size >= 1) {
		return `${size} MB`;
	}
	size = Math.floor(sizeInBytes / 10) / 100;
	if (size >= 1) {
		return `${size} KB`;
	}
	return `${sizeInBytes} bytes`;
};

export default getFileSizeFromBytes;
