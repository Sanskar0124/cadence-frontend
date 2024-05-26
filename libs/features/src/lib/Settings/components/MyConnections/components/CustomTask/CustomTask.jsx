import { useUser } from "@cadence-frontend/data-access";
import { QueryClient } from "react-query";
import { Checkbox, Toggle } from "@cadence-frontend/widgets";
import React, { useContext, useEffect, useState } from "react";
import { MessageContext } from "@cadence-frontend/contexts";
import styles from "./CustomTask.module.scss";
import {
	Profile as PROFILE_TRANSLATION,
	Common as COMMON_TRANSLATION,
} from "@cadence-frontend/languages";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";

const queryClient = new QueryClient();

const CustomTask = ({ userDataAccess }) => {
	const { addError, addSuccess } = useContext(MessageContext);
	const language = useRecoilValue(userInfo).language;
	const { user, updateUser } = userDataAccess;
	const [checked, setChecked] = useState("");

	const onUpdate = e => {
		setChecked(e.target.checked);
		updateUser(
			{ create_agendas_from_custom_task: e.target.checked },
			{
				onError: (err, _, context) => {
					addError({
						text: err.response?.data?.msg || "Error updating custom task settings",
						desc: err?.response?.data?.error || "Please contact support",
						cId: err?.response?.data?.correlationId,
					});
					queryClient.setQueryData("user", context.previousUser);
				},
				onSuccess: () => addSuccess("Custom task settings updated"),
			}
		);
	};

	useEffect(() => {
		setChecked(user?.create_agendas_from_custom_task ?? false);
	}, [user]);

	return (
		<div className={styles.container}>
			<div className={styles.title}>
				<h2>{COMMON_TRANSLATION.CUSTOM_TASK[language?.toUpperCase()]}</h2>
			</div>
			<div className={styles.settings}>
				<p>
					{PROFILE_TRANSLATION.CALENDAR_EVENTS_FOR_CUSTOM_TASKS[language?.toUpperCase()]}
				</p>
				<Toggle checked={checked} onChange={onUpdate} theme="PURPLE" />
			</div>
		</div>
	);
};

export default CustomTask;
