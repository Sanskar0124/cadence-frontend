import React, { useState, useEffect, useRef } from "react";
import TopView from "./components/TopView/TopView";
import {
	VIEWS,
	DEFAULT_TOPVIEW_DATA,
	RINGOVER_FIELDS,
	CUSTOM_OBJECT,
	LEADS_CURRENT_VIEWS,
} from "./constants";
import styles from "./MatchFields.module.scss";

import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue } from "recoil";
import { useCustomObject, useSettings } from "@cadence-frontend/data-access";
import QuickView from "./components/QuickView/QuickView";
import DNDView from "./components/DNDView/DNDView";
import CustomObjectsView from "./components/CustomObjectsView/CustomObjectsView";
import { ParseRingoverFields } from "./utils";
import { useQuery } from "@cadence-frontend/utils";

const MatchFields = ({
	postDataRef,
	setDisableNext,
	setIfUnsavedChanges,
	showSave,
	handleSave,
	isOnboarding,
	setSaveBtnLoading,
}) => {
	const query = useQuery();
	const current_view = query.get("current_view");
	const [currentView, setCurrentView] = useState(VIEWS.LEAD);
	const [leadsCurrentView, setLeadsCurrentView] = useState(
		LEADS_CURRENT_VIEWS.LEADS_ACCOUNTS
	);
	const [currentlyHovered, setCurrentlyHovered] = useState([]);
	const [topViewData, setTopViewData] = useState(DEFAULT_TOPVIEW_DATA);
	const [ringoverFields, setRingoverFields] = useState(RINGOVER_FIELDS);
	const headingRef = useRef(LEADS_CURRENT_VIEWS.LEADS_ACCOUNTS);

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
	const { fetchRingoverFieldsMutate } = useSettings({ enabled: false });

	useEffect(() => {
		if (!isOnboarding) {
			if (currentView === "lead") headingRef.current = "Account & leads";
			else if (currentView === "contact") headingRef.current = "Account & contacts";
			// else headingRef.current = null;
		}
	}, [currentView]);

	useEffect(() => {
		setCustomObject({
			[VIEWS.LEAD]: customObj?.lead_custom_object,
			[VIEWS.CONTACT]: customObj?.contact_custom_object,
			[VIEWS.CANDIDATE]: customObj?.candidate_custom_object,
		});

		setFormCount(
			(customObj?.lead_custom_object !== null &&
				customObj?.lead_custom_object[0].form.length !== 0) +
				(customObj?.contact_custom_object !== null &&
					customObj?.contact_custom_object[0].form.length !== 0) +
				(customObj?.candidate_custom_object !== null &&
					customObj?.candidate_custom_object[0].form.length !== 0) +
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
		fetchRingoverFieldsMutate(null, {
			onSuccess: ringoverFieldsFromServer => {
				setOriginalRingoverFieldsResponse(ringoverFieldsFromServer);
				setRingoverFields(ParseRingoverFields(ringoverFieldsFromServer));
			},
		});
	};

	const renderMappingConmponent = view => {
		if (view === VIEWS.CUSTOM_OBJECTS) {
			return (
				<CustomObjectsView
					buildFormFor={buildFormFor}
					setBuildFormFor={setBuildFormFor}
					customObject={customObject}
					setCustomObject={setCustomObject}
					buttonText={buttonText}
					setButtonText={setButtonText}
					isOnboarding={isOnboarding}
				/>
			);
		} else {
			return (
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
					leadsCurrentView={leadsCurrentView}
					setLeadsCurrentView={setLeadsCurrentView}
					headingRef={headingRef}
				/>
			);
		}
	};

	return (
		<div className={`${styles.matchFields} ${isOnboarding ? styles.isOnboarding : ""}`}>
			<div className={styles.header}>
				<TopView
					currentView={currentView}
					setCurrentView={setCurrentView}
					topViewData={topViewData}
					formCount={formCount}
					showSave={showSave}
					handleSave={handleSave}
					isOnboarding={isOnboarding}
					leadsCurrentView={leadsCurrentView}
					setLeadsCurrentView={setLeadsCurrentView}
					headingRef={headingRef}
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
						buildFormFor={buildFormFor}
						buttonText={buttonText}
						leadsCurrentView={leadsCurrentView}
						isOnboarding={isOnboarding}
					/>
				</div>

				<div className={styles.dndView}>{renderMappingConmponent(currentView)}</div>
			</div>
		</div>
	);
};

export default MatchFields;
