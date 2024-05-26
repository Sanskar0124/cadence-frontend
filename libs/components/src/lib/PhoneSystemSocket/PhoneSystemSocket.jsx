import { useEffect, useContext } from "react";
import { useRecoilState } from "recoil";

import { userInfo } from "@cadence-frontend/atoms";
import { SocketContext } from "@cadence-frontend/contexts";
import { SOCKET_ON_EVENTS } from "@cadence-frontend/constants";

const PhoneSystemSocket = () => {
	const [user, setUser] = useRecoilState(userInfo);

	const { addSocketHandler } = useContext(SocketContext);

	useEffect(() => {
		addSocketHandler({
			event_name: SOCKET_ON_EVENTS.PHONE_SYSTEM,
			key: "phoneSystem",
			handler: ({ phone_system }) => {
				setUser(prev => ({ ...prev, phone_system }));
			},
		});
	}, []);

	return null;
};

export default PhoneSystemSocket;
