/* eslint-disable no-console */
import { useEffect, useState } from "react";
import useSocket from "./useSocket";
import { ENV } from "@cadence-frontend/environments";

const useSocketForTaskAnalytics = (setAnalytics, email) => {
	const [socket] = useSocket(ENV.BACKEND, "/socket-service/socket");

	useEffect(() => {
		defineEvents();
	}, []);

	const defineEvents = () => {
		socket.current.on("connect", () => {
			console.log(
				"%cJOINED SOCKET FOR TASK ANALYTICS",
				"background: #00ddd0; color: #000; font-weight: 600;"
			);
			socket.current.emit("join-room", email);
		});
		socket.current.on("connect_failed", () => {
			console.log(
				"%cFAILED TO CONNECT SOCKET FOR TASK ANALYTICS",
				"background: #ff8888; color: #000; font-weight: 600;"
			);
		});
		socket.current.on("task-summary", summary => {
			// console.log("Task Summary:- ", summary);
			setAnalytics(summary);
		});
	};

	return [socket];
};

export default useSocketForTaskAnalytics;
