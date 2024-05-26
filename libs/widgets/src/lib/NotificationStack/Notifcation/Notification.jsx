import moment from "moment-timezone";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

import { Close } from "@cadence-frontend/icons";
import { ALERT_TYPES, ICON_MAPPING } from "./constants";

import styles from "./Notification.module.scss";

const Notification = ({ type, caption, title, remove, alert }) => {
	const timeoutId = useRef();
	const alertRef = useRef();
	useEffect(() => {
		timeoutId.current = setTimeout(() => {
			remove();
		}, 15000);
	});

	const handleClose = e => {
		e.preventDefault();
		alertRef.current.className = `${styles.alert_box} ${styles.closed} ${styles[type]}`;
		clearTimeout(timeoutId.current);
		setTimeout(remove, 100);
	};

	const renderComponent = () => {
		return (
			<div className={`${styles.alert} ${styles[type]}`}>
				<div className={`${styles.header} ${styles[type]}`}>
					<div className={styles.left_part}>
						<div className={`${styles.icon} ${styles[type]}`}>{ICON_MAPPING[type]}</div>
						<span className={styles.heading_text}>
							{title?.slice(0, 80)}
							{title?.length > 80 ? ` ...` : ""}
						</span>
					</div>
					<div className={styles.right_part}>
						<span className={styles.alert_time}>at {moment().format("LT")}</span>
						<div className={styles.close_icon} onClick={handleClose}>
							<button className={styles[type]}>
								<Close size={"1.2rem"} />
							</button>
						</div>
					</div>
				</div>
				<div className={`${styles.alert_body} ${styles[type]}`}>
					{type !== ALERT_TYPES.MISSED_CALL && (
						<div className={styles.caption}>{caption}</div>
					)}
				</div>
			</div>
		);
	};

	const redirectLink = () => {
		switch (type) {
			case "mail":
			case "viewed_mail":
			case "clicked_mail":
			case "bounced":
			case "unsubscribed":
			case "hot_lead":
			case "reminder":
				return `/leads/${alert.lead_id}`;
			default:
				return null;
		}
	};

	return (
		<div
			className={`${styles.alert_box} ${styles.active} ${styles[type]}`}
			ref={alertRef}
		>
			{/* <audio
				src="https://storage.googleapis.com/apt_cubist-307713.appspot.com/crm/notification.mp3"
				autoPlay
			/>	 */}
			{redirectLink() ? (
				<Link className={styles.link} to={redirectLink()}>
					{renderComponent()}
				</Link>
			) : (
				renderComponent()
			)}
		</div>
	);
};

Notification.defaultProps = {
	link: "",
};

export default Notification;
