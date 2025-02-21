import { useState, useCallback } from "react";

const useToggle = (initialState = false) => {
	// Initialize the state
	const [state, setState] = useState(initialState);

	// Define and memorize toggler function in case we pass down the component,
	// This function change the boolean value to it's opposite value
	const toggleValue = useCallback(
		value => setState(prev => (typeof value === "boolean" ? value : !prev)),
		[]
	);

	return [state, toggleValue];
};

export default useToggle;
