import Placeholder from "./Placeholder/Placeholder";
import THEMES from "./themes";

import styles from "./Table.module.scss";

const Table = ({
	columns,
	children,
	noOfRows,
	className,
	loading = false,
	width = "100%",
	height = "85vh",
	theme,
}) => {
	return (
		<div
			className={`${styles.tableContainer} ${styles[THEMES[theme]]} ${className ?? ""} `}
			style={{ width, height }}
		>
			<table className={styles.table}>
				<thead>
					<tr>
						{columns?.map(column => (
							<th key={column}>{column}</th>
						))}
					</tr>
				</thead>
				<tbody>
					{loading ? (
						<Placeholder noOfColumns={columns.length} noOfRows={noOfRows} />
					) : (
						children
					)}
				</tbody>
			</table>
		</div>
	);
};

export default Table;
