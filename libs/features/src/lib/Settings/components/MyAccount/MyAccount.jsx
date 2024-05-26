import { userInfo } from "@cadence-frontend/atoms";
import { Title } from "@cadence-frontend/components";
import { useUser } from "@cadence-frontend/data-access";
import { useEffect } from "react";
import { useRecoilValue } from "recoil";
import ClearCache from "./components/ClearCache/ClearCache";
import EmailSignature from "./components/EmailSignature/EmailSignature";
import Language from "./components/Language/Language";
import MyDetails from "./components/MyDetails/MyDetails";
import PrimaryEmail from "./components/PrimaryEmail/PrimaryEmail";
import PrimaryPhone from "./components/PrimaryPhone/PrimaryPhone";
import RingoverIframe from "./components/RingoverIframe/RingoverIframe";
import Timezone from "./components/Timezone/Timezone";
import styles from "./MyAccount.module.scss";
import CallbackDevice from "./components/CallbackDevice/CallbackDevice";
import {
	Profile as PROFILE_TRANSLATION,
	Common as COMMON_TRANSLATION,
} from "@cadence-frontend/languages";
import { PHONE_INTEGRATIONS } from "@cadence-frontend/constants";
import PowerSettings from "./components/PowerSettings/PowerSettings";

const MyAccount = () => {
	const integration_type = useRecoilValue(userInfo).integration_type;
	const user = useRecoilValue(userInfo);

	const userDataAccess = useUser({ user: true });

	return (
		<div className={styles.myAccount}>
			<Title size="1.1rem">
				{PROFILE_TRANSLATION.PERSONAL_INFO[user?.language?.toUpperCase()]}
			</Title>
			<div className={styles.divider} />
			<MyDetails userDataAccess={userDataAccess} />
			{user.phone_system === PHONE_INTEGRATIONS.RINGOVER && (
				<>
					<Title size="1.1rem">
						{PROFILE_TRANSLATION.PHONE[user?.language?.toUpperCase()]}
					</Title>
					<div className={styles.divider} />
					<PrimaryPhone />
					<div className={`${styles.divider}`} />
					<RingoverIframe />
					<div className={`${styles.divider}`} />
					<CallbackDevice />
				</>
			)}
			<Title size="1.1rem">
				{COMMON_TRANSLATION.EMAIL[user?.language?.toUpperCase()]}
			</Title>
			<div className={styles.divider} />
			<PrimaryEmail />
			<div className={`${styles.divider}`} />
			<EmailSignature />
			<Title size="1.1rem">Focus mode</Title>
			<div className={styles.divider} />
			<PowerSettings userDataAccess={userDataAccess} />
			<Title size="1.1rem">
				{PROFILE_TRANSLATION.TIME_AND_LANGUAGE[user?.language?.toUpperCase()]}
			</Title>
			<div className={styles.divider} />
			<Timezone />
			<div className={`${styles.divider}`} />
			<Language />
			<Title size="1.1rem">
				{COMMON_TRANSLATION.TOOL_OPERATION_SERVICES[user?.language?.toUpperCase()]}
			</Title>
			<div className={styles.divider} />
			<ClearCache />
		</div>
	);
};

export default MyAccount;
