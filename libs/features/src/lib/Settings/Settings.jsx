import { userInfo } from "@cadence-frontend/atoms";
import { Container, Title } from "@cadence-frontend/components";
import { ROLES } from "@cadence-frontend/constants";
import { usePayment } from "@cadence-frontend/data-access";
import { Marketplace } from "@cadence-frontend/icons";
import {
	Common as COMMON_TRANSLATION,
	Profile as PROFILE_TRANSLATION,
	Settings as SETTING_TRANSLATION,
} from "@cadence-frontend/languages";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { capitalize, useQuery } from "@cadence-frontend/utils";
import { ThemedButton } from "@cadence-frontend/widgets";
import moment from "moment-timezone";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import styles from "./Settings.module.scss";
import Search from "./components/Search/Search";
import { TABS, getIntegrationOptions, getProfileOptions, renderView } from "./constants";

const Settings = () => {
	const user = useRecoilValue(userInfo);
	const navigate = useNavigate();
	const location = useLocation();
	const query = useQuery();
	const activeTabParam = query.get("view");
	const searchParam = query.get("search");
	const current_view = query.get("current_view");

	const postDataRef = useRef(null);
	const isAdmin = user.role === ROLES.SUPER_ADMIN || user.role === ROLES.ADMIN;

	//data access
	const { paymentDetails } = usePayment(isAdmin);

	//states
	const [activeTab, setActiveTab] = useState("");
	const [showSave, setShowSave] = useState(false);
	const [ifUnsavedChanges, setIfUnsavedChanges] = useState(null);
	const [saveBtnLoading, setSaveBtnLoading] = useState(false);

	//functions
	const handleTabChange = value => {
		setActiveTab(value);
		navigate(`?view=${value}`);
	};

	const handleSaveClick = () => postDataRef.current({ cb: () => null });

	//sideeffects
	useEffect(() => {
		setActiveTab(activeTabParam ?? TABS.MY_ACCOUNT);
	}, [location]);

	useEffect(() => {
		if (searchParam) {
			let element = document.getElementById(searchParam);
			if (element) {
				element?.scrollIntoView({ behavior: "smooth", block: "start" });
				element.style.background = "#cbeff3bc";
				setTimeout(() => (element.style.background = "none"), 1000);
			}
		}
	}, [searchParam, activeTab, location]);

	useEffect(() => {
		setShowSave(typeof ifUnsavedChanges === "function" && ifUnsavedChanges());

		// alternateOnClickFunction.current = ({ cb }) => {
		// 	if (
		// 		typeof ifUnsavedChanges === "function" &&
		// 		ifUnsavedChanges()
		// 	)
		// 		setLeaveWarningModal({ cb });
		// 	else cb();
		// };
	}, [ifUnsavedChanges]);

	useEffect(() => {
		setIfUnsavedChanges(null);
	}, [activeTab]);

	return (
		<>
			{isAdmin && paymentDetails?.is_trial_active && (
				<div className={styles.trialBanner}>
					{COMMON_TRANSLATION.YOUR_TRIAL_ENDS_ON[user?.language.toUpperCase()]}{" "}
					{moment(paymentDetails?.trial_valid_until).format("DD MMMM YYYY")}
				</div>
			)}
			<Container className={styles.settingsContainer}>
				<div className={styles.header}>
					<div className={styles.left}>
						<Title size="2rem">
							{COMMON_TRANSLATION.SETTINGS[user?.language?.toUpperCase()]}
						</Title>
					</div>
					<div className={styles.right}>
						<Search isAdmin={isAdmin} />
						{isAdmin && paymentDetails?.is_trial_active && (
							<div className={styles.trialInfo}>
								<span>
									{COMMON_TRANSLATION.TRIAL_ACCOUNT[user?.language.toUpperCase()]}
								</span>
								<span>
									{COMMON_TRANSLATION.TOTAL_LICENSES[user?.language.toUpperCase()]} :{" "}
									{paymentDetails?.number_of_licences}
								</span>
							</div>
						)}
						{showSave && (
							<ThemedButton
								onClick={handleSaveClick}
								theme={ThemedButtonThemes.PINK}
								loadingText={"Saving"}
								width="fit-content"
								loading={saveBtnLoading}
							>
								{COMMON_TRANSLATION.SAVE[user?.language.toUpperCase()]}
							</ThemedButton>
						)}
					</div>
				</div>
				<div className={styles.body}>
					<div className={styles.nav}>
						<div className={styles.section}>
							<span>{PROFILE_TRANSLATION.PROFILE[user?.language.toUpperCase()]}</span>
							{getProfileOptions(user.language).map(({ label, value }) => (
								<div
									onClick={() => handleTabChange(value)}
									className={activeTab === value ? styles.active : ""}
								>
									{label[user?.language.toUpperCase()]}
								</div>
							))}
						</div>
						{user?.role !== ROLES.SALESPERSON && (
							<div className={styles.section}>
								<span>{capitalize(user.integration_type.replace("_", " "))}</span>
								{getIntegrationOptions(
									user.role,
									user.language,
									user.integration_type
								).map(({ label, value }) => (
									<div
										onClick={() => handleTabChange(value)}
										className={activeTab === value ? styles.active : ""}
									>
										{label}
									</div>
								))}
							</div>
						)}
						{user?.role === ROLES.SUPER_ADMIN && (
							<ThemedButton
								theme={ThemedButtonThemes.GREY}
								onClick={() => navigate("/integrations")}
								width="fit-content"
							>
								<Marketplace /> CRMs
							</ThemedButton>
						)}
					</div>
					<div
						className={`${styles.contents} ${
							current_view ? styles.hideContentScroll : ""
						}`}
					>
						{renderView({
							activeTab,
							postDataRef,
							ifUnsavedChanges,
							setIfUnsavedChanges,
							setSaveBtnLoading,
						})}
					</div>
				</div>
			</Container>
		</>
	);
};

export default Settings;
