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
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
//components

//constants

const TopView = ({ currentView, setCurrentView, topViewData, formCount }) => {
	const user = useRecoilValue(userInfo);
	return (
		<div className={styles.topView}>
			<div className={styles.left}>
				<div className={styles.title}>
					<Title size="1.1rem">
						{COMMON_TRANSLATION.MATCH_FIELDS[user?.language?.toUpperCase()]}
					</Title>
				</div>
				<div className={styles.subtitle}>
					Here you can match your Salesforce fields to our exisiting Cadence fields.{" "}
				</div>
			</div>
			<div className={styles.right}>
				<div
					onClick={() => setCurrentView(VIEWS.LEAD)}
					className={`${styles.option} ${
						currentView === VIEWS.LEAD ? styles.active : ""
					}`}
				>
					<div>
						{currentView === VIEWS.LEAD ? (
							<span className={styles.active}>
								<Leads color={Colors.white} />
							</span>
						) : (
							<span className={styles.inactive}>
								<LeadsGradient />
							</span>
						)}
					</div>
					<div>
						<div className={styles.title}>Leads</div>
						<div className={styles.matchFieldsResult}>
							{"("}
							{topViewData[VIEWS.LEAD]}/{RINGOVER_FIELDS[VIEWS.LEAD].length} fields
							matched{")"}
						</div>
					</div>
				</div>
				<div
					onClick={() => setCurrentView(VIEWS.ACCOUNT)}
					className={`${styles.option} ${
						currentView === VIEWS.CONTACT || currentView === VIEWS.ACCOUNT
							? styles.active
							: ""
					}`}
				>
					<div>
						{currentView === VIEWS.ACCOUNT || currentView === VIEWS.CONTACT ? (
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
						<div className={styles.title}>Account and contacts</div>
						<div className={styles.matchFieldsResult}>
							{"("}
							{topViewData[VIEWS.ACCOUNT] + topViewData[VIEWS.CONTACT]}/
							{RINGOVER_FIELDS[VIEWS.ACCOUNT].length +
								RINGOVER_FIELDS[VIEWS.CONTACT].length}{" "}
							fields matched{")"}
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
						<div className={styles.title}>Custom form builder</div>
						<div className={styles.matchFieldsResult}>
							{"("}
							{formCount}/2{")"}
						</div>
					</div>
				</div> */}
			</div>
		</div>
	);
};

export default TopView;
