import { TableThemes } from "@cadence-frontend/themes";
import { Skeleton } from "@cadence-frontend/components";
import { THEMES } from "@cadence-frontend/widgets";
import styles from "./Loader.module.scss";

const Loader = ({ compressed, rows = 12 }) => {
	return (
		<div
			className={`${styles.tableContainer} ${
				styles[THEMES[TableThemes.WHITE_AND_LIGHT_PURPLE]]
			} `}
			style={{ width: compressed ? "69.25%" : "100%", height: "100%" }}
		>
			<table className={styles.table} width={"100%"}>
				<tbody>
					{[...Array(rows)].map((_, i) => (
						<tr key={i}>
							{[...Array(compressed ? 3 : 5)].map((_, j) => (
								<td key={j}>
									<Skeleton className={styles.tableRowPlaceholder} />
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

Loader.propTypes = {};

export default Loader;
