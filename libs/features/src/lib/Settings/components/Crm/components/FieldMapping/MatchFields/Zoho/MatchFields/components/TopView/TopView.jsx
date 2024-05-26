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
import { RINGOVER_FIELDS, VIEWS } from "../../constants";
import styles from "./TopView.module.scss";

import { TabNavThemes } from "@cadence-frontend/themes";
import { TabNavSlider } from "@cadence-frontend/widgets";

//constants

const TITLE_MAP = {
	lead: COMMON_TRANSLATION.LEADS,
	contact: SETTINGS_TRANSLATION.ACCOUNTS_AND_CONTACTS,
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
							{SETTINGS_TRANSLATION.MATCH_ZOHO_FIELDS[user?.language?.toUpperCase()]}
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
							<div className={styles.title}>
								{COMMON_TRANSLATION.LEADS[user?.language?.toUpperCase()]}
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
								{formCount}/2{")"}
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
