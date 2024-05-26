import { userInfo } from "@cadence-frontend/atoms";
import { ErrorBoundary } from "@cadence-frontend/components";
import { CADENCE_TYPES } from "@cadence-frontend/constants";
import { useCadenceForTasks } from "@cadence-frontend/data-access";
import { Close, NoCadence, Tick } from "@cadence-frontend/icons";
import {
	Tasks as TASKS_TRANSLATION,
	Common as COMMON_TRANSLATION,
} from "@cadence-frontend/languages";
import { TabNavThemes, ThemedButtonThemes } from "@cadence-frontend/themes";
import { SearchBar, TabNavSlider, ThemedButton } from "@cadence-frontend/widgets";
import { forwardRef, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import styles from "./Cadences.module.scss";
import { CADENCES_TAB_OPTIONS } from "./constants.js";
import Placeholder from "../Placeholder/Placeholder";
import { MessageContext } from "@cadence-frontend/contexts";

const Cadences = ({ open, setOpen, filters, handleMultiSelect, userId }) => {
	const { addError } = useContext(MessageContext);
	const [searchValue, setSearchValue] = useState("");
	const [search, setSearch] = useState("");
	const [showOverlay, setShowOverlay] = useState(false);
	const [tab, setTab] = useState(CADENCE_TYPES.PERSONAL);
	const user = useRecoilValue(userInfo);
	const observer = useRef();

	const cadenceDataAccess = useCadenceForTasks(open, tab, searchValue, userId);
	const {
		cadences,
		cadencesLoading,
		fetchCadencesError,
		fetchNextPage,
		hasNextPage,
		isFetching,
		isFetchingNextPage,
	} = cadenceDataAccess;

	const handleSearch = () => setSearchValue(search);

	const onAnimationEnd = () => {
		if (!open) setShowOverlay(false);
	};

	const onClose = () => {
		setOpen(false);
	};

	useEffect(() => {
		if (open) setShowOverlay(true);
	}, [open]);

	useEffect(() => {
		if (!search) setSearchValue("");
	}, [search]);

	useEffect(() => {
		if (fetchCadencesError)
			addError({
				text: fetchCadencesError?.response?.data?.msg,
				desc: fetchCadencesError?.response?.data?.error || "Please contact support",
				cId: fetchCadencesError?.response?.data?.correlationId,
			});
	}, [fetchCadencesError]);

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

	return (
		showOverlay && (
			<div className={`${styles.wrapper} ${open ? styles.open : ""}`}>
				<div
					className={`${styles.container} ${open ? styles.open : styles.close}`}
					onAnimationEnd={onAnimationEnd}
				>
					<ThemedButton
						onClick={onClose}
						className={styles.closeBtn}
						theme={ThemedButtonThemes.ICON}
					>
						<Close color={"#000"} />
					</ThemedButton>
					<div className={styles.title}>
						{TASKS_TRANSLATION.SELECT_A_CADENCE[user?.language?.toUpperCase()]}
					</div>
					<TabNavSlider
						theme={TabNavThemes.GREY}
						buttons={CADENCES_TAB_OPTIONS.map(op => ({
							label: op.label[user.language.toUpperCase()],
							value: op.value,
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
					/>
					<ErrorBoundary>
						<div className={styles.list}>
							{cadencesLoading ? (
								<Placeholder rows={8} />
							) : cadences?.length > 0 ? (
								cadences?.map((cadence, index) => {
									const isLastCadence = index === cadences.length - 1;
									return isLastCadence ? (
										<>
											<CadenceCard
												key={cadence.cadence_id}
												cadence={cadence}
												filters={filters}
												handleMultiSelect={handleMultiSelect}
												ref={cadences?.length > 9 ? lastCadenceRef : null}
											/>{" "}
											{isFetchingNextPage && <Placeholder rows={1} />}
										</>
									) : (
										<CadenceCard
											key={cadence.cadence_id}
											cadence={cadence}
											filters={filters}
											handleMultiSelect={handleMultiSelect}
										/>
									);
								})
							) : (
								<div className={styles.fallback}>
									<NoCadence size="10rem" />
									{COMMON_TRANSLATION.NO_CADENCE_FOUND[user?.language?.toUpperCase()]}
								</div>
							)}
						</div>
					</ErrorBoundary>
				</div>
			</div>
		)
	);
};

export default Cadences;

const CadenceCard = forwardRef(({ cadence, filters, handleMultiSelect }, ref) => {
	return (
		<div
			title={cadence.name}
			key={cadence.cadence_id}
			onClick={() => handleMultiSelect(cadence.cadence_id, "task_cadences")}
			className={
				filters.task_cadences.includes(cadence.cadence_id) ? styles.selected : ""
			}
			ref={ref}
		>
			<div className={styles.info}>{cadence.name}</div>
			<div className={styles.tick}>
				<Tick />
			</div>
		</div>
	);
});
