import { useState } from "react";
import styles from "./TeamMembersList.module.scss";
import { Edit, MinusOutline, More, SalesforceBox, Send } from "@cadence-frontend/icons";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { Image, Skeleton, Tooltip } from "@cadence-frontend/components";
import { Checkbox, ThemedButton, DropDown } from "@cadence-frontend/widgets";
import { RINGOVER_USER_ID_BASE, ROLES } from "@cadence-frontend/constants";
import {
	Common as COMMON_TRANSLATION,
	Cadence as CADENCE_TRANSLATION,
} from "@cadence-frontend/languages";
import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue } from "recoil";
import { getIntegrationIdLabel } from "../constants";

const TeamMembersList = ({
	teamMembers,
	loading,
	checkedProps,
	modalProps,
	otherProps,
}) => {
	const { checkedMembers, setCheckedMembers } = checkedProps;
	const { setEditMemberModal, setInvitationModal, setRemoveMemberModal } = modalProps;
	const { setMemberInfo, setMemberId, setInvitingMembers } = otherProps;
	const [isDropDownActive, setIsDropDownActive] = useState(false);
	const user = useRecoilValue(userInfo);

	const roles = {
		admin: "Admin",
		super_admin: "Super Admin",
		sales_person: "Sales Agent",
		sales_manager: "Sales Manager",
	};

	const moreBtnhandler = (event, teamMember) => {
		teamMember === isDropDownActive
			? setIsDropDownActive(false)
			: setIsDropDownActive(teamMember);

		window.onmousedown = e => {
			if (e.target !== event.target) {
				setIsDropDownActive(false);
			}
			window.onmousedown = null;
		};
	};

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<div className={styles.row}>
					<div className={styles.col}>
						<Checkbox
							className={styles.checkBox}
							checked={
								teamMembers?.length > 0 && checkedMembers.length === teamMembers?.length
							}
							onClick={() => {
								if (teamMembers?.length > 0) {
									checkedMembers.length !== teamMembers?.length
										? setCheckedMembers(teamMembers)
										: setCheckedMembers([]);
								}
							}}
						/>
					</div>
					{[
						COMMON_TRANSLATION?.FIRST_NAME[user?.language?.toUpperCase()],
						COMMON_TRANSLATION?.LAST_NAME[user?.language?.toUpperCase()],
						COMMON_TRANSLATION?.EMAIL[user?.language?.toUpperCase()],
						COMMON_TRANSLATION?.RINGOVER_ID[user?.language?.toUpperCase()],
						getIntegrationIdLabel(user.integration_type, true),
						COMMON_TRANSLATION?.ROLE_ASSIGNED[user?.language?.toUpperCase()],
						CADENCE_TRANSLATION?.ACTIONS[user?.language?.toUpperCase()],
					].map(col => (
						<div key={col} className={styles.col}>
							<span>{col}</span>
						</div>
					))}
				</div>
			</div>
			<div className={styles.body}>
				<div className={styles.content}>
					{!loading
						? teamMembers?.map(memb => (
								<div memb={memb.user_id} className={styles.row}>
									<div className={styles.col}>
										<Checkbox
											className={styles.checkBox}
											checked={
												checkedMembers.filter(m => m.user_id === memb.user_id).length ===
												1
											}
											onChange={() => {
												checkedMembers.filter(m => m.user_id === memb.user_id).length ===
												1
													? setCheckedMembers(prevState =>
															prevState.filter(m => m.user_id !== memb.user_id)
													  )
													: setCheckedMembers(prevState => [...prevState, memb]);
											}}
										/>
									</div>
									<div className={styles.col}>
										<Image
											className={styles.profileImg}
											src="https://cdn.ringover.com/img/users/default.jpg"
										/>
									</div>
									<div className={`${styles.col} ${styles.firstName}`}>
										<span>{memb.first_name}</span>
									</div>
									<div className={`${styles.col} ${styles.lastName}`}>
										<span>{memb.last_name}</span>
									</div>
									<div className={`${styles.col} ${styles.email}`}>
										<span>{memb.email ?? "..."}</span>
									</div>
									<div className={`${styles.col} ${styles.ringoverId}`}>
										<span>
											{memb.ringover_user_id
												? parseInt(memb.ringover_user_id) + RINGOVER_USER_ID_BASE
												: "..."}
										</span>
									</div>
									<div className={`${styles.col} ${styles.salesforceId}`}>
										<span>{memb.integration_id ?? "..."}</span>
									</div>
									<div className={`${styles.col} ${styles.role}`}>
										<span>
											{memb.role
												? roles[memb.role]
													? roles[memb.role]
													: memb.role
												: "..."}
										</span>
									</div>
									<div className={`${styles.col} ${styles.actions}`}>
										<Tooltip
											text={COMMON_TRANSLATION.EDIT[user?.language?.toUpperCase()]}
										>
											<ThemedButton
												height="40px"
												width="50px"
												theme={ThemedButtonThemes.GREY}
												disabled={false}
												onClick={() => {
													setEditMemberModal(prevState => !prevState);
													setMemberInfo(memb);
												}}
											>
												<div>
													<Edit size={16} />
												</div>
											</ThemedButton>
										</Tooltip>

										<DropDown
											tooltipText={COMMON_TRANSLATION.MORE[user?.language?.toUpperCase()]}
											btn={
												<ThemedButton
													height="40px"
													width="50px"
													className={styles.dotsBtn}
													theme={ThemedButtonThemes.GREY}
													disabled={false}
													onClick={e => {
														moreBtnhandler(e, memb);
													}}
												>
													<div>
														<More size={16} />
													</div>
												</ThemedButton>
											}
											width={"max-content"}
											top={"50px"}
											right={"10px"}
										>
											{memb.role !== ROLES.SUPER_ADMIN && (
												<button
													onClick={() => {
														setMemberId(memb.user_id);
														setRemoveMemberModal(prevState => !prevState);
													}}
												>
													<div>
														<MinusOutline size={16} />
													</div>
													<div>
														{" "}
														{
															COMMON_TRANSLATION.REMOVE_MEMBER[
																user?.language?.toUpperCase()
															]
														}
													</div>
												</button>
											)}
											{memb.role !== ROLES.SUPER_ADMIN && (
												<button
													onClick={() => {
														setInvitingMembers([memb]);
														setInvitationModal(prevState => !prevState);
													}}
												>
													<div>
														<Send size={17} />
													</div>
													<div className={styles.sendRequest}>
														{
															COMMON_TRANSLATION.SEND_REQUEST[
																user?.language?.toUpperCase()
															]
														}
													</div>
												</button>
											)}
										</DropDown>
									</div>
								</div>
						  ))
						: [...Array(5)].map((_, i) => (
								<div key={i} className={styles.row}>
									{[...Array(9)].map((_, j) => (
										<div key={i} className={styles.col}>
											<Skeleton className={styles.placeholder} />
										</div>
									))}
								</div>
						  ))}
					<div style={{ height: "80px", visibility: "hidden" }}></div>
				</div>
			</div>
		</div>
	);
};

TeamMembersList.defaultProps = {
	loading: false,
};

export default TeamMembersList;
