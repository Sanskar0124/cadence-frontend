import { useContext, useState } from "react";

import { userInfo } from "@cadence-frontend/atoms";
import { MessageContext } from "@cadence-frontend/contexts";
import { ThemedButtonThemes, TooltipThemes } from "@cadence-frontend/themes";
import { ThemedButton } from "@cadence-frontend/widgets";
import { useRecoilValue } from "recoil";

import styles from "./CrmCard.module.scss";
import { InfoCircleGradient, Tick } from "@cadence-frontend/icons";
import { Colors, capitalize, getIntegrationIcon } from "@cadence-frontend/utils";
import { INTEGRATION_TYPE } from "@cadence-frontend/constants";
import { Tooltip } from "@cadence-frontend/components";

const CrmCard = ({ type, setSwitchCrmModal }) => {
	const { addError, addSuccess } = useContext(MessageContext);

	const user = useRecoilValue(userInfo);

	const INTEGRATION_ICON = getIntegrationIcon({
		integration_type: type,
	});

	const integration_type = user?.integration_type;

	const handleClick = () => setSwitchCrmModal({ type });

	return (
		<div className={`${styles.itemCard} ${styles[type]}`}>
			<div className={styles.left}>
				<div className={styles.icon}>
					<INTEGRATION_ICON size="3rem" color={Colors.salesforce} />
				</div>
				<h3 className={styles.name}>{capitalize(type.replaceAll("_", " "))}</h3>
			</div>
			<div className={styles.right}>
				{integration_type === type ? (
					<div className={styles.active}>
						<div>Currently active</div>
						<div>
							<Tick />
						</div>
					</div>
				) : (
					<>
						{user?.integration_type !== INTEGRATION_TYPE.SHEETS &&
							type === INTEGRATION_TYPE.SHEETS && (
								<Tooltip
									text="Sheets support is provided with your current integration"
									theme={TooltipThemes.TOP}
									className={styles.sheetsTooltip}
								>
									<InfoCircleGradient size="1.5rem" />
								</Tooltip>
							)}
						<ThemedButton
							height="40px"
							width="fit-content"
							theme={ThemedButtonThemes.GREY}
							onClick={handleClick}
							disabled={
								user?.integration_type !== INTEGRATION_TYPE.SHEETS &&
								type === INTEGRATION_TYPE.SHEETS
							}
						>
							Switch CRM
						</ThemedButton>
					</>
				)}
			</div>
		</div>
	);
};

export default CrmCard;
