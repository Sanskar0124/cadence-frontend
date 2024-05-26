import React from "react";
import styles from "./Filter.module.scss";
import { ThemedButton } from "@cadence-frontend/widgets";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { Plus, Sort } from "@cadence-frontend/icons";
import { v4 as uuidv4 } from "uuid";
import SingleFilter from "./components/SingleFilter/SingleFIlter";
import SelectedFilter from "./components/SelectedFilter/SelectedFilter";
import { parseArray } from "./utils";

const Filter = ({
	onClose,
	leadType,
	filters,
	setFilters,
	createFilter,
	setCreateFilter,
	addFilterBtn,
	showAddFilterBtn,
	setOriginalBFFields,
	originalBFFields,
}) => {
	const onAddSingleFilter = () => {
		setCreateFilter(prev => ({
			...prev,
			[leadType]: [...prev[leadType], { id: uuidv4() }],
		}));
		showAddFilterBtn(false);
	};

	return (
		<div
			className={`${styles.filterBody} ${
				!createFilter[leadType]?.length && !filters[leadType]?.length
					? styles.heightForEmptyFilter
					: styles.heightForFilter
			}`}
		>
			<div className={styles.createdFilters}>
				{parseArray(filters[leadType])?.map((filter, i) => (
					<SelectedFilter
						singleFilter={filter}
						filters={filters}
						setFilters={setFilters}
						bullhornFields={originalBFFields[leadType]}
						leadType={leadType}
						showAddFilterBtn={showAddFilterBtn}
						index={i}
					/>
				))}
			</div>

			{!createFilter[leadType]?.length && !filters[leadType]?.length ? (
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
					<SingleFilter
						bullhornFields={originalBFFields[leadType]}
						leadType={leadType}
						showAddFilterBtn={showAddFilterBtn}
						addFilterBtn={addFilterBtn}
						filters={filters}
						setFilters={setFilters}
						singleFilter={eachF}
						createFilter={createFilter[leadType]}
						setCreateFilter={setCreateFilter}
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

export default Filter;
