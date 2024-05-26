import {
	TabNavBtnThemes,
	TabNavThemes,
	ThemedButtonThemes,
} from "@cadence-frontend/themes";
import { SearchBar, TabNavSlider, Tabs, ThemedButton } from "@cadence-frontend/widgets";
import React, { useState, useEffect, useRef, useContext } from "react";
import styles from "./FilterView.module.scss";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";
import { useOutsideClickHandler } from "@cadence-frontend/utils";
import { Tick, TriangleDown } from "@cadence-frontend/icons";
import { Div } from "@cadence-frontend/components";
import { useFilterView } from "@cadence-frontend/data-access";
import { getSearchFilterView } from "./constant";
import { MessageContext } from "@cadence-frontend/contexts";
import { LEADTYPE, LEAD_TYPE as LEADTYPE_OPTIONS } from "../../../constants";

const FilterView = ({
	isAddSuccess,
	leadType,
	filterView,
	setFilterView,
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
	const { getFilterView, getFilterViewLoading } = useFilterView(
		leadType === "contact" ? "ClientContact" : leadType === "lead" ? "Lead" : "Candidate"
	);

	useEffect(() => {
		getFilterView(
			leadType === "contact"
				? "ClientContact"
				: leadType === "lead"
				? "Lead"
				: "Candidate",
			{
				onSuccess: data => {
					setFiterViewsList(data);
				},
				onError: err => {
					addError({
						text: err?.response?.data?.msg,
						desc: err?.response?.data?.error,
						cId: err?.response?.data?.correlationId,
					});
				},
			}
		);
	}, [leadType]);

	return (
		<div className={styles.selectFilterView} ref={buttonRef}>
			{!isAddSuccess && (
				<ThemedButton
					theme={ThemedButtonThemes.WHITE}
					className={styles.selectViewBtn}
					onClick={() => setIsDropdown(curr => !curr)}
					disabled={isAddSuccess}
				>
					<p>
						{filterView?.name
							? filterView?.name === "undefined"
								? "Select filter view"
								: filterView?.name
							: "Select filter view"}
					</p>
					<TriangleDown />
				</ThemedButton>
			)}

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
						width={"100%"}
						btnClassName={styles.leadTypeBtn}
						className={styles.leadTypeTabs}
						activeBtnClassName={styles.tabBtnActive}
						activePillClassName={styles.activePill}
					/>
				</div>

				<SearchBar
					value={searchValue}
					setValue={setSearchValue}
					className={styles.searchBar}
					height={"50px"}
				/>

				{getFilterViewLoading ? (
					<div className={styles.viewList}>
						<Placeholder rows={6} />
					</div>
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
										filterView?.name === view.name ? styles.selected : ""
									}`}
									onClick={e => {
										e.stopPropagation();
										if (filterView?.name === view?.name) {
											setFilterView("");
										} else {
											setIsDropdown(false);
											setFilterView(view);
										}
									}}
								>
									<div className={styles.info}>{view.name}</div>
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
