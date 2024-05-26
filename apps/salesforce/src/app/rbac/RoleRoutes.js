import { ROLE_ROUTES } from "./constants/index";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";

//components
import PageNotFound from "../pages/PageNotFound/PageNotFound";
import { Sidebar } from "@salesforce/components";

import Testing from "../pages/Testing/Testing";
import SocketProvider from "../context/SocketContext";
import NotificationStack from "../widgets/NotificationStack/NotificationStack";
import PhoneSystemSocket from "../components/PhoneSystemSocket/PhoneSystemSocket";

import styles from "./RoleRoutes.module.scss";
import { handleLogoutRedirect } from "@cadence-frontend/utils";
import { INTEGRATION_TYPE } from "@cadence-frontend/constants";
import ChatBot from "../widgets/ChatBot/ChatBot";
import { useEffect, useState } from "react";
import { NewFeatureModal } from "@cadence-frontend/components";

const RoleRoutes = () => {
	const location = useLocation();
	const user = useRecoilValue(userInfo);

	const checkAuthentication = () => {
		if (user?.accessToken && user?.integration_type !== INTEGRATION_TYPE.SALESFORCE)
			return (window.location.href = `/crm/${user.integration_type}/home`);
		else if (user?.accessToken && Object.keys(ROLE_ROUTES).includes(user?.role))
			return true;
		return false;
	};

	return checkAuthentication() ? (
		<SocketProvider>
			<NotificationStack />
			<ChatBot />
			<PhoneSystemSocket />
			{newFeatureModal ? (
				<NewFeatureModal modal={newFeatureModal} setModal={setNewFeatureModal} />
			) : (
				<div className={styles.routePageContainer}>
					{!ROUTES_WITHOUT_SIDEBAR.includes(location.pathname) && (
						<div className={styles.sidebar}>
							<Sidebar routes={ROLE_ROUTES[user.role]} />
						</div>
					)}
					<div className={styles.routeContainer}>
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
							{/* <Route path="/profile" element={<Profile />} /> */}
							<Route path="*" element={<PageNotFound />} />
						</Routes>
					</div>
				</div>
			)}
		</SocketProvider>
	) : (
		handleLogoutRedirect()
	);
};

export default RoleRoutes;
