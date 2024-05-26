import React, { useState, useContext, useEffect } from "react";
import { useSubDepartmentUser } from "@cadence-frontend/data-access";
import { MessageContext } from "@cadence-frontend/contexts";

import styles from "./EditMemberModal.module.scss";
import { InputThemes, ThemedButtonThemes } from "@cadence-frontend/themes";
import { Label, Input, Select, ThemedButton } from "@cadence-frontend/widgets";
import { Modal } from "@cadence-frontend/components";

import { ADMIN_ROLES, getIntegrationIdLabel, OTHER_ROLES } from "../constants";
import { RINGOVER_USER_ID_BASE, ROLES } from "@cadence-frontend/constants";
import { Tasks as TASKS_TRANSLATION } from "@cadence-frontend/languages";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilState } from "recoil";
import { Salesforce as SALESFORCE_TRANSLATION } from "@cadence-frontend/languages";
import { isPositiveInteger } from "@cadence-frontend/utils";

import SuperAdminModal from "../SuperAdminModal/SuperAdminModal";

const EditMemberModal = ({ modal, setModal, memberInfo, teamId, sdName }) => {
	const { updateUser: updateMember, updateUserLoading: updateMemberLoading } =
		useSubDepartmentUser({}, teamId);
	const { addError, addSuccess } = useContext(MessageContext);
	const [user, setUser] = useRecoilState(userInfo);

	const [input, setInput] = useState({
		first_name: "",
		last_name: "",
		role: "sales_manager",
		email: "",
		ringover_user_id: "",
		integration_id: "",
		ringover_api_key: "",
	});
	const [roleSelect, setRoleSelect] = useState(false);
	const [superAdminModal, setSuperAdminModal] = useState(false);

	useEffect(() => {
		if (memberInfo && modal) {
			const {
				first_name,
				last_name,
				role,
				email,
				ringover_user_id,
				integration_id,
				User_Token: { ringover_api_key },
			} = memberInfo;

			if (first_name) setInput(prevState => ({ ...prevState, first_name }));
			if (last_name) setInput(prevState => ({ ...prevState, last_name }));
			if (role) setInput(prevState => ({ ...prevState, role }));
			if (email) setInput(prevState => ({ ...prevState, email }));
			if (ringover_user_id)
				setInput(prevState => ({
					...prevState,
					ringover_user_id: parseInt(ringover_user_id) + RINGOVER_USER_ID_BASE,
				}));
			if (integration_id) setInput(prevState => ({ ...prevState, integration_id }));
			if (ringover_api_key) setInput(prevState => ({ ...prevState, ringover_api_key }));
		}
	}, [memberInfo, modal]);

	useEffect(() => {
		if (memberInfo && input.role) {
			if (roleSelect && input.role === ROLES.SUPER_ADMIN) setSuperAdminModal(true);
			setRoleSelect(true);
		}
	}, [input.role]);

	const handleClose = () => {
		setModal(false);
		setInput({
			first_name: "",
			last_name: "",
			role: null,
			email: "",
			ringover_user_id: "",
			ringover_api_key: "",
			integration_id: "",
		});
		setRoleSelect(false);
	};

	const handleSubmit = e => {
		e.preventDefault();
		if (input.first_name?.trim() === "") {
			addError({ text: "First name is required!" });
			return;
		}
		if (input.last_name?.trim() === "") {
			addError({ text: "Last name is required!" });
			return;
		}
		if (input.role === null) {
			addError({ text: "Role is required!" });
			return;
		}
		if (input.email?.trim() === "") {
			addError({ text: "Email Id is required!" });
			return;
		}
		if (!input.ringover_user_id) {
			addError({ text: "Ringover User Id is required!" });
			return;
		}
		if (!isPositiveInteger(input.ringover_user_id)) {
			addError({
				text: "Ringover User ID is not correct",
				desc: "Make sure your User ID is an integer",
			});
			return;
		}
		if (parseInt(input.ringover_user_id) < RINGOVER_USER_ID_BASE) {
			addError({ text: "Ringover User Id is not correct" });
			return;
		}

		let body = {
			...input,
			ringover_user_id: input.ringover_user_id
				? parseInt(input.ringover_user_id) - RINGOVER_USER_ID_BASE
				: null,
			ringover_api_key: input.ringover_api_key.length ? input.ringover_api_key : null,
		};

		delete body.integration_id;

		updateMember(
			{ ...body, user_id: memberInfo?.user_id },
			{
				onError: err => {
					addError({
						text: err.response?.data?.msg ?? "Failed to update member details!",
						desc: err?.response?.data?.error ?? "Please contact support",
						cId: err?.response?.data?.correlationId,
					});
				},
				onSuccess: () => {
					if (memberInfo.role === ROLES.ADMIN && input.role === ROLES.SUPER_ADMIN)
						setUser({ ...user, role: ROLES.ADMIN });
					addSuccess("Member details updated successfully");
					handleClose();
				},
			}
		);
	};

	return (
		<Modal
			isModal={modal}
			className={styles.newMemberModal}
			onClose={handleClose}
			showCloseButton
			disableOutsideClick
		>
			<div className={styles.heading}>
				<h3>
					{memberInfo
						? TASKS_TRANSLATION.EDIT_MEMBER_DETAILS[user?.language?.toUpperCase()]
						: TASKS_TRANSLATION.NEW_MEMBER_DETAILS[user?.language?.toUpperCase()]}
				</h3>
			</div>
			<div className={styles.main}>
				<div className={styles.inputGroup}>
					<Label required>
						{TASKS_TRANSLATION.FIRST_NAME[user?.language?.toUpperCase()]}
					</Label>
					<Input
						name="first_name"
						value={input}
						setValue={setInput}
						className={styles.input}
						placeholder="Type here"
						theme={InputThemes.WHITE_WITH_GREY_BORDER}
					/>
				</div>

				<div className={styles.inputGroup}>
					<Label required>
						{COMMON_TRANSLATION.LAST_NAME[user?.language?.toUpperCase()]}
					</Label>
					<Input
						name="last_name"
						value={input}
						setValue={setInput}
						className={styles.input}
						placeholder="Type here"
						theme={InputThemes.WHITE_WITH_GREY_BORDER}
					/>
				</div>

				<div className={styles.inputGroup}>
					<Label required>
						{COMMON_TRANSLATION.ROLE_ASSIGNED[user?.language?.toUpperCase()]}
					</Label>
					<Select
						name="role"
						value={input}
						setValue={setInput}
						options={
							sdName === "Admin"
								? ADMIN_ROLES.map(opt => ({
										label: opt.label[user?.language?.toUpperCase()],
										value: opt.value,
										// isDisabled: opt.isDisabled ?? false,
								  }))
								: Object.keys(OTHER_ROLES).map(key => ({
										label: OTHER_ROLES[key][user?.language?.toUpperCase()],
										value: key,
								  }))
						}
						borderRadius={15}
						borderColor="#DADCE0"
						disabled={
							user?.role !== ROLES.SUPER_ADMIN || memberInfo?.role === ROLES.SUPER_ADMIN
						}
					/>
				</div>

				<div className={styles.inputGroup}>
					<Label required>
						{COMMON_TRANSLATION?.EMAIL[user?.language?.toUpperCase()]}
					</Label>
					<Input
						name="email"
						type="email"
						value={input}
						setValue={setInput}
						className={styles.input}
						placeholder="Type here"
						theme={InputThemes.WHITE_WITH_GREY_BORDER}
					/>
				</div>

				<div className={styles.inputGroup}>
					<Label required>
						{COMMON_TRANSLATION.RINGOVER_ID[user?.language?.toUpperCase()]}
					</Label>
					<Input
						name="ringover_user_id"
						value={input}
						setValue={setInput}
						className={styles.input}
						placeholder="Type here"
						theme={InputThemes.WHITE_WITH_GREY_BORDER}
						disabled
					/>
				</div>

				<div className={styles.inputGroup}>
					<Label>
						{COMMON_TRANSLATION.RINGOVER_API_KEY[user?.language?.toUpperCase()]}
					</Label>
					<Input
						name="ringover_api_key"
						value={input}
						setValue={setInput}
						className={styles.input}
						placeholder="Type here"
						theme={InputThemes.WHITE_WITH_GREY_BORDER}
					/>
				</div>

				{input.integration_id && (
					<div className={styles.inputGroup}>
						<Label>{getIntegrationIdLabel(user.integration_type)}</Label>
						<Input
							name="integration_id"
							value={input}
							setValue={setInput}
							className={styles.input}
							placeholder="Type here"
							theme={InputThemes.WHITE_WITH_GREY_BORDER}
							disabled
						/>
					</div>
				)}
			</div>
			<div className={styles.footer}>
				<ThemedButton
					className={styles.saveBtn}
					theme={ThemedButtonThemes.PRIMARY}
					onClick={handleSubmit}
					loading={updateMemberLoading}
				>
					<div>{COMMON_TRANSLATION.SAVE_CHANGES[user?.language?.toUpperCase()]}</div>
				</ThemedButton>
			</div>
			<SuperAdminModal
				modal={superAdminModal}
				setModal={setSuperAdminModal}
				setInput={setInput}
			/>
		</Modal>
	);
};

export default EditMemberModal;
