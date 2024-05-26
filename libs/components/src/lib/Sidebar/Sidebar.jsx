import { powerInfo, timeElapsed, userInfo } from "@cadence-frontend/atoms";
import { Tooltip } from "@cadence-frontend/components";
import { MessageContext } from "@cadence-frontend/contexts";
import { useRingoverOAuth } from "@cadence-frontend/data-access";
import { CadenceLogo } from "@cadence-frontend/icons";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import { useOutsideClickHandler } from "@cadence-frontend/utils";
import { CallIframeContext } from "@salesforce/context";
import { useContext, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilValue, useResetRecoilState, useSetRecoilState } from "recoil";
import Button from "../Button/Button";
import ProfilePicture from "../ProfilePicture/ProfilePicture";
import RingoverCall from "../RingoverCall/RingoverCall";
import styles from "./Sidebar.module.scss";
import Link from "./components/Link/Link";

const Sidebar = ({ routes }) => {
	const location = useLocation();

	const { simpleSDK } = useContext(CallIframeContext);
	const { stepChangeable, addConfirmMessage } = useContext(MessageContext);

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
				{routes
					.filter(route => route.includedInSidebar)
					.map(link => (
						<Link
							key={link.name}
							onClick={
								stepChangeable === true
									? true
									: () => {
											if (stepChangeable.type === "unsubscribeError") {
												addConfirmMessage({
													msg: COMMON_TRANSLATION?.UNSUBSCRIBE_LINK_MANDATORY?.[
														user?.language?.toUpperCase()
													],
													fun: stepChangeable.fun,
													type: stepChangeable.type,
												});
											} else if (stepChangeable.type === "replyMailError") {
												addConfirmMessage({
													type: stepChangeable.type,
													msg: "Please, select mail step",
												});
											}
											return false;
									  }
							}
							to={link.link}
							name={link.name}
							icon={link.icon}
							active={location.pathname.split("/")[1] === link.link.slice(1)}
						/>
					))}
			</div>
			<div className={styles.bottom}>
				<div className={styles.ringoverCall}>
					<RingoverCall />
				</div>
				<div
					ref={profileRef}
					onClick={() => {
						stepChangeable === true
							? setProfileDropdown(curr => !curr)
							: (() => {
									if (stepChangeable.type === "unsubscribeError") {
										addConfirmMessage({
											msg: COMMON_TRANSLATION?.UNSUBSCRIBE_LINK_MANDATORY?.[
												user?.language?.toUpperCase()
											],
											fun: stepChangeable.fun,
											type: stepChangeable.type,
										});
									}
									return false;
							  })();
					}}
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

export default Sidebar;
