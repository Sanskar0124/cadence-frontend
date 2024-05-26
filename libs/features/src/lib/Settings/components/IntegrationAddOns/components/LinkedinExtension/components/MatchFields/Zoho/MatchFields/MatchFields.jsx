import React, { useState, useEffect } from "react";
import TopView from "./components/TopView/TopView";
import { VIEWS, DEFAULT_TOPVIEW_DATA, RINGOVER_FIELDS, CUSTOM_OBJECT } from "./constants";
import styles from "./MatchFields.module.scss";

import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue } from "recoil";
import { useCustomObject, useSettings } from "@cadence-frontend/data-access";
import DNDView from "./components/DNDView/DNDView";
import { ParseRingoverFields } from "./utils";

const MatchFields = ({
	setPostData,
	postDataRef,
	setDisableNext,
	setIfUnsavedChanges,
	showSave,
	handleSave,
}) => {
	const [currentView, setCurrentView] = useState(VIEWS.LEAD);
	const [currentlyHovered, setCurrentlyHovered] = useState([]);
	const [topViewData, setTopViewData] = useState(DEFAULT_TOPVIEW_DATA);

	const [ringoverFields, setRingoverFields] = useState(RINGOVER_FIELDS);
	const [originalRingoverFieldsResponse, setOriginalRingoverFieldsResponse] =
		useState(RINGOVER_FIELDS);
	const user = useRecoilValue(userInfo);
	const [buildFormFor, setBuildFormFor] = useState("lead");
	const [formCount, setFormCount] = useState(0);
	const [customObject, setCustomObject] = useState(CUSTOM_OBJECT);
	const [buttonText, setButtonText] = useState(
		COMMON_TRANSLATION.QUALIFICATION[user?.language?.toUpperCase()]
	);

	const { customObj } = useCustomObject(true);
	const { fetchRingoverFieldsMutateExtension } = useSettings({ enabled: false });

	useEffect(() => {
		setCustomObject({
			[VIEWS.LEAD]: customObj?.lead_custom_object,
			[VIEWS.CONTACT]: customObj?.contact_custom_object,
		});

		setFormCount(
			(customObj?.lead_custom_object !== null &&
				customObj?.lead_custom_object[0].form.length !== 0) +
				(customObj?.contact_custom_object !== null &&
					customObj?.contact_custom_object[0].form.length !== 0) +
				0
		);
	}, [customObj]);

	useEffect(() => {
		if (customObject[buildFormFor] && customObject[buildFormFor].length !== 0) {
			setButtonText(customObject[buildFormFor][0]?.button_text);
		} else {
			setButtonText(COMMON_TRANSLATION.QUALIFICATION[user?.language?.toUpperCase()]);
		}
	}, [customObject]);
	//useEffect to update TopViewData
	useEffect(() => {
		setTopViewData({
			[VIEWS.LEAD]: ringoverFields[VIEWS.LEAD]?.filter(item => item.value?.name !== "")
				.length,
			[VIEWS.ACCOUNT]: ringoverFields[VIEWS.ACCOUNT]?.filter(
				item => item.value?.name !== ""
			).length,
			[VIEWS.CONTACT]: ringoverFields[VIEWS.CONTACT]?.filter(
				item => item.value?.name !== ""
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
					showSave={showSave}
					handleSave={handleSave}
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
						buildFormFor={buildFormFor}
						buttonText={buttonText}
					/>
				</div> */}

				<div className={styles.dndView}>
					<DNDView
						currentView={currentView}
						setCurrentView={setCurrentView}
						currentlyHovered={currentlyHovered}
						setCurrentlyHovered={setCurrentlyHovered}
						setDisableNext={setDisableNext}
						postDataRef={postDataRef}
						setPostData={setPostData}
						ringoverFields={ringoverFields}
						setRingoverFields={setRingoverFields}
						setIfUnsavedChanges={setIfUnsavedChanges}
						originalRingoverFieldsResponse={originalRingoverFieldsResponse}
						setOriginalRingoverFieldsResponse={setOriginalRingoverFieldsResponse}
					/>
				</div>
			</div>
		</div>
	);
};

export default MatchFields;
