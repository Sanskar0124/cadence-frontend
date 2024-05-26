import { tourInfo, userInfo } from "@cadence-frontend/atoms";
import { useRecoilState, useRecoilValue } from "recoil";
import styles from "./Tour.module.scss";
import {
	INITIAL_TOUR_STEPS_ENUM,
	PRODUCT_TOUR_STATUS,
	PRODUCT_TOUR_STEP_TYPE,
} from "@cadence-frontend/constants";
import ThemedButton from "../ThemedButton/ThemedButton";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { useContext, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Colors, useOutsideClickHandler } from "@cadence-frontend/utils";
import { useProductTour, useUser } from "@cadence-frontend/data-access";
import TourSuccessModal from "./components/TourSuccessModal/TourSuccessModal";
import TourWelcomeModal from "./components/TourWelcomeModal/TourWelcomeModal";
import {
	Tour as TOUR_TRANSLATION,
	Common as COMMON_TRANSLATION,
} from "@cadence-frontend/languages";
import { MessageContext } from "@cadence-frontend/contexts";
import TourErrorModal from "./components/TourErrorModal/TourErrorModal";
import { RingoverLogo, RingoverOverlay } from "@cadence-frontend/icons";

const STEP_CHANGE_TYPES = {
	NEXT: "next",
	PREV: "prev",
	STOP: "stop",
};

