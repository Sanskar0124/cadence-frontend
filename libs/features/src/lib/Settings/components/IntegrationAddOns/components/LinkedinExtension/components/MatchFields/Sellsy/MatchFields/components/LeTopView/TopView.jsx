import { useState, useEffect } from "react";
import styles from "./TopView.module.scss";
import {
	Company,
	CompanyGradient,
	Connection,
	Leads,
	LeadsGradient,
	Wrench,
	WrenchGradient,
} from "@cadence-frontend/icons";
import { Title } from "@cadence-frontend/components";
import { RINGOVER_FIELDS, VIEWS } from "../../constants";
import { Colors } from "@cadence-frontend/utils";
import {
	Common as COMMON_TRANSLATION,
	Settings as SETTINGS_TRANSLATION,
	Hubspot as HUBSPOT_TRANSLATION,
	Sellsy as SELLSY_TRANSLATION,
} from "@cadence-frontend/languages";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";

//components

//constants

const TopView = ({ currentView, setCurrentView, topViewData, formCount }) => {
	const user = useRecoilValue(userInfo);
	return (
		<div className={styles.topView}>
			<div className={styles.left}>
				<div className={styles.title}>
					<span>
						<Connection color={Colors.white} size="1.45rem" />
					</span>
					<Title size="1.4rem">
						{COMMON_TRANSLATION.MATCH_FIELDS[user?.language?.toUpperCase()]}
					</Title>
				</div>
				<div className={styles.subtitle}>
					{SELLSY_TRANSLATION.MATCH_SELLSY_FIELDS[user?.language?.toUpperCase()]}
				</div>
			</div>
			<div className={styles.right}>
				<div
					onClick={() => setCurrentView(VIEWS.CONTACT)}
					className={`${styles.option} ${
						currentView === VIEWS.CONTACT || currentView === VIEWS.COMPANY
							? styles.active
							: ""
					}`}
				>
					<div>
						{currentView === VIEWS.COMPANY || currentView === VIEWS.CONTACT ? (
							<span className={styles.active}>
								<Company color={Colors.white} />
							</span>
						) : (
							<span className={styles.inactive}>
								<CompanyGradient />
							</span>
						)}
					</div>
					<div>
						<div className={styles.title}>
							{COMMON_TRANSLATION.CONTACT_AND_COMPANY[user?.language?.toUpperCase()]}
						</div>
						<div className={styles.matchFieldsResult}>
							{"("}
							{topViewData[VIEWS.COMPANY] + topViewData[VIEWS.CONTACT]}/
							{RINGOVER_FIELDS[VIEWS.COMPANY].length +
								RINGOVER_FIELDS[VIEWS.CONTACT].length}{" "}
							{SETTINGS_TRANSLATION.FIELDS_MATCHED[user?.language?.toUpperCase()]}
							{")"}
						</div>
					</div>
				</div>
				{/* <div
					onClick={() => setCurrentView(VIEWS.CUSTOM_OBJECTS)}
					className={`${styles.option} ${
						currentView === VIEWS.CUSTOM_OBJECTS ? styles.active : ""
					}`}
				>
					<div>
						{currentView === VIEWS.CUSTOM_OBJECTS ? (
							<span className={styles.active}>
								<Wrench color={Colors.white} />
							</span>
						) : (
							<span className={styles.inactive}>
								<WrenchGradient />
							</span>
						)}
					</div>
					<div>
						<div className={styles.title}>
							{SETTINGS_TRANSLATION.CUSTOM_FORM_BUILDER[user?.language?.toUpperCase()]}
						</div>
						<div className={styles.matchFieldsResult}>
							{"("}
							{formCount}/1{")"}
						</div>
					</div>
				</div> */}
			</div>
		</div>
	);
};

export default TopView;
