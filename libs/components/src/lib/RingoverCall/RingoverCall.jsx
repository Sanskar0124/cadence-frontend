import { useState, useContext, useEffect } from "react";
import "./RingoverCall.scss";

import { useCall, useTasks } from "@cadence-frontend/data-access";

import { MessageContext } from "@cadence-frontend/contexts";
import { CallIframeContext } from "@salesforce/context";
import { CALL_DIRECTION } from "./constants";
import { TEMPLATE_TYPES } from "@cadence-frontend/constants";

const RingoverCall = () => {
	const { simpleSDK, setLoading } = useContext(CallIframeContext);
	const { addError } = useContext(MessageContext);
	const { fetchOutgoingCallInfo, fetchIncomingCallInfo } = useCall();
	const { markTaskAsComplete } = useTasks();

	const [apiCallOngoing, setApiCallOngoing] = useState(false);

	// reset state
	const cb = () => {
		setApiCallOngoing(prev => !prev);
		setLoading(false);
	};

	const handleHangupEvent = async e => {
		if (!apiCallOngoing) {
			const call_id = e.data.call_id;
			const currentLeadAndTask = JSON.parse(
				localStorage.getItem("current_lead_and_task")
			);
			if (!currentLeadAndTask) return;

			if (e.data.direction === CALL_DIRECTION.OUT) {
				// Outgoing call
				setApiCallOngoing(prev => !prev);
				setLoading(currentLeadAndTask.lead_id);
				fetchOutgoingCallInfo(
					{
						lead_id: currentLeadAndTask.lead_id,
						call_id,
						cadence_id: currentLeadAndTask.cadence_id,
					},
					{
						onSuccess: () => {
							// if call is for a task
							if (
								currentLeadAndTask.task_name?.toLowerCase() === "call" ||
								currentLeadAndTask.task_name?.toLowerCase() === "callback"
							) {
								const data = {
									task_id: currentLeadAndTask.task_id,
									body: {
										template_id: currentLeadAndTask.Node?.data?.template_id ?? null,
										template_type: currentLeadAndTask.Node?.data?.template_id
											? TEMPLATE_TYPES.SCRIPT
											: null,
									},
								};
								markTaskAsComplete(data, {
									onSuccess: cb,
								});
							}
						},
						onError: err => {
							cb();
							addError({
								text:
									err?.response?.data?.msg ??
									"An unexpected error occurred while logging call activity.",
								desc: err?.response?.data?.error,
								cId: err?.response?.data?.correlationId,
							});
						},
					}
				);
			} else {
				// Incoming call
				fetchIncomingCallInfo(
					{ call_id },
					{
						onSettled: cb,
					}
				);
			}
		}
	};

	useEffect(() => {
		simpleSDK.on("hangupCall", e => handleHangupEvent(e));
	}, []);

	return null;
};

export default RingoverCall;
