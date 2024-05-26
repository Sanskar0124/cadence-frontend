import { useState, useContext, useEffect, useCallback, useRef } from "react";
import { useRecoilValue } from "recoil";

import { MessageContext } from "@cadence-frontend/contexts";
import { userInfo } from "@cadence-frontend/atoms";
import { Image, Modal, ProgressiveImg, Skeleton } from "@cadence-frontend/components";
import {
	Label,
	ThemedButton,
	Select,
	Toggle,
	Input,
	Checkbox,
} from "@cadence-frontend/widgets";
import { ThemedButtonThemes, InputThemes } from "@cadence-frontend/themes";
import { useSubDepartments, useUsers } from "@cadence-frontend/data-access";

import { CADENCE_TYPES, ROLES } from "@cadence-frontend/constants";

import { getTextByRole, cleanRequestBody, getShareCadenceOptions } from "./utils";
import { getTeamsOptions, getUsersOptions } from "../CreateCadenceModal/utils";
import {
	Cadence as CADENCE_TRANSLATION,
	Common as COMMON_TRANSLATION,
} from "@cadence-frontend/languages";

import styles from "./ShareCadenceModal.module.scss";
import { useOutsideClickHandler } from "@cadence-frontend/utils";
import { Tick, TriangleDown } from "@cadence-frontend/icons";
import ShareCadenceList from "./components/ShareCadenceList/ShareCadenceList";
import SelectedRecipients from "./components/SelectedRecipients/SelectedRecipients";

