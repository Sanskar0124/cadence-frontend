import { userInfo } from "@cadence-frontend/atoms";
import { MessageContext } from "@cadence-frontend/contexts";
import { useCSVImportDynamics, useSettings } from "@cadence-frontend/data-access";
import { Close, Document } from "@cadence-frontend/icons";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { ThemedButton } from "@cadence-frontend/widgets";
import { useContext, useEffect, useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import ColumnMapping from "./components/ColumnMapping/ColumnMapping";
import ExtractedColumns from "./components/ExtractedColumns/ExtractedColumns";
import {
	checkIfEmailOrPhone,
	// checkIfEmailOrPhone,
	checkRequired,
	DEFAULT_IT_FIELDS_STRUCT,
	EMAIL_PHONE_FIELDS,
	getFormData,
	getRequiredField,
	parseBody,
	POTENTIAL_FIELDS,
	VIEWS,
} from "./constants";
import styles from "./CsvColumnMap.module.scss";

function CsvColumnMap() {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const cadenceName = searchParams.get("cadence_name");
	const cadenceId = searchParams.get("cadence_id");
	const type = searchParams.get("type");
	const { addError } = useContext(MessageContext);

	const csvImportDynamicsDataAccess = useCSVImportDynamics();
	const {
		postContactsMutation,
		postContactsLoading,
		extractColumns,
		extractColumnsLoading,
	} = csvImportDynamicsDataAccess;

	const user = useRecoilValue(userInfo);

	const {
		fetchSfMap,
		// fetchCompanySellsyFieldsMutate,
		fetchLeadFieldsMutate,
		fetchContactSfFieldsMutate,
		fetchSfMapLoading,
		// fetchCompanySellsyFieldsLoading,
		fetchLeadFieldsLoading,
		fetchContactSfFieldsLoading,
	} = useSettings({
		role: user.role,
		enabled: false,
	});

	//extracted columns state
	const [extractedColumns, setExtractedColumns] = useState([]);
	const [displayedColumns, setDisplayedColumns] = useState([]);

	//company field map data states
	const [leadField, setLeadField] = useState([]);
	const [contactField, setContactField] = useState([]);
	// const [companyField, setCompanyField] = useState([]);
	const [originalItFields, setOriginalItFields] = useState(DEFAULT_IT_FIELDS_STRUCT);
	const [emailAndPhoneFields, setEmailAndPhoneFields] = useState(EMAIL_PHONE_FIELDS);

	//CSV Field Map State
	const [mappingField, setMappingField] = useState([]);

	//functions
	const settingField = (map, field) => {
		map &&
			Object.keys(map).forEach(f => {
				if (f === "emails") {
					setEmailAndPhoneFields(prev => ({
						...prev,
						[type]: {
							...prev[type],
							email: [...map[f]],
						},
					}));
				} else if (f === "phone_numbers") {
					setEmailAndPhoneFields(prev => ({
						...prev,
						[type]: {
							...prev?.[type],
							phone: [...map[f]],
						},
					}));
				}
				field.push(map[f]);
			});
	};

	const fetchSfFieldMap = () => {
		type === VIEWS.LEAD
			? fetchLeadFieldsMutate(VIEWS.LEAD, {
					onSuccess: itFieldsFromServer => {
						setOriginalItFields(prev => ({
							...prev,
							[VIEWS.LEAD]: itFieldsFromServer?.map((field, i) => ({
								index: i,
								...field,
							})),
						}));
					},
					onError: err => {
						addError({
							text: err?.response?.data?.msg,
							desc: err?.response?.data?.error,
							cId: err?.response?.data?.correlationId,
						});
					},
			  })
			: fetchContactSfFieldsMutate(VIEWS.CONTACT, {
					onSuccess: itFieldsFromServer => {
						setOriginalItFields(prev => ({
							...prev,
							[VIEWS.CONTACT]: itFieldsFromServer?.map((field, i) => ({
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

		fetchSfMap(null, {
			onSuccess: ringoverFieldsFromServer => {
				if (type === "lead") {
					let leadF = [];
					settingField(ringoverFieldsFromServer?.lead_map, leadF);
					setLeadField(leadF.flat(1));
				} else {
					let contactF = [];
					settingField(ringoverFieldsFromServer?.contact_map, contactF);
					setContactField(contactF.flat(1));
				}
			},
		});
	};
	console.log(mappingField, "MappField");
	const handleDragEnd = e => {
		const source = e.source;
		const destination = e.destination;

		const sourceDroppableId = source?.droppableId;
		const destinationDroppableId = destination?.droppableId;
		const draggableId = JSON.parse(e.draggableId);

		if (destination === undefined || destination === null) return null;

		if (
			sourceDroppableId === "extracted-col" &&
			destinationDroppableId !== "extracted-col"
		) {
			//move extracted field to ringover field
			// const insertIndex = e.destination.index;

			// if (insertIndex > 100) return;
			//Record ID, Associated Company ID, Contact Owner can only be mapped to themselves
			// if (draggableId.name === "Record ID" && destinationDroppableId !== "Record ID")
			// 	return;
			// if (destinationDroppableId === "Record ID" && draggableId.name !== "Record ID")
			// 	return;

			// if (
			// 	draggableId.name === "Associated Company IDs" &&
			// 	destinationDroppableId !== "Associated Company IDs"
			// )
			// 	return;
			// if (
			// 	destinationDroppableId === "Associated Company IDs" &&
			// 	draggableId.name !== "Associated Company IDs"
			// )
			// 	return;

			// if (
			// 	(draggableId.name === "Contact owner" ||
			// 		draggableId.name === "Propriétaire du contact") &&
			// 	destinationDroppableId !== "Contact owner"
			// )
			// 	return;

			// if (
			// 	destinationDroppableId === "Contact owner" &&
			// 	draggableId.name !== "Contact owner" &&
			// 	draggableId.name !== "Propriétaire du contact"
			// )
			// 	return;

			let currentValueOnDropped = mappingField.find(
				field => field.label === destinationDroppableId
			)?.value;

			setMappingField(prev =>
				prev.map(field => {
					if (field.label === destinationDroppableId)
						return {
							...field,
							value: draggableId,
						};
					return field;
				})
			);

			const newDisplayedColumns = displayedColumns;
			//remove selected field from display list
			newDisplayedColumns.splice(displayedColumns.indexOf(draggableId.name), 1);
			//move current value back to display list
			currentValueOnDropped && newDisplayedColumns.push(currentValueOnDropped.name);
			setDisplayedColumns(newDisplayedColumns);
		} else if (
			sourceDroppableId !== "extracted-col" &&
			destinationDroppableId === "extracted-col"
		) {
			setMappingField(prev =>
				prev.map(field => {
					if (field.label === sourceDroppableId)
						return {
							...field,
							// value: { name: null, columnIndex: null },
							value: { name: null },
						};
					return field;
				})
			);

			//move extracted field back to display list
			const newDisplayedColumns = displayedColumns;
			newDisplayedColumns.splice(
				extractedColumns.indexOf(draggableId.name),
				0,
				draggableId.name
			);
			setDisplayedColumns(newDisplayedColumns);
		} else if (
			sourceDroppableId !== "extracted-col" &&
			destinationDroppableId !== "extracted-col"
		) {
			//reorder ringover field
			const intitalIndex = e.source.index;
			const newIndex = e.destination.index;
			// if (newIndex > 100) return;
			if (intitalIndex === newIndex) return;
			// if (
			// 	draggableId.name === "Record ID" ||
			// 	draggableId.name === "Associated Company IDs" ||
			// 	draggableId.name === "Contact owner" ||
			// 	draggableId.name === "Propriétaire du contact" ||
			// 	destinationDroppableId === "Record ID" ||
			// 	destinationDroppableId.name === "Associated Company IDs" ||
			// 	destinationDroppableId.name === "Contact owner" ||
			// 	destinationDroppableId.name === "Propriétaire du contact"
			// )
			// 	return;

			let currentValueOnDropped = mappingField.find(
				field => field.label === destinationDroppableId
			).value;

			setMappingField(prev =>
				prev.map(field => {
					if (field.label === sourceDroppableId)
						return {
							...field,
							value: currentValueOnDropped?.name
								? currentValueOnDropped
								: // : { name: null, columnIndex: null },
								  { name: null },
						};
					if (field.label === destinationDroppableId)
						return {
							...field,
							// value: { name: draggableId.name, columnIndex: draggableId.columnIndex },
							value: { name: draggableId.name },
						};
					return field;
				})
			);
		}
	};
	const handleImportLeads = () => {
		if (checkRequired(mappingField))
			return addError({ text: "Required fields are empty" });

		const obj = {
			phone_numbers: [],
			emails: [],
		};

		mappingField.forEach(field => {
			if (!field.value.name) return;

			if (checkIfEmailOrPhone(field.name, emailAndPhoneFields?.[type])?.phone) {
				obj.phone_numbers.push({
					type: field.name,
					column_name: field.value.name,
				});
			} else if (checkIfEmailOrPhone(field.name, emailAndPhoneFields?.[type])?.email) {
				obj.emails.push({
					type: field.name,
					column_name: field.value.name,
				});
			} else {
				obj[field.name] = field.value.name;
			}
		});
		sessionStorage.setItem(`mapped-fields`, JSON.stringify(mappingField));
		postContactsMutation(
			{ formData: getFormData(parseBody(obj), cadenceId), type },
			{
				onSuccess: mssg => {
					sessionStorage.setItem(
						`lead-contact-cadence-${cadenceId}`,
						JSON.stringify(mssg)
					);
					navigate(
						`/cadence-import?import=xls&type=${type}&cadence_id=${cadenceId}&cadence_name=${cadenceName}`
					);
				},
				onError: err => {
					addError({
						text:
							err.response?.data?.msg ?? "Error Occured while trying to save mappings",
						desc: err?.response?.data?.error,
						cId: err?.response?.data?.correlationId,
					});
				},
			}
		);
	};

	const handleCancel = () => {
		sessionStorage.removeItem(`mapped-fields`);
		navigate(`/cadence/${cadenceId}?view=list`);
	};

	//sideeffects

	useEffect(() => {
		fetchSfFieldMap();
		extractColumns(null, {
			onSuccess: res => {
				setExtractedColumns(res);
				setDisplayedColumns(res);
			},
			onError: err =>
				addError({
					text: err?.response?.data?.msg,
					desc: err?.response?.data?.error,
					cId: err?.response?.data?.correlationId,
				}),
		});
	}, []);
	useEffect(() => {
		if (
			(originalItFields?.contact?.length || originalItFields?.lead?.length) &&
			// originalItFields?.company?.length &&
			(contactField.length || leadField.length) &&
			// companyField.length &&
			extractedColumns?.length
		) {
			const getLabel =
				type === VIEWS.LEAD
					? originalItFields.lead.filter(f => leadField.includes(f.name))
					: originalItFields.contact.filter(f => contactField.includes(f.name));
			let defaultDisplayedColumns = [...extractedColumns];

			let givenFields = [
				...getLabel,
				...[
					{ name: "id", label: "Dynamics ID", type: "string" },
					{
						name: "user_name",
						label: "User Name",
						type: "string",
					},
				],
			];
			if (type === "contact") {
				givenFields.push({
					name: "account_name",
					label: "Company Name",
					type: "string",
				});
			}
			let fields = getRequiredField(givenFields)?.map((f, i) => ({
				...f,
				index: i,
				value: { name: null },
			}));

			const fieldsMapped = sessionStorage.getItem(`mapped-fields`)
				? (() => {
						const mapped_fields = JSON.parse(sessionStorage.getItem(`mapped-fields`));
						let mapFieldObj = {};
						mapped_fields.forEach(field => (mapFieldObj[field.name] = field.value.name));
						return fields?.map(field => {
							field.value.name = mapFieldObj[field.name] ?? "";
							defaultDisplayedColumns = defaultDisplayedColumns.filter(
								ddc => ddc !== mapFieldObj[field.name]
							);
							return field;
						});
				  })()
				: fields?.map(field => {
						let newField = null;

						POTENTIAL_FIELDS[type][field.name]?.forEach(label => {
							if (extractedColumns?.includes(label)) {
								defaultDisplayedColumns = defaultDisplayedColumns.filter(
									ddc => ddc !== label
								);
								newField = {
									...field,
									value: {
										name: label,
									},
								};
							}
						});

						return newField ?? field;
				  });
			setMappingField(fieldsMapped);
			//set displayed columns after removing the ones used for default selection
			setDisplayedColumns(defaultDisplayedColumns);
		}
	}, [originalItFields, extractedColumns, contactField, leadField]);
	// }, [originalItFields, extractedColumns, contactField, companyField]);
	return (
		<div className={styles.importCsv}>
			<div className={styles.header}>
				<div className={styles.cancel} onClick={handleCancel}>
					<Close color={"#037dfc"} />
					Cancel Import
				</div>
				<div className={styles.file}>
					<Document />
					{sessionStorage.getItem("file-name-csv")}
				</div>
				<ThemedButton
					theme={ThemedButtonThemes.PRIMARY}
					onClick={handleImportLeads}
					className={styles.actionBtn}
					loading={postContactsLoading}
					loadingText="Importing"
				>
					Import Leads
				</ThemedButton>
			</div>

			<div className={styles.workspace}>
				<DragDropContext onDragEnd={e => handleDragEnd(e)}>
					<ColumnMapping
						loading={
							extractColumnsLoading ||
							fetchSfMapLoading ||
							fetchContactSfFieldsLoading ||
							fetchLeadFieldsLoading
						}
						columns={mappingField}
					/>
					<ExtractedColumns
						extractedColumns={extractedColumns}
						displayedColumns={displayedColumns}
						extractColumnsLoading={extractColumnsLoading}
					/>
				</DragDropContext>
			</div>
		</div>
	);
}

export default CsvColumnMap;
