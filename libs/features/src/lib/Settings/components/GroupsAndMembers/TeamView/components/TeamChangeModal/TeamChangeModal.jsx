import { useContext, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";

import { Div, Image, Modal } from "@cadence-frontend/components";
import { userInfo } from "@cadence-frontend/atoms";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import {
	BackButton,
	InputRadio,
	Label,
	Select,
	ThemedButton,
} from "@cadence-frontend/widgets";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { ErrorGradient, InfoCircleGradient2 } from "@cadence-frontend/icons";
import { useSubDepartment, useSubDepartments } from "@cadence-frontend/data-access";
import { MessageContext } from "@cadence-frontend/contexts";

import SelectCadence from "./components/SelectCadence/SelectCadence";

import styles from "./TeamChangeModal.module.scss";
import {
	ACTION_MSG,
	ALL_ROLES,
	TEAM_CHANGE_ACTIONS,
	TEAM_CHANGE_OPTIONS,
} from "../constants";
import { INTEGRATION_TYPE } from "@cadence-frontend/constants";

const TeamChangeModal = ({ modal, setModal, teamId, memberInfo }) => {
	//Data from resoil
	const user = useRecoilValue(userInfo);

	//States
	const [input, setInput] = useState({
		sd_id: "",
		lead_option: "",
		cadence_id: "",
	});
	const [teamOptions, setTeamOptions] = useState([]);
	const [count, setCount] = useState({});

	//API
	const { subDepartments, changeTeam, changeTeamLoading, countInfo, countInfoLoading } =
		useSubDepartments(true, false);
	const { refetchUsers } = useSubDepartment(memberInfo?.sd_id, true);

	//Context
	const { addError, addSuccess } = useContext(MessageContext);

	//Functions
	const handleClose = () => {
		window.onmousedown = null;
		setInput({
			sd_id: "",
			lead_option: "",
			cadence_id: "",
		});
		setModal(false);
	};

	const handleTeamChange = () => {
		if (input?.lead_option === TEAM_CHANGE_OPTIONS.MOVE && !input?.cadence_id) {
			return addError({ text: "Select a cadence" });
		}
		if (!input?.sd_id) {
			return addError({ text: "Select another team" });
		}

		let body = {
			user_id: memberInfo?.user_id,
			sd_id: input.sd_id,
			lead_option: input.lead_option,
			...(input.lead_option === TEAM_CHANGE_OPTIONS.MOVE && {
				cadence_id: input.cadence_id,
			}),
		};

		changeTeam(body, {
			onSuccess: () => {
				addSuccess("Team Changed Successfully");
				handleClose();
				refetchUsers();
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

	//To filter the current team option from team options available
	useEffect(() => {
		if (subDepartments && teamId) {
			setTeamOptions(
				subDepartments
					?.filter(sd => sd.sd_id !== teamId && sd.name !== "Admin")
					?.map(sd => ({ label: sd.name, value: sd.sd_id }))
			);
		}
	}, [subDepartments, teamId]);

	useEffect(() => {
		if (memberInfo) {
			countInfo(memberInfo?.user_id, {
				onSuccess: data => {
					handleCount(data?.data);
				},
				onError: err => {
					addError({
						text: err?.response?.data?.msg,
						desc: err?.response?.data?.error,
						cId: err?.response?.data?.correlationId,
					});
				},
			});
		}
	}, [memberInfo]);

	const handleCount = data => {
		const leadContainingIntegrations = [
			INTEGRATION_TYPE.SALESFORCE,
			INTEGRATION_TYPE.DYNAMICS,
			INTEGRATION_TYPE.ZOHO,
			INTEGRATION_TYPE.SHEETS,
			INTEGRATION_TYPE.BULLHORN,
		];
		const contactContainingIntegrations = [
			INTEGRATION_TYPE.SALESFORCE,
			INTEGRATION_TYPE.DYNAMICS,
			INTEGRATION_TYPE.ZOHO,
			INTEGRATION_TYPE.BULLHORN,
			INTEGRATION_TYPE.HUBSPOT,
			INTEGRATION_TYPE.SELLSY,
		];
		setCount({
			...(leadContainingIntegrations.includes(user?.integration_type) && {
				lead: data?.leadCount,
			}),
			...(contactContainingIntegrations.includes(user?.integration_type) && {
				contact: data?.contactCount,
			}),
			...(user?.integration_type === INTEGRATION_TYPE.BULLHORN && {
				candidate: data?.candidateCount,
			}),
			...(user?.integration_type === INTEGRATION_TYPE.PIPEDRIVE && {
				person: data?.personCount,
			}),
		});
	};
	return (
		<Modal
			isModal={modal}
			className={styles.teamChangeModal}
			onClose={handleClose}
			showCloseButton
		>
			<div className={styles.heading}>
				{TEAM_CHANGE_OPTIONS.MOVE === input.lead_option ? (
					<BackButton
						text={"Back"}
						onClick={() => {
							setInput(prev => ({ ...prev, lead_option: "" }));
						}}
					/>
				) : (
					<h3>{COMMON_TRANSLATION.TEAM_CHANGE[user?.language?.toUpperCase()]}</h3>
				)}
			</div>
			{TEAM_CHANGE_OPTIONS.MOVE === input.lead_option ? (
				<SelectCadence input={input} setInput={setInput} memberInfo={memberInfo} />
			) : (
				<div className={styles.body}>
					<div className={styles.memberBox}>
						<Label>Member name</Label>
						<div className={styles.member}>
							<div className={styles.memberDetails}>
								<Image
									src={
										memberInfo?.is_profile_picture_present
											? memberInfo?.profile_picture
											: "https://cdn.ringover.com/img/users/default.jpg"
									}
									className={styles.image}
								/>
								<div className={styles.roleAndName}>
									<div className={styles.name}>
										{" "}
										{`${memberInfo?.first_name} ${memberInfo?.last_name}`}
									</div>
									<div className={styles.role}>{`${ALL_ROLES[memberInfo?.role]}, ${
										memberInfo?.Sub_Department?.name
									}`}</div>
								</div>
							</div>
							<div className={styles.count}>
								{countInfoLoading ? (
									<Div loading={countInfoLoading} className={styles.countLeads}></Div>
								) : (
									Object.keys(count)?.map(type => (
										<Div loading={countInfoLoading} className={styles.countLeads}>
											{`${count[type]} ${type}${count[type] > 1 ? "s" : ""}`}
										</Div>
									))
								)}
							</div>
						</div>
					</div>
					<div className={styles.teamBox}>
						<Label>Select new team</Label>
						<Select
							options={teamOptions}
							value={input}
							setValue={setInput}
							name="sd_id"
							numberOfOptionsVisible="3"
							placeholder={COMMON_TRANSLATION.SELECT_HERE[user?.language?.toUpperCase()]}
							borderColor={"#DADCE0"}
							borderRadius={15}
							width={"50%"}
							height={"48px"}
						/>
					</div>
					<div className={styles.actionBox}>
						<Label>Select action for leads and contacts</Label>
						<div className={styles.actions}>
							{TEAM_CHANGE_ACTIONS.map(action => (
								<div className={styles.optionBox}>
									<InputRadio
										checked={action.value === input.lead_option}
										onChange={() =>
											setInput(prev => ({ ...prev, lead_option: action.value }))
										}
										className={styles.radio}
									/>
									<div className={styles.option}>{action.label}</div>
								</div>
							))}
						</div>
					</div>
				</div>
			)}
			{TEAM_CHANGE_OPTIONS.MOVE === input.lead_option &&
			user?.integration_type === INTEGRATION_TYPE.SHEETS ? (
				<div className={`${styles.warning} ${styles.unlink}`}>
					<div className={styles.icon}>
						<InfoCircleGradient2 size={"20px"} />
					</div>
					<div className={styles.msg}>{ACTION_MSG.MOVE}</div>
				</div>
			) : TEAM_CHANGE_OPTIONS.UNLINK === input.lead_option ? (
				<div className={`${styles.warning} ${styles.unlink}`}>
					<div className={styles.icon}>
						<InfoCircleGradient2 size={"20px"} />
					</div>
					<div className={styles.msg}>{ACTION_MSG.UNLINK}</div>
				</div>
			) : TEAM_CHANGE_OPTIONS.REMOVE === input.lead_option ? (
				<div className={`${styles.warning} ${styles.remove}`}>
					<div className={styles.icon}>
						<ErrorGradient size={"20px"} />
					</div>
					<div className={styles.msg}>{ACTION_MSG.REMOVE}</div>
				</div>
			) : null}

			<ThemedButton
				theme={ThemedButtonThemes.PRIMARY}
				disabled={!input.lead_option}
				onClick={handleTeamChange}
				className={styles.btn}
				loading={changeTeamLoading}
			>
				<div>Confirm team change</div>
			</ThemedButton>
		</Modal>
	);
};

export default TeamChangeModal;
