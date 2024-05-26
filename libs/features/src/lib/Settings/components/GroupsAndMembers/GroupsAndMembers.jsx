import { useCallback, useState, useEffect } from "react";

import Teams from "./Teams/Teams";
import TeamView from "./TeamView/TeamView";

import { VIEW_MODES } from "./constants";

const GroupsAndMembers = () => {
	const [viewMode, setViewMode] = useState(VIEW_MODES.TEAMS);
	const [sdId, setSdId] = useState("");
	const [sdName, setSdName] = useState("");

	useEffect(() => {
		setViewMode(sdId ? VIEW_MODES.TEAM_VIEW : VIEW_MODES.TEAMS);
	}, [sdId]);

	const renderComponent = useCallback(() => {
		switch (viewMode) {
			case VIEW_MODES.TEAMS:
				return (
					<Teams setViewMode={setViewMode} setSdId={setSdId} setSdName={setSdName} />
				);

			case VIEW_MODES.TEAM_VIEW:
				return (
					<TeamView
						setViewMode={setViewMode}
						sdId={sdId}
						setSdId={setSdId}
						sdName={sdName}
					/>
				);

			// default:
			// 	return <Teams />;
		}
	}, [viewMode]);

	return renderComponent();
};

export default GroupsAndMembers;
