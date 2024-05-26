import React, { useState, forwardRef } from "react";
import styles from "./TemplateCard.module.scss";
import { Automation, Duration, Steps } from "@cadence-frontend/icons";
import { Colors } from "@cadence-frontend/utils";
import { getTotalDurationOfCadence } from "../Stepscontainer/utils";

const TemplateCard = forwardRef(
	({ template, handleTemplateSelect, template_index }, ref) => {
		const automationNodeLength = template?.nodes.filter(item =>
			item.type.includes("automated")
		).length;
		return (
			<div
				ref={ref}
				className={styles.cardcontainer}
				style={{
					border:
						template_index === template?.cadence_template_id ? "1px solid #5b6be1" : "",
				}}
				onClick={() => handleTemplateSelect(template)}
			>
				<div className={styles.templatedetails}>
					<p className={styles.templatetype}>{template.type}</p>
					<p className={styles.name} title={template.name}>
						{template.name}
					</p>
				</div>
				<div className={styles.stepdetails}>
					<div>
						<Steps color={Colors.lightBlue} />{" "}
						<span>Steps: {template?.nodes?.length} </span>
					</div>
					<div>
						<Duration color={Colors.lightBlue} />
						<span>Duration: {getTotalDurationOfCadence(template?.nodes)} </span>
					</div>
					<div>
						<Automation color={Colors.lightBlue} />
						<span>
							Automation:{" "}
							{((automationNodeLength / template?.nodes?.length) * 100).toFixed()}%{" "}
						</span>
					</div>
				</div>
			</div>
		);
	}
);

export default TemplateCard;
