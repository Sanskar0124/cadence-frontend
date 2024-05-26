import React from "react";
import styles from "./ConnectBullhorn.module.scss";
import { useState, useEffect, useContext } from "react";
//components
import { Bullhorn } from "@cadence-frontend/icons";
import { IntegrationAuth, ConnectIntegration } from "@cadence-frontend/features";
import { MessageContext } from "@cadence-frontend/contexts";
import {
	Bullhorn as BULLHORN_TRANSLATION,
	Common as COMMON_TRANSLATION,
} from "@cadence-frontend/languages";
import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue } from "recoil";

const ConnectBullhorn = ({ setPostData, setDisableNext }) => {
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
		<div className={styles.connectBullhornContainer}>
			<div className={styles.SFIcon}>
				<Bullhorn size="18rem" />
			</div>
			<div className={styles.header}>
				<div className={styles.heading}>
					<Bullhorn size="45px" />{" "}
					{COMMON_TRANSLATION.CONNECT_BULLHORN[user?.language?.toUpperCase()]}
				</div>
				<div className={styles.subheading}>
					{
						COMMON_TRANSLATION.FIRST_STEP_OF_ONBOARDING_BULLHORN[
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
						{BULLHORN_TRANSLATION.LOGIN_TO_BULLHORN[user?.language?.toUpperCase()]}
					</div>
					<div className={styles.subheading}>
						{BULLHORN_TRANSLATION.TO_SIGN_IN_TO_BULLHORN[user?.language?.toUpperCase()]}
						<br />
						<br />
						{
							BULLHORN_TRANSLATION.NOW_CLICK_ON_THE_LINK_BELOW[
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

export default ConnectBullhorn;
