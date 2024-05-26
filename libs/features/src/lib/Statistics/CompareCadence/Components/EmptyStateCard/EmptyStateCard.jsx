import React from "react";
import styles from "./EmptyStateCard.module.scss";
import { Tick, CadencesGradient, Arrow, HorizontalArrow } from "@cadence-frontend/icons";
import { DUMMY_DATA } from "../../Constants";
import { Colors } from "@cadence-frontend/utils";

const EmptyStateCard = () => {
	return (
		<div className={styles.emptystatecontainer}>
			<div className={styles.stepscontainer}>
				<div className={styles.details}>
					<p className={styles.subtitle}>No cadence and KPI selected</p>
					<p className={styles.desc}>
						You can select upto 4 cadences and upto 6 KPIs to compare them
					</p>
				</div>
				<div className={styles.stepdetails}>
					<div className={styles.selectcadence}>
						<p className={styles.title}>1. Select your cadences</p>
						<div className={styles.cadences}>
							<div className={styles.cadence_left}>
								<CadenceRow cadence={DUMMY_DATA[0]} />
							</div>
							<div className={styles.cadence_right}>
								<CadenceRow cadence={DUMMY_DATA[1]} />
							</div>
						</div>
					</div>
					<div className={styles.arrow1}>
						<HorizontalArrow color={Colors.disabled} />
					</div>

					<div className={styles.selectkpi}>
						<p className={styles.title}>2. Select your KPIs</p>
						<div className={styles.taskcontainer}>
							{[
								"Task completed",
								"Task skipped",
								"Emails",
								"SMS",
								"Active leads",
								"Demos booked",
								"Callback",
							].map((item, index) => {
								return (
									<div
										className={
											index === 2 || index === 4
												? `${styles.taskname} ${styles.isSelect}`
												: styles.taskname
										}
									>
										{item}
									</div>
								);
							})}
						</div>
					</div>
					<div className={styles.arrow2}>
						<HorizontalArrow color={Colors.disabled} />
					</div>
					<div className={styles.selecttimeframe}>
						<p className={styles.title}>3. Select your time frame</p>
						<div className={styles.dropdown}>
							{["Yesterday", "Last week", "Last month", "This week", "This month"].map(
								(item, index) => (
									<div
										className={
											index === 2
												? `${styles.filtername} ${styles.selected}`
												: styles.filtername
										}
									>
										{item}
									</div>
								)
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default EmptyStateCard;

const CadenceRow = ({ cadence }) => {
	return (
		<div
			className={
				cadence.isSelected
					? `${styles.cadence} ${styles.selectedcadence}`
					: styles.cadence
			}
		>
			<div className={styles.details}>
				<div
					className={
						cadence.isSelected
							? `${styles.cadenceicon} ${styles.gradientbg}`
							: styles.cadenceicon
					}
				>
					{cadence.isSelected ? (
						<Tick color={Colors.white} />
					) : (
						<CadencesGradient size={18} />
					)}
				</div>
				<div className={styles.nameanddetails}>
					<p className={styles.name}>{cadence.name}</p>
					<div className={styles.cadenceinfo}>
						<span>{cadence.no_of_users} users</span>
						<span>
							&nbsp;&bull;&nbsp;
							{cadence.steps} steps
						</span>
						<span>&bull;&nbsp;{cadence.people} people</span>
					</div>
				</div>
			</div>
		</div>
	);
};
