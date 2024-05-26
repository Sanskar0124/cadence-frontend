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
import { Colors, useQuery } from "@cadence-frontend/utils";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";
import {
	Common as COMMON_TRANSLATION,
	Settings as SETTINGS_TRANSLATION,
	Pipedrive as PIPEDRIVE_TRANSLATION,
} from "@cadence-frontend/languages";
import { TabNavSlider, ThemedButton } from "@cadence-frontend/widgets";
import { TabNavThemes, ThemedButtonThemes } from "@cadence-frontend/themes";

//constants

const TITLE_MAP = {
	person: COMMON_TRANSLATION.PERSON,
	organization: COMMON_TRANSLATION.ORGANIZATION,
};

const TopView = ({
	currentView,
	setCurrentView,
	topViewData,
	formCount,
	isOnboarding,
}) => {
	const query = useQuery();
	const current_view = query.get("current_view");
	const user = useRecoilValue(userInfo);

	const TAB_OPTIONS = [
		{ label: SETTINGS_TRANSLATION.FIELD_MAPPING, value: current_view },
		{ label: SETTINGS_TRANSLATION.CUSTOM_FORM_BUILDER, value: VIEWS.CUSTOM_OBJECTS },
	];

	return (
		<div className={`${styles.topView} ${isOnboarding ? styles.isOnboarding : ""}`}>
			<div className={styles.left}>
				{isOnboarding ? (
					<>
						<div className={styles.title}>
							<span>
								<Connection color={Colors.white} size="1.45rem" />
							</span>
							<Title size="1.4rem">
								{COMMON_TRANSLATION.MATCH_FIELDS[user?.language?.toUpperCase()]}
							</Title>
						</div>
						<div className={styles.subtitle}>
							{
								PIPEDRIVE_TRANSLATION.MATCH_PIPEDRIVE_FIELDS[
									user?.language?.toUpperCase()
								]
							}
						</div>
					</>
				) : (
					<Title size="1.4rem">
						{TITLE_MAP[current_view]?.[user?.language?.toUpperCase()]}
					</Title>
				)}
			</div>
			{isOnboarding ? (
				<div className={styles.right}>
					<div
						onClick={() => setCurrentView(VIEWS.ORGANIZATION)}
						className={`${styles.option} ${
							currentView === VIEWS.PERSON || currentView === VIEWS.ORGANIZATION
								? styles.active
								: ""
						}`}
					>
						<div>
							{currentView === VIEWS.ORGANIZATION || currentView === VIEWS.PERSON ? (
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
								{
									SETTINGS_TRANSLATION.PERSON_AND_ORGANIZATION[
										user?.language?.toUpperCase()
									]
								}
							</div>
							<div className={styles.matchFieldsResult}>
								{"("}
								{topViewData[VIEWS.ORGANIZATION] + topViewData[VIEWS.PERSON]}/
								{RINGOVER_FIELDS[VIEWS.ORGANIZATION].length +
									RINGOVER_FIELDS[VIEWS.PERSON].length}{" "}
								{SETTINGS_TRANSLATION.FIELDS_MATCHED[user?.language?.toUpperCase()]}
								{")"}
							</div>
						</div>
					</div>
					<div
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
					</div>
				</div>
			) : (
				<div className={styles.right}>
					{current_view === VIEWS.PERSON && (
						<TabNavSlider
							theme={TabNavThemes.SLIDER}
							buttons={TAB_OPTIONS.map(op => ({
								label: op.label[user?.language?.toUpperCase()],
								value: op.value,
							}))}
							value={currentView}
							setValue={setCurrentView}
							className={styles.tabNav}
							activeBtnClassName={styles.activeTab}
							btnClassName={styles.tabBtn}
							noAnimation
						/>
					)}
				</div>
			)}
		</div>
	);
};

export default TopView;
