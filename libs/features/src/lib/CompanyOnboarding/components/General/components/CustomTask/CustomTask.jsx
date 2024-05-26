import { useState, useEffect, useContext } from "react";
import { QueryClient } from "react-query";
import { MessageContext } from "@cadence-frontend/contexts";
import { useUser } from "@cadence-frontend/data-access";

import styles from "./CustomTask.module.scss";
import Toggle from "./components/Toggle/Toggle";
import { Profile as PROFILE_TRANSLATION } from "@cadence-frontend/languages";

const CustomTask = () => {
	const { addError } = useContext(MessageContext);
	const { user, updateUser } = useUser(false);
	const [toggle, setToggle] = useState(false);

	const onChange = () => {
		setToggle(prev => {
			updateUser(
				{ create_agendas_from_custom_task: !prev },
				{
					onError: (err, _, context) => {
						addError({
							text: "Error updating custom task settings",
							desc: err?.response?.data?.error ?? "Please contact support",
							cId: err?.response?.data?.correlationId,
						});
						QueryClient.setQueryData("user", context.previousUser);
					},
				}
			);
			return !prev;
		});
	};

	useEffect(() => {
		setToggle(user?.create_agendas_from_custom_task ?? false);
	}, [user]);

	return (
		<div className={styles.customTask}>
			<p>
				{
					PROFILE_TRANSLATION.CALENDAR_EVENTS_FOR_CUSTOM_TASKS[
						user?.language?.toUpperCase()
					]
				}
			</p>
			<Toggle checked={toggle} onChange={onChange} />
		</div>
	);
};

export default CustomTask;
