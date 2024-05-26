/* eslint-disable react/jsx-no-useless-fragment */
import { useState, useContext, useEffect } from "react";
import { useRecoilState, useResetRecoilState } from "recoil";
import { useSearchParams } from "react-router-dom";
import { userInfo } from "@cadence-frontend/atoms";
import styles from "./Login.module.scss";

//components
import { PageContainer, Title } from "@cadence-frontend/components";

//data-access
import { useLogin } from "@cadence-frontend/data-access";
import { Input, Label, TabNav, TabNavBtn, ThemedButton } from "@cadence-frontend/widgets";
import {
	InputThemes,
	TabNavBtnThemes,
	TabNavThemes,
	ThemedButtonThemes,
} from "@cadence-frontend/themes";
import {
	CadenceLogo,
	FranceFlag,
	RingoverLogo,
	SpainFlag,
	UkFlag,
	View,
	ViewGradient,
} from "@cadence-frontend/icons";
import { MessageContext } from "@cadence-frontend/contexts";
import { capitalize, Colors, useQuery } from "@cadence-frontend/utils";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import { LANGUAGES } from "@cadence-frontend/constants";

const Login2 = () => {
	const query = useQuery();
	const isLoggedOut = query.get("logout");
	const [user, setUser] = useRecoilState(userInfo);
	const { addError, addSuccess } = useContext(MessageContext);

	const { login, loading, error, sendResetPasswordLink, sendResetPasswordLinkLoading } =
		useLogin();

	const [input, setInput] = useState({ email: "", password: "" });
	const [forgetPasswordView, setForgetPasswordView] = useState(false);
	const [hidePass, setHidePass] = useState(true);
	const [linkSentCount, setLinkSentCount] = useState(0);

	useEffect(() => {
		if (!isLoggedOut && user?.accessToken) return (window.location.href = "/crm/home");
	}, [user]);

	const saveUser = usr => {
		setUser(usr);
		window.location.href = "/crm/home";
	};

	const onSubmit = async e => {
		if (!forgetPasswordView) {
			e.preventDefault();
			await login(
				{
					...input,
					language: user.language,
				},
				usr => saveUser(usr)
			);
		} else {
			sendResetPasswordLink(input.email, {
				onError: err =>
					addError({
						text: err.response?.data?.msg,
						desc: err?.response?.data?.error ?? "Please contact support",
						cId: err?.response?.data?.correlationId,
					}),
				onSuccess: () => {
					setLinkSentCount(prev => prev + 1);
					addSuccess("Link sent successfully!!");
				},
			});
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
			className={styles.loginContainer}
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
				<Title className={styles.capitalize}>
					{COMMON_TRANSLATION.SIGN_IN[user?.language?.toUpperCase() || "ENGLISH"]}
				</Title>
				{forgetPasswordView && (
					<span className={styles.instructions}>
						{
							COMMON_TRANSLATION.EMAIL_WITH_RESET_PASSWORD_LINK[
								user?.language?.toUpperCase() || "ENGLISH"
							]
						}
					</span>
				)}
				<div className={styles.inputBox}>
					<Label>
						{COMMON_TRANSLATION.EMAIL[user?.language?.toUpperCase() || "ENGLISH"]}
					</Label>
					<Input
						theme={InputThemes.WHITE}
						height="53px"
						type="text"
						value={input}
						setValue={setInput}
						name="email"
						placeholder="Email"
					/>
				</div>
				{!forgetPasswordView && (
					<div className={styles.inputBox}>
						<Label>
							{COMMON_TRANSLATION.PASSWORD[user?.language?.toUpperCase() || "ENGLISH"]}
						</Label>
						<Input
							theme={InputThemes.WHITE}
							height="53px"
							type={hidePass ? "password" : "text"}
							value={input}
							setValue={setInput}
							name="password"
							placeholder="Password"
						/>
						<div className={styles.hidePassword}>
							{hidePass ? (
								<View
									size={18}
									color={Colors.lightBlue}
									onClick={() => setHidePass(curr => !curr)}
								/>
							) : (
								<ViewGradient size={18} onClick={() => setHidePass(curr => !curr)} />
							)}
						</div>
					</div>
				)}
				{!forgetPasswordView && (
					<span
						className={styles.forgetPassword}
						onClick={() => setForgetPasswordView(true)}
					>
						{
							COMMON_TRANSLATION.FORGOT_PASSWORD[
								user?.language?.toUpperCase() || "ENGLISH"
							]
						}
					</span>
				)}
				<span className={styles.error}>{error}</span>
				{!forgetPasswordView ? (
					<ThemedButton
						theme={ThemedButtonThemes.PRIMARY}
						onClick={e => {
							onSubmit(e);
						}}
						loading={loading}
					>
						<div>
							{COMMON_TRANSLATION.SIGN_IN[user?.language?.toUpperCase() || "ENGLISH"]}
						</div>
					</ThemedButton>
				) : (
					<ThemedButton
						theme={ThemedButtonThemes.PRIMARY}
						onClick={e => {
							onSubmit(e);
						}}
						loading={sendResetPasswordLinkLoading}
					>
						{linkSentCount ? "Resend " : "Send "}

						{
							COMMON_TRANSLATION.PASSWORD_RESET_LINK[
								user?.language?.toUpperCase() || "ENGLISH"
							]
						}
					</ThemedButton>
				)}
				{forgetPasswordView && (
					<span
						className={styles.backToLogin}
						onClick={() => setForgetPasswordView(false)}
					>
						{COMMON_TRANSLATION.BACK_TO_LOGIN[user?.language?.toUpperCase() || "ENGLISH"]}
					</span>
				)}
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
		</PageContainer>
	);
};

export default Login2;
