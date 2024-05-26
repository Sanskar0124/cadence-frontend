import { userInfo } from "@cadence-frontend/atoms";
import { Title } from "@cadence-frontend/components";
import { useUser } from "@cadence-frontend/data-access";
import { useRecoilValue } from "recoil";
import SelectPhoneSystem from "./components/SelectPhoneSystem/SelectPhoneSystem";
import SmsActivities from "./components/SmsActivities/SmsActivities";
import styles from "./PhoneSystem.module.scss";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import { SMS_SYNC_DISABLED_INTEGRATIONS } from "./constants";

const PhoneSystem = () => {
	const user = useRecoilValue(userInfo);
	const userDataAccess = useUser({ user: true });

	return (
		<div className={styles.phoneSystem}>
			<Title size="1.1rem">
				{COMMON_TRANSLATION.PHONE_SYSTEM[user?.language?.toUpperCase()]}
			</Title>
			<div className={styles.divider} />
			<SelectPhoneSystem userDataAccess={userDataAccess} />
			{!SMS_SYNC_DISABLED_INTEGRATIONS.includes(user.integration_type) &&
				user?.phone_system !== "none" && (
					<>
						<div className={styles.divider} />
						<SmsActivities />
					</>
				)}
		</div>
	);
};

export default PhoneSystem;
