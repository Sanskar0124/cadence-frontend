import { userInfo } from "@cadence-frontend/atoms";
import { Skeleton } from "@cadence-frontend/components";
import { INTEGRATION_TYPE } from "@cadence-frontend/constants";
import { MessageContext } from "@cadence-frontend/contexts";
import { useSettings } from "@cadence-frontend/data-access";
import { ErrorGradient } from "@cadence-frontend/icons";
import {
	Common as COMMON_TRANSLATION,
	useIntegrationTranslations,
} from "@cadence-frontend/languages";
import { Colors, getIntegrationIcon } from "@cadence-frontend/utils";
import { useContext, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { Settings as SETTINGS_TRANSLATION } from "@cadence-frontend/languages";
import styles from "./ConnectedCrm.module.scss";
import { SEARCH_OPTIONS } from "../../../Search/constants";

const ConnectedCrm = ({ setTokenValidityStatus }) => {
	const { addError } = useContext(MessageContext);
	const user = useRecoilValue(userInfo);

	const [administrator, setAdministrator] = useState(null);

	const { fetchUserWithActiveToken, fetchUserWithActiveTokenLoading } = useSettings({
		enabled: false,
	});

	const INTEGRATION_ICON = getIntegrationIcon({
		integration_type: user.integration_type,
	});

	const INTEGRATION_TRANSLATION = useIntegrationTranslations(user.integration_type);

	//functions

	const getAdminStatus = admin => {
		if (!admin)
			return (
				<div>
					<ErrorGradient size="1.6rem" />
					{COMMON_TRANSLATION.CRM_ADMIN_IS_NOT_SELECTED[user?.language?.toUpperCase()]}
				</div>
			);
		if (!getIntegrationSpecificTokenValidity())
			return (
				<div>
					<ErrorGradient size="1.6rem" />
					{
						INTEGRATION_TRANSLATION.CRM_ADMIN_IS_NOT_CONNECTED_WITH_SALESFORCE[
							user?.language?.toUpperCase()
						]
					}
				</div>
			);
		return (
			<div>
				<INTEGRATION_ICON color={Colors.salesforce} size="2rem" />
				{administrator?.first_name} {administrator?.last_name}{" "}
				{
					INTEGRATION_TRANSLATION.IS_CONNECTED_WITH_SALESFORCE[
						user?.language?.toUpperCase()
					]
				}
			</div>
		);
	};

	const getIntegrationSpecificTokenValidity = () => {
		try {
			switch (user.integration_type) {
				case INTEGRATION_TYPE.SALESFORCE:
				case INTEGRATION_TYPE.PIPEDRIVE:
				case INTEGRATION_TYPE.HUBSPOT:
				case INTEGRATION_TYPE.SELLSY:
				case INTEGRATION_TYPE.DYNAMICS:
				case INTEGRATION_TYPE.BULLHORN:
					return !administrator.Integration_Token?.is_logged_out;

				case INTEGRATION_TYPE.ZOHO:
					setTokenValidityStatus(!administrator.Integration_Token?.is_logged_out);
					return !administrator.Integration_Token?.is_logged_out;

				default:
					setTokenValidityStatus(false);
					return false;
			}
		} catch (err) {
			setTokenValidityStatus(false);
			return false;
		}
	};

	//side effects

	useEffect(() => {
		fetchUserWithActiveToken(null, {
			onSuccess: activeSadmin => {
				if (activeSadmin.Company?.Company_Setting?.User?.user_id)
					setAdministrator(activeSadmin.Company?.Company_Setting?.User);
			},
			onError: err => {
				addError({
					text: err?.response?.data?.message,
					desc: err?.response?.data?.error,
					cId: err?.response?.data?.correlationId,
				});
			},
		});
	}, []);

	return (
		<div className={styles.container} id={SEARCH_OPTIONS.CONNECTED_CRM}>
			<div className={styles.title}>
				<h2>{SETTINGS_TRANSLATION.CRM_SYNC[user?.language?.toUpperCase()]}</h2>
				<p>
					{INTEGRATION_TRANSLATION.USE_EMAIL_WITH_DATABASE[user?.language?.toUpperCase()]}
				</p>
			</div>
			<div className={styles.settings}>
				<div
					className={`${styles.greyBox} ${
						getIntegrationSpecificTokenValidity() ? styles.active : styles.notConnected
					}`}
				>
					{fetchUserWithActiveTokenLoading ? (
						<Skeleton className={styles.adminLoader} />
					) : (
						getAdminStatus(administrator)
					)}
				</div>
			</div>
		</div>
	);
};

export default ConnectedCrm;
