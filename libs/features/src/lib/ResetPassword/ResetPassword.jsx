import { userInfo } from "@cadence-frontend/atoms";
import { MessageContext } from "@cadence-frontend/contexts";
import { useUser } from "@cadence-frontend/data-access";
import { useContext, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useRecoilState } from "recoil";

import { PageContainer, Spinner, Title } from "@cadence-frontend/components";
import {
	CadenceLogo,
	Caution2,
	FranceFlag,
	SpainFlag,
	UkFlag,
	View,
	ViewGradient,
} from "@cadence-frontend/icons";
import {
	Common as COMMON_TRANSLATION,
	Profile as PROFILE_TRANSLATION,
} from "@cadence-frontend/languages";
import {
	InputThemes,
	TabNavBtnThemes,
	TabNavThemes,
	ThemedButtonThemes,
} from "@cadence-frontend/themes";
import { Colors } from "@cadence-frontend/utils";
import { Input, Label, TabNav, TabNavBtn, ThemedButton } from "@cadence-frontend/widgets";
import styles from "./ResetPassword.module.scss";
import { LANGUAGES } from "@cadence-frontend/constants";

const ResetPassword = () => {
	const [searchParams] = useSearchParams();
	const [user, setUser] = useRecoilState(userInfo);
	const { addError } = useContext(MessageContext);
	const { resetPassword, resetPasswordLoading } = useUser(false);
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [hidePass, setHidePass] = useState({ pass: true, rePass: true });
	const [passwordError, setPasswordError] = useState("");
	const [mismatchError, setMismatchError] = useState("");
	const [success, setSuccess] = useState(false);

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
		} else if (!regexLC.test(password)) {
			setMismatchError("");
			setPasswordError("Password must have 1 lowercase character.");
		} else if (!regexUC.test(password)) {
			setMismatchError("");
			setPasswordError("Password must have 1 uppercase character.");
		} else if (!regexNum.test(password)) {
			setMismatchError("");
			setPasswordError("Password must have 1 numeric character.");
		} else if (!regexSC.test(password)) {
			setMismatchError("");
			setPasswordError("Password must have 1 special character.");
		}
	};

	const matchPasswords = (password, confirmPassword) => {
		setMismatchError("");
		if (passwordError === "" && password !== confirmPassword) {
			setMismatchError("Password does not match. Please re-check.");
		}
	};

	const onSubmit = async e => {
		if (!success) {
			e.preventDefault();
			if (passwordError !== "" || mismatchError !== "") {
				return;
			}

			resetPassword(
				{
					token: searchParams.get("token"),
					password,
					language: user.language,
				},
				{
					onError: err => {
						addError({
							text: err.response?.data?.msg ?? "Couldn't setup password! Try again.",
							desc: err?.response?.data?.error ?? "Please contact support",
							cId: err?.response?.data?.correlationId,
						});
					},
					onSuccess: data => {
						setPassword("");
						setConfirmPassword("");
						setUser(data.data);
						setSuccess(true);
					},
				}
			);
		} else {
			window.location.href = `/crm/tasks`;
		}
	};

	const onLangUpdate = language => {
		setUser(prev => ({
			...prev,
			language,
		}));
	};

	return (
		<PageContainer
			onKeyDown={e => e.key === "Enter" && onSubmit(e)}
			className={styles.userSetupContainer}
		>
			<div className={styles.container}>
				<div className={styles.logo}>
					<CadenceLogo size="38px" />
					<div>
						<span>
							{COMMON_TRANSLATION.CADENCE[user?.language?.toUpperCase() || "ENGLISH"]}
						</span>
						<span>
							{COMMON_TRANSLATION.BY_RINGOVER[user?.language?.toUpperCase() || "ENGLISH"]}
						</span>
					</div>
				</div>
				{!success ? (
					<>
						<div className={styles.title}>
							<Title>
								{
									PROFILE_TRANSLATION.RESET_PASSWORD[
										user?.language?.toUpperCase() || "ENGLISH"
									]
								}
							</Title>
							<p>
								{
									PROFILE_TRANSLATION.SET_UP_A_NEW_PASSWORD[
										user?.language?.toUpperCase() || "ENGLISH"
									]
								}
							</p>
						</div>
						<div
							className={`${styles.inputBox} ${passwordError !== "" ? styles.error : ""}`}
						>
							<Label>Password</Label>
							<Input
								height="53px"
								type={hidePass.pass ? "password" : "text"}
								name="password"
								value={password}
								setValue={value => {
									setPassword(value);
									checkPassword(value);
								}}
								onBlur={() => matchPasswords(password, confirmPassword)}
								placeholder="Password"
								theme={InputThemes.WHITE}
								disabled={resetPasswordLoading}
							/>
							<span className={`${styles.errorMsg}`}>
								<Caution2 color={Colors.orangeGradient} /> <span>{passwordError}</span>
							</span>
							<div className={styles.hidePassword}>
								{hidePass.pass ? (
									<View
										size={18}
										color={Colors.lightBlue}
										onClick={() => setHidePass(prev => ({ ...prev, pass: !prev.pass }))}
									/>
								) : (
									<ViewGradient
										size={18}
										onClick={() => setHidePass(prev => ({ ...prev, pass: !prev.pass }))}
									/>
								)}
							</div>
						</div>
						<div
							className={`${styles.inputBox} ${mismatchError !== "" ? styles.error : ""}`}
						>
							<Label>
								{
									PROFILE_TRANSLATION.RE_ENTER_PASSWORD[
										user?.language?.toUpperCase() || "ENGLISH"
									]
								}
							</Label>
							<Input
								height="53px"
								type={hidePass.rePass ? "password" : "text"}
								name="confirm password"
								value={confirmPassword}
								setValue={value => {
									setConfirmPassword(value);
									matchPasswords(password, value);
								}}
								placeholder={
									PROFILE_TRANSLATION.RE_ENTER_PASSWORD[
										user?.language?.toUpperCase() || "ENGLISH"
									]
								}
								theme={InputThemes.WHITE}
								disabled={resetPasswordLoading}
							/>
							<span className={`${styles.errorMsg}`}>
								<Caution2 color={Colors.orangeGradient} /> <span>{mismatchError}</span>
							</span>
							<div className={styles.hidePassword}>
								{hidePass.rePass ? (
									<View
										size={18}
										color={Colors.lightBlue}
										onClick={() =>
											setHidePass(prev => ({ ...prev, rePass: !prev.rePass }))
										}
									/>
								) : (
									<ViewGradient
										size={18}
										onClick={() =>
											setHidePass(prev => ({ ...prev, rePass: !prev.rePass }))
										}
									/>
								)}
							</div>
						</div>
					</>
				) : (
					<>
						<div className={styles.successTitle}>
							<p>
								{
									PROFILE_TRANSLATION.NEW_PASSWORD_HAS_BEEN_SET[
										user?.language?.toUpperCase() || "ENGLISH"
									]
								}{" "}
								🎉
							</p>
						</div>

						<div className={styles.descPara}>
							{
								PROFILE_TRANSLATION.NEW_PASSWORD_HAS_BEEN_SUCCESSFULLY_SET[
									user?.language?.toUpperCase() || "ENGLISH"
								]
							}{" "}
							<br />
							{
								PROFILE_TRANSLATION.CHANGE_PASSWORD_ANYTIME[
									user?.language?.toUpperCase() || "ENGLISH"
								]
							}
						</div>
					</>
				)}
				<ThemedButton
					theme={ThemedButtonThemes.PRIMARY}
					onClick={onSubmit}
					loading={resetPasswordLoading}
				>
					<div>
						{!success
							? COMMON_TRANSLATION.SET_PASSWORD[
									user?.language?.toUpperCase() || "ENGLISH"
							  ]
							: COMMON_TRANSLATION.GO_TO_TASKS[
									user?.language?.toUpperCase() || "ENGLISH"
							  ]}
					</div>
				</ThemedButton>
				<TabNav
					btnTheme={TabNavBtnThemes.PRIMARY_AND_TRANSPARENT}
					className={styles.langTabNav}
				>
					<TabNavBtn
						active={user?.language === LANGUAGES.ENGLISH ? true : false}
						onClick={e => onLangUpdate(LANGUAGES.ENGLISH)}
					>
						<UkFlag
							size={"2rem"}
							className={user?.language === LANGUAGES.ENGLISH ? styles.active : ""}
						/>
					</TabNavBtn>
					<TabNavBtn
						onClick={e => onLangUpdate(LANGUAGES.FRENCH)}
						active={user?.language === LANGUAGES.FRENCH ? true : false}
					>
						<FranceFlag
							size={"2rem"}
							className={user?.language === LANGUAGES.FRENCH ? styles.active : ""}
						/>
					</TabNavBtn>
					<TabNavBtn
						onClick={e => onLangUpdate(LANGUAGES.SPANISH)}
						active={user?.language === LANGUAGES.SPANISH ? true : false}
					>
						<SpainFlag
							size={"2rem"}
							className={user?.language === LANGUAGES.SPANISH ? styles.active : ""}
						/>
					</TabNavBtn>
				</TabNav>
			</div>
			{resetPasswordLoading && <Spinner className={styles.loadingSpinner} />}
		</PageContainer>
	);
};

export default ResetPassword;
