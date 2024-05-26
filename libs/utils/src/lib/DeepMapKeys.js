function deepMapKeys(originalObject, callback) {
	if (!originalObject) return originalObject;
	if (typeof originalObject !== "object") {
		return originalObject;
	}

	return Object.keys(originalObject || {}).reduce((newObject, key) => {
		const newKey = callback(key);
		const originalValue = originalObject[key];
		let newValue = originalValue;
		if (Array.isArray(originalValue)) {
			newValue = originalValue.map(item => deepMapKeys(item, callback));
		} else if (typeof originalValue === "object") {
			newValue = deepMapKeys(originalValue, callback);
		}
		return {
			...newObject,
			[newKey]: newValue,
		};
	}, {});
}

export default deepMapKeys;
