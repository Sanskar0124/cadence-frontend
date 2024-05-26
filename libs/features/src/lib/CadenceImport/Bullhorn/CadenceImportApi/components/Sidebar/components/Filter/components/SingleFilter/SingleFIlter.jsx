import React, { useContext, useState } from "react";
import styles from "./SingleFilter.module.scss";
import moment from "moment-timezone";
import { Label, Select } from "@cadence-frontend/widgets";
import { Button } from "@cadence-frontend/components";
import { v4 as uuidv4 } from "uuid";

import {
	BASICS_OPEARATOS,
	MULTIPLE_VALUE_SUPPORT,
	VIEWS,
	ALL_DATATYPE,
	All_SUPPORTED_OPERATOR,
} from "../../../constants";
import { MessageContext } from "@cadence-frontend/contexts";
import { renderInput, getOperator } from "../../utils";

const SingleFilter = ({
	bullhornFields,
	leadType,
	dataTypes,
	showAddFilterBtn,
	filters,
	setFilters,
	singleFilter,
	createFilter,
	setCreateFilter,
}) => {
	const [formData, setFormData] = useState({
		bullhorn_field: "",
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
		if (!formData.bullhorn_field) {
			return addError({ text: "Please select a field name." });
		} else if (leadType !== "candidate" && !formData.operator) {
			return addError({ text: "Please Select an operator name." });
		} else if (
			leadType !== VIEWS.CANDIDATE &&
			formData.type !== ALL_DATATYPE.DATE &&
			formData.type !== ALL_DATATYPE.DATETIME &&
			formData.type !== ALL_DATATYPE.SYSTEM &&
			BASICS_OPEARATOS.includes(formData.operator) &&
			!formData.value?.trim()
		) {
			return addError({
				text: `Please enter a valid ${
					bullhornFields
						?.find(f => f.name === formData.bullhorn_field)
						?.label.toLowerCase() ?? "input"
				}.`,
			});
		} else if (
			leadType !== VIEWS.CANDIDATE &&
			formData.type !== ALL_DATATYPE.DATE &&
			formData.type !== ALL_DATATYPE.DATETIME &&
			formData.type !== ALL_DATATYPE.SYSTEM &&
			!formData.value.length &&
			MULTIPLE_VALUE_SUPPORT.includes(formData.operator)
		) {
			return addError({
				text: `Please enter a valid ${
					bullhornFields
						?.find(f => f.name === formData.bullhorn_field)
						?.label.toLowerCase() ?? "input"
				}.`,
			});
		} else if (
			(formData.type === ALL_DATATYPE.DATE || formData.type === ALL_DATATYPE.SYSTEM) &&
			formData.operator !== All_SUPPORTED_OPERATOR.IS_EMPTY &&
			formData.operator !== All_SUPPORTED_OPERATOR.IS_NOT_EMPTY &&
			formData.operator !== All_SUPPORTED_OPERATOR.IS_NULL &&
			formData.operator !== All_SUPPORTED_OPERATOR.IS_NOT_NULL &&
			!formData.value
		) {
			return addError({
				text: `Please enter a valid ${
					bullhornFields
						?.find(f => f.name === formData.bullhorn_field)
						?.label.toLowerCase() ?? "input"
				}.`,
			});
		} else if (formData.type === ALL_DATATYPE.DATETIME && !formData.dateTime) {
			return addError({
				text: `Please enter a valid ${
					bullhornFields
						?.find(f => f.name === formData.bullhorn_field)
						?.label.toLowerCase() ?? "input"
				}.`,
			});
		} else if (
			leadType === VIEWS.CANDIDATE &&
			!formData.value &&
			formData.type !== ALL_DATATYPE.DATETIME
		) {
			return addError({
				text: `Please enter a valid ${
					bullhornFields
						?.find(f => f.name === formData.bullhorn_field)
						?.label.toLowerCase() ?? "input"
				}.`,
			});
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
			bullhorn_field: "",
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
	};

	const onCancel = Id => {
		setCreateFilter(prev => ({
			...prev,
			[leadType]: createFilter?.filter(f => f.id !== Id),
		}));
		showAddFilterBtn(true);

		setFormData({
			bullhorn_field: "",
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
	};

	return (
		<div className={styles.singleFilterCard}>
			<div className={styles.top}>
				<div className={`${styles.inputFields} ${styles.fieldNameInput}`}>
					<Label>Field name</Label>
					<Select
						value={formData?.bullhorn_field}
						setValue={val =>
							setFormData(prev => ({
								...prev,
								bullhorn_field: val,
								type: bullhornFields?.find(f => f.name === val)?.dataType,
							}))
						}
						isSearchable
						options={bullhornFields?.map(bf => ({ label: bf.label, value: bf.name }))}
						menuOnTop={filters[leadType]?.length >= 3 ? true : false}
						className={styles.selectFields}
					/>
				</div>
			</div>

			{getOperator(formData?.type) && leadType !== VIEWS.CANDIDATE && (
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
						className={styles.selectFields}
					/>
				</div>
			)}

			{formData.operator !== All_SUPPORTED_OPERATOR.IS_NULL &&
				formData.operator !== All_SUPPORTED_OPERATOR.IS_NOT_NULL &&
				formData.operator !== All_SUPPORTED_OPERATOR.IS_EMPTY &&
				formData.operator !== All_SUPPORTED_OPERATOR.IS_NOT_EMPTY && (
					<div className={`${styles.inputFields}`}>
						<Label>Value</Label>
						{renderInput(
							formData,
							setFormData,
							styles,
							filters,
							leadType,
							bullhornFields
						)}
					</div>
				)}

			<div className={styles.footer}>
				<Button className={styles.btnSave} onClick={() => onSave(singleFilter.id)}>
					Save
				</Button>
				<Button className={styles.btnCancel} onClick={() => onCancel(singleFilter.id)}>
					Cancel
				</Button>
			</div>
		</div>
	);
};

export default SingleFilter;
