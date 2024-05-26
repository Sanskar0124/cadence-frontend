/* eslint-disable no-console */
import { useEffect } from "react";
import useSocket from "./useSocket";
import { ENV } from "@cadence-frontend/environments";

const useSocketForTasks = (refetchTasks, email) => {
	const [socket] = useSocket(ENV.BACKEND, "/socket-service/socket");

	useEffect(() => {
		defineEvents();
	}, []);

	const defineEvents = () => {
		socket.current.on("connect", () => {
			console.log(
				"%cJOINED SOCKET FOR TASKS",
				"background: #00ddd0; color: #000; font-weight: 600;"
			);
			socket.current.emit("join-room", email);
		});
		socket.current.on("connect_failed", () => {
			console.log(
				"%cFAILED TO CONNECT SOCKET FOR TASKS",
				"background: #ff8888; color: #000; font-weight: 600;"
			);
		});

		socket.current.on("recalculate", () => {
			refetchTasks();
		});
	};

	return [socket];
};

export default useSocketForTasks;
