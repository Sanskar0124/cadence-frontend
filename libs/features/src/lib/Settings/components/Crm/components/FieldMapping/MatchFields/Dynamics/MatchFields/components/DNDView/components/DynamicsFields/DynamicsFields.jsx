import { Title } from "@cadence-frontend/components";
import { SearchBar, ThemedButton } from "@cadence-frontend/widgets";
import { useState, useEffect, useRef } from "react";
import styles from "./DynamicsFields.module.scss";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { ALPHABETS, ALPHA_OBJECT } from "./constants";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { SFFieldsPlaceholder } from "../Placeholders/Placeholders";
import { SixDotsGradient } from "@cadence-frontend/icons";

const DynamicsFields = ({ availableSFFields, loading }) => {
	const [searchValue, setSearchValue] = useState("");
	const generatePossibleAlphabets = () => {
		return [...new Set(availableSFFields.map(avf => avf.label[0].toUpperCase()))].sort();
	};

	return (
		<div className={styles.dynamicsFields}>
			<div className={styles.header}>
				<Title className={styles.title} size="1.2rem">
					Dynamics{" "}
					<ThemedButton
						theme={ThemedButtonThemes.PRIMARY}
						className={styles.sfCount}
						height="18px"
						width="10px"
					>
						{availableSFFields.length}
					</ThemedButton>
				</Title>
				<SearchBar
					value={searchValue}
					setValue={setSearchValue}
					width="95%"
					height="40px"
				/>
			</div>
			<div className={styles.body}>
				{loading ? (
					<SFFieldsPlaceholder />
				) : (
					<Droppable droppableId={JSON.stringify({ type: "sf" })}>
						{provided => (
							<div
								className={styles.sf}
								{...provided.droppableProps}
								ref={provided.innerRef}
							>
								{generatePossibleAlphabets().map((alph, j) => {
									return availableSFFields
										.filter(field =>
											field.label.toLowerCase().includes(searchValue.toLowerCase())
										)
										.filter(field => field.label[0] === alph).length > 0 ? (
										<div className={styles.subSection}>
											<div className={styles.subSectionHeader}>{alph}</div>
											<div className={styles.subSectionFields}>
												{availableSFFields
													//search functionality
													.filter(field =>
														field.label.toLowerCase().includes(searchValue.toLowerCase())
													)
													.filter(field => field.label[0].toUpperCase() === alph)
													.map((item, i) => {
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
																		{...provided.draggableProps}
																		ref={provided.innerRef}
																	>
																		<SixDotsGradient /> {item.label}
																	</div>
																)}
															</Draggable>
														);
													})}
												{/* {provided.placeholder} */}
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

export default DynamicsFields;
