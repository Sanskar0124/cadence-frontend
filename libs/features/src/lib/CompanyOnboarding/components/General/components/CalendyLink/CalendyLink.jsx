import React, { useContext, useEffect, useState } from "react";
import { QueryClient } from "react-query";
import { useUser } from "@cadence-frontend/data-access";
import { Input, ThemedButton } from "@cadence-frontend/widgets";
import { MessageContext } from "@cadence-frontend/contexts";
import styles from "./CalendyLink.module.scss";
import { InputThemes, ThemedButtonThemes } from "@cadence-frontend/themes";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import { SESSION_STORAGE_KEYS } from "@cadence-frontend/constants";

const CalendyLink = () => {
	const { addError } = useContext(MessageContext);
	const { user, updateUser, updateLoading } = useUser(false);
	const [input, setInput] = useState("");
	const [success, setSuccess] = useState(false);

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
						text: "Error updating calendy link",
						desc: err?.response?.data?.error ?? "Please contact support",
						cId: err?.response?.data?.correlationId,
					});
					QueryClient.setQueryData("user", context.previousUser);
				},
				onSuccess: () => {
					setSuccess(true);
					setTimeout(() => {
						setSuccess(false);
					}, 2000);
				},
			}
		);
	};

	useEffect(() => {
		if (user && !sessionStorage.getItem(SESSION_STORAGE_KEYS.IS_LANGUAGE_UPDATED))
			setInput(user?.calendly_url ?? "");
	}, [user]);

	return (
		<div className={styles.calendy}>
			<Input
				width="578px"
				height="44px"
				value={input}
				setValue={setInput}
				style={{ borderRadius: "15px" }}
				theme={InputThemes.WHITE_WITH_GREY_BORDER}
				placeholder="eg : www.calendly.com/usernameoce/somealphaval121234"
			/>
			{success ? (
				<span className={styles.success}>
					{COMMON_TRANSLATION.SAVED_SUCCESSFULLY[user?.language?.toUpperCase()]}
				</span>
			) : (
				<ThemedButton theme={ThemedButtonThemes.TRANSPARENT} onClick={onUpdate}>
					{updateLoading
						? `${COMMON_TRANSLATION.SAVING[user?.language?.toUpperCase()] ?? ""}`
						: `${COMMON_TRANSLATION.SAVE[user?.language?.toUpperCase()] ?? ""}`}
				</ThemedButton>
			)}
		</div>
	);
};

export default CalendyLink;
