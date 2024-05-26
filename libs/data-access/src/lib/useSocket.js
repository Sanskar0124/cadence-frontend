import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

const useSocket = (URL, path) => {
	const socket = useRef();

	useEffect(() => {
		getSocket();
	}, []);

	const getSocket = () => {
		if (!socket.current) {
			if (!path) {
				socket.current = io(URL, {
					transports: ["websocket"],
				});
			} else {
				socket.current = io(URL, {
					transports: ["websocket"],
					path: path,
				});
			}
		}
	};

	return [socket];
};

export default useSocket;
