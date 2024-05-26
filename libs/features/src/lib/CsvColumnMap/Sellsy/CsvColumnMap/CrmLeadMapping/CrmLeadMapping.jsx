import { userInfo } from "@cadence-frontend/atoms";
import { MessageContext } from "@cadence-frontend/contexts";
import { useCSVImportSellsy, useSettings } from "@cadence-frontend/data-access";
import { Close, Document } from "@cadence-frontend/icons";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { ThemedButton } from "@cadence-frontend/widgets";
import { useContext, useEffect, useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import ColumnMapping from "../components/ColumnMapping/ColumnMapping";
import ExtractedColumns from "../components/ExtractedColumns/ExtractedColumns";
import {
	checkIfEmailOrPhone,
	checkRequired,
	DEFAULT_IT_FIELDS_STRUCT,
	getFormData,
	getRequiredField,
	parseBody,
	POTENTIAL_FIELDS,
	VIEWS,
} from "./constants";
import styles from "./CrmLeadMapping.module.scss";

function CrmLeadMapping() {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const cadenceName = searchParams.get("cadence_name");
	const cadenceId = searchParams.get("cadence_id");
	const { addError } = useContext(MessageContext);

	const csvImportSellsyDataAccess = useCSVImportSellsy();
	const { extractColumns, extractColumnsLoading } = csvImportSellsyDataAccess;

	const user = useRecoilValue(userInfo);

	const {
		fetchSfMap,
		// fetchCompanySellsyFieldsMutate,
		fetchContactSellsyFieldsMutate,
		fetchSfMapLoading,
		// fetchCompanySellsyFieldsLoading,
		fetchContactSellsyFieldsLoading,
	} = useSettings({
		role: user.role,
		enabled: false,
	});

	//extracted columns state
	const [extractedColumns, setExtractedColumns] = useState([]);
	const [displayedColumns, setDisplayedColumns] = useState([]);

	//company field map data states
	const [contactField, setContactField] = useState([]);
	// const [companyField, setCompanyField] = useState([]);
	const [originalItFields, setOriginalItFields] = useState(DEFAULT_IT_FIELDS_STRUCT);
	const [emailAndPhoneFields, setEmailAndPhoneFields] = useState({
		email: [],
		phone: [],
	});

	//CSV Field Map State
	const [mappingField, setMappingField] = useState([]);

	//functions

	const fetchSfFieldMap = () => {
		fetchContactSellsyFieldsMutate(VIEWS.CONTACT, {
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
				let arr = [];

				Object.keys(ringoverFieldsFromServer?.contact_map).forEach(f => {
					if (f === "emails") {
						setEmailAndPhoneFields(prev => ({
							...prev,
							email: [...ringoverFieldsFromServer?.contact_map[f]],
						}));
					} else if (f === "phone_numbers") {
						setEmailAndPhoneFields(prev => ({
							...prev,
							phone: [...ringoverFieldsFromServer?.contact_map[f]],
						}));
					}

					arr.push(ringoverFieldsFromServer?.contact_map[f]);
				});

				setContactField(arr.flat(1).filter(f => f !== "firstname" && f !== "company"));
			},
		});
	};

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
			if (field.value.name === null || field.value.name === "") return;

			if (checkIfEmailOrPhone(field.name, emailAndPhoneFields)?.phone) {
				obj.phone_numbers.push({
					type: field.name,
					column_name: field.value.name,
				});
			} else if (checkIfEmailOrPhone(field.name, emailAndPhoneFields)?.email) {
				obj.emails.push({
					type: field.name,
					column_name: field.value.name,
				});
			} else {
				obj[field.name] = field.value.name;
			}
		});
		sessionStorage.setItem(`mapped-fields`, JSON.stringify(mappingField));
		sessionStorage.setItem(`preview-body`, JSON.stringify(obj));
		navigate(`/cadence-import?cadence_id=${cadenceId}&cadence_name=${cadenceName}`);
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
					desc: err?.response?.data?.error ?? "Please contact support",
					cId: err?.response?.data?.correlationId,
				}),
		});
	}, []);

	useEffect(() => {
		if (
			originalItFields?.contact?.length &&
			// originalItFields?.company?.length &&
			contactField.length &&
			// companyField.length &&
			extractedColumns?.length
		) {
			let getLabelForContact = originalItFields.contact.filter(f =>
				contactField.some(e => e === f.name)
			);
			// To Make I capital in linkedin from the labels coming from backend.
			getLabelForContact = getLabelForContact.map((item, index) => {
				if (item.name === "social.linkedin") return { ...item, label: "LinkedIn" };
				return item;
			});

			let defaultDisplayedColumns = [...extractedColumns];

			let fields = getRequiredField([
				...getLabelForContact,
				...[
					{ name: "id", label: "Sellsy ID", type: "string" },
					{
						name: "company_name",
						label: "Company Name",
						type: "string",
					},
					{
						name: "owner",
						label: "Owner",
						type: "string",
					},
				],
			])?.map((f, i) => ({ ...f, index: i, value: { name: null } }));

			//set defaults

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

						POTENTIAL_FIELDS[field.name]?.forEach(label => {
							if (extractedColumns?.includes(label)) {
								defaultDisplayedColumns.splice(defaultDisplayedColumns.indexOf(label), 1);
								newField = {
									...field,
									value: {
										name: label,
										// columnIndex: extractedColumns.indexOf(label),
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
	}, [originalItFields, extractedColumns, contactField]);
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
					// loading={postContactsLoading}
					loadingText="Importing"
					disabled={extractedColumns?.length === 0}
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
							// fetchCompanySellsyFieldsLoading ||
							fetchContactSellsyFieldsLoading
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

export default CrmLeadMapping;
