/* eslint-disable no-console */
import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Link.module.scss";

const Link = ({ icon, name, active, to }) => {
	const navigate = useNavigate();
	return (
		<div
			tooltip={name}
			className={`${styles.link} ${active ? styles.active : ""}`}
			onClick={() => console.log(name)}
			style={{
				display: !name ? "none" : "",
			}}
		>
			{icon}
		</div>
	);
};

export default Link;
