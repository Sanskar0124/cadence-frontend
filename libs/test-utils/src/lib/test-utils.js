import React from "react";
import { render } from "@testing-library/react";
import { MessageProvider } from "@cadence-frontend/contexts";
import { MessageStack, NotificationStack } from "@cadence-frontend/widgets";
import { QueryClientProvider, QueryClient } from "react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { RecoilRoot } from "recoil";
import { SocketProvider } from "@cadence-frontend/contexts";
import { PhoneSystemSocket } from "@cadence-frontend/components";
import { userInfo } from "@cadence-frontend/atoms";
import { CallIframeProvider } from "@salesforce/context";

const queryClient = new QueryClient();

export const mockUser = {
	accessToken:
		"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNDllZDY4MjItZGY0Ny00ZGY5LWFlMmEtNzM3ZTNhODYxZjdhIiwiZW1haWwiOiJleHBsb3JhdGlvbi5leHRlcnByaXNlMjAyMkBnbWFpbC5jb20iLCJmaXJzdF9uYW1lIjoiWXV2cmFqIiwicm9sZSI6InN1cGVyX2FkbWluIiwic2RfaWQiOiI0MGQ5Y2JjMi0wMjAzLTQxZTAtYjA4Ni00MTRiNTUwOWQ3Y2MiLCJpbnRlZ3JhdGlvbl90eXBlIjoic2FsZXNmb3JjZSIsImlhdCI6MTY3NTI0NzQxOH0.FBjd6TzhPawQs84lLuUY95-5sIYqVdZjKZZtR0DaVrE",
	user_id: "49ed6822-df47-4df9-ae2a-737e3a861f7a",
	sd_id: "40d9cbc2-0203-41e0-b086-414b5509d7cc",
	company_id: "f9411bdf-1d98-46bb-900e-e2ee78289f76",
	first_name: "Yuvraj",
	last_name: "Singh",
	role: "super_admin",
	email: "exploration.exterprise2022@gmail.com",
	primary_email: "exploration.exterprise2022@gmail.com",
	linkedin_url: null,
	primary_phone_number: "+33755523632",
	timezone: "Asia/Kolkata",
	profile_picture:
		"https://storage.googleapis.com/apt-cubist-307713.appspot.com/crm/profile-images/49ed6822-df47-4df9-ae2a-737e3a861f7a",
	is_call_iframe_fixed: true,
	language: "english",
	integration_type: "salesforce",
	company_integration_id: "22824763",
	instance_url: "https://explorationenterprise-dev-ed.develop.my.salesforce.com",
	phone_system: "ringover",
	mail_integration_type: "google",
};

const AllTheProviders = ({ children }) => (
	<RecoilRoot initializeState={({ set }) => set(userInfo, mockUser)}>
		<QueryClientProvider client={queryClient}>
			<BrowserRouter>
				<MessageProvider>
					<CallIframeProvider>
						<MessageStack />
						<SocketProvider>
							<NotificationStack />
							<PhoneSystemSocket />
							{children}
						</SocketProvider>
					</CallIframeProvider>
				</MessageProvider>
			</BrowserRouter>
		</QueryClientProvider>
	</RecoilRoot>
);

const customRender = (ui, options) => {
	if (options?.route && options?.path) {
		const WithRoute = ({ children }) => (
			<AllTheProviders>
				<Routes>
					<Route path={options.path} element={children} />
				</Routes>
			</AllTheProviders>
		);

		window.history.pushState({}, "test", options.route);
		return render(ui, { wrapper: WithRoute, ...options });
	}
	return render(ui, { wrapper: AllTheProviders, ...options });
};

// re-export everything
export * from "@testing-library/react";

// override render method
export { customRender as render };
