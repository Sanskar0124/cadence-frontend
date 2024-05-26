import { Title } from "@cadence-frontend/components";
import { SearchBar, ThemedButton } from "@cadence-frontend/widgets";
import { useState, useEffect, useRef } from "react";
import styles from "./IntegrationFields.module.scss";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { ItFieldsPlaceholder } from "./Placeholders/Placeholders";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";
import { capitalize } from "@cadence-frontend/utils";

const IntegrationFields = ({ availableItFields, loading, integration_type }) => {
	const [searchValue, setSearchValue] = useState("");
	const generatePossibleAlphabets = () => {
		return [...new Set(availableItFields?.map(avf => avf.label[0].toUpperCase()))].sort();
	};

	return (
		<div className={styles.integrationFields}>
			<div className={styles.header}>
				<Title className={styles.title} size="1.2rem">
					{capitalize(integration_type)}{" "}
					<ThemedButton
						theme={ThemedButtonThemes.PRIMARY}
						className={styles.itCount}
						height="18px"
						width="10px"
					>
						{availableItFields?.length}
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
					<ItFieldsPlaceholder />
				) : (
					<Droppable droppableId={JSON.stringify({ type: "it" })}>
						{provided => (
							<div
								className={styles.it}
								{...provided.droppableProps}
								ref={provided.innerRef}
							>
								{generatePossibleAlphabets()?.map((alph, j) => {
									return availableItFields
										.filter(field =>
											field.label.toLowerCase().includes(searchValue.toLowerCase())
										)
										.filter(field => field.label[0] === alph).length > 0 ? (
										<div className={styles.subSection}>
											<div className={styles.subSectionHeader}>{alph}</div>
											<div className={styles.subSectionFields}>
												{availableItFields
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
																		{item.label}
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

export default IntegrationFields;
