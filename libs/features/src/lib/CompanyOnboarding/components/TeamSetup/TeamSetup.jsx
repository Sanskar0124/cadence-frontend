import { useState } from "react";
import styles from "./TeamSetup.module.scss";

//components
import Teams from "./Teams/Teams";
import TeamView from "./TeamView/TeamView";

//constants

const TeamSetup = ({ setDisableNext }) => {
	const [teamId, setTeamId] = useState("");

	const [sdName, setSdName] = useState("");

	return (
		<div className={styles.TeamSetup}>
			{teamId === "" ? (
				<Teams setTeamId={setTeamId} setSdName={setSdName} />
			) : (
				<TeamView
					setDisableNext={setDisableNext}
					teamId={teamId}
					setTeamId={setTeamId}
					sdName={sdName}
				/>
			)}
		</div>
	);
};

export default TeamSetup;
