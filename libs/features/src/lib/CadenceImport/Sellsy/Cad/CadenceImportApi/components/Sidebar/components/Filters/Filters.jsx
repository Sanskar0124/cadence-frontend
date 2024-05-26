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
import { ALL_DATA_TYPE, All_SUPPORTED_OPERATOR, SUPPORTED_FIELDS } from "./constant";
import moment from "moment-timezone";

const Filters = ({
	onClose,
	filters,
	setFilters,
	// createFilter,
	// setCreateFilter,
	// addFilterBtn,
	// showAddFilterBtn,
	zohoUsers,
	setOriginalSFFields,
	originalSFFields,
}) => {
	const user = useRecoilValue(userInfo);
	const [dataTypes, setDataTypes] = useState([]);
	// const [createFilter, setCreateFilter] = useState([]);
	const [addFilterBtn, showAddFilterBtn] = useState(true);
	const [editable, setEditable] = useState(null);
	// useEffect(() => {
	// 	const leadDataType = [...new Set(originalSFFields.lead?.map(f => f.type))];
	// 	const contactDataType = [...new Set(originalSFFields.contact?.map(f => f.type))];
	// 	setDataTypes([...new Set([...leadDataType, ...contactDataType])]);
	// }, [originalSFFields]);

	// single time to add one filter
	const onAddSingleFilter = () => {
		// setCreateFilter(prev => [...prev, { id: uuidv4() }]);
		setEditable(null);
		showAddFilterBtn(false);
	};
	useEffect(() => {
		filters && sessionStorage.setItem("api-import-filters", JSON.stringify(filters));
	}, [filters]);
	console.log(filters, "Filterss41");
	// const parseArray = array => {
	// 	let arr = array?.map(flr => {
	// 		if (
	// 			flr.operator === All_SUPPORTED_OPERATOR.IS_NULL ||
	// 			flr.operator === All_SUPPORTED_OPERATOR.IS_NOT_NULL
	// 		) {
	// 			return { ...flr, value: "" };
	// 		} else {
	// 			return flr;
	// 		}
	// 	});
	// 	return arr;
	// };
	// console.log(createFilter, "CreateFilter");
	console.log(editable, addFilterBtn, filters, "Filters43");
	console.log(moment("2014-09-08T08:02:17-05:00").format("D"), "Datet");
	return (
		<div
			className={`${styles.filterBody} ${
				addFilterBtn && !Object.keys(filters).length
					? styles.heightForEmptyFilter
					: styles.heightForFilter
			}`}
		>
			<div className={styles.createdFilters}>
				{Object.keys(filters)?.map(f =>
					!(editable === f) ? (
						<SelectedFilters
							// eachF={f}
							singleFilter={f}
							filters={filters}
							setFilters={setFilters}
							setEditable={setEditable}
							// zohoFields={originalSFFields}
							// dataTypes={dataTypes}
							showAddFilterBtn={showAddFilterBtn}
							// zohoUsers={zohoUsers}
						/>
					) : (
						<EachFilters
							// zohoFields={originalSFFields?.filter(
							// 	f => f.type !== "profileimage" && f.type !== "textarea"
							// )}
							// dataTypes={dataTypes}
							editable={editable}
							setEditable={setEditable}
							showAddFilterBtn={showAddFilterBtn}
							addFilterBtn={addFilterBtn}
							filters={filters}
							setFilters={setFilters}
							// eachF={eachF}
							// createFilter={createFilter}
							// setCreateFilter={setCreateFilter}
							// zohoUsers={zohoUsers}
						/>
					)
				)}
			</div>
			{addFilterBtn && !Object.keys(filters).length && (
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
			)}
			{/* // createFilter?.map(eachF => ( */}
			{!addFilterBtn && !editable && (
				<EachFilters
					// zohoFields={originalSFFields?.filter(
					// 	f => f.type !== "profileimage" && f.type !== "textarea"
					// )}
					// dataTypes={dataTypes}
					editable={editable}
					setEditable={setEditable}
					showAddFilterBtn={showAddFilterBtn}
					addFilterBtn={addFilterBtn}
					filters={filters}
					setFilters={setFilters}
					// eachF={eachF}
					// createFilter={createFilter}
					// setCreateFilter={setCreateFilter}
					// zohoUsers={zohoUsers}
				/>
				// ))
			)}
			{addFilterBtn &&
			Object.keys(filters).length &&
			SUPPORTED_FIELDS.length !== Object.keys(filters).length ? (
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
