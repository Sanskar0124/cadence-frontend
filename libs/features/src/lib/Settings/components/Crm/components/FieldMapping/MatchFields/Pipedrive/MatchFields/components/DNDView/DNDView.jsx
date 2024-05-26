import { useState, useEffect } from "react";
import { DEFAULT_IT_FIELDS_STRUCT, DEFAULT_VALUES, VIEWS } from "../../constants";
import styles from "./DNDView.module.scss";
import RingoverFields from "./components/RingoverFields/RingoverFields";
import IntegrationFields from "./components/IntegrationFields/IntegrationFields";
import { TabNavSlider } from "@cadence-frontend/widgets";
import { TabNavThemes } from "@cadence-frontend/themes";
import { PERSON_ORGANIZATION } from "./constants";
import { DragDropContext } from "react-beautiful-dnd";
import { useSettings } from "@cadence-frontend/data-access";
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
import { LOCAL_STORAGE_KEYS } from "@cadence-frontend/constants";

const DNDView = ({
	currentView,
	setCurrentView,
	ringoverFields,
	setRingoverFields,
	currentlyHovered,
	setCurrentlyHovered,
	setDisableNext,
	postDataRef,
	setIfUnsavedChanges,
	originalRingoverFieldsResponse,
	setOriginalRingoverFieldsResponse,
	isOnboarding,
	setSaveBtnLoading,
}) => {
	const {
		updateRingoverMatchFields,
		fetchOrganizationPdFieldsMutate,
		fetchPersonPdFieldsMutate,
		//loading states
		ringoverMatchFieldsLoading,
		updateRingoverMatchFieldsLoading,
		fetchOrganizationPdFieldsLoading,
		fetchPersonPdFieldsLoading,
	} = useSettings({ enabled: false });
	const { addError, addSuccess } = useContext(MessageContext);
	const [warningModal, setWarningModal] = useState(DEFAULT_IT_FIELDS_STRUCT);
	const [selectedField, setSelectedField] = useState(null);
	const user = useRecoilValue(userInfo);

	//integration type field states
	const [originalItFields, setOriginalItFields] = useState(DEFAULT_IT_FIELDS_STRUCT);
	const [availableItFields, setAvailableItFields] = useState(DEFAULT_IT_FIELDS_STRUCT);

	//useEffect to disableNext
	useEffect(() => {
		setDisableNext(ringoverMatchFieldsLoading || updateRingoverMatchFieldsLoading);
	}, [ringoverMatchFieldsLoading, updateRingoverMatchFieldsLoading]);

	useEffect(() => {
		fetchItFields();
	}, []);

	//fetch SF Fields ||| P.S emails,phoneNumbers array to be converted to diff fields  ||Unparse Fn

	//useEffect to update originalItFields dep-> 3 fetch APIs
	const fetchItFields = () => {
		fetchPersonPdFieldsMutate(VIEWS.PERSON, {
			onSuccess: pdFieldsFromServer => {
				setDefaultFieldsWhileOnboarding(pdFieldsFromServer, VIEWS.PERSON);
				setOriginalItFields(prev => ({
					...prev,
					[VIEWS.PERSON]: pdFieldsFromServer?.map((field, i) => ({ index: i, ...field })), //will have name, type, picklistVlaues(conditionally)
				}));
			},

			onError: err => {
				addError({
					text: err?.response?.data?.msg,
					desc: err?.response?.data?.error,
					cId: err?.response?.data?.correlationId,
				});
			},
		});
		fetchOrganizationPdFieldsMutate(VIEWS.ORGANIZATION, {
			onSuccess: pdFieldsFromServer => {
				setDefaultFieldsWhileOnboarding(pdFieldsFromServer, VIEWS.ORGANIZATION);
				setOriginalItFields(prev => ({
					...prev,
					[VIEWS.ORGANIZATION]: pdFieldsFromServer?.map((field, i) => ({
						index: i,
						...field,
					})), //will have name, type, picklistVlaues(conditionally)
				}));
			},

			onError: err => {
				addError({
					text: err?.response?.data?.msg,
					desc: err?.response?.data?.error,
					cId: err?.response?.data?.correlationId,
				});
			},
		});
	};

	const setDefaultFieldsWhileOnboarding = (pdFieldsFromServer, view) => {
		if (!["onboarding", "reconfigure"].includes(window.location.pathname.split("/")[2]))
			return;
		if (localStorage.getItem(LOCAL_STORAGE_KEYS.FIELD_MAP_DEFAULT_SET) === true) return;

		let defaultFields = [];
		pdFieldsFromServer.forEach(sf => {
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
		setSaveBtnLoading(true);
		const warnings = validateFields(ringoverFields);
		if (warnings[VIEWS.ORGANIZATION].length + warnings[VIEWS.PERSON].length === 0) {
			//if no warnings are there
			const body = {
				person_map: UnParseRingoverFields(ringoverFields[VIEWS.PERSON]),
				organization_map: UnParseRingoverFields(ringoverFields[VIEWS.ORGANIZATION]),
			};

			updateRingoverMatchFields(body, {
				onError: err => {
					addError({
						text: err?.response?.data?.msg,
						desc: err?.response?.data?.error,
						cId: err?.response?.data?.correlationId,
					});
				},
				onSuccess: () => {
					setOriginalRingoverFieldsResponse(body);
					if (window.location.pathname.includes("onboarding"))
						localStorage.setItem(LOCAL_STORAGE_KEYS.FIELD_MAP_DEFAULT_SET, true);
					addSuccess("Fields are saved");
					cb();
				},
				onSettled: () => setSaveBtnLoading(false),
			});
		} else {
			setWarningModal(warnings);
			setSaveBtnLoading(false);
		}
	};

	//useEffect to save fields before doing next
	useEffect(() => {
		postDataRef.current = updateRingoverFields; //updateRingoverFields receives a callback to run handleNext from stepper
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
			} else if (!draggableData.editable && destinationData.label?.includes("Variable")) {
				addError({
					text: "This field cannot be mapped to a custom variable",
					desc: "This field is either read-only or non-editable.",
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
			} else if (!draggableData.editable && destinationData.label?.includes("Variable")) {
				addError({
					text: "This field cannot be mapped to a custom variable",
					desc: "This field is either read-only or non-editable.",
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

	return (
		<div className={styles.DNDView}>
			{(currentView === VIEWS.PERSON || currentView === VIEWS.ORGANIZATION) &&
				isOnboarding && (
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
					<IntegrationFields
						availableItFields={availableItFields[currentView]}
						loading={fetchOrganizationPdFieldsLoading || fetchPersonPdFieldsLoading}
					/>
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
							fetchOrganizationPdFieldsLoading ||
							fetchPersonPdFieldsLoading ||
							ringoverMatchFieldsLoading
						}
						setCurrentlyHovered={setCurrentlyHovered}
						setSelectedField={setSelectedField}
						selectedField={selectedField}
						originalItFieldsForCurrentView={originalItFields[currentView]}
						currentView={currentView}
					/>
				</div>
			</DragDropContext>
			<WarningModal modal={warningModal} setModal={setWarningModal} />
		</div>
	);
};

export default DNDView;
