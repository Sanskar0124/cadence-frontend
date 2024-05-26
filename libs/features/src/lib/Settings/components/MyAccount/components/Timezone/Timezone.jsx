import { useQueryClient } from "react-query";
import { useUser } from "@cadence-frontend/data-access";
import React, { useContext } from "react";
import { MessageContext } from "@cadence-frontend/contexts";
import styles from "./Timezone.module.scss";
import TimezoneSelect from "react-timezone-select";
import { themeStyles } from "@cadence-frontend/widgets";
import {
	Profile as PROFILE_TRANSLATION,
	Common as COMMON_TRANSLATION,
} from "@cadence-frontend/languages";
import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue } from "recoil";
import { SEARCH_OPTIONS } from "../../../Search/constants";

const Timezone = () => {
	const { roundedStyles } = themeStyles({
		width: "350px",
		height: "50px",
		menuOnTop: true,
	});
	const language = useRecoilValue(userInfo).language;
	const { addError, addSuccess } = useContext(MessageContext);
	const { user, updateUser } = useUser({ user: true });
	const queryClient = useQueryClient();
	const onUpdate = timezone => {
		updateUser(
			{ timezone: timezone.value },
			{
				onError: (err, _, context) => {
					addError({
						text: err.response?.data?.msg || "Error updating timezone",
						desc: err?.response?.data?.error || "Please contact support",
						cId: err?.response?.data?.correlationId,
					});
					queryClient.setQueryData("user", context.previousUser);
				},
				onSuccess: () => {
					addSuccess("Timezone updated");
				},
			}
		);
	};

	return (
		<div className={styles.container} id={SEARCH_OPTIONS.TIMEZONE}>
			<div className={styles.title}>
				<h2>{PROFILE_TRANSLATION.TIMEZONE[language?.toUpperCase()]}</h2>
				<p>{PROFILE_TRANSLATION.SELECT_TIMEZONE[language?.toUpperCase()]}</p>
			</div>
			<div className={styles.settings}>
				<TimezoneSelect
					value={user?.timezone || ""}
					onChange={onUpdate}
					styles={roundedStyles}
					menuOnTop
					placeholder={COMMON_TRANSLATION.SELECT[language?.toUpperCase()]}
				/>
			</div>
		</div>
	);
};

export default Timezone;
