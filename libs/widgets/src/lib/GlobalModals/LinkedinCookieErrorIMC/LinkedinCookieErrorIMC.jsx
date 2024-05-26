import { ThemedButton } from "@cadence-frontend/widgets";
import Modal from "@cadence-frontend/components";
import { ErrorGradient, LinkedinBoxed } from "@cadence-frontend/icons";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { useSalesforce } from "@cadence-frontend/data-access";
import styles from "./LinkedinCookieErrorIMC.module.scss";
import { Salesforce as SALESFORCE_TRANSLATION } from "@cadence-frontend/languages";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";
import { getValidLink } from "@cadence-frontend/utils";

const LinkedinCookieErrorIMC = ({
	//modalProps
	markTaskAsCompleteIfCurrent,
	validateTask = false,
	setModal,
	onClose,
	lead,
}) => {
	const { signIn } = useSalesforce();

	const handleClick = async validateTask => {
		// console.log("hello");
		const url = getValidLink(lead?.linkedin_url) || "https://www.linkedin.com";
		window.open(url, "_blank");
		if (validateTask) await markTaskAsCompleteIfCurrent();
		onClose();
	};
	const user = useRecoilValue(userInfo);

	return (
		<div className={styles.sfeIMC}>
			<div className={styles.icon}>
				<LinkedinBoxed color={"#00A1E0"} size="50px" />
				<div className={styles.errorIcon}>
					<ErrorGradient color={"#00A1E0"} size="22px" />
				</div>
			</div>
			<h3 className={styles.title}>
				{SALESFORCE_TRANSLATION.SESSION_COOKIE_EXPIRED[user?.language?.toUpperCase()]}
			</h3>
			<h4 className={styles.subTitle}>
				{
					SALESFORCE_TRANSLATION.UPDATE_SESSION_COOKIE_IN_PROFILE[
						user?.language?.toUpperCase()
					]
				}
			</h4>
			<ThemedButton
				className={styles.btn}
				onClick={handleClick}
				theme={ThemedButtonThemes.PRIMARY}
			>
				<div>
					{SALESFORCE_TRANSLATION.VISIT_LINKEDIN_PROFILE[user?.language?.toUpperCase()]}
				</div>
			</ThemedButton>
		</div>
	);
};

export default LinkedinCookieErrorIMC;
