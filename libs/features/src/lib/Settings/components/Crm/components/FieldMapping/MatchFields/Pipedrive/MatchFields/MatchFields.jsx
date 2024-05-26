import { useState, useEffect } from "react";
import { DEFAULT_TOPVIEW_DATA, RINGOVER_FIELDS, VIEWS, CUSTOM_OBJECT } from "./constants";
import styles from "./MatchFields.module.scss";
import QuickView from "./components/QuickView/QuickView";
import DNDView from "./components/DNDView/DNDView";
import { Colors, useQuery } from "@cadence-frontend/utils";
import TopView from "./components/TopView/TopView";
import CustomObjectsView from "./components/CustomObjectsView/CustomObjectsView";
import { useCustomObject, useSettings } from "@cadence-frontend/data-access";
import { ParseRingoverFields, checkIfChanges } from "./utils";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
//components

//constants

const MatchFields = ({
	postDataRef,
	setDisableNext,
	setIfUnsavedChanges,
	isOnboarding,
	setSaveBtnLoading,
}) => {
	const query = useQuery();
	const current_view = query.get("current_view");
	//setIfUnsavedChanges is a state which contains a function which when ran tells if there are unsaved changes for the fields
	const [currentView, setCurrentView] = useState(VIEWS.PERSON);
	const [currentlyHovered, setCurrentlyHovered] = useState([]);
	const [topViewData, setTopViewData] = useState(DEFAULT_TOPVIEW_DATA);
	const [ringoverFields, setRingoverFields] = useState(RINGOVER_FIELDS);
	const [originalRingoverFieldsResponse, setOriginalRingoverFieldsResponse] =
		useState(RINGOVER_FIELDS);
	const [formCount, setFormCount] = useState(0);
	const user = useRecoilValue(userInfo);
	const [customObject, setCustomObject] = useState(CUSTOM_OBJECT);
	const [buttonText, setButtonText] = useState("Qualification");
	const { customObj } = useCustomObject(true);
	const { fetchRingoverFieldsMutate } = useSettings({ enabled: false });

	useEffect(() => {
		setCustomObject({
			[VIEWS.PERSON]: customObj?.person_custom_object,
		});

		setFormCount(
			(customObj?.person_custom_object != null &&
				customObj?.person_custom_object[0].form.length !== 0) + 0
		);
	}, [customObj]);

	useEffect(() => {
		if (customObject[VIEWS.PERSON] && customObject[VIEWS.PERSON].length !== 0) {
			setButtonText(customObject[VIEWS.PERSON][0]?.button_text);
		} else {
			setButtonText(COMMON_TRANSLATION.QUALIFICATION[user?.language?.toUpperCase()]);
		}
	}, [customObject]);

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

	useEffect(() => {
		if (current_view) {
			setCurrentView(current_view);
		}
		fetchRingoverFields();
	}, []);

	// check if there are any changes
	useEffect(() => {
		if (typeof setIfUnsavedChanges === "function")
			setIfUnsavedChanges(
				() => () => checkIfChanges(ringoverFields, originalRingoverFieldsResponse)
			);
	}, [ringoverFields, originalRingoverFieldsResponse]);

	const fetchRingoverFields = () => {
		fetchRingoverFieldsMutate(null, {
			onSuccess: ringoverFieldsFromServer => {
				setOriginalRingoverFieldsResponse(ringoverFieldsFromServer);
				setRingoverFields(ParseRingoverFields(ringoverFieldsFromServer));
			},
		});
	};

	return (
		<div className={`${styles.matchFields} ${isOnboarding ? styles.isOnboarding : ""}`}>
			<div className={styles.header}>
				<TopView
					currentView={currentView}
					setCurrentView={setCurrentView}
					topViewData={topViewData}
					formCount={formCount}
					isOnboarding={isOnboarding}
				/>
			</div>
			<div className={styles.body}>
				<div className={styles.quickView}>
					<QuickView
						currentView={currentView}
						setCurrentView={setCurrentView}
						currentlyHovered={currentlyHovered}
						setCurrentlyHovered={setCurrentlyHovered}
						ringoverFields={ringoverFields}
						buttonText={buttonText}
					/>
				</div>
				<div className={styles.dndView}>
					{currentView === VIEWS.CUSTOM_OBJECTS ? (
						<CustomObjectsView
							customObject={customObject}
							setCustomObject={setCustomObject}
							buttonText={buttonText}
							setButtonText={setButtonText}
						/>
					) : (
						<DNDView
							currentView={currentView}
							setCurrentView={setCurrentView}
							currentlyHovered={currentlyHovered}
							setCurrentlyHovered={setCurrentlyHovered}
							setDisableNext={setDisableNext}
							postDataRef={postDataRef}
							ringoverFields={ringoverFields}
							setRingoverFields={setRingoverFields}
							setIfUnsavedChanges={setIfUnsavedChanges}
							originalRingoverFieldsResponse={originalRingoverFieldsResponse}
							setOriginalRingoverFieldsResponse={setOriginalRingoverFieldsResponse}
							isOnboarding={isOnboarding}
							setSaveBtnLoading={setSaveBtnLoading}
						/>
					)}
				</div>
			</div>
		</div>
	);
};

export default MatchFields;
