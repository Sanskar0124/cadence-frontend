/* eslint-disable no-console */
import { useState, createContext, useEffect } from "react";
import { nanoid } from "nanoid";
import { ENV } from "@cadence-frontend/environments";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";
import { useSocket } from "@cadence-frontend/data-access";
import { SOCKET_EMIT_EVENTS, SOCKET_ON_EVENTS } from "@cadence-frontend/constants";

export const SocketContext = createContext();

const SocketProvider = ({ children }) => {
	const user = useRecoilValue(userInfo);
	const [socket] = useSocket(ENV.BACKEND, "/socket-service/socket");
	const [socketEventHandlers, setSocketEventHandlers] = useState({
		[SOCKET_ON_EVENTS.ACTIVITY]: {},
		[SOCKET_ON_EVENTS.PROFILE]: {},
		[SOCKET_ON_EVENTS.PROFILES]: {},
		[SOCKET_ON_EVENTS.IMPORTS]: {},
		[SOCKET_ON_EVENTS.NOTIFICATION]: {},
		[SOCKET_ON_EVENTS.TASK_SUMMARY]: {},
		[SOCKET_ON_EVENTS.RECALCULATE]: {},
		[SOCKET_ON_EVENTS.MSG]: {},
		[SOCKET_ON_EVENTS.SCHEDULED_LAUNCH]: {},
		[SOCKET_ON_EVENTS.INTEGRATION_CHANGE_LOGS]: {},
	});

	useEffect(() => {
		defineInitialEvents();
	}, []);

	const defineInitialEvents = () => {
		socket.current.on("connect", () => {
			console.log(
				"%cJOINED SOCKET",
				"background: #00ddd0; color: #000; font-weight: 600;"
			);
			socket.current.emit("join-room", user.email);
		});
		socket.current.on("connect_failed", () => {
			console.log(
				"%cFAILED TO CONNECT SOCKET",
				"background: #ff8888; color: #000; font-weight: 600;"
			);
		});
		socket.current.on("disconnect", () => {
			console.log("socket disconnected");
		});
	};

	useEffect(() => {
		Object.keys(SOCKET_ON_EVENTS).forEach(event_key => {
			const event_name = SOCKET_ON_EVENTS[event_key];
			socket.current.off(event_name);
			socket.current.on(event_name, data => {
				Object.keys(socketEventHandlers[event_name]).forEach(key => {
					if (typeof socketEventHandlers[event_name][key] === "function") {
						socketEventHandlers[event_name][key](data);
					}
				});
			});
		});
	}, [socketEventHandlers]);

	const addSocketHandler = ({ event_name, key, handler }) => {
		if (
			typeof handler === "function" &&
			Object.keys(SOCKET_ON_EVENTS)
				.map(key => SOCKET_ON_EVENTS[key])
				.includes(event_name)
		) {
			setSocketEventHandlers(prev => ({
				...prev,
				[event_name]: { ...prev[event_name], [key]: handler },
			}));
		}
	};

	return (
		<SocketContext.Provider
			value={{
				socket,
				setSocketEventHandlers,
				addSocketHandler,
			}}
		>
			{children}
		</SocketContext.Provider>
	);
};

export default SocketProvider;
