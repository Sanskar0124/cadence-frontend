import { useEffect, useRef, useState, useCallback } from "react";
import { Building, Home, Phone, Tick, TriangleArrow } from "@cadence-frontend/icons";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { Colors, useOutsideClickHandler } from "@cadence-frontend/utils";
import { ThemedButton } from "@cadence-frontend/widgets";
import styles from "./CallTB.module.scss";
import {
	ENUMS,
	PHONE_INTEGRATIONS,
	POWER_STATUS,
	POWER_TASK_STATUS,
	PRODUCT_TOUR_STATUS,
} from "@cadence-frontend/constants";
import { useRecoilValue } from "recoil";
import { powerInfo, tourInfo, userInfo } from "@cadence-frontend/atoms";

const CallTB = ({
	lead,
	stepName,
	primaryPhone,
	setPrimaryPhone,
	userId,
	handleCallClick,
	validateTask,
	callLoading,
	loading,
	activeTaskInfo,
}) => {
	const user = useRecoilValue(userInfo);
	const power = useRecoilValue(powerInfo);
	const tour = useRecoilValue(tourInfo);

	const dropDownRef = useRef();

	const [showDropdown, setShowDropDown] = useState(false);
	const [phoneNumbers, setPhoneNumbers] = useState({ lead_id: null, numbers: [] });

	useEffect(() => {
		const numbers = lead.Lead_phone_numbers?.filter(pn => pn.phone_number);
		const accountNumber = lead.Account?.phone_number;

		if (accountNumber) {
			const accountNumberObj = {
				lpn_id: crypto.randomUUID(),
				is_primary: false,
				is_account: true,
				phone_number: accountNumber,
				formatted_phone_number: accountNumber,
			};
			numbers.unshift(accountNumberObj);
		}
		setPhoneNumbers({ lead_id: lead.lead_id, numbers });
	}, [lead]);

	const handleDropdown = () => {
		if (phoneNumbers.numbers?.length > 1) setShowDropDown(prev => !prev);
	};

	const isCallAndSmsDisabled = useCallback(
		() => user?.phone_system === PHONE_INTEGRATIONS.NONE,
		[user]
	);

	const closeModal = () => setShowDropDown(false);

	const isInsufficientData = () => phoneNumbers.numbers?.length === 0;

	useOutsideClickHandler(dropDownRef, closeModal, false);

	// power
	useEffect(() => {
		if (
			//check if power is running
			power.status === POWER_STATUS.BOOSTED &&
			power.tasks.find(t => t.active)?.task_id === activeTaskInfo.task_id &&
			power.tasks.find(t => t.active)?.status !== POWER_TASK_STATUS.COMPLETED &&
			//check if lead exists
			Object.keys(lead ?? {}).length > 0 &&
			lead.lead_id === activeTaskInfo.Lead?.lead_id &&
			//check if there are phone numbers
			phoneNumbers.lead_id === lead.lead_id &&
			phoneNumbers.numbers?.length >= 0
		) {
			!isCallAndSmsDisabled() && handleCallClick(primaryPhone?.formatted_phone_number);
		}
	}, [lead, power, phoneNumbers]);

	return isCallAndSmsDisabled() &&
		tour?.status !== PRODUCT_TOUR_STATUS.AFTER_ONBOARDING_PENDING ? (
		<div className={styles.btnContainer}>
			<ThemedButton
				width="50%"
				theme={ThemedButtonThemes.GREEN}
				loading={loading}
				className={styles.btn}
				onClick={validateTask}
			>
				Validate Task
			</ThemedButton>
		</div>
	) : (
		<div className={styles.btnContainer}>
			<div ref={dropDownRef} className={styles.phnDropDown}>
				<ThemedButton
					width="50%"
					theme={ThemedButtonThemes.GREY}
					className={styles.btn2}
					onClick={handleDropdown}
					style={{
						display: phoneNumbers.numbers?.length <= 1 ? "none" : "",
					}}
				>
					<div>
						{primaryPhone?.phone_number === lead.Account?.phone_number ? (
							<Building />
						) : primaryPhone?.is_primary ? (
							<Phone />
						) : (
							<Home />
						)}
						<p style={{ color: Colors.blackShade2 }}>{primaryPhone?.phone_number}</p>
					</div>
					<TriangleArrow
						style={{
							transform: !showDropdown ? "rotate(180deg)" : "rotate(0deg)",
							transition: "0.25s",
							color: "#394759",
						}}
					/>
				</ThemedButton>
				<div
					className={styles.dropDown}
					style={{
						display: !showDropdown || phoneNumbers.numbers?.length < 1 ? "none" : "flex",
						transition: "0.25s",
					}}
				>
					{phoneNumbers.numbers?.map(ph => (
						<div
							className={styles.dropDownItem}
							key={ph?.lpn_id}
							onClick={() => {
								setPrimaryPhone(ph);
								handleDropdown();
							}}
							style={{
								cursor: "pointer",
								backgroundColor: primaryPhone.lpn_id === ph?.lpn_id ? "#fff" : "#f5f5f5",
								border:
									primaryPhone.lpn_id === ph?.lpn_id ? "0.1px solid #5b6be1" : "0px",
							}}
						>
							<span>
								{ph.is_account ? <Building /> : ph.is_primary ? <Phone /> : <Home />}
								<p>{ph.phone_number}</p>
							</span>
							<div
								style={{
									visibility: primaryPhone.lpn_id === ph?.lpn_id ? "visible" : "hidden",
								}}
								className={styles.tick}
							>
								<Tick />
							</div>
						</div>
					))}
				</div>
			</div>
			<ThemedButton
				width="50%"
				theme={ThemedButtonThemes.GREEN}
				className={styles.btn1}
				disabled={isInsufficientData() || !!userId}
				loading={callLoading === lead.lead_id || loading}
				style={{
					boxShadow: showDropdown ? "none" : "1.2px 8.4px 24px 0px rgba(#36cdcf, 0.3)",
				}}
				onClick={() => handleCallClick(primaryPhone?.formatted_phone_number)}
				id="call-task-cta"
			>
				{ENUMS[stepName].icon.white}
				<p>{ENUMS[stepName].name[user?.language?.toUpperCase()]}</p>
			</ThemedButton>
		</div>
	);
};

export default CallTB;
