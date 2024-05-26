import { Label } from "recharts";
import styles from "./UpdateFilter.module.scss";
import { Select } from "@cadence-frontend/widgets";
import { useState, useEffect, useContext } from "react";
import moment from "moment-timezone";
import { getOperator, renderInput } from "../../utils";
import { Button } from "@cadence-frontend/components";
import {
	All_SUPPORTED_OPERATOR,
	BASICS_OPEARATOS,
	MULTIPLE_VALUE_SUPPORT,
	ALL_DATATYPE,
	VIEWS,
} from "../../../constants";
import { MessageContext } from "@cadence-frontend/contexts";

const UpdateFilter = ({
	setUpdateView,
	bullhornFields,
	filters,
	leadType,
	currentFilter,
	setFilters,

	index,
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

	useEffect(() => {
		const getValues = currentFilter => {
			if (leadType === VIEWS.CANDIDATE) {
				return currentFilter.value;
			} else {
				switch (currentFilter.operator) {
					case All_SUPPORTED_OPERATOR.IS_NULL:
					case All_SUPPORTED_OPERATOR.IS_NOT_NULL:
					case All_SUPPORTED_OPERATOR.IS_EMPTY:
					case All_SUPPORTED_OPERATOR.IS_NOT_EMPTY:
						return "";
					case All_SUPPORTED_OPERATOR.EQUAL:
					case All_SUPPORTED_OPERATOR.NOT_EQUAL:
					case All_SUPPORTED_OPERATOR.GREATER_THAN:
					case All_SUPPORTED_OPERATOR.LESS_THAN:
					case All_SUPPORTED_OPERATOR.GREATER_THAN_OR_EUQAL_TO:
					case All_SUPPORTED_OPERATOR.LESS_THAN_OR_EUQAL_TO:
						if (currentFilter.type === ALL_DATATYPE.DATE) {
							return currentFilter.value;
						} else if (currentFilter.type === ALL_DATATYPE.DATETIME) {
							return "";
						} else {
							return currentFilter.value;
						}

					case All_SUPPORTED_OPERATOR.IN:
					case All_SUPPORTED_OPERATOR.NOT_IN:
						if (currentFilter.type === ALL_DATATYPE.SELECT) {
							return currentFilter.value;
						} else {
							return currentFilter.value;
						}
				}
			}
		};

		setFormData(prev => ({
			...prev,
			bullhorn_field: currentFilter.bullhorn_field,
			operator: currentFilter.operator,
			type: bullhornFields?.find(f => f.name === currentFilter.bullhorn_field)?.dataType,
			value: getValues(currentFilter),
			dateTime:
				currentFilter.type === ALL_DATATYPE.DATETIME
					? currentFilter.dateTime
					: {
							DD: moment().format("DD"),
							MM: moment().format("MM"),
							YYYY: moment().format("YYYY"),
							time: `${moment().format("HH")}:${moment().format("mm")}`,
					  },
		}));
	}, [currentFilter]);
	//...(ll && {key: value})

	const onUpdate = () => {
		if (!formData.bullhorn_field) {
			return addError({ text: "Please select a field name." });
		} else if (leadType !== VIEWS.CANDIDATE && !formData.operator) {
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

		const updatedFilters = filters[leadType].map(filter => {
			if (filter.id === currentFilter.id) {
				return { ...filter, ...formData };
			} else {
				return filter;
			}
		});
		setFilters(prev => ({ ...prev, [leadType]: updatedFilters }));
		setUpdateView(false);
	};

	const onCancel = () => {
		setUpdateView(false);
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
						menuOnTop={index >= 4 ? true : false}
					/>
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
							menuOnTop={index >= 4 ? true : false}
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
			</div>
			<div className={styles.footer}>
				<Button className={styles.btnSave} onClick={() => onUpdate()}>
					Update
				</Button>
				<Button className={styles.btnCancel} onClick={() => onCancel()}>
					Cancel
				</Button>
			</div>
		</div>
	);
};

export default UpdateFilter;
