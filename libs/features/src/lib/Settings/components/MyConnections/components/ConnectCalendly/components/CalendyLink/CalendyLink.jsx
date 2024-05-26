import { useQueryClient } from "react-query";
import { useUser } from "@cadence-frontend/data-access";
import { Input, ThemedButton } from "@cadence-frontend/widgets";
import React, { useContext, useEffect, useState } from "react";
import { MessageContext } from "@cadence-frontend/contexts";
import styles from "./CalendyLink.module.scss";
import { InputThemes, ThemedButtonThemes } from "@cadence-frontend/themes";
import { Profile as PROFILE_TRANSLATION } from "@cadence-frontend/languages";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import InputWithButton from "../../../../../InputWithButton/InputWithButton";

const CalendyLink = () => {
	const { addError, addSuccess } = useContext(MessageContext);
	const { user, updateUser, updateLoading } = useUser({ user: true });
	const [input, setInput] = useState("");
	const queryClient = useQueryClient();

	const calendlyUrlValidation = url => {
		if (url.length === 0) {
			return false;
		} else if (/^\s*$/.test(url)) {
			return true;
		} else if (
			!url.match(
				/[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/
			)
		) {
			return true;
		}
	};

	const onUpdate = () => {
		if (calendlyUrlValidation(input))
			return addError({ text: "Please enter a valid Calendly URL" });

		updateUser(
			{ calendly_url: input },
			{
				onError: (err, _, context) => {
					addError({
						text: err.response?.data?.msg || "Error updating calendy link",
						desc: err?.response?.data?.error || "Please contact support",
						cId: err?.response?.data?.correlationId,
					});
					queryClient.setQueryData("user", context.previousUser);
				},
				onSuccess: () => {
					addSuccess("Calendy Link updated");
				},
			}
		);
	};

	useEffect(() => {
		setInput(user?.calendly_url ?? "");
	}, [user]);

	return (
		<div className={styles.calendy}>
			<div className={styles.settings}>
				<InputWithButton
					inputProps={{
						placeholder: "eg : www.calendly.com/micheldupont",
						value: input,
						setValue: setInput,
					}}
					btnProps={{
						onClick: onUpdate,
						loading: updateLoading,
					}}
					btnText={COMMON_TRANSLATION.UPDATE[user?.language?.toUpperCase()]}
					width="400px"
				/>
			</div>
		</div>
	);
};

export default CalendyLink;
