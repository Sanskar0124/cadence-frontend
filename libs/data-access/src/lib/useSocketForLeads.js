/* eslint-disable no-console */
import { useEffect } from "react";

import useSocket from "./useSocket";
import { ENV } from "@cadence-frontend/environments";

const useSocketForLeads = (
	{ setLeads, setAllLeadsFetched, setImportedLeads, setSelectedLeads },
	email
) => {
	const [socket] = useSocket(ENV.BACKEND, "/socket-service/socket");

	useEffect(() => {
		const defineEvents = () => {
			socket.current.on("connect", () => {
				console.log(
					"%c CONNECTED SOCKET FOR LEADS",
					"background: #00ddd0; color: #000; font-weight: 600;"
				);
				socket.current.emit("join-room", email);
			});
			socket.current.on("profile", lead => {
				console.log("profile", lead);
				setLeads(prev => [...prev, lead]);
				setSelectedLeads(prev => [...prev, lead.linkedinUrl]);
			});
			socket.current.on("profiles", leads => {
				console.log("profiles hit", leads);
				setAllLeadsFetched(true);
			});
			socket.current.on("imports", data => {
				console.log("imports", data);
				setImportedLeads(data.success); // SALESFORCE
			});
		};
		defineEvents();
	}, []);

	return [socket];
};

export default useSocketForLeads;
