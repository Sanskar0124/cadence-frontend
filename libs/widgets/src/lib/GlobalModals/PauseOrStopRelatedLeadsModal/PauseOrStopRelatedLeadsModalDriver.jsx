import { useCadenceForLead, useRelatedLeads } from "@cadence-frontend/data-access";
import { useContext } from "react";
import PauseOrStopRelatedLeadsModal from "./PauseOrStopRelatedLeadsModal";
import { MessageContext } from "@cadence-frontend/contexts";

function capitalize(word) {
	return word[0].toUpperCase() + word.slice(1).toLowerCase();
}
function ChangeRelatedLeadsModal({
	//typeSpecificProps
	cadence_id,
	lead,
	refetchLead,
	//modalProps
	type,
	isModal,
	onClose,
	data: activity,
	...rest
}) {
	const isStop = capitalize(type.split("_")[0]) === "Stop";
	const { addSuccess, addError } = useContext(MessageContext);
	const {
		stopCadenceForLead,
		stopLoading,
		stopCadenceForLeadData,
		pauseCadenceForLead,
		pauseLoading,
		pauseCadenceForLeadData,
	} = useCadenceForLead({ cadenceId: cadence_id });
	const { data, relatedLeadLoading } = useRelatedLeads({ lead });

	//handle to stop related leads
	function handleStopping(body) {
		try {
			const { lead_ids, cadence_ids, reason, status } = body;
			stopCadenceForLead(
				{
					lead_ids,
					reason,
					cadence_ids,
					status,
				},
				{
					onError: err =>
						addError({
							text: err?.response?.data?.msg || "Something went wrong!",
							desc: err?.response?.data?.error ?? "Please contact support",
							cId: err?.response?.data?.correlationId,
						}),
					onSuccess: res => {
						addSuccess(res.msg || "Stopped cadence for lead(s) successfully");
						if (typeof refetchLead === "function") refetchLead();
						onClose();
					},
				}
			);
		} catch (err) {
			addError({ text: err.message || "Unable to stop " });
		}
	}
	//handle to pause related leads
	function handlePausing(body) {
		try {
			const { lead_ids, cadence_ids, pauseFor } = body;
			pauseCadenceForLead(
				{
					lead_ids,
					cadence_ids,
					pauseFor,
				},
				{
					onError: err =>
						addError({
							text: err?.response?.data?.msg || "Something went wrong!",
							desc: err?.response?.data?.error ?? "Please contact support",
							cId: err?.response?.data?.correlationId,
						}),
					onSuccess: res => {
						addSuccess(res.msg || "Paused cadence for lead(s) successfully");
						if (typeof refetchLead === "function") refetchLead();
						onClose();
					},
				}
			);
		} catch (err) {
			addError({ text: err.message || "Unable to pause" });
		}
	}
	/*
		PauseOrStopRelatedModel is common component
		operation prop takes either Pause or Stop
	*/
	return (
		<PauseOrStopRelatedLeadsModal
			modal={isModal}
			lead={lead}
			cadence_ids={[cadence_id]}
			operation={capitalize(type.split("_")[0])}
			onSubmit={isStop ? handleStopping : handlePausing}
			stopLoading={isStop ? stopLoading : pauseLoading}
			message={isStop ? stopCadenceForLeadData : pauseCadenceForLeadData}
			setModal={onClose}
			activity={activity}
			data={data}
			relatedLeadLoading={relatedLeadLoading}
			{...rest}
		/>
	);
}

export default ChangeRelatedLeadsModal;
