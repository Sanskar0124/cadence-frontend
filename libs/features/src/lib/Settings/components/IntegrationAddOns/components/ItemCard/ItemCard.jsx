import { useContext, useState } from "react";

import { userInfo } from "@cadence-frontend/atoms";
import { MessageContext } from "@cadence-frontend/contexts";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { ThemedButton } from "@cadence-frontend/widgets";
import { useRecoilValue } from "recoil";
import { BUTTON_TEXT, INTEGRATION_TYPES } from "../../constants";
import { INTEGRATION_TYPE as CRM_INTEGRATION_TYPE } from "@cadence-frontend/constants";

import styles from "./ItemCard.module.scss";

const ItemCard = ({
	type,
	name,
	data,
	configuredField,
	icon,
	disabled,
	setIntegration,
	updateEnrichmentsConfig,
}) => {
	const { addError, addSuccess } = useContext(MessageContext);

	const user = useRecoilValue(userInfo);
	const integration_type = user?.integration_type;

	const [loading, setLoading] = useState(false);

	const getButtonText = () => {
		if (
			(integration_type === CRM_INTEGRATION_TYPE.GOOGLE_SHEETS ||
				integration_type === CRM_INTEGRATION_TYPE.EXCEL ||
				integration_type === CRM_INTEGRATION_TYPE.SHEETS) &&
			type === INTEGRATION_TYPES.LINKEDIN_EXTENSION
		) {
			if (data?.[configuredField]) return BUTTON_TEXT.DEACTIVATE;
			else return BUTTON_TEXT.ACTIVATE;
		}
		if (disabled) {
			if (integration_type === CRM_INTEGRATION_TYPE.DYNAMICS)
				return `${BUTTON_TEXT.UNAVAILABE[user?.language?.toUpperCase()]} ${
					CRM_INTEGRATION_TYPE.DYNAMICS.charAt(0).toUpperCase() +
					CRM_INTEGRATION_TYPE.DYNAMICS.slice(1)
				}`;
			else return BUTTON_TEXT.COMING_SOON[user?.language?.toUpperCase()];
		} else if (data?.[configuredField]) {
			return BUTTON_TEXT.RECONFIGURE[user?.language?.toUpperCase()];
		} else {
			return BUTTON_TEXT.CONFIGURE[user?.language?.toUpperCase()];
		}
	};

	const handleClick = () => {
		if (
			(integration_type === CRM_INTEGRATION_TYPE.GOOGLE_SHEETS ||
				integration_type === CRM_INTEGRATION_TYPE.EXCEL ||
				integration_type === CRM_INTEGRATION_TYPE.SHEETS) &&
			type === INTEGRATION_TYPES.LINKEDIN_EXTENSION
		) {
			setLoading(true);

			const body = {
				enr_id: data.enr_id,
				is_linkedin_activated: !data[configuredField],
			};

			updateEnrichmentsConfig(body, {
				onSuccess: () => {
					const msg = `Successfully ${
						body.is_linkedin_activated ? "activated" : "deactivated"
					} extension.`;
					addSuccess(msg);
				},
				onError: err => {
					addError({
						text: err?.response?.data?.msg,
						desc: err?.response?.data?.error,
						cId: err?.response?.data?.correlationId,
					});
				},
				onSettled: () => {
					setTimeout(() => {
						setLoading(false);
					}, 1500);
				},
			});
		} else setIntegration(type);
	};

	return (
		<div className={`${styles.itemCard} ${styles[type]}`}>
			<div className={styles.left}>
				<div className={styles.icon}>{icon}</div>
				<div className={styles.info}>
					<h3 className={styles.name}>{name}</h3>
					{!disabled && data?.hasOwnProperty(configuredField) && (
						<div
							className={`${styles.configuredStatus} ${
								data[configuredField] && styles.configured
							}`}
						>
							{!!data[configuredField] ? "Active" : "Not active"}
						</div>
					)}
				</div>
			</div>
			<ThemedButton
				height="39px"
				width="fit-content"
				theme={ThemedButtonThemes.TRANSPARENT}
				onClick={handleClick}
				disabled={disabled}
				loading={loading}
			>
				{getButtonText()}
			</ThemedButton>
		</div>
	);
};

export default ItemCard;
