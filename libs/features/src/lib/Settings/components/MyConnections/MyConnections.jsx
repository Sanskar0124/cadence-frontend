import { Title } from "@cadence-frontend/components";
import { useUser } from "@cadence-frontend/data-access";
import ConnectEmailSystem from "./components/ConnectEmailSystem/ConnectEmailSystem";
import ConnectIntegration from "./components/ConnectIntegration/ConnectIntegration";
import LinkedinCookie from "./components/LinkedinCookie/LinkedinCookie";
import LinkedinExtension from "./components/LinkedinExtension/LinkedinExtension";
import styles from "./MyConnections.module.scss";
import ConnectCalendly from "./components/ConnectCalendly/ConnectCalendly";
import CalendlyEvent from "./components/CalendlyEvent/CalendlyEvent";
import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue } from "recoil";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import {
	INTEGRATION_TYPE,
	MAIL_INTEGRATION_TYPES,
	ROLES,
} from "@cadence-frontend/constants";
import { ENRICHMENT_SUPPORT, INTEGRATION_TYPES } from "../IntegrationAddOns/constants";
import CustomTask from "./components/CustomTask/CustomTask";
import InstanceUrl from "./components/InstanceUrl/InstanceUrl";
import SetupGoogleDomain from "./components/SetupGoogleDomain/SetupGoogleDomain";

const MyConnections = () => {
	const userDataAccess = useUser({ user: true });
	const language = useRecoilValue(userInfo).language;
	const user = useRecoilValue(userInfo);
	const isAdmin = user.role === ROLES.SUPER_ADMIN || user.role === ROLES.ADMIN;

	return (
		<div className={styles.myConnections}>
			<Title size="1.1rem">CRM</Title>
			<div className={styles.divider} />
			{user?.integration_type === INTEGRATION_TYPE.DYNAMICS && isAdmin && (
				<>
					<InstanceUrl userDataAccess={userDataAccess} />
					<div className={styles.divider} />
				</>
			)}
			<ConnectIntegration instanceUrl={user?.instance_url} />
			<Title size="1.1rem">{COMMON_TRANSLATION.EMAIL[language?.toUpperCase()]}</Title>
			{user?.role === ROLES.SUPER_ADMIN &&
				user?.mail_integration_type === MAIL_INTEGRATION_TYPES.GOOGLE && (
					<>
						<div className={styles.divider} />
						<SetupGoogleDomain />
					</>
				)}
			<div className={styles.divider} />
			<ConnectEmailSystem />
			<Title size="1.1rem">{COMMON_TRANSLATION.CALENDAR[language?.toUpperCase()]}</Title>
			<div className={styles.divider} />
			<ConnectCalendly />
			{userDataAccess?.user?.calendly_user_id && (
				<>
					<div className={styles.divider} />
					<CalendlyEvent />
				</>
			)}
			<div className={styles.divider} />

			<CustomTask userDataAccess={userDataAccess} />

			<Title size="1.1rem">{COMMON_TRANSLATION.LINKEDIN[language?.toUpperCase()]}</Title>
			{ENRICHMENT_SUPPORT[user.integration_type].includes(
				INTEGRATION_TYPES.LINKEDIN_EXTENSION
			) && (
				<>
					<div className={styles.divider} />
					<LinkedinExtension userDataAccess={userDataAccess} />
				</>
			)}
			<div className={styles.divider} />
			<LinkedinCookie userDataAccess={userDataAccess} />
		</div>
	);
};

export default MyConnections;
