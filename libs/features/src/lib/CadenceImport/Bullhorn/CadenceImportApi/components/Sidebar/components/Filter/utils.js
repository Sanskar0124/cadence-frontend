import { Input, Select } from "@cadence-frontend/widgets";
import {
	All_SUPPORTED_OPERATOR,
	SUPPORTED_DATATYPES,
	DATETIME_OPERATOR,
	TEXT_OPERATORS,
	BOOLEAN_OPERATORS,
	BOOLEAN_VALUES,
} from "../constants";

export const parseArray = array => {
	let arr = array?.map(flr => {
		if (
			flr.operator === All_SUPPORTED_OPERATOR.IS_NULL ||
			flr.operator === All_SUPPORTED_OPERATOR.IS_NOT_NULL
		) {
			return { ...flr, value: "" };
		} else {
			return flr;
		}
	});
	return arr;
};

export const getOperator = dataTypes => {
	if (SUPPORTED_DATATYPES?.includes(dataTypes)) {
		switch (dataTypes) {
			case "DATE":
			case "DATETIME":
			case "SYSTEM":
				return DATETIME_OPERATOR;

			case "String":
			case "Integer":
			case "BigDecimal":
			case "Double":
			case "SELECT":
				return TEXT_OPERATORS;

			case "Boolean":
				return BOOLEAN_OPERATORS;
		}
	} else {
		return true;
	}
};

export const renderInput = (
	formData,
	setFormData,
	styles,
	filters,
	leadType,
	bullhornFields
) => {
	if (leadType === "candidate") {
		switch (formData.type) {
			case "String":
			case "Integer":
			case "BigDescimal":
			case "Double":
				return (
					<Input
						placeholder={"Type here..."}
						value={formData?.value}
						setValue={val => setFormData(prev => ({ ...prev, value: val }))}
					/>
				);

			case "DATE":
			case "SYSTEM":
				return (
					<Input
						type="date"
						className={styles.dateSelector}
						value={formData}
						setValue={setFormData}
						CalenderClassName={styles.DateClassName}
						name="value"
						top={filters[leadType]?.length >= 4 ? true : false}
					/>
				);

			case "DATETIME":
				return (
					<Input
						type="datetime"
						CalenderClassName={styles.CalenderClassName}
						value={formData}
						setValue={setFormData}
						name="dateTime"
						top={filters[leadType]?.length >= 4 ? true : false}
					/>
				);

			case "SELECT": {
				const options = bullhornFields?.find(
					f => f.name === formData.bullhorn_field
				)?.picklistValues;

				return (
					<Select
						value={formData.value}
						setValue={val => setFormData(prev => ({ ...prev, value: val }))}
						isSearchable
						options={options?.map(op => ({
							label: op.label,
							value: op.value,
						}))}
						menuOnTop={filters[leadType]?.length >= 4 ? true : false}
					/>
				);
			}

			case "Boolean": {
				return (
					<Select
						value={formData.value}
						setValue={val => setFormData(prev => ({ ...prev, value: val }))}
						isSearchable
						options={Object?.keys(BOOLEAN_VALUES)?.map(op => ({
							label: op,
							value: BOOLEAN_VALUES[op],
						}))}
						menuOnTop={filters[leadType]?.length >= 4 ? true : false}
					/>
				);
			}

			default:
				return (
					<Input
						placeholder={"Type here..."}
						value={formData?.value}
						setValue={val => setFormData(prev => ({ ...prev, value: val }))}
					/>
				);
		}
	} else {
		switch (formData.operator) {
			case "=":
			case "<>":
			case ">":
			case "<":
			case ">=":
			case "<=":
				if (formData.type === "DATE" || formData.type === "SYSTEM") {
					return (
						<Input
							type="date"
							className={styles.dateSelector}
							value={formData}
							setValue={setFormData}
							CalenderClassName={styles.DateClassName}
							name="value"
							top={filters[leadType]?.length >= 4 ? true : false}
						/>
					);
				} else if (formData.type === "DATETIME") {
					return (
						<Input
							type="datetime"
							CalenderClassName={styles.CalenderClassName}
							value={formData}
							setValue={setFormData}
							name="dateTime"
							top={filters[leadType]?.length >= 4 ? true : false}
						/>
					);
				} else if (formData.type === "SELECT") {
					const options = bullhornFields?.find(
						f => f.name === formData.bullhorn_field
					)?.picklistValues;

					return (
						<Select
							value={formData.value}
							setValue={val => setFormData(prev => ({ ...prev, value: val }))}
							isSearchable
							options={options?.map(op => ({
								label: op.label,
								value: op.value,
							}))}
							menuOnTop={filters[leadType]?.length >= 4 ? true : false}
						/>
					);
				} else if (formData.type === "Boolean") {
					return (
						<Select
							value={formData.value}
							setValue={val => setFormData(prev => ({ ...prev, value: val }))}
							isSearchable
							options={Object?.keys(BOOLEAN_VALUES)?.map(op => ({
								label: op,
								value: BOOLEAN_VALUES[op],
							}))}
							menuOnTop={filters[leadType]?.length >= 4 ? true : false}
						/>
					);
				} else {
					return (
						<Input
							placeholder={"Type here..."}
							value={formData?.value}
							setValue={val => setFormData(prev => ({ ...prev, value: val }))}
						/>
					);
				}

			case "is null":
			case "is not null":
			case "is empty":
			case "is not empty":
				return null;

			case "in":
			case "not in": {
				if (formData.type === "SELECT") {
					const options = bullhornFields.find(
						f => f.name === formData.bullhorn_field
					).picklistValues;
					return (
						<Select
							options={options?.map(op => ({
								label: op.label,
								value: op.value,
							}))}
							isMulti
							setValue={val => setFormData(prev => ({ ...prev, value: val }))}
							height={"auto"}
							isNotScrollable
							menuOnTop={filters[leadType]?.length >= 3 ? true : false}
							value={!Array.isArray(formData.value) ? [] : formData.value}
						/>
					);
				} else {
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
				}
			}

			default:
				return (
					<Input
						placeholder={"Type here..."}
						value={formData?.value}
						setValue={val => setFormData(prev => ({ ...prev, value: val }))}
					/>
				);
		}
	}
};