const Tour = () => {
	const { addError } = useContext(MessageContext);
	const navigate = useNavigate();
	const location = useLocation();
	const user = useRecoilValue(userInfo);
	const [tour, setTour] = useRecoilState(tourInfo);
	const tourRef = useRef(null);
	const [isStepVisible, setIsStepVisible] = useState(false);
	const { updateUser, updateLoading } = useUser();
	const { markProductTourComplete } = useProductTour();
	const [loading, setLoading] = useState(false);

	useOutsideClickHandler(tourRef, () => null);

	const onStepChange = type => {
		if (
			STEP_CHANGE_TYPES.NEXT === type &&
			tour?.steps_map[tour?.currentStep]?.isNextStepManual === true
		) {
			setIsStepVisible(false);
			setTour(prev => ({ ...prev, currentStepCompleted: true }));
			return;
		}
		setLoading(type);
		if (STEP_CHANGE_TYPES.NEXT === type || STEP_CHANGE_TYPES.PREV === type) {
			if (tour.steps_map[tour?.currentStep]?.type === PRODUCT_TOUR_STEP_TYPE.CLICK)
				setIsStepVisible(false);
			let NEW_STEP =
				STEP_CHANGE_TYPES.NEXT === type
					? tour?.steps_order[tour?.steps_order.indexOf(tour?.currentStep) + 1]
					: tour?.steps_order[tour?.steps_order.indexOf(tour?.currentStep) - 1];
			updateUser(
				{
					product_tour_step: {
						step: NEW_STEP,
						url: `${window.location.pathname}${window.location.search}${window.location.hash}`,
					},
				},
				{
					onSuccess: () =>
						setTour(prev => ({
							...prev,
							currentStep: NEW_STEP,
							currentUrl: `${window.location.pathname}${window.location.search}${window.location.hash}`,
						})),
					onError: err => {
						addError({
							text: err.response?.data?.msg || "Error while moving to next step",
							desc: err?.response?.data?.error,
							cId: err?.response?.data?.correlationId,
						});
						navigate(tour?.currentUrl.slice(4));
						setIsStepVisible(true);
						if (tour?.steps_map[tour?.currentStep]?.isErrorModalHandling)
							setTour(prev => ({ ...prev, isError: true }));
					},
					onSettled: () => setLoading(false),
				}
			);
			return;
		}
		if (STEP_CHANGE_TYPES.STOP === type) {
			if (tour?.status === PRODUCT_TOUR_STATUS.AFTER_ONBOARDING_PENDING) {
				markProductTourComplete(null, {
					onSettled: () => {
						setTour(prev => ({
							...prev,
							status: PRODUCT_TOUR_STATUS.NOT_STARTED,
							currentStep: "",
							currentUrl: "",
							steps_order: [],
							steps_map: {},
						}));
						navigate("/cadence");
						setLoading(false);
						window.userGuiding.launchChecklist(17187, {
							itemsShown: true,
						});
					},
				});
				return;
			}
			setTour(prev => ({
				...prev,
				status: PRODUCT_TOUR_STATUS.NOT_STARTED,
				currentStep: "",
				currentUrl: "",
				steps_order: [],
				steps_map: {},
			}));
		}
	};

	useEffect(() => {
		if (updateLoading || !isStepVisible) return;
		if (
			tour?.status !== PRODUCT_TOUR_STATUS.NOT_STARTED &&
			tour?.currentUrl &&
			tour?.currentUrl !==
				`${window.location.pathname}${window.location.search}${window.location.hash}`
		)
			navigate(tour?.currentUrl.slice(4));
	}, [location]);

	useEffect(() => {
		if (tour?.currentStepCompleted) return;
		const timeout = setTimeout(
			() => setIsStepVisible(true),
			tour?.steps_map[tour?.currentStep]?.delay ?? 0
		);
		return () => clearTimeout(timeout);
	}, [tour]);

	// return (
	// <button
	// 	onClick={() => {
	// 		updateUser(
	// 			{
	// 				product_tour_status: "after_onboarding_pending",
	// 				product_tour_step: {
	// 					step: INITIAL_TOUR_STEPS_ENUM.CLICK_PEOPLE,
	// 					url: `/crm/cadence/210038`,
	// 				},
	// 			},
	// 			{
	// 				onSuccess: () =>
	// 					setTour(prev => ({
	// 						...prev,
	// 						currentStep: INITIAL_TOUR_STEPS_ENUM.CLICK_PEOPLE,
	// 						currentUrl: `/crm/cadence/210038`,
	// 					})),
	// 			}
	// 		);
	// 	}}
	// >
	// 	update step
	// </button>
	// );

	if (tour?.status === PRODUCT_TOUR_STATUS.NOT_STARTED) return null;

	if (tour?.isError)
		return (
			<TourErrorModal
				modal
				onRefresh={() => setTour(prev => ({ ...prev, isError: false }))}
			/>
		);

	if (tour?.isLoading)
		return (
			<div className={styles.loaderOverlay}>
				<div className={styles.blurBg} />
				<div className={styles.container}>
					<RingoverOverlay size="85px" color={Colors.white} />
				</div>
				<span>Loading next task</span>
			</div>
		);

	if (!isStepVisible) return <div className={styles.overlay}></div>;

	if (tour?.steps_map[tour?.currentStep]?.type === PRODUCT_TOUR_STEP_TYPE.WELCOME_MODAL)
		return (
			<TourWelcomeModal
				modal={tour?.steps_map[tour?.currentStep]}
				onClose={() => onStepChange(STEP_CHANGE_TYPES.NEXT)}
			/>
		);

	if (tour?.steps_map[tour?.currentStep]?.type === PRODUCT_TOUR_STEP_TYPE.SUCCESS_MODAL)
		return (
			<TourSuccessModal
				modal={tour?.steps_map[tour?.currentStep]}
				onClose={() =>
					onStepChange(
						tour?.steps_order.indexOf(tour?.currentStep) === tour?.steps_order.length - 1
							? STEP_CHANGE_TYPES.STOP
							: STEP_CHANGE_TYPES.NEXT
					)
				}
			/>
		);

	return (
		<div className={styles.overlay}>
			<div
				className={`${styles.highlight} ${
					tour?.steps_map[tour?.currentStep]?.highlightClass
						? styles[tour?.steps_map[tour?.currentStep]?.highlightClass]
						: ""
				}`}
				style={{
					...tour?.steps_map[tour?.currentStep]?.highlightStyle,
					...(tour?.steps_map[tour?.currentStep]?.type === PRODUCT_TOUR_STEP_TYPE.INFO
						? {
								boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.2)",
						  }
						: { cursor: "pointer" }),
				}}
				onClick={() => {
					if (
						tour?.steps_map[tour?.currentStep]?.type === PRODUCT_TOUR_STEP_TYPE.CLICK &&
						document.querySelector(tour?.steps_map[tour?.currentStep]?.onClickButtonId)
					) {
						document
							.querySelector(tour?.steps_map[tour?.currentStep]?.onClickButtonId)
							?.click();
						onStepChange(
							tour?.steps_order.indexOf(tour?.currentStep) ===
								tour?.steps_order.length - 1
								? STEP_CHANGE_TYPES.STOP
								: STEP_CHANGE_TYPES.NEXT
						);
					}
				}}
				ref={tourRef}
			>
				{tour.steps_map[tour?.currentStep]?.type === PRODUCT_TOUR_STEP_TYPE.INFO ? (
					<div
						className={`${styles.info} ${
							styles[tour?.steps_map[tour?.currentStep]?.arrowPosition]
						}`}
						style={tour?.steps_map[tour?.currentStep]?.infoStyle}
					>
						<span>
							{tour?.steps_map[tour?.currentStep]?.title[user?.language?.toUpperCase()]}
						</span>
						<p>
							{tour?.steps_map[tour?.currentStep]?.desc[user?.language?.toUpperCase()]}
						</p>
						<div className={styles.footer}>
							<span>
								{tour?.steps_map[tour?.currentStep]?.stepCount?.current}{" "}
								{COMMON_TRANSLATION.OF[user?.language?.toUpperCase()]}{" "}
								{tour?.steps_map[tour?.currentStep]?.stepCount?.total}
							</span>
							<div>
								{tour?.steps_map[tour?.currentStep]?.stepCount?.total !== 1 &&
									tour?.steps_map[tour?.currentStep]?.stepCount?.current !== 1 && (
										<ThemedButton
											onClick={() => onStepChange(STEP_CHANGE_TYPES.PREV)}
											theme={ThemedButtonThemes.SECONDARY}
											height="36px"
											loading={loading === STEP_CHANGE_TYPES.PREV}
											spinnerClassName={styles.spinner}
										>
											<div>
												{COMMON_TRANSLATION.PREVIOUS[user?.language?.toUpperCase()]}
											</div>
										</ThemedButton>
									)}
								<ThemedButton
									onClick={() =>
										onStepChange(
											tour?.steps_order.indexOf(tour?.currentStep) ===
												tour?.steps_order.length - 1
												? STEP_CHANGE_TYPES.STOP
												: STEP_CHANGE_TYPES.NEXT
										)
									}
									theme={ThemedButtonThemes.PRIMARY}
									height="36px"
									loading={loading === STEP_CHANGE_TYPES.NEXT}
									spinnerClassName={styles.spinner}
								>
									<div>
										{tour?.steps_map[tour?.currentStep]?.customNextButton
											? tour?.steps_map[tour?.currentStep]?.customNextButton[
													user?.language?.toUpperCase()
											  ]
											: COMMON_TRANSLATION.NEXT[user?.language?.toUpperCase()]}
									</div>
								</ThemedButton>
							</div>
						</div>
					</div>
				) : (
					<>
						<div
							className={`${styles.click} ${
								styles[tour?.steps_map[tour?.currentStep]?.clickColor]
							}`}
							style={{ ...tour?.steps_map[tour?.currentStep]?.clickStyle }}
						>
							<div className={styles.circle1} />
							<div className={styles.circle2} />
							<div className={styles.circle3} />
							<div className={styles.circle4} />
						</div>
						{tour?.steps_map[tour?.currentStep]?.title && (
							<div
								className={`${styles.tooltip} ${
									styles[tour?.steps_map[tour?.currentStep]?.arrowPosition]
								}`}
								style={{ ...tour?.steps_map[tour?.currentStep]?.tooltipStyle }}
							>
								{tour?.steps_map[tour?.currentStep]?.taskProgress && (
									<div
										className={`${styles.progress} ${
											styles[
												"step_" + tour?.steps_map[tour?.currentStep]?.taskProgress.current
											]
										}`}
									>
										{tour?.steps_map[tour?.currentStep]?.taskProgress.current}/
										{tour?.steps_map[tour?.currentStep]?.taskProgress.total}
									</div>
								)}
								<span>
									{
										tour?.steps_map[tour?.currentStep]?.title[
											user?.language?.toUpperCase()
										]
									}
								</span>
							</div>
						)}
					</>
				)}
			</div>
		</div>
	);
};

export default Tour;
