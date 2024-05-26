import React, { useState, useEffect } from "react";
import styles from "./SelectedFilter.module.scss";
import { Minus } from "@cadence-frontend/icons";
import {
	All_OPERATOR,
	BASICS_OPEARATOS,
	All_SUPPORTED_OPERATOR,
	VIEWS,
	ALL_DATATYPE,
} from "../../../constants";
import UpdateFilter from "../UpdateFilter/UpdateFilter";

const SelectedFilter = ({
	bullhornFields,
	dataTypes,
	leadType,
	setFilters,
	filters,
	singleFilter,
	index,
}) => {
	const [updateView, setUpdateView] = useState(false);
	const [currentFilter, setCurrentFilter] = useState("");

	useEffect(() => {
		setUpdateView(false);
	}, [leadType]);

	const onRemoveFIlter = () => {
		setFilters(prev => ({
			...prev,
			[leadType]: [...prev[leadType]]?.filter(f => f.id !== singleFilter.id),
		}));
	};

	const parseSimpleDate = date => {
		let actualDate = date;
		let newDate = `${actualDate["DD"]}/${actualDate["MM"]}/${actualDate["YYYY"]}`;
		return newDate;
	};

	const parseDateTime = singleFilter => {
		let actualDate = [];
		let actualTime = "";
		//DD.MM.YYYY
		//HH:MM

		if (
			singleFilter.operator === All_SUPPORTED_OPERATOR.IS_NULL ||
			singleFilter.operator === All_SUPPORTED_OPERATOR.IS_NOT_NULL ||
			singleFilter.operator === All_SUPPORTED_OPERATOR.IS_NOT_EMPTY ||
			singleFilter.operator === All_SUPPORTED_OPERATOR.IS_EMPTY
		)
			return "";

		Object.keys(singleFilter).forEach(f => {
			if (f === "time") {
				actualTime = singleFilter[f];
			} else {
				actualDate.push(singleFilter[f] + "");
			}
		});

		let date = `${actualDate[0]}-${actualDate[1]}-${actualDate[2]}`;
		let time = `${actualTime}:00`;

		return `${date ?? ""} ${time && "|"} ${time ?? ""}`;
	};

	const getValues = singleFilter => {
		if (
			singleFilter.operator === All_SUPPORTED_OPERATOR.IS_NULL ||
			singleFilter.operator === All_SUPPORTED_OPERATOR.IS_NOT_NULL ||
			singleFilter.operator === All_SUPPORTED_OPERATOR.IS_NOT_EMPTY ||
			singleFilter.operator === All_SUPPORTED_OPERATOR.IS_EMPTY
		) {
			return "";
		} else if (
			typeof singleFilter.value === "string" &&
			singleFilter.type !== ALL_DATATYPE.DATE &&
			singleFilter.type !== ALL_DATATYPE.DATETIME &&
			singleFilter.type !== ALL_DATATYPE.SYSTEM
		) {
			return singleFilter.value;
		} else if (
			Array.isArray(singleFilter.value) &&
			singleFilter.type !== ALL_DATATYPE.DATE &&
			singleFilter.type !== ALL_DATATYPE.DATETIME &&
			singleFilter.type !== ALL_DATATYPE.SYSTEM
		) {
			return singleFilter.value.join(", ");
		} else if (
			(singleFilter.type === ALL_DATATYPE.DATE ||
				singleFilter.type === ALL_DATATYPE.SYSTEM) &&
			BASICS_OPEARATOS.includes(singleFilter.operator)
		) {
			return parseSimpleDate(singleFilter.value);
		} else if (
			singleFilter.type === ALL_DATATYPE.DATETIME &&
			BASICS_OPEARATOS.includes(singleFilter.operator)
		) {
			return parseDateTime(singleFilter.dateTime);
		} else if (
			(leadType === VIEWS.CANDIDATE && singleFilter.type === ALL_DATATYPE.DATE) ||
			singleFilter.type === ALL_DATATYPE.SYSTEM
		) {
			return parseSimpleDate(singleFilter.value);
		} else if (
			leadType === VIEWS.CANDIDATE &&
			singleFilter.type === ALL_DATATYPE.DATETIME
		) {
			return parseDateTime(singleFilter.dateTime);
		} else {
			return "";
		}
	};

	return (
		<>
			{updateView && (
				<UpdateFilter
					updateView={updateView}
					setUpdateView={setUpdateView}
					currentFilter={currentFilter}
					bullhornFields={bullhornFields}
					filters={filters}
					setFilters={setFilters}
					leadType={leadType}
					index={index}
				/>
			)}
			{!updateView && (
				<div
					className={styles.selectedFilters}
					onClick={() => {
						setUpdateView(prev => !prev);
						setCurrentFilter(singleFilter);
					}}
				>
					<div className={styles.top}>
						<div className={styles.fieldTitle}>
							{bullhornFields?.find(f => f.name === singleFilter.bullhorn_field)?.label}{" "}
						</div>
						<div
							className={styles.removeBtn}
							onClick={() => onRemoveFIlter(singleFilter)}
						>
							<Minus color={"#567191"} />
						</div>
					</div>
					<div className={styles.body}>
						<p className={styles.values}>
							{singleFilter?.operator &&
								`${Object.keys(All_OPERATOR)?.find(
									f => All_OPERATOR[f] === singleFilter?.operator
								)}`}{" "}
							{singleFilter?.operator && getValues(singleFilter) && "|"}{" "}
							{getValues(singleFilter) && `${getValues(singleFilter)}`}
						</p>
					</div>
				</div>
			)}
		</>
	);
};

export default SelectedFilter;
