import { useEffect, useState, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import styles from "./Filters.module.scss";
import { ThemedButton } from "@cadence-frontend/widgets";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { Plus, Sort } from "@cadence-frontend/icons";
import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue } from "recoil";
import SelectedFilters from "./components/SelectedFilters/SelectedFilters";
import EachFilters from "./components/EachFilters/EachFilters";
import { ALL_DATA_TYPE, All_SUPPORTED_OPERATOR } from "./constant";

const Filters = ({
	onClose,
	leadType,
	filters,
	setFilters,
	createFilter,
	setCreateFilter,
	addFilterBtn,
	showAddFilterBtn,
	zohoUsers,
	setOriginalSFFields,
	originalSFFields,
}) => {
	const user = useRecoilValue(userInfo);
	const [dataTypes, setDataTypes] = useState([]);

	useEffect(() => {
		const leadDataType = [...new Set(originalSFFields.lead?.map(f => f.type))];
		const contactDataType = [...new Set(originalSFFields.contact?.map(f => f.type))];
		setDataTypes([...new Set([...leadDataType, ...contactDataType])]);
	}, [originalSFFields]);

	// single time to add one filter
	const onAddSingleFilter = () => {
		setCreateFilter(prev => ({
			...prev,
			[leadType]: [...prev[leadType], { id: uuidv4() }],
		}));
		showAddFilterBtn(false);
	};

	const parseArray = array => {
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

	return (
		<div
			className={`${styles.filterBody} ${
				!createFilter[leadType]?.length && !filters[leadType].length
					? styles.heightForEmptyFilter
					: styles.heightForFilter
			}`}
		>
			<div className={styles.createdFilters}>
				{parseArray(filters[leadType])?.map((f, i) => (
					<SelectedFilters
						eachF={f}
						filters={filters}
						setFilters={setFilters}
						zohoFields={originalSFFields[leadType]}
						leadType={leadType}
						dataTypes={dataTypes}
						showAddFilterBtn={showAddFilterBtn}
						zohoUsers={zohoUsers}
						index={i}
					/>
				))}
			</div>

			{!createFilter[leadType]?.length && !filters[leadType].length ? (
				<div className={styles.noResult}>
					<div className={styles.notFilter}>
						<Sort /> <span>No filters currently selected</span>
					</div>
					<ThemedButton
						theme={ThemedButtonThemes.GREY}
						width={"fit-contain"}
						className={styles.addFfilterBtn}
						height={"42px"}
						onClick={() => onAddSingleFilter()}
					>
						<Plus /> <div>New filter</div>{" "}
					</ThemedButton>
				</div>
			) : (
				createFilter[leadType]?.map(eachF => (
					<EachFilters
						zohoFields={originalSFFields[leadType]}
						leadType={leadType}
						dataTypes={dataTypes}
						showAddFilterBtn={showAddFilterBtn}
						addFilterBtn={addFilterBtn}
						filters={filters}
						setFilters={setFilters}
						eachF={eachF}
						createFilter={createFilter[leadType]}
						setCreateFilter={setCreateFilter}
						zohoUsers={zohoUsers}
					/>
				))
			)}

			{addFilterBtn && filters[leadType].length ? (
				<ThemedButton
					theme={ThemedButtonThemes.GREY}
					width={"fit-contain"}
					className={styles.addFB}
					height={"42px"}
					onClick={() => onAddSingleFilter()}
				>
					<Plus /> <div>New filter</div>{" "}
				</ThemedButton>
			) : null}
		</div>
	);
};

export default Filters;
