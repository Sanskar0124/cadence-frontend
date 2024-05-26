/* eslint-disable no-console */
import { useEffect, useState, useContext } from "react";
import Notification from "./Notifcation/Notification";
import styles from "./NotificationStack.module.scss";
import { TestData } from "./Notifcation/constants";
import { SocketContext } from "@cadence-frontend/contexts";
import { SOCKET_ON_EVENTS } from "@cadence-frontend/constants";

const NotificationStack = () => {
	// const [socketForNotif] = useSocket(ENV.BACKEND);

	const [alerts, setAlerts] = useState([]);

	const { addSocketHandler } = useContext(SocketContext);

	useEffect(() => {
		addSocketHandler({
			event_name: SOCKET_ON_EVENTS.NOTIFICATION,
			key: "notificationStack",
			handler: notification => {
				if (notification && !isDuplicatePresent(notification)) {
					setAlerts(prev => [...prev, notification]);
				}
			},
		});
	}, []);

	const isDuplicatePresent = notification => {
		return alerts.find(
			alert =>
				// filter by message_id
				alert.id === notification.id ||
				alert.message_id === notification.message_id ||
				// filter by lead_id and type
				(alert.lead_id &&
					alert.lead_id === notification.lead_id &&
					alert.type === notification.type)
		);
	};

	function remove(id) {
		setAlerts(prev => [...prev.filter(alert => alert.id !== id)]);
	}

	return (
		alerts.length !== 0 && (
			<div className={styles.alert_container}>
				{alerts?.map(alert => (
					<Notification
						key={alert.id}
						type={alert.type}
						title={alert.title}
						caption={alert.caption}
						remove={() => remove(alert.id)}
						alert={alert}
					/>
				))}
			</div>
		)
	);
};

export default NotificationStack;
