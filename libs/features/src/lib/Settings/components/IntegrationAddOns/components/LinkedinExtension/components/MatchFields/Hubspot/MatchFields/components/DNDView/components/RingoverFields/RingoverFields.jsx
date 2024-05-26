import { Title, Tooltip } from "@cadence-frontend/components";
import { SearchBar, ThemedButton } from "@cadence-frontend/widgets";
import { useState, useRef } from "react";
import HoverContainer from "../../../HoverContainer/HoverContainer";
import styles from "./RingoverFields.module.scss";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { EditGradientCircle } from "@cadence-frontend/icons";
import { Colors } from "@cadence-frontend/utils";
import { useOutsideClickHandler } from "@cadence-frontend/utils";
import { RFFieldPlaceholder, SingleSkeleton } from "../Placeholders/Placeholders";
import IntegrationStatusModal from "../IntegrationStatusModal/IntegrationStatusModal";
import { CUSTOM_FIELDS_HEADING, VIEWS } from "../../../../constants";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
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
	originalSFFieldsForCurrentView,
	currentView,
	copyFieldsFromFieldMap,
}) => {
	const language = useRecoilValue(userInfo).language;
	const integration_type = useRecoilValue(userInfo).integration_type;
	const [searchValue, setSearchValue] = useState("");
	const [integrationStatusModal, setIntegrationStatusModal] = useState(false);

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
						<div className={styles.col2}>Salesforce Fields</div>
					</div>
					{fields
						.filter(item => item.label.toLowerCase().includes(searchValue.toLowerCase()))
						.map((field, i) => (
							<>
								{i === CUSTOM_FIELDS_HEADING[currentView] && (
									<div className={styles.row + " " + styles.title}>
										<div className={styles.col1}>
											Cadence {currentView === VIEWS.LEAD ? "Lead" : "Account"} Status
										</div>
										<div className={styles.col2}>Salesforce Field</div>
									</div>
								)}
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
											{!loading &&
												field.uid === "__integration_status" &&
												field.value.name && (
													<EditGradientCircle
														onClick={() => {
															setIntegrationStatusModal(true);
														}}
													/>
												)}
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
															isDraggable={!loading}
															draggableId={JSON.stringify(field.value)}
														>
															{provided => (
																<div
																	onClick={() => setSelectedField(field)}
																	className={`${styles.field}  ${
																		selectedField?.label === field.label
																			? styles.selected
																			: ""
																	}`}
																	{...provided.dragHandleProps}
																	{...provided.draggableProps}
																	ref={provided.innerRef}
																>
																	{originalSFFieldsForCurrentView.filter(
																		sf => sf.name === field.value.name
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
			{/* {(currentView === VIEWS.LEAD || currentView === VIEWS.ACCOUNT) && (
				<IntegrationStatusModal
					modal={integrationStatusModal}
					setModal={setIntegrationStatusModal}
					integrationStatus={fields?.filter(f => f.uid === "__integration_status")?.[0]}
					setIntegrationStatus={val => {
						setFields(fields?.map(f => (f.uid === "__integration_status" ? val : f)));
					}}
				/>
			)} */}
		</div>
	);
};

export default RingoverFields;
