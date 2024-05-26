import { useContext, useEffect, useState, useRef } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { Close2, View } from "@cadence-frontend/icons";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { useCustomObject } from "@cadence-frontend/data-access";
import { Modal } from "@cadence-frontend/components";
import { ThemedButton } from "@cadence-frontend/widgets";
import FormEditor from "./components/FormEditor/FormEditor";
import ZohoFields from "./components/ZohoFields/ZohoFields";
import Preview from "./components/Preview/Preview";
import { MessageContext } from "@cadence-frontend/contexts";
import styles from "./FormBuilderModal.module.scss";
import { MAX_NUMBER_OF_COL } from "./constants";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue } from "recoil";

const FormBuilderModal = ({
	isOpen,
	onClose,
	buttonText,
	buildFormFor,
	originalSFFields,
	availableSFFields,
	setAvailableSFFields,
	fetchCustomObject,
	loading,
	preview,
	setPreview,
	form,
	setForm,
}) => {
	const { setCustomObjectForm, setCustomObjectFormLoading } = useCustomObject();
	const { addError, addSuccess } = useContext(MessageContext);
	const [canDrag, setCanDrag] = useState(null);
	const user = useRecoilValue(userInfo);
	const removeEmptyRow = newArr => {
		let maxRow = 0;
		form.forEach(
			formElement =>
				formElement.position.row > maxRow && (maxRow = formElement.position.row)
		);
		let emptyRow;
		[...Array(maxRow + 1).keys()].forEach(row => {
			newArr.filter(item => item.position.row === row && item.type === "").length === 3 &&
				(emptyRow = row);
		});
		newArr = newArr
			.filter(item => item.position.row !== emptyRow)
			.map(item =>
				item.position.row > emptyRow
					? {
							...item,
							position: { row: item.position.row - 1, column: item.position.column },
					  }
					: item
			);
		return newArr;
	};

	const handleDrag = result => {
		if (
			result.destination === null ||
			result.source.droppableId === result.destination.droppableId
		) {
			return;
		}
		if (result.source.droppableId === "zf") {
			const position = result.destination.droppableId.split("-");
			const row = parseInt(position[0]);
			const col = parseInt(position[1]);
			const data = JSON.parse(result.draggableId);
			// let mincol = col;
			// form
			// 	.filter(item => item.type === "" && item.position.row === row)
			// 	.forEach(item => {
			// 		if (item.position.column < mincol) {
			// 			mincol = item.position.column;
			// 		}
			// 	});

			let obj = {
				// position: { row: row, column: mincol },
				position: { row: row, column: col },
				zoho_field: data.name,

				zoho_endpoint: data.sobject,
				zoho_label: data.label,
				editable: data.editable,
			};
			if (data.type === "picklist") {
				obj.type = "dropdown";
				obj.possible_values = data.picklistValues;
			} else if (data.type === "boolean") {
				obj.type = "radio_button";
			} else if (data.type === "multipicklist") {
				obj.type = "multi_select_dropdown";
				obj.possible_values = data.picklistValues;
			} else if (data.type === "reference") {
				obj.type = "dropdown";
				obj.reference_to = data.reference_to[0];
			} else {
				obj.type = "input_box";
				obj.input_type = data.type;
			}
			const index = form.indexOf(
				// form.find(item => item.position.row === row && item.position.column === mincol)
				form.find(item => item.position.row === row && item.position.column === col)
			);
			if (form[index].type === "") {
				setForm(prev => [...prev.filter((_, i) => i !== index), obj]);
			}
		} else if (result.destination.droppableId === "zf") {
			const position = result.source.droppableId.split("-");
			const row = parseInt(position[0]);
			const col = parseInt(position[1]);

			let obj = {
				type: "",
				// position: { row: row, column: MAX_NUMBER_OF_COL - 1 },
				position: { row: row, column: col },
			};
			setForm(prev => {
				prev = [
					...prev.filter(
						item => !(item.position.row === row && item.position.column === col)
					),
					obj,
				];
				return removeEmptyRow(prev);
			});
		} else {
			let position = result.source.droppableId.split("-");
			const initialRow = parseInt(position[0]);
			const initialCol = parseInt(position[1]);
			position = result.destination.droppableId.split("-");
			const finalRow = parseInt(position[0]);
			const finalCol = parseInt(position[1]);

			const initialIndex = form.findIndex(
				item => item.position.row === initialRow && item.position.column === initialCol
			);
			const finalIndex = form.findIndex(
				item => item.position.row === finalRow && item.position.column === finalCol
			);

			setForm(prev => {
				prev[initialIndex].position.row = finalRow;
				prev[initialIndex].position.column = finalCol;
				prev[finalIndex].position.row = initialRow;
				prev[finalIndex].position.column = initialCol;
				return removeEmptyRow(prev);
			});
		}
	};
	const handleSave = () => {
		const body = {
			object_type: buildFormFor,
			custom_object: [
				{
					button_text: buttonText,
					form: form
						.filter(item => item.type !== "")
						.map(item => {
							if (item.reference_field_name) {
								delete item["reference_field_name"];
							}
							return item;
						}),
				},
			],
		};
		setCustomObjectForm(body, {
			onSuccess: () => {
				onClose();
				return addSuccess("Form saved Successfully");
			},
			onError: err => {
				return addError({
					text: err?.response.data.msg || "Error in saving the form",
					desc: err?.response?.data?.error || "Please contact support",
					cId: err?.response?.data?.correlationId,
				});
			},
		});
	};
	const handleKeyDown = event => {
		if ((event.key === "Backspace" || event.key === "Delete") && canDrag !== null) {
			const position = canDrag.split("-");
			const row = parseInt(position[0]);
			const col = parseInt(position[1]);
			setCanDrag(null);
			let obj = {
				type: "",
				// position: { row: row, column: MAX_NUMBER_OF_COL - 1 },
				position: { row: row, column: col },
			};
			// setForm(prev => {
			// 	prev = [
			// 		...prev
			// 			.filter(item => !(item.position.row === row && item.position.column === col))
			// 			.map(item => {
			// 				if (item.position.row === row && item.position.column > col) {
			// 					return {
			// 						...item,
			// 						position: { row: row, column: item.position.column - 1 },
			// 					};
			// 				} else {
			// 					return item;
			// 				}
			// 			}),
			// 		obj,
			// 	];

			// 	return removeEmptyRow(prev);
			// });
			setForm(prev => {
				prev = [
					...prev.filter(
						item => !(item.position.row === row && item.position.column === col)
					),
					obj,
				];
				return removeEmptyRow(prev);
			});
		}
	};
	useEffect(() => {
		window.addEventListener("keyup", handleKeyDown);
		return () => {
			window.removeEventListener("keyup", handleKeyDown);
		};
	}, [canDrag]);
	return (
		<Modal
			showCloseButton
			rightCloseIcon
			isModal={isOpen}
			onClose={() => {
				onClose();
				setPreview(false);
			}}
			className={styles.formBuilderModal}
		>
			<div className={styles.main}>
				<div className={styles.header}>
					<h2 className={styles.heading}>Form Builder</h2>
					<div className={styles.buttons}>
						<ThemedButton
							height="40px"
							width="fit-content"
							theme={ThemedButtonThemes.GREY}
							onClick={() => {
								setPreview(prev => !prev);
								onClose();
							}}
							disabled={!form?.some(e => e?.type)}
						>
							<View />
							Preview{" "}
						</ThemedButton>
						<ThemedButton
							height="40px"
							width="124px"
							theme={ThemedButtonThemes.PRIMARY}
							loading={setCustomObjectFormLoading}
							onClick={() => handleSave()}
						>
							{COMMON_TRANSLATION.SAVE[user?.language?.toUpperCase()]}
						</ThemedButton>
					</div>
				</div>
				<DragDropContext onDragEnd={result => handleDrag(result)}>
					<div className={styles.body}>
						<FormEditor
							buttonText={buttonText}
							form={form}
							setForm={setForm}
							availableSFFields={availableSFFields}
							buildFormFor={buildFormFor}
							loading={loading}
							canDrag={canDrag}
							setCanDrag={setCanDrag}
						/>
						<ZohoFields
							availableSFFields={availableSFFields}
							buildFormFor={buildFormFor}
							loading={loading}
						/>
					</div>
				</DragDropContext>
			</div>
		</Modal>
	);
};

export default FormBuilderModal;
