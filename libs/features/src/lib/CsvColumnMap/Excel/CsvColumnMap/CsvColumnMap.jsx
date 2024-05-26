import { MessageContext } from "@cadence-frontend/contexts";
import { useCSVImportHubspot } from "@cadence-frontend/data-access";
import { Close, Document, ErrorGradient } from "@cadence-frontend/icons";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { ThemedButton } from "@cadence-frontend/widgets";
import { useContext, useEffect, useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { useNavigate, useSearchParams } from "react-router-dom";
import ColumnMapping from "./components/ColumnMapping/ColumnMapping";
import ExtractedColumns from "./components/ExtractedColumns/ExtractedColumns";
import { checkRequired, DEFAULT_COLUMNS, POTENTIAL_FIELDS } from "./constants";
import styles from "./CsvColumnMap.module.scss";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";

function CsvColumnMap() {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const cadenceName = searchParams.get("cadence_name");
	const cadenceId = searchParams.get("cadence_id");
	const { addError } = useContext(MessageContext);
	const user = useRecoilValue(userInfo);

	const csvImportHuspotDataAccess = useCSVImportHubspot();
	const { extractColumns, extractColumnsLoading, extractColumnsError } =
		csvImportHuspotDataAccess;

	//extracted columns state
	const [extractedColumns, setExtractedColumns] = useState([]);
	const [displayedColumns, setDisplayedColumns] = useState([]);

	//CSV Field Map State
	const [mappingField, setMappingField] = useState(DEFAULT_COLUMNS);

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
			else parsedData[field.backendField] = field.value.name ?? "";
		});

		sessionStorage.setItem("csv_field_map", JSON.stringify(parsedData));
		navigate(`/cadence-import?cadence_id=${cadenceId}&cadence_name=${cadenceName}`);
	};

	const handleCancel = () => navigate(`/cadence/${cadenceId}?view=list`);

	//sideeffects

	useEffect(() => {
		extractColumns(null, {
			onSuccess: res => {
				let filtered = res.filter(col => col);
				setExtractedColumns(filtered);
				setDisplayedColumns(filtered);
			},
		});
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
								newField = {
									...field,
									value: {
										name: labels[field.index],
									},
								};
							} else {
								let label = existingFieldMap[field.backendField];
								newField = {
									...field,
									value: {
										name: label,
									},
								};
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
				<div className={styles.importCsv}>
					<div className={styles.workspace}>
						<DragDropContext onDragEnd={e => handleDragEnd(e)}>
							<ColumnMapping columns={mappingField} />
							<ExtractedColumns
								displayedColumns={displayedColumns}
								extractColumnsLoading={extractColumnsLoading}
							/>
						</DragDropContext>
					</div>
				</div>
			)}
		</>
	);
}

export default CsvColumnMap;
