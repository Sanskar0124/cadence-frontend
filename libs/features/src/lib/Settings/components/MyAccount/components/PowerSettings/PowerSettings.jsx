import { Select, Toggle } from "@cadence-frontend/widgets";
import { SEARCH_OPTIONS } from "../../../Search/constants";
import styles from "./PowerSettings.module.scss";
import { useContext, useEffect, useState } from "react";
import { useUser } from "@cadence-frontend/data-access";
import { useQueryClient } from "react-query";
import { MessageContext } from "@cadence-frontend/contexts";
import { Profile as PROFILE_TRANSLATION } from "@cadence-frontend/languages";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";

const DELAY_OPTIONS = [
	{ label: "10", value: 10 },
	{ label: "30", value: 30 },
	{ label: "60", value: 60 },
	{ label: "120", value: 120 },
];

const PowerSettings = ({ userDataAccess }) => {
	const recoilUser = useRecoilValue(userInfo);
	const queryClient = useQueryClient();
	const { addError, addSuccess } = useContext(MessageContext);
	const { user, updateUser } = userDataAccess;
	const [delay, setDelay] = useState(0);

	useEffect(() => {
		if (user?.focus_delay) setDelay(user.focus_delay);
	}, [user]);

	useEffect(() => {
		if (user?.focus_delay === delay) return;
		if (delay) {
			updateUser(
				{ focus_delay: delay },
				{
					onError: (err, _, context) => {
						addError(
							err.response?.data?.msg || "Error updating focus timer",
							err?.response?.data?.error || "Please contact support"
						);
						queryClient.setQueryData("user", context.previousUser);
					},
					onSuccess: () => {
						addSuccess("Focus timer updated");
					},
				}
			);
		}
	}, [delay]);

	const onToggleChange = () => {
		const updated = Boolean(!user?.focus_delay);
		updateUser(
			{ focus_delay: updated ? 30 : null },
			{
				onError: (err, _, context) => {
					addError(
						err.response?.data?.msg || "Error updating focus timer",
						err?.response?.data?.error || "Please contact support"
					);
					queryClient.setQueryData("user", context.previousUser);
				},
				onSuccess: () => {
					addSuccess("Focus timer updated");
				},
			}
		);
	};

	return (
		<div className={styles.container} id={SEARCH_OPTIONS.TIMER}>
			<div className={styles.title}>
				<h2>{PROFILE_TRANSLATION.TIMER[recoilUser?.language?.toUpperCase()]}</h2>
				<p>
					{
						PROFILE_TRANSLATION.SET_DELAY_BETWEEN_TASKS[
							recoilUser?.language?.toUpperCase()
						]
					}
				</p>
			</div>
			<div className={styles.settings}>
				<div className={styles.toggle}>
					<span>
						{PROFILE_TRANSLATION.SET_DELAY[recoilUser?.language?.toUpperCase()]}
					</span>
					<Toggle
						theme="PURPLE"
						checked={Boolean(user?.focus_delay)}
						onChange={onToggleChange}
					/>
				</div>
				{user?.focus_delay && (
					<div className={styles.select}>
						{PROFILE_TRANSLATION.DURATION_OF_DELAY[recoilUser?.language?.toUpperCase()]}
						<div>
							<Select value={delay} setValue={setDelay} options={DELAY_OPTIONS} /> Seconds
						</div>
					</div>
				)}
			</div>
		</div>
	);
};
export default PowerSettings;
