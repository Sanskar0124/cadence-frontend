import { Label, Select } from "@cadence-frontend/widgets";
import { useCadenceSettings } from "@cadence-frontend/data-access";
import styles from "./ChangeIntegrationStatus.module.scss";
import {
	Settings as SETTING_TRANSLATION,
	Common as COMMON_TRANSLATION,
} from "@cadence-frontend/languages";

import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";
import { INTEGRATION_TYPE } from "@cadence-frontend/constants";

const ChangeIntegrationStatus = ({ actionData, setActionData, isDisabled }) => {
	const { allowedStatuses } = useCadenceSettings({ allowedStatuses: true });
	const user = useRecoilValue(userInfo);

	const getReasons = (status, type) => {
		if (status === allowedStatuses?.[`${type}_integration_status`]?.disqualified?.value) {
			return allowedStatuses?.[`${type}_disqualification_reasons`]?.picklist_values;
		}
		let customStatus = allowedStatuses?.[
			`${type}_integration_status`
		]?.custom_actions?.find(action => action.value === status);
		if (customStatus && customStatus?.reasons?.length) return customStatus?.reasons;
		return false;
	};

	return (
		<div className={styles.changeIntegrationStatus}>
			<div>
				<Label className={styles.label}>
					{SETTING_TRANSLATION.CHANGE_STATUS_ACCOUNT[user?.language.toUpperCase()]}
				</Label>
				{allowedStatuses && (
					<Select
						width={"407px"}
						value={actionData.data.account_status ?? ""}
						setValue={val =>
							setActionData(prev => {
								val !==
									allowedStatuses?.account_integration_status?.disqualified?.value &&
									delete prev.data.account_reason;
								return {
									...prev,
									data: { ...prev.data, account_status: val },
								};
							})
						}
						options={allowedStatuses?.account_integration_status?.picklist_values ?? []}
						isSearchable
						menuOnTop
						disabled={isDisabled}
					/>
				)}
				{getReasons(actionData.data.account_status, "account") && (
					<div className={styles.box}>
						<Label className={styles.label}>
							Select Reason for {actionData.data.account_status}
						</Label>
						<Select
							width={"407px"}
							placeholder={COMMON_TRANSLATION.SELECT_HERE[user?.language?.toUpperCase()]}
							options={getReasons(actionData.data.account_status, "account")}
							value={actionData.data.account_reason ?? ""}
							setValue={val =>
								setActionData(prev => ({
									...prev,
									data: { ...prev.data, account_reason: val },
								}))
							}
							isSearchable
							disabled={isDisabled}
						/>
					</div>
				)}
			</div>
			<div>
				<Label className={styles.label}>
					{SETTING_TRANSLATION.CHANGE_STATUS_CONTACT[user?.language.toUpperCase()]}
				</Label>
				{allowedStatuses && (
					<Select
						width={"407px"}
						value={actionData.data.contact_status ?? ""}
						setValue={val =>
							setActionData(prev => {
								val !==
									allowedStatuses?.contact_integration_status?.disqualified?.value &&
									delete prev.data.contact_reason;
								return {
									...prev,
									data: { ...prev.data, contact_status: val },
								};
							})
						}
						options={allowedStatuses?.contact_integration_status?.picklist_values ?? []}
						isSearchable
						menuOnTop
					/>
				)}
				{getReasons(actionData.data.contact_status, "contact") && (
					<div className={styles.box}>
						<Label className={styles.label}>
							Select Reason for {actionData.data.contact_status}
						</Label>
						<Select
							width={"407px"}
							placeholder={COMMON_TRANSLATION.SELECT_HERE[user?.language?.toUpperCase()]}
							options={getReasons(actionData.data.contact_status, "contact")}
							value={actionData.data.contact_reason ?? ""}
							setValue={val =>
								setActionData(prev => ({
									...prev,
									data: { ...prev.data, contact_reason: val },
								}))
							}
							isSearchable
						/>
					</div>
				)}
			</div>
			<div>
				<Label className={styles.label}>
					{SETTING_TRANSLATION.CHANGE_STATUS_LEAD[user?.language.toUpperCase()]}
				</Label>
				{allowedStatuses && (
					<Select
						width={"407px"}
						value={actionData.data.lead_status ?? ""}
						setValue={val =>
							setActionData(prev => {
								val !== allowedStatuses?.lead_integration_status?.disqualified?.value &&
									delete prev.data.lead_reason;
								return {
									...prev,
									data: { ...prev.data, lead_status: val },
								};
							})
						}
						options={allowedStatuses?.lead_integration_status?.picklist_values ?? []}
						isSearchable
						menuOnTop
						disabled={isDisabled}
					/>
				)}
				{getReasons(actionData.data.lead_status, "lead") && (
					<div className={styles.box}>
						<Label className={styles.label}>
							Select Reason for {actionData.data.lead_status}
						</Label>
						<Select
							width={"407px"}
							placeholder={COMMON_TRANSLATION.SELECT_HERE[user?.language?.toUpperCase()]}
							options={getReasons(actionData.data.lead_status, "lead")}
							value={actionData.data.lead_reason ?? ""}
							setValue={val =>
								setActionData(prev => ({
									...prev,
									data: { ...prev.data, lead_reason: val },
								}))
							}
							isSearchable
							disabled={isDisabled}
						/>
					</div>
				)}
			</div>
			{user?.integration_type === INTEGRATION_TYPE.BULLHORN && (
				<div>
					<Label className={styles.label}>
						{SETTING_TRANSLATION.CHANGE_STATUS_CANDIDATE[user?.language.toUpperCase()]}
					</Label>

					{allowedStatuses && (
						<Select
							width={"407px"}
							value={actionData.data.candidate_status ?? ""}
							setValue={val =>
								setActionData(prev => {
									val !==
										allowedStatuses?.candidate_integration_status?.disqualified?.value &&
										delete prev.data.candidate_reason;
									return {
										...prev,
										data: { ...prev.data, candidate_status: val },
									};
								})
							}
							options={
								allowedStatuses?.candidate_integration_status?.picklist_values ?? []
							}
							isSearchable
							menuOnTop
							disabled={isDisabled}
						/>
					)}

					{getReasons(actionData.data.candidate_status, "candidate") && (
						<div className={styles.box}>
							<Label className={styles.label}>
								Select Reason for {actionData.data.candidate_status}
							</Label>
							<Select
								width={"407px"}
								placeholder={
									COMMON_TRANSLATION.SELECT_HERE[user?.language?.toUpperCase()]
								}
								options={getReasons(actionData.data.candidate_status, "candidate")}
								value={actionData.data.candidate_reason ?? ""}
								setValue={val =>
									setActionData(prev => ({
										...prev,
										data: { ...prev.data, candidate_reason: val },
									}))
								}
								isSearchable
								disabled={isDisabled}
							/>
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default ChangeIntegrationStatus;
