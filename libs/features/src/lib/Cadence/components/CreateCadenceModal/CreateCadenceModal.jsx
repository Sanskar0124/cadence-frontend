/* eslint-disable no-console */
import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment-timezone";
import { MessageContext } from "@cadence-frontend/contexts";
import { Modal } from "@cadence-frontend/components";
import {
	Input,
	Label,
	ThemedButton,
	Select,
	Toggle,
	InputDate,
	InputTime,
	CollapseContainer,
} from "@cadence-frontend/widgets";
import { InputThemes, ThemedButtonThemes } from "@cadence-frontend/themes";
import { getTypeOptions, showTeamOptions, getTeamsOptions } from "./utils";

import { INTEGRATION_TYPE, ROLES } from "@cadence-frontend/constants";
import {
	PRIORITY_OPTIONS,
	TAG_OPTIONS,
	INTEGRATION_OPTIONS,
	defaultPauseStateFields,
} from "./constants";
import {
	CADENCE_INTEGRATIONS,
	CADENCE_TAGS,
	CADENCE_TYPES,
	CREATE_CADENCE_ERRORS,
} from "../../constants";

import styles from "./CreateCadenceModal.module.scss";
import { useSubDepartments, useUser } from "@cadence-frontend/data-access";

import { IntegrationExpiredIMC } from "@cadence-frontend/widgets";
import {
	Cadence as CADENCE_TRANSLATION,
	Common as COMMON_TRANSLATION,
} from "@cadence-frontend/languages";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";

