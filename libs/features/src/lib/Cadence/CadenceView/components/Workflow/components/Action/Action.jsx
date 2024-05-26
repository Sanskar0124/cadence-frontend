import { Close2 } from "@cadence-frontend/icons";
import { Button, Divider, Title } from "@cadence-frontend/components";
import { Select } from "@cadence-frontend/widgets";
import styles from "./Action.module.scss";
import ChangeOwner from "./ChangeOwner/ChangeOwner";
import MoveCadence from "./MoveCadence/MoveCadence";
import PauseCadence from "./PauseCadence/PauseCadence";
import ChangeIntegrationStatus from "./ChangeIntegrationStatus/ChangeIntegrationStatus";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";

const Action = ({
	actionIndex,
	actionData,
	setActionData,
	availableActionNames,
	onRemove,
	isDisabled,
}) => {
	const user = useRecoilValue(userInfo);
	const renderOption = option => {
		switch (option) {
			case "change_owner":
				return (
					<ChangeOwner
						isDisabled={isDisabled}
						actionData={actionData}
						setActionData={setActionData}
					/>
				);
			case "pause_cadence":
				return (
					<PauseCadence
						isDisabled={isDisabled}
						actionData={actionData}
						setActionData={setActionData}
					/>
				);
			case "move_to_another_cadence":
				return (
					<MoveCadence
						isDisabled={isDisabled}
						actionData={actionData}
						setActionData={setActionData}
					/>
				);
			case "change_integration_status":
				return (
					<ChangeIntegrationStatus
						actionData={actionData}
						setActionData={setActionData}
						isDisabled={isDisabled}
					/>
				);
			default:
				return null;
		}
	};

	return (
		<div className={styles.action}>
			{actionIndex === 1 ? (
				<div className={styles.divider}>
					<Divider style={{ marginTop: "10px", width: "175px" }} /> And
					<Divider style={{ marginTop: "10px", width: "175px" }} />
				</div>
			) : (
				<div className={styles.divider}>
					<Title className={styles.title} size="1.1rem">
						{COMMON_TRANSLATION.THEN[user?.language?.toUpperCase()]}
					</Title>
				</div>
			)}

			<div className={styles.options}>
				{/* {(actionData || value[index] === "stop_cadence") && actionList[value[index]] && (
					<Select
						width={"407px"}
						value={value}
						setValue={setValue}
						name={index}
						options={ALLOWED_ACTIONS(value, trigger[triggerIndex])}
						defaultValue={actionList[value[index]]}
						disabled={!trigger[triggerIndex]}
						isSearchable
						menuOnTop
					/>
				)}
				{!actionData && value[index] !== "stop_cadence" && (
					<Select
						width={"407px"}
						value={value}
						setValue={setValue}
						name={index}
						options={ALLOWED_ACTIONS(value, trigger[triggerIndex])}
						disabled={!trigger[triggerIndex]}
						isSearchable
						menuOnTop
					/>
				)} */}
				<Select
					width={"407px"}
					value={actionData.name}
					setValue={val => setActionData(prev => ({ name: val, data: {} }))}
					options={availableActionNames}
					isSearchable
					menuOnTop
					disabled={isDisabled}
				/>
				{actionIndex !== 0 && !isDisabled && (
					<Button onClick={() => onRemove()}>
						<Close2 />
						{COMMON_TRANSLATION.REMOVE[user?.language?.toUpperCase()]}
					</Button>
				)}
			</div>
			{renderOption(actionData.name)}
		</div>
	);
};

export default Action;
