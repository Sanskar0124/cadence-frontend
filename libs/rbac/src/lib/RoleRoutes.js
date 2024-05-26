import { tourInfo, userInfo } from "@cadence-frontend/atoms";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useRecoilState, useSetRecoilState } from "recoil";
import { ROLE_ROUTES } from "./constants/index";

//components
import {
	ErrorBoundary,
	NewFeatureModal,
	PhoneSystemSocket,
	Sidebar,
} from "@cadence-frontend/components";
import { MessageContext, SocketProvider } from "@cadence-frontend/contexts";
import {
	CompareCadence,
	PageNotFound,
	Statistics,
	Testing,
} from "@cadence-frontend/features";
import {
	ChatBot,
	IntegrationChangedModal,
	MailIntegrationExpiredModal,
	NotificationStack,
	TeamChangedModal,
	Tour,
	TourSidebar,
} from "@cadence-frontend/widgets";

import { Spinner } from "@cadence-frontend/components";
import { useRingoverOAuth, useUser } from "@cadence-frontend/data-access";
import { useContext, useEffect, useState } from "react";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import styles from "./RoleRoutes.module.scss";
// import "moment/locale/fr";
import {
	INITIAL_TOUR_STEPS_MAP,
	INITIAL_TOUR_STEPS_ORDER,
	LANGUAGE_NAME_MAP,
	ROLES,
	PRODUCT_TOUR_STATUS,
} from "@cadence-frontend/constants";
import { capitalize } from "@cadence-frontend/utils";
import moment from "moment-timezone";

const EMAIL_TOKEN_EXPIRED_ENUM = {
	google: "is_google_token_expired",
	outlook: "is_outlook_token_expired",
};

