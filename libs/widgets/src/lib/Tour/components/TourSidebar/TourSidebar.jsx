import { tourInfo, userInfo } from "@cadence-frontend/atoms";
import { Tooltip, Button, ProfilePicture } from "@cadence-frontend/components";
import { useRingoverOAuth } from "@cadence-frontend/data-access";
import { CadenceLogo, Cadences, Tasks } from "@cadence-frontend/icons";
import {
	Common as COMMON_TRANSLATION,
	Cadence as CADENCE_TRANSLATION,
} from "@cadence-frontend/languages";
import { useOutsideClickHandler } from "@cadence-frontend/utils";
import { CallIframeContext } from "@salesforce/context";
import { useContext, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useRecoilValue } from "recoil";
import styles from "./TourSidebar.module.scss";
import Link from "./components/Link/Link";

const ROUTES = [
	{ blank: true },
	{
		link: "/tasks",
		name: { label: COMMON_TRANSLATION.TASKS, value: "tasks" },
		icon: <Tasks />,
	},
	{
		link: "/cadence",
		name: { label: CADENCE_TRANSLATION.CADENCES, value: "cadence" },
		icon: <Cadences />,
	},
	{ blank: true },
	{ blank: true },
	{ blank: true },
	{ blank: true },
];

const TourSidebar = () => {
	const location = useLocation();
	const tour = useRecoilValue(tourInfo);
	const { simpleSDK } = useContext(CallIframeContext);

	const { signOutFromRingover } = useRingoverOAuth();

	const [profileDropdown, setProfileDropdown] = useState(false);
	const user = useRecoilValue(userInfo);
	const profileRef = useRef(null);
	useOutsideClickHandler(profileRef, () => setProfileDropdown(false));

	const logout = () => {
		signOutFromRingover(
			{},
			{
				onSettled: () => {
					localStorage.clear();
					sessionStorage.clear();
					simpleSDK.destroy();
					window.location.href = "/crm/login?logout=true";
				},
			}
		);
	};

	return (
		<div className={styles.sidebar} id="sidebar">
			<div>
				<CadenceLogo size="38px" />
			</div>
			<div className={styles.links}>
				{ROUTES.map(link =>
					link.blank ||
					(link.name.value === "tasks" &&
						tour?.steps_order.indexOf(tour?.currentStep) <
							tour?.steps_order.indexOf("click_tasks")) ? (
						<div key={link.name} className={styles.blank} />
					) : (
						<Link
							key={link.name}
							to={link.link}
							name={link.name}
							icon={link.icon}
							active={location.pathname.split("/")[1] === link.link.slice(1)}
						/>
					)
				)}
			</div>
			<div className={styles.bottom}>
				<div className={styles.ringoverCall} />
				<div
					ref={profileRef}
					onClick={() => setProfileDropdown(curr => !curr)}
					className={`${styles.profile} ${
						location.pathname === "/profile" && styles.active
					}`}
				>
					<Tooltip
						text={user?.email}
						className={`${styles.userEmail} ${profileDropdown && styles.show}`}
					>
						<ProfilePicture />
					</Tooltip>
					{profileDropdown && (
						<div className={styles.dropdown}>
							{/* <Button onClick={() => navigate("/profile")}>
								{PROFILE_TRANSLATION.PROFILE[user?.language?.toUpperCase()]}
							</Button> */}
							<Button onClick={logout}>
								{/* Disconnect */}
								{COMMON_TRANSLATION.DISCONNECT[user?.language?.toUpperCase()]}
							</Button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default TourSidebar;
