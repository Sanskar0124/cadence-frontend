import { useCadenceForLead } from "@cadence-frontend/data-access";
import { useContext } from "react";
import PauseOrStopRelatedLeadsModal from "./PauseOrStopRelatedLeadsModal";
import { MessageContext } from "@cadence-frontend/contexts";

function ChangeRelatedLeadsModal({
	operation,
	refetchLead,
	setModal,
	changeToNextPowerTask = () => null,
	updatePowerTaskStatus = () => null,
	...rest
}) {
	const isStop = operation === "Stop";
	const { addSuccess, addError } = useContext(MessageContext);
	const {
		stopCadenceForLead,
		stopLoading,
		stopCadenceForLeadData,
		pauseCadenceForLead,
		pauseLoading,
		pauseCadenceForLeadData,
	} = useCadenceForLead({ cadenceId: null });

	//handle to stop related leads
	function handleStopping(body) {
		updatePowerTaskStatus();
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
							desc: err?.response?.data?.error || "Please contact support",
							cId: err?.response?.data?.correlationId,
						}),
					onSuccess: res => {
						addSuccess("Cadence stopped");
						changeToNextPowerTask();
						refetchLead();
						setModal(null);
						rest?.setCadenceState &&
							rest.setCadenceState({
								...rest.cadenceState,
								isStopped: true,
							});
					},
				}
			);
		} catch (err) {
			addError({
				text: err.message || "Unable to stop",
				desc: err?.response?.data?.error || "Please contact support",
				cId: err?.response?.data?.correlationId,
			});
		}
	}
	//handle to pause related leads
	function handlePausing(body) {
		updatePowerTaskStatus();
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
							desc: err?.response?.data?.error || "Please contact support",
							cId: err?.response?.data?.correlationId,
						}),
					onSuccess: res => {
						addSuccess("Cadence paused");
						changeToNextPowerTask();
						refetchLead();
						rest?.setCadenceState &&
							rest.setCadenceState({
								...rest.cadenceState,
								isPaused: true,
							});
						setModal(null);
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
			operation={operation}
			onSubmit={isStop ? handleStopping : handlePausing}
			stopLoading={isStop ? stopLoading : pauseLoading}
			message={isStop ? stopCadenceForLeadData : pauseCadenceForLeadData}
			setModal={setModal}
			{...rest}
		/>
	);
}

export default ChangeRelatedLeadsModal;
