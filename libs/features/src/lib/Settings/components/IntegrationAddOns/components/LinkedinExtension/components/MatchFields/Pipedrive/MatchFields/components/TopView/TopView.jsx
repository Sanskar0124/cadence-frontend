import { Company, CompanyGradient } from "@cadence-frontend/icons";
import { Title } from "@cadence-frontend/components";
import { RINGOVER_FIELDS, VIEWS } from "../../constants";
import { Colors } from "@cadence-frontend/utils";

import styles from "./TopView.module.scss";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";
import {
	Common as COMMON_TRANSLATION,
	Settings as SETTINGS_TRANSLATION,
} from "@cadence-frontend/languages";

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
					{SETTINGS_TRANSLATION.MATCH_PIPEDRIVE_FIELDS[user?.language?.toUpperCase()]}
				</div>
			</div>
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
							{" "}
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
							fields matched{")"}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default TopView;
