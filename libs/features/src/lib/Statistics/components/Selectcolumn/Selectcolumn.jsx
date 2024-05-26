import { Modal, Skeleton, Title } from "@cadence-frontend/components";
import { VerticalDots } from "@cadence-frontend/icons";
import { Checkbox } from "@cadence-frontend/widgets";
import { Colors, useOutsideClickHandler } from "@cadence-frontend/utils";
import React, { useEffect, useState, useRef } from "react";
import styles from "./Selectcolumn.module.scss";
import { MODAL_COLUMNS } from "../../constants";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { updateColumns } from "libs/data-access/src/lib/useStatistics";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";
import {
	Statistics as STATISTICS_TRANSLATION,
	Common as COMMON_TRANSLATION,
} from "@cadence-frontend/languages";

const Selectcolumn = ({
	modal,
	setModal,
	setColumns,
	columns,
	filteredHeaders,
	columnloading,
}) => {
	const [color, setColor] = useState("#567191");
	const [error, setError] = useState("");
	const messageRef = useRef(null);
	const user = useRecoilValue(userInfo);
	// const sortedData = columns?.sort((a, b) => b.isVisible - a.isVisible);
	const sortedData = columns
		?.sort((a, b) => a.order - b.order)
		.sort((a, b) => b.isVisible - a.isVisible);
	const { getUpdatedColumns, loading, success } = updateColumns();

	const closeModal = () => {
		if (filteredHeaders.length >= 4) {
			setModal(false);
			updateUserColumns(columns);
		}
	};

	const addHandler = item => {
		if (filteredHeaders.length === 6) {
			return 0;
		} else {
			// setColumns(prev =>
			// 	prev.map(value =>
			// 		value.label === item.label ? { ...value, isVisible: true } : value
			// 	)
			// );
			setColumns(prev =>
				prev.map(value =>
					value.label === item.label ? { ...value, isVisible: true, order: 1 } : value
				)
			);
			// console.log(columns, "addhandler line48");
		}
	};
	const deleteHandler = item => {
		setColumns(prev =>
			prev.map(value =>
				value.label === item.label ? { ...value, isVisible: false, order: 0 } : value
			)
		);
	};

	useEffect(() => {
		if (filteredHeaders.length >= 6) {
			messageRef.current?.scrollIntoView({ top: 5, behavior: "smooth" });
		} else {
			setColor("#567191");
		}
	}, []);

	const handleDragEnd = e => {
		const source = e.source;
		const destination = e.destination;
		const sourceDroppableId = source?.droppableId;
		const destinationDroppableId = destination?.droppableId;
		if (!destination) {
			return;
		}
		if (
			destinationDroppableId === sourceDroppableId &&
			destination.index === source.index
		) {
			return;
		}
		let add;
		let active = columns;
		if (source.droppableId === "columnList") {
			add = active[source.index];
			active.splice(source.index, 1);
		}
		// Destination Logic
		if (destination.droppableId === "columnList") {
			active.splice(destination.index, 0, add);
		}
		setColumns(active);
		// console.log(columns, "drag and drop");
	};

	const updateUserColumns = columns => {
		const orderedColumn = columns
			?.filter(item => item.order > 0)
			?.map((item, index) => item.order > 0 && { ...item, order: index + 1 });

		const unorderedColumns = columns?.filter(item => item.order === 0);
		let newColumns = [...orderedColumn, ...unorderedColumns];
		setColumns(newColumns);

		newColumns = newColumns.reduce(
			(prevValue, curr) => Object.assign(prevValue, { [curr.label]: curr.order }),
			{}
		);

		const body = newColumns;

		getUpdatedColumns(body, {
			onSuccess: data => console.log(data),
			onError: err => {
				setError(err?.message ?? "unable to redirect");
			},
		});
	};

	return (
		<DragDropContext onDragEnd={handleDragEnd}>
			<Modal
				isModal={Boolean(modal)}
				onClose={closeModal}
				showCloseButton
				className={styles.columncard}
				outsideClickDeps={[columns]}
			>
				<div className={styles.columncard_header}>
					<Title size="1.25rem" className={styles.columncard_title}>
						{STATISTICS_TRANSLATION.COLUMNS[user?.language.toUpperCase()]}
					</Title>
					<p className={styles.message} ref={messageRef} style={{ color: color }}>
						{STATISTICS_TRANSLATION.SET_MAX_COLUMNS[user?.language.toUpperCase()]}
					</p>
				</div>
				<Droppable droppableId="columnList">
					{(provided, snapshot) => (
						<div
							className={`${styles.columncard_columncontainer} ${
								snapshot.isDraggingOver ? styles.dragactive : ""
							}`}
							ref={provided.innerRef}
							{...provided.droppableProps}
						>
							{columnloading ? (
								<div className={styles.columncard_skeleton_details}>
									{[...Array(19).keys()].map(key => (
										<Skeleton className={styles.detailsPlaceholder} />
									))}
								</div>
							) : (
								sortedData?.map((item, index) => {
									return (
										<Draggable draggableId={item.label} index={index} key={item.label}>
											{(provided, snapshot) => (
												<div
													className={styles.columncard_columns}
													key={item.label}
													{...provided.draggableProps}
													{...provided.dragHandleProps}
													ref={provided.innerRef}
												>
													<Checkbox
														checked={filteredHeaders.some(
															value => value.label === item.label
														)}
														onChange={() =>
															filteredHeaders.find(value => value.label === item.label)
																? deleteHandler(item)
																: addHandler(item)
														}
													/>
													<span className={styles.columncard_taskname}>
														{Object.keys(MODAL_COLUMNS).map(column =>
															column === item.label
																? MODAL_COLUMNS[column][user?.language.toUpperCase()]
																: null
														)}
													</span>
													<VerticalDots color={Colors.veryLightBlue} />
												</div>
											)}
										</Draggable>
									);
								})
							)}
							{provided.placeholder}
						</div>
					)}
				</Droppable>
			</Modal>
		</DragDropContext>
	);
};

export default Selectcolumn;
