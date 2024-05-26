import { Skeleton } from "@cadence-frontend/components";

import "./Placeholder.scss";

const Placeholder = ({ noOfRows, noOfColumns }) => {
	return (
		<>
			{[...Array(noOfRows)].map((_, i) => (
				<tr key={i}>
					{[...Array(noOfColumns)].map((_, j) => (
						<td key={j}>
							<div className="table-placeholder">
								<Skeleton className="table-row-placeholder" />
							</div>
						</td>
					))}
				</tr>
			))}
		</>
	);
};

export default Placeholder;
