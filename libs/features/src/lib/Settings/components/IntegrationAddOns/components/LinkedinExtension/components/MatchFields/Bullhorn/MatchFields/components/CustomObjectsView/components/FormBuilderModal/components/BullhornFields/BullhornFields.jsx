import styles from "./BullhornFields.module.scss";

import React, { useState } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { SearchBar, TabNavSlider, ThemedButton } from "@cadence-frontend/widgets";
import { Title } from "@cadence-frontend/components";
import { ThemedButtonThemes, TabNavThemes } from "@cadence-frontend/themes";
import { ALPHABETS, ACCOUNTS_CONTACTS } from "./constants";
import { VIEWS } from "../../../../constants";
import { SFFieldsPlaceholder } from "../Placeholders/Placeholders";

const BullhornFields = ({ availableSFFields, buildFormFor, loading }) => {
	const [searchValue, setSearchValue] = useState("");
	const [viewSFFieldsFor, setViewSFFieldsFor] = useState(
		buildFormFor === VIEWS.LEAD
			? VIEWS.LEAD
			: buildFormFor === "contact"
			? VIEWS.CONTACT
			: VIEWS.CANDIDATE
	);

	return (
		<div className={styles.main}>
			<div className={styles.header}>
				<Title className={styles.title} size="1.2rem">
					Bullhorn
					<ThemedButton
						theme={ThemedButtonThemes.PRIMARY}
						className={styles.sfCount}
						height="18px"
						width="10px"
					>
						{availableSFFields[viewSFFieldsFor]?.length}
					</ThemedButton>
				</Title>

				{buildFormFor === "contact" && (
					<div className={styles.tabNavBox}>
						<TabNavSlider
							theme={TabNavThemes.GREY}
							buttons={ACCOUNTS_CONTACTS}
							className={styles.tabNav}
							value={viewSFFieldsFor}
							setValue={setViewSFFieldsFor}
							btnClassName={styles.tabBtn}
							activePillClassName={styles.activePill}
							activeBtnClassName={styles.activeBtn}
						/>
					</div>
				)}

				<SearchBar
					value={searchValue}
					setValue={setSearchValue}
					width="100%"
					height="40px"
				/>
			</div>
			<div className={styles.body}>
				{loading ? (
					<SFFieldsPlaceholder />
				) : (
					<Droppable droppableId={"zf"}>
						{provided => (
							<div
								className={styles.sf}
								{...provided.droppableProps}
								ref={provided.innerRef}
							>
								{ALPHABETS.map((alph, j) => {
									return availableSFFields[viewSFFieldsFor]
										?.filter(field =>
											searchValue.length
												? field.label[0]
														?.toLowerCase()
														.includes(searchValue[0]?.toLowerCase())
												: true
										)
										?.filter(field => field.label[0] === alph).length > 0 ? (
										<div className={styles.subSection}>
											<div className={styles.subSectionHeader}>{alph}</div>
											<div className={styles.subSectionFields}>
												{availableSFFields[viewSFFieldsFor]
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

export default BullhornFields;
