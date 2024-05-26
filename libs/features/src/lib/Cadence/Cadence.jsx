/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-console */
import { useState, useContext, useEffect, useCallback, useRef } from "react";

import {
	Container,
	DeleteModal,
	ErrorBoundary,
	Title,
} from "@cadence-frontend/components";
import { ThemedButton, SearchBar, TabNavSlider } from "@cadence-frontend/widgets";
import { MessageContext } from "@cadence-frontend/contexts";
import { ThemedButtonThemes, TabNavThemes } from "@cadence-frontend/themes";
import { useCadence } from "@cadence-frontend/data-access";
import {
	NoCadence,
	Plus,
	PlusOutline,
	Sort,
	TriangleArrow,
} from "@cadence-frontend/icons";
import { getLabelFromEnum, useLocalStorage, useQuery } from "@cadence-frontend/utils";
import CreateCadenceModal from "./components/CreateCadenceModal/CreateCadenceModal";
import CadenceCard from "./components/CadenceCard/CadenceCard";
import Placeholder from "./components/Placeholder/Placeholder";
import DuplicateCadenceModal from "./components/DuplicateCadenceModal/DuplicateCadenceModal";
import ShareCadenceModal from "./components/ShareCadenceModal/ShareCadenceModal";
import SettingsModal from "./components/SettingsModal/SettingsModal";
import Sidebar from "./components/Sidebar/Sidebar";
import { Cadence as CADENCE_TRANSLATION } from "@cadence-frontend/languages";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import { SocketContext } from "@cadence-frontend/contexts";
import {
	CADENCE_ACTIVE_TAB_KEY,
	VIEW_MODES,
	CADENCE_TYPES,
	HEADERS,
	STEPS_OPTIONS,
	VIEW_MODE_DISABLED_HEADERS,
	CADENCE_TAB_NAV_OPTIONS,
	ADMIN_HEADERS,
} from "./constants";

import styles from "./Cadence.module.scss";
import { ActionModal } from "@cadence-frontend/components";
import { DEFAULT_FILTER_OPTIONS } from "./components/Filters/constants";
import { useRecoilValue } from "recoil";
import { tourInfo, userInfo } from "@cadence-frontend/atoms";
import {
	PRODUCT_TOUR_STATUS,
	ROLES,
	SOCKET_ON_EVENTS,
} from "@cadence-frontend/constants";
import { useNavigate } from "react-router-dom";

