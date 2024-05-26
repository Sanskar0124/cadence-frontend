import { userInfo } from "@cadence-frontend/atoms";
import { MessageContext } from "@cadence-frontend/contexts";
import { useCSVImportHubspot, useSettings } from "@cadence-frontend/data-access";
import { Close, Document, ErrorGradient } from "@cadence-frontend/icons";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { ThemedButton } from "@cadence-frontend/widgets";
import { useContext, useEffect, useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import ColumnMapping from "../components/ColumnMapping/ColumnMapping";
import ExtractedColumns from "../components/ExtractedColumns/ExtractedColumns";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import {
	checkIfEmailOrPhone,
	checkRequired,
	DEFAULT_IT_FIELDS_STRUCT,
	getRequiredField,
	POTENTIAL_FIELDS,
	VIEWS,
} from "./constants";
import styles from "./CrmLeadMapping.module.scss";

function CrmLeadMapping({ isProspecting }) {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const cadenceName = searchParams.get("cadence_name");
	const cadenceId = searchParams.get("cadence_id");
	const { addError } = useContext(MessageContext);

	const csvImportHuspotDataAccess = useCSVImportHubspot();
	const {
		postContactsLoading,
		extractColumns,
		extractColumnsLoading,
		extractColumnsError,
	} = csvImportHuspotDataAccess;

	const user = useRecoilValue(userInfo);

	const {
		fetchSfMap,
		fetchCompanyHpFieldsMutate,
		fetchContactHpFieldsMutate,
		fetchSfMapLoading,
		fetchCompanyHpFieldsLoading,
		fetchContactHpFieldsLoading,
	} = useSettings({
		role: user.role,
		enabled: false,
	});

	//extracted columns state
	const [extractedColumns, setExtractedColumns] = useState([]);
	const [displayedColumns, setDisplayedColumns] = useState([]);

	//company field map data states
	const [contactField, setContactField] = useState([]);
	const [companyField, setCompanyField] = useState([]);
	const [originalItFields, setOriginalItFields] = useState(DEFAULT_IT_FIELDS_STRUCT);
	const [emailAndPhoneFields, setEmailAndPhoneFields] = useState({
		email: [],
		phone: [],
	});

	//CSV Field Map State
	const [mappingField, setMappingField] = useState([]);

	//functions
	const fetchSfFieldMap = () => {
		fetchContactHpFieldsMutate(VIEWS.CONTACT, {
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
		fetchCompanyHpFieldsMutate(VIEWS.COMPANY, {
			onSuccess: itFieldsFromServer => {
				setOriginalItFields(prev => ({
					...prev,
					[VIEWS.COMPANY]: itFieldsFromServer?.map((field, i) => ({
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
				const company = Object.keys(ringoverFieldsFromServer?.company_map)
					.map(f => ringoverFieldsFromServer?.company_map[f])
					.filter(f => f !== "name");

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

					if (f === "emails" || f === "phone_numbers") {
						arr.push(ringoverFieldsFromServer?.contact_map[f]);
					} else {
						arr.push(ringoverFieldsFromServer?.contact_map[f]);
					}
				});

				setContactField(arr.flat(1).filter(f => f !== "firstname" && f !== "company"));

				setCompanyField(company);
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
			//move extracted field to ringover field
			const insertIndex = e.destination.index;

			if (insertIndex > 100) return;
			//Record ID, Associated Company ID, Contact Owner can only be mapped to themselves
			if (
				draggableId.name.toLowerCase().includes("record id") &&
				destinationDroppableId !== "Record ID"
			)
				return;
			if (
				destinationDroppableId === "Record ID" &&
				!draggableId.name.toLowerCase().includes("record id")
			)
				return;

			// if (
			// 	draggableId.name.toLowerCase().includes("associated company ids") &&
			// 	destinationDroppableId !== "Associated Company IDs"
			// )
			// 	return;
			// if (
			// 	destinationDroppableId === "Associated Company IDs" &&
			// 	!draggableId.name.toLowerCase().includes("associated company ids")
			// )
			// 	return;

			if (
				(draggableId.name.toLowerCase().includes("contact owner") ||
					draggableId.name.toLowerCase().includes("propriétaire du contact")) &&
				destinationDroppableId !== "Contact owner"
			)
				return;

			if (
				destinationDroppableId === "Contact owner" &&
				draggableId.name.toLowerCase().includes("Contact owner") &&
				draggableId.name.toLowerCase().includes("propriétaire du contact")
			)
				return;

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
							value: { name: null, columnIndex: null },
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
			if (newIndex > 100) return;
			if (intitalIndex === newIndex) return;
			if (
				draggableId.name === "Record ID" ||
				draggableId.name === "Associated Company IDs" ||
				draggableId.name === "Contact owner" ||
				draggableId.name === "Propriétaire du contact" ||
				destinationDroppableId === "Record ID" ||
				destinationDroppableId.name === "Associated Company IDs" ||
				destinationDroppableId.name === "Contact owner" ||
				destinationDroppableId.name === "Propriétaire du contact"
			)
				return;

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
								: { name: null, columnIndex: null },
						};
					if (field.label === destinationDroppableId)
						return {
							...field,
							value: { name: draggableId.name, columnIndex: draggableId.columnIndex },
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
			phone_numbers: { elements: [] },
			emails: { elements: [] },
		};

		mappingField.forEach(field => {
			if (field.value.name === null || field.value.name === "") return;
			if (checkIfEmailOrPhone(field.name, emailAndPhoneFields)?.phone) {
				obj.phone_numbers.elements.push({
					type: field.name,
					column_index: field.value.columnIndex,
				});
			} else if (checkIfEmailOrPhone(field.name, emailAndPhoneFields)?.email) {
				obj.emails.elements.push({
					type: field.name,
					column_index: field.value.columnIndex,
				});
			} else {
				obj[field.name === "lastname" ? "last_name" : field.name] =
					field.value.columnIndex;
			}
		});

		sessionStorage.setItem(`preview-body`, JSON.stringify(obj));
		sessionStorage.setItem(`mapped-fields`, JSON.stringify(mappingField));
		// navigate(`/cadence-import?cadence_id=${cadenceId}&cadence_name=${cadenceName}`);

		if (!isProspecting) {
			navigate(
				`/cadence-import?isProspecting=false&cadence_id=${cadenceId}&cadence_name=${cadenceName}`
			);
		} else {
			navigate(`/cadence-import?cadence_id=${cadenceId}&cadence_name=${cadenceName}`);
		}
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
			//	onError: err => addError(err.response?.data?.msg),
		});
	}, []);

	useEffect(() => {
		if (
			originalItFields?.contact?.length &&
			originalItFields?.company?.length &&
			contactField.length &&
			companyField.length &&
			extractedColumns?.length
		) {
			const getLabelForContact = originalItFields.contact.filter(f =>
				contactField.some(e => e === f.name)
			);
			//Remove Annual Revenvue
			getLabelForContact.map((item, index) => {
				if (item.name === "annualrevenue") getLabelForContact.splice(index, 1);
			});

			const getLabelForCompany = originalItFields.company.filter(
				f => companyField.some(e => e === f.name) && f.name !== "phone"
			);

			let defaultDisplayedColumns = [...extractedColumns];

			let fields = getRequiredField([
				...getLabelForCompany,

				...getLabelForContact,

				...[
					{ name: "integration_status", label: "Integration Status", type: "string" },
					{ name: "record_id", label: "Record ID", type: "string" },
					{ name: "first_name", label: "First Name", type: "string" },

					{
						name: "company_name",
						label: "Associated Company",
						type: "string",
					},
					{
						name: "company_id",
						label: "Associated Company IDs",
						type: "string",
					},
					{
						name: "owner",
						label: "Contact owner",
						type: "string",
					},
				],
			])?.map((f, i) => ({ ...f, index: i, value: { name: null, columnIndex: null } }));

			const fieldsMapped = sessionStorage.getItem(`mapped-fields`)
				? (() => {
						const mapped_fields = JSON.parse(sessionStorage.getItem(`mapped-fields`));
						let mapFieldObj = {};

						mapped_fields.forEach(
							field =>
								(mapFieldObj[field.name] = {
									name: field.value.name,
									index: field.value.columnIndex,
								})
						);

						return fields?.map(field => {
							field.value.name = mapFieldObj[field.name]?.name ?? "";
							field.value.columnIndex = mapFieldObj[field.name]?.index;
							defaultDisplayedColumns = defaultDisplayedColumns.filter(
								ddc => ddc !== mapFieldObj[field.name]?.name
							);
							return field;
						});
				  })()
				: fields?.map(field => {
						let newField = null;
						POTENTIAL_FIELDS[field.name]?.forEach(label => {
							let res =
								field.name === "company_name" || field.name === "company_id"
									? extractedColumns.includes(label)
									: extractedColumns.find(lc =>
											lc.toLowerCase().includes(label.toLowerCase())
									  );
							if (res) {
								defaultDisplayedColumns.splice(defaultDisplayedColumns.indexOf(label), 1);
								newField = {
									...field,
									value: {
										name: label,
										columnIndex: extractedColumns.indexOf(label),
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
	}, [originalItFields, extractedColumns, contactField, companyField]);

	return (
		<div className={styles.importCsv}>
			<div className={styles.header}>
				<div className={styles.cancel} onClick={handleCancel}>
					<Close color={"#037dfc"} />
					Cancel Import
				</div>
				{!extractColumnsError.error && (
					<>
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
					</>
				)}
			</div>

			{extractColumnsError.error ? (
				<div className={styles.error}>
					<ErrorGradient size="38px" />
					<span className={styles.importFailed}>
						{COMMON_TRANSLATION.IMPORT_FAILED[user?.language?.toUpperCase()]}
					</span>
					<span>{extractColumnsError.msg}</span>
				</div>
			) : (
				<div className={styles.workspace}>
					<DragDropContext onDragEnd={e => handleDragEnd(e)}>
						<ColumnMapping
							loading={
								extractColumnsLoading ||
								fetchSfMapLoading ||
								fetchCompanyHpFieldsLoading ||
								fetchContactHpFieldsLoading
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
			)}
		</div>
	);
}

export default CrmLeadMapping;
