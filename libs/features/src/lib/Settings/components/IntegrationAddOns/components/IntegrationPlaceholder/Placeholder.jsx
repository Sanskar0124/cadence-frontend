import { Div } from "@cadence-frontend/components";

const Placeholder = ({ width = "100%", number = 1, height = "40px" }) => {
	return (
		<>
			{[...Array(number)].map((_, j) => (
				<Div style={{ height, width }} loading></Div>
			))}
		</>
	);
};

export default Placeholder;
