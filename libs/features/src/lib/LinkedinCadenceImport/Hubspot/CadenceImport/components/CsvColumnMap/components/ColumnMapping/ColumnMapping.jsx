import styles from "./ColumnMapping.module.scss";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { Skeleton } from "@cadence-frontend/components";
import { COLUMNS, REQUIRED_INDEX } from "../../constants";

export default function ColumnMapping({ ringoverFields, extractColumnsLoading, column }) {
	// console.log(column)
	return (
		<div className={styles.maps}>
			<div className={styles.head}>
				<h1>Ringover Cadence fields </h1>
				<h1>Column name</h1>
			</div>
			<div className={styles.map}>
				<div className={styles.rf}>
					{column?.map((col, index) => {
						{
							/* if (index > 13) {
							return null;
						} */
						}
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
											{extractColumnsLoading ? (
												<Skeleton className={styles.field} />
											) : (
												<Draggable
													draggableId={col.name}
													index={index}
													key={col.name}
													isDragDisabled={ringoverFields[index] == null}
												>
													{provided => (
														<div
															key={col.name}
															ref={provided.innerRef}
															{...provided.draggableProps}
															{...provided.dragHandleProps}
															className={`${
																ringoverFields[index]
																	? styles.valActive
																	: styles.valInactive
															} ${styles.field}`}
														>
															{ringoverFields[index]}
														</div>
													)}
												</Draggable>
											)}
										</div>
									)}
								</Droppable>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}
