import { GLOBAL_MODAL_TYPES } from "@cadence-frontend/constants";
import { Variable } from "@cadence-frontend/icons";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { ThemedButton } from "@cadence-frontend/widgets";
import React from "react";
import { getShortVariable } from "./constants";
import { Tooltip } from "@cadence-frontend/components";

const CustomVariableButtons = ({
	styles,
	customVariables = [],
	setActiveModalParams,
	countries,
	lead,
	fieldMap,
	refetchInfo,
	refetchLead,
	getLeadInfo,
	salesforceLoading,
	tooltipText = null,
	scrollType = null,
}) => {
	return customVariables
		?.filter(
			item =>
				item?.value !== null && item?.value !== "" && typeof item?.value !== "object"
		)
		?.map((item, i) => (
			<div
				onClick={() =>
					setActiveModalParams({
						type: GLOBAL_MODAL_TYPES.EDIT_LEAD,
						typeSpecificProps: {
							countries,
							lead,
							fieldMap,
							refetchLead,
							info: getLeadInfo(),
							refetchInfo,
							isScrollDown: true,
							scrollType: scrollType,
						},
						modalProps: {
							isModal: true,
							onClose: () => setActiveModalParams(null),
						},
					})
				}
			>
				<Tooltip text={tooltipText && tooltipText} theme="TOP">
					<ThemedButton
						className={styles.btn}
						theme={ThemedButtonThemes.TRANSPARENT}
						disabled={salesforceLoading}
						width="fit-content"
					>
						<Variable color={"#567191"} />{" "}
						<span
							title={
								getShortVariable(item?.value).includes("...") &&
								(Object.keys(item).includes("picklist_values")
									? item.picklist_values.find(p => p.value === item.value)?.label
									: item?.value)
							}
						>
							{Object.keys(item).includes("picklist_values")
								? getShortVariable(
										item.picklist_values.find(p => p.value === item.value)?.label
								  )
								: getShortVariable(item?.value)}
						</span>
					</ThemedButton>
				</Tooltip>
			</div>
		));
};

export default CustomVariableButtons;
