import React, { useContext, useEffect, useState } from "react";
import styles from "./ChangePassword.module.scss";
import { Input, Label, ThemedButton } from "@cadence-frontend/widgets";
import { InputThemes, ThemedButtonThemes } from "@cadence-frontend/themes";
import { Caution2, View, ViewGradient } from "@cadence-frontend/icons";
import { Colors } from "@cadence-frontend/utils";
import {
	Profile as PROFILE_TRANSLATION,
	Common as COMMON_TRANSLATION,
} from "@cadence-frontend/languages";
import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue } from "recoil";
import { MessageContext } from "@cadence-frontend/contexts";

const ChangePassword = ({ userDataAccess, setChangePassword }) => {
	const user = useRecoilValue(userInfo);
	const { addError, addSuccess } = useContext(MessageContext);

	const { updatePassword, passwordLoading } = userDataAccess;

	const [password, setPassword] = useState({
		currentPassword: "",
		newPassword: "",
		confirmPassword: "",
	});
	const [hidePass, setHidePass] = useState({
		currPass: true,
		newPass: true,
		rePass: true,
	});
	const [passwordError, setPasswordError] = useState("");
	const [mismatchError, setMismatchError] = useState("");

	//functions

	const checkPassword = password => {
		const regex8C = /^.{8,}$/;
		const regexLC = /^(?=.*?[a-z])/;
		const regexUC = /^(?=.*?[A-Z])/;
		const regexNum = /^(?=.*?[0-9])/;
		const regexSC = /^(?=.*?[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~])/;

		setPasswordError("");
		if (!regex8C.test(password)) {
			setMismatchError("");
			setPasswordError("Password must be at least 8 characters.");
			return;
		}
		if (!regexLC.test(password)) {
			setMismatchError("");
			setPasswordError("Password must have 1 lowercase character.");
			return;
		}
		if (!regexUC.test(password)) {
			setMismatchError("");
			setPasswordError("Password must have 1 uppercase character.");
			return;
		}
		if (!regexNum.test(password)) {
			setMismatchError("");
			setPasswordError("Password must have 1 numeric character.");
			return;
		}
		if (!regexSC.test(password)) {
			setMismatchError("");
			setPasswordError("Password must have 1 special character.");
			return;
		}
	};

	const matchPasswords = (password, confirmPassword) => {
		setMismatchError("");
		if (passwordError === "" && password !== confirmPassword) {
			setMismatchError("Password does not match. Please re-check.");
		}
	};

	const onUpdatePassword = () => {
		if (!password.currentPassword || !password.newPassword || !password.confirmPassword)
			return addError({ text: "Missing fields" });

		if (password.newPassword !== password.confirmPassword)
			return addError({ text: "Re-entered password does not match" });

		if (mismatchError !== "" || passwordError !== "")
			return addError({ text: mismatchError !== "" ? mismatchError : passwordError });

		updatePassword(password, {
			onError: err =>
				addError({
					text: err.response?.data?.msg || "Error updating password",
					desc: err?.response?.data?.error ?? "Please contact support",
					cId: err?.response?.data?.correlationId,
				}),
			onSuccess: () => {
				addSuccess("New password saved");
				setChangePassword(false);
			},
		});
	};

	//sideeffects

	useEffect(() => {
		setPassword({
			currentPassword: "",
			newPassword: "",
			confirmPassword: "",
		});
	}, []);

	return (
		<div className={styles.changePassword}>
			<div>
				<Label>
					{PROFILE_TRANSLATION.CURRENT_PASSWORD[user?.language?.toUpperCase()]}
				</Label>
				<Input
					theme={InputThemes.WHITE}
					type={hidePass.currPass ? "password" : "text"}
					value={password}
					setValue={setPassword}
					name="currentPassword"
					placeholder={PROFILE_TRANSLATION.ENTER_PASSWORD[user?.language?.toUpperCase()]}
				/>
				<div className={styles.hidePassword}>
					{hidePass.currPass ? (
						<View
							size={18}
							color={Colors.veryLightBlue}
							onClick={() => setHidePass(prev => ({ ...prev, currPass: !prev.currPass }))}
						/>
					) : (
						<ViewGradient
							size={18}
							onClick={() => setHidePass(prev => ({ ...prev, currPass: !prev.currPass }))}
						/>
					)}
				</div>
			</div>
			<div className={passwordError.length ? styles.error : ""}>
				<Label>{PROFILE_TRANSLATION.NEW_PASSWORD[user?.language?.toUpperCase()]}</Label>
				<Input
					theme={InputThemes.WHITE}
					type={hidePass.newPass ? "password" : "text"}
					value={password.newPassword}
					setValue={value => {
						setPassword(prev => ({ ...prev, newPassword: value }));
						checkPassword(value);
					}}
					onBlur={() => matchPasswords(password.newPassword, password.confirmPassword)}
					placeholder={PROFILE_TRANSLATION.ENTER_PASSWORD[user?.language?.toUpperCase()]}
					autoComplete="new-password"
				/>
				<span className={`${styles.errorMsg}`}>
					<Caution2 color={Colors.orangeGradient} /> <span>{passwordError}</span>
				</span>
				<div className={styles.hidePassword}>
					{hidePass.newPass ? (
						<View
							size={18}
							color={Colors.veryLightBlue}
							onClick={() => setHidePass(prev => ({ ...prev, newPass: !prev.newPass }))}
						/>
					) : (
						<ViewGradient
							size={18}
							onClick={() => setHidePass(prev => ({ ...prev, newPass: !prev.newPass }))}
						/>
					)}
				</div>
			</div>
			<div className={mismatchError.length ? styles.error : ""}>
				<Label>
					{PROFILE_TRANSLATION.RE_ENTER_NEW_PASSWORD[user?.language?.toUpperCase()]}
				</Label>
				<Input
					theme={InputThemes.WHITE}
					type={hidePass.rePass ? "password" : "text"}
					value={password.confirmPassword}
					setValue={value => {
						setPassword(prev => ({ ...prev, confirmPassword: value }));
						matchPasswords(password.newPassword, value);
					}}
					onBlur={() => matchPasswords(password.newPassword, password.confirmPassword)}
					placeholder={
						PROFILE_TRANSLATION.RE_ENTER_PASSWORD[user?.language?.toUpperCase()]
					}
					autoComplete="new-password"
				/>
				<span className={`${styles.errorMsg}`}>
					<Caution2 color={Colors.orangeGradient} /> <span>{mismatchError}</span>
				</span>
				<div className={styles.hidePassword}>
					{hidePass.rePass ? (
						<View
							size={18}
							color={Colors.veryLightBlue}
							onClick={() => setHidePass(prev => ({ ...prev, rePass: !prev.rePass }))}
						/>
					) : (
						<ViewGradient
							size={18}
							onClick={() => setHidePass(prev => ({ ...prev, rePass: !prev.rePass }))}
						/>
					)}
				</div>
			</div>
			<div className={styles.buttons}>
				<ThemedButton
					theme={ThemedButtonThemes.PRIMARY}
					width="fit-content"
					className={styles.saveButton}
					onClick={onUpdatePassword}
					loading={passwordLoading}
					loadingText={"Saving"}
				>
					<div>{COMMON_TRANSLATION.SAVE[user?.language?.toUpperCase()]} new password</div>
				</ThemedButton>
				<ThemedButton
					theme={ThemedButtonThemes.TRANSPARENT}
					width="fit-content"
					onClick={() => setChangePassword(false)}
				>
					<div>{COMMON_TRANSLATION.CANCEL[user?.language?.toUpperCase()]}</div>
				</ThemedButton>
			</div>
		</div>
	);
};

export default ChangePassword;
