import { useState, useEffect } from "react";
import { DEFAULT_IT_FIELDS_STRUCT, VIEWS } from "../../constants";
import styles from "./DNDView.module.scss";
import RingoverFields from "./components/RingoverFields/RingoverFields";
import IntegrationFields from "./components/IntegrationFields/IntegrationFields";
import { TabNavSlider } from "@cadence-frontend/widgets";
import { TabNavThemes } from "@cadence-frontend/themes";
import { PERSON_ORGANIZATION } from "./constants";
import { DragDropContext } from "react-beautiful-dnd";
import { useSettings, useExtensionFieldMap } from "@cadence-frontend/data-access";
import {
	ParseRingoverFields,
	UnParseRingoverFields,
	validateFields,
	checkIfChanges,
} from "../../utils";
import { useContext } from "react";
import { MessageContext } from "@cadence-frontend/contexts";
import WarningModal from "./components/WarningModal/WarningModal";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";

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
		fetchOrganizationPdFieldsMutate,
		fetchPersonPdFieldsMutate,
		fetchRingoverFieldsMutate,
		//loading states
		fetchOrganizationPdFieldsLoading,
		fetchPersonPdFieldsLoading,
	} = useSettings({ enabled: false });
	const {
		extensionFieldMaps,
		updateAllExtensionFieldMaps,
		fetchExtensionFieldMapsLoading,
	} = useExtensionFieldMap(true);

	const { addError, addSuccess } = useContext(MessageContext);

	const [warningModal, setWarningModal] = useState(DEFAULT_IT_FIELDS_STRUCT);
	const [selectedField, setSelectedField] = useState(null);
	const user = useRecoilValue(userInfo);

	//integration type field states
	const [originalItFields, setOriginalItFields] = useState(DEFAULT_IT_FIELDS_STRUCT);
	const [availableItFields, setAvailableItFields] = useState(DEFAULT_IT_FIELDS_STRUCT);
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
		fetchItFields();
	}, []);

	//useEffect to update originalItFields dep-> 3 fetch APIs
	const fetchItFields = () => {
		fetchPersonPdFieldsMutate(VIEWS.PERSON, {
			onSuccess: pdFieldsFromServer => {
				const emailFieldFromPd = pdFieldsFromServer.filter(
					(field, i) => field.name === "email"
				)?.[0];
				const phoneFieldFromPd = pdFieldsFromServer.filter(
					(field, i) => field.name === "phone"
				)?.[0];
				let errorFields = [];
				if (!emailFieldFromPd) {
					errorFields.push("email");
				}
				if (!phoneFieldFromPd) {
					errorFields.push("phone_number");
				}
				if (errorFields.length !== 0)
					addError({
						text: `Missing fields in pipedrive from your account: ${errorFields.join(
							", "
						)}`,
					});

				setRingoverFields(prev => ({
					...prev,
					[VIEWS.PERSON]: prev[VIEWS.PERSON].map(f => {
						if (f.uid === "__p_email" && emailFieldFromPd) {
							f.value = emailFieldFromPd;
						}
						if (f.uid === "__p_phone_number" && phoneFieldFromPd) {
							f.value = phoneFieldFromPd;
						}
						return f;
					}),
				}));

				setOriginalItFields(prev => ({
					...prev,
					[VIEWS.PERSON]: pdFieldsFromServer?.map((field, i) => ({ index: i, ...field })), //will have name, type, picklistVlaues(conditionally)
				}));
			},
		});
		fetchOrganizationPdFieldsMutate(VIEWS.ORGANIZATION, {
			onSuccess: pdFieldsFromServer => {
				setOriginalItFields(prev => ({
					...prev,
					[VIEWS.ORGANIZATION]: pdFieldsFromServer?.map((field, i) => ({
						index: i,
						...field,
					})), //will have name, type, picklistVlaues(conditionally)
				}));
			},
		});
	};

	//useEffect to update availbaleSFField state from dep-> ringoverFields, originalFields fetch API
	useEffect(() => {
		setAvailableItFields({
			[VIEWS.ORGANIZATION]: originalItFields[VIEWS.ORGANIZATION].filter(
				item =>
					ringoverFields[VIEWS.ORGANIZATION].filter(
						field => field.value.name === item.name
					).length === 0
			),
			[VIEWS.PERSON]: originalItFields[VIEWS.PERSON].filter(
				item =>
					ringoverFields[VIEWS.PERSON].filter(field => field.value.name === item.name)
						.length === 0
			),
		});
	}, [ringoverFields, originalItFields]);

	//send update request to server for currentView with its corresponding state ||| back to array ||| Parse Fn
	const updateRingoverFields = ({ cb }) => {
		const warnings = validateFields(ringoverFields);
		if (warnings[VIEWS.ORGANIZATION].length + warnings[VIEWS.PERSON].length === 0) {
			//if no warnings are there
			const body = {
				person_map: UnParseRingoverFields(ringoverFields[VIEWS.PERSON]),
				organization_map: UnParseRingoverFields(ringoverFields[VIEWS.ORGANIZATION]),
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
					setOriginalRingoverFieldsResponse(body);
					addSuccess("Fields are saved");
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
		if (e.destination.droppableId === e.source.droppableId) return; //it->it case handled
		//ids need to be parsed cz they are stringified
		//firstly we get the updated values of the draggableSFNode by filtering it from SF Fields, (helps in determining type of the dragging node)
		const draggableData =
			originalItFields[currentView].filter(
				oit => oit.name === JSON.parse(e.draggableId).name
			)?.[0] ?? {};
		const sourceData = JSON.parse(e.source.droppableId);
		const destinationData = JSON.parse(e.destination.droppableId);
		//data is an object {type:"",name:''/label:''...}
		if (sourceData.type === "it") {
			//it->ringover case handled
			if (!destinationData.type.includes(draggableData.type)) {
				addError({
					text: `Please drag a field of type: ${destinationData.type.join(", ")}`,
				});
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
		} else if (destinationData.type === "it") {
			//ringover->it-case handled
			setRingoverFields(prev => ({
				...prev,
				[currentView]: prev[currentView].map((item, index) => {
					if (item.label === sourceData.label) {
						item.value = { name: "" };
					}
					return item;
				}),
			}));
		} else if (sourceData.type !== "it" && destinationData.type !== "it") {
			//ringover->ringover case
			//swapringoverFields (not implemented yet)
			if (!destinationData.type.includes(draggableData.type)) {
				addError({
					text: `Please drag a field of type: ${destinationData.type.join(", ")}`,
				});
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
				destination: { droppableId: JSON.stringify({ type: "it" }) },
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

	return (
		<div className={styles.DNDView}>
			{(currentView === VIEWS.PERSON || currentView === VIEWS.ORGANIZATION) && (
				<div className={styles.header}>
					<TabNavSlider
						theme={TabNavThemes.SLIDER}
						buttons={PERSON_ORGANIZATION.map(opt => ({
							label: opt.label[user?.language?.toUpperCase()],
							value: opt.value,
						}))}
						value={currentView}
						setValue={setCurrentView}
						activeBtnClassName={styles.activeTab}
						btnClassName={styles.tabBtn}
						width="250px"
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
						loading={fetchOrganizationPdFieldsLoading || fetchPersonPdFieldsLoading}
						setCurrentlyHovered={setCurrentlyHovered}
						setSelectedField={setSelectedField}
						selectedField={selectedField}
						originalItFieldsForCurrentView={originalItFields[currentView]}
						currentView={currentView}
						copyFieldsFromFieldMap={copyFieldsFromFieldMap}
					/>
					<IntegrationFields
						availableItFields={availableItFields[currentView]}
						loading={
							fetchOrganizationPdFieldsLoading ||
							fetchPersonPdFieldsLoading ||
							fetchExtensionFieldMapsLoading
						}
					/>
				</div>
			</DragDropContext>
			<WarningModal modal={warningModal} setModal={setWarningModal} />
		</div>
	);
};

export default DNDView;
