import { Button } from "@cadence-frontend/components";
import { MessageContext } from "@cadence-frontend/contexts";
import { Input, Label, Select } from "@cadence-frontend/widgets";
import moment from "moment-timezone";
import React, { useState, useContext } from "react";
import { v4 as uuidv4 } from "uuid";
import {
	BASICS_OPEARATOS,
	ALL_DATA_TYPE,
	BETWEEN_OPERATORS,
	All_SUPPORTED_OPERATOR,
} from "../../constant";
import { getOperator, renderInput } from "../utils";
import styles from "./EachFilter.module.scss";

const EachFilters = ({
	zohoFields,
	leadType,
	dataTypes,
	showAddFilterBtn,
	filters,
	setFilters,
	eachF,
	createFilter,
	setCreateFilter,
	zohoUsers,
}) => {
	const [formData, setFormData] = useState({
		zoho_field: "",
		operator: "",
		value: "",
		type: "",
		dateTime: {
			DD: moment().format("DD"),
			MM: moment().format("MM"),
			YYYY: moment().format("YYYY"),
			time: `${moment().format("HH")}:${moment().format("mm")}`,
		},
		daterange: { starts: "", ends: "" },
		datetimerange: { date: { starts: "", ends: "" }, time: { starts: "", ends: "" } },
	});

	const { addError, addSuccess } = useContext(MessageContext);

	const onSave = Id => {
		if (!formData.zoho_field) {
			return addError({ text: "Please select a field name." });
		} else if (!formData.operator) {
			return addError({ text: "Please Select an operator name." });
		} else if (
			formData.type === ALL_DATA_TYPE.DATE &&
			BASICS_OPEARATOS.includes(formData.operator)
		) {
			if (!formData.value) return addError({ text: "Please enter a valid date." });
		} else if (
			formData.type === ALL_DATA_TYPE.DATE &&
			BETWEEN_OPERATORS.includes(formData.operator)
		) {
			if (!formData.daterange.starts && !formData.daterange.ends) {
				return addError({ text: "Please enter a valid date." });
			} else if (!formData.daterange.starts) {
				return addError({ text: "Please enter a valid starts date." });
			} else if (!formData.daterange.ends) {
				return addError({ text: "Please enter a valid end date." });
			}
		} else if (
			formData.type === ALL_DATA_TYPE.DATETIME &&
			BASICS_OPEARATOS.includes(formData.operator)
		) {
			if (!Object.keys(formData.dateTime)?.some(f => formData.dateTime[f]))
				return addError({ text: "Please enter a valid date and time." });
		} else if (
			formData.type === ALL_DATA_TYPE.DATETIME &&
			BETWEEN_OPERATORS.includes(formData.operator)
		) {
			if (!formData.datetimerange.date.starts || !formData.datetimerange.date.ends) {
				return addError({ text: "Please enter a valid date and time." });
			}
		} else if (
			(formData.type === ALL_DATA_TYPE.CURRENCY ||
				formData.type === ALL_DATA_TYPE.NUMBER ||
				formData.type === ALL_DATA_TYPE.INTEGER) &&
			BETWEEN_OPERATORS.includes(formData.operator)
		) {
			if (!formData?.value.starts || !formData?.value.ends)
				return addError({
					text: `Please enter a valid ${
						zohoFields?.find(f => f.name === formData.zoho_field).label
					}.`,
				});
		} else {
			if (typeof formData.value === "string" && !formData.value) {
				if (
					formData.operator !== All_SUPPORTED_OPERATOR.IS_NULL &&
					formData.operator !== All_SUPPORTED_OPERATOR.IS_NOT_NULL
				)
					return addError({
						text: `Please enter a valid ${
							zohoFields?.find(f => f.name === formData.zoho_field).label
						}.`,
					});
			} else if (Array.isArray(formData.value) && !formData?.value?.length) {
				if (
					formData.operator !== All_SUPPORTED_OPERATOR.IS_NULL &&
					formData.operator !== All_SUPPORTED_OPERATOR.IS_NOT_NULL
				)
					return addError({
						text: `Please enter a valid ${
							zohoFields?.find(f => f.name === formData.zoho_field).label
						}.`,
					});
			} else if (
				!Array.isArray(formData.value) &&
				typeof formData.value === "object" &&
				!Object?.keys(formData.value)?.length
			) {
				if (
					formData.operator !== All_SUPPORTED_OPERATOR.IS_NULL &&
					formData.operator !== All_SUPPORTED_OPERATOR.IS_NOT_NULL
				)
					return addError({
						text: `Please enter a valid ${
							zohoFields?.find(f => f.name === formData.zoho_field).label
						}.`,
					});
			}
		}

		setFilters(prev => ({
			...prev,
			[leadType]: [...prev[leadType], { ...formData, id: uuidv4() }],
		}));
		setCreateFilter(prev => ({
			...prev,
			[leadType]: createFilter?.filter(f => f.id !== Id),
		}));
		showAddFilterBtn(true);

		setFormData({
			zoho_field: "",
			operator: "",
			value: "",
			type: "",
		});
	};
	const onCancel = Id => {
		setCreateFilter(prev => ({
			...prev,
			[leadType]: createFilter?.filter(f => f.id !== Id),
		}));
		showAddFilterBtn(true);

		setFormData({
			zoho_field: "",
			operator: "",
			value: "",
			type: "",
		});
	};

	return (
		<div className={styles.eachFilterCard}>
			<div className={styles.top}>
				<div className={`${styles.inputFields} ${styles.fieldNameInput}`}>
					<Label>Field name</Label>
					<Select
						value={formData?.zoho_field}
						setValue={val =>
							setFormData(prev => ({
								...prev,
								zoho_field: val,
								type: zohoFields?.find(f => f.name === val)?.type,
							}))
						}
						isSearchable
						options={zohoFields?.map(zf => ({ label: zf.label, value: zf.name }))}
						menuOnTop={filters[leadType]?.length >= 3 ? true : false}
					/>
				</div>

				{getOperator(formData?.type) && (
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
							menuOnTop={filters[leadType]?.length >= 3 ? true : false}
						/>
					</div>
				)}

				<div className={`${styles.inputFields}`}>
					{renderInput(
						formData,
						setFormData,
						zohoFields,
						filters,
						leadType,
						zohoUsers,
						styles
					) && <Label>Value</Label>}
					{renderInput(
						formData,
						setFormData,
						zohoFields,
						filters,
						leadType,
						zohoUsers,
						styles
					)}
				</div>
			</div>

			<div className={styles.footer}>
				<Button className={styles.btnSave} onClick={() => onSave(eachF.id)}>
					Save
				</Button>
				<Button className={styles.btnCancel} onClick={() => onCancel(eachF.id)}>
					Cancel
				</Button>
			</div>
		</div>
	);
};

export default EachFilters;
