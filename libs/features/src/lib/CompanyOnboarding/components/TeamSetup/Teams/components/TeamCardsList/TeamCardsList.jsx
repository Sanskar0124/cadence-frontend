import styles from "./TeamCardsList.module.scss";
import { Skeleton } from "@cadence-frontend/components";
import { ThemedButton } from "@cadence-frontend/widgets";
import { NoTeams, Plus } from "@cadence-frontend/icons";
import { ThemedButtonThemes } from "@cadence-frontend/themes";

import TeamCard from "./components/TeamCard/TeamCard";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";

const TeamCardsList = ({ teams, loading, setCreateTeamModal, setTeamId, setSdName }) => {
	const user = useRecoilValue(userInfo);

	const firstElementInTheFirst = array => {
		let copied = [...(array || [])];
		return copied?.sort((info, b) => (info.name === "Admin" ? -1 : 1));
	};

	return (
		<div className={styles.teamsContainer}>
			{loading ? (
				<div className={styles.teams}>
					{[...Array(12).keys()].map(key => (
						<Skeleton key={key} className={styles.placeholderCard} />
					))}
				</div>
			) : teams?.length > 0 ? (
				<div className={styles.teams}>
					{firstElementInTheFirst(teams)
						?.filter(teamInfo => teamInfo.sd_id !== "admin")
						?.map(team => (
							<TeamCard
								key={team.sd_id}
								info={team}
								setTeamId={setTeamId}
								setSdName={setSdName}
							/>
						))}
				</div>
			) : (
				<div className={styles.noTeams}>
					<NoTeams />
					<h4>{COMMON_TRANSLATION.NO_TEAM_ADDED_YET[user?.language?.toUpperCase()]}</h4>
					<ThemedButton
						theme={ThemedButtonThemes.WHITE}
						className={styles.addNewTeamBtn}
						onClick={() => setCreateTeamModal(prevState => !prevState)}
						width={"fit-content"}
					>
						<Plus />
						<div>{COMMON_TRANSLATION.NEW_GROUP[user?.language?.toUpperCase()]}</div>
					</ThemedButton>
				</div>
			)}
		</div>
	);
};

TeamCardsList.defaultProps = {
	loading: false,
};

export default TeamCardsList;
