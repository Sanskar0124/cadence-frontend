import { Skeleton } from "@cadence-frontend/components";
import { SearchBar } from "@cadence-frontend/widgets";
import { useState } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import styles from "./ExtractedColumns.module.scss";

function ExtractedColumns({ extractedColumns, displayedColumns, extractColumnsLoading }) {
	const [searchValue, setSearchValue] = useState("");

	const generatePossibleAlphabets = () => {
		return [
			...new Set(displayedColumns?.map(avf => avf?.charAt(0)?.toUpperCase())),
		].sort();
	};

	return (
		<div className={styles.csvColumns}>
			<SearchBar value={searchValue} setValue={setSearchValue} />

			{extractColumnsLoading && (
				<div className={styles.skeletonGrid}>
					{Array(30)
						.fill(null)
						.map((_, index) => (
							<Skeleton className={styles.skeleton} />
						))}{" "}
				</div>
			)}
			<Droppable droppableId={"extracted-col"}>
				{provided => (
					<div
						{...provided.droppableProps}
						ref={provided.innerRef}
						className={styles.values}
					>
						{!extractColumnsLoading && (
							<>
								{generatePossibleAlphabets().map((alph, j) => {
									return displayedColumns
										.filter(field =>
											field?.toLowerCase().includes(searchValue?.toLowerCase())
										)
										.filter(field => field?.charAt(0).toUpperCase() === alph).length >
										0 ? (
										<>
											<h2 className={styles.subSectionHeader}>{alph}</h2>
											<div className={styles.group}>
												{displayedColumns
													//search functionality
													.filter(field =>
														field?.toLowerCase()?.includes(searchValue?.toLowerCase())
													)
													.filter(field => field?.charAt(0).toUpperCase() === alph)
													?.map((item, i) => {
														return (
															<Draggable
																draggableId={JSON.stringify({
																	name: item,
																	// columnIndex: extractedColumns.indexOf(item),
																})}
																key={item}
																index={extractedColumns.indexOf(item)}
															>
																{provided => (
																	<div
																		ref={provided.innerRef}
																		{...provided.draggableProps}
																		{...provided.dragHandleProps}
																	>
																		<span></span>
																		<h1>{item}</h1>
																	</div>
																)}
															</Draggable>
														);
													})}
											</div>
										</>
									) : (
										""
									);
								})}
							</>
						)}
					</div>
				)}
			</Droppable>
		</div>
	);
}

export default ExtractedColumns;
