import { useState, useEffect, useContext } from "react";

import { useSettings } from "@cadence-frontend/data-access";

import { DEFAULT_TOPVIEW_DATA, RINGOVER_FIELDS, VIEWS } from "./constants";
import { ParseRingoverFields } from "./utils";
import DNDView from "./components/DNDView/DNDView";
import TopView from "./components/TopView/TopView";

import styles from "./MatchFields.module.scss";
import { MessageContext } from "@cadence-frontend/contexts";

const MatchFields = ({ setPostData, setDisableNext, setIfUnsavedChanges }) => {
	const { addSuccess } = useContext(MessageContext);
	//setIfUnsavedChanges is a state which contains a function which when ran tells if there are unsaved changes for the fields
	const [currentView, setCurrentView] = useState(VIEWS.LEAD);
	const [currentlyHovered, setCurrentlyHovered] = useState([]);
	const [topViewData, setTopViewData] = useState(DEFAULT_TOPVIEW_DATA);
	const [ringoverFields, setRingoverFields] = useState(RINGOVER_FIELDS);
	const [formCount, setFormCount] = useState(0);

	//useEffect to update TopViewData
	useEffect(() => {
		setTopViewData({
			[VIEWS.LEAD]: ringoverFields[VIEWS.LEAD].filter(item => item.value.name !== "")
				.length,
			[VIEWS.ACCOUNT]: ringoverFields[VIEWS.ACCOUNT].filter(
				item => item.value.name !== ""
			).length,
			[VIEWS.CONTACT]: ringoverFields[VIEWS.CONTACT].filter(
				item => item.value.name !== ""
			).length,
		});
	}, [ringoverFields]);

	return (
		<div className={styles.matchFields}>
			<div className={styles.header}>
				<TopView
					currentView={currentView}
					setCurrentView={setCurrentView}
					topViewData={topViewData}
					formCount={formCount}
				/>
			</div>
			<div className={styles.body}>
				<div className={styles.dndView}>
					<DNDView
						currentView={currentView}
						setCurrentView={setCurrentView}
						currentlyHovered={currentlyHovered}
						setCurrentlyHovered={setCurrentlyHovered}
						setDisableNext={setDisableNext}
						setPostData={setPostData}
						ringoverFields={ringoverFields}
						setRingoverFields={setRingoverFields}
						setIfUnsavedChanges={setIfUnsavedChanges}
					/>
				</div>
			</div>
		</div>
	);
};

export default MatchFields;
