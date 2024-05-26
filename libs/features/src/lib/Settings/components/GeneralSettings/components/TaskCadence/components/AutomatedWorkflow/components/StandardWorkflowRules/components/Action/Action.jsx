import { Close2 } from "@cadence-frontend/icons";
import { Button, Divider, Title } from "@cadence-frontend/components";
import { Select } from "@cadence-frontend/widgets";
import styles from "./Action.module.scss";
import ChangeOwner from "./ChangeOwner/ChangeOwner";
import MoveCadence from "./MoveCadence/MoveCadence";
import PauseCadence from "./PauseCadence/PauseCadence";
import ChangeIntegrationStatus from "./ChangeIntegrationStatus/ChangeIntegrationStatus";
import { Common as COMMON_TRANSLATIONS } from "@cadence-frontend/languages";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";

const Action = ({
	actionIndex,
	actionData,
	setActionData,
	availableActionNames,
	onRemove,
}) => {
	const renderOption = option => {
		switch (option) {
			case "change_owner":
				return <ChangeOwner actionData={actionData} setActionData={setActionData} />;
			case "pause_cadence":
				return <PauseCadence actionData={actionData} setActionData={setActionData} />;
			case "move_to_another_cadence":
				return <MoveCadence actionData={actionData} setActionData={setActionData} />;
			case "change_integration_status":
				return (
					<ChangeIntegrationStatus
						actionData={actionData}
						setActionData={setActionData}
					/>
				);
			default:
				return null;
		}
	};
	const user = useRecoilValue(userInfo);

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
						{COMMON_TRANSLATIONS.THEN[user?.language.toUpperCase()]}
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
				/>
				{actionIndex !== 0 && (
					<Button onClick={() => onRemove()}>
						<Close2 />
						Remove
					</Button>
				)}
			</div>
			{renderOption(actionData.name)}
		</div>
	);
};

export default Action;
