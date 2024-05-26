import { Input, Select } from "@cadence-frontend/widgets";
import {
	ALL_DATA_TYPE,
	BOOLEAN_OPERATORS,
	BOOLEAN_OPTIONS,
	DATETIME_OPERATOR,
	DATE_OPERATORS,
	LOOKUP_OPERATORS,
	SUPPORTED_DATATYPES,
	TEXT_OPERATORS,
	LIKE_META_DATA,
} from "../constant";

export const getOperator = dataTypes => {
	if (SUPPORTED_DATATYPES?.includes(dataTypes)) {
		switch (dataTypes) {
			case "currency":
			case "number":
			case "integer":
				return DATE_OPERATORS;

			case "date":
			case "datetime":
				return DATETIME_OPERATOR;

			case "text":
			case "picklist":
				return TEXT_OPERATORS;

			case "lookup":
			case "ownerlookup":
				return LOOKUP_OPERATORS;

			case "boolean":
				return BOOLEAN_OPERATORS;

			case "phone":
			case "textarea":
			case "website":
			case "email":
				return TEXT_OPERATORS;
		}
	} else {
		return true;
	}
};

export const renderInput = (
	formData,
	setFormData,
	zohoFields,
	filters,
	leadType,
	zohoUsers,
	styles
) => {
	switch (formData.operator) {
		// Multiple component only
		case "in":
		case "not in":
			if (formData.type === ALL_DATA_TYPE.PICKLIST) {
				const options = zohoFields.find(
					f => f.name === formData.zoho_field
				).picklistValues;

				return (
					<Select
						options={options?.map(op => ({
							label: op.display_value,
							value: op.actual_value,
						}))}
						isMulti
						setValue={val => setFormData(prev => ({ ...prev, value: val }))}
						height={"auto"}
						isNotScrollable
						menuOnTop={filters[leadType]?.length >= 3 ? true : false}
						value={!Array.isArray(formData.value) ? [] : formData.value}
					/>
				);
			} else if (formData.type === ALL_DATA_TYPE.OWNER_LOOKUP) {
				return (
					<Select
						options={zohoUsers
							?.filter(zu => zu.integration_id)
							?.map(zu => ({
								label: `${zu.first_name} ${zu.last_name}`,
								value: zu.integration_id,
							}))}
						isMulti
						value={!Array.isArray(formData.value) ? [] : formData.value}
						setValue={val => setFormData(prev => ({ ...prev, value: val }))}
						height={"auto"}
						isNotScrollable
						menuOnTop={filters[leadType]?.length >= 3 ? true : false}
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

		case "=":
		case "!=":
		case ">":
		case "<":
		case ">=":
		case "<=":
			if (formData.type === ALL_DATA_TYPE.DATE) {
				return (
					<Input
						type="date"
						className={styles.dateSelector}
						value={formData}
						setValue={setFormData}
						CalenderClassName={styles.DateClassName}
						name="value"
						top={filters[leadType]?.length >= 3 ? true : false}
					/>
				);
			} else if (formData.type === ALL_DATA_TYPE.DATETIME) {
				return (
					<Input
						type="datetime"
						CalenderClassName={styles.CalenderClassName}
						value={formData}
						setValue={setFormData}
						name="dateTime"
						top={filters[leadType]?.length >= 3 ? true : false}
					/>
				);
			} else if (formData.type === ALL_DATA_TYPE.PICKLIST) {
				const options = zohoFields.find(
					f => f.name === formData.zoho_field
				).picklistValues;

				return (
					<Select
						options={options?.map(op => ({
							label: op.display_value,
							value: op.actual_value,
						}))}
						setValue={val => setFormData(prev => ({ ...prev, value: val }))}
						value={formData.value}
						menuOnTop={filters[leadType]?.length >= 3 ? true : false}
					/>
				);
			} else if (formData.type === ALL_DATA_TYPE.OWNER_LOOKUP) {
				return (
					<Select
						options={zohoUsers
							?.filter(zu => zu.integration_id)
							?.map(zu => ({
								label: `${zu.first_name ?? ""} ${zu.last_name ?? ""}`,
								value: zu.integration_id ?? "",
							}))}
						value={formData?.value}
						setValue={val => setFormData(prev => ({ ...prev, value: val }))}
						menuOnTop={filters[leadType]?.length >= 3 ? true : false}
					/>
				);
			} else if (formData.type === ALL_DATA_TYPE.BOOLEAN) {
				return (
					<Select
						options={Object.keys(BOOLEAN_OPTIONS).map(op => ({
							label: op,
							value: BOOLEAN_OPTIONS[op],
						}))}
						value={formData?.value}
						setValue={val => setFormData(prev => ({ ...prev, value: val }))}
						menuOnTop={filters[leadType]?.length >= 3 ? true : false}
					/>
				);
			} else {
				return (
					<Input
						placeholder={"Type here"}
						value={formData.value}
						setValue={val => setFormData(prev => ({ ...prev, value: val }))}
					/>
				);
			}

		// no component any
		case "is null":
		case "is not null":
			return null;

		case "like":
		case "not like":
			if (formData.type === ALL_DATA_TYPE.PICKLIST) {
				const options = zohoFields.find(
					f => f.name === formData.zoho_field
				).picklistValues;

				return (
					<div className={styles.withMetaData}>
						{formData.operator !== "not like" && (
							<Select
								value={formData?.metaData}
								options={Object.keys(LIKE_META_DATA).map(like => ({
									label: like,
									value: LIKE_META_DATA[like],
								}))}
								setValue={val => setFormData(prev => ({ ...prev, metaData: val }))}
								menuOnTop={filters[leadType]?.length >= 3 ? true : false}
							/>
						)}
						<Select
							options={options?.map(op => ({
								label: op.display_value,
								value: op.actual_value,
							}))}
							// isMulti
							setValue={val => setFormData(prev => ({ ...prev, value: val }))}
							// height={"auto"}
							// isNotScrollable
							value={formData.value}
							menuOnTop={filters[leadType]?.length >= 3 ? true : false}
						/>
					</div>
				);
			} else {
				return (
					<div className={styles.withMetaData}>
						{formData.operator !== "not like" && (
							<Select
								value={formData?.metaData}
								options={Object.keys(LIKE_META_DATA).map(like => ({
									label: like,
									value: LIKE_META_DATA[like],
								}))}
								setValue={val => setFormData(prev => ({ ...prev, metaData: val }))}
								menuOnTop={filters[leadType]?.length >= 3 ? true : false}
							/>
						)}
						<Input
							placeholder={"Type here"}
							value={formData.value}
							setValue={val => setFormData(prev => ({ ...prev, value: val }))}
						/>
					</div>
				);
			}

		case "between":
		case "not between":
			if (formData.type === ALL_DATA_TYPE.DATETIME) {
				return (
					<Input
						type="datetimerange"
						CalenderClassName={styles.CalenderClassName}
						value={formData.datetimerange}
						setValue={setFormData}
						name="datetimerange"
						top={filters[leadType]?.length >= 3 ? true : false}
					/>
				);
			} else if (formData.type === ALL_DATA_TYPE.CURRENCY) {
				return (
					<div className={styles.betweenCompo}>
						<div>
							<Input
								placeholder={"From"}
								value={formData?.value?.starts ?? ""}
								setValue={val =>
									setFormData(prev => ({
										...prev,
										value: { ...prev?.value, starts: val },
									}))
								}
							/>
						</div>
						<div>
							<Input
								placeholder={"To"}
								value={formData?.value?.ends ?? ""}
								setValue={val =>
									setFormData(prev => ({
										...prev,
										value: { ...prev?.value, ends: val },
									}))
								}
							/>
						</div>
					</div>
				);
			} else if (formData.type === ALL_DATA_TYPE.DATE) {
				return (
					<Input
						placeholder={"dd/mm/yyyy - dd/mm/yyyy"}
						value={formData?.daterange}
						setValue={setFormData}
						type={"daterange"}
						name="daterange"
						top={filters[leadType]?.length >= 3 ? true : false}
					/>
				);
			}
			return (
				<div className={styles.betweenCompo}>
					<div>
						<Input
							placeholder={"From"}
							value={formData?.value?.starts ?? ""}
							setValue={val =>
								setFormData(prev => ({
									...prev,
									value: { ...prev?.value, starts: val },
								}))
							}
						/>
					</div>
					<div>
						<Input
							placeholder={"To"}
							value={formData?.value?.ends ?? ""}
							setValue={val =>
								setFormData(prev => ({ ...prev, value: { ...prev?.value, ends: val } }))
							}
						/>
					</div>
				</div>
			);

		default:
			return (
				<Input
					placeholder={"Type here..."}
					value={formData?.value}
					setValue={val => setFormData(prev => ({ ...prev, value: val }))}
				/>
			);
	}
};
