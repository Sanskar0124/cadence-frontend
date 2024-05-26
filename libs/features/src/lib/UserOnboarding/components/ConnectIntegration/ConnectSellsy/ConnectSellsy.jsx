import { useState, useEffect, useContext } from "react";
import styles from "./ConnectSellsy.module.scss";

//components
import { Sellsy } from "@cadence-frontend/icons";

import { IntegrationAuth, ConnectIntegration } from "@cadence-frontend/features";

import { MessageContext } from "@cadence-frontend/contexts";
import {
	Sellsy as SELLSY_TRANSLATION,
	Common as COMMON_TRANSLATION,
} from "@cadence-frontend/languages";
import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue } from "recoil";

//constants

const ConnectSellsy = ({ setPostData, setDisableNext }) => {
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
		<div className={styles.connectSellsyContainer}>
			<div className={styles.header}>
				<div className={styles.heading}>
					<Sellsy size="1.8rem" />{" "}
					{COMMON_TRANSLATION.CONNECT_SELLSY[user?.language?.toUpperCase()]}
				</div>
				<div className={styles.subheading}>
					{
						COMMON_TRANSLATION.FIRST_STEP_OF_ONBOARDING_SELLSY[
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
						{SELLSY_TRANSLATION.LOGIN_TO_SELLSY[user?.language?.toUpperCase()]}
					</div>
					<div className={styles.subheading}>
						{SELLSY_TRANSLATION.TO_SIGN_IN_TO_SELLSY[user?.language?.toUpperCase()]}
						<br />
						<br />
						{
							SELLSY_TRANSLATION.NOW_CLICK_ON_THE_LINK_BELOW[
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

export default ConnectSellsy;
