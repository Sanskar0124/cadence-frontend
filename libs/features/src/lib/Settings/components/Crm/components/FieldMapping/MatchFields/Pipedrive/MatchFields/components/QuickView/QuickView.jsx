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
import HoverContainer from "../HoverContainer/HoverContainer";
import BottomPNG from "./Bottom.png";
import LeadUrlModal from "./components/LeadUrlModal/LeadUrlModal";
import CustomObjectFormModal from "./components/TestFieldsCustomObjectModal/components/CustomObjectFormModal/CustomObjectFormModal";
import TestFieldsCustomObjectModal from "./components/TestFieldsCustomObjectModal/TestFieldsCustomObjectModal";
import TestFieldsModal from "./components/TestFieldsModal/TestFieldsModal";
import { FIELDS } from "./constants";
import styles from "./QuickView.module.scss";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import { Tasks as TASKS_TRANSLATION } from "@cadence-frontend/languages";
import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue } from "recoil";
import {
	Email as EMAIL_TRANSLATION,
	Pipedrive as PIPEDRIVE_TRANSLATION,
	Settings as SETTINGS_TRANSLATION,
	People as PEOPLE_TRANSLATION,
	Profile as PROFILE_TRANSLATION,
} from "@cadence-frontend/languages";

//components

//constants

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
	const [pipedriveFields, setPipedriveFields] = useState(FIELDS);
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
						{COMMON_TRANSLATION.STATUS[user?.language?.toUpperCase()]}
					</ThemedButton>
				</HoverContainer>
				<ThemedButton
					theme={ThemedButtonThemes.GREY}
					disabled={currentView !== VIEWS.CUSTOM_OBJECTS}
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
					<div className={`${currentView !== VIEWS.ORGANIZATION ? styles.disabled : ""}`}>
						{COMMON_TRANSLATION.AT[user?.language?.toUpperCase()]}{" "}
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
						{COMMON_TRANSLATION.COMPANY_NAME[user?.language?.toUpperCase()]}
					</HoverContainer>{" "}
					<div className={`${currentView !== VIEWS.ORGANIZATION ? styles.disabled : ""}`}>
						{COMMON_TRANSLATION.WITH[user?.language?.toUpperCase()]}{" "}
					</div>
					<HoverContainer
						className={styles.hoverContainer}
						hoverStyles={styles.hover} //used to implement this style when some other element triggers this hover
						setCurrentlyHovered={setCurrentlyHovered}
						currentlyHovered={currentlyHovered}
						disableHover={!QUICKVIEW_FIELDS.COMPANY_SIZE.hoversFor.includes(currentView)}
						hoverValue={QUICKVIEW_FIELDS.COMPANY_SIZE}
					>
						{TASKS_TRANSLATION.COMPANY_SIZE[user?.language?.toUpperCase()]}
					</HoverContainer>{" "}
					<div className={`${currentView !== VIEWS.ORGANIZATION ? styles.disabled : ""}`}>
						{PEOPLE_TRANSLATION.EMPLOYEE[user?.language?.toUpperCase()]}
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
					</div>
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
					</div>
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
						<Building color={Colors.lightBlue} /> &nbsp;
						{COMMON_TRANSLATION.COMPANY_PHONE[user?.language?.toUpperCase()]}
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
						<Location color={Colors.lightBlue} /> &nbsp;
						{COMMON_TRANSLATION.ZIPCODE[user?.language?.toUpperCase()]}
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
						{COMMON_TRANSLATION.COUNTRY[user?.language?.toUpperCase()]}
					</HoverContainer>{" "}
				</div>
			</div>
			<div className={styles.footer}>
				<div className={styles.testFields}>
					<ThemedButton
						theme={ThemedButtonThemes.PRIMARY}
						className={styles.testFieldsButton}
						onClick={() => {
							if (currentView === VIEWS.CUSTOM_OBJECTS)
								setTestFieldsCustomObjectModal(VIEWS.PERSON);
							else setTestFieldsModal(currentView);
						}}
						width="250px"
					>
						{" "}
						{SETTINGS_TRANSLATION.PREVIEW_FIELDS[user?.language?.toUpperCase()]}
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
					modal={testFieldsCustomObjectModal}
					setModal={setTestFieldsCustomObjectModal}
					setShowCustomObjectFormModal={setShowCustomObjectFormModal}
					fields={pipedriveFields}
					setFields={setPipedriveFields}
					url={url}
					setUrl={setUrl}
				/>
			)}

			{Object.keys(pipedriveFields[VIEWS.PERSON]).length !== 0 && (
				<CustomObjectFormModal
					modal={showCustomObjectFormModal}
					setModal={setShowCustomObjectFormModal}
					setShowLeadUrlModal={setShowLeadUrlModal}
					fields={pipedriveFields}
					onClose={() => setShowCustomObjectFormModal(false)}
				/>
			)}

			<LeadUrlModal modal={showLeadUrlModal} setModal={setShowLeadUrlModal} url={url} />
		</div>
	);
};

export default QuickView;
