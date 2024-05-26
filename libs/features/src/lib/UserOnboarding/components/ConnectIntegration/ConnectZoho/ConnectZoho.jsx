import React from "react";
import styles from "./ConnectZoho.module.scss";
import { useState, useEffect } from "react";
//components
import { ZohoBox } from "@cadence-frontend/icons";
import { ConnectIntegration } from "@cadence-frontend/features";

import {
	Salesforce as SALESFORCE_TRANSLATION,
	Common as COMMON_TRANSLATION,
} from "@cadence-frontend/languages";
import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue } from "recoil";

const ConnectZoho = ({ setPostData, setDisableNext }) => {
	const [isConnected, setIsConnected] = useState(false);

	const user = useRecoilValue(userInfo);

	const save = ({ cb }) => {
		if (typeof cb === "function") cb();
	};

	useEffect(() => {
		setPostData(() => save);
	}, []);

	return (
		<div className={styles.connectZohoContainer}>
			<div className={styles.SFIcon}>
				<ZohoBox size="18rem" />
			</div>
			<div className={styles.header}>
				<div className={styles.heading}>
					<ZohoBox size="45px" />{" "}
					{COMMON_TRANSLATION.CONNECT_ZOHO[user?.language?.toUpperCase()]}
				</div>
				<div className={styles.subheading}>
					{
						COMMON_TRANSLATION.FIRST_STEP_OF_ONBOARDING_ZOHO[
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
						{SALESFORCE_TRANSLATION.LOGIN_TO_ZOHO[user?.language?.toUpperCase()]}
					</div>
					<div className={styles.subheading}>
						{SALESFORCE_TRANSLATION.TO_SIGN_IN_TO_ZOHO[user?.language?.toUpperCase()]}
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

export default ConnectZoho;