const ShareCadenceModal = ({ modal, setModal, dataAccess }) => {
	const user = useRecoilValue(userInfo);
	const { addError, addSuccess } = useContext(MessageContext);

	const { subDepartments } = useSubDepartments(Boolean(modal));
	const { companyUsers, companyUsersLoading } = useUsers({
		users: false,
		companyUsers: Boolean(modal),
	});

	const {
		shareCadence,
		shareCadenceLoading,
		workflowsCount,
		getWorkflowsCount,
		getWorkflowsCountLoading,
		getWorkflowsCountError,
	} = dataAccess;
	const [selectedRecipients, setSelectedRecipients] = useState([]);

	const [option, setOption] = useState(CADENCE_TYPES.PERSONAL);
	const [input, setInput] = useState({
		user_id: null,
		sd_id: null,
		description: "",
		isWorkflow: false,
	});
	const elementRef = useRef(null);
	const dropdownBtnRef = useRef();

	const [isDropdown, setIsDropdown] = useState(false);

	const outsideClickCb = e => {
		if (dropdownBtnRef.current.contains(e.target)) {
			setIsDropdown(true);
			e.stopPropagation();
		} else setIsDropdown(false);
	};

	useOutsideClickHandler(elementRef, outsideClickCb);

	useEffect(() => {
		if (modal) {
			setInput({ ...modal, name: modal?.name + ` (Shared)`, user_id: null });
			setSelectedRecipients([]);
			getWorkflowsCount(modal.cadence_id);
		}
	}, [modal]);

	useEffect(() => {
		if (option) {
			setSelectedRecipients([]);
		}
	}, [option]);

	const handleClose = () => {
		setModal(null);
	};

	const renderComponent = useCallback(() => {
		switch (option) {
			case CADENCE_TYPES.PERSONAL:
				return (
					<div className={styles.inputGroup}>
						<Label>
							{CADENCE_TRANSLATION.GROUP_MEMBER_NAME[user?.language?.toUpperCase()]}
						</Label>
						<ShareCadenceList
							list={companyUsers}
							listLoading={companyUsersLoading}
							selectedRecipients={selectedRecipients}
							setSelectedRecipients={setSelectedRecipients}
							dropdownBtnRef={dropdownBtnRef}
							elementRef={elementRef}
							isDropdown={isDropdown}
							setIsDropdown={setIsDropdown}
							user={user}
							type={CADENCE_TYPES.PERSONAL}
						/>
						{selectedRecipients?.length > 0 && (
							<SelectedRecipients
								selectedRecipients={selectedRecipients}
								setSelectedRecipients={setSelectedRecipients}
								type={CADENCE_TYPES.PERSONAL}
							/>
						)}
					</div>
				);
			case CADENCE_TYPES.TEAM:
				return (
					<div className={styles.inputGroup}>
						<Label>
							{COMMON_TRANSLATION.SELECT_GROUP[user?.language?.toUpperCase()]}
						</Label>
						<ShareCadenceList
							list={subDepartments}
							selectedRecipients={selectedRecipients}
							setSelectedRecipients={setSelectedRecipients}
							dropdownBtnRef={dropdownBtnRef}
							elementRef={elementRef}
							isDropdown={isDropdown}
							setIsDropdown={setIsDropdown}
							user={user}
							type={CADENCE_TYPES.TEAM}
						/>
						{selectedRecipients?.length > 0 && (
							<SelectedRecipients
								selectedRecipients={selectedRecipients}
								setSelectedRecipients={setSelectedRecipients}
								type={CADENCE_TYPES.TEAM}
							/>
						)}
					</div>
				);
			default:
				return null;
		}
	}, [option, companyUsers, subDepartments, isDropdown, selectedRecipients, user]);

	const handleSubmit = () => {
		if (input.name?.trim().length === 0) {
			return addError({ text: "Please enter cadence name." });
		}
		if (option === CADENCE_TYPES.PERSONAL && selectedRecipients?.length === 0) {
			return addError({ text: "Please select a group member." });
		}
		if (option === CADENCE_TYPES.TEAM && selectedRecipients?.length === 0) {
			return addError({ text: "Please select a group." });
		}
		if (input.description?.trim() && input.description?.trim().length > 1000) {
			return addError({ text: "Please Enter description below 1000 characters." });
		}

		const body = {
			...input,
			type: option,
			user_ids:
				option === CADENCE_TYPES.TEAM || option === CADENCE_TYPES.COMPANY
					? null
					: selectedRecipients?.map(user => user?.user_id),
			sd_ids:
				option === CADENCE_TYPES.PERSONAL || option === CADENCE_TYPES.COMPANY
					? null
					: selectedRecipients?.map(sd => sd?.sd_id),
			company_id: option === CADENCE_TYPES.COMPANY ? user.company_id : null,
			is_workflow: input?.isWorkflow ?? false,
			description: input.description?.trim() ?? "",
		};

		shareCadence(cleanRequestBody(body), {
			onError: err => {
				addError({
					text: err?.response?.data?.msg,
					desc: err?.response?.data?.error,
					cId: err?.response?.data?.correlationId,
				});
			},
			onSuccess: () => {
				addSuccess("Cadence shared");
				handleClose();
			},
		});
	};

	useEffect(() => {
		if (input.description?.trim().length >= 1001) {
			return addError({ text: "Please Enter description below 1000 characters." });
		}
	}, [input.description]);

	return (
		<Modal isModal={modal} onClose={handleClose} showCloseButton>
			<div className={styles.modal}>
				<div className={styles.header}>
					<h3>{CADENCE_TRANSLATION.SHARE_CADENCE[user?.language?.toUpperCase()]}</h3>
				</div>
				<p className={styles.text}>{getTextByRole(user?.role)}</p>
				<div className={styles.main}>
					<div className={styles.inputGroup}>
						<Label>
							{CADENCE_TRANSLATION.CADENCE_TYPE[user?.language?.toUpperCase()]}
						</Label>
						<Select
							value={option}
							setValue={setOption}
							options={getShareCadenceOptions(user?.role, modal?.type, user?.language)}
						/>
					</div>
					<div className={styles.inputGroup}>
						<Label>
							{CADENCE_TRANSLATION.CADENCE_NAME[user?.language?.toUpperCase()]}
						</Label>
						<Input
							value={input}
							setValue={setInput}
							name="name"
							theme={InputThemes.WHITE}
							className={styles.input}
						/>
					</div>
					{renderComponent()}
				</div>

				<div className={styles.inputGroup}>
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
						style={{ height: "150px" }}
					/>
					{input.description?.trim() && (
						<div
							className={styles.wordCounter}
							style={{ textAlign: "right", color: "#567191" }}
						>
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
				{getWorkflowsCountLoading ? (
					<Skeleton />
				) : workflowsCount?.workFlowCount > 0 ? (
					<div className={styles.shareWorkflowPrompt}>
						<Checkbox
							checked={input.isWorkflow}
							onChange={() =>
								setInput(prev => ({
									...prev,
									isWorkflow: !input?.isWorkflow,
								}))
							}
						/>
						<span>Share Workflows with Cadence</span>
					</div>
				) : null}

				<div className={styles.footer}>
					<ThemedButton
						className={styles.btn}
						theme={ThemedButtonThemes.PRIMARY}
						loading={shareCadenceLoading}
						onClick={handleSubmit}
					>
						{CADENCE_TRANSLATION.SHARE_CADENCE[user?.language?.toUpperCase()]}
					</ThemedButton>
				</div>
			</div>
		</Modal>
	);
};

export default ShareCadenceModal;
