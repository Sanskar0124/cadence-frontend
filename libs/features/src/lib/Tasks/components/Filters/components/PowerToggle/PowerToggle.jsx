import { powerInfo, userInfo } from "@cadence-frontend/atoms";
import { POWER_STATUS, ROLES } from "@cadence-frontend/constants";
import { Info2, Power } from "@cadence-frontend/icons";
import { Colors, useOutsideClickHandler } from "@cadence-frontend/utils";
import { Checkbox, Toggle } from "@cadence-frontend/widgets";
import { useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { Tasks as TASKS_TRANSLATION } from "@cadence-frontend/languages";
import styles from "./PowerToggle.module.scss";

const PowerToggle = ({ setFilters, setUserId }) => {
	const [power, setPower] = useRecoilState(powerInfo);
	const user = useRecoilValue(userInfo);
	const infoRef = useRef(null);

	const [showInfo, setShowInfo] = useState(false);
	const [dontShowInfo, setDontShowInfo] = useState(!power.showInfoByDefault);

	useOutsideClickHandler(infoRef, () => setShowInfo(false));

	const onToggleChange = () => {
		if (power.status === POWER_STATUS.STOPPED) {
			setFilters(prev => ({
				...prev,
				task_type: [],
				task_completion: [],
				task_action: [...prev.task_action.slice(0, 1)],
			}));
			setUserId(false);
		}
		setPower(prev => ({
			...prev,
			status:
				prev.status !== POWER_STATUS.STOPPED
					? POWER_STATUS.STOPPED
					: POWER_STATUS.IN_SETUP,
		}));
	};

	const onDontShowInfoChange = value => {
		setDontShowInfo(value);
		setPower(prev => ({ ...prev, showInfoByDefault: !value }));
	};

	useEffect(() => {
		if (power.status === POWER_STATUS.IN_SETUP && power.showInfoByDefault)
			setShowInfo(true);
	}, [power]);

	return (
		<div className={styles.powerToggle}>
			<p>Focus</p>
			<Toggle
				theme="PURPLE"
				checked={power.status !== POWER_STATUS.STOPPED}
				onChange={onToggleChange}
				disabled={power.status === POWER_STATUS.BOOSTED}
			/>
			<div className={styles.info} ref={infoRef}>
				{power.status !== POWER_STATUS.STOPPED && (
					<span onClick={() => setShowInfo(curr => !curr)}>
						<Info2 color={showInfo ? Colors.mainPurple : Colors.lightBlue} />
					</span>
				)}
				{showInfo && (
					<div className={styles.infoBox}>
						<span>
							<Power />{" "}
							{TASKS_TRANSLATION.FOCUS_AND_FILTERS[user?.language?.toUpperCase()]}
						</span>
						<ul>
							<li>
								{TASKS_TRANSLATION.YOU_CAN_SELECT_ONE_TASK[user?.language?.toUpperCase()]}
							</li>
							<li>
								{
									TASKS_TRANSLATION.ALL_FILTERS_AVAIL_BESIDES[
										user?.language?.toUpperCase()
									]
								}{" "}
								<br />
								{TASKS_TRANSLATION.TASK_COMPLETION[user?.language?.toUpperCase()]}
								{user.role !== ROLES.SALESPERSON && (
									<>
										<br />
										{TASKS_TRANSLATION.USER_GROUPS[user?.language?.toUpperCase()]}
									</>
								)}
							</li>
							<li>
								{
									TASKS_TRANSLATION.FILTER_DISABLED_WHILE_FOCUS[
										user?.language?.toUpperCase()
									]
								}
							</li>
						</ul>
						<div>
							<Checkbox checked={dontShowInfo} onChange={onDontShowInfoChange} /> Do not
							show again
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default PowerToggle;
