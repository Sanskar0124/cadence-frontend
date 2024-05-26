import { Title, Tooltip } from "@cadence-frontend/components";
import { SearchBar } from "@cadence-frontend/widgets";
import { useState, useRef } from "react";
import HoverContainer from "../../../HoverContainer/HoverContainer";
import styles from "./RingoverFields.module.scss";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { EditGradientCircle, Info2 } from "@cadence-frontend/icons";
import { Colors } from "@cadence-frontend/utils";
import { useOutsideClickHandler } from "@cadence-frontend/utils";
import { RFFieldPlaceholder, SingleSkeleton } from "../Placeholders/Placeholders";
import {
	CUSTOM_FIELDS_HEADING,
	CUSTOM_VARIABLES_HEADING,
	VIEWS,
} from "../../../../constants";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";
import { TooltipThemes } from "@cadence-frontend/themes";
import { Settings as SETTINGS_TRANSLATION } from "@cadence-frontend/languages";
//components

//constants

const RingoverFields = ({
	fields,
	setFields,
	currentlyHovered,
	loading,
	setCurrentlyHovered,
	setSelectedField,
	selectedField,
	originalItFieldsForCurrentView,
	currentView,
}) => {
	const [searchValue, setSearchValue] = useState("");
	const user = useRecoilValue(userInfo);

	const outsideclickRef = useRef(null);
	const onClose = e => {
		setSelectedField(null);
	};
	useOutsideClickHandler(outsideclickRef, onClose);

	// const onSearch = () => {
	// };

	return (
		<div className={styles.ringoverFields}>
			<div className={styles.header}>
				<Title className={styles.title} size="1.2rem">
					Ringover Cadence
				</Title>
				<SearchBar
					value={searchValue}
					setValue={setSearchValue}
					width="100%"
					height={"40px"}
				/>
			</div>
			<div className={styles.body}>
				<div className={styles.rf} ref={outsideclickRef}>
					<div className={styles.row + " " + styles.title}>
						<div className={styles.col1}>Sellsy Fields</div>
						<div className={styles.col2}>Ringover Cadence Fields</div>
					</div>
					{fields
						?.filter(item => item.label.toLowerCase().includes(searchValue.toLowerCase()))
						.map((field, i) => (
							<>
								{/* {i === CUSTOM_FIELDS_HEADING[currentView] && (
									<div className={styles.row + " " + styles.title}>
										<div className={styles.col1}>
											Cadence {currentView === VIEWS.LEAD ? "Lead" : "Account"} Status
										</div>
										<div className={styles.col2}>Salesforce Field</div>
									</div>
								)} */}
								{i === CUSTOM_VARIABLES_HEADING[currentView] && (
									<div className={styles.row + " " + styles.title}>
										<div className={styles.col1}>
											{SETTINGS_TRANSLATION.SELLSY_FIELD[user?.language?.toUpperCase()]}
										</div>
										<div className={styles.col2}>
											<span>
												{
													SETTINGS_TRANSLATION.CUSTOM_VARIABLE_FIELD[
														user?.language?.toUpperCase()
													]
												}
											</span>
											<Tooltip
												text="You can use variables for customising your emails/SMS/LinkedIn (available in text editor only)"
												theme={TooltipThemes.TOP}
												className={styles.customVarTooltip}
												span
											>
												<Info2 size={13} color={Colors.lightBlue} />
											</Tooltip>
										</div>
									</div>
								)}
								<div className={styles.row}>
									<Droppable
										droppableId={JSON.stringify({
											type: field.type,
											label: field.label,
										})}
										direction="horizontal"
									>
										{provided => (
											<div
												className={`${styles.col1}`}
												{...provided.droppableProps}
												ref={provided.innerRef}
											>
												{loading ? (
													<RFFieldPlaceholder />
												) : field.value.name !== "" ? (
													<Draggable
														index={0}
														isDragDisabled={loading}
														draggableId={JSON.stringify(field.value)}
													>
														{provided => (
															<div
																onClick={() => setSelectedField(field)}
																className={`${styles.field}  ${
																	selectedField?.label === field.label
																		? styles.selected
																		: ""
																} `}
																{...provided.dragHandleProps}
																{...provided.draggableProps}
																ref={provided.innerRef}
															>
																{originalItFieldsForCurrentView?.filter(
																	it => it.name === field.value.name
																)[0]?.label ?? ""}
															</div>
														)}
													</Draggable>
												) : (
													<div className={styles.placeholder}>Place here</div>
												)}
												{/* {provided.placeholder} */}
											</div>
										)}
									</Droppable>
									<div className={styles.col2}>
										<HoverContainer
											setCurrentlyHovered={setCurrentlyHovered}
											currentlyHovered={currentlyHovered}
											hoverValue={{ hovers: field.hovers, value: field.uid }}
											hoverStyles={styles.hover}
											scrollIntoView={true}
											className={styles.ringoverBracket}
										>
											<span>
												{field.label}
												{field.required && <span>*</span>}
											</span>
										</HoverContainer>
									</div>
								</div>
							</>
						))}
				</div>
			</div>
		</div>
	);
};

export default RingoverFields;
