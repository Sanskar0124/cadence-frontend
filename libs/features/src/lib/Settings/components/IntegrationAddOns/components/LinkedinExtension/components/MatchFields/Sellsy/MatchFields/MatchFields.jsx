import { useState, useEffect } from "react";
import { DEFAULT_TOPVIEW_DATA, RINGOVER_FIELDS, VIEWS, CUSTOM_OBJECT } from "./constants";
import styles from "./MatchFields.module.scss";
import QuickView from "./components/QuickView/QuickView";
import DNDView from "./components/LeDNDView/DNDView";
import { Colors } from "@cadence-frontend/utils";
import TopView from "./components/LeTopView/TopView";
import CustomObjectsView from "./components/CustomObjectsView/CustomObjectsView";
import { useCustomObject, useSettings } from "@cadence-frontend/data-access";
import { ParseRingoverFields } from "./utils";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";

//components

//constants

const MatchFields = ({ setPostData, setDisableNext, setIfUnsavedChanges }) => {
	console.log("MATCH FIELD LINKEDIN SELLSY");
	//setIfUnsavedChanges is a state which contains a function which when ran tells if there are unsaved changes for the fields
	const [currentView, setCurrentView] = useState(VIEWS.CONTACT);
	const user = useRecoilValue(userInfo);
	const [currentlyHovered, setCurrentlyHovered] = useState([]);
	const [topViewData, setTopViewData] = useState(DEFAULT_TOPVIEW_DATA);
	const [ringoverFields, setRingoverFields] = useState(RINGOVER_FIELDS);
	const [originalRingoverFieldsResponse, setOriginalRingoverFieldsResponse] =
		useState(RINGOVER_FIELDS);
	const [formCount, setFormCount] = useState(0);
	const [customObject, setCustomObject] = useState(CUSTOM_OBJECT);
	const [buttonText, setButtonText] = useState(
		COMMON_TRANSLATION.QUALIFICATION[user?.language?.toUpperCase()]
	);
	const { customObj } = useCustomObject(true);
	const { fetchRingoverFieldsMutateExtension } = useSettings({ enabled: false });

	useEffect(() => {
		setCustomObject({
			[VIEWS.CONTACT]: customObj?.contact_custom_object,
		});

		setFormCount(
			(customObj?.contact_custom_object != null &&
				customObj?.contact_custom_object.form.length !== 0) + 0
		);
	}, [customObj]);

	useEffect(() => {
		if (customObject[VIEWS.CONTACT] && customObject[VIEWS.CONTACT].length !== 0) {
			setButtonText(customObject[VIEWS.CONTACT][0]?.button_text);
		} else {
			setButtonText("Qualification");
		}
	}, [customObject]);

	//useEffect to update TopViewData
	useEffect(() => {
		setTopViewData({
			[VIEWS.CONTACT]: ringoverFields[VIEWS.CONTACT].filter(
				item => item.value.name !== ""
			).length,
			[VIEWS.COMPANY]: ringoverFields[VIEWS.COMPANY].filter(
				item => item.value.name !== ""
			).length,
		});
	}, [ringoverFields]);

	useEffect(() => {
		fetchRingoverFields();
	}, []);

	const fetchRingoverFields = () => {
		fetchRingoverFieldsMutateExtension(null, {
			onSuccess: ringoverFieldsFromServer => {
				setOriginalRingoverFieldsResponse(ringoverFieldsFromServer);
				setRingoverFields(ParseRingoverFields(ringoverFieldsFromServer));
			},
		});
	};

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
				{/* <div className={styles.quickView}>
					<QuickView
						currentView={currentView}
						setCurrentView={setCurrentView}
						currentlyHovered={currentlyHovered}
						setCurrentlyHovered={setCurrentlyHovered}
						ringoverFields={ringoverFields}
						buttonText={buttonText}
					/>
				</div> */}
				<div className={styles.dndView}>
					{currentView === VIEWS.CUSTOM_OBJECTS ? (
						// <CustomObjectsView
						// 	customObject={customObject}
						// 	setCustomObject={setCustomObject}
						// 	buttonText={buttonText}
						// 	setButtonText={setButtonText}
						// />
						<></>
					) : (
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
							originalRingoverFieldsResponse={originalRingoverFieldsResponse}
							setOriginalRingoverFieldsResponse={setOriginalRingoverFieldsResponse}
						/>
					)}
				</div>
			</div>
		</div>
	);
};

export default MatchFields;
