import { StripHtml } from "@cadence-frontend/utils";
import { ErrorBoundary } from "@cadence-frontend/components";

const StepName = ({ step, cadence, name, setValue, disabled }) => {
	// const [input, setInput] = useState("");

	// useEffect(() => {
	// 	setInput(stepName);
	// }, []);

	// useEffect(() => {
	// 	setValue(prev => {
	// 		return {
	// 			...prev,
	// 			[name]: input,
	// 		};
	// 	});
	// }, [input]);

	const endIndex =
		step?.data?.subject?.length > 0 && step?.data?.subject?.length % 2 === 0
			? 50
			: 50 + 1;
	return (
		<ErrorBoundary>
			<p>
				{step?.type === "mail" || step?.type === "automated_mail"
					? step?.data?.aBTestEnabled
						? "A/B test enabled"
						: `Sub : ${StripHtml(step?.data?.subject).slice(0, endIndex)}`
					: step?.type === "reply_to" || step?.type === "automated_reply_to"
					? step?.data?.replied_node_id?.length !== 0
						? cadence?.sequence?.find(s => s.node_id === step?.data?.replied_node_id)
								?.data?.aBTestEnabled
							? "Multiple Subjects"
							: `Sub : Re: ${StripHtml(
									cadence?.sequence?.find(s => s.node_id === step?.data?.replied_node_id)
										?.data?.subject
							  ).slice(0, endIndex)}`
						: "Sub :"
					: step?.type === "message" ||
					  step?.type === "automated_message" ||
					  step?.type === "whatsapp"
					? step?.data?.aBTestEnabled
						? "A/B test enabled"
						: `Message : ${StripHtml(step?.data?.message).slice(0, endIndex)}`
					: step?.type === "call" || step?.type === "callback"
					? `Script : ${StripHtml(step?.data?.script).slice(0, endIndex)}`
					: `Instructions : ${StripHtml(step?.data?.message).slice(0, endIndex)}`}
			</p>
		</ErrorBoundary>
	);
};

export default StepName;
