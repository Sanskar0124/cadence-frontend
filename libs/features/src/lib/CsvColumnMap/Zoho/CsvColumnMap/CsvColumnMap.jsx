import { userInfo } from "@cadence-frontend/atoms";
import { MessageContext } from "@cadence-frontend/contexts";
import { useCSVImportZoho, useSettings } from "@cadence-frontend/data-access";
import { Close, Document, ErrorGradient, Refresh2 } from "@cadence-frontend/icons";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { ThemedButton } from "@cadence-frontend/widgets";
import { useContext, useEffect, useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import ColumnMapping from "./components/ColumnMapping/ColumnMapping";
import ExtractedColumns from "./components/ExtractedColumns/ExtractedColumns";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import {
	checkIfEmailOrPhone,
	checkRequired,
	COLUMNS,
	getFormData,
	getRequiredField,
	POTENTIAL_FIELDS,
	PHONE_COLUMNS,
	EMAIL_COLUMNS,
} from "./constants";
import styles from "./CsvColumnMap.module.scss";

function CsvColumnMap() {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const type = searchParams.get("type");
	const cadenceName = searchParams.get("cadence_name");
	const cadenceId = searchParams.get("cadence_id");
	const { addError } = useContext(MessageContext);

	const csvImportBullhornDataAccess = useCSVImportZoho();
	const {
		extractColumnsFromCSV,
		extractColumnsFromCSVLoading,
		extractColumnsFromSheets,
		extractColumnsFromSheetsLoading,
		extractColumnsErrorFromSheets,
		previewLeadsViaCSV,
		previewLeadsViaCSVLoading,
		previewLeadsViaSheets,
		previewLeadsViaSheetsLoading,
	} = csvImportBullhornDataAccess;

	const user = useRecoilValue(userInfo);

	const { fetchSfMap, fetchLeadFieldsMutate, fetchSfMapLoading, fetchLeadFieldsLoading } =
		useSettings({
			role: user.role,
			enabled: false,
		});

	//extracted columns state
	const [extractedColumns, setExtractedColumns] = useState([]);
	const [displayedColumns, setDisplayedColumns] = useState([]);

	//contact field map data states
	const [leadField, setLeadField] = useState([]);
	const [originalContactFields, setOriginalContactFields] = useState([]);
	const [emailAndPhoneFields, setEmailAndPhoneFields] = useState({
		email: [],
		phone: [],
	});

	//CSV Field Map State
	const [mappingField, setMappingField] = useState([]);

	//functions
	const fetchSfFieldMap = () => {
		fetchLeadFieldsMutate("lead", {
			onSuccess: itFieldsFromServer => {
				setOriginalContactFields(itFieldsFromServer);
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

				Object.keys(ringoverFieldsFromServer?.lead_map).forEach(f => {
					if (f === "emails") {
						setEmailAndPhoneFields(prev => ({
							...prev,
							email: [...ringoverFieldsFromServer?.lead_map[f]],
						}));
					} else if (f === "phone_numbers") {
						setEmailAndPhoneFields(prev => ({
							...prev,
							phone: [...ringoverFieldsFromServer?.lead_map[f]],
						}));
					} else if (f === "company") {
						arr.push("company_name");
					} else {
						arr.push(f);
					}
				});

				setLeadField(
					arr
						.flat(1)
						.filter(f => f !== "first_name" && f !== "last_name" && f !== "variables")
				);
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
			//Zoho Owner ID can only be mapped to itself
			// if (
			// 	draggableId.name.toLowerCase().includes("zoho owner id") &&
			// 	destinationDroppableId !== "Zoho Owner ID"
			// )
			// 	return;
			// if (
			// 	destinationDroppableId === "Zoho Owner ID" &&
			// 	!draggableId.name.toLowerCase().includes("zoho owner id")
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
				draggableId.name === "Zoho Owner ID" ||
				destinationDroppableId === "Zoho Owner ID"
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
			phone_numbers: [],
			emails: [],
		};

		mappingField.forEach(field => {
			if (field.value.name === null) return;
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

		// 	);

		sessionStorage.setItem(`mapped-fields`, JSON.stringify(mappingField));
		sessionStorage.setItem(`preview-body`, JSON.stringify(obj));

		if (type === "csv") {
			navigate(
				`/cadence-import?type=create_lead&import_type=csv&cadence_id=${cadenceId}&cadence_name=${cadenceName}`
			);
		} else if (type === "sheets") {
			navigate(
				`/cadence-import?type=create_lead&import_type=sheets&cadence_id=${cadenceId}&cadence_name=${cadenceName}`
			);
		}
	};

	const handleCancel = () => {
		sessionStorage.removeItem(`mapped-fields`);
		navigate(`/cadence/${cadenceId}?view=list`);
	};

	//sideeffects;

	useEffect(() => {
		fetchSfFieldMap();
		if (type === "csv")
			extractColumnsFromCSV(null, {
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
		else if (type === "sheets")
			extractColumnsFromSheets(null, {
				onSuccess: res => {
					setExtractedColumns(res);
					setDisplayedColumns(res);
				},

				// onError: err => addError(err.response?.data?.msg),
			});
	}, []);

	useEffect(() => {
		if (leadField.length && originalContactFields.length && extractedColumns?.length) {
			let defaultDisplayedColumns = [...extractedColumns];

			let fields = getRequiredField([
				...[
					{ name: "first_name", label: "First Name", type: "string" },
					{ name: "last_name", label: "Last Name", type: "string" },
					{
						name: "zoho_owner_id",
						label: "Zoho Owner ID",
						type: "string",
					},
				],
				...leadField?.map(field => ({
					name: field,
					label: COLUMNS[field],
					type: "string",
				})),
				...emailAndPhoneFields?.email?.map((field, index) => ({
					name: field,
					label: originalContactFields.find(f => f.name === field)?.label,
					type: "string",
					default: EMAIL_COLUMNS[index] ?? null,
				})),
				...emailAndPhoneFields?.phone?.map((field, index) => ({
					name: field,
					label: originalContactFields.find(f => f.name === field)?.label,
					type: "string",
					default: PHONE_COLUMNS[index] ?? null,
				})),
			])?.map((f, i) => ({ ...f, index: i, value: { name: null, columnIndex: null } }));
			//set defaults
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
						if (field.default) {
							let res = extractedColumns.find(lc =>
								lc.toLowerCase().includes(field.default.toLowerCase())
							);
							if (res) {
								defaultDisplayedColumns.splice(defaultDisplayedColumns.indexOf(res), 1);
								newField = {
									...field,
									value: {
										name: res,
										columnIndex: extractedColumns.indexOf(res),
									},
								};
							}
							delete field.default;
						} else {
							POTENTIAL_FIELDS[field.name]?.forEach(label => {
								let res = extractedColumns.find(lc =>
									lc.toLowerCase().includes(label.toLowerCase())
								);
								if (res) {
									defaultDisplayedColumns.splice(defaultDisplayedColumns.indexOf(res), 1);
									newField = {
										...field,
										value: {
											name: res,
											columnIndex: extractedColumns.indexOf(res),
										},
									};
								}
							});
						}
						return newField ?? field;
				  });

			setMappingField(fieldsMapped);
			//set displayed columns after removing the ones used for default selection
			setDisplayedColumns(defaultDisplayedColumns);
		}
	}, [extractedColumns, originalContactFields, leadField]);

	return (
		<div className={styles.importCsv}>
			<div className={styles.header}>
				<div className={styles.cancel} onClick={handleCancel}>
					<Close color={"#037dfc"} />
					Cancel Import
				</div>
				{type === "csv" && (
					<div className={styles.file}>
						<Document />
						{sessionStorage.getItem("file-name-csv")}
					</div>
				)}
				{!extractColumnsErrorFromSheets.error && (
					<ThemedButton
						theme={ThemedButtonThemes.PRIMARY}
						onClick={handleImportLeads}
						className={styles.actionBtn}
						loading={previewLeadsViaCSVLoading || previewLeadsViaSheetsLoading}
						loadingText="Importing"
					>
						Import Leads
					</ThemedButton>
				)}
			</div>
			{extractColumnsErrorFromSheets.error ? (
				<div className={styles.error}>
					<ErrorGradient size="38px" />
					<span className={styles.importFailed}>
						{COMMON_TRANSLATION.IMPORT_FAILED[user?.language?.toUpperCase()]}
					</span>
					<span>{extractColumnsErrorFromSheets.msg}</span>
					{extractColumnsErrorFromSheets.msg ===
						`Please provide read access to \"Anyone with the link\" to the google sheet` && (
						<div className={styles.linkAccess}>
							<img src="https://storage.googleapis.com/apt-cubist-307713.appspot.com/cadence/give_access_google_sheets.png" />
							<span>Once done kindly refresh the page</span>
							<ThemedButton
								width="fit-content"
								theme={ThemedButtonThemes.WHITE}
								onClick={() => window.location.reload()}
							>
								<Refresh2 /> Refresh
							</ThemedButton>
						</div>
					)}
				</div>
			) : (
				<div className={styles.workspace}>
					<DragDropContext onDragEnd={e => handleDragEnd(e)}>
						<ColumnMapping
							loading={
								extractColumnsFromCSVLoading ||
								extractColumnsFromSheetsLoading ||
								fetchSfMapLoading ||
								fetchLeadFieldsLoading
							}
							columns={mappingField}
						/>
						<ExtractedColumns
							extractedColumns={extractedColumns}
							displayedColumns={displayedColumns}
							extractColumnsLoading={
								extractColumnsFromCSVLoading || extractColumnsFromSheetsLoading
							}
						/>
					</DragDropContext>
				</div>
			)}
		</div>
	);
}

export default CsvColumnMap;
