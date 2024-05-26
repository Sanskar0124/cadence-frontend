import { useContext, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";
import { MessageContext } from "@cadence-frontend/contexts";
import {
	Profile as PROFILE_TRANSLATION,
	Common as COMMON_TRANSLATION,
} from "@cadence-frontend/languages";
import styles from "./LinkedinCookie.module.scss";
import { SEARCH_OPTIONS } from "../../../Search/constants";
import InputWithButton from "../../../InputWithButton/InputWithButton";

const LinkedinCookie = ({ userDataAccess }) => {
	const { user, updateUser, updateLoading } = userDataAccess;
	const { addError, addSuccess } = useContext(MessageContext);

	const [recoilUser, setRecoilUser] = useRecoilState(userInfo);
	const [flag, setFlag] = useState(null);
	const [input, setInput] = useState("");

	useEffect(() => {
		if (user) setInput(user.linkedin_cookie);
	}, [user]);

	const handleSave = () => {
		if (!input) {
			addError({ text: "Please add the cookie first." });
			return;
		}
		const body = { linkedin_cookie: input };
		updateUser(body, {
			onError: err => {
				addError({
					text: err?.response?.data?.msg ?? "Failed to update LinkedIn cookie.",
					desc: err?.response?.data?.error || "Please contact support",
					cId: err?.response?.data?.correlationId,
				});
			},
			onSuccess: () => {
				addSuccess("LinkedIn cookie updated.");
				setRecoilUser(prev => ({ ...prev, linkedin_cookie: input }));
				setFlag(null);
			},
		});
	};

	return (
		<div className={styles.container} id={SEARCH_OPTIONS.LINKEDIN_SESSION_COOKIE}>
			<div className={styles.title}>
				<h2>
					{
						PROFILE_TRANSLATION.LINKEDIN_SESSION_COOKIE[
							recoilUser?.language?.toUpperCase()
						]
					}
				</h2>
				<p>
					{
						PROFILE_TRANSLATION.ENTER_YOUR_SESSION_COOKIE[
							recoilUser?.language?.toUpperCase()
						]
					}
				</p>
			</div>
			<div className={styles.settings}>
				<InputWithButton
					btnText={COMMON_TRANSLATION.SAVE[recoilUser?.language?.toUpperCase()]}
					inputProps={{
						value: input,
						setValue: setInput,
						placeholder:
							PROFILE_TRANSLATION.ENTER_YOUR_SESSION_COOKIE[
								recoilUser?.language?.toUpperCase()
							],
					}}
					btnProps={{
						onClick: () => {
							setFlag(true);
							handleSave();
						},
						loading: flag && updateLoading,
					}}
					width="60%"
				/>
			</div>
		</div>
	);
};

export default LinkedinCookie;
