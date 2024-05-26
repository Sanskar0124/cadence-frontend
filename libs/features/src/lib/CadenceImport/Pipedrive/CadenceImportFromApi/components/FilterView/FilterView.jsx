import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { SearchBar, ThemedButton } from "@cadence-frontend/widgets";
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

const FilterView = ({ isAddSuccess, leadType, filterView, setFilterView }) => {
	const [isDropdown, setIsDropdown] = useState(false);
	const [filterViewsList, setFiterViewsList] = useState([]);
	const [searchValue, setSearchValue] = useState("");
	const user = useRecoilValue(userInfo);
	const buttonRef = useRef();
	useOutsideClickHandler(buttonRef, () => setIsDropdown(false));
	const { addError } = useContext(MessageContext);

	// API

	const { getFilterView, getFilterViewLoading } = useFilterView(leadType);

	useEffect(() => {
		getFilterView(leadType, {
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
		});
	}, [leadType]);

	return (
		<div className={styles.selectFilterView} ref={buttonRef}>
			<ThemedButton
				theme={ThemedButtonThemes.WHITE}
				// theme={filterView ? ThemedButtonThemes.PRIMARY : ThemedButtonThemes.WHITE}
				className={styles.selectViewBtn}
				onClick={() => setIsDropdown(curr => !curr)}
				// disabled={isAddSuccess}
			>
				<p>
					{filterView?.name
						? filterView?.name === "undefined"
							? "Select Filter View"
							: filterView?.name
						: "Select Filter View"}
				</p>
				<TriangleDown />
			</ThemedButton>

			<div className={`${styles.dropdown} ${isDropdown ? styles.open : ""}`}>
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
										filterView?.name === view.name && filterView?.id === view.id
											? styles.selected
											: ""
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
