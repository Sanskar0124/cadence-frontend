import { SESSION_STORAGE_KEYS } from "@cadence-frontend/constants";
import EmailSystem from "./components/EmailSystem/EmailSystem";

export const renderView = (currentStep, props) => {
	sessionStorage.setItem(SESSION_STORAGE_KEYS.ONBOARDING_CS, currentStep);
	switch (currentStep) {
		case 0:
			return <EmailSystem {...props} />;
	}
};
