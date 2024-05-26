import { useState, useEffect, useContext } from "react";
import styles from "./ConnectHubspot.module.scss";

//components
import { HubspotBox } from "@cadence-frontend/icons";

import { IntegrationAuth, ConnectIntegration } from "@cadence-frontend/features";

import { MessageContext } from "@cadence-frontend/contexts";
import {
	Hubspot as HUBSPOT_TRANSLATION,
	Common as COMMON_TRANSLATION,
} from "@cadence-frontend/languages";
import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue } from "recoil";

//constants

const ConnectHubspot = ({ setPostData, setDisableNext }) => {
	const [isConnected, setIsConnected] = useState(false);
	const { addSuccess } = useContext(MessageContext);
	const user = useRecoilValue(userInfo);

	const save = ({ cb }) => {
		if (typeof cb === "function") cb();
	};

	useEffect(() => {
		setPostData(() => save);
	}, []);

	return (
		<div className={styles.connectHubspotContainer}>
			<div className={styles.header}>
				<div className={styles.heading}>
					<HubspotBox size="1.8rem" color="#FF7A59" />{" "}
					{COMMON_TRANSLATION.CONNECT_HUBSPOT[user?.language?.toUpperCase()]}
				</div>
				<div className={styles.subheading}>
					{
						COMMON_TRANSLATION.FIRST_STEP_OF_ONBOARDING_HUBSPOT[
							user?.language?.toUpperCase()
						]
					}
					<br />
					<br />
					{
						COMMON_TRANSLATION.THE_AIM_IS_TO_CONNECT_YOUR_DATABASE[
							user?.language?.toUpperCase()
						]
					}
				</div>
			</div>
			<div className={styles.body}>
				<div className={styles.loginSF}>
					<div className={styles.heading}>
						{HUBSPOT_TRANSLATION.LOGIN_TO_HUBSPOT[user?.language?.toUpperCase()]}
					</div>
					<div className={styles.subheading}>
						{HUBSPOT_TRANSLATION.TO_SIGN_IN_TO_HUBSPOT[user?.language?.toUpperCase()]}
						<br />
						<br />
						{
							HUBSPOT_TRANSLATION.NOW_CLICK_ON_THE_LINK_BELOW[
								user?.language?.toUpperCase()
							]
						}
					</div>
					<ConnectIntegration
						onlyButton={true}
						className={styles.onboardingSFButton}
						setIsConnected={setIsConnected}
					/>
				</div>
			</div>
		</div>
	);
};

export default ConnectHubspot;
