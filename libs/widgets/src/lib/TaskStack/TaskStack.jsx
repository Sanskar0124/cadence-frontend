import { ENUMS, LANGUAGES } from "@cadence-frontend/constants";
import Checkbox from "../Checkbox/Checkbox";

import styles from "./TaskStack.module.scss";

import { useEffect, useState } from "react";
import { TackStackExceptions } from "./constants";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";
import { unCapitalizeSomeWord } from "@cadence-frontend/utils";

const TASK_DISABLED = ["automated_mail", "mail"];

const TaskStack = ({ value, setValue, className, name, ...rest }) => {
	const [taskArr, setTaskArr] = useState([]);
	const user = useRecoilValue(userInfo);
	useEffect(() => {
		if (value?.skip_allowed_tasks) {
			let newTask = [...taskArr];
			newTask = Object.keys(TackStackExceptions);
			setTaskArr([...newTask]);
		}
	}, [value]);

	return (
		<div
			className={`${styles.taskStack} ${
				user?.language === LANGUAGES.SPANISH ? styles.isSpanish : ""
			} ${className ?? ""}`}
			{...rest}
		>
			{value && value.skip_allowed_tasks
				? Object.keys(ENUMS).map((enu, index) => {
						const { name: taskName, icon, is_task } = ENUMS[enu];

						return is_task && taskArr.includes(enu) ? (
							<div className={styles.task} key={index}>
								<div className={styles.taskCheckBox}>
									<Checkbox
										checked={value?.[name[0]]?.[enu]}
										onChange={value => {
											if (name[1]) {
												setValue(prev => ({
													...prev,
													[name[0]]: {
														...prev?.[name[0]],
														[enu]: value,
													},
													[name[1]]: {
														...prev?.[name[1]],
														[enu]: value,
													},
												}));
											} else {
												setValue(prev => ({
													...prev,
													[name[0]]: {
														...prev?.[name[0]],
														[enu]: value,
													},
												}));
											}
										}}
									/>
								</div>
								<div className={styles.taskIcon}>{icon.default}</div>
								<div className={styles.taskName}>
									{unCapitalizeSomeWord(taskName[user?.language?.toUpperCase()])}
								</div>
							</div>
						) : null;
				  })
				: Object.keys(ENUMS).map((enu, index) => {
						const { name: taskName, icon, is_task } = ENUMS[enu];

						return is_task ? (
							<div className={styles.task} key={index}>
								<div className={styles.taskCheckBox}>
									<Checkbox
										checked={value?.[name[0]]?.[enu]}
										onChange={value => {
											if (name[1]) {
												setValue(prev => ({
													...prev,
													[name[0]]: {
														...prev?.[name[0]],
														[enu]: value,
													},
													[name[1]]: {
														...prev?.[name[1]],
														[enu]: value,
													},
												}));
											} else {
												setValue(prev => ({
													...prev,
													[name[0]]: {
														...prev?.[name[0]],
														[enu]: value,
													},
												}));
											}
										}}
										disabled={TASK_DISABLED.includes(enu)}
									/>
								</div>
								<div className={styles.taskIcon}>{icon.default}</div>
								<div className={styles.taskName}>
									{unCapitalizeSomeWord(taskName[user?.language?.toUpperCase()])}
								</div>
							</div>
						) : null;
				  })}
		</div>
	);
};

export default TaskStack;

//takes in an object and updates its name properties
