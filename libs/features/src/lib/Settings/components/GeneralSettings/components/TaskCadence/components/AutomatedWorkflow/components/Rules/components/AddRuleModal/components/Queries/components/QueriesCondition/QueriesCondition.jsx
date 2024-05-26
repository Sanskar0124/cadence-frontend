import { ThemedButtonThemes } from "@cadence-frontend/themes";
import styles from "./QueriesCondition.module.scss";
import {
	operators,
	SELECT_DATA_TYPE,
	PIPEDRIVE_HUBSPOT_SELLSY_ID_FIELDS,
} from "../../../../../constants";
import { Input, Select, ThemedButton } from "@cadence-frontend/widgets";
import {
	Caution2,
	Company,
	Delete,
	Leads,
	PlusOutline,
	User,
	User2,
} from "@cadence-frontend/icons";
import { Colors } from "@cadence-frontend/utils";
const QueriesCondition = ({
	originalFilter,
	parentFilter,
	filterNode,
	setFilter,
	body,
	options,
	onAddingNode,
	onDeletingNode,
	onChangingCondition,
	level,
}) => {
	return (
		<div>
			<div className={styles.criteriaSubWrapper}>
				<div className={styles.outsideNode}>
					<div className={`${styles.firstNode}`}>
						<div className={styles.criteria}>
							<Select
								options={options}
								value={
									filterNode?.condition?.integration_field
										? `${filterNode?.condition?.integration_field}.${filterNode?.condition?.model_type}`
										: ""
								}
								setValue={val => {
									const opt = options.find(i => i?.value === val);
									setFilter(
										onChangingCondition(
											filterNode.id,
											{
												integration_field: opt?.value.substring(
													0,
													opt?.value?.lastIndexOf(".")
												),
												integration_label: opt?.label,
												integration_data_type:
													opt?.data_type === "date" || opt?.data_type === "datetime"
														? "date"
														: "string",
												model_type: opt?.model_type,
												...((SELECT_DATA_TYPE.includes(opt?.data_type) ||
													PIPEDRIVE_HUBSPOT_SELLSY_ID_FIELDS.includes(
														opt?.value.substring(0, opt?.value?.lastIndexOf("."))
													)) && {
													equator: "equal",
												}),
												...(opt?.data_type === "date" || opt?.data_type === "datetime"
													? {
															value: new Date().getTime(),
													  }
													: { value: "" }),
											},
											originalFilter
										)
									);
								}}
								placeholder={"Select a criteria"}
								getOptionLabel={opt =>
									GenerateLabel(
										opt,
										`${filterNode?.condition?.integration_field}.${filterNode?.condition?.model_type}`
									)
								}
								getOptionValue={opt => `${opt.label}.${opt.value}`}
								isSearchable
							/>

							{filterNode?.condition?.integration_field && (
								<div className={styles.typeTwo}>
									{SELECT_DATA_TYPE.includes(
										options.find(
											i =>
												i?.value ===
												`${filterNode?.condition?.integration_field}.${filterNode?.condition?.model_type}`
										)?.data_type
									) ||
									PIPEDRIVE_HUBSPOT_SELLSY_ID_FIELDS.includes(
										filterNode?.condition?.integration_field
									) ? (
										<Input
											placeholder={"Type here..."}
											value={"Equal"}
											disabled
											setValue={val => null}
										/>
									) : (
										<Select
											placeholder={"Select operator"}
											options={operators(
												options.find(
													i =>
														i?.value ===
														`${filterNode?.condition?.integration_field}.${filterNode?.condition?.model_type}`
												)?.data_type
											)}
											value={filterNode?.condition?.equator}
											setValue={val =>
												setFilter(
													onChangingCondition(
														filterNode.id,
														{
															equator: val,
														},
														originalFilter
													)
												)
											}
										/>
									)}

									{filterNode?.condition?.integration_data_type === "date" ? (
										<Input
											type={
												options.find(
													i =>
														i?.value ===
														`${filterNode?.condition?.integration_field}.${filterNode?.condition?.model_type}`
												)?.data_type
											}
											value={filterNode?.condition?.value}
											left
											setValue={val => {
												setFilter(
													onChangingCondition(
														filterNode.id,
														{
															value: val,
														},
														originalFilter
													)
												);
											}}
											className={styles.inputDate}
											width={"100%"}
										/>
									) : SELECT_DATA_TYPE.includes(
											options.find(
												i =>
													i?.value ===
													`${filterNode?.condition?.integration_field}.${filterNode?.condition?.model_type}`
											)?.data_type
									  ) ? (
										<Select
											placeholder={"Select"}
											options={
												options.find(
													i =>
														i?.value ===
														`${filterNode?.condition?.integration_field}.${filterNode?.condition?.model_type}`
												)?.picklistValues
											}
											value={filterNode?.condition?.value}
											setValue={val =>
												setFilter(
													onChangingCondition(
														filterNode.id,
														{
															value: val,
														},
														originalFilter
													)
												)
											}
										/>
									) : (
										<Input
											className={styles.conditionInput}
											placeholder={"Type here..."}
											value={filterNode?.condition?.value}
											setValue={val =>
												setFilter(
													onChangingCondition(
														filterNode.id,
														{
															value: val,
														},
														originalFilter
													)
												)
											}
										/>
									)}
								</div>
							)}
						</div>

						<div className={styles.conditionWrapper}>
							<div className={styles.iconBtns}>
								<ThemedButton
									theme={ThemedButtonThemes.GREY}
									className={styles.iconBtn}
									onClick={() =>
										level <= 3 && setFilter(onAddingNode(filterNode.id, originalFilter))
									}
									disabled={level <= 3 ? false : true}
								>
									<PlusOutline color={level <= 3 ? "#567191" : "#8193A6"} />
								</ThemedButton>

								<ThemedButton
									onClick={e => {
										e.stopPropagation();
										parentFilter &&
											setFilter(
												onDeletingNode(parentFilter.id, filterNode.id, originalFilter)
											);
									}}
									theme={ThemedButtonThemes.GREY}
									className={styles.iconBtn}
								>
									<Delete color={"#567191"} />
								</ThemedButton>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
function GenerateLabel(opt, selectedOpt) {
	const color = opt.value === selectedOpt ? Colors.white : Colors.lightBlue;
	return (
		<div className={styles.optionLabel}>
			<div className={styles.label} title={opt.label}>
				{opt.label}
			</div>
			<div
				className={`${styles.tag} ${
					opt.value === selectedOpt ? styles.selected : styles.notSelected
				}`}
			>
				{opt?.option_type}
				{opt?.option_type === "User" || opt?.option_type === "Owner" ? (
					<User2 color={color} />
				) : opt?.option_type === "Lead" ? (
					<User color={color} />
				) : (
					<Company color={color} />
				)}
			</div>
		</div>
	);
}
export default QueriesCondition;
