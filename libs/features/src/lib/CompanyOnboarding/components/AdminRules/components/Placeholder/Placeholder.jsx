import { PLACEHOLDER_OPTIONS } from "./constants";

const Placeholder = ({ currentStep }) => {
	return PLACEHOLDER_OPTIONS[currentStep]?.component({}) ?? null;
};

export default Placeholder;
