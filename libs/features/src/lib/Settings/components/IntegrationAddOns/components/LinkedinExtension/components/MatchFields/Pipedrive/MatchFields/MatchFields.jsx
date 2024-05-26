import { useEffect, useState } from "react";
import DNDView from "./components/DNDView/DNDView";
import TopView from "./components/TopView/TopView";
import { DEFAULT_TOPVIEW_DATA, RINGOVER_FIELDS, VIEWS } from "./constants";
import styles from "./MatchFields.module.scss";

//components

//constants

const MatchFields = ({ setPostData, setDisableNext, setIfUnsavedChanges }) => {
	//setIfUnsavedChanges is a state which contains a function which when ran tells if there are unsaved changes for the fields
	const [currentView, setCurrentView] = useState(VIEWS.PERSON);
	const [currentlyHovered, setCurrentlyHovered] = useState([]);
	const [topViewData, setTopViewData] = useState(DEFAULT_TOPVIEW_DATA);
	const [ringoverFields, setRingoverFields] = useState(RINGOVER_FIELDS);
	const [formCount, setFormCount] = useState(0);

	//useEffect to update TopViewData
	useEffect(() => {
		setTopViewData({
			[VIEWS.ORGANIZATION]: ringoverFields[VIEWS.ORGANIZATION].filter(
				item => item.value.name !== ""
			).length,
			[VIEWS.PERSON]: ringoverFields[VIEWS.PERSON].filter(item => item.value.name !== "")
				.length,
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
