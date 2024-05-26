import { Settings, SettingsBox } from "@cadence-frontend/icons";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { Colors } from "@cadence-frontend/utils";
import { ThemedButton } from "@cadence-frontend/widgets";
import { userInfo } from "@cadence-frontend/atoms";
import { useState, useEffect } from "react";
import { useRecoilValue } from "recoil";
import { NAV_SIDEBAR_OPTIONS } from "../../constants";
import styles from "./NavSidebar.module.scss";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";

//components

//constants

const NavSidebar = ({ currentStep, setCurrentStep }) => {
	const user = useRecoilValue(userInfo);
	return (
		<div className={styles.navSidebar}>
			<div className={styles.header}>
				<div className={styles.title}>
					<SettingsBox color={Colors.white} />{" "}
					{COMMON_TRANSLATION.ADMIN_RULES[user?.language?.toUpperCase()]}
				</div>
				<div className={styles.subtitle}>
					{
						COMMON_TRANSLATION.SETUP_RULES_FOR_CADENCE_TO_BE_FOLLOWED[
							user?.language?.toUpperCase()
						]
					}
				</div>
			</div>
			<div className={styles.body}>
				{Object.keys(NAV_SIDEBAR_OPTIONS).map(key => (
					<div
						onClick={() => {
							setCurrentStep(key);
						}}
						className={`${currentStep === key ? styles.active : ""} ${styles.navButton}`}
						height="45px"
					>
						{currentStep === key
							? NAV_SIDEBAR_OPTIONS[key].activeIcon
							: NAV_SIDEBAR_OPTIONS[key].icon}
						<span className={styles.labelText}>
							{NAV_SIDEBAR_OPTIONS[key].name[user?.language?.toUpperCase()]}
						</span>
					</div>
				))}
			</div>
		</div>
	);
};

export default NavSidebar;