const RoleRoutes = () => {
	const { addError } = useContext(MessageContext);
	const location = useLocation();
	const navigate = useNavigate();
	const [user, setUser] = useRecoilState(userInfo);
	const [tour, setTour] = useRecoilState(tourInfo);
	const [loading, setLoading] = useState(true);

	const { user: fetchedUser, updateUser } = useUser({
		user: !loading,
	});
	const { updateAccessToken } = useRingoverOAuth();

	const [integrationChangedModal, setIntegrationChangedModal] = useState(false);
	const [mailIntegrationExpiredModal, setMailIntegrationExpiredModal] = useState(false);
	const [teamChangedModal, setTeamChangedModal] = useState(false);
	//To keep track if showModals have both crm_change and team_change and it will help to open team_changed_modal after crm_changed modal.
	const [integrationChangedModalOpened, setIntegrationChangedModalOpened] =
		useState(false);

	// const [newFeatureModal, setNewFeatureModal] = useState(false);

	// useEffect(() => {
	// 	const newFeatureModalValue = localStorage.getItem("new-feature-modal-4");
	// 	if (!window.location.href.includes("onboarding")) {
	// 		if (newFeatureModalValue === null) setNewFeatureModal(true);
	// 		else setNewFeatureModal(false);
	// 	}
	// }, [fetchedUser]);

	useEffect(() => {
		if (
			user?.company_status === "not_configured_after_integration_change" &&
			user?.role === ROLES.SUPER_ADMIN
		)
			return navigate("/reconfigure");

		if (user?.showModals?.Company_Histories?.length && user?.role !== ROLES.SUPER_ADMIN) {
			setIntegrationChangedModal(user?.showModals?.Company_Histories?.[0]);
			setIntegrationChangedModalOpened(true);
		} else if (Object?.keys(user?.showModals?.Tracking ?? {})?.length) {
			setTeamChangedModal(user?.showModals?.Tracking);
		}
	}, [user]);

	useEffect(() => {
		if (
			!integrationChangedModal &&
			integrationChangedModalOpened &&
			Object?.keys(user?.showModals?.Tracking)?.length
		) {
			setTeamChangedModal(user?.showModals?.Tracking);
		}
	}, [integrationChangedModal]);

	useEffect(() => {
		if (fetchedUser) {
			moment.locale(LANGUAGE_NAME_MAP[fetchedUser?.language]);
			if (fetchedUser?.timezone) moment.tz.setDefault(user?.timezone);
			else {
				updateUser(
					{ timezone: moment.tz.guess() },
					{
						onSuccess: () => moment.tz.setDefault(moment.tz.guess()),
					}
				);
			}

			setUser(prev => ({
				...prev,
				user_id: fetchedUser.user_id,
				sd_id: fetchedUser.sd_id,
				company_id: fetchedUser.company_id,
				company_name: fetchedUser.company_name,
				first_name: fetchedUser.first_name,
				last_name: fetchedUser.last_name,
				role: fetchedUser.role,
				email: fetchedUser.email,
				email_scope_level: fetchedUser.email_scope_level,
				primary_email: fetchedUser.primary_email,
				primary_phone_number: fetchedUser.primary_phone_number,
				timezone: fetchedUser.timezone,
				profile_picture: fetchedUser.profile_picture,
				is_call_iframe_fixed: fetchedUser.is_call_iframe_fixed,
				language: fetchedUser.language,
				company_integration_id: fetchedUser.company_integration_id,
				instance_url: fetchedUser.Integration_Token?.instance_url,
				phone_system: fetchedUser.phone_system,
				mail_integration_type: fetchedUser.mail_integration_type,
				ringover_team_id: fetchedUser.ringover_team_id,
				created_at: fetchedUser.created_at,
				is_trial_active: fetchedUser.is_trial_active,
				is_onboarding_complete: fetchedUser.is_onboarding_complete,
				is_google_token_expired: fetchedUser.is_google_token_expired,
				is_outlook_token_expired: fetchedUser.is_outlook_token_expired,
			}));
			if (
				!fetchedUser?.is_onboarding_complete &&
				window.location.hostname !== "localhost"
			)
				navigate("/onboarding");
			if (
				fetchedUser?.product_tour_status ===
					PRODUCT_TOUR_STATUS.AFTER_ONBOARDING_PENDING &&
				fetchedUser?.is_onboarding_complete
			) {
				navigate(fetchedUser?.product_tour_step?.url?.slice(4) ?? "/cadence");
			}
			if (
				fetchedUser?.product_tour_status ===
					PRODUCT_TOUR_STATUS.AFTER_ONBOARDING_PENDING &&
				fetchedUser?.is_onboarding_complete &&
				tour?.status === PRODUCT_TOUR_STATUS.NOT_STARTED
			) {
				setTour(prev => ({
					...prev,
					currentStep: fetchedUser?.product_tour_step?.step ?? "welcome_modal",
					currentUrl: fetchedUser?.product_tour_step?.url ?? "/crm/cadence",
					status: PRODUCT_TOUR_STATUS.AFTER_ONBOARDING_PENDING,
					steps_order: INITIAL_TOUR_STEPS_ORDER,
					steps_map: INITIAL_TOUR_STEPS_MAP,
				}));
			} else if (
				fetchedUser?.product_tour_status !==
					PRODUCT_TOUR_STATUS.AFTER_ONBOARDING_PENDING &&
				tour?.status !== PRODUCT_TOUR_STATUS.NOT_STARTED
			) {
				setTour(prev => ({
					...prev,
					currentStep: null,
					currentUrl: null,
					status: PRODUCT_TOUR_STATUS.NOT_STARTED,
					steps_order: [],
					steps_map: {},
				}));
			}
		}
	}, [fetchedUser]);

	useEffect(() => {
		//set a timeout to update the access token before it expires
		setTimeout(() => {
			updateAccessToken(
				{
					body: {
						id_token: user?.ringover_tokens?.id_token,
						refresh_token: user?.ringover_tokens?.refresh_token,
					},
				},
				{
					onSuccess: data => {
						setUser(prev => ({
							...prev,
							ringover_tokens: data,
							token_expires_at: Date.now() + (data.expires_in - 300) * 1000,
						}));
					},
					onError: () => setUser(prev => ({ language: prev.language })),
				}
			);
		}, Math.max(user?.token_expires_at - Date.now(), 0));

		//set loading to false when the token is updated, with a delay 1 sec so that the accessToken is updated in localstorage
		if (user?.token_expires_at > Date.now()) setTimeout(() => setLoading(false), 1000);
	}, [user?.token_expires_at]);

	useEffect(() => {
		if (
			location.pathname.includes("home") &&
			fetchedUser?.[EMAIL_TOKEN_EXPIRED_ENUM[user?.mail_integration_type]]
		) {
			addError({
				text: COMMON_TRANSLATION.CONNECT_WITH_MAIL_INTETGRATION[
					user?.language?.toUpperCase()
				].replace("{{mail_integration_type}}", capitalize(user?.mail_integration_type)),
				onClick: () =>
					navigate("/settings?view=my_connections&search=connect_another_source"),
			});
		}
		// const mailTokenExpiredModalValue = localStorage.getItem("mail-token-expired-modal");
		// if (
		// 	fetchedUser?.[EMAIL_TOKEN_EXPIRED_ENUM[user?.mail_integration_type]] &&
		// 	!["onboarding", "reconfigure"].includes(window.location.href) &&
		// 	user?.showModals?.length === 0 &&
		// 	fetchedUser?.product_tour_status !== PRODUCT_TOUR_STATUS.AFTER_ONBOARDING_PENDING
		// ) {
		// 	if (mailTokenExpiredModalValue === null) setMailIntegrationExpiredModal(true);
		// 	else setMailIntegrationExpiredModal(false);
		// }
	}, [location, fetchedUser]);

	const ROUTES_WITHOUT_SIDEBAR = ROLE_ROUTES[user?.role]
		?.filter(route => route.fullScreen)
		?.map(route => route.link);

	const checkAuthentication = () => {
		if (user?.ringover_tokens?.id_token && Object.keys(ROLE_ROUTES).includes(user?.role))
			return true;
		return false;
	};

	const handleLogout = () => {
		window.location.href = "/crm/login?logout=true";
		return (
			<div className={styles.loader}>
				<Spinner className={styles.spinner} />
			</div>
		);
	};

	if (!checkAuthentication()) return handleLogout();

	return (
		<SocketProvider>
			<NotificationStack />
			{window.location.pathname !== "/crm/onboarding" && <ChatBot />}
			<PhoneSystemSocket />
			{!loading && <Tour />}
			<div className={styles.routePageContainer}>
				{!ROUTES_WITHOUT_SIDEBAR.includes(location.pathname) && (
					<div className={styles.sidebar}>
						{tour?.status === PRODUCT_TOUR_STATUS.AFTER_ONBOARDING_PENDING ? (
							<TourSidebar />
						) : (
							<Sidebar routes={ROLE_ROUTES[user.role]} />
						)}
					</div>
				)}
				{loading ? (
					<div className={`${styles.loader} ${styles.withSidebar}`}>
						<Spinner className={styles.spinner} />
					</div>
				) : (
					<div className={styles.routeContainer}>
						<ErrorBoundary>
							<Routes>
								{ROLE_ROUTES[user.role].map(route => (
									<Route
										key={route.name}
										path={route.link}
										exact
										element={route.component}
									/>
								))}
								<Route path="/testing" element={<Testing />} />
								<Route path="/internalstats" element={<Statistics />} />
								<Route path="/testing/comparecadence" element={<CompareCadence />} />

								<Route path="/404" element={<PageNotFound />} />
								<Route path="*" element={<PageNotFound />} />
							</Routes>
						</ErrorBoundary>
					</div>
				)}
			</div>
			{/* <NewFeatureModal modal={newFeatureModal} setModal={setNewFeatureModal} /> */}
			<IntegrationChangedModal
				modal={integrationChangedModal}
				setModal={setIntegrationChangedModal}
			/>
			<TeamChangedModal modal={teamChangedModal} setModal={setTeamChangedModal} />
			<MailIntegrationExpiredModal
				modal={mailIntegrationExpiredModal}
				setModal={setMailIntegrationExpiredModal}
			/>
		</SocketProvider>
	);
};

export default RoleRoutes;
