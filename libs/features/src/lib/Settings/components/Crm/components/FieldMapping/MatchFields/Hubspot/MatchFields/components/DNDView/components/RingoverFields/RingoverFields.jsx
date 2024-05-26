import { userInfo } from "@cadence-frontend/atoms";
import { Title, Tooltip } from "@cadence-frontend/components";
import { Colors, useOutsideClickHandler } from "@cadence-frontend/utils";
import { SearchBar } from "@cadence-frontend/widgets";
import { useRef, useState } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { useRecoilValue } from "recoil";
import {
	CUSTOM_FIELDS_HEADING,
	CUSTOM_VARIABLES_HEADING,
	VIEWS,
	MAPPING_FIELDS,
} from "../../../../constants";
import HoverContainer from "../../../HoverContainer/HoverContainer";
import { RFFieldPlaceholder } from "../Placeholders/Placeholders";
import {
	Settings as SETTINGS_TRANSLATION,
	Common as COMMON_TRANSLATION,
} from "@cadence-frontend/languages";
import styles from "./RingoverFields.module.scss";
import { EditGradientCircle, Info2 } from "@cadence-frontend/icons";
import IntegrationStatusModal from "../IntegrationStatusModal/IntegrationStatusModal";
import { TooltipThemes } from "@cadence-frontend/themes";
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
	const user = useRecoilValue(userInfo);
	const [integrationStatusModal, setIntegrationStatusModal] = useState(false);
	const [searchValue, setSearchValue] = useState("");

	const outsideclickRef = useRef(null);
	const onClose = e => {
		setSelectedField(null);
	};
	useOutsideClickHandler(outsideclickRef, onClose);

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
						<div className={styles.col1}>Hubspot Fields</div>
						<div className={styles.col2}>Ringover Cadence Fields</div>
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
											{SETTINGS_TRANSLATION.HUBSPOT_FIELD[user?.language?.toUpperCase()]}
										</div>
										<div className={styles.col2}>
											{COMMON_TRANSLATION.CADENCE[user?.language?.toUpperCase()]}{" "}
											{COMMON_TRANSLATION.CONTACT[user?.language?.toUpperCase()]}{" "}
											{COMMON_TRANSLATION.STATUS[user?.language?.toUpperCase()]}
										</div>
									</div>
								)}
								{i === CUSTOM_VARIABLES_HEADING[currentView] && (
									<div className={styles.row + " " + styles.title}>
										<div className={styles.col1}>
											{SETTINGS_TRANSLATION.HUBSPOT_FIELD[user?.language?.toUpperCase()]}
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
																{originalItFieldsForCurrentView.filter(
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
											{!loading &&
												field.uid === "__integration_status" &&
												field.value.name && (
													<EditGradientCircle
														onClick={() => {
															setIntegrationStatusModal(true);
														}}
													/>
												)}
											<span>
												{MAPPING_FIELDS[field.label]?.[user.language.toUpperCase()]}
												{field.required && <span>*</span>}
											</span>
										</HoverContainer>
									</div>
								</div>
							</>
						))}
				</div>
			</div>
			{currentView === VIEWS.CONTACT && (
				<IntegrationStatusModal
					modal={integrationStatusModal}
					setModal={setIntegrationStatusModal}
					integrationStatus={fields?.filter(f => f.uid === "__integration_status")?.[0]}
					setIntegrationStatus={val => {
						setFields(fields?.map(f => (f.uid === "__integration_status" ? val : f)));
					}}
					disqualificationReason={fields?.find(
						f => f.uid === "__disqualification_reasons"
					)}
					setDisqualifcationReason={val => {
						setFields(
							fields?.map(f => (f.uid === "__disqualification_reasons" ? val : f))
						);
					}}
				/>
			)}
		</div>
	);
};

export default RingoverFields;
