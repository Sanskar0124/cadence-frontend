import { Div } from "@cadence-frontend/components";
import { MessageContext } from "@cadence-frontend/contexts";
import { useSettings } from "@cadence-frontend/data-access";
import { Select } from "@cadence-frontend/widgets";
import { useContext, useEffect, useState } from "react";
import styles from "./Administrator.module.scss";
import { useIntegrationTranslations } from "@cadence-frontend/languages";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";
import { SEARCH_OPTIONS } from "../../../Search/constants";

const Administrator = () => {
	const { addError } = useContext(MessageContext);
	const user = useRecoilValue(userInfo);
	const [administrator, setAdministrator] = useState(null);
	const [administratorOptions, setAdministratorOptions] = useState([]);
	const INTEGRATION_TRANSLATION = useIntegrationTranslations(user.integration_type);

	const {
		fetchUserWithActiveToken,
		fetchUserWithActiveTokenLoading,
		updateUserWithActiveSFToken,
		updateUserWithActiveSFTokenLoading,
		fetchAdminSuperAdmins,
	} = useSettings({
		enabled: false,
	});

	useEffect(() => {
		fetchAdminSuperAdmins(null, {
			onSuccess: sadmins => {
				fetchUserWithActiveToken(null, {
					onSuccess: activeSadmin => {
						setAdministratorOptions(
							sadmins.map(ad => ({
								label: ad?.first_name + " " + ad.last_name,
								value: ad.user_id,
							}))
						);
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
		<div className={styles.container} id={SEARCH_OPTIONS.CRM_ADMIN}>
			<div className={styles.title}>
				<h2>
					{
						INTEGRATION_TRANSLATION.INTEGRATION_ADMINISTRATOR[
							user?.language?.toUpperCase()
						]
					}
				</h2>
				<p>
					{
						INTEGRATION_TRANSLATION.CREATE_INTEGRATION_ADMINISTRATOR[
							user?.language?.toUpperCase()
						]
					}
				</p>
			</div>
			<div className={styles.settings}>
				<Div
					loading={updateUserWithActiveSFTokenLoading || fetchUserWithActiveTokenLoading}
					className={styles.administratoLoading}
				>
					<Select
						width="400px"
						options={administratorOptions}
						value={administrator?.user_id}
						setValue={val => {
							updateUserWithActiveSFToken(
								{ user_id: val },
								{
									onSuccess: () => window.location.reload(),
									onError: err =>
										addError({
											text: err?.response?.data?.msg,
											desc: err?.response?.data?.error,
											cId: err?.response?.data?.correlationId,
										}),
								}
							);
						}}
						disabled={updateUserWithActiveSFTokenLoading}
						menuOnTop
					/>
				</Div>
			</div>
		</div>
	);
};

export default Administrator;
