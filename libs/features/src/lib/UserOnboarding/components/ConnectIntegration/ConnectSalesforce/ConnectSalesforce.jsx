import { useState, useEffect, useContext } from "react";
import styles from "./ConnectSalesforce.module.scss";

//components
import { Salesforce, SalesforceBox } from "@cadence-frontend/icons";

import { IntegrationAuth, ConnectIntegration } from "@cadence-frontend/features";

import { MessageContext } from "@cadence-frontend/contexts";
import {
	Salesforce as SALESFORCE_TRANSLATION,
	Common as COMMON_TRANSLATION,
} from "@cadence-frontend/languages";
import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue } from "recoil";

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
			<div className={styles.SFIcon}>
				<Salesforce size="18rem" />
			</div>
			<div className={styles.header}>
				<div className={styles.heading}>
					<SalesforceBox size="1.8rem" color={"#00A1E0"} />{" "}
					{COMMON_TRANSLATION.CONNECT_SALESFORCE[user?.language?.toUpperCase()]}
				</div>
				<div className={styles.subheading}>
					{
						COMMON_TRANSLATION.FIRST_STEP_OF_ONBOARDING_SALESFORCE[
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
						{SALESFORCE_TRANSLATION.LOGIN_TO_SALESFORCE[user?.language?.toUpperCase()]}
					</div>
					<div className={styles.subheading}>
						{
							SALESFORCE_TRANSLATION.TO_SIGN_IN_TO_SALESFORCE[
								user?.language?.toUpperCase()
							]
						}
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