const Cadence = () => {
	const navigate = useNavigate();
	const { addError, addSuccess } = useContext(MessageContext);
	const tour = useRecoilValue(tourInfo);
	const query = useQuery();
	const create = query.get("create");
	const [tabInLocalStorage, setTabInLocalStorage] = useLocalStorage(
		CADENCE_ACTIVE_TAB_KEY,
		CADENCE_TYPES.PERSONAL
	);
	const observer = useRef();
	const user = useRecoilValue(userInfo);
	const { addSocketHandler } = useContext(SocketContext);
	const [cadences, setCadences] = useState([]);
	const [activeTab, setActiveTab] = useState(tabInLocalStorage);
	const [searchValue, setSearchValue] = useState("");
	const [search, setSearch] = useState("");
	const [stepsSorted, setStepsSorted] = useState(null);
	const [createCadenceModal, setCreateCadenceModal] = useState(false);
	const [duplicateCadenceModal, setDuplicateCadenceModal] = useState(null);
	const [settingsModal, setSettingsModal] = useState(null);
	const [shareCadenceModal, setShareCadenceModal] = useState(null);
	const [deleteModal, setDeleteModal] = useState(false);
	const [viewMode, setViewMode] = useState(null);
	const [sidebarWidth, setSidebarWidth] = useState("0%");
	const [filtersCount, setFiltersCount] = useState(0);
	const [loadingId, setLoadingId] = useState();
	const [actionModal, setActionModal] = useState(false);

	const cadenceDataAccess = useCadence(true, activeTab, searchValue);
	const {
		filters,
		setFilters,
		cadencesData,
		fetchCadences,
		fetchCadencesError,
		deleteCadence,
		cadenceLoading,
		fetchNextPage,
		hasNextPage,
		isFetching,
		isFetchingNextPage,
		launchCadence,
		pauseCadence,
	} = cadenceDataAccess;

	//side effects

	useEffect(() => {
		fetchCadences();
		setTabInLocalStorage(activeTab);
	}, [activeTab]);

	useEffect(() => {
		if (fetchCadencesError)
			addError({
				text: fetchCadencesError?.response?.data?.msg,
				desc: fetchCadencesError?.response?.data?.error,
				cId: fetchCadencesError?.response?.data?.correlationId,
			});
	}, [fetchCadencesError]);

	useEffect(() => {
		if (!search) setSearchValue("");
	}, [search]);

	useEffect(() => {
		if (cadencesData) {
			setCadences([...cadencesData].sort(sortCadencesForTour));
		}
	}, [cadencesData]);

	useEffect(() => {
		if (viewMode === VIEW_MODES.FILTER) setSidebarWidth("30%");
		else setSidebarWidth("0%");
	}, [viewMode]);

	useEffect(() => {
		setFilters(
			JSON.parse(localStorage.getItem("cadence_filters")) || DEFAULT_FILTER_OPTIONS
		);
		localStorage.removeItem("cadence_leads_filters");
		if (create) {
			handleAddNewCadence();
			navigate("/cadence");
		}
	}, []);

	useEffect(() => {
		let count = 0;
		for (const filter of Object.keys(filters)) if (filters[filter]) count++;
		setFiltersCount(count);
	}, [filters]);

	useEffect(() => {
		if (stepsSorted === STEPS_OPTIONS.INCREASING) {
			let cadencesArray = [...cadencesData];
			cadencesArray.sort((a, b) => a.steps - b.steps);
			setCadences(cadencesArray);
		} else if (stepsSorted === STEPS_OPTIONS.DECREASING) {
			let cadencesArray = [...cadencesData];
			cadencesArray.sort((a, b) => b.steps - a.steps);
			setCadences(cadencesArray);
		} else setCadences(cadencesData);
	}, [stepsSorted]);

	//functions

	const handleSidebarClose = () => setViewMode(null);

	const handleAddNewCadence = () => setCreateCadenceModal(true);

	const handleSearch = () => setSearchValue(search);

	const handleDeleteModalClose = () => setDeleteModal(false);

	const handleCadenceDelete = () =>
		deleteCadence(deleteModal, {
			onError: err =>
				addError({
					text: err?.response?.data?.msg,
					desc: err?.response?.data?.error,
					cId: err?.response?.data?.correlationId,
				}),
			onSuccess: () => {
				addSuccess("Cadence deleted");
				fetchCadences();
			},
		});

	const handleCadenceAction = cadence => {
		if (
			actionModal.buttonText ===
				COMMON_TRANSLATION.RESUME[user?.language?.toUpperCase()] ||
			actionModal.buttonText === COMMON_TRANSLATION.LAUNCH[user?.language?.toUpperCase()]
		)
			handleCadenceResume(cadence);

		if (
			actionModal.buttonText === CADENCE_TRANSLATION.PAUSE[user?.language?.toUpperCase()]
		)
			handleCadencePause(cadence);
	};

	const handleCadencePause = async cadence => {
		setLoadingId(cadence.cadence_id);
		const body = { cadence_id: cadence.cadence_id };
		pauseCadence(body, {
			onError: err =>
				addError({
					text: err.response?.data?.msg || "Error while pausing cadence",
					desc: err?.response?.data?.error,
					cId: err?.response?.data?.correlationId,
				}),
			onSuccess: res => addSuccess(res.msg),
		});
	};

	const handleCadenceResume = async cadence => {
		setLoadingId(cadence.cadence_id);
		launchCadence(cadence.cadence_id, {
			onError: err =>
				addError({
					text: err.response?.data?.msg || "Error while launching cadence",
					desc: err?.response?.data?.error,
					cId: err?.response?.data?.correlationId,
				}),
			onSuccess: res => addSuccess(res.msg),
		});
	};

	const handleStepsClick = isStepsClicked => {
		if (isStepsClicked && stepsSorted) setStepsSorted(null);
	};

	const handleIncreasingStepsClick = () => {
		if (stepsSorted) setStepsSorted(null);
		else setStepsSorted(STEPS_OPTIONS.INCREASING);
	};

	const handleDecreasingStepsClick = () => {
		if (stepsSorted) setStepsSorted(null);
		else setStepsSorted(STEPS_OPTIONS.DECREASING);
	};

	const handleSocketEvent = params => {
		const { launch_at, cadence_id } = params;
		setTimeout(() => {
			const updatedCadences = cadences.filter(
				cadence => cadence.cadence_id !== cadence_id
			);
			setCadences(updatedCadences);
		}, parseInt(launch_at) - new Date().getTime());
	};

	const sortCadencesForTour = a => {
		if (tour?.status !== PRODUCT_TOUR_STATUS.AFTER_ONBOARDING_PENDING) return 0;
		if (a.salesforce_cadence_id === "product_tour_cadence" && a.user_id === user?.user_id)
			return -1;
		return 0;
	};

	useEffect(() => {
		addSocketHandler({
			event_name: SOCKET_ON_EVENTS.SCHEDULED_LAUNCH,
			key: "Scheduled_Lauch",
			handler: handleSocketEvent,
		});
	}, []);

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
		<Container>
			<div className={styles.cadencePage}>
				<div className={styles.header}>
					<div>
						<Title>{CADENCE_TRANSLATION.CADENCES[user?.language?.toUpperCase()]}</Title>
					</div>
					<div className={styles.right}>
						<ThemedButton
							theme={ThemedButtonThemes.WHITE}
							onClick={handleAddNewCadence}
							width="fit-content"
						>
							<Plus />
							<div>{CADENCE_TRANSLATION.NEW_CADENCE[user?.language?.toUpperCase()]}</div>
						</ThemedButton>
						<ThemedButton
							theme={
								viewMode === VIEW_MODES.FILTER || filtersCount
									? ThemedButtonThemes.ACTIVE
									: ThemedButtonThemes.WHITE
							}
							onClick={() => {
								setViewMode(viewMode !== VIEW_MODES.FILTER ? VIEW_MODES.FILTER : null);
							}}
							width="fit-content"
						>
							<Sort />
							<div>
								{COMMON_TRANSLATION.FILTERS[user?.language?.toUpperCase()]}{" "}
								{`${!filtersCount ? "" : "(" + filtersCount + ")"}`}
							</div>
						</ThemedButton>
					</div>
				</div>
				{tour?.status !== PRODUCT_TOUR_STATUS.AFTER_ONBOARDING_PENDING && (
					<div className={styles.subHeader}>
						<TabNavSlider
							theme={TabNavThemes.SLIDER}
							buttons={CADENCE_TAB_NAV_OPTIONS.map(opt => ({
								label: opt.label[user?.language?.toUpperCase()],
								value: opt.value,
							}))}
							value={activeTab}
							setValue={setActiveTab}
							activeBtnClassName={styles.activeTab}
							btnClassName={styles.tabBtn}
							width="270px"
						/>
						<SearchBar
							height="44px"
							width="350px"
							value={search}
							setValue={setSearch}
							onSearch={handleSearch}
							placeholderText={
								CADENCE_TRANSLATION.SEARCH_YOUR_CADENCE[user?.language.toUpperCase()]
							}
						/>
					</div>
				)}
				<div className={`${styles.main}`}>
					<div
						className={`${styles.cadenceHeader} ${viewMode && styles.viewModeActive} ${
							user.role === ROLES.ADMIN || user.role === ROLES.SUPER_ADMIN
								? styles.isAdmin
								: ""
						}`}
					>
						{[
							...(user.role === ROLES.ADMIN || user.role === ROLES.SUPER_ADMIN
								? ADMIN_HEADERS
								: HEADERS),
						].map(
							header =>
								(!viewMode ||
									(viewMode && !VIEW_MODE_DISABLED_HEADERS.includes(header.value))) && (
									<div
										className={`${styles[header.value]} ${stepsSorted && styles.sorted}`}
										onClick={() => handleStepsClick(header.value === "steps")}
									>
										{/* {getLabelFromEnum(header.value)} */}
										{header.label[user?.language?.toUpperCase()]}
										{header.value === "steps" && (
											<div className={styles.arrows}>
												{(!stepsSorted || stepsSorted === STEPS_OPTIONS.INCREASING) && (
													<TriangleArrow
														size="8px"
														onClick={handleIncreasingStepsClick}
													/>
												)}{" "}
												{(!stepsSorted || stepsSorted === STEPS_OPTIONS.DECREASING) && (
													<TriangleArrow
														className={styles.downArrow}
														size="8px"
														onClick={handleDecreasingStepsClick}
													/>
												)}
											</div>
										)}
									</div>
								)
						)}
					</div>
					<div className={styles.body}>
						<div
							className={`${styles.cadencesContainer} ${
								tour?.status === PRODUCT_TOUR_STATUS.AFTER_ONBOARDING_PENDING
									? styles.withoutSubheader
									: ""
							}`}
						>
							{cadenceLoading ? (
								<Placeholder rows={10} />
							) : cadences?.length > 0 ? (
								<ErrorBoundary>
									{cadences?.map((cadence, index) => {
										const isLastCadence = index === cadences.length - 1;
										return isLastCadence ? (
											<>
												<CadenceCard
													cadence={cadence}
													cadenceNo={index + 1}
													totalCadences={cadences?.length}
													cadenceDataAccess={cadenceDataAccess}
													type={activeTab}
													viewMode={viewMode}
													loadingId={loadingId}
													setDuplicateCadenceModal={setDuplicateCadenceModal}
													setSettingsModal={setSettingsModal}
													setShareModal={setShareCadenceModal}
													setDeleteModal={setDeleteModal}
													setActionModal={setActionModal}
													key={cadence.cadence_id}
													ref={cadences?.length > 19 ? lastCadenceRef : null}
												/>
												{isFetchingNextPage && <Placeholder rows={1} />}
											</>
										) : (
											<CadenceCard
												cadence={cadence}
												cadenceNo={index + 1}
												totalCadences={cadences?.length}
												cadenceDataAccess={cadenceDataAccess}
												type={activeTab}
												viewMode={viewMode}
												loadingId={loadingId}
												setDuplicateCadenceModal={setDuplicateCadenceModal}
												setSettingsModal={setSettingsModal}
												setShareModal={setShareCadenceModal}
												setDeleteModal={setDeleteModal}
												setActionModal={setActionModal}
												key={cadence.cadence_id}
											/>
										);
									})}
								</ErrorBoundary>
							) : (
								<div className={styles.noCadence}>
									<NoCadence />
									<div>
										<h4>
											{COMMON_TRANSLATION.NO_CADENCE_FOUND[user?.language?.toUpperCase()]}{" "}
										</h4>
										<ThemedButton
											theme={ThemedButtonThemes.GREY}
											onClick={handleAddNewCadence}
											width="fit-content"
											style={{ fontWeight: "600" }}
										>
											<PlusOutline />
											<div>
												{
													CADENCE_TRANSLATION.CREATE_NEW_CADENCE[
														user?.language?.toUpperCase()
													]
												}
											</div>
										</ThemedButton>
									</div>
								</div>
							)}
						</div>
						<div
							className={styles.sidebarContainer}
							style={{
								width: sidebarWidth,
								// display: sidebarWidth === "0%" ? "none" : "initial",
							}}
						>
							{viewMode && (
								<Sidebar
									filterProps={{ filters, setFilters, filtersCount }}
									viewMode={viewMode}
									setViewMode={setViewMode}
									onClose={handleSidebarClose}
								/>
							)}
						</div>
					</div>
				</div>
			</div>
			<CreateCadenceModal
				modal={createCadenceModal}
				setModal={setCreateCadenceModal}
				dataAccess={cadenceDataAccess}
				type={activeTab}
			/>
			<DuplicateCadenceModal
				modal={duplicateCadenceModal}
				setModal={setDuplicateCadenceModal}
				dataAccess={cadenceDataAccess}
			/>
			<ShareCadenceModal
				modal={shareCadenceModal}
				setModal={setShareCadenceModal}
				dataAccess={cadenceDataAccess}
			/>
			<DeleteModal
				modal={deleteModal}
				itemType={CADENCE_TRANSLATION.CADENCE[user?.language.toUpperCase()]}
				item={deleteModal?.name}
				handleClose={handleDeleteModalClose}
				onDelete={handleCadenceDelete}
			/>
			<SettingsModal
				modal={settingsModal}
				setModal={setSettingsModal}
				dataAccess={cadenceDataAccess}
			/>
			<ActionModal
				buttonText={actionModal?.buttonText}
				message={actionModal?.message}
				modal={actionModal}
				handleClose={() => setActionModal(false)}
				onAction={() => handleCadenceAction(actionModal?.cadence)}
			/>
		</Container>
	);
};

export default Cadence;
