import { Skeleton } from "@cadence-frontend/components";

import "./Placeholder.scss";

const Placeholder = ({ noOfColumns }) => {
	return (
		<tr>
			{[...Array(noOfColumns)].map((_, j) => (
				<td key={j}>
					<div className="table-placeholder">
						<Skeleton className="table-row-placeholder" />
					</div>
				</td>
			))}
		</tr>
	);
};

export default Placeholder;
