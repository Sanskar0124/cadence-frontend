import { useState, useEffect } from "react";
import styles from "./FetchedQuickView.module.scss";

import {
	Briefcase,
	Building,
	Email,
	Home,
	LinkBox,
	LinkedinBox,
	Location,
} from "@cadence-frontend/icons";
import { Colors } from "@cadence-frontend/utils";
import { VIEWS } from "../../../../../constants";
import {
	Common as COMMON_TRASNLATION,
	People as PEOPLE_TRANSLATION,
	Profile as PROFILE_TRANSLATION,
	Settings as SETTINGS_TRANSLATION,
} from "@cadence-frontend/languages";

import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue } from "recoil";
//components

//constants
const designField = ({
	text = "Error",
	size = "1rem",
	color = "black",
	className = "",
	...rest
}) => {
	return (
		<div
			className={`${styles.error} ${className}`}
			{...rest}
			style={{ color }}
			title={text}
		>
			{text}
		</div>
	);
};

const FetchedQuickView = ({ fieldsResult, currentView }) => {
	const Render = (backendField, className) => {
		const item = fieldsResult.filter(item => item.backendField === backendField)?.[0];
		console.log(backendField, fieldsResult, "Vanshlog");
		//diff view case
		if (!item) return null;
		//missed field case
		if (item.value.name === "")
			return designField({ text: item.label, color: Colors.mainPurple, className });
		// unmatched field case
		else if (
			item.value.name !== "" &&
			item.retrievedValue ===
				`${SETTINGS_TRANSLATION.NOT_SET[user?.language.toUpperCase()]}`
		)
			return designField({ text: item.label, color: Colors.redShade2, className });
		//field retrieved case
		else if (item.value.name !== "" && item.retrievedValue)
			return designField({ text: item.retrievedValue, color: Colors.black, className });
	};
	const [linkedinUrl, setLinkedinUrl] = useState(null);
	const [companyUrl, setCompanyUrl] = useState(null);
	const user = useRecoilValue(userInfo);

	useEffect(() => {
		if (fieldsResult) {
			setLinkedinUrl(
				fieldsResult.filter(
					item =>
						item.backendField === "linkedin_url" &&
						item.retrievedValue &&
						item.value.name !== ""
				)?.[0]?.retrievedValue
			);
			setCompanyUrl(
				fieldsResult.filter(
					item =>
						item.backendField === "url" && item.retrievedValue && item.value.name !== ""
				)?.[0]?.retrievedValue
			);
		}
	}, [fieldsResult]);
	console.log(
		fieldsResult.filter(
			item => item.retrievedValue && item.backendField === "emails"
		)?.[0],
		"FilterFetch"
	);
	return (
		<div className={styles.fetchedQuickView}>
			<div className={styles.body}>
				<div className={styles.integrationStatus}>
					{Render("integration_status", styles.integrationStatusButton)}
				</div>
				<div className={styles.redirections}>
					<div
						className={styles.hoverContainer}
						style={{
							cursor:
								linkedinUrl &&
								linkedinUrl !==
									`${SETTINGS_TRANSLATION.NOT_SET[user?.language.toUpperCase()]}`
									? "pointer"
									: "default",
						}}
						onClick={() =>
							linkedinUrl &&
							linkedinUrl !==
								`${SETTINGS_TRANSLATION.NOT_SET[user?.language.toUpperCase()]}`
								? window.open(linkedinUrl, "_blank")
								: null
						}
					>
						<LinkedinBox
							size="1.8rem"
							color={
								fieldsResult.filter(
									item =>
										item.backendField === "linkedin_url" &&
										!item.retrievedValue &&
										item.value.name !== ""
								).length
									? Colors.redShade3
									: "#0077B7"
							}
						/>
					</div>
					<div
						className={styles.hoverContainer}
						style={{
							cursor:
								companyUrl &&
								companyUrl !==
									`${SETTINGS_TRANSLATION.NOT_SET[user?.language.toUpperCase()]}`
									? "pointer"
									: "default",
						}}
						onClick={() =>
							companyUrl &&
							companyUrl !==
								`${SETTINGS_TRANSLATION.NOT_SET[user?.language.toUpperCase()]}`
								? window.open(companyUrl, "_blank")
								: null
						}
					>
						<LinkBox
							size="1.8rem"
							color={
								fieldsResult.filter(
									item =>
										item.backendField === "company_url" &&
										!item.retrievedValue &&
										item.value.name !== ""
								).length
									? Colors.redShade3
									: Colors.lightBlue
							}
						/>
					</div>
				</div>
				<div className={styles.name}>
					<div className={styles.hoverContainer}>{Render("first_name")}</div>
					<div className={styles.hoverContainer}>{Render("last_name")}</div>
				</div>
				<div className={styles.companyInfo}>
					<Briefcase size="1rem" color={Colors.lightBlue} />{" "}
					<div className={`${styles.hoverContainer}`}>
						{Render("job_position", styles.jobPosition)}
					</div>{" "}
					{COMMON_TRASNLATION.AT[user?.language.toUpperCase()]}{" "}
					<div className={`${styles.hoverContainer}`}>
						{Render(currentView === VIEWS.LEAD ? "company" : "name", styles.companyName)}
					</div>{" "}
					{COMMON_TRASNLATION.WITH[user?.language.toUpperCase()]}
					<div className={styles.hoverContainer}>{Render("size")}</div>{" "}
					{`${PEOPLE_TRANSLATION.EMPLOYEE[user?.language?.toUpperCase()]}s`}
				</div>
				<div className={styles.emailInfo}>
					<div className={styles.hoverContainer}>
						{" "}
						{Array?.isArray(
							fieldsResult.filter(
								item => item.retrievedValue && item.backendField === "emails"
							)?.[0]?.retrievedValue
						)
							? fieldsResult
									.filter(
										item => item.retrievedValue && item.backendField === "emails"
									)?.[0]
									?.retrievedValue?.map(em => (
										<div>
											<Email color={Colors.lightBlue} />
											{em.email_id}
										</div>
									))
							: designField({
									text: "Email fields",
									size: "1rem",
									color: Colors.redShade3,
							  })}
					</div>
				</div>
				<div className={styles.phoneInfo}>
					<div className={styles.hoverContainer}>
						{Array.isArray(
							fieldsResult.filter(
								item => item.retrievedValue && item.backendField === "phone_numbers"
							)[0]?.retrievedValue
						)
							? fieldsResult
									.filter(
										item => item.retrievedValue && item.backendField === "phone_numbers"
									)[0]
									?.retrievedValue?.map(em => (
										<div>
											<Home color={Colors.lightBlue} />
											{em.phone_number}
										</div>
									))
							: designField({
									text: "Phone fields",
									size: "1rem",
									color: Colors.redShade3,
							  })}
					</div>
					<div className={styles.hoverContainer}>
						<Building color={Colors.lightBlue} /> {Render("phone_number")}
					</div>
				</div>
				<div className={styles.location}>
					<Location size="1.1rem" />
					<div className={styles.hoverContainer}>{Render("zipcode")}</div>,
					<div className={styles.hoverContainer}>{Render("country")}</div>
				</div>
			</div>
			{/* <div className={styles.footer}>
				<img src={BottomPNG} alt="" />
			</div> */}
		</div>
	);
};

export default FetchedQuickView;
