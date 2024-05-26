import { useState, useEffect, useContext } from "react";
import styles from "./ConnectDynamics.module.scss";

//components
import { Dynamics } from "@cadence-frontend/icons";

import { IntegrationAuth, ConnectIntegration } from "@cadence-frontend/features";

import { MessageContext } from "@cadence-frontend/contexts";
import {
	Dynamics as DYNAMICS_TRANSLATION,
	Common as COMMON_TRANSLATION,
} from "@cadence-frontend/languages";
import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilState, useRecoilValue } from "recoil";
import { useUser } from "@cadence-frontend/data-access";
import InputWithButton from "libs/features/src/lib/Settings/components/InputWithButton/InputWithButton";
import { ROLES } from "@cadence-frontend/constants";
import { Label } from "@cadence-frontend/widgets";

//constants

const ConnectDynamics = ({ setPostData, setDisableNext }) => {
	const [isConnected, setIsConnected] = useState(false);
	const { addSuccess, addError } = useContext(MessageContext);
	const [user, setRecoilUser] = useRecoilState(userInfo);
	const isAdmin = user.role === ROLES.SUPER_ADMIN || user.role === ROLES.ADMIN;
	const { updateInstanceUrl, updateInstanceUrlLoading } = useUser();

	const [instanceUrl, setInstanceUrl] = useState();

	const save = ({ cb }) => {
		if (typeof cb === "function") cb();
	};

	useEffect(() => {
		setInstanceUrl(user?.instance_url);
		setPostData(() => save);
	}, []);

	const handleSave = () => {
		if (!instanceUrl) {
			addError({ text: "Please enter the instance url." });
			return;
		}
		if (!instanceUrl.startsWith("https://") || !instanceUrl.endsWith("dynamics.com")) {
			return addError({ text: "Enter the correct instance URL." });
		}
		const body = { instance_url: instanceUrl };
		updateInstanceUrl(body, {
			onError: err => {
				addError({
					text: err?.response?.data?.msg ?? "Failed to update instance URL.",
					desc: err?.response?.data?.error || "Please contact support",
					cId: err?.response?.data?.correlationId,
				});
			},
			onSuccess: () => {
				addSuccess("Instance URL updated.");
				setRecoilUser(prev => ({ ...prev, instance_url: instanceUrl }));
			},
		});
	};

	return (
		<div className={styles.connectDynamicsContainer}>
			<div className={styles.header}>
				<div className={styles.heading}>
					<Dynamics size="1.8rem" />{" "}
					{COMMON_TRANSLATION.CONNECT_DYNAMICS[user?.language?.toUpperCase()]}
				</div>
				<div className={styles.subheading}>
					{
						COMMON_TRANSLATION.FIRST_STEP_OF_ONBOARDING_DYNAMICS[
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
						{DYNAMICS_TRANSLATION.LOGIN_TO_DYNAMICS[user?.language?.toUpperCase()]}
					</div>
					<div className={styles.subheading}>
						{DYNAMICS_TRANSLATION.TO_SIGN_IN_TO_DYNAMICS[user?.language?.toUpperCase()]}
						<br />
						<br />
						{
							DYNAMICS_TRANSLATION.NOW_CLICK_ON_THE_LINK_BELOW[
								user?.language?.toUpperCase()
							]
						}
					</div>
					<ConnectIntegration
						onlyButton={true}
						instanceUrl={instanceUrl}
						className={styles.onboardingSFButton}
						setIsConnected={setIsConnected}
					/>
				</div>
			</div>
		</div>
	);
};

export default ConnectDynamics;
