import { Title, Tooltip } from "@cadence-frontend/components";
import { ThemedButtonThemes, TooltipThemes } from "@cadence-frontend/themes";
import { SearchBar, ThemedButton } from "@cadence-frontend/widgets";
import { useState, useRef } from "react";
import HoverContainer from "../../../HoverContainer/HoverContainer";
import styles from "./RingoverFields.module.scss";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { EditGradientCircle } from "@cadence-frontend/icons";
import { Colors } from "@cadence-frontend/utils";
import { useOutsideClickHandler } from "@cadence-frontend/utils";
import { RFFieldPlaceholder, SingleSkeleton } from "../Placeholders/Placeholders";
import { CUSTOM_FIELDS_HEADING, VIEWS } from "../../../../constants";
import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue } from "recoil";
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
	copyFieldsFromFieldMap,
}) => {
	const [searchValue, setSearchValue] = useState("");
	const language = useRecoilValue(userInfo).language;
	const integration_type = useRecoilValue(userInfo).integration_type;
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
				search bar
				<div className={styles.setFieldsBtn}>
					<Tooltip
						text={`Copy and set fields from ${integration_type.split(
							"_",
							" "
						)} field mapping`}
					>
						<ThemedButton
							theme={ThemedButtonThemes.TRANSPARENT}
							width="fit-content"
							onClick={copyFieldsFromFieldMap}
						>
							{SETTINGS_TRANSLATION.AUTO_MAP_FIELDS[language?.toUpperCase()]}
						</ThemedButton>
					</Tooltip>
				</div>
			</div>
			<div className={styles.body}>
				<div className={styles.rf} ref={outsideclickRef}>
					<div className={styles.row + " " + styles.title}>
						<div className={styles.col1}>Ringover Cadence Fields</div>
						<div className={styles.col2}>Hubspot Fields</div>
					</div>
					{fields
						.filter(item => item.label.toLowerCase().includes(searchValue.toLowerCase()))
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
								<div className={styles.row}>
									<div className={styles.col1}>
										<HoverContainer
											setCurrentlyHovered={setCurrentlyHovered}
											currentlyHovered={currentlyHovered}
											hoverValue={{ hovers: field.hovers, value: field.uid }}
											hoverStyles={styles.hover}
											scrollIntoView={true}
											className={styles.ringoverBracket}
										>
											{/* <PurpleBracket className={styles.purpleBracket} />
										<WhiteBracket className={styles.whiteBracket} /> */}
											<span>{field.label}</span>
										</HoverContainer>
									</div>
									<Droppable
										droppableId={JSON.stringify({
											type: field.type,
											label: field.label,
										})}
										direction="horizontal"
									>
										{provided => (
											<div
												className={`${styles.col2}`}
												{...provided.droppableProps}
												ref={provided.innerRef}
											>
												{loading ? (
													<RFFieldPlaceholder />
												) : (
													field.value.name !== "" && (
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
																	{originalItFieldsForCurrentView.filter(
																		it => it.name === field.value.name
																	)[0]?.label ?? ""}
																</div>
															)}
														</Draggable>
													)
												)}
												{/* {provided.placeholder} */}
											</div>
										)}
									</Droppable>
								</div>
							</>
						))}
				</div>
			</div>
		</div>
	);
};

export default RingoverFields;
