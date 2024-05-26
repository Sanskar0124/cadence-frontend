import React, { useState, useEffect } from "react";
import TopView from "./components/TopView/TopView";
import { VIEWS, DEFAULT_TOPVIEW_DATA, RINGOVER_FIELDS, CUSTOM_OBJECT } from "./constants";
import styles from "./MatchFields.module.scss";

import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue } from "recoil";
import { useSettings } from "@cadence-frontend/data-access";
import QuickView from "./components/QuickView/QuickView";
import DNDView from "./components/DNDView/DNDView";
import CustomObjectsView from "./components/CustomObjectsView/CustomObjectsView";
import { ParseRingoverFields } from "./utils";
import { useQuery } from "@cadence-frontend/utils";

const MatchFields = ({ setPostData, setDisableNext, setIfUnsavedChanges }) => {
	const query = useQuery();
	const current_view = query.get("current_view");
	const [currentView, setCurrentView] = useState(VIEWS.LEAD);
	const [prevCurrentView, setPreviousCurrentView] = useState(null);
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
	const { fetchRingoverFieldsMutateExtension } = useSettings({ enabled: false });

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
			[VIEWS.CANDIDATE]: ringoverFields[VIEWS.CANDIDATE]?.filter(
				item => item.value?.name !== ""
			).length,
		});
	}, [ringoverFields]);

	useEffect(() => {
		if (current_view) {
			setCurrentView(current_view);
			setBuildFormFor(current_view);
		}
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
		<div className={`${styles.matchFields}`}>
			<div className={styles.header}>
				<TopView
					currentView={currentView}
					setCurrentView={setCurrentView}
					topViewData={topViewData}
					formCount={formCount}
					isOnboarding={false}
					prevCurrentView={prevCurrentView}
					setPreviousCurrentView={setPreviousCurrentView}
				/>
			</div>

			<div className={styles.body}>
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
					setPreviousCurrentView={setPreviousCurrentView}
					prevCurrentView={prevCurrentView}
				/>
			</div>
		</div>
	);
};

export default MatchFields;
