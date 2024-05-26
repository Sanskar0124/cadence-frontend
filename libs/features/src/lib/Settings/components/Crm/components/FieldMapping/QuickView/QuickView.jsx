import { userInfo } from "@cadence-frontend/atoms";
import { INTEGRATION_TYPE } from "@cadence-frontend/constants";
import {
	Briefcase,
	Building,
	Email,
	LinkBox,
	LinkedinBox,
	Location,
	Phone,
	SmallArrowDown,
	SmallArrowUp,
} from "@cadence-frontend/icons";
import {
	Common as COMMON_TRANSLATION,
	Email as EMAIL_TRANSLATION,
	Profile as PROFILE_TRANSLATION,
	Tasks as TASKS_TRANSLATION,
	People as PEOPLE_TRANSLATION,
} from "@cadence-frontend/languages";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { Colors } from "@cadence-frontend/utils";
import { ThemedButton } from "@cadence-frontend/widgets";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import { INTEGRATION_FIELDS_AVAILABLE, INTEGRATION_MAP_KEYS } from "./constants";
import styles from "./QuickView.module.scss";

const QuickView = ({ fieldType, ringoverFields, qualText }) => {
	const user = useRecoilValue(userInfo);

	const checkIfFieldDisabled = field => {
		return !INTEGRATION_FIELDS_AVAILABLE[user.integration_type][fieldType].includes(
			field
		);
	};

	const [showAlternateEmails, setShowAlternateEmails] = useState(
		!checkIfFieldDisabled("emails")
	);
	const [showAlternatePhones, setShowAlternatePhones] = useState(
		!checkIfFieldDisabled("phone_numbers")
	);

	const checkIfFieldExists = (field, isObject) => {
		let obj =
			ringoverFields?.[INTEGRATION_MAP_KEYS[user.integration_type][fieldType]] ?? {};
		if (
			user.integration_type === INTEGRATION_TYPE.SALESFORCE &&
			fieldType === "contact"
		) {
			obj = {
				...obj,
				company: ringoverFields.account_map?.name,
				company_phone_number: ringoverFields.account_map?.phone_number,
				...ringoverFields.account_map,
			};
		}
		if (isObject) return Boolean(obj[field]?.name);
		if (obj[field]) return true;
		return false;
	};

	const checkIfFieldExistsInArray = (field, index) => {
		let obj =
			ringoverFields?.[INTEGRATION_MAP_KEYS[user.integration_type][fieldType]] ?? {};
		if (obj[field]?.[index]) return true;
		return false;
	};

	return (
		<div className={`${styles.quickView} `}>
			<div className={styles.header}>
				<ThemedButton
					theme={ThemedButtonThemes.GREY}
					disabled={
						INTEGRATION_TYPE.BULLHORN === user?.integration_type ||
						INTEGRATION_TYPE.ZOHO === user?.integration_type
					}
					className={`${styles.headerButton} ${styles.statusButton}`}
				>
					<div className={styles.statusText}>
						{COMMON_TRANSLATION.STATUS[user?.language?.toUpperCase()]}
					</div>
				</ThemedButton>

				<ThemedButton
					theme={ThemedButtonThemes.GREY}
					className={styles.headerButton}
					disabled={checkIfFieldDisabled("qualification")}
				>
					<div className={styles.qual}>{qualText}</div>
				</ThemedButton>
				<ThemedButton
					theme={ThemedButtonThemes.GREY}
					disabled={true}
					className={styles.headerButton}
				>
					<div>{TASKS_TRANSLATION.ADD_NOTE[user?.language?.toUpperCase()]}</div>
				</ThemedButton>
			</div>

			<div className={styles.body}>
				<div className={styles.redirections}>
					<span
						className={`${!checkIfFieldExists("linkedin_url") ? styles.notSet : ""} ${
							checkIfFieldDisabled("linkedin_url") ? styles.disabled : ""
						}`}
					>
						<LinkedinBox
							size="2rem"
							color={"#0077B7"}
							disabled={checkIfFieldDisabled("linkedin_url")}
						/>
					</span>
					<span
						className={`${!checkIfFieldExists("url") ? styles.notSet : ""} ${
							checkIfFieldDisabled("url") ? styles.disabled : ""
						}`}
					>
						<LinkBox
							size="2rem"
							color={Colors.lightBlue}
							disabled={checkIfFieldDisabled("url")}
						/>
					</span>
				</div>
				<div className={styles.name}>
					<span
						className={`${!checkIfFieldExists("first_name") ? styles.notSet : ""} ${
							checkIfFieldDisabled("first_name") ? styles.disabled : ""
						}`}
					>
						<p>{TASKS_TRANSLATION.FIRST_NAME[user?.language?.toUpperCase()]} </p>
					</span>
					<span
						className={`${!checkIfFieldExists("last_name") ? styles.notSet : ""} ${
							checkIfFieldDisabled("last_name") ? styles.disabled : ""
						}`}
					>
						<p>{COMMON_TRANSLATION.LAST_NAME[user?.language?.toUpperCase()]}</p>
					</span>
				</div>
				<div className={`${styles.companyInfo}`}>
					<Briefcase size="1rem" color={Colors.lightBlue} />{" "}
					<span
						className={`${!checkIfFieldExists("job_position") ? styles.notSet : ""} ${
							checkIfFieldDisabled("job_position") ? styles.disabled : ""
						}`}
					>
						<p>{TASKS_TRANSLATION.POSITION[user?.language?.toUpperCase()]} </p>
					</span>
					<div>{COMMON_TRANSLATION.AT[user?.language?.toUpperCase()]}</div>
					<span
						className={`${!checkIfFieldExists("company") ? styles.notSet : ""} ${
							checkIfFieldDisabled("company") ? styles.disabled : ""
						}`}
					>
						<p>{COMMON_TRANSLATION.COMPANY_NAME[user?.language.toUpperCase()]}</p>
					</span>
					<div>{COMMON_TRANSLATION.WITH[user?.language.toUpperCase()]}</div>
					<span
						className={`${!checkIfFieldExists("size", true) ? styles.notSet : ""} ${
							checkIfFieldDisabled("size") ? styles.disabled : ""
						}`}
					>
						<p>{TASKS_TRANSLATION.COMPANY_SIZE[user?.language.toUpperCase()]}</p>
					</span>
					<div>{`${PEOPLE_TRANSLATION.EMPLOYEE[user?.language.toUpperCase()]}s`}</div>
				</div>
				<div className={styles.emailInfo}>
					<div className={styles.primaryEmail}>
						<span
							className={`${
								!checkIfFieldExistsInArray("emails", 0) ? styles.notSet : ""
							} ${checkIfFieldDisabled("emails") ? styles.disabled : ""}`}
						>
							<p>
								<Email color={Colors.lightBlue} />{" "}
								{EMAIL_TRANSLATION.PRIMARY_EMAIL[user?.language?.toUpperCase()]} {"(4)"}
							</p>
						</span>
						{showAlternateEmails ? (
							<SmallArrowUp
								size="0.56rem"
								color={Colors.lightBlue}
								onClick={() => setShowAlternateEmails(false)}
							/>
						) : (
							<SmallArrowDown
								size="0.56rem"
								color={Colors.lightBlue}
								onClick={() => setShowAlternateEmails(true)}
								disabled={checkIfFieldDisabled("emails")}
							/>
						)}
					</div>
					{showAlternateEmails && (
						<div className={styles.alternateEmails}>
							<div className={styles.aem12}>
								<span
									className={!checkIfFieldExistsInArray("emails", 1) ? styles.notSet : ""}
								>
									<p>
										<Email color={Colors.lightBlue} />{" "}
										{COMMON_TRANSLATION.ALTERNATIVE_MAIL_1[user?.language.toUpperCase()]}
									</p>
								</span>
								<span
									className={!checkIfFieldExistsInArray("emails", 3) ? styles.notSet : ""}
								>
									<p>
										<Email color={Colors.lightBlue} />{" "}
										{COMMON_TRANSLATION.ALTERNATIVE_MAIL_3[user?.language.toUpperCase()]}
									</p>
								</span>
							</div>
							<div className={styles.aem34}>
								<span
									className={!checkIfFieldExistsInArray("emails", 2) ? styles.notSet : ""}
								>
									<p>
										<Email color={Colors.lightBlue} />{" "}
										{COMMON_TRANSLATION.ALTERNATIVE_MAIL_2[user?.language.toUpperCase()]}
									</p>
								</span>
								<span
									className={!checkIfFieldExistsInArray("emails", 4) ? styles.notSet : ""}
								>
									<p>
										<Email color={Colors.lightBlue} />
										{COMMON_TRANSLATION.ALTERNATIVE_MAIL_4[user?.language.toUpperCase()]}
									</p>
								</span>
							</div>
						</div>
					)}
				</div>
				<div className={styles.phoneInfo}>
					<div className={styles.primaryPhone}>
						<span
							className={`${
								!checkIfFieldExistsInArray("phone_numbers", 0) ? styles.notSet : ""
							} ${checkIfFieldDisabled("phone_numbers") ? styles.disabled : ""}`}
						>
							<p>
								<Phone color={Colors.lightBlue} />{" "}
								{PROFILE_TRANSLATION.PRIMARY_PHONE[user?.language?.toUpperCase()]} {"(4)"}
							</p>
						</span>
						{showAlternatePhones ? (
							<SmallArrowUp
								size="0.56rem"
								color={Colors.lightBlue}
								onClick={() => setShowAlternatePhones(false)}
							/>
						) : (
							<SmallArrowDown
								size="0.56rem"
								color={Colors.lightBlue}
								onClick={() => setShowAlternatePhones(true)}
								disabled={checkIfFieldDisabled("phone_numbers")}
							/>
						)}
					</div>
					{showAlternatePhones && (
						<div className={styles.alternatePhones}>
							<div className={styles.apn13}>
								<span
									className={
										!checkIfFieldExistsInArray("phone_numbers", 1) ? styles.notSet : ""
									}
								>
									<p>
										<Phone color={Colors.lightBlue} />{" "}
										{COMMON_TRANSLATION.MOBILE_PHONE[user?.language.toUpperCase()]}
									</p>
								</span>
								<span
									className={
										!checkIfFieldExistsInArray("phone_numbers", 3) ? styles.notSet : ""
									}
								>
									<p>
										<Phone color={Colors.lightBlue} />{" "}
										{COMMON_TRANSLATION.OTHER_PHONE_1[user?.language.toUpperCase()]}
									</p>
								</span>
							</div>
							<div className={styles.apn24}>
								<span
									className={
										!checkIfFieldExistsInArray("phone_numbers", 2) ? styles.notSet : ""
									}
								>
									<p>
										<Phone color={Colors.lightBlue} />{" "}
										{COMMON_TRANSLATION.ALTERNATIVE_PHONE_2[user?.language.toUpperCase()]}
									</p>
								</span>
								<span
									className={
										!checkIfFieldExistsInArray("phone_numbers", 4) ? styles.notSet : ""
									}
								>
									<p>
										<Phone color={Colors.lightBlue} />{" "}
										{COMMON_TRANSLATION.OTHER_PHONE_2[user?.language.toUpperCase()]}
									</p>
								</span>
							</div>
						</div>
					)}
					<span
						className={`${
							!checkIfFieldExists("company_phone_number") ? styles.notSet : ""
						} ${checkIfFieldDisabled("company_phone_number") ? styles.disabled : ""}`}
					>
						<p>
							<Building color={Colors.lightBlue} /> &nbsp;{" "}
							{COMMON_TRANSLATION.COMPANY_PHONE[user?.language.toUpperCase()]}
						</p>
					</span>
				</div>
				<div className={styles.location}>
					<Location color={Colors.lightBlue} size="1.5rem" />
					<span
						className={`${!checkIfFieldExists("zip_code") ? styles.notSet : ""} ${
							checkIfFieldDisabled("zip_code") ? styles.disabled : ""
						}`}
					>
						<p>{COMMON_TRANSLATION.ZIPCODE[user?.language.toUpperCase()]}</p>
					</span>
					,{" "}
					<span
						className={`${!checkIfFieldExists("country") ? styles.notSet : ""} ${
							checkIfFieldDisabled("country") ? styles.disabled : ""
						}`}
					>
						<p>{COMMON_TRANSLATION.COUNTRY[user?.language.toUpperCase()]}</p>
					</span>
				</div>
			</div>
		</div>
	);
};

export default QuickView;
