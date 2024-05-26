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
	const { fetchRingoverFieldsMutate } = useSettings({ enabled: false });

	useEffect(() => {
		setCustomObject({
			[VIEWS.CONTACT]: customObj?.contact_custom_object,
		});

		setFormCount(
			(customObj?.contact_custom_object != null &&
				customObj?.contact_custom_object?.form.length !== 0) + 0
		);
	}, [customObj]);

	useEffect(() => {
		if (
			customObject[VIEWS.CONTACT] &&
			Object.keys(customObject[VIEWS.CONTACT])?.length !== 0
		) {
			setButtonText(customObject[VIEWS.CONTACT]?.button_text);
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
