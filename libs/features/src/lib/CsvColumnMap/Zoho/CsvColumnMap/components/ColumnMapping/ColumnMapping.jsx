import styles from "./ColumnMapping.module.scss";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { Skeleton } from "@cadence-frontend/components";

export default function ColumnMapping({ columns, loading }) {
	return (
		<div className={styles.maps}>
			<div className={styles.head}>
				<h1>Ringover Cadence fields </h1>
				<h1>Column name</h1>
			</div>
			<div className={styles.map}>
				<div className={styles.rf}>
					{loading ? (
						<Placeholder />
					) : (
						columns?.map((col, index) => {
							return (
								<div className={styles.row}>
									<div className={styles.col1}>
										{col.label} {col.required && <sup>*</sup>}
										<span></span>
									</div>
									<Droppable droppableId={col.label} direction="horizontal">
										{provided => (
											<div
												{...provided.droppableProps}
												ref={provided.innerRef}
												className={`${styles.col2}`}
											>
												<Draggable
													draggableId={JSON.stringify({
														colName: col.name,
														name: col.value.name,
														columnIndex: col.value.columnIndex,
													})}
													index={index}
													key={col.name}
													isDragDisabled={!col.value.name}
												>
													{provided => (
														<div
															key={col.name}
															ref={provided.innerRef}
															{...provided.draggableProps}
															{...provided.dragHandleProps}
															className={`${
																col.value.name ? styles.valActive : styles.valInactive
															} ${styles.field}`}
														>
															{col.value.name}
														</div>
													)}
												</Draggable>
											</div>
										)}
									</Droppable>
								</div>
							);
						})
					)}
				</div>
			</div>
		</div>
	);
}

const Placeholder = () => {
	return (
		<div className={styles.placeholder}>
			{[...Array(10).keys()].map(_ => (
				<div>
					<Skeleton className={styles.field} />
					<Skeleton className={styles.field} />
				</div>
			))}
		</div>
	);
};
