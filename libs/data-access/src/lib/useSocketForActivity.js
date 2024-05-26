/* eslint-disable no-console */
import { useEffect } from "react";
import useSocket from "./useSocket";
import { ENV } from "@cadence-frontend/environments";

const useSocketForActivity = (setLatestActivityFromSocket, email) => {
	const [socket] = useSocket(ENV.BACKEND, "/socket-service/socket");

	useEffect(() => {
		defineEvents();
	}, []);

	const defineEvents = () => {
		socket.current.on("connect", () => {
			console.log(
				"%cJOINED SOCKET FOR ACTIVITY",
				"background: #00ddd0; color: #000; font-weight: 600;"
			);
			socket.current.emit("join-room", email);
		});
		socket.current.on("connect_failed", () => {
			console.log(
				"%cFAILED TO CONNECT SOCKET FOR ACTIVITY",
				"background: #ff8888; color: #000; font-weight: 600;"
			);
		});
		socket.current.on("msg", msg => console.log(msg));
		socket.current.on("activity", activity => {
			console.log("Received activity:- ", activity);
			setLatestActivityFromSocket(activity);
		});

		socket.current.on("disconnect", () => {
			console.log("socket for activity disconnected");
		});
	};

	return [socket];
};

export default useSocketForActivity;
