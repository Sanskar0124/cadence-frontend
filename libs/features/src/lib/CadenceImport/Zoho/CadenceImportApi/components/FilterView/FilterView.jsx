import {
	TabNavBtnThemes,
	TabNavThemes,
	ThemedButtonThemes,
} from "@cadence-frontend/themes";
import { SearchBar, TabNavSlider, ThemedButton } from "@cadence-frontend/widgets";
import React, { useState, useEffect, useRef, useContext } from "react";
import styles from "./FilterView.module.scss";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";
import { useOutsideClickHandler } from "@cadence-frontend/utils";
import { Tick, TriangleDown } from "@cadence-frontend/icons";
import { Div } from "@cadence-frontend/components";
import { useFilterView } from "@cadence-frontend/data-access";
import { LEAD_TYPES as LEADTYPE_OPTIONS, getSearchFilterView } from "./constant";
import { MessageContext } from "@cadence-frontend/contexts";
import { VIEWS } from "../../constants";

const FilterView = ({
	isAddSuccess,
	leadType,
	filterView,
	setFilterView,
	isAdding,
	checkedLeads,
	setWarningModal,
	setLeadType,
}) => {
	const [isDropdown, setIsDropdown] = useState(false);
	const [filterViewsList, setFiterViewsList] = useState([]);
	const [searchValue, setSearchValue] = useState("");
	const user = useRecoilValue(userInfo);
	const buttonRef = useRef();
	const { addError } = useContext(MessageContext);
	useOutsideClickHandler(buttonRef, () => setIsDropdown(false));

	// API
	const { getFilterView, getFilterViewLoading } = useFilterView(leadType);

	useEffect(() => {
		!isAdding &&
			getFilterView(leadType === VIEWS.LEAD ? "Leads" : "Contacts", {
				onSuccess: data => {
					setFiterViewsList(data);
				},
				onError: err => {
					addError({
						text: err?.response?.data?.msg,
						desc: err?.response?.data?.error ?? "Please contact support",
						cId: err?.response?.data?.correlationId,
					});
				},
			});
	}, [leadType]);

	return (
		<div className={styles.selectFilterView} ref={buttonRef}>
			<ThemedButton
				theme={ThemedButtonThemes.WHITE}
				className={styles.selectViewBtn}
				onClick={() => setIsDropdown(curr => !curr)}
				disabled={isAddSuccess}
			>
				<p>
					{filterView?.display_value
						? filterView?.display_value === "undefined"
							? "Select filter view"
							: filterView?.display_value
						: "Select filter view"}
				</p>
				<TriangleDown />
			</ThemedButton>

			<div className={`${styles.dropdown} ${isDropdown ? styles.open : ""}`}>
				<div className={styles.navSlider}>
					<TabNavSlider
						btnTheme={TabNavBtnThemes.PRIMARY_AND_LIGHT}
						theme={TabNavThemes.GREY}
						buttons={LEADTYPE_OPTIONS.map(opt => ({
							label: opt.label,
							value: opt.value,
						}))}
						value={leadType}
						setValue={val => {
							if (checkedLeads.length) {
								setWarningModal(val);
							} else {
								setLeadType(val);
							}
						}}
						width={"300px"}
						btnClassName={styles.leadTypeBtn}
						className={styles.leadTypeTabs}
						activeBtnClassName={styles.tabBtnActive}
						activePillClassName={styles.activePill}
					/>
				</div>

				<SearchBar value={searchValue} setValue={setSearchValue} />

				{getFilterViewLoading ? (
					<Placeholder rows={5} />
				) : (
					<div className={styles.viewList}>
						{!getSearchFilterView(filterViewsList, searchValue)?.length ? (
							<div className={styles.noFilterView}>
								<h4>No view</h4>
							</div>
						) : (
							getSearchFilterView(filterViewsList, searchValue)?.map(view => (
								<div
									key={view.id}
									className={`${styles.viewRow} ${
										filterView?.display_value === view.display_value
											? styles.selected
											: ""
									}`}
									onClick={e => {
										e.stopPropagation();
										if (filterView?.display_value === view?.display_value) {
											setFilterView("");
										} else {
											setIsDropdown(false);
											setFilterView(view);
										}
									}}
								>
									<div className={styles.info}>{view.display_value}</div>
									<div className={styles.tick}>
										<Tick />
									</div>
								</div>
							))
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default FilterView;

const Placeholder = ({ rows }) => {
	return (
		<div>
			{[...Array(rows).keys()].map(() => (
				<Div loading className={styles.placeholder} />
			))}
		</div>
	);
};
