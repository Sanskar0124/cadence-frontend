/* eslint-disable no-console */
import { useEffect } from "react";
import useSocket from "./useSocket";
import { ENV } from "@cadence-frontend/environments";

const useSocketForNotifications = (alerts, setAlerts, email) => {
	const [socket] = useSocket(ENV.BACKEND, "/socket-service/socket");

	useEffect(() => {
		defineEvents();
	}, []);

	const defineEvents = () => {
		socket.current.on("connect", () => {
			console.log("Connected notification socket");
			socket.current.emit("join-room", email);
		});
		// socket.current.on("msg", msg => console.log(msg));
		socket.current.on("notification", notification => {
			console.log("Received notification:- ", notification);
			if (notification && !isDuplicatePresent(notification))
				setAlerts(prev => [...prev, notification]);
		});

		socket.current.on("disconnect", () => {
			console.log("socket for notification disconnected");
		});
	};

	const isDuplicatePresent = notification => {
		return alerts.find(
			alert =>
				alert.id === notification.id || alert.message_id === notification.message_id
		);
	};

	return [socket];
};

export default useSocketForNotifications;
