import { userInfo } from "@cadence-frontend/atoms";
import { INTEGRATION_TYPE } from "@cadence-frontend/constants";
import { useIntegration, useUser } from "@cadence-frontend/data-access";
import { Caution2, Close2 } from "@cadence-frontend/icons";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { Colors, capitalize, getIntegrationIcon } from "@cadence-frontend/utils";
import { ThemedButton } from "@cadence-frontend/widgets";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import styles from "./ReconnectIntegrations.module.scss";
import { CONNECTION_NOT_AVAILABLE } from "./constants";

const getIntegrationSpecificTokenValidity = ({ user, integration_type }) => {
	try {
		switch (integration_type) {
			case INTEGRATION_TYPE.SALESFORCE:
			case INTEGRATION_TYPE.PIPEDRIVE:
			case INTEGRATION_TYPE.HUBSPOT:
			case INTEGRATION_TYPE.SELLSY:
			case INTEGRATION_TYPE.DYNAMICS:
			case INTEGRATION_TYPE.ZOHO:
			case INTEGRATION_TYPE.BULLHORN:
				return !user?.Integration_Token?.is_logged_out;
			default:
				return false;
		}
	} catch (err) {
		return false;
	}
};

const ReconnectIntegrations = () => {
	const { user, userLoading } = useUser({ user: true });
	const integration_type = useRecoilValue(userInfo).integration_type;
	const { signIn: integrationSignIn, signInLoading: integrationSignInLoading } =
		useIntegration();

	const [active, setActive] = useState(false);

	const toggleActive = () => setActive(prev => !prev);

	const INTEGRATION_ICON = getIntegrationIcon({ integration_type, box: true });

	if (CONNECTION_NOT_AVAILABLE.includes(integration_type)) return null;

	if (
		userLoading ||
		getIntegrationSpecificTokenValidity({
			user,
			integration_type,
		})
	)
		return null;

	return (
		<div
			className={`${styles.connection} ${active ? styles.active : ""}`}
			onClick={() => !active && toggleActive()}
		>
			<div className={styles.icon}>
				<INTEGRATION_ICON size="2.2rem" color={Colors.white} />
				<div className={styles.caution}>
					<Caution2 color={Colors.red} size="1.2rem" />
				</div>
			</div>
			<div className={styles.expanded}>
				<span>{capitalize(integration_type.replaceAll("_", " "))} is disconnected</span>
				<div>
					<ThemedButton
						theme={ThemedButtonThemes.GREY}
						width="fit-content"
						height="35px"
						onClick={e => {
							e.stopPropagation();
							integrationSignIn();
						}}
						loading={integrationSignInLoading}
					>
						Connect
					</ThemedButton>{" "}
					<Close2
						onClick={toggleActive}
						style={{ cursor: "porinter" }}
						color={Colors.lightBlue}
					/>
				</div>
			</div>
		</div>
	);
};
export default ReconnectIntegrations;
