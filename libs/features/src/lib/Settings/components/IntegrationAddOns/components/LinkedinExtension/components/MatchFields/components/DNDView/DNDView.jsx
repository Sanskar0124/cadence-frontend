import { useState, useEffect } from "react";
import { DEFAULT_SF_FIELDS_STRUCT, RINGOVER_FIELDS, VIEWS } from "../../constants";
import styles from "./DNDView.module.scss";
import RingoverFields from "./components/RingoverFields/RingoverFields";
import SalesforceFields from "./components/SalesforceFields/SalesforceFields";
import { TabNavSlider } from "@cadence-frontend/widgets";
import { TabNavThemes } from "@cadence-frontend/themes";
import { AVAILABLE_SF_FIELDS, CONTACT_ACCOUNT } from "./constants";
import { DragDropContext } from "react-beautiful-dnd";
import { useSettings, useExtensionFieldMap } from "@cadence-frontend/data-access";
import {
	checkIfChanges,
	ParseRingoverFields,
	UnParseRingoverFields,
	validateFields,
} from "../../utils";
import { useContext } from "react";
import { MessageContext } from "@cadence-frontend/contexts";
import WarningModal from "./components/WarningModal/WarningModal";

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
}) => {
	const {
		fetchLeadFieldsMutate,
		fetchAccountFieldsMutate,
		fetchContactSfFieldsMutate,
		//loading states
		fetchLeadSfFieldsLoading,
		fetchAccountSfFieldsLoading,
		fetchContactSfFieldsLoading,
	} = useSettings({ enabled: false });
	const {
		extensionFieldMaps,
		updateAllExtensionFieldMaps,
		fetchExtensionFieldMapsLoading,
	} = useExtensionFieldMap(true);

	const { addError, addSuccess } = useContext(MessageContext);

	const [warningModal, setWarningModal] = useState(DEFAULT_SF_FIELDS_STRUCT);
	const [selectedField, setSelectedField] = useState(null);

	//salesforce field states
	const [originalSFFields, setOriginalSFFields] = useState(DEFAULT_SF_FIELDS_STRUCT);
	const [availableSFFields, setAvailableSFFields] = useState(DEFAULT_SF_FIELDS_STRUCT);
	const [originalRingoverFieldsResponse, setOriginalRingoverFieldsResponse] =
		useState(null);

	useEffect(() => {
		//fetch all ringoverFields and SF Fields ||| P.S emails,phoneNumbers array to be converted to diff fields  ||Unparse Fn
		if (extensionFieldMaps) {
			setOriginalRingoverFieldsResponse(extensionFieldMaps);
			setRingoverFields(ParseRingoverFields(extensionFieldMaps));
		}
	}, [extensionFieldMaps]);

	useEffect(() => {
		fetchSFFields();
	}, []);

	//useEffect to update originalSFFields dep-> 3 fetch APIs
	const fetchSFFields = () => {
		fetchLeadFieldsMutate(VIEWS.LEAD, {
			onSuccess: sfFieldsFromServer => {
				setOriginalSFFields(prev => ({
					...prev,
					[VIEWS.LEAD]: sfFieldsFromServer
						?.sort((a, b) => a.label.localeCompare(b.label))
						?.map((field, i) => ({ index: i, ...field })), //will have name, type, picklistVlaues(conditionally)
				}));
			},
			onError: () => addError({ text: "Make sure you have signed in with salesforce" }),
		});
		fetchContactSfFieldsMutate(VIEWS.CONTACT, {
			onSuccess: sfFieldsFromServer => {
				setOriginalSFFields(prev => ({
					...prev,
					[VIEWS.CONTACT]: sfFieldsFromServer
						?.sort((a, b) => a.label.localeCompare(b.label))
						?.map((field, i) => ({ index: i, ...field })), //will have name, type, picklistVlaues(conditionally)
				}));
			},
		});
		fetchAccountFieldsMutate(VIEWS.ACCOUNT, {
			onSuccess: sfFieldsFromServer => {
				setOriginalSFFields(prev => ({
					...prev,
					[VIEWS.ACCOUNT]: sfFieldsFromServer
						?.sort((a, b) => a.label.localeCompare(b.label))
						?.map((field, i) => ({ index: i, ...field })), //will have name, type, picklistVlaues(conditionally)
				}));
			},
		});
	};

	//useEffect to update availbaleSFField state from dep-> ringoverFields, originalFields fetch API
	useEffect(() => {
		setAvailableSFFields({
			[VIEWS.ACCOUNT]: originalSFFields[VIEWS.ACCOUNT].filter(
				item =>
					ringoverFields[VIEWS.ACCOUNT].filter(field => field.value.name === item.name)
						.length === 0
			),
			[VIEWS.CONTACT]: originalSFFields[VIEWS.CONTACT].filter(
				item =>
					ringoverFields[VIEWS.CONTACT].filter(field => field.value.name === item.name)
						.length === 0
			),
			[VIEWS.LEAD]: originalSFFields[VIEWS.LEAD].filter(
				item =>
					ringoverFields[VIEWS.LEAD].filter(field => field.value.name === item.name)
						.length === 0
			),
		});
	}, [ringoverFields, originalSFFields]);

	//send update request to server for currentView with its corresponding state ||| back to array ||| Parse Fn
	const updateRingoverFields = ({ cb }) => {
		const warnings = validateFields(ringoverFields);
		if (
			warnings[VIEWS.LEAD].length +
				warnings[VIEWS.ACCOUNT].length +
				warnings[VIEWS.CONTACT].length ===
			0
		) {
			//if no warnings are there
			const body = {
				lead_map: UnParseRingoverFields(ringoverFields[VIEWS.LEAD]),
				contact_map: UnParseRingoverFields(ringoverFields[VIEWS.CONTACT]),
				account_map: UnParseRingoverFields(ringoverFields[VIEWS.ACCOUNT]),
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
					cb();
				},
			});
		} else {
			setWarningModal(warnings);
		}
	};

	//useEffect to save fields before doing next
	useEffect(() => {
		setPostData(() => updateRingoverFields); //updateRingoverFields receives a callback to run handleNext from stepper
	}, [ringoverFields, currentView]);

	//handle all drag n drop events
	const handleDragEnd = e => {
		if (!e.destination) return;
		if (e.destination.droppableId === e.source.droppableId) return; //sf->sf case handled
		// ids need to be parsed cz they are stringified
		// firstly we get the updated values of the draggableSFNode by filtering it from SF Fields,
		// (helps in determining type of the dragging node)
		const draggableData =
			originalSFFields[currentView].filter(
				osf => osf.name === JSON.parse(e.draggableId).name
			)?.[0] ?? {};
		const sourceData = JSON.parse(e.source.droppableId);
		const destinationData = JSON.parse(e.destination.droppableId);
		//data is an object {type:"",name:''/label:''...}

		// picklist should only go to picklist
		if (draggableData.type === "picklist" && destinationData.type !== "picklist") {
			addError({ text: `Please drag a field of type "string"` });
			return;
		}

		if (sourceData.type === "sf") {
			//sf->ringover case handled
			if (
				destinationData.type === "picklist" &&
				destinationData.type !== draggableData.type
			) {
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
			if (
				destinationData.type === "picklist" &&
				destinationData.type !== draggableData.type
			) {
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
		setIfUnsavedChanges(
			() => () => checkIfChanges(ringoverFields, originalRingoverFieldsResponse)
		);
	}, [ringoverFields, originalRingoverFieldsResponse]);

	return (
		<div className={styles.DNDView}>
			{(currentView === VIEWS.CONTACT || currentView === VIEWS.ACCOUNT) && (
				<div className={styles.header}>
					<TabNavSlider
						theme={TabNavThemes.SLIDER}
						buttons={CONTACT_ACCOUNT}
						value={currentView}
						setValue={setCurrentView}
						activeBtnClassName={styles.activeTab}
						btnClassName={styles.tabBtn}
						width="210px"
					/>
				</div>
			)}
			<DragDropContext onDragEnd={e => handleDragEnd(e)}>
				<div className={styles.body}>
					<RingoverFields
						fields={ringoverFields[currentView]}
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
							fetchExtensionFieldMapsLoading
						}
						setCurrentlyHovered={setCurrentlyHovered}
						setSelectedField={setSelectedField}
						selectedField={selectedField}
						originalSFFieldsForCurrentView={originalSFFields[currentView]}
						currentView={currentView}
					/>
					<SalesforceFields
						availableSFFields={availableSFFields[currentView]}
						loading={
							fetchAccountSfFieldsLoading ||
							fetchContactSfFieldsLoading ||
							fetchLeadSfFieldsLoading
						}
					/>
				</div>
			</DragDropContext>
			<WarningModal modal={warningModal} setModal={setWarningModal} />
		</div>
	);
};

export default DNDView;
