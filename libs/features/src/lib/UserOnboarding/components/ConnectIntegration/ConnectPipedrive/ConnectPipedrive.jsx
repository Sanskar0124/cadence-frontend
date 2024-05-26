import { useState, useEffect, useContext } from "react";
import styles from "./ConnectPipedrive.module.scss";

//components
import { Pipedrive } from "@cadence-frontend/icons";

import { IntegrationAuth, ConnectIntegration } from "@cadence-frontend/features";

import { MessageContext } from "@cadence-frontend/contexts";
import {
	Common as COMMON_TRANSLATION,
	Pipedrive as PIPEDRIVE_TRANSLATION,
	Salesforce as SALESFORCE_TRANSLATION,
} from "@cadence-frontend/languages";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";

//constants

const ConnectSalesforce = ({ setPostData, setDisableNext }) => {
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
		<div className={styles.connectSalesforceContainer}>
			<div className={styles.header}>
				<div className={styles.heading}>
					<Pipedrive size="30px" />{" "}
					{COMMON_TRANSLATION.CONNECT_PIPEDRIVE[user?.language?.toUpperCase()]}
				</div>
				<div className={styles.subheading}>
					{
						COMMON_TRANSLATION.FIRST_STEP_OF_ONBOARDING_PIPEDRIVE[
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
						{" "}
						{PIPEDRIVE_TRANSLATION.LOGIN_TO_PIPEDRIVE[user?.language?.toUpperCase()]}
					</div>
					<div className={styles.subheading}>
						{PIPEDRIVE_TRANSLATION.TO_SIGN_IN_TO_PIPEDRIVE[user?.language?.toUpperCase()]}
						<br />
						<br />
						{
							SALESFORCE_TRANSLATION.NOW_CLICK_ON_THE_LINK_BELOW[
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

export default ConnectSalesforce;
