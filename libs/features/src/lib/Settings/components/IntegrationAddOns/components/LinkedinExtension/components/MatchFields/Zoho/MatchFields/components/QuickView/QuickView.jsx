import {
	Briefcase,
	Building,
	Email,
	Home,
	LinkBox,
	LinkedinBox,
	Location,
	Phone,
	SmallArrowDown,
	SmallArrowUp,
	ZoomInfo,
} from "@cadence-frontend/icons";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { Colors } from "@cadence-frontend/utils";
import { ThemedButton } from "@cadence-frontend/widgets";
import { useState } from "react";
import { QUICKVIEW_FIELDS, RINGOVER_FIELDS, VIEWS } from "../../constants";
import BottomPNG from "./Bottom.png";
import HoverContainer from "../HoverContainer/HoverContainer";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";
import { FIELDS } from "./constants";
import {
	Tasks as TASKS_TRANSLATION,
	Profile as PROFILE_TRANSLATION,
} from "@cadence-frontend/languages";
import {
	Email as EMAIL_TRANSLATION,
	Salesforce as SALESFORCE_TRANSLATION,
} from "@cadence-frontend/languages";
import styles from "./QuickView.module.scss";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import TestFieldsModal from "./components/TestFieldsModal/TestFieldsModal";
import LeadUrlModal from "./components/LeadUrlModal/LeadUrlModal";
import TestFieldsCustomObjectModal from "./components/TestFieldsCustomObjectModal/TestFieldsCustomObjectModal";
import CustomObjectFormModal from "./components/TestFieldsCustomObjectModal/components/CustomObjectFormModal/CustomObjectFormModal";
const QuickView = ({
	currentView,
	setCurrentView,
	setCurrentlyHovered,
	currentlyHovered,
	ringoverFields,
	buildFormFor,
	buttonText,
}) => {
	const [testFieldsModal, setTestFieldsModal] = useState(false);
	const [testFieldsCustomObjectModal, setTestFieldsCustomObjectModal] = useState(false);
	const [showAlternateEmails, setShowAlternateEmails] = useState(false);
	const [showAlternatePhones, setShowAlternatePhones] = useState(false);
	const [showLeadUrlModal, setShowLeadUrlModal] = useState(false);
	const [zohoFileld, setZohoFileld] = useState(FIELDS);
	const [showCustomObjectFormModal, setShowCustomObjectFormModal] = useState(false);
	const [url, setUrl] = useState("");
	const user = useRecoilValue(userInfo);

	return (
		<div className={`${styles.quickView} `}>
			<div
				className={`${styles.blurSheet} ${
					currentlyHovered.length > 0 ? styles.blur : ""
				}`}
			></div>

			<div className={styles.header}>
				<HoverContainer
					setCurrentlyHovered={setCurrentlyHovered}
					className={styles.hoverContainer}
					hoverStyles={styles.hover} //used to implement this style when some other element triggers this hover
					currentlyHovered={currentlyHovered}
					disableHover={
						!QUICKVIEW_FIELDS.INTEGRATION_STATUS.hoversFor.includes(currentView)
					}
					hoverValue={QUICKVIEW_FIELDS.INTEGRATION_STATUS}
				>
					<ThemedButton
						theme={ThemedButtonThemes.GREY}
						disabled={
							!QUICKVIEW_FIELDS.INTEGRATION_STATUS.hoversFor.includes(currentView)
						}
						className={`${styles.headerButton} ${styles.statusButton}`}
					>
						<div>{COMMON_TRANSLATION.STATUS[user?.language?.toUpperCase()]}</div>
					</ThemedButton>
				</HoverContainer>
				<ThemedButton
					theme={ThemedButtonThemes.GREY}
					// disabled={currentView !== VIEWS.CUSTOM_OBJECTS}
					className={styles.headerButton}
					onClick={() => setCurrentView(VIEWS.CUSTOM_OBJECTS)}
				>
					{/* <PlusOutline
						color={currentView === VIEWS.CUSTOM_OBJECTS && Colors.lightBlue}
						size="1rem"
					/> */}
					<div className={styles.qual}>{buttonText}</div>
				</ThemedButton>
				<ThemedButton
					theme={ThemedButtonThemes.GREY}
					disabled={true}
					className={styles.headerButton}
				>
					{/* <Note /> */}
					<div>{TASKS_TRANSLATION.ADD_NOTE[user?.language?.toUpperCase()]}</div>
				</ThemedButton>
			</div>

			<div className={styles.body}>
				<div className={styles.redirections}>
					<HoverContainer
						setCurrentlyHovered={setCurrentlyHovered}
						className={styles.hoverContainer}
						hoverStyles={styles.hover} //used to implement this style when some other element triggers this hover
						currentlyHovered={currentlyHovered}
						disableHover={!QUICKVIEW_FIELDS.LINKEDIN_URL.hoversFor.includes(currentView)}
						hoverValue={QUICKVIEW_FIELDS.LINKEDIN_URL}
					>
						<LinkedinBox size="2rem" color={"#0077B7"} />
					</HoverContainer>
					<HoverContainer
						className={styles.hoverContainer}
						hoverStyles={styles.hover} //used to implement this style when some other element triggers this hover
						setCurrentlyHovered={setCurrentlyHovered}
						currentlyHovered={currentlyHovered}
						disableHover={!QUICKVIEW_FIELDS.COMPANY_URL.hoversFor.includes(currentView)}
						hoverValue={QUICKVIEW_FIELDS.COMPANY_URL}
					>
						<LinkBox size="2rem" color={Colors.lightBlue} />
					</HoverContainer>
					{/* <HoverContainer
						className={styles.hoverContainer}
						hoverStyles={styles.hover} //used to implement this style when some other element triggers this hover
						setCurrentlyHovered={setCurrentlyHovered}
						currentlyHovered={currentlyHovered}
						disableHover={!QUICKVIEW_FIELDS.ZOOM_INFO.hoversFor.includes(currentView)}
						hoverValue={QUICKVIEW_FIELDS.ZOOM_INFO}
					>
						<ZoomInfo size="2rem" color={Colors.zoomInfo} />
					</HoverContainer> */}
				</div>
				<div className={styles.name}>
					<HoverContainer
						className={styles.hoverContainer}
						hoverStyles={styles.hover} //used to implement this style when some other element triggers this hover
						setCurrentlyHovered={setCurrentlyHovered}
						currentlyHovered={currentlyHovered}
						disableHover={!QUICKVIEW_FIELDS.FIRST_NAME.hoversFor.includes(currentView)}
						hoverValue={QUICKVIEW_FIELDS.FIRST_NAME}
					>
						{TASKS_TRANSLATION.FIRST_NAME[user?.language?.toUpperCase()]}
					</HoverContainer>
					<HoverContainer
						className={styles.hoverContainer}
						hoverStyles={styles.hover} //used to implement this style when some other element triggers this hover
						setCurrentlyHovered={setCurrentlyHovered}
						currentlyHovered={currentlyHovered}
						disableHover={!QUICKVIEW_FIELDS.LAST_NAME.hoversFor.includes(currentView)}
						hoverValue={QUICKVIEW_FIELDS.LAST_NAME}
					>
						{COMMON_TRANSLATION.LAST_NAME[user?.language?.toUpperCase()]}
					</HoverContainer>
				</div>
				<div className={`${styles.companyInfo}`}>
					<Briefcase size="1rem" color={Colors.lightBlue} />{" "}
					<HoverContainer
						className={styles.hoverContainer}
						hoverStyles={styles.hover} //used to implement this style when some other element triggers this hover
						setCurrentlyHovered={setCurrentlyHovered}
						currentlyHovered={currentlyHovered}
						disableHover={!QUICKVIEW_FIELDS.JOB_POSITION.hoversFor.includes(currentView)}
						hoverValue={QUICKVIEW_FIELDS.JOB_POSITION}
					>
						{TASKS_TRANSLATION.POSITION[user?.language?.toUpperCase()]}
					</HoverContainer>{" "}
					<div
						className={`${
							currentView !== VIEWS.LEAD && currentView !== VIEWS.ACCOUNT
								? styles.disabled
								: ""
						}`}
					>
						at{" "}
					</div>
					<HoverContainer
						className={styles.hoverContainer}
						hoverStyles={styles.hover} //used to implement this style when some other element triggers this hover
						setCurrentlyHovered={setCurrentlyHovered}
						currentlyHovered={currentlyHovered}
						disableHover={!QUICKVIEW_FIELDS.COMPANY_NAME.hoversFor.includes(currentView)}
						hoverValue={QUICKVIEW_FIELDS.COMPANY_NAME}
					>
						{/* {TASKS_TRANSLATION.COMPANY_NAME[user?.language?.toUpperCase()]} */}
						Company Name
					</HoverContainer>{" "}
					<div
						className={`${
							currentView !== VIEWS.LEAD && currentView !== VIEWS.ACCOUNT
								? styles.disabled
								: ""
						}`}
					>
						with{" "}
					</div>
					<HoverContainer
						className={styles.hoverContainer}
						hoverStyles={styles.hover} //used to implement this style when some other element triggers this hover
						setCurrentlyHovered={setCurrentlyHovered}
						currentlyHovered={currentlyHovered}
						disableHover={!QUICKVIEW_FIELDS.COMPANY_SIZE.hoversFor.includes(currentView)}
						hoverValue={QUICKVIEW_FIELDS.COMPANY_SIZE}
					>
						{/* {TASKS_TRANSLATION.COMPANY_SIZE[user?.language?.toUpperCase()]} */}
						Company Size
					</HoverContainer>{" "}
					<div
						className={`${
							currentView !== VIEWS.LEAD && currentView !== VIEWS.ACCOUNT
								? styles.disabled
								: ""
						}`}
					>
						employees{" "}
					</div>
				</div>
				<div className={styles.emailInfo}>
					<div className={styles.primaryEmail}>
						<HoverContainer
							className={styles.hoverContainer}
							hoverStyles={styles.hover} //used to implement this style when some other element triggers this hover
							setCurrentlyHovered={setCurrentlyHovered}
							currentlyHovered={currentlyHovered}
							disableHover={!QUICKVIEW_FIELDS.P_EMAIL.hoversFor.includes(currentView)}
							hoverValue={QUICKVIEW_FIELDS.P_EMAIL}
						>
							<Email color={Colors.lightBlue} /> &nbsp;
							{EMAIL_TRANSLATION.PRIMARY_EMAIL[user?.language?.toUpperCase()]}
						</HoverContainer>
						<HoverContainer
							className={styles.hoverContainer + " " + styles.dropDown}
							hoverStyles={styles.hover}
							setCurrentlyHovered={setCurrentlyHovered}
							currentlyHovered={currentlyHovered}
							onClick={() => setShowAlternateEmails(prev => !prev)}
							disableHover={
								currentView === VIEWS.ACCOUNT || currentView === VIEWS.CUSTOM_OBJECTS
							}
							forceHover={
								!showAlternateEmails &&
								currentlyHovered.filter(f => f.includes("a_email")).length > 0
							}
							hoverValue={{
								hovers: [
									...QUICKVIEW_FIELDS.A_EMAIL1.hovers,
									...QUICKVIEW_FIELDS.A_EMAIL2.hovers,
									...QUICKVIEW_FIELDS.A_EMAIL3.hovers,
									...QUICKVIEW_FIELDS.A_EMAIL4.hovers,
									QUICKVIEW_FIELDS.A_EMAIL1.value,
									QUICKVIEW_FIELDS.A_EMAIL2.value,
									QUICKVIEW_FIELDS.A_EMAIL3.value,
									QUICKVIEW_FIELDS.A_EMAIL4.value,
								],
								value: "",
							}}
						>
							{"(4)"}
							&nbsp;
							{showAlternateEmails ? (
								<SmallArrowUp size="0.56rem" color={Colors.lightBlue} />
							) : (
								<SmallArrowDown size="0.56rem" color={Colors.lightBlue} />
							)}
						</HoverContainer>
					</div>
					{showAlternateEmails && (
						<div className={styles.alternateEmails}>
							<div className={styles.aem12}>
								<HoverContainer
									className={styles.hoverContainer + " " + styles.aem}
									hoverStyles={styles.hover} //used to implement this style when some other element triggers this hover
									setCurrentlyHovered={setCurrentlyHovered}
									currentlyHovered={currentlyHovered}
									disableHover={
										!QUICKVIEW_FIELDS.A_EMAIL1.hoversFor.includes(currentView)
									}
									hoverValue={QUICKVIEW_FIELDS.A_EMAIL1}
								>
									<Email color={Colors.lightBlue} />
									&nbsp; Alternate Email 1
								</HoverContainer>
								<HoverContainer
									className={styles.hoverContainer + " " + styles.aem}
									hoverStyles={styles.hover} //used to implement this style when some other element triggers this hover
									setCurrentlyHovered={setCurrentlyHovered}
									currentlyHovered={currentlyHovered}
									disableHover={
										!QUICKVIEW_FIELDS.A_EMAIL2.hoversFor.includes(currentView)
									}
									hoverValue={QUICKVIEW_FIELDS.A_EMAIL2}
								>
									<Email color={Colors.lightBlue} />
									&nbsp; Alternate Email 2
								</HoverContainer>
							</div>
							<div className={styles.aem34}>
								<HoverContainer
									className={styles.hoverContainer + " " + styles.aem}
									hoverStyles={styles.hover} //used to implement this style when some other element triggers this hover
									setCurrentlyHovered={setCurrentlyHovered}
									currentlyHovered={currentlyHovered}
									disableHover={
										!QUICKVIEW_FIELDS.A_EMAIL3.hoversFor.includes(currentView)
									}
									hoverValue={QUICKVIEW_FIELDS.A_EMAIL3}
								>
									<Email color={Colors.lightBlue} />
									&nbsp; Alternate Email 3
								</HoverContainer>
								<HoverContainer
									className={styles.hoverContainer + " " + styles.aem}
									hoverStyles={styles.hover} //used to implement this style when some other element triggers this hover
									setCurrentlyHovered={setCurrentlyHovered}
									currentlyHovered={currentlyHovered}
									disableHover={
										!QUICKVIEW_FIELDS.A_EMAIL4.hoversFor.includes(currentView)
									}
									hoverValue={QUICKVIEW_FIELDS.A_EMAIL4}
								>
									<Email color={Colors.lightBlue} />
									&nbsp; Alternate Email 4
								</HoverContainer>
							</div>
						</div>
					)}
				</div>
				<div className={styles.phoneInfo}>
					<div className={styles.primaryPhone}>
						<HoverContainer
							className={styles.hoverContainer}
							hoverStyles={styles.hover} //used to implement this style when some other element triggers this hover
							setCurrentlyHovered={setCurrentlyHovered}
							currentlyHovered={currentlyHovered}
							disableHover={
								!QUICKVIEW_FIELDS.P_PHONE_NUMBER.hoversFor.includes(currentView)
							}
							hoverValue={QUICKVIEW_FIELDS.P_PHONE_NUMBER}
						>
							<Phone color={Colors.lightBlue} /> &nbsp;
							{PROFILE_TRANSLATION.PRIMARY_PHONE[user?.language?.toUpperCase()]}
						</HoverContainer>
						<HoverContainer
							className={styles.hoverContainer + " " + styles.dropDown}
							hoverStyles={styles.hover}
							setCurrentlyHovered={setCurrentlyHovered}
							currentlyHovered={currentlyHovered}
							disableHover={
								currentView === VIEWS.ACCOUNT || currentView === VIEWS.CUSTOM_OBJECTS
							}
							onClick={() => setShowAlternatePhones(prev => !prev)}
							forceHover={
								!showAlternatePhones &&
								currentlyHovered.filter(f => f.includes("a_phone")).length > 0
							}
							hoverValue={{
								hovers: [
									...QUICKVIEW_FIELDS.A_PHONE_NUMBER1.hovers,
									...QUICKVIEW_FIELDS.A_PHONE_NUMBER2.hovers,
									...QUICKVIEW_FIELDS.A_PHONE_NUMBER3.hovers,
									...QUICKVIEW_FIELDS.A_PHONE_NUMBER4.hovers,
									QUICKVIEW_FIELDS.A_PHONE_NUMBER1.value,
									QUICKVIEW_FIELDS.A_PHONE_NUMBER2.value,
									QUICKVIEW_FIELDS.A_PHONE_NUMBER3.value,
									QUICKVIEW_FIELDS.A_PHONE_NUMBER4.value,
								],
								value: "",
							}}
						>
							{"(4)"}
							&nbsp;
							{showAlternatePhones ? (
								<SmallArrowUp size="0.56rem" color={Colors.lightBlue} />
							) : (
								<SmallArrowDown size="0.56rem" color={Colors.lightBlue} />
							)}
						</HoverContainer>
					</div>
					{showAlternatePhones && (
						<div className={styles.alternatePhones}>
							<div className={styles.apn13}>
								<HoverContainer
									className={styles.hoverContainer + " " + styles.apn}
									hoverStyles={styles.hover} //used to implement this style when some other element triggers this hover
									setCurrentlyHovered={setCurrentlyHovered}
									currentlyHovered={currentlyHovered}
									disableHover={
										!QUICKVIEW_FIELDS.A_PHONE_NUMBER1.hoversFor.includes(currentView)
									}
									hoverValue={QUICKVIEW_FIELDS.A_PHONE_NUMBER1}
								>
									<Phone color={Colors.lightBlue} /> &nbsp;
									{RINGOVER_FIELDS[currentView].filter(f =>
										QUICKVIEW_FIELDS.A_PHONE_NUMBER1.hovers.includes(f.uid)
									)[0]?.label ?? "Alternative Phone 1"}
								</HoverContainer>
								<HoverContainer
									className={styles.hoverContainer + " " + styles.apn}
									hoverStyles={styles.hover} //used to implement this style when some other element triggers this hover
									setCurrentlyHovered={setCurrentlyHovered}
									currentlyHovered={currentlyHovered}
									disableHover={
										!QUICKVIEW_FIELDS.A_PHONE_NUMBER3.hoversFor.includes(currentView)
									}
									hoverValue={QUICKVIEW_FIELDS.A_PHONE_NUMBER3}
								>
									<Home color={Colors.lightBlue} /> &nbsp;
									{RINGOVER_FIELDS[currentView].filter(f =>
										QUICKVIEW_FIELDS.A_PHONE_NUMBER3.hovers.includes(f.uid)
									)[0]?.label ?? "Alternative Phone 3"}
								</HoverContainer>
							</div>
							<div className={styles.apn24}>
								<HoverContainer
									className={styles.hoverContainer + " " + styles.apn}
									hoverStyles={styles.hover} //used to implement this style when some other element triggers this hover
									setCurrentlyHovered={setCurrentlyHovered}
									currentlyHovered={currentlyHovered}
									disableHover={
										!QUICKVIEW_FIELDS.A_PHONE_NUMBER2.hoversFor.includes(currentView)
									}
									hoverValue={QUICKVIEW_FIELDS.A_PHONE_NUMBER2}
								>
									{RINGOVER_FIELDS[currentView]
										.filter(f =>
											QUICKVIEW_FIELDS.A_PHONE_NUMBER2.hovers.includes(f.uid)
										)[0]
										?.label?.toLowerCase()
										?.includes("company") ? (
										<Building color={Colors.lightBlue} />
									) : (
										<Home color={Colors.lightBlue} />
									)}{" "}
									&nbsp;
									{RINGOVER_FIELDS[currentView].filter(f =>
										QUICKVIEW_FIELDS.A_PHONE_NUMBER2.hovers.includes(f.uid)
									)[0]?.label ?? "Alternative Phone 2"}
								</HoverContainer>
								<HoverContainer
									className={styles.hoverContainer + " " + styles.apn}
									hoverStyles={styles.hover} //used to implement this style when some other element triggers this hover
									setCurrentlyHovered={setCurrentlyHovered}
									currentlyHovered={currentlyHovered}
									disableHover={
										!QUICKVIEW_FIELDS.A_PHONE_NUMBER4.hoversFor.includes(currentView)
									}
									hoverValue={QUICKVIEW_FIELDS.A_PHONE_NUMBER4}
								>
									<Home color={Colors.lightBlue} />
									&nbsp;{" "}
									{RINGOVER_FIELDS[currentView].filter(f =>
										QUICKVIEW_FIELDS.A_PHONE_NUMBER4.hovers.includes(f.uid)
									)[0]?.label ?? "Alternative Phone 4"}
								</HoverContainer>
							</div>
						</div>
					)}
					<HoverContainer
						className={styles.hoverContainer}
						hoverStyles={styles.hover} //used to implement this style when some other element triggers this hover
						setCurrentlyHovered={setCurrentlyHovered}
						currentlyHovered={currentlyHovered}
						disableHover={
							!QUICKVIEW_FIELDS.COMPANY_PHONE_NUMBER.hoversFor.includes(currentView)
						}
						hoverValue={QUICKVIEW_FIELDS.COMPANY_PHONE_NUMBER}
					>
						<Building color={Colors.lightBlue} /> &nbsp;Company Phone
					</HoverContainer>
				</div>
				<div className={styles.location}>
					<HoverContainer
						className={styles.hoverContainer}
						hoverStyles={styles.hover} //used to implement this style when some other element triggers this hover
						setCurrentlyHovered={setCurrentlyHovered}
						currentlyHovered={currentlyHovered}
						disableHover={!QUICKVIEW_FIELDS.ZIPCODE.hoversFor.includes(currentView)}
						hoverValue={QUICKVIEW_FIELDS.ZIPCODE}
					>
						<Location color={Colors.lightBlue} /> &nbsp;Zipcode
					</HoverContainer>
					,
					<HoverContainer
						className={styles.hoverContainer}
						hoverStyles={styles.hover} //used to implement this style when some other element triggers this hover
						setCurrentlyHovered={setCurrentlyHovered}
						currentlyHovered={currentlyHovered}
						disableHover={!QUICKVIEW_FIELDS.COUNTRY.hoversFor.includes(currentView)}
						hoverValue={QUICKVIEW_FIELDS.COUNTRY}
					>
						Country
					</HoverContainer>{" "}
				</div>
			</div>

			<div className={styles.footer}>
				<div className={styles.testFields}>
					<ThemedButton
						theme={ThemedButtonThemes.RED}
						className={styles.testFieldsButton}
						onClick={() => {
							if (currentView === VIEWS.CUSTOM_OBJECTS)
								setTestFieldsCustomObjectModal(buildFormFor);
							else setTestFieldsModal(currentView);
						}}
						width="250px"
					>
						{" "}
						<div>
							{SALESFORCE_TRANSLATION.TEST_ZOHO_CONNECTION[user?.language?.toUpperCase()]}
						</div>
					</ThemedButton>
				</div>
				<img src={BottomPNG} alt="" />
			</div>

			<TestFieldsModal
				modal={testFieldsModal}
				setModal={setTestFieldsModal}
				ringoverFields={ringoverFields}
				currentView={currentView}
			/>

			{testFieldsCustomObjectModal && (
				<TestFieldsCustomObjectModal
					buildFormFor={buildFormFor}
					modal={testFieldsCustomObjectModal}
					setModal={setTestFieldsCustomObjectModal}
					setShowCustomObjectFormModal={setShowCustomObjectFormModal}
					fields={zohoFileld}
					setFields={setZohoFileld}
					url={url}
					setUrl={setUrl}
				/>
			)}

			{Object?.keys(zohoFileld[buildFormFor])?.length !== 0 && (
				<CustomObjectFormModal
					modal={showCustomObjectFormModal}
					setModal={setShowCustomObjectFormModal}
					setShowLeadUrlModal={setShowLeadUrlModal}
					fields={zohoFileld}
					buildFormFor={buildFormFor}
					onClose={() => setShowCustomObjectFormModal(false)}
				/>
			)}
			<LeadUrlModal modal={showLeadUrlModal} setModal={setShowLeadUrlModal} url={url} />
		</div>
	);
};

export default QuickView;
