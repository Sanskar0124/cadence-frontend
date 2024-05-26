import { MessageContext } from "@cadence-frontend/contexts";
import { useSubDepartmentUser } from "@cadence-frontend/data-access";
import { useContext, useEffect, useRef, useState } from "react";
import { components } from "react-select";

import { Image, Modal, Skeleton } from "@cadence-frontend/components";
import {
	NoActivities2,
	SmallArrowDown,
	Tick,
	TriangleDown,
} from "@cadence-frontend/icons";
import { Profile as PROFILE_TRANSLATION } from "@cadence-frontend/languages";
import { InputThemes, ThemedButtonThemes } from "@cadence-frontend/themes";
import { Colors, useOutsideClickHandler } from "@cadence-frontend/utils";
import { Input, Label, Select, ThemedButton } from "@cadence-frontend/widgets";
import styles from "./NewMembersModal.module.scss";

import { userInfo } from "@cadence-frontend/atoms";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import { themeStyles } from "@cadence-frontend/widgets";
import TimezoneSelect from "react-timezone-select";
import { useRecoilValue } from "recoil";
import { ADMIN_ROLES, OTHER_ROLES } from "../constants";
import { RINGOVER_USER_ID_BASE } from "@cadence-frontend/constants";

const NewMembersModal = ({ modal, setModal, teamId, sdName }) => {
	const selectMemberRef = useRef(null);
	const { roundedStyles } = themeStyles({ menuOnTop: true });
	const {
		addUser: addMember,
		addUserLoading: addMemberLoading,
		ringoverUsers,
		ringoverUsersLoading,
	} = useSubDepartmentUser({ ringoverUsers: modal }, teamId);
	const { addError, addSuccess } = useContext(MessageContext);
	const user = useRecoilValue(userInfo);

	const [input, setInput] = useState({
		first_name: "",
		last_name: "",
		role: null,
		email: "",
		ringover_user_id: null,
		ringover_api_key: null,
		timezone: "",
	});
	const [membersDropdown, setMembersDropdown] = useState(false);
	const [membersSearch, setMembersSearch] = useState("");

	useOutsideClickHandler(selectMemberRef, () => setMembersDropdown(false));

	const handleClose = () => {
		setModal(false);
		setInput({
			first_name: "",
			last_name: "",
			role: null,
			email: "",
			ringover_user_id: null,
			ringover_api_key: null,
			timezone: "",
		});
	};

	const handleSubmit = e => {
		e.preventDefault();
		if (input.ringover_user_id === null) {
			addError({ text: "Please select a member!" });
			return;
		}
		if (input.role === null) {
			addError({ text: "Role is required!" });
			return;
		}
		if (input.email.trim() === "") {
			addError({ text: "Email Id is required!" });
			return;
		}
		if (input.timezone.trim() === "") {
			addError({ text: "Timezone is required!" });
			return;
		}
		let body = {
			...input,
			ringover_user_id: input.ringover_user_id ? parseInt(input.ringover_user_id) : null,
			ringover_api_key: input.ringover_api_key?.length ? input.ringover_api_key : null,
		};

		addMember(body, {
			onError: err => {
				addError({
					text: err.response?.data?.msg ?? "Some error occured while adding member!",
					desc: err?.response?.data?.error ?? "Please contact support",
					cId: err?.response?.data?.correlationId,
				});
			},
			onSuccess: () => {
				addSuccess("Member added successfully");
				handleClose();
			},
		});
	};

	const DropdownIndicator = props => {
		return (
			<components.DropdownIndicator {...props}>
				<TriangleDown color={Colors.lightBlue} />
			</components.DropdownIndicator>
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
				<h3>{COMMON_TRANSLATION.NEW_MEMBERS[user?.language?.toUpperCase()]}</h3>
			</div>
			<div className={styles.main}>
				<div className={styles.inputGroup}>
					<Label required>
						{COMMON_TRANSLATION.SELECT_MEMBER[user?.language?.toUpperCase()]}
					</Label>
					<div
						className={`${styles.selectMember} ${membersDropdown ? styles.isActive : ""}`}
						onClick={() => setMembersDropdown(prev => !prev)}
						ref={selectMemberRef}
					>
						<Input
							value={membersSearch}
							setValue={setMembersSearch}
							theme={InputThemes.TRANSPARENT}
							placeholder={
								ringoverUsersLoading
									? "Loading..."
									: ringoverUsers?.find(user => user.id === input.ringover_user_id)
									? ringoverUsers?.find(user => user.id === input.ringover_user_id)
											?.concat_name
									: "Select here"
							}
							className={input.ringover_user_id ? styles.selected : ""}
						/>

						<div className={styles.dropdownIcon}>
							<SmallArrowDown />
						</div>
						<div className={styles.usersList}>
							{ringoverUsersLoading ? (
								<Placeholder />
							) : ringoverUsers?.filter(user =>
									user.concat_name.toLowerCase().includes(membersSearch.toLowerCase())
							  ).length > 0 ? (
								ringoverUsers
									?.filter(user =>
										user.concat_name.toLowerCase().includes(membersSearch.toLowerCase())
									)
									?.map(user => (
										<div
											key={user.id}
											onClick={() => {
												setInput(prev => ({
													...prev,
													first_name: user?.first_name,
													last_name: user?.last_name,
													ringover_user_id: user?.id,
													email: user?.email,
												}));
												setMembersSearch("");
											}}
											className={`${
												input.ringover_user_id === user.id ? styles.selected : ""
											}`}
										>
											<div className={styles.info}>
												<Image
													src={user.profile_picture.replace(
														"v2/public/download/types/",
														""
													)}
												/>
												<div>
													<span>{user.concat_name}</span>
													<span>#{user.id + RINGOVER_USER_ID_BASE}</span>
												</div>
											</div>
											<div className={styles.tick}>
												<Tick />
											</div>
										</div>
									))
							) : (
								<div className={styles.noUsers}>
									<NoActivities2 /> No user found
								</div>
							)}
						</div>
					</div>
				</div>

				<div className={styles.inputGroup}>
					<Label required>
						{COMMON_TRANSLATION.ROLE_ASSIGNED[user?.language?.toUpperCase()]}
					</Label>
					<Select
						name="role"
						value={input}
						setValue={setInput}
						placeholder={COMMON_TRANSLATION?.SELECT?.[user?.language?.toUpperCase()]}
						options={
							sdName === "Admin"
								? ADMIN_ROLES.map(opt => ({
										label: opt.label[user?.language?.toUpperCase()],
										value: opt.value,
										isDisabled: opt.isDisabled ?? false,
								  }))
								: Object.keys(OTHER_ROLES).map(key => ({
										label: OTHER_ROLES[key][user?.language?.toUpperCase()],
										value: key,
								  }))
						}
						borderRadius={15}
						borderColor="#DADCE0"
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
						placeholder={COMMON_TRANSLATION.TYPE_HERE[user?.language?.toUpperCase()]}
						theme={InputThemes.WHITE_WITH_GREY_BORDER}
					/>
				</div>
				<div className={styles.inputGroup}>
					<Label required>
						{PROFILE_TRANSLATION.TIMEZONE[user?.language?.toUpperCase()]}
					</Label>
					<TimezoneSelect
						value={input.timezone}
						placeholder={COMMON_TRANSLATION?.SELECT?.[user?.language?.toUpperCase()]}
						onChange={timezone =>
							setInput(prevState => ({
								...prevState,
								timezone: timezone.value,
							}))
						}
						components={{ DropdownIndicator }}
						styles={roundedStyles}
					/>
				</div>
				<div className={styles.inputGroup}>
					<Label>
						{COMMON_TRANSLATION.RINGOVER_USER_ID[user?.language?.toUpperCase()]}
					</Label>
					<Input
						name="ringover_user_id"
						value={
							input.ringover_user_id ? input.ringover_user_id + RINGOVER_USER_ID_BASE : ""
						}
						setValue={setInput}
						className={styles.input}
						placeholder={COMMON_TRANSLATION.TYPE_HERE[user?.language?.toUpperCase()]}
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
						placeholder={COMMON_TRANSLATION.TYPE_HERE[user?.language?.toUpperCase()]}
						theme={InputThemes.WHITE_WITH_GREY_BORDER}
					/>
				</div>
			</div>
			<div className={styles.footer}>
				<ThemedButton
					className={styles.saveBtn}
					theme={ThemedButtonThemes.PRIMARY}
					onClick={handleSubmit}
					loading={addMemberLoading}
				>
					{COMMON_TRANSLATION.ADD_NEW_MEMBER[user?.language?.toUpperCase()]}
				</ThemedButton>
			</div>
		</Modal>
	);
};

export default NewMembersModal;

const Placeholder = () => {
	return (
		<div className={styles.placeholder}>
			<Skeleton />
			<Skeleton />
			<Skeleton />
			<Skeleton />
		</div>
	);
};
