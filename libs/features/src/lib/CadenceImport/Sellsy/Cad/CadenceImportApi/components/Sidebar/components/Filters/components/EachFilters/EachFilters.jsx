import { Button } from "@cadence-frontend/components";
import { MessageContext } from "@cadence-frontend/contexts";
import { Input, Label, Select } from "@cadence-frontend/widgets";
import moment from "moment-timezone";
import React, { useState, useContext, useEffect } from "react";

import { v4 as uuidv4 } from "uuid";
import {
	TEXT_OPERATORS,
	LIKE_META_DATA,
	BOOLEAN_OPERATORS,
	DATE_OPERATORS,
	LOOKUP_OPERATORS,
	SUPPORTED_DATATYPES,
	SUPPORTED_FIELDS,
	DATETIME_OPERATOR,
	BASICS_OPEARATOS,
	ALL_DATA_TYPE,
	BETWEEN_OPERATORS,
	All_SUPPORTED_OPERATOR,
	BOOLEAN_OPTIONS,
	SUPPORTED_TYPES,
	parseDate,
	parseDateTime,
	unParseDate,
	unParseTime,
} from "../../constant";
import styles from "./EachFilter.module.scss";

const EachFilters = ({
	// zohoFields,
	// dataTypes,
	showAddFilterBtn,
	filters,
	setFilters,
	editable,
	setEditable,
	// eachF,
	// createFilter,
	// setCreateFilter,
	// zohoUsers,
}) => {
	const [formData, setFormData] = useState(
		!editable
			? {
					field: "",
					// operator: "",
					value: "",
					type: "",
					// dateTime: {
					// 	DD: moment().format("DD"),
					// 	MM: moment().format("MM"),
					// 	YYYY: moment().format("YYYY"),
					// 	time: `${moment().format("HH")}:${moment().format("mm")}`,
					// },
					daterange: { starts: "", ends: "" },
					datetimerange: {
						date: { starts: "", ends: "" },
						time: { starts: "", ends: "" },
					},
			  }
			: {
					field: editable,
					type: SUPPORTED_FIELDS.find(field => field.value === editable)?.type,
					value:
						!(
							SUPPORTED_FIELDS.find(field => field.value === editable)?.type ===
							SUPPORTED_TYPES.DATE_RANGE
						) &&
						!(
							SUPPORTED_FIELDS.find(field => field.value === editable)?.type ===
							SUPPORTED_TYPES.DATE_TIME_RANGE
						)
							? filters[editable]
							: "",
					daterange:
						SUPPORTED_FIELDS.find(field => field.value === editable)?.type ===
						SUPPORTED_TYPES.DATE_RANGE
							? {
									starts: unParseDate(
										filters[editable].start,
										SUPPORTED_TYPES.DATE_RANGE
									),
									ends: unParseDate(filters[editable].end, SUPPORTED_TYPES.DATE_RANGE),
							  }
							: "",
					datetimerange:
						SUPPORTED_FIELDS.find(field => field.value === editable)?.type ===
						SUPPORTED_TYPES.DATE_TIME_RANGE
							? {
									date: {
										starts: unParseDate(
											filters[editable].start,
											SUPPORTED_TYPES.DATE_TIME_RANGE
										),
										ends: unParseDate(
											filters[editable].end,
											SUPPORTED_TYPES.DATE_TIME_RANGE
										),
									},
									time: {
										starts: unParseTime(filters[editable].start),
										ends: unParseTime(filters[editable].end),
									},
							  }
							: "",
			  }
	);

	const { addError, addSuccess } = useContext(MessageContext);
	// const getOperator = dataTypes => {
	// 	if (SUPPORTED_DATATYPES?.includes(dataTypes)) {
	// 		switch (dataTypes) {
	// 			case "currency":
	// 			case "number":
	// 			case "integer":
	// 				return DATE_OPERATORS;

	// 			case "date":
	// 			case "datetime":
	// 				return DATETIME_OPERATOR;

	// 			case "text":
	// 			case "picklist":
	// 				return TEXT_OPERATORS;

	// 			case "lookup":
	// 			case "ownerlookup":
	// 				return LOOKUP_OPERATORS;

	// 			case "boolean":
	// 				return BOOLEAN_OPERATORS;

	// 			case "phone":
	// 			case "textarea":
	// 			case "website":
	// 			case "email":
	// 				return TEXT_OPERATORS;
	// 		}
	// 	} else {
	// 		return true;
	// 	}
	// };
	console.log(formData, "FormD");
	useEffect(() => {
		filters &&
			setFormData(
				!editable
					? {
							field: "",
							// operator: "",
							value: "",
							type: "",
							// dateTime: {
							// 	DD: moment().format("DD"),
							// 	MM: moment().format("MM"),
							// 	YYYY: moment().format("YYYY"),
							// 	time: `${moment().format("HH")}:${moment().format("mm")}`,
							// },
							daterange: { starts: "", ends: "" },
							datetimerange: {
								date: { starts: "", ends: "" },
								time: { starts: "", ends: "" },
							},
					  }
					: {
							field: editable,
							type: SUPPORTED_FIELDS.find(field => field.value === editable)?.type,
							value:
								!(
									SUPPORTED_FIELDS.find(field => field.value === editable)?.type ===
									SUPPORTED_TYPES.DATE_RANGE
								) &&
								!(
									SUPPORTED_FIELDS.find(field => field.value === editable)?.type ===
									SUPPORTED_TYPES.DATE_TIME_RANGE
								)
									? filters[editable]
									: "",
							daterange:
								SUPPORTED_FIELDS.find(field => field.value === editable)?.type ===
								SUPPORTED_TYPES.DATE_RANGE
									? {
											starts: unParseDate(
												filters[editable].start,
												SUPPORTED_TYPES.DATE_RANGE
											),
											ends: unParseDate(
												filters[editable].end,
												SUPPORTED_TYPES.DATE_RANGE
											),
									  }
									: "",
							datetimerange:
								SUPPORTED_FIELDS.find(field => field.value === editable)?.type ===
								SUPPORTED_TYPES.DATE_TIME_RANGE
									? {
											date: {
												starts: unParseDate(
													filters[editable].start,
													SUPPORTED_TYPES.DATE_TIME_RANGE
												),
												ends: unParseDate(
													filters[editable].end,
													SUPPORTED_TYPES.DATE_TIME_RANGE
												),
											},
											time: {
												starts: unParseTime(filters[editable].start),
												ends: unParseTime(filters[editable].end),
											},
									  }
									: "",
					  }
			);
	}, [filters, editable]);
	const renderInput = type => {
		switch (type) {
			case SUPPORTED_TYPES.DATE_RANGE:
				return (
					<Input
						placeholder={"dd/mm/yyyy - dd/mm/yyyy"}
						value={formData?.daterange}
						setValue={setFormData}
						type={"daterange"}
						name="daterange"
						top={filters?.length >= 4 ? true : false}
					/>
				);
			case SUPPORTED_TYPES.DATE_TIME_RANGE:
				return (
					<Input
						type="datetimerange"
						CalenderClassName={styles.CalenderClassName}
						value={formData.datetimerange}
						setValue={setFormData}
						name="datetimerange"
						top={filters?.length >= 4 ? true : false}
					/>
				);
			case SUPPORTED_TYPES.MULTIPLE_INPUTS:
				return (() => {
					const parseValue = value => {
						return value.split(",");
					};

					return (
						<Input
							placeholder={"Enter value seprated by comma (,)"}
							value={formData?.value}
							setValue={val => setFormData(prev => ({ ...prev, value: parseValue(val) }))}
						/>
					);
				})();
			default:
				return (
					<Input
						placeholder={"Type here"}
						value={formData.value}
						setValue={val => setFormData(prev => ({ ...prev, value: val }))}
					/>
				);
		}
	};
	// 	switch (operator) {
	// 		// Multiple component only
	// 		case "in":
	// 		case "not in":
	// 			if (formData.type === ALL_DATA_TYPE.PICKLIST) {
	// 				const options = zohoFields.find(
	// 					f => f.name === formData.zoho_field
	// 				).picklistValues;

	// 				return (
	// 					<Select
	// 						options={options?.map(op => ({
	// 							label: op.display_value,
	// 							value: op.actual_value,
	// 						}))}
	// 						isMulti
	// 						setValue={val => setFormData(prev => ({ ...prev, value: val }))}
	// 						height={"auto"}
	// 						isNotScrollable
	// 						menuOnTop={filters?.length >= 4 ? true : false}
	// 					/>
	// 				);
	// 			} else if (formData.type === ALL_DATA_TYPE.OWNER_LOOKUP) {
	// 				return (
	// 					<Select
	// 						options={zohoUsers
	// 							?.filter(zu => zu.integration_id)
	// 							?.map(zu => ({
	// 								label: `${zu.first_name} ${zu.last_name}`,
	// 								value: zu.integration_id,
	// 							}))}
	// 						isMulti
	// 						// value={formData?.value}
	// 						setValue={val => setFormData(prev => ({ ...prev, value: val }))}
	// 						height={"auto"}
	// 						isNotScrollable
	// 						menuOnTop={filters?.length >= 4 ? true : false}
	// 					/>
	// 				);
	// 			} else {
	// 				const parseValue = value => {
	// 					return value.split(",");
	// 				};

	// 				return (
	// 					<Input
	// 						placeholder={"Enter value seprated by comma (,)"}
	// 						value={formData?.value}
	// 						setValue={val => setFormData(prev => ({ ...prev, value: parseValue(val) }))}
	// 					/>
	// 				);
	// 			}

	// 		case "=":
	// 		case "!=":
	// 		case ">":
	// 		case "<":
	// 		case ">=":
	// 		case "<=":
	// 			if (formData.type === ALL_DATA_TYPE.DATE) {
	// 				return (
	// 					<Input
	// 						type="date"
	// 						className={styles.dateSelector}
	// 						value={formData}
	// 						setValue={setFormData}
	// 						CalenderClassName={styles.DateClassName}
	// 						name="value"
	// 						top={filters?.length >= 4 ? true : false}
	// 					/>
	// 				);
	// 			} else if (formData.type === ALL_DATA_TYPE.DATETIME) {
	// 				return (
	// 					<Input
	// 						type="datetime"
	// 						CalenderClassName={styles.CalenderClassName}
	// 						value={formData}
	// 						setValue={setFormData}
	// 						name="dateTime"
	// 						top={filters?.length >= 4 ? true : false}
	// 					/>
	// 				);
	// 			} else if (formData.type === ALL_DATA_TYPE.PICKLIST) {
	// 				const options = zohoFields.find(
	// 					f => f.name === formData.zoho_field
	// 				).picklistValues;

	// 				return (
	// 					<Select
	// 						options={options?.map(op => ({
	// 							label: op.display_value,
	// 							value: op.actual_value,
	// 						}))}
	// 						setValue={val => setFormData(prev => ({ ...prev, value: val }))}
	// 						value={formData.value}
	// 						menuOnTop={filters?.length >= 4 ? true : false}
	// 					/>
	// 				);
	// 			} else if (formData.type === ALL_DATA_TYPE.OWNER_LOOKUP) {
	// 				return (
	// 					<Select
	// 						options={zohoUsers
	// 							?.filter(zu => zu.integration_id)
	// 							?.map(zu => ({
	// 								label: `${zu.first_name ?? ""} ${zu.last_name ?? ""}`,
	// 								value: zu.integration_id ?? "",
	// 							}))}
	// 						value={formData?.value}
	// 						setValue={val => setFormData(prev => ({ ...prev, value: val }))}
	// 						menuOnTop={filters?.length >= 4 ? true : false}
	// 					/>
	// 				);
	// 			} else if (formData.type === ALL_DATA_TYPE.BOOLEAN) {
	// 				return (
	// 					<Select
	// 						options={Object.keys(BOOLEAN_OPTIONS).map(op => ({
	// 							label: op,
	// 							value: BOOLEAN_OPTIONS[op],
	// 						}))}
	// 						value={formData?.value}
	// 						setValue={val => setFormData(prev => ({ ...prev, value: val }))}
	// 						menuOnTop={filters?.length >= 4 ? true : false}
	// 					/>
	// 				);
	// 			} else {
	// 				return (
	// 					<Input
	// 						placeholder={"Type here"}
	// 						value={formData.value}
	// 						setValue={val => setFormData(prev => ({ ...prev, value: val }))}
	// 					/>
	// 				);
	// 			}

	// 		// no component any
	// 		case "is null":
	// 		case "is not null":
	// 			return null;

	// 		case "like":
	// 		case "not like":
	// 			if (formData.type === ALL_DATA_TYPE.PICKLIST) {
	// 				const options = zohoFields.find(
	// 					f => f.name === formData.zoho_field
	// 				).picklistValues;

	// 				return (
	// 					<div className={styles.withMetaData}>
	// 						{formData.operator !== "not like" && (
	// 							<Select
	// 								value={formData?.metaData}
	// 								options={Object.keys(LIKE_META_DATA).map(like => ({
	// 									label: like,
	// 									value: LIKE_META_DATA[like],
	// 								}))}
	// 								setValue={val => setFormData(prev => ({ ...prev, metaData: val }))}
	// 								menuOnTop={filters?.length >= 4 ? true : false}
	// 							/>
	// 						)}
	// 						<Select
	// 							options={options?.map(op => ({
	// 								label: op.display_value,
	// 								value: op.actual_value,
	// 							}))}
	// 							// isMulti
	// 							setValue={val => setFormData(prev => ({ ...prev, value: val }))}
	// 							// height={"auto"}
	// 							// isNotScrollable
	// 							value={formData.value}
	// 							menuOnTop={filters?.length >= 4 ? true : false}
	// 						/>
	// 					</div>
	// 				);
	// 			} else {
	// 				return (
	// 					<div className={styles.withMetaData}>
	// 						{formData.operator !== "not like" && (
	// 							<Select
	// 								value={formData?.metaData}
	// 								options={Object.keys(LIKE_META_DATA).map(like => ({
	// 									label: like,
	// 									value: LIKE_META_DATA[like],
	// 								}))}
	// 								setValue={val => setFormData(prev => ({ ...prev, metaData: val }))}
	// 								menuOnTop={filters?.length >= 4 ? true : false}
	// 							/>
	// 						)}
	// 						<Input
	// 							placeholder={"Type here"}
	// 							value={formData.value}
	// 							setValue={val => setFormData(prev => ({ ...prev, value: val }))}
	// 						/>
	// 					</div>
	// 				);
	// 			}

	// 		case "between":
	// 		case "not between":
	// 			if (formData.type === ALL_DATA_TYPE.DATETIME) {
	// 				return (
	// 					<Input
	// 						type="datetimerange"
	// 						CalenderClassName={styles.CalenderClassName}
	// 						value={formData.datetimerange}
	// 						setValue={setFormData}
	// 						name="datetimerange"
	// 						top={filters?.length >= 4 ? true : false}
	// 					/>
	// 				);
	// 			} else if (formData.type === ALL_DATA_TYPE.CURRENCY) {
	// 				return (
	// 					<div className={styles.betweenCompo}>
	// 						<div>
	// 							<Input
	// 								placeholder={"From"}
	// 								value={formData?.value?.start ?? ""}
	// 								setValue={val =>
	// 									setFormData(prev => ({
	// 										...prev,
	// 										value: { ...prev?.value, start: val },
	// 									}))
	// 								}
	// 							/>
	// 						</div>
	// 						<div>
	// 							<Input
	// 								placeholder={"To"}
	// 								value={formData?.value?.end ?? ""}
	// 								setValue={val =>
	// 									setFormData(prev => ({
	// 										...prev,
	// 										value: { ...prev?.value, end: val },
	// 									}))
	// 								}
	// 							/>
	// 						</div>
	// 					</div>
	// 				);
	// 			} else if (formData.type === ALL_DATA_TYPE.DATE) {
	// 				return (
	// 					<Input
	// 						placeholder={"dd/mm/yyyy - dd/mm/yyyy"}
	// 						value={formData?.daterange}
	// 						setValue={setFormData}
	// 						type={"daterange"}
	// 						name="daterange"
	// 						top={filters?.length >= 4 ? true : false}
	// 					/>
	// 				);
	// 			}
	// 			return (
	// 				<div className={styles.betweenCompo}>
	// 					<div>
	// 						<Input
	// 							placeholder={"From"}
	// 							value={formData?.value?.start ?? ""}
	// 							setValue={val =>
	// 								setFormData(prev => ({
	// 									...prev,
	// 									value: { ...prev?.value, start: val },
	// 								}))
	// 							}
	// 						/>
	// 					</div>
	// 					<div>
	// 						<Input
	// 							placeholder={"To"}
	// 							value={formData?.value?.end ?? ""}
	// 							setValue={val =>
	// 								setFormData(prev => ({ ...prev, value: { ...prev?.value, end: val } }))
	// 							}
	// 						/>
	// 					</div>
	// 				</div>
	// 			);

	// 		default:
	// 			return (
	// 				<Input
	// 					placeholder={"Type here..."}
	// 					value={formData?.value}
	// 					setValue={val => setFormData(prev => ({ ...prev, value: val }))}
	// 				/>
	// 			);
	// 	}
	// };

	const onSave = Id => {
		if (!formData.field) {
			return addError({ text: "Please select a field name." });
		}
		// else if (!formData.operator) {
		// 	return addError("Please Select an operator name.");
		// }
		else if (formData.type === SUPPORTED_TYPES.DATE_RANGE) {
			if (!formData.daterange.starts && !formData.daterange.ends) {
				return addError({ text: "Please enter a valid date." });
			} else if (!formData.daterange.starts) {
				return addError({ text: "Please enter a valid start date." });
			} else if (!formData.daterange.ends) {
				return addError({ text: "Please enter a valid end date." });
			}
		} else if (formData.type === SUPPORTED_TYPES.DATE_TIME_RANGE) {
			if (
				!formData.datetimerange.date.starts ||
				!formData.datetimerange.date.ends ||
				!formData.datetimerange.time.starts ||
				!formData.datetimerange.time.ends
			) {
				return addError({ text: "Please enter a valid date and time." });
			}
		} else if (formData.type === SUPPORTED_TYPES.MULTIPLE_INPUTS) {
			if (
				formData.value.find(
					item => !Number.isInteger(Number(item)) || !(Number(item) > 0)
				) === "" ||
				formData.value.find(
					item => !Number.isInteger(Number(item)) || !(Number(item) > 0)
				)
			)
				return addError({ text: "Value should be positive integer" });
		} else if (!formData.value) {
			return addError({ text: "Please enter some value" });
		}

		// else if (
		// 	formData.type === ALL_DATA_TYPE.DATE &&
		// 	BASICS_OPEARATOS.includes(formData.operator)
		// ) {
		// 	if (!formData.value) return addError("Please enter a valid date.");
		// } else if (
		// 	formData.type === ALL_DATA_TYPE.DATE &&
		// 	BETWEEN_OPERATORS.includes(formData.operator)
		// ) {
		// 	if (!formData.daterange.start && !formData.daterange.end) {
		// 		return addError("Please enter a valid date.");
		// 	} else if (!formData.daterange.start) {
		// 		return addError("Please enter a valid start date.");
		// 	} else if (!formData.daterange.end) {
		// 		return addError("Please enter a valid end date.");
		// 	}
		// } else if (
		// 	formData.type === ALL_DATA_TYPE.DATETIME &&
		// 	BASICS_OPEARATOS.includes(formData.operator)
		// ) {
		// 	if (!Object.keys(formData.dateTime)?.some(f => formData.dateTime[f]))
		// 		return addError("Please enter a valid date and time.");
		// } else if (
		// 	formData.type === ALL_DATA_TYPE.DATETIME &&
		// 	BETWEEN_OPERATORS.includes(formData.operator)
		// ) {
		// 	if (!formData.datetimerange.date.start || !formData.datetimerange.date.end) {
		// 		return addError("Please enter a valid date and time.");
		// 	}
		// } else if (
		// 	(formData.type === ALL_DATA_TYPE.CURRENCY ||
		// 		formData.type === ALL_DATA_TYPE.NUMBER ||
		// 		formData.type === ALL_DATA_TYPE.INTEGER) &&
		// 	BETWEEN_OPERATORS.includes(formData.operator)
		// ) {
		// 	if (!formData?.value.start || !formData?.value.end)
		// 		return addError(
		// 			`Please enter a valid ${
		// 				zohoFields?.find(f => f.name === formData.zoho_field).label
		// 			}.`
		// 		);
		// } else {
		// 	if (typeof formData.value === "string" && !formData.value) {
		// 		if (
		// 			formData.operator !== All_SUPPORTED_OPERATOR.IS_NULL &&
		// 			formData.operator !== All_SUPPORTED_OPERATOR.IS_NOT_NULL
		// 		)
		// 			return addError(
		// 				`Please enter a valid ${
		// 					zohoFields?.find(f => f.name === formData.zoho_field).label
		// 				}.`
		// 			);
		// 	} else if (Array.isArray(formData.value) && !formData?.value?.length) {
		// 		if (
		// 			formData.operator !== All_SUPPORTED_OPERATOR.IS_NULL &&
		// 			formData.operator !== All_SUPPORTED_OPERATOR.IS_NOT_NULL
		// 		)
		// 			return addError(
		// 				`Please enter a valid ${
		// 					zohoFields?.find(f => f.name === formData.zoho_field).label
		// 				}.`
		// 			);
		// 	} else if (
		// 		!Array.isArray(formData.value) &&
		// 		typeof formData.value === "object" &&
		// 		!Object?.keys(formData.value)?.length
		// 	) {
		// 		if (
		// 			formData.operator !== All_SUPPORTED_OPERATOR.IS_NULL &&
		// 			formData.operator !== All_SUPPORTED_OPERATOR.IS_NOT_NULL
		// 		)
		// 			return addError(
		// 				`Please enter a valid ${
		// 					zohoFields?.find(f => f.name === formData.zoho_field).label
		// 				}.`
		// 			);
		// 	}
		// }

		setFilters(prev => {
			!(editable === formData.field) && delete prev[editable];
			return {
				...prev,
				[formData.field]:
					formData.type === SUPPORTED_TYPES.DATE_RANGE
						? {
								start: parseDate(formData.daterange.starts),
								end: parseDate(formData.daterange.ends),
						  }
						: formData.type === SUPPORTED_TYPES.DATE_TIME_RANGE
						? {
								start: parseDateTime(formData.datetimerange, "starts"),
								end: parseDateTime(formData.datetimerange, "ends"),
						  }
						: formData.value,
			};
		});
		// setCreateFilter(prev => createFilter?.filter(f => f.id !== Id));
		showAddFilterBtn(true);
		setEditable(null);

		setFormData({
			field: "",
			// operator: "",
			value: "",
			type: "",
		});
	};
	console.log(formData);
	const onCancel = Id => {
		// setCreateFilter(prev => createFilter?.filter(f => f.id !== Id));
		showAddFilterBtn(true);
		editable && setEditable(null);
		setFormData({
			field: "",
			// operator: "",
			value: "",
			type: "",
		});
	};
	console.log(filters, "Filters538");
	return (
		<div className={styles.eachFilterCard}>
			<div className={styles.top}>
				<div className={`${styles.inputFields} ${styles.fieldNameInput}`}>
					<Label>Field name</Label>
					<Select
						value={formData?.field}
						setValue={val => {
							console.log(
								val,
								SUPPORTED_FIELDS?.find(f => f.value === val),
								"Hi"
							);

							setFormData(prev => ({
								...prev,
								field: val,
								value: "",
								type: SUPPORTED_FIELDS?.find(f => f.value === val)?.type,
								daterange: { starts: "", ends: "" },
								datetimerange: {
									date: { starts: "", ends: "" },
									time: { starts: "", ends: "" },
								},
							}));
						}}
						isSearchable
						// options={zohoFields?.map(zf => ({ label: zf.label, value: zf.name }))}
						options={SUPPORTED_FIELDS.filter(
							field =>
								!Object.keys(filters).includes(field.value) || editable === field.value
						)}
						menuOnTop={Object.keys(filters)?.length >= 4 ? true : false}
					/>
				</div>

				{/* {getOperator(formData?.type) && (
					<div className={`${styles.inputFields}`}>
						<Label>Operator</Label>
						<Select
							value={formData?.operator}
							isSearchable
							options={
								formData?.type &&
								Object?.keys(getOperator(formData.type))?.map(op => ({
									label: op,
									value: getOperator(formData.type)[op],
								}))
							}
							setValue={val => setFormData(prev => ({ ...prev, operator: val }))}
							menuOnTop={filters?.length >= 4 ? true : false}
						/>
					</div>
				)} */}

				<div className={`${styles.inputFields}`}>
					{renderInput(formData?.type) && <Label>Value</Label>}
					{renderInput(formData?.type)}
				</div>
			</div>

			<div className={styles.footer}>
				<Button className={styles.btnSave} onClick={() => onSave()}>
					{!editable ? "Save" : "Update"}
				</Button>
				<Button className={styles.btnCancel} onClick={() => onCancel()}>
					Cancel
				</Button>
			</div>
		</div>
	);
};

export default EachFilters;
