import { userInfo } from "@cadence-frontend/atoms";
import { Title } from "@cadence-frontend/components";
import {
	Company,
	CompanyGradient,
	Connection,
	Leads,
	LeadsGradient,
	Wrench,
	WrenchGradient,
} from "@cadence-frontend/icons";
import {
	Common as COMMON_TRANSLATION,
	Settings as SETTINGS_TRANSLATION,
} from "@cadence-frontend/languages";
import { Colors, useQuery } from "@cadence-frontend/utils";
import { useRecoilValue } from "recoil";
import { LEADS_CURRENT_VIEWS, RINGOVER_FIELDS, VIEWS } from "../../constants";
import styles from "./TopView.module.scss";

import { TabNavThemes } from "@cadence-frontend/themes";
import { TabNavSlider } from "@cadence-frontend/widgets";
import { useEffect, useRef } from "react";

//constants

const TITLE_MAP = {
	lead: SETTINGS_TRANSLATION.ACCOUNTS_AND_LEADS,
	contact: SETTINGS_TRANSLATION.ACCOUNTS_AND_CONTACTS,
	candidate: SETTINGS_TRANSLATION.CANDIDATES,
};

const TopView = ({
	currentView,
	setCurrentView,
	topViewData,
	formCount,
	isOnboarding,
	leadsCurrentView,
	setLeadsCurrentView,
}) => {
	const query = useQuery();
	const current_view = query.get("current_view");
	const user = useRecoilValue(userInfo);

	const TAB_OPTIONS = [
		{ label: SETTINGS_TRANSLATION.FIELD_MAPPING, value: current_view },
		{ label: SETTINGS_TRANSLATION.CUSTOM_FORM_BUILDER, value: VIEWS.CUSTOM_OBJECTS },
	];

	return (
		<div className={styles.topView}>
			<div className={styles.left}>
				{isOnboarding ? (
					<>
						<div className={styles.title}>
							<span>
								<Connection color={Colors.white} size="1.45rem" />
							</span>
							<Title size="1.4rem">
								{SETTINGS_TRANSLATION.MATCH_FIELDS[user?.language?.toUpperCase()]}
							</Title>
						</div>
						<div className={styles.subtitle}>
							{SETTINGS_TRANSLATION.MATCH_BULLHORN_FIELDS[user?.language?.toUpperCase()]}
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
						onClick={() => {
							setCurrentView(VIEWS.LEAD);
							setLeadsCurrentView(LEADS_CURRENT_VIEWS.LEADS_ACCOUNTS);
						}}
						className={`${styles.option} ${
							(currentView === VIEWS.LEAD && leadsCurrentView === "lead & account") ||
							(currentView === VIEWS.ACCOUNT && leadsCurrentView === "lead & account")
								? styles.active
								: ""
						}`}
					>
						<div>
							{(currentView === VIEWS.LEAD && leadsCurrentView === "lead & account") ||
							(currentView === VIEWS.ACCOUNT && leadsCurrentView === "lead & account") ? (
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
							<div className={styles.title}>
								{SETTINGS_TRANSLATION.ACCOUNTS_AND_LEADS[user?.language?.toUpperCase()]}
							</div>
							<div className={styles.matchFieldsResult}>
								{"("}
								{topViewData[VIEWS.LEAD]}/{RINGOVER_FIELDS[VIEWS.LEAD].length}{" "}
								{SETTINGS_TRANSLATION.FIELDS_MATCHED[user?.language?.toUpperCase()]}
								{")"}
							</div>
						</div>
					</div>

					<div
						onClick={() => {
							setCurrentView(VIEWS.CANDIDATE);
							setLeadsCurrentView(LEADS_CURRENT_VIEWS.CANDIDATE);
						}}
						className={`${styles.option} ${
							currentView === VIEWS.CANDIDATE ? styles.active : ""
						}`}
					>
						<div>
							{currentView === VIEWS.CANDIDATE ? (
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
							<div className={styles.title}>
								{COMMON_TRANSLATION.CANDIDATE[user?.language?.toUpperCase()]}
							</div>
							<div className={styles.matchFieldsResult}>
								{"("}
								{topViewData[VIEWS.CANDIDATE]}/{RINGOVER_FIELDS[VIEWS.CANDIDATE].length}{" "}
								{SETTINGS_TRANSLATION.FIELDS_MATCHED[user?.language?.toUpperCase()]}
								{")"}
							</div>
						</div>
					</div>

					<div
						onClick={() => {
							setCurrentView(VIEWS.CONTACT);
							setLeadsCurrentView(LEADS_CURRENT_VIEWS.CONTACTS_ACCOUNTS);
						}}
						className={`${styles.option} ${
							(currentView === VIEWS.CONTACT &&
								leadsCurrentView === "contact & account") ||
							(currentView === VIEWS.ACCOUNT && leadsCurrentView === "contact & account")
								? styles.active
								: ""
						}`}
					>
						<div>
							{(currentView === VIEWS.CONTACT &&
								leadsCurrentView === "contact & account") ||
							(currentView === VIEWS.ACCOUNT &&
								leadsCurrentView === "contact & account") ? (
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
									SETTINGS_TRANSLATION.ACCOUNTS_AND_CONTACTS[
										user?.language?.toUpperCase()
									]
								}
							</div>
							<div className={styles.matchFieldsResult}>
								{"("}
								{topViewData[VIEWS.ACCOUNT] + topViewData[VIEWS.CONTACT]}/
								{RINGOVER_FIELDS[VIEWS.ACCOUNT].length +
									RINGOVER_FIELDS[VIEWS.CONTACT].length}{" "}
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
								{formCount}/3{")"}
							</div>
						</div>
					</div>
				</div>
			) : (
				<div className={styles.right}>
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
				</div>
			)}
		</div>
	);
};

export default TopView;
