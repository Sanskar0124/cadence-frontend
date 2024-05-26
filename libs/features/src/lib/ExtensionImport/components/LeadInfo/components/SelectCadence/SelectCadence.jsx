import React, { useState } from "react";

import { Div } from "@cadence-frontend/components";
import { SearchBar, TabNavSlider, ThemedButton } from "@cadence-frontend/widgets";
import { TabNavThemes, ThemedButtonThemes } from "@cadence-frontend/themes";
import { Tick, TriangleDown } from "@cadence-frontend/icons";
import { useCadence } from "@cadence-frontend/data-access";
import { CADENCE_TYPES } from "./constants";
import { BUTTONS } from "./constants";

import styles from "./SelectCadence.module.scss";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";

const SelectCadence = ({ cadenceSelected, setCadenceSelected }) => {
	const [isDropdown, setIsDropdown] = useState(false);
	const [tab, setTab] = useState(CADENCE_TYPES.PERSONAL);
	const [searchValue, setSearchValue] = useState("");
	const user = useRecoilValue(userInfo);

	const { cadencesData: cadences, cadenceLoading } = useCadence(isDropdown, tab);

	return (
		<div className={styles.selectCadence}>
			<ThemedButton
				theme={ThemedButtonThemes.WHITE}
				className={styles.selectCadenceBtn}
				onClick={() => setIsDropdown(curr => !curr)}
			>
				<p>{cadenceSelected.name ? cadenceSelected.name : "Select Cadence"}</p>
				<span className={`${styles.arrow} ${isDropdown ? styles.arrowUp : ""}`}>
					<TriangleDown />
				</span>
			</ThemedButton>
			{isDropdown && (
				<div className={`${styles.dropdown} ${isDropdown ? styles.open : ""}`}>
					<TabNavSlider
						theme={TabNavThemes.GREY}
						buttons={BUTTONS.map(opt => ({
							label: opt.label[user?.language?.toUpperCase()],
						}))}
						value={tab}
						setValue={setTab}
						className={styles.tabs}
						btnClassName={styles.tabBtns}
						activeBtnClassName={styles.tabBtnActive}
						activePillClassName={styles.activePill}
					/>
					<SearchBar
						width="100%"
						height="40px"
						value={searchValue}
						setValue={setSearchValue}
						className={styles.searchBar}
					/>
					{cadenceLoading ? (
						<Placeholder />
					) : (
						<div className={styles.list}>
							{cadences
								?.filter(cadence =>
									cadence.name.toLowerCase().includes(searchValue.toLowerCase())
								)
								?.map(cadence => (
									<div
										key={cadence.cadence_id}
										onClick={() => {
											setCadenceSelected({
												id: cadence.cadence_id,
												name: cadence.name,
											});
											setIsDropdown(false);
										}}
										className={
											cadenceSelected.id === cadence.cadence_id ? styles.selected : ""
										}
									>
										<div className={styles.info}>{cadence.name}</div>
										<div className={styles.tick}>
											<Tick />
										</div>
									</div>
								))}
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default SelectCadence;

const Placeholder = () => {
	return (
		<div className={styles.placeholder}>
			{[...Array(4).keys()].map(() => (
				<Div loading />
			))}
		</div>
	);
};
