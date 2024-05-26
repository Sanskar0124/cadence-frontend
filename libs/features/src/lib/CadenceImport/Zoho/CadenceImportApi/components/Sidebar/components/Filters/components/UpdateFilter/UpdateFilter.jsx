import { Button } from "@cadence-frontend/components";
import { Label, Select } from "@cadence-frontend/widgets";
import moment from "moment-timezone";
import React, { useState, useEffect } from "react";
import { ALL_DATA_TYPE } from "../../constant";
import { getOperator, renderInput } from "../utils";

import styles from "./UpdateFilter.module.scss";

const UpdateFilter = ({
	setUpdateView,
	zohoFields,
	filters,
	leadType,
	currentFilter,
	setFilters,
	zohoUsers,
	index,
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

	console.log(formData);

	useEffect(() => {
		const getValues = currentFilter => {
			switch (currentFilter.operator) {
				case "is null":
				case "is not null":
					return "";

				case "=":
				case "!=":
				case ">":
				case "<":
				case ">=":
				case "<=":
					if (currentFilter.type === "datetime") {
						return "";
					} else {
						return currentFilter.value;
					}
				case "like":
					return currentFilter.value;
				case "not like":
					return currentFilter.value;

				case "in":
				case "not in":
					if (formData.type === ALL_DATA_TYPE.PICKLIST) {
						return currentFilter.value;
					} else if (formData.type === ALL_DATA_TYPE.OWNER_LOOKUP) {
						return currentFilter.value;
					} else {
						return currentFilter.value;
					}
			}
		};

		setFormData(prev => ({
			...prev,
			zoho_field: currentFilter.zoho_field,
			operator: currentFilter.operator,
			type: zohoFields?.find(f => f.name === currentFilter.zoho_field)?.type,
			value: getValues(currentFilter),
			dateTime: {
				DD: moment().format("DD"),
				MM: moment().format("MM"),
				YYYY: moment().format("YYYY"),
				time: `${moment().format("HH")}:${moment().format("mm")}`,
			},
			daterange: currentFilter.daterange ?? { starts: "", ends: "" },
			datetimerange: currentFilter.datetimerange ?? {
				date: { starts: "", ends: "" },
				time: { starts: "", ends: "" },
			},
			metaData: currentFilter.metaData,
		}));
	}, [currentFilter]);

	const onSave = Id => {
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

	const onCancel = Id => {
		setUpdateView(false);
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
						menuOnTop={index >= 3 ? true : false}
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
							menuOnTop={index >= 3 ? true : false}
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
				<Button className={styles.btnSave} onClick={() => onSave()}>
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
