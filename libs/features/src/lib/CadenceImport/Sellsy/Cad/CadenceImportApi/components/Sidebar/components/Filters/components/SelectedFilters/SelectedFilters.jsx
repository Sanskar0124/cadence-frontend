import { Minus } from "@cadence-frontend/icons";
import React from "react";
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
	SUPPORTED_FIELDS,
	SUPPORTED_TYPES,
	unParseDate,
	unParseTime,
} from "../../constant";

const SelectedFilters = ({
	// zohoFields,
	// dataTypes,
	singleFilter,
	setFilters,
	filters,
	setEditable,
	showAddFilterBtn,
	// eachF,
	// zohoUsers,
}) => {
	const user = useRecoilValue(userInfo);

	const onRemoveFIlter = filter => {
		// setFilters(prev => [...prev]?.filter(f => f.id !== eachF.id));
		setFilters(prev => {
			delete prev[filter];
			return { ...prev };
		});
	};
	console.log(filters, "Filterss37");
	// const parseSimpleDate = date => {
	// 	let actualDate = date;
	// 	let newDate = `${actualDate["DD"]}/${actualDate["MM"]}/${actualDate["YYYY"]}`;
	// 	return newDate;
	// };

	// const parseDateTime = datetime => {
	// 	let actualDate = [];
	// 	let actualTime = "";
	// 	//DD.MM.YYYY
	// 	//HH:MM
	// 	if (
	// 		eachF.operator === All_SUPPORTED_OPERATOR.IS_NULL ||
	// 		eachF.operator === All_SUPPORTED_OPERATOR.IS_NOT_NULL
	// 	)
	// 		return "";

	// 	Object.keys(datetime).forEach(f => {
	// 		if (f === "time") {
	// 			actualTime = datetime[f];
	// 		} else {
	// 			actualDate.push(datetime[f] + "");
	// 		}
	// 	});

	// 	let date = `${actualDate[0]}-${actualDate[1]}-${actualDate[2]}`;
	// 	let time = `${actualTime}:00`;

	// 	return `${date ?? ""} ${time && "|"} ${time ?? ""}`;
	// };

	// const parseDateTimeRange = datetimerange => {
	// 	let dateStart = datetimerange?.date.start;
	// 	let dateEnd = datetimerange?.date.end;

	// 	let timeStart = datetimerange?.time.start;
	// 	let timeEnd = datetimerange?.time.end;

	// 	return `${dateStart?.DD ?? "DD"}/${dateStart?.MM ?? "MM"}/${
	// 		dateStart?.YYYY ?? "YYYY"
	// 	} - ${dateEnd?.DD ?? "DD"}/${dateEnd?.MM ?? "MM"}/${dateEnd?.YYYY ?? "YYYY"} | ${
	// 		timeStart ?? "HH:MM"
	// 	} - ${timeEnd ?? "HH:MM"}`;
	// };

	const parseDateRange = daterange => {
		let daterangeStart = daterange?.start.split("-");
		let daterangeEnd = daterange?.end.split("-");
		// DD/MM/YYYY
		return `${daterangeStart[2] ?? "DD"}/${daterangeStart[1] ?? "MM"}/${
			daterangeStart[0] ?? "YYYY"
		} - ${daterangeEnd[2] ?? "DD"}/${daterangeEnd[1] ?? "MM"}/${
			daterangeEnd[0] ?? "YYYY"
		}`;
	};
	const parseDateTimeRange = datetimerange => {
		let dateStart = unParseDate(datetimerange.start, SUPPORTED_TYPES.DATE_TIME_RANGE);
		let dateEnd = unParseDate(datetimerange.end, SUPPORTED_TYPES.DATE_TIME_RANGE);

		let timeStart = unParseTime(datetimerange.start);
		let timeEnd = unParseTime(datetimerange.end);

		return `${dateStart?.DD ?? "DD"}/${dateStart?.MM ?? "MM"}/${
			dateStart?.YYYY ?? "YYYY"
		} - ${dateEnd?.DD ?? "DD"}/${dateEnd?.MM ?? "MM"}/${dateEnd?.YYYY ?? "YYYY"} | ${
			timeStart ?? "HH:MM"
		} - ${timeEnd ?? "HH:MM"}`;
	};
	const getValues = eachFilter => {
		const type = SUPPORTED_FIELDS.find(field => field.value === eachFilter)?.type;
		if (type === SUPPORTED_TYPES.MULTIPLE_INPUTS) {
			return filters?.[eachFilter].join(",");
		} else if (type === SUPPORTED_TYPES.DATE_RANGE) {
			return parseDateRange(filters?.[eachFilter]);
		} else if (type === SUPPORTED_TYPES.DATE_TIME_RANGE) {
			return parseDateTimeRange(filters?.[eachFilter]);
		} else {
			return filters?.[eachFilter];
		}
	};
	// 	if (
	// 		typeof eachFilter.value === "string" &&
	// 		eachFilter.type !== ALL_DATA_TYPE.DATE &&
	// 		eachFilter.type !== ALL_DATA_TYPE.DATETIME
	// 	) {
	// 		if (
	// 			eachFilter.type === ALL_DATA_TYPE.OWNER_LOOKUP &&
	// 			eachFilter.operator !== All_SUPPORTED_OPERATOR.IS_NULL &&
	// 			eachFilter.operator !== All_SUPPORTED_OPERATOR.IS_NOT_NULL
	// 		) {
	// 			const { first_name, last_name } = zohoUsers?.find(
	// 				f => f.integration_id === eachFilter.value
	// 			);
	// 			return `${first_name} ${last_name}`;
	// 		}
	// 		return eachFilter.value;
	// 	} else if (
	// 		Array.isArray(eachFilter.value) &&
	// 		eachFilter.type !== ALL_DATA_TYPE.DATE &&
	// 		eachFilter.type !== ALL_DATA_TYPE.DATETIME
	// 	) {
	// 		if (
	// 			eachFilter.type === ALL_DATA_TYPE.OWNER_LOOKUP &&
	// 			eachFilter.operator !== All_SUPPORTED_OPERATOR.IS_NULL &&
	// 			eachFilter.operator !== All_SUPPORTED_OPERATOR.IS_NOT_NULL
	// 		) {
	// 			let getName = [];

	// 			eachFilter.value?.forEach(f => {
	// 				if (zohoUsers?.some(user => user.integration_id === f)) {
	// 					const { first_name, last_name } = zohoUsers?.find(
	// 						user => user.integration_id === f
	// 					);
	// 					getName.push(`${first_name} ${last_name}`);
	// 				}
	// 			});

	// 			return getName?.join(", ");
	// 		}

	// 		let arr = eachFilter.value?.join(", ");
	// 		return arr;
	// 	} else if (eachFilter.type === ALL_DATA_TYPE.DATETIME) {
	// 		if (BASICS_OPEARATOS.includes(eachF.operator)) {
	// 			return parseDateTime(eachFilter?.dateTime);
	// 		} else if (BETWEEN_OPERATORS.includes(eachF.operator)) {
	// 			return parseDateTimeRange(eachFilter.datetimerange);
	// 		}
	// 	} else if (eachFilter.type === ALL_DATA_TYPE.DATE) {
	// 		if (BASICS_OPEARATOS.includes(eachF.operator)) {
	// 			return parseSimpleDate(eachF.value);
	// 		} else if (BETWEEN_OPERATORS.includes(eachF.operator)) {
	// 			return parseDateRange(eachF?.daterange);
	// 		}
	// 	} else if (
	// 		(eachFilter.type === ALL_DATA_TYPE.CURRENCY ||
	// 			eachFilter.type === ALL_DATA_TYPE.INTEGER ||
	// 			eachFilter.type === ALL_DATA_TYPE.NUMBER) &&
	// 		BETWEEN_OPERATORS.includes(eachF.operator)
	// 	) {
	// 		return `${eachFilter?.value?.start ?? "From"} - ${
	// 			eachFilter?.value?.end ?? "To"
	// 		}`;
	// 	} else if (eachFilter.type === ALL_DATA_TYPE.BOOLEAN) {
	// 		return eachFilter.value ? "Selected" : "Not selected";
	// 	}
	// };

	return (
		<div
			className={styles.selectedFilters}
			onClick={() => {
				setEditable(singleFilter);
				showAddFilterBtn(true);
			}}
		>
			<div className={styles.top}>
				<div className={styles.fieldTitle}>
					{SUPPORTED_FIELDS.find(field => field.value === singleFilter)?.label}
				</div>
				<div className={styles.removeBtn} onClick={() => onRemoveFIlter(singleFilter)}>
					<Minus color={"#567191"} />
				</div>
			</div>
			<div className={styles.body}>
				<p className={styles.values}>
					{" "}
					{getValues(singleFilter) && `${getValues(singleFilter)}`}
				</p>
				{/* <p className={styles.values}> {eachF?.metaData && META_DATA[eachF?.metaData]}</p> */}
			</div>
		</div>
	);
};

export default SelectedFilters;
