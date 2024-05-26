import { MessageProvider } from "@cadence-frontend/contexts";
import {
	CalendlyRedirect,
	GetAccessRedirect,
	GoogleRedirect,
	GrantAccessRedirect,
	IntegrationRedirect,
	LinkedinExtensionRedirect,
	Login,
	MarketplaceToCrmRedirect,
	OutlookRedirect,
	PopUpPlayer,
	ResetPassword,
	RingoverRedirect,
	Unsubscribe,
	UserSetup,
	Welcome,
} from "@cadence-frontend/features";
import { RoleRoutes } from "@cadence-frontend/rbac";
import { MessageStack } from "@cadence-frontend/widgets";
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import CallIframeProvider from "./context/RingoverIframe/CallIframe";

import styles from "./app.module.scss";

export function App() {
	const logout = () => {
		localStorage.clear();
		sessionStorage.clear();
		window.location.href = "/crm/login?logout=true";
	};

	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				refetchOnWindowFocus: false,
				retry: false,
			},
		},
		queryCache: new QueryCache({
			onError: err => {
				if (
					(typeof err?.response?.data?.msg === "string" &&
						err?.response?.data?.msg?.includes("Session timed out") &&
						err?.response?.status === 400) ||
					(typeof err?.response?.data?.msg === "string" &&
						err?.response?.data?.msg?.includes("Payment required") &&
						err?.response?.status === 402) ||
					(typeof err?.response?.data?.msg === "string" &&
						err?.response?.data?.msg?.includes("Session expired") &&
						err?.response?.status === 401) ||
					(typeof err?.response?.data?.msg === "string" &&
						err?.response?.data?.msg?.includes(
							"Your access has been revoked, Please contact your admin"
						) &&
						err?.response?.status === 440)
				)
					logout();
			},
		}),
		mutationCache: new MutationCache({
			onError: err => {
				if (
					(typeof err?.response?.data?.msg === "string" &&
						err?.response?.data?.msg?.includes("Session timed out") &&
						err?.response?.status === 400) ||
					(typeof err?.response?.data?.msg === "string" &&
						err?.response?.data?.msg?.includes("Payment required") &&
						err?.response?.status === 402) ||
					(typeof err?.response?.data?.msg === "string" &&
						err?.response?.data?.msg?.includes("Session expired") &&
						err?.response?.status === 401) ||
					(typeof err?.response?.data?.msg === "string" &&
						err?.response?.data?.msg?.includes(
							"Your access has been revoked, Please contact your admin"
						) &&
						err?.response?.status === 440)
				)
					logout();
			},
		}),
	});

	return (
		<QueryClientProvider client={queryClient}>
			<BrowserRouter className={styles} basename="/crm/">
				<MessageProvider>
					<CallIframeProvider>
						<MessageStack />
						<Routes>
							{/* Open Routes */}
							<Route path="/login" exact element={<Login />} />
							<Route path="/welcome" exact element={<Welcome />} />
							{/* OAUTH */}
							<Route
								path="/salesforce/services/salesforce/oauth"
								element={<IntegrationRedirect />}
							/>
							<Route
								path="/pipedrive/services/pipedrive/oauth"
								element={<IntegrationRedirect />}
							/>
							<Route
								path="/hubspot/services/hubspot/oauth"
								element={<IntegrationRedirect />}
							/>
							<Route
								path="/sellsy/services/sellsy/oauth"
								element={<IntegrationRedirect />}
							/>

							<Route path="/zoho/services/zoho/oauth" element={<IntegrationRedirect />} />
							<Route
								path="/bullhorn/services/bullhorn/oauth"
								element={<IntegrationRedirect />}
							/>
							<Route
								path="/dynamics/services/dynamics/oauth"
								element={<IntegrationRedirect />}
							/>

							<Route path="/oauth/ringover" element={<RingoverRedirect />} />

							<Route path="/google/oauth" element={<GoogleRedirect />} />
							<Route path="/calendly/oauth" element={<CalendlyRedirect />} />
							<Route
								path="/linkedin-extension/oauth"
								element={<LinkedinExtensionRedirect />}
							/>
							<Route path="/outlook/oauth" element={<OutlookRedirect />} />
							{/* For Accessing any account through Admin */}
							<Route path="/access/account" element={<GetAccessRedirect />} />
							{/* For Marketplace to Cadence redirect */}
							<Route path="/redirect" element={<MarketplaceToCrmRedirect />} />
							{/* For Chatbot Grant access redirect */}
							<Route path="/access" element={<GrantAccessRedirect />} />
							{/* Video Player */}
							<Route path="/video/:video_tracking_id" element={<PopUpPlayer />} />
							{/* Setup User password to join cadence */}
							<Route path="/user/setup" exact element={<UserSetup />} />
							{/* Reset password through Forgot password mail */}
							<Route path="/user/changePassword" element={<ResetPassword />} />
							{/* Unsubscribe */}
							<Route path="/unsubscribe" element={<Unsubscribe />} />
							{/* Routes rendered according to role*/}
							<Route path="/*" element={<RoleRoutes />} />
						</Routes>
					</CallIframeProvider>
				</MessageProvider>
			</BrowserRouter>
		</QueryClientProvider>
	);
}
export default App;
