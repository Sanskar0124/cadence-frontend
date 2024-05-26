import { Modal } from "@cadence-frontend/components";
import { getIntegrationIcon } from "@cadence-frontend/utils";
import { ThemedButton } from "@cadence-frontend/widgets";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { useIntegration } from "@cadence-frontend/data-access";

import styles from "./IntegrationExpiredIMC.module.scss";
import { useIntegrationTranslations } from "@cadence-frontend/languages";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";
import { INTEGRATION_TYPE } from "@cadence-frontend/constants";

const IntegrationExpiredIMC = ({
	//modalProps
	setModal,
}) => {
	const { signIn } = useIntegration();

	const handleClick = () => {
		signIn();
		setModal(false);
	};
	const user = useRecoilValue(userInfo);
	const INTEGRATION_ICON = getIntegrationIcon({
		integration_type: user?.integration_type,
		box: user?.integration_type === INTEGRATION_TYPE.SALESFORCE,
	});
	const INTEGRATION_TRANSLATIONS = useIntegrationTranslations(user.integration_type);

	return (
		<div className={styles.sfeIMC}>
			<div className={styles.icon}>
				<INTEGRATION_ICON color={"#00A1E0"} size="48px" />
			</div>
			<div>
				<h3 className={styles.title}>
					{
						INTEGRATION_TRANSLATIONS.UNABLE_TO_PERFORM_INTEGRATION_ACTION[
							user?.language?.toUpperCase()
						]
					}
				</h3>
				<h4 className={styles.subTitle}>
					{
						INTEGRATION_TRANSLATIONS.SIGN_IN_WITH_INTEGRATION_TO_ACCESS_THIS_FEATURE[
							user?.language?.toUpperCase()
						]
					}
				</h4>
			</div>
			<ThemedButton className={styles.btn} onClick={handleClick}>
				<div>
					{
						INTEGRATION_TRANSLATIONS.SIGN_IN_WITH_INTEGRATION[
							user?.language?.toUpperCase()
						]
					}
				</div>
			</ThemedButton>
		</div>
	);
};

export default IntegrationExpiredIMC;
