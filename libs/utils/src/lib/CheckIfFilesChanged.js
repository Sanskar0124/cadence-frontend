const checkIfFilesChanged = (initial, updated) => {
	if (initial.length !== updated.length) return true;
	let changed = false;
	updated.forEach((att, index) => {
		if (att.name !== initial[index].original_name) changed = true;
	});
	if (changed) return true;
	return false;
};

export default checkIfFilesChanged;
// Path: libs/utils/src/lib/CheckIfFilesChanged.js
