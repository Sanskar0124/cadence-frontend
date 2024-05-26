import { Minus } from "@cadence-frontend/icons";
import React, { useState } from "react";
import styles from "./SelectedFilters.module.scss";
import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue } from "recoil";
import {
	All_OPERATOR,
	META_DATA,
	BASICS_OPEARATOS,
	BETWEEN_OPERATORS,
	ALL_DATA_TYPE,
	All_SUPPORTED_OPERATOR,
} from "../../constant";
import { parseDateTime } from "./utils";
import UpdateFilter from "../UpdateFilter/UpdateFilter";

const SelectedFilters = ({
	zohoFields,
	dataTypes,
	leadType,
	setFilters,
	filters,
	eachF,
	zohoUsers,
	index,
}) => {
	const user = useRecoilValue(userInfo);
	const [currentFilter, setCurrentFilter] = useState("");
	const [updateView, setUpdateView] = useState(false);

	const onRemoveFIlter = () => {
		setFilters(prev => ({
			...prev,
			[leadType]: [...prev[leadType]]?.filter(f => f.id !== eachF.id),
		}));
	};

	const parseSimpleDate = date => {
		let actualDate = date;
		let newDate = `${actualDate["DD"]}/${actualDate["MM"]}/${actualDate["YYYY"]}`;
		return newDate;
	};

	const parseDateTime = datetime => {
		let actualDate = [];
		let actualTime = "";
		//DD.MM.YYYY
		//HH:MM
		if (
			eachF.operator === All_SUPPORTED_OPERATOR.IS_NULL ||
			eachF.operator === All_SUPPORTED_OPERATOR.IS_NOT_NULL
		)
			return "";

		Object.keys(datetime).forEach(f => {
			if (f === "time") {
				actualTime = datetime[f];
			} else {
				actualDate.push(datetime[f] + "");
			}
		});

		let date = `${actualDate[0]}-${actualDate[1]}-${actualDate[2]}`;
		let time = `${actualTime}:00`;

		return `${date ?? ""} ${time && "|"} ${time ?? ""}`;
	};

	const parseDateTimeRange = datetimerange => {
		let dateStart = datetimerange?.date.starts;
		let dateEnd = datetimerange?.date.ends;

		let timeStart = datetimerange?.time.starts;
		let timeEnd = datetimerange?.time.ends;

		return `${dateStart?.DD ?? "DD"}/${dateStart?.MM ?? "MM"}/${
			dateStart?.YYYY ?? "YYYY"
		} - ${dateEnd?.DD ?? "DD"}/${dateEnd?.MM ?? "MM"}/${dateEnd?.YYYY ?? "YYYY"} | ${
			timeStart ?? "HH:MM"
		} - ${timeEnd ?? "HH:MM"}`;
	};

	const parseDateRange = daterange => {
		let daterangeStart = daterange.starts;
		let daterangeEnd = daterange.ends;

		// DD/MM/YYYY
		return `${daterangeStart.DD ?? "DD"}/${daterangeStart.MM ?? "MM"}/${
			daterangeStart.YYYY ?? "YYYY"
		} - ${daterangeEnd.DD ?? "DD"}/${daterangeEnd.MM ?? "MM"}/${
			daterangeEnd.YYYY ?? "YYYY"
		}`;
	};

	const getValues = eachFilter => {
		if (
			typeof eachFilter.value === "string" &&
			eachFilter.type !== ALL_DATA_TYPE.DATE &&
			eachFilter.type !== ALL_DATA_TYPE.DATETIME
		) {
			if (
				eachFilter.type === ALL_DATA_TYPE.OWNER_LOOKUP &&
				eachFilter.operator !== All_SUPPORTED_OPERATOR.IS_NULL &&
				eachFilter.operator !== All_SUPPORTED_OPERATOR.IS_NOT_NULL
			) {
				const { first_name, last_name } = zohoUsers?.find(
					f => f.integration_id === eachFilter.value
				);
				return `${first_name} ${last_name}`;
			}
			return eachFilter.value;
		} else if (
			Array.isArray(eachFilter.value) &&
			eachFilter.type !== ALL_DATA_TYPE.DATE &&
			eachFilter.type !== ALL_DATA_TYPE.DATETIME
		) {
			if (
				eachFilter.type === ALL_DATA_TYPE.OWNER_LOOKUP &&
				eachFilter.operator !== All_SUPPORTED_OPERATOR.IS_NULL &&
				eachFilter.operator !== All_SUPPORTED_OPERATOR.IS_NOT_NULL
			) {
				let getName = [];

				eachFilter.value?.forEach(f => {
					if (zohoUsers?.some(user => user.integration_id === f)) {
						const { first_name, last_name } = zohoUsers?.find(
							user => user.integration_id === f
						);
						getName.push(`${first_name} ${last_name}`);
					}
				});

				return getName?.join(", ");
			}

			let arr = eachFilter.value?.join(", ");
			return arr;
		} else if (eachFilter.type === ALL_DATA_TYPE.DATETIME) {
			if (BASICS_OPEARATOS.includes(eachF.operator)) {
				return parseDateTime(eachFilter?.dateTime);
			} else if (BETWEEN_OPERATORS.includes(eachF.operator)) {
				return parseDateTimeRange(eachFilter.datetimerange);
			}
		} else if (eachFilter.type === ALL_DATA_TYPE.DATE) {
			if (BASICS_OPEARATOS.includes(eachF.operator)) {
				return parseSimpleDate(eachF.value);
			} else if (BETWEEN_OPERATORS.includes(eachF.operator)) {
				return parseDateRange(eachF?.daterange);
			}
		} else if (
			(eachFilter.type === ALL_DATA_TYPE.CURRENCY ||
				eachFilter.type === ALL_DATA_TYPE.INTEGER ||
				eachFilter.type === ALL_DATA_TYPE.NUMBER) &&
			BETWEEN_OPERATORS.includes(eachF.operator)
		) {
			return `${eachFilter?.value?.starts ?? "From"} - ${
				eachFilter?.value?.ends ?? "To"
			}`;
		} else if (eachFilter.type === ALL_DATA_TYPE.BOOLEAN) {
			return eachFilter.value ? "Selected" : "Not selected";
		}
	};

	return (
		<>
			{updateView && (
				<UpdateFilter
					currentFilter={currentFilter}
					setUpdateView={setUpdateView}
					zohoFields={zohoFields}
					filters={filters}
					leadType={leadType}
					setFilters={setFilters}
					zohoUsers={zohoUsers}
					index={index}
				/>
			)}
			{!updateView && (
				<div
					className={styles.selectedFilters}
					onClick={() => {
						setCurrentFilter(eachF);
						setUpdateView(prev => !prev);
					}}
				>
					<div className={styles.top}>
						<div className={styles.fieldTitle}>
							{zohoFields?.find(f => f.name === eachF.zoho_field)?.label}{" "}
						</div>
						<div className={styles.removeBtn} onClick={() => onRemoveFIlter(eachF)}>
							<Minus color={"#567191"} />
						</div>
					</div>
					<div className={styles.body}>
						<p className={styles.values}>
							{" "}
							{eachF?.operator &&
								`${Object.keys(All_OPERATOR)?.find(
									f => All_OPERATOR[f] === eachF?.operator
								)}`}{" "}
							{eachF?.operator && getValues(eachF) && "|"}{" "}
							{getValues(eachF) && `${getValues(eachF)}`}
						</p>
						<p className={styles.values}>
							{" "}
							{eachF?.metaData && eachF.operator === "like" && META_DATA[eachF?.metaData]}
						</p>
					</div>
				</div>
			)}
		</>
	);
};

export default SelectedFilters;
