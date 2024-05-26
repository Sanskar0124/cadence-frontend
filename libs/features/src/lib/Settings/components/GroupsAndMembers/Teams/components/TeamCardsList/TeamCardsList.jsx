import styles from "./TeamCardsList.module.scss";
import { Skeleton } from "@cadence-frontend/components";
import TeamCard from "./components/TeamCard/TeamCard";

const TeamCardsList = ({
	teams,
	setTeamSettingsModal,
	loading,
	setTeamInfo,
	setSdId,
	setSdName,
}) => {
	const firstElementInTheFirst = array => {
		let copied = [...(array || [])];
		return copied?.sort((info, b) => (info.name === "Admin" ? -1 : 1));
	};

	return (
		<div className={styles.teamsContainer}>
			{loading
				? [...Array(12).keys()].map(key => (
						<Skeleton key={key} className={styles.placeholderCard} />
				  ))
				: firstElementInTheFirst(teams)
						?.filter(teamInfo => teamInfo.sd_id !== "admin")
						?.map(teamInfo => (
							<TeamCard
								key={teamInfo.sd_id}
								info={teamInfo}
								openTeamSettings={() => {
									setTeamSettingsModal(true);
									setTeamInfo(teamInfo);
								}}
								setSdId={setSdId}
								setSdName={setSdName}
							/>
						))}
		</div>
	);
};

TeamCardsList.defaultProps = {
	loading: false,
};

export default TeamCardsList;