const CreateCadenceModal = ({ modal, setModal, dataAccess }) => {
	const { user } = useUser({ user: true });
	const user_info = useRecoilValue(userInfo);
	const [pauseTime, setPauseTime] = useState(defaultPauseStateFields);
	const [checked, setChecked] = useState(false);
	const [input, setInput] = useState({
		type: null,
		name: "",
		tags: [{ tag_name: "outbound" }],
		priority: "high",
		inside_sales: "0",
		integration_type: user_info?.integration_type,
		remove_if_reply: false,
		remove_if_bounce: false,
		user_id: null,
		sd_id: null,
		company_id: null,
		description: "",
	});
	const [error, setError] = useState(null);

	const { subDepartments } = useSubDepartments(
		modal && showTeamOptions(input.type, user?.role)
	);

	// const advancedRef = useRef();
	const { createCadence, createCadenceLoading } = dataAccess;

	const { addError } = useContext(MessageContext);

	const navigate = useNavigate();

	// const [showAdvanced, setShowAdvanced] = useState(false);

	useEffect(() => {
		if (modal) {
			setInput(prev => ({
				...prev,
				user_id: user?.user_id,
			}));
			setError(null);
		}
	}, [modal]);

	useEffect(() => {
		if (input.description.trim().length <= 100) setError(null);
	}, [input]);

	useEffect(() => {
		if (input.type === CADENCE_TYPES.COMPANY) {
			setInput(prev => ({ ...prev, company_id: user?.company_id }));
		} else {
			setInput(prev => ({ ...prev, company_id: null }));
		}

		if (input.type === CADENCE_TYPES.TEAM && user?.role === ROLES.SALES_MANAGER) {
			setInput(prev => ({ ...prev, sd_id: user?.sd_id }));
		} else {
			setInput(prev => ({ ...prev, sd_id: null }));
		}
	}, [input.type]);

	const handleClose = () => {
		setModal(false);
		setInput({
			type: null,
			name: "",
			tags: [{ tag_name: "outbound" }],
			priority: "high",
			inside_sales: "0",
			integration_type: user_info?.integration_type,
			remove_if_reply: false,
			remove_if_bounce: false,
			user_id: null,
			sd_id: null,
			company_id: null,
			description: "",
		});
	};

	const handleSubmit = () => {
		if (!input.name.trim() || !input.type || !input.integration_type) {
			if (!input.name.trim()) setError(CREATE_CADENCE_ERRORS.CADENCE_NAME);
			else if (!input.type) setError(CREATE_CADENCE_ERRORS.CADENCE_TYPE);
			addError({ text: "Missing required Fields" });
			return;
		}

		if (showTeamOptions(input.type, user?.role) && !input.sd_id) {
			setError(CREATE_CADENCE_ERRORS.CADENCE_SD_ID);
			return addError({ text: "Group not selected" });
		}

		if (input.description.trim() && input.description.trim().length > 100) {
			setError(CREATE_CADENCE_ERRORS.CADENCE_DESC);
			return addError({ text: "Please Enter description below 100 characters." });
		}

		// if (input.description.trim() === "") {
		// 	return addError("Missing required Fields");
		// }

		const body = {
			type: input.type,
			tags: input.tags,
			priority: input.priority,
			inside_sales: input.inside_sales,
			integration_type: input.integration_type,
			remove_if_reply: input.remove_if_reply,
			remove_if_bounce: input.remove_if_bounce,
			user_id: input.user_id,
			sd_id: input.sd_id,
			company_id: input.company_id,
			name: input.name.trim(),
			scheduled: checked,
			...(input.description.trim().length && { description: input.description.trim() }),
		};

		const unixPauseTime = new Date([
			pauseTime.YYYY,
			pauseTime.MM,
			pauseTime.DD,
			pauseTime.time,
		]).getTime();

		if (!(/^\d/.test(unixPauseTime) && new Date() <= unixPauseTime) && checked)
			return addError({ text: "Invalid Time" });

		if (checked) body["launch_at"] = unixPauseTime;

		createCadence(body, {
			onSuccess: data => {
				navigate(`/cadence/${data?.cadence_id}`);
			},
			onError: err => {
				addError({
					text: err?.response?.data?.msg,
					desc: err?.response?.data?.error,
					cId: err?.response?.data?.correlationId,
				});
			},
		});
	};

	const onUpdate = e => {
		setChecked(e.target.checked);
	};

	useEffect(() => {
		if (input.description.trim().length >= 1001) {
			setError(CREATE_CADENCE_ERRORS.CADENCE_DESC);
			return addError({ text: "Please Enter description below 100 characters." });
		} else if (error === CREATE_CADENCE_ERRORS.CADENCE_DESC) {
			setError(null);
		}
	}, [input.description]);

	return (
		<Modal isModal={modal} onClose={handleClose} showCloseButton>
			{(user_info?.integration_type !== INTEGRATION_TYPE.GOOGLE_SHEETS &&
				user_info?.integration_type !== INTEGRATION_TYPE.EXCEL &&
				user_info?.integration_type !== INTEGRATION_TYPE.SHEETS &&
				user?.Integration_Token?.is_logged_out) ??
			true ? ( // should be true when Integration_Token is null
				<IntegrationExpiredIMC setModal={setModal} />
			) : (
				<div className={styles.createCadenceModal}>
					<div className={styles.heading}>
						<h3>{CADENCE_TRANSLATION.SET_UP_CADENCE[user?.language?.toUpperCase()]}</h3>
					</div>
					<div className={styles.main}>
						<div
							className={`${styles.inputGroup} ${
								error === CREATE_CADENCE_ERRORS.CADENCE_NAME ? styles.error : ""
							}`}
						>
							<Label required>
								{CADENCE_TRANSLATION.CADENCE_NAME[user?.language?.toUpperCase()]}
							</Label>
							<Input
								value={input}
								setValue={setInput}
								name="name"
								theme={InputThemes.WHITE}
								className={styles.input}
								placeholder={CADENCE_TRANSLATION.TYPE_HERE[user?.language?.toUpperCase()]}
							/>
						</div>
						<div
							className={`${styles.inputGroup} ${
								error === CREATE_CADENCE_ERRORS.CADENCE_TYPE ? styles.error : ""
							}`}
						>
							<Label required>
								{CADENCE_TRANSLATION.CADENCE_TYPE[user?.language?.toUpperCase()]}
							</Label>
							<Select
								options={getTypeOptions(user?.role, user?.language)}
								placeholder={COMMON_TRANSLATION.SELECT[user?.language?.toUpperCase()]}
								value={input}
								setValue={setInput}
								name="type"
								height="44px"
								numberOfOptionsVisible="4"
							/>
						</div>

						{showTeamOptions(input.type, user?.role) && (
							<div
								className={`${styles.inputGroup} ${
									error === CREATE_CADENCE_ERRORS.CADENCE_SD_ID ? styles.error : ""
								}`}
							>
								<Label>{CADENCE_TRANSLATION.GROUP[user?.language?.toUpperCase()]}</Label>
								<Select
									options={getTeamsOptions(subDepartments)}
									placeholder={COMMON_TRANSLATION.SELECT[user?.language?.toUpperCase()]}
									value={input}
									setValue={setInput}
									name="sd_id"
									height="44px"
									isSearchable
									numberOfOptionsVisible="4"
								/>
							</div>
						)}

						<div
							className={`${styles.inputGroup} ${
								error === CREATE_CADENCE_ERRORS.CADENCE_DESC ? styles.error : ""
							}`}
						>
							<Label>
								{CADENCE_TRANSLATION.CADENCE_DESCRIPTION[user?.language?.toUpperCase()]}
							</Label>

							<Input
								type="textarea"
								placeholder={
									CADENCE_TRANSLATION.ADD_A_QUICK_NOTE[user?.language?.toUpperCase()]
								}
								className={styles.inputDescription}
								value={input.description}
								setValue={val => setInput(prev => ({ ...prev, description: val }))}
							/>
							{input.description.trim() && (
								<div className={styles.wordCounter}>
									<span
										style={
											input.description.length <= 1000
												? { color: "#567191" }
												: { color: "#f77272" }
										}
									>
										{input.description?.trim().length}
									</span>
									/1000
								</div>
							)}
						</div>

						{/* <div className={`${styles.inputGroup} ${styles.launchCadence}`}>
							<p className={styles.launchTitle}>Schedule launch for cadence</p>
							<Toggle theme="PURPLE" checked={checked} onChange={onUpdate} />
						</div> */}

						{/* {checked ? (
							<CollapseContainer
								title={
									<div className={styles.titleSelector + " " + styles.headText}>
										Cadence launch scheduled for
									</div>
								}
								className={styles.collapseContainer}
							>
								<div className={styles.duration}>
									<div className={styles.scheduleGroup}>
										<Label className={styles.label}>Date</Label>
										<InputDate
											value={pauseTime}
											aheadOfDate={true}
											setValue={setPauseTime}
											numberOfOptionsVisible={"3"}
											style={{
												width: "95%",
												margin: "auto",
											}}
										/>
									</div>
									<div className={styles.scheduleGroup}>
										<Label className={styles.label}>Time</Label>
										<InputTime
											input={pauseTime}
											name="time"
											setInput={setPauseTime}
											theme={InputThemes.WHITE}
											type="select"
											justify="left"
											style={{ padding: "0 20px", paddingBottom: "10px" }}
											className={styles.inputTime}
										/>
									</div>
								</div>
							</CollapseContainer>
						) : (
							""
						)} */}
					</div>
					<div className={styles.footer}>
						<ThemedButton
							className={styles.createBtn}
							theme={ThemedButtonThemes.PRIMARY}
							onClick={handleSubmit}
							loading={createCadenceLoading}
							// disabled={input?.name.trim().length === 0}
						>
							{CADENCE_TRANSLATION.CREATE_NEW_CADENCE[user?.language?.toUpperCase()]}
						</ThemedButton>
					</div>
				</div>
			)}
		</Modal>
	);
};

export default CreateCadenceModal;
