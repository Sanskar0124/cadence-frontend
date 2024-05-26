import { TabNavThemes, ThemedButtonThemes } from "@cadence-frontend/themes";
import { SearchBar, TabNavSlider, ThemedButton } from "@cadence-frontend/widgets";
import styles from "./SelectCadence.module.scss";
import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import {
	CadenceEmpty,
	Cadences,
	PlusOutline,
	Tick,
	TriangleDown,
} from "@cadence-frontend/icons";
import { useCadence } from "@cadence-frontend/data-access";
import { Div } from "@cadence-frontend/components";
import { Cadence as CADENCE_TRANSLATION } from "@cadence-frontend/languages";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";
import { useOutsideClickHandler } from "@cadence-frontend/utils";
import { useNavigate } from "react-router-dom";

const BUTTONS = [
	{ label: CADENCE_TRANSLATION.RECENT, value: "recent" },
	{ label: CADENCE_TRANSLATION.PERSONAL, value: "personal" },
	{ label: CADENCE_TRANSLATION.GROUP, value: "team" },
	{ label: CADENCE_TRANSLATION.COMPANY, value: "company" },
];

const CADENCE_TYPES = {
	RECENT: "recent",
	PERSONAL: "personal",
	TEAM: "team",
	COMPANY: "company",
};

const SelectCadence = ({ cadenceSelected, setCadenceSelected }) => {
	const [isDropdown, setIsDropdown] = useState(false);
	const [tab, setTab] = useState(CADENCE_TYPES.RECENT);
	const [searchValue, setSearchValue] = useState("");
	const user = useRecoilValue(userInfo);
	const [search, setSearch] = useState("");
	const navigate = useNavigate();
	const buttonRef = useRef();
	const observer = useRef();
	useOutsideClickHandler(buttonRef, () => setIsDropdown(false));

	const {
		cadencesData: cadences,
		cadenceLoading,
		fetchNextPage,
		hasNextPage,
		isFetching,
		isFetchingNextPage,
	} = useCadence(isDropdown, tab, searchValue);

	const lastCadenceRef = useCallback(
		cadence => {
			if (isFetchingNextPage || isFetching) return;
			if (observer.current) observer.current.disconnect();
			observer.current = new IntersectionObserver(entries => {
				if (entries[0].isIntersecting && hasNextPage) fetchNextPage();
			});
			if (cadence) observer.current.observe(cadence);
		},
		[isFetchingNextPage, isFetching, hasNextPage]
	);

	//search
	const handleSearch = () => setSearchValue(search);

	useEffect(() => {
		if (!search) setSearchValue("");
	}, [search]);

	return (
		<div className={styles.selectCadence} ref={buttonRef}>
			<ThemedButton
				theme={ThemedButtonThemes.WHITE}
				className={styles.selectCadenceBtn}
				onClick={() => setIsDropdown(curr => !curr)}
			>
				<span>
					<Cadences />
				</span>
				<p>{cadenceSelected.name ? cadenceSelected.name : "Select Cadence"}</p>
				<TriangleDown />
			</ThemedButton>
			{isDropdown && (
				<div className={`${styles.dropdown} ${isDropdown ? styles.open : ""}`}>
					<TabNavSlider
						theme={TabNavThemes.GREY}
						buttons={BUTTONS.map(opt => ({
							label: opt.label[user?.language?.toUpperCase()],
							value: opt.value,
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
						value={search}
						setValue={setSearch}
						onSearch={handleSearch}
						className={styles.searchBar}
					/>
					{cadenceLoading ? (
						<Placeholder rows={4} />
					) : !cadences?.length ? (
						<div className={styles.noCadence}>
							<CadenceEmpty size="12rem" />
							<h4>No cadence created</h4>
							<ThemedButton
								theme={ThemedButtonThemes.GREY}
								width="fit-content"
								onClick={() => navigate("/cadence?create=true")}
								className={styles.btnCreateCadence}
							>
								<PlusOutline />
								<div>
									{CADENCE_TRANSLATION.CREATE_NEW_CADENCE[user?.language?.toUpperCase()]}
								</div>
							</ThemedButton>
						</div>
					) : (
						<div className={styles.list}>
							{cadences?.map((cadence, index) => {
								const isLastCadence = index === cadences.length - 1;
								return isLastCadence ? (
									<>
										<CadenceRow
											key={cadence.cadence_id}
											cadence={cadence}
											cadenceSelected={cadenceSelected}
											setCadenceSelected={setCadenceSelected}
											ref={
												cadences?.length > (tab === CADENCE_TYPES.RECENT ? 9 : 19)
													? lastCadenceRef
													: null
											}
										/>
										{isFetchingNextPage && <Placeholder rows={1} />}
									</>
								) : (
									<CadenceRow
										key={cadence.cadence_id}
										cadence={cadence}
										cadenceSelected={cadenceSelected}
										setCadenceSelected={setCadenceSelected}
									/>
								);
							})}
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default SelectCadence;

const Placeholder = ({ rows }) => {
	return (
		<div>
			{[...Array(rows).keys()].map(() => (
				<Div loading className={styles.placeholder} />
			))}
		</div>
	);
};

const CadenceRow = forwardRef(({ cadence, cadenceSelected, setCadenceSelected }, ref) => {
	return (
		<div
			ref={ref}
			key={cadence.cadence_id}
			onClick={() => setCadenceSelected({ id: cadence.cadence_id, name: cadence.name })}
			className={`${styles.cadence} ${
				cadenceSelected.id === cadence.cadence_id ? styles.selected : ""
			}`}
		>
			<div className={styles.info} title={cadence.name}>
				{cadence.name}
			</div>
			<div className={styles.tick}>
				<Tick />
			</div>
		</div>
	);
});
