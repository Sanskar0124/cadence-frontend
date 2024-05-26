import styles from "./FormEditor.module.scss";

import React, { useEffect, useState, useContext } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { Select, Label, Input, InputRadio } from "@cadence-frontend/widgets";
import {
	Click,
	Clickarrow,
	Arrow,
	Plus,
	PlusOutline,
	MinusOutline,
	ThreeDots,
	Search,
} from "@cadence-frontend/icons";
import { MessageContext } from "@cadence-frontend/contexts";
import { Colors } from "@cadence-frontend/utils";
import { ThemedButton } from "@cadence-frontend/widgets";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { VIEWS } from "../../../../constants";
import { FormEditorPlaceholder } from "../Placeholders/Placeholders";
import Preview from "../Preview/Preview";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue } from "recoil";

const FormEditor = ({
	buttonText,
	form,
	setForm,
	buildFormFor,
	loading,
	preview,
	canDrag,
	setCanDrag,
	availableSFFields,
}) => {
	const [rowIndexMax, setRowIndexMax] = useState(0);
	const { addError } = useContext(MessageContext);
	const user = useRecoilValue(userInfo);

	useEffect(() => {
		if (form?.length === 0) {
			setForm(prev => [...prev, ...addSection(0)]);
			setRowIndexMax(0);
		} else {
			let maxRow = 0;
			form.forEach(
				formElement =>
					formElement.position.row > maxRow && (maxRow = formElement.position.row)
			);
			setRowIndexMax(maxRow);
		}
	}, [form]);

	useEffect(() => {
		let arr = [];
		if (form.length !== 0) {
			let maxRow = 0;
			form.forEach(
				formElement =>
					formElement.position.row > maxRow && (maxRow = formElement.position.row)
			);
			setRowIndexMax(maxRow);

			for (let i = 0; i <= maxRow; i++) {
				for (let j = 0; j <= 2; j++) {
					if (
						form.filter(
							formElement =>
								formElement.position.row === i && formElement.position.column === j
						).length === 0
					) {
						arr.push(addObject(i, j));
					}
				}
			}
		}
		setForm(prev => [...prev, ...arr]);
	}, []);

	//This function helps to render INPUT_BOX depending on type
	const renderInput = item => {
		const type = item.input_type;
		switch (type) {
			case "textarea":
				return (
					<>
						<Label>{item.integration_label}</Label>
						<Input placeholder="Type here" disabled type="textarea" height="70px" />
					</>
				);
			case "date":
				return (
					<>
						<Label>{item.integration_label}</Label>
						<Input
							placeholder="Type here"
							disabled
							type="date"
							value={{ DD: "dd", MM: "mm", YYYY: "yyyy" }}
							className={styles.date}
						/>
					</>
				);
			case "datetime":
				return (
					<>
						<Label>{item.integration_label}</Label>
						<Input
							disabled
							type="datetime"
							value={{ DD: "dd", MM: "mm", YYYY: "yyyy", hh: "00", mm: "00" }}
							className={styles.date}
						/>
					</>
				);

			default:
				return (
					<>
						<Label>{item.integration_label}</Label>
						<Input placeholder="Type here" disabled />
					</>
				);
		}
	};

	//This function helps to add object i.e. box in our form
	const addObject = (row, col) => {
		const obj = {
			type: "",
			position: {
				row: row,
				column: col,
			},
		};
		return obj;
	};
	const addSection = row => {
		let section = [];
		for (let i = 0; i <= 2; i++) {
			section.push({
				type: "",
				position: {
					row: row,
					column: i,
				},
			});
		}

		return section;
	};

	//This function helps to add three box i.e. full row at a time.
	const addSectionHandler = () => {
		if (
			form
				.filter(formElement => formElement.position.row === rowIndexMax)
				.find(formElement => formElement.type !== "")
		) {
			setForm(prev => [...prev, ...addSection(rowIndexMax + 1)]);
		} else {
			return addError({ text: "Previous row is empty" });
		}
	};
	const isDraggable = (row, col) => {
		if (canDrag !== null) {
			const position = canDrag.split("-");
			const r = parseInt(position[0]);
			const c = parseInt(position[1]);
			if (r === row && c === col) return true;
			else return false;
		} else {
			return false;
		}
	};
	// const removeEmptyRow = newArr => {
	// 	let maxRow = 0;
	// 	form.forEach(
	// 		formElement =>
	// 			formElement.position.row > maxRow && (maxRow = formElement.position.row)
	// 	);
	// 	let emptyRow;
	// 	[...Array(maxRow + 1).keys()].forEach(row => {
	// 		newArr.filter(item => item.position.row === row && item.type === "").length === 3 &&
	// 			(emptyRow = row);
	// 	});
	// 	newArr = newArr
	// 		.filter(item => item.position.row !== emptyRow)
	// 		.map(item =>
	// 			item.position.row > emptyRow
	// 				? {
	// 						...item,
	// 						position: { row: item.position.row - 1, column: item.position.column },
	// 				  }
	// 				: item
	// 		);
	// 	return newArr;
	// };
	console.log(availableSFFields, "AVS");
	return (
		<div className={styles.main}>
			<div className={styles.header}>
				<div className={styles.heading}>{buttonText}</div>
				<div className={styles.instruction}>
					{/* <ThemedButton
						className={styles.dblClick}
						theme={ThemedButtonThemes.GREY}
						width="fit-content"
						height="26px">
						<Clickarrow color={Colors.lightBlue} />
						<Arrow color={Colors.veryLightBlue} /> <div>Double click - Edit</div>
					</ThemedButton>
					<ThemedButton
						className={styles.singleClick}
						theme={ThemedButtonThemes.GREY}
						width="fit-content"
						height="26px">
						<Clickarrow color={Colors.lightBlue} /> <div>Single click - Move</div>
					</ThemedButton> */}
					You can add maximum 3 slots. Space is auto adjusted.
				</div>
			</div>

			<div
				className={`${styles.body} ${
					buildFormFor === VIEWS.LEAD ? styles.lead : styles.contact
				}`}
			>
				{loading ? (
					<FormEditorPlaceholder row={4} />
				) : (
					[...Array(rowIndexMax + 1).keys()].map(row => {
						let blankCol = form
							.filter(element => element.position.row === row)
							.sort((a, b) => a.position.column - b.position.column)
							.find(item => item.type === "")?.position?.column;
						return (
							form.filter(element => element.position.row === row).length !== 0 && (
								<div className={styles.formRow} key={`${row}`}>
									{form
										.filter(element => element.position.row === row)
										.sort((a, b) => a.position.column - b.position.column)
										.map(item => {
											return (
												<Droppable droppableId={`${row}-${item.position.column}`}>
													{provided => (
														<div
															key={`${row}-${item.position.column}`}
															onClick={() =>
																setCanDrag(prev =>
																	prev === `${row}-${item.position.column}`
																		? null
																		: `${row}-${item.position.column}`
																)
															}
															className={`${styles.formColumn} ${
																item.type === "" &&
																(item.position.column === blankCol
																	? styles.showBorder
																	: styles.showDisableBorder)
															}`}
															{...provided.droppableProps}
															ref={provided.innerRef}
														>
															{item.type === "" && item.position.column > blankCol ? (
																<div>
																	<PlusOutline
																		size="1.143rem"
																		color={Colors.blackShade7}
																	/>
																</div>
															) : (
																<Draggable
																	key={item.integration_field}
																	draggableId={JSON.stringify(item)}
																	index={0}
																	disableInteractiveElementBlocking
																>
																	{(provided, snapshot) => (
																		<div
																			className={styles.dragItem}
																			key={`${row}-${item.position.column}-drag`}
																			{...provided.dragHandleProps}
																			// {...(isDraggable(row, item.position.column) && {
																			// 	...provided.draggableProps,
																			// })}
																			{...provided.draggableProps}
																			ref={provided.innerRef}
																		>
																			{!isDraggable(row, item.position.column) &&
																				!snapshot.isDragging &&
																				item.type === "dropdown" &&
																				!item.reference_to && (
																					<>
																						<Label>{item.integration_label}</Label>
																						<Select
																							placeholder={"Select here"}
																							disabled
																						></Select>
																					</>
																				)}
																			{!isDraggable(row, item.position.column) &&
																				!snapshot.isDragging &&
																				item.type === "dropdown" &&
																				item.reference_to && (
																					<>
																						<Label>{item.integration_label}</Label>
																						<Select
																							placeholder={"Search here"}
																							disabled
																							isSearchable
																							icon={<Search color={Colors.lightBlue} />}
																						></Select>
																					</>
																				)}
																			{!isDraggable(row, item.position.column) &&
																				!snapshot.isDragging &&
																				item.type === "multi_select_dropdown" && (
																					<>
																						<Label>{item.integration_label}</Label>
																						<Select
																							placeholder={"Select here"}
																							disabled
																							isMulti
																						></Select>
																					</>
																				)}
																			{!isDraggable(row, item.position.column) &&
																				!snapshot.isDragging &&
																				item.type === "radio_button" && (
																					<div className={styles.radioBox}>
																						<div className={styles.label}>
																							{item.integration_label}?
																						</div>
																						<div className={styles.btnBox}>
																							<div className={styles.btn}>
																								<InputRadio
																									className={styles.radio}
																									size="24"
																									disabled
																								/>
																								<div className={styles.btnLabel}>
																									{
																										COMMON_TRANSLATION.YES[
																											user?.language?.toUpperCase()
																										]
																									}
																								</div>
																							</div>
																							<div className={styles.btn}>
																								<InputRadio
																									className={styles.radio}
																									size="24"
																									disabled
																								/>
																								<div className={styles.btnLabel}>No</div>
																							</div>
																						</div>
																					</div>
																				)}
																			{!isDraggable(row, item.position.column) &&
																				!snapshot.isDragging &&
																				item.type === "input_box" &&
																				renderInput(item)}
																			{((isDraggable(row, item.position.column) &&
																				item.type !== "") ||
																				snapshot.isDragging) && (
																				<div className={styles.edit}>
																					<div className={styles.left}>
																						<div className={styles.dots}>
																							<ThreeDots color={Colors.veryLightBlue} />
																							<ThreeDots color={Colors.veryLightBlue} />
																						</div>
																						<div className={styles.editLabel}>
																							{item.integration_label}
																						</div>
																					</div>
																					{/* <div className={styles.right}>
																				<MinusOutline color={Colors.veryLightBlue} />
																			</div> */}
																				</div>
																			)}
																		</div>
																	)}
																</Draggable>
															)}
														</div>
													)}
												</Droppable>
											);
										})}
								</div>
							)
						);
					})
				)}
				{((buildFormFor === "lead" && availableSFFields[VIEWS.LEAD].length !== 0) ||
					(buildFormFor === "contact" &&
						availableSFFields[VIEWS.ACCOUNT].length +
							availableSFFields[VIEWS.CONTACT].length !==
							0)) && (
					<div className={styles.button}>
						<ThemedButton
							theme={ThemedButtonThemes.GREY}
							width="150px"
							height="40px"
							onClick={() => {
								addSectionHandler();
							}}
						>
							<PlusOutline color={Colors.lightBlue} />
							Add section
						</ThemedButton>
					</div>
				)}
			</div>
		</div>
	);
};

export default FormEditor;
