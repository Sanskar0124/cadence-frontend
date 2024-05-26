import { Div, Title } from "@cadence-frontend/components";
import Administrator from "./components/Administrator/Administrator";
import ApiToken from "./components/ApiToken/ApiToken";
import ConnectedCrm from "./components/ConnectedCrm/ConnectedCrm";
import FieldMapping from "./components/FieldMapping/FieldMapping";
import InstallPackage from "./components/InstallPackage/InstallPackage";
import LogActivities from "./components/LogActivities/LogActivities";
import styles from "./Crm.module.scss";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";
import { Settings as SETTINGS_TRANSLATION } from "@cadence-frontend/languages";

import {
	API_TOKEN_AVAILABLE,
	FIELD_MAPPING_AVAILABLE,
	INSTALL_PACKAGE_AVAILABLE,
	DATA_CENTER_AVAILABLE,
} from "./constants";
import { useState } from "react";

import DataCenter from "./components/DataCenter/DataCenter";

const Crm = props => {
	const integration_type = useRecoilValue(userInfo).integration_type;
	const language = useRecoilValue(userInfo).language;
	const [tokenValidityStatus, setTokenValidityStatus] = useState(null);

	return (
		<div className={styles.crm}>
			<Title size="1.1rem">
				{SETTINGS_TRANSLATION.CRM_SYNC[language?.toUpperCase()]}
			</Title>

			{DATA_CENTER_AVAILABLE.includes(integration_type) && (
				<>
					<div className={styles.divider} />
					<DataCenter tokenValidityStatus={tokenValidityStatus} />
				</>
			)}

			<div className={styles.divider} />
			<ConnectedCrm setTokenValidityStatus={setTokenValidityStatus} />
			{INSTALL_PACKAGE_AVAILABLE.includes(integration_type) && (
				<>
					<div className={styles.divider} />
					<InstallPackage />
				</>
			)}
			{API_TOKEN_AVAILABLE.includes(integration_type) && (
				<>
					<div className={styles.divider} />
					<ApiToken />
				</>
			)}
			<div className={styles.divider} />
			<LogActivities />
			<div className={styles.divider} />
			<Administrator />
			{FIELD_MAPPING_AVAILABLE.includes(integration_type) && (
				<>
					<Title size="1.1rem">
						{SETTINGS_TRANSLATION.FIELD_MAPPING[language?.toUpperCase()]}
					</Title>
					<div className={styles.divider} />
					<FieldMapping {...props} />
				</>
			)}
		</div>
	);
};

export default Crm;
