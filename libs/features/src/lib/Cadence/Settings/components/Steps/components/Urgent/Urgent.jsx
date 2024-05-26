import { FlagTriangle, FlagTriangleGradient } from "@cadence-frontend/icons";
import { Button } from "@cadence-frontend/components";
import React, { useEffect, useState } from "react";
import { Colors } from "@cadence-frontend/utils";

const Urgent = ({ step, setValue, activeStep }) => {
	const [isUrgent, setIsUrgent] = useState(step.is_urgent);

	useEffect(() => {
		setIsUrgent(step.is_urgent);
	}, [step]);

	useEffect(() => {
		setValue(prev => ({ ...prev, [step.node_id]: isUrgent }));
	}, [isUrgent]);

	return (
		<Button
			onClick={e => {
				e.stopPropagation();
				setIsUrgent(curr => !curr);
			}}
		>
			{isUrgent ? (
				activeStep === step.node_id ? (
					<FlagTriangle color={Colors.white} size="1.1rem" />
				) : (
					<FlagTriangleGradient size="1.1rem" />
				)
			) : (
				<FlagTriangle
					size="1.1rem"
					color={activeStep === step.node_id ? "#ffffff6a" : "#D7D8F7"}
				/>
			)}
		</Button>
	);
};

export default Urgent;
