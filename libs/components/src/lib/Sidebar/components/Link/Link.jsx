import { userInfo } from "@cadence-frontend/atoms";
import { TooltipThemes } from "@cadence-frontend/themes";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import Tooltip from "../../../Tooltip/Tooltip";
import styles from "./Link.module.scss";

const Link = ({ icon, name, active, to, onClick }) => {
	const navigate = useNavigate();
	const user = useRecoilValue(userInfo);
	return (
		<Tooltip
			theme={TooltipThemes.RIGHT}
			text={name?.label[user?.language?.toUpperCase()]}
			className={`${styles.link} ${active ? styles.active : ""}`}
			onClick={() => {
				if (onClick && typeof onClick === "function") onClick();
				else navigate(to);
			}}
			id={to === "/tasks" ? "tasks-nav-btn" : null}
		>
			{icon}
		</Tooltip>
	);
};

export default Link;
