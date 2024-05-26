import React, { useState, useContext, useEffect } from "react";
import styles from "./DNDView.module.scss";
import { TabNavThemes } from "@cadence-frontend/themes";
import { CONTACT_ACCOUNT, LEAD_ACCOUNT } from "./constants";
import { DEFAULT_SF_FIELDS_STRUCT, DEFAULT_VALUES, VIEWS } from "../../constants";
import { DragDropContext } from "react-beautiful-dnd";

import { LOCAL_STORAGE_KEYS } from "@cadence-frontend/constants";
import { useSettings, useExtensionFieldMap } from "@cadence-frontend/data-access";
import { MessageContext } from "@cadence-frontend/contexts";
import RingoverFields from "./components/RingoverFields/RingoverFields";
import BullhornFields from "./components/BullhornFields/BullhornFields";

import {
	ParseRingoverFields,
	UnParseRingoverFields,
	checkIfChanges,
	validateFields,
} from "../../utils";
import WarningModal from "./components/WarningModal/WarningModal";
import { TabNavSlider } from "@cadence-frontend/widgets";

const DNDView = ({
	currentView,
	setCurrentView,
	ringoverFields,
	setRingoverFields,
	currentlyHovered,
	setCurrentlyHovered,
	setDisableNext,
	setPostData,
	setIfUnsavedChanges,
	originalRingoverFieldsResponse,
	setOriginalRingoverFieldsResponse,
	setPreviousCurrentView,
	prevCurrentView,
}) => {
	const {
		fetchLeadFieldsMutate,
		fetchAccountFieldsMutate,
		fetchContactSfFieldsMutate,
		fetchCondidateSfFieldsApi,
		fetchRingoverFieldsMutate,
		//loading states
		fetchLeadSfFieldsLoading,
		fetchAccountSfFieldsLoading,
		fetchContactSfFieldsLoading,
		fetchCondidateFieldsLoading,
	} = useSettings({ enabled: false });
	const { updateAllExtensionFieldMaps, updateAllExtensionFieldMapsLoading } =
		useExtensionFieldMap(true);

	const { addError, addSuccess } = useContext(MessageContext);
	const [warningModal, setWarningModal] = useState(DEFAULT_SF_FIELDS_STRUCT);
	const [selectedField, setSelectedField] = useState(null);

	//Bullhorn field states
	const [originalSFFields, setOriginalSFFields] = useState(DEFAULT_SF_FIELDS_STRUCT);
	const [availableSFFields, setAvailableSFFields] = useState(DEFAULT_SF_FIELDS_STRUCT);

	//useEffect to disableNext
	useEffect(() => {
		setDisableNext(updateAllExtensionFieldMapsLoading);
	}, [updateAllExtensionFieldMapsLoading]);

	useEffect(() => {
		fetchZFields();
	}, []);
	//useEffect to update originalSFFields dep-> 3 fetch APIs
	const fetchZFields = () => {
		fetchLeadFieldsMutate(VIEWS.LEAD, {
			onSuccess: sfFieldsFromServer => {
				setDefaultFieldsWhileOnboarding(sfFieldsFromServer, VIEWS.LEAD);
				setOriginalSFFields(prev => ({
					...prev,
					[VIEWS.LEAD]: sfFieldsFromServer
						?.sort((a, b) => a.label?.localeCompare(b.label))
						?.map((field, i) => ({ index: i, ...field })), //will have name, type, picklistVlaues(conditionally)
				}));
			},
			onError: () => addError({ text: "Make sure you have signed in with Bullhorn." }),
		});
		fetchContactSfFieldsMutate(VIEWS.CONTACT, {
			onSuccess: sfFieldsFromServer => {
				setDefaultFieldsWhileOnboarding(sfFieldsFromServer, VIEWS.CONTACT);
				setOriginalSFFields(prev => ({
					...prev,
					[VIEWS.CONTACT]: sfFieldsFromServer
						?.sort((a, b) => a.label?.localeCompare(b.label))
						?.map((field, i) => ({ index: i, ...field })), //will have name, type, picklistVlaues(conditionally)
				}));
			},
		});
		fetchAccountFieldsMutate(VIEWS.ACCOUNT, {
			onSuccess: sfFieldsFromServer => {
				setDefaultFieldsWhileOnboarding(sfFieldsFromServer, VIEWS.ACCOUNT);
				setOriginalSFFields(prev => ({
					...prev,
					[VIEWS.ACCOUNT]: sfFieldsFromServer
						?.sort((a, b) => a.label?.localeCompare(b.label))
						?.map((field, i) => ({ index: i, ...field })), //will have name, type, picklistVlaues(conditionally)
				}));
			},
		});
		fetchCondidateSfFieldsApi(VIEWS.CANDIDATE, {
			onSuccess: sfFieldsFromServer => {
				setDefaultFieldsWhileOnboarding(sfFieldsFromServer, VIEWS.CANDIDATE);
				setOriginalSFFields(prev => ({
					...prev,
					[VIEWS.CANDIDATE]: sfFieldsFromServer
						?.sort((a, b) => a.label?.localeCompare(b.label))
						?.map((field, i) => ({ index: i, ...field })), //will have name, type, picklistVlaues(conditionally)
				}));
			},
		});
	};

	const setDefaultFieldsWhileOnboarding = (sfFieldsFromServer, view) => {
		if (!["onboarding", "reconfigure"].includes(window.location.pathname.split("/")[2]))
			return;
		if (localStorage.getItem(LOCAL_STORAGE_KEYS.FIELD_MAP_DEFAULT_SET) === true) return;

		let defaultFields = [];

		sfFieldsFromServer.forEach(sf => {
			if (Object.values(DEFAULT_VALUES[view]).includes(sf.name)) defaultFields.push(sf);
		});

		setRingoverFields(prev => ({
			...prev,
			[view]: prev[view].map(f => {
				if (
					Object.keys(DEFAULT_VALUES[view]).includes(f.uid) &&
					defaultFields.find(df => df.name === DEFAULT_VALUES[view][f.uid])
				) {
					f.value = defaultFields.find(df => df.name === DEFAULT_VALUES[view][f.uid]);
				}
				return f;
			}),
		}));
	};

	//useEffect to update availbaleSFField state from dep-> ringoverFields, originalFields fetch API
	useEffect(() => {
		setAvailableSFFields({
			[VIEWS.ACCOUNT]: originalSFFields[VIEWS.ACCOUNT]?.filter(
				item =>
					ringoverFields[VIEWS.ACCOUNT]?.filter(field => field.value?.name === item.name)
						.length === 0
			),
			[VIEWS.CONTACT]: originalSFFields[VIEWS.CONTACT]?.filter(
				item =>
					ringoverFields[VIEWS.CONTACT]?.filter(field => field.value?.name === item.name)
						.length === 0
			),
			[VIEWS.LEAD]: originalSFFields[VIEWS.LEAD]?.filter(
				item =>
					ringoverFields[VIEWS.LEAD]?.filter(field => field.value?.name === item.name)
						.length === 0
			),
			[VIEWS.CANDIDATE]: originalSFFields[VIEWS.CANDIDATE]?.filter(
				item =>
					ringoverFields[VIEWS.CANDIDATE]?.filter(
						field => field.value?.name === item.name
					).length === 0
			),
		});
	}, [ringoverFields, originalSFFields]);

	//send update request to server for currentView with its corresponding state ||| back to array ||| Parse Fn
	const updateRingoverFields = ({ cb }) => {
		const warnings = validateFields(ringoverFields);

		if (
			warnings[VIEWS.LEAD].length +
				warnings[VIEWS.ACCOUNT].length +
				warnings[VIEWS.CONTACT].length +
				warnings[VIEWS.CANDIDATE].length ===
			0
		) {
			//if no warnings are there

			const lead = UnParseRingoverFields(ringoverFields[VIEWS.LEAD]);
			const contact = UnParseRingoverFields(ringoverFields[VIEWS.CONTACT]);
			const account = UnParseRingoverFields(ringoverFields[VIEWS.ACCOUNT]);
			const candidate = UnParseRingoverFields(ringoverFields[VIEWS.CANDIDATE]);
			// delete contact["variables"];
			delete lead["disqualification_reason"];
			// delete lead["variables"];
			// delete account["variables"];
			delete account["disqualification_reason"];

			const body = {
				lead_map: lead,
				contact_map: contact,
				account_map: account,
				candidate_map: candidate,
			};

			updateAllExtensionFieldMaps(body, {
				onError: err => {
					addError({
						text: err?.message,
						desc: err?.response?.data?.error || "Please contact support",
						cId: err?.response?.data?.correlationId,
					});
				},
				onSuccess: () => {
					addSuccess("Fields are saved");
					setOriginalRingoverFieldsResponse(body);
					//If the user is onboarding and saved field mapping then this value will be used to avoid inserting default values as it is saved once
					if (window.location.pathname.includes("onboarding"))
						localStorage.setItem(LOCAL_STORAGE_KEYS.FIELD_MAP_DEFAULT_SET, true);
					cb();
				},
			});
		} else {
			setWarningModal(warnings);
		}
	};
	//useEffect to save fields before doing next
	useEffect(() => {
		// postDataRef.current = updateRingoverFields; //updateRingoverFields receives a callback to run handleNext from stepper
		setPostData(() => updateRingoverFields);
	}, [ringoverFields, currentView]);

	//handle all drag n drop events
	const handleDragEnd = e => {
		if (!e.destination) return;
		if (e.destination.droppableId === e.source.droppableId) return; //sf->sf case handled
		//ids need to be parsed cz they are stringified
		//firstly we get the updated values of the draggableSFNode by filtering it from SF Fields, (helps in determining type of the dragging node)
		const draggableData =
			originalSFFields[currentView].filter(
				osf => osf.name === JSON.parse(e.draggableId).name
			)?.[0] ?? {};
		const sourceData = JSON.parse(e.source.droppableId);
		const destinationData = JSON.parse(e.destination.droppableId);
		//data is an object {type:"",name:''/label:''...}
		if (sourceData.type === "sf") {
			//sf->ringover case handled
			if (!destinationData.type.includes(draggableData.type)) {
				addError({ text: `Please drag a field of type "${destinationData.type}"` });
			} else {
				setRingoverFields(prev => ({
					...prev,
					[currentView]: prev[currentView].map(item => {
						if (item.label === destinationData.label) {
							item.value = draggableData; //draggableData is a object {name:"",type:"",...}
						}
						return item;
					}),
				}));
			}
		} else if (destinationData.type === "sf") {
			//ringover->sf-case handled
			setRingoverFields(prev => ({
				...prev,
				[currentView]: prev[currentView].map((item, index) => {
					if (item.label === sourceData.label) {
						item.value = { name: "" };
					}
					return item;
				}),
			}));
		} else if (sourceData.type !== "sf" && destinationData.type !== "sf") {
			//ringover->ringover case
			//swapringoverFields (not implemented yet)
			if (!destinationData.type.includes(draggableData.type)) {
				addError({ text: `Please drag a field of type "${destinationData.type}"` });
			} else {
				setRingoverFields(prev => ({
					...prev,
					[currentView]: prev[currentView].map((item, index) => {
						if (item.label === sourceData.label) {
							item.value = { name: "" }; //initialized back to original value in constants
						} else if (item.label === destinationData.label) {
							item.value = draggableData;
						}
						return item;
					}),
				}));
			}
		}
	};

	//handle window events for selected fields
	const handleKeyDown = e => {
		if ((e.code === "Delete" || e.code === "Backspace") && selectedField?.value) {
			//delete that field from matched ringoverField
			//for this we can just trigger our onDragEnd fn passing values in correct format
			handleDragEnd({
				source: {
					droppableId: JSON.stringify({
						type: selectedField.type,
						label: selectedField.label,
					}),
				},
				destination: { droppableId: JSON.stringify({ type: "sf" }) },
				draggableId: JSON.stringify(selectedField.value),
			});
		}
	};

	useEffect(() => {
		window.addEventListener("keyup", handleKeyDown);
		return () => {
			window.removeEventListener("keyup", handleKeyDown);
		};
	}, [selectedField]);

	// check if there are any changes
	useEffect(() => {
		if (typeof setIfUnsavedChanges === "function")
			setIfUnsavedChanges(
				() => () => checkIfChanges(ringoverFields, originalRingoverFieldsResponse)
			);
	}, [ringoverFields, originalRingoverFieldsResponse]);

	const copyFieldsFromFieldMap = () => {
		fetchRingoverFieldsMutate(null, {
			onSuccess: ringoverFieldsFromServer => {
				setRingoverFields(ParseRingoverFields(ringoverFieldsFromServer));
				addSuccess("Default fields mapped");
			},
		});
	};

	const changeCurrentView = value => {
		setPreviousCurrentView(currentView);
		setCurrentView(value);
	};
	return (
		<div className={styles.DNDView}>
			{(currentView === VIEWS.CONTACT ||
				currentView === VIEWS.ACCOUNT ||
				currentView === VIEWS.LEAD) && (
				<div className={styles.header}>
					<TabNavSlider
						theme={TabNavThemes.SLIDER}
						buttons={
							currentView === VIEWS.LEAD
								? LEAD_ACCOUNT
								: currentView === VIEWS.CONTACT
								? CONTACT_ACCOUNT
								: currentView === VIEWS.ACCOUNT && prevCurrentView === VIEWS.LEAD
								? LEAD_ACCOUNT
								: currentView === VIEWS.ACCOUNT && prevCurrentView === VIEWS.CONTACT
								? CONTACT_ACCOUNT
								: LEAD_ACCOUNT
						}
						//buttons={LEAD_ACCOUNT}
						value={currentView}
						setValue={changeCurrentView}
						activeBtnClassName={styles.activeTab}
						btnClassName={styles.tabBtn}
						width="210px"
						noAnimation
					/>
				</div>
			)}

			<DragDropContext onDragEnd={e => handleDragEnd(e)}>
				<div className={styles.body}>
					<BullhornFields
						availableSFFields={availableSFFields[currentView]}
						loading={
							fetchAccountSfFieldsLoading ||
							fetchContactSfFieldsLoading ||
							fetchLeadSfFieldsLoading ||
							fetchCondidateFieldsLoading
						}
					/>

					<RingoverFields
						fields={ringoverFields[currentView]}
						currentView={currentView}
						setFields={val => {
							setRingoverFields(prev => ({
								...prev,
								[currentView]: val,
							}));
						}}
						currentlyHovered={currentlyHovered}
						loading={
							fetchAccountSfFieldsLoading ||
							fetchContactSfFieldsLoading ||
							fetchLeadSfFieldsLoading ||
							fetchCondidateFieldsLoading
						}
						setCurrentlyHovered={setCurrentlyHovered}
						setSelectedField={setSelectedField}
						selectedField={selectedField}
						originalSFFieldsForCurrentView={originalSFFields[currentView]}
						copyFieldsFromFieldMap={copyFieldsFromFieldMap}
					/>
				</div>
			</DragDropContext>
			<WarningModal modal={warningModal} setModal={setWarningModal} />
		</div>
	);
};

export default DNDView;
