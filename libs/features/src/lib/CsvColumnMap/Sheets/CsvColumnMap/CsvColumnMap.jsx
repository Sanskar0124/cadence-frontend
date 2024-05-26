import { userInfo } from "@cadence-frontend/atoms";
import { MessageContext } from "@cadence-frontend/contexts";
import {
	useCSVImportHubspot,
	useCadence,
	useCadenceImportGoogleSheets,
} from "@cadence-frontend/data-access";
import { Close, Document, ErrorGradient, Refresh2 } from "@cadence-frontend/icons";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { ThemedButton } from "@cadence-frontend/widgets";
import { useContext, useEffect, useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import ColumnMapping from "./components/ColumnMapping/ColumnMapping";
import ExtractedColumns from "./components/ExtractedColumns/ExtractedColumns";
import {
	checkRequired,
	DEFAULT_COLUMNS,
	IMPORT_TYPE,
	POTENTIAL_FIELDS,
} from "./constants";
import styles from "./CsvColumnMap.module.scss";

function CsvColumnMap() {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const cadenceName = searchParams.get("cadence_name");
	const cadenceId = searchParams.get("cadence_id");
	const editMap = searchParams.get("edit");
	const type = searchParams.get("type");
	const { addError } = useContext(MessageContext);
	const user = useRecoilValue(userInfo);

	const cadenceImportGoogleSheetsAccess = useCadenceImportGoogleSheets({
		sheet_url: null,
		sheet_field_map: null,
		cadence_id: null,
	});
	const csvImportDataAccess = useCSVImportHubspot();
	const { extractColumns, extractColumnsLoading, extractColumnsError } =
		csvImportDataAccess;

	const { getHeaders, headersLoading, headersError } = cadenceImportGoogleSheetsAccess;
	const { updateCadence, updateLoading } = useCadence();

	//extracted columns state
	const [extractedColumns, setExtractedColumns] = useState([]);
	const [displayedColumns, setDisplayedColumns] = useState([]);

	//CSV Field Map State
	const [mappingField, setMappingField] = useState(DEFAULT_COLUMNS(type));

	//functions

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
		} else if (
			sourceDroppableId !== "extracted-col" &&
			destinationDroppableId === "extracted-col"
		) {
			setMappingField(prev =>
				prev.map(field => {
					if (field.label === sourceDroppableId)
						return {
							...field,
							value: { name: null },
						};
					return field;
				})
			);
		} else if (
			sourceDroppableId !== "extracted-col" &&
			destinationDroppableId !== "extracted-col"
		) {
			//reorder ringover field
			const intitalIndex = e.source.index;
			const newIndex = e.destination.index;
			if (newIndex > 100) return;
			if (intitalIndex === newIndex) return;

			let currentValueOnDropped = mappingField.find(
				field => field.label === destinationDroppableId
			).value;
			setMappingField(prev =>
				prev.map(field => {
					if (field.label === sourceDroppableId)
						return {
							...field,
							value: currentValueOnDropped?.name ? currentValueOnDropped : { name: null },
						};
					if (field.label === destinationDroppableId)
						return {
							...field,
							value: { name: draggableId.name },
						};
					return field;
				})
			);
		}
	};

	const handleImportLeads = () => {
		if (checkRequired(mappingField))
			return addError({ text: `${checkRequired(mappingField)} missing` });

		const parsedData = {
			phone_numbers: [],
			emails: [],
		};

		mappingField.forEach(field => {
			if (!field.value.name) return;
			if (field.isArray)
				field.value.name && parsedData[field.backendField].push(field.value.name);
			else parsedData[field.backendField] = field.value.name;
		});

		if (editMap) {
			updateCadence(
				{ cadence_id: cadenceId, field_map: parsedData },
				{
					onSuccess: goBackToCadence,
				}
			);
		} else {
			sessionStorage.setItem("csv_field_map", JSON.stringify(parsedData));
			navigate(
				`/cadence-import?type=${type}&cadence_id=${cadenceId}&cadence_name=${cadenceName}`
			);
		}
	};

	const goBackToCadence = () => navigate(`/cadence/${cadenceId}?view=list`);

	//sideeffects

	useEffect(() => {
		if (type === IMPORT_TYPE.CSV) {
			extractColumns(null, {
				onSuccess: res => {
					let filtered = res.filter(col => col);
					setExtractedColumns(filtered);
					setDisplayedColumns(filtered);
				},
			});
		} else if (type === IMPORT_TYPE.SHEETS) {
			getHeaders(
				{ url: sessionStorage.getItem("sheet_url") },
				{
					onSuccess: res => {
						setExtractedColumns(res);
						setDisplayedColumns(res);
					},
				}
			);
		}
	}, []);

	useEffect(() => {
		if (extractedColumns?.length) {
			const existingFieldMap = JSON.parse(sessionStorage.getItem("csv_field_map"));
			setMappingField(prev =>
				prev
					//set defaults
					?.map(field => {
						let newField = null;
						if (existingFieldMap) {
							if (field.isArray) {
								let labels = existingFieldMap[field.backendField];
								if (extractedColumns.includes(labels[field.index])) {
									newField = {
										...field,
										value: {
											name: labels[field.index],
										},
									};
								}
							} else {
								let label = existingFieldMap[field.backendField];
								if (extractedColumns.includes(label)) {
									newField = {
										...field,
										value: {
											name: label,
										},
									};
								}
							}
						} else {
							POTENTIAL_FIELDS[field.backendField]?.forEach((label, i) => {
								if (extractedColumns.includes(label)) {
									if (field.isArray) {
										if (field.index === i) {
											newField = {
												...field,
												value: {
													name: label,
												},
											};
										}
									} else {
										newField = {
											...field,
											value: {
												name: label,
											},
										};
									}
								}
							});
						}
						return newField ?? field;
					})
			);
		}
	}, [extractedColumns]);

	useEffect(() => {
		setDisplayedColumns(
			extractedColumns.filter(
				col => !mappingField.find(field => field.value.name === col)
			)
		);
	}, [mappingField]);

	return (
		<>
			<div className={styles.header}>
				<div className={styles.cancel} onClick={goBackToCadence}>
					<Close color={"#037dfc"} />
					Cancel {editMap ? "Remap" : "Import"}
				</div>
				{!headersError.error && !extractColumnsError.error && (
					<>
						{type === IMPORT_TYPE.CSV && (
							<div className={styles.file}>
								<Document />
								{sessionStorage.getItem("file-name-csv")}
							</div>
						)}
						<ThemedButton
							theme={ThemedButtonThemes.PRIMARY}
							onClick={handleImportLeads}
							className={styles.actionBtn}
							loading={updateLoading}
							loadingText={"Saving"}
						>
							{editMap ? "Save" : "Import Leads"}
						</ThemedButton>
					</>
				)}
			</div>
			{headersError.error || extractColumnsError.error ? (
				<div className={styles.error}>
					<ErrorGradient size="38px" />
					<span className={styles.importFailed}>
						{COMMON_TRANSLATION.IMPORT_FAILED[user?.language?.toUpperCase()]}
					</span>
					<span>{headersError.msg || extractColumnsError.msg}</span>
					{headersError.msg ===
						`Please provide edit access to "Anyone with the link" to the google sheet` && (
						<div className={styles.linkAccess}>
							<div className={styles.restrictImg}>
								<img
									alt=""
									src="https://storage.googleapis.com/apt-cubist-307713.appspot.com/cadence/give_access_google_sheets.png"
								/>
								<img
									alt=""
									src="https://storage.googleapis.com/apt-cubist-307713.appspot.com/cadence/google_edit_access.png"
								/>
							</div>
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
				<div className={styles.importCsv}>
					<div className={styles.workspace}>
						<DragDropContext onDragEnd={e => handleDragEnd(e)}>
							<ColumnMapping columns={mappingField} />
							<ExtractedColumns
								displayedColumns={displayedColumns}
								extractColumnsLoading={headersLoading || extractColumnsLoading}
							/>
						</DragDropContext>
					</div>
				</div>
			)}
		</>
	);
}

export default CsvColumnMap;
