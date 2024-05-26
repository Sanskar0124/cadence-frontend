import styles from "./PipedriveFields.module.scss";

import React, { useState } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { SearchBar, TabNavSlider, ThemedButton } from "@cadence-frontend/widgets";
import { Title } from "@cadence-frontend/components";
import { ThemedButtonThemes, TabNavThemes } from "@cadence-frontend/themes";
import { ALPHABETS, ORGANIZATION_PERSON } from "./constants";
import { VIEWS } from "../../../../constants";
import { PDFieldsPlaceholder } from "../Placeholders/Placeholders";

const PipedriveFields = ({ availablePDFields, loading }) => {
	const [searchValue, setSearchValue] = useState("");
	const [viewPDFieldsFor, setViewPDFieldsFor] = useState(VIEWS.ORGANIZATION);
	return (
		<div className={styles.main}>
			<div className={styles.header}>
				<Title className={styles.title} size="1.2rem">
					Pipedrive
					<ThemedButton
						theme={ThemedButtonThemes.PRIMARY}
						className={styles.pdCount}
						height="18px"
						width="10px"
					>
						{availablePDFields[viewPDFieldsFor]?.length}
					</ThemedButton>
				</Title>

				<div className={styles.tabNavBox}>
					<TabNavSlider
						theme={TabNavThemes.GREY}
						buttons={ORGANIZATION_PERSON}
						className={styles.tabNav}
						value={viewPDFieldsFor}
						setValue={setViewPDFieldsFor}
						btnClassName={styles.tabBtn}
						activePillClassName={styles.activePill}
						activeBtnClassName={styles.activeBtn}
					/>
				</div>

				<SearchBar
					value={searchValue}
					setValue={setSearchValue}
					width="100%"
					height="40px"
				/>
			</div>
			<div className={styles.body}>
				{loading ? (
					<PDFieldsPlaceholder />
				) : (
					<Droppable droppableId={"pd"}>
						{provided => (
							<div
								className={styles.pd}
								{...provided.droppableProps}
								ref={provided.innerRef}
							>
								{ALPHABETS.map((alph, j) => {
									return availablePDFields[viewPDFieldsFor]
										?.filter(field =>
											field.label.toLowerCase().includes(searchValue.toLowerCase())
										)
										?.filter(field => field.label[0] === alph).length > 0 ? (
										<div className={styles.subSection}>
											<div className={styles.subSectionHeader}>{alph}</div>
											<div className={styles.subSectionFields}>
												{availablePDFields[viewPDFieldsFor]
													?.filter(field =>
														field.label.toLowerCase().includes(searchValue.toLowerCase())
													)
													?.filter(field => field.label[0].toUpperCase() === alph)
													.map(item => {
														return (
															<Draggable
																key={item.name}
																draggableId={JSON.stringify(item)}
																index={item.index}
															>
																{provided => (
																	<div
																		className={styles.field}
																		{...provided.dragHandleProps}
																		// {...(item.label !== "City" && {
																		// 	...provided.draggableProps,
																		// })}
																		{...provided.draggableProps}
																		ref={provided.innerRef}
																		title={item.label}
																	>
																		<div className={styles.whiteBox}></div>
																		<div className={styles.fieldLabel}>{item.label}</div>
																	</div>
																)}
															</Draggable>
														);
													})}
											</div>
										</div>
									) : null;
								})}
							</div>
						)}
					</Droppable>
				)}
			</div>
		</div>
	);
};

export default PipedriveFields;
