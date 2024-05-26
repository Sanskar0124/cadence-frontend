import { useState } from "react";
import { useSubDepartments } from "@cadence-frontend/data-access";

import styles from "./Teams.module.scss";
import { ThemedButton } from "@cadence-frontend/widgets";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { BadgeAccountHorizontal, Plus } from "@cadence-frontend/icons";

import CreateTeamModal from "./components/CreateTeamModal/CreateTeamModal";
import TeamCardsList from "./components/TeamCardsList/TeamCardsList";
import {
	Common as COMMON_TRANSLATION,
	Settings as SETTINGS_TRANSLATION,
} from "@cadence-frontend/languages";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";

const Teams = ({ setTeamId, setSdName }) => {
	const subDepartmentsDataAccess = useSubDepartments(true, true);
	const { subDepartments: teams, subDepartmentsLoading: teamsLoading } =
		subDepartmentsDataAccess;

	const [createTeamModal, setCreateTeamModal] = useState(false);
	const user = useRecoilValue(userInfo);

	return (
		<div className={styles.teamsPage}>
			<div className={styles.header}>
				<div className={styles.left}>
					<div className={styles.title}>
						<div className={styles.icon}>
							<BadgeAccountHorizontal size={16} />
						</div>
						<h3>{COMMON_TRANSLATION.GROUP_SETUP[user?.language?.toUpperCase()]}</h3>
					</div>

					<p className={styles.subTitle}>
						{
							SETTINGS_TRANSLATION.CREATE_AS_MANY_GROUPS_AS_YOU_REQUIRE[
								user?.language?.toUpperCase()
							]
						}
					</p>
				</div>

				<div className={styles.right}>
					{teams?.length > 0 && (
						<ThemedButton
							theme={ThemedButtonThemes.GREY}
							className={styles.addNewTeamBtn}
							onClick={() => setCreateTeamModal(prevState => !prevState)}
						>
							<Plus />
							<div>{SETTINGS_TRANSLATION.NEW_GROUP[user?.language?.toUpperCase()]}</div>
						</ThemedButton>
					)}
				</div>
			</div>
			<div className={styles.body}>
				<TeamCardsList
					teams={teams}
					loading={teamsLoading}
					setCreateTeamModal={setCreateTeamModal}
					setTeamId={setTeamId}
					setSdName={setSdName}
				/>
			</div>
			<CreateTeamModal
				modal={createTeamModal}
				setModal={setCreateTeamModal}
				dataAccess={subDepartmentsDataAccess}
			/>
		</div>
	);
};

export default Teams;
