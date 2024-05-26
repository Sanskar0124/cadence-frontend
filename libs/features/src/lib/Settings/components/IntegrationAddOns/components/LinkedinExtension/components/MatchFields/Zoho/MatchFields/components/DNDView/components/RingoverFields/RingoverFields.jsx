import React, { useContext, useState, useEffect, useRef } from "react";
import { useRecoilValue } from "recoil";
import styles from "./RingoverFields.module.scss";
import { Title, Tooltip } from "@cadence-frontend/components";
import { SearchBar, ThemedButton } from "@cadence-frontend/widgets";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { EditGradientCircle, Info2 } from "@cadence-frontend/icons";
import { Colors } from "@cadence-frontend/utils";
import { useOutsideClickHandler } from "@cadence-frontend/utils";
import { TooltipThemes, ThemedButtonThemes } from "@cadence-frontend/themes";
import {
	Settings as SETTINGS_TRANSLATION,
	Common as COMMON_TRANSLATION,
} from "@cadence-frontend/languages";
import { userInfo } from "@cadence-frontend/atoms";
import IntegrationStatusModal from "../IntegrationStatusModal/IntegrationStatusModal";
import {
	VIEWS,
	CUSTOM_FIELDS_HEADING,
	CUSTOM_VARIABLES_HEADING,
} from "../../../../constants";
import HoverContainer from "../../../HoverContainer/HoverContainer";
import { RFFieldPlaceholder } from "../Placeholders/Placeholders";

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
	const [searchValue, setSearchValue] = useState("");
	const [integrationStatusModal, setIntegrationStatusModal] = useState(false);
	const user = useRecoilValue(userInfo);
	const outsideclickRef = useRef(null);
	const integration_type = useRecoilValue(userInfo).integration_type;

	const onClose = e => {
		setSelectedField(null);
	};
	useOutsideClickHandler(outsideclickRef, onClose);

	//const checkDisabled = field => field.uid === "__lead_company_name";
	const checkDisabled = () => false;

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
							{SETTINGS_TRANSLATION.AUTO_MAP_FIELDS[user?.language?.toUpperCase()]}
						</ThemedButton>
					</Tooltip>
				</div>
			</div>

			<div className={styles.body}>
				<div className={styles.rf} ref={outsideclickRef}>
					<div className={styles.row + " " + styles.title}>
						<div className={styles.col1}>
							{
								SETTINGS_TRANSLATION.RINGOVER_CADENCE_FIELDS[
									user?.language?.toUpperCase()
								]
							}
						</div>
						<div className={styles.col2}>
							{SETTINGS_TRANSLATION.ZOHO_FIELDS[user?.language?.toUpperCase()]}
						</div>
					</div>

					{fields
						.filter(
							item =>
								item.label?.toLowerCase()?.includes(searchValue.toLowerCase()) &&
								item.uid !== "__disqualification_reasons"
						)
						.map((field, i) => (
							<>
								{i === CUSTOM_FIELDS_HEADING[currentView] && (
									<div className={styles.row + " " + styles.title}>
										<div className={styles.col1}>
											{COMMON_TRANSLATION.CADENCE[user?.language?.toUpperCase()]}{" "}
											{currentView === VIEWS.LEAD
												? COMMON_TRANSLATION.LEAD[user?.language?.toUpperCase()]
												: "Account"}{" "}
											{COMMON_TRANSLATION.STATUS[user?.language?.toUpperCase()]}
										</div>
										<div className={styles.col2}>
											{SETTINGS_TRANSLATION.ZOHO_FIELDS[user?.language?.toUpperCase()]}
										</div>
									</div>
								)}
								{i === CUSTOM_VARIABLES_HEADING[currentView] && (
									<div className={styles.row + " " + styles.title}>
										<div className={styles.col1}>
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
										<div className={styles.col2}>
											{SETTINGS_TRANSLATION.ZOHO_FIELDS[user?.language?.toUpperCase()]}
										</div>
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
										isDropDisabled={checkDisabled(field)}
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
															draggableId={JSON.stringify({
																type: field.type,
																label: field.label,
																name: field.value.name,
															})}
															isDragDisabled={loading || checkDisabled(field)}
														>
															{provided => (
																<div
																	onClick={() =>
																		!checkDisabled(field) && setSelectedField(field)
																	}
																	className={`${styles.field}  ${
																		selectedField?.label === field.label
																			? styles.selected
																			: ""
																	} ${checkDisabled(field) ? styles.disabled : ""}`}
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

			{(currentView === VIEWS.LEAD || currentView === VIEWS.ACCOUNT) && (
				<IntegrationStatusModal />
			)}
		</div>
	);
};

export default RingoverFields;
