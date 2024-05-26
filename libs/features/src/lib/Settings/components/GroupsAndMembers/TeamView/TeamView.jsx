import { useState, useEffect, useRef } from "react";
import { useRecoilValue } from "recoil";

import { useSubDepartment } from "@cadence-frontend/data-access";

import { userInfo } from "@cadence-frontend/atoms";
import { BackButton, ThemedButton } from "@cadence-frontend/widgets";
import { ProgressiveImg, Skeleton, Title } from "@cadence-frontend/components";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { PlusOutline, Send, Settings, ShieldCrown } from "@cadence-frontend/icons";

import TeamSettingsModal from "../Teams/components/TeamSettingsModal/TeamSettingsModal";
import NewMembersModal from "./components/NewMembersModal/NewMembersModal";
import EditMemberModal from "./components/EditMemberModal/EditMemberModal";
import InvitationModal from "./components/InvitationModal/InvitationModal";
import RemoveMemberModal from "./components/RemoveMemberModal/RemoveMemberModal";
import TeamChangeModal from "./components/TeamChangeModal/TeamChangeModal";
import TeamMembersList from "./components/TeamMembersList/TeamMembersList";
import {
	Common as COMMON_TRANSLATION,
	Cadence as CADENCE_TRANSLATION,
} from "@cadence-frontend/languages";

import { VIEW_MODES } from "../constants";
import { ACTIONS } from "../Teams/constants";

import { isActionPermitted } from "../Teams/utils";

import styles from "./TeamView.module.scss";
import moment from "moment-timezone";
import { useNavigate } from "react-router-dom";

const TeamView = ({ setViewMode, sdId: id, setSdId, sdName }) => {
	const user = useRecoilValue(userInfo);
	const navigate = useNavigate();

	const {
		subDepartment: teamInfo,
		subDepartmentLoading: teamLoading,
		users: teamMembers,
		usersLoading: membersLoading,
		companySettings: teamSettings,
	} = useSubDepartment(id);

	const [memberId, setMemberId] = useState(null);
	const [memberInfo, setMemberInfo] = useState(null);
	const [checkedMembers, setCheckedMembers] = useState([]);
	const [teamSettingsModal, setTeamSettingsModal] = useState(false);
	const [newMembersModal, setNewMembersModal] = useState(false);
	const [editMemberModal, setEditMemberModal] = useState(false);
	const [invitationModal, setInvitationModal] = useState(false);
	const [removeMemberModal, setRemoveMemberModal] = useState(false);
	const [teamChangeModal, setTeamChangeModal] = useState(false);
	const [invitingMembers, setInvitingMembers] = useState([]);

	const goBack = () => {
		navigate("/settings?view=groups_and_members");
		setViewMode(VIEW_MODES.TEAMS);
		setSdId("");
	};
	console.log(teamMembers, "TeamMembers");
	return (
		<div className={styles.members}>
			<div className={styles.header}>
				<div className={styles.left}>
					<div>
						<BackButton
							onClick={goBack}
							text={COMMON_TRANSLATION.GROUPS[user?.language?.toUpperCase()]}
						/>
					</div>

					<div className={styles.info}>
						{membersLoading ? (
							<Skeleton className={styles.logoPlaceholder} />
						) : sdName === "Admin" ? (
							<ShieldCrown className={styles.logo} />
						) : (
							<ProgressiveImg className={styles.logo} src={teamInfo?.profile_picture} />
						)}

						<div className={styles.details}>
							{teamLoading ? (
								<>
									<Skeleton className={styles.titlePlaceholder} />
									<Skeleton className={styles.textPlaceholder} />
								</>
							) : (
								<>
									<Title size={20}>{teamInfo?.name}</Title>

									<ul>
										{teamInfo?.created_at && (
											<li>
												<span>
													{`${
														CADENCE_TRANSLATION.CREATED_ON[user?.language?.toUpperCase()]
													} ${moment(teamInfo?.created_at).format("MMM DD, YYYY")}`}
												</span>
											</li>
										)}
										{teamMembers && (
											<li>
												<span>{`${teamMembers.length} ${
													teamMembers.length === 1
														? COMMON_TRANSLATION.MEMBER[user?.language?.toUpperCase()]
														: COMMON_TRANSLATION.MEMBERS[user?.language?.toUpperCase()]
												}`}</span>
											</li>
										)}
									</ul>
								</>
							)}
						</div>
					</div>
				</div>
				<div className={styles.right}>
					<ThemedButton
						theme={ThemedButtonThemes.GREY}
						onClick={() => setNewMembersModal(prevState => !prevState)}
						disabled={
							teamLoading ||
							!isActionPermitted({
								role: user?.role,
								sdId: id,
								userSdId: user?.sd_id,
								action: ACTIONS.UPDATE,
							})
						}
						width="fit-content"
					>
						<PlusOutline size={17} />
						<div>{COMMON_TRANSLATION.ADD_MEMBERS[user?.language?.toUpperCase()]}</div>
					</ThemedButton>
					{sdName !== "Admin" && (
						<ThemedButton
							theme={ThemedButtonThemes.GREY}
							onClick={() => setTeamSettingsModal(prevState => !prevState)}
							disabled={
								teamLoading ||
								!isActionPermitted({
									role: user?.role,
									sdId: id,
									userSdId: user?.sd_id,
									action: ACTIONS.UPDATE,
								})
							}
							width="fit-content"
						>
							<Settings size={17} />
							<div>
								{COMMON_TRANSLATION.GROUP_SETTINGS[user?.language?.toUpperCase()]}
							</div>
						</ThemedButton>
					)}
				</div>
			</div>
			{checkedMembers.length > 0 && (
				<div className={styles.midBar}>
					<div className={styles.leftSectn}>
						<p className={styles.bulkActions}>
							{COMMON_TRANSLATION.BULK_ACTIONS[user?.language?.toUpperCase()]}
						</p>
						<Title size={16}>
							{`${CADENCE_TRANSLATION.PEOPLE_SELECTED[user?.language?.toUpperCase()]} - ${
								checkedMembers.length
							} out of ${teamMembers?.length}`}
						</Title>
					</div>
					<div className={styles.rightSectn}>
						<ThemedButton
							theme={ThemedButtonThemes.WHITE}
							onClick={() => {
								setInvitingMembers(checkedMembers);
								setInvitationModal(prevState => !prevState);
							}}
							disabled={
								!isActionPermitted({
									role: user?.role,
									sdId: id,
									userSdId: user?.sd_id,
									action: ACTIONS.UPDATE,
								})
							}
						>
							<Send size={17} />
							<div>
								<span>
									{COMMON_TRANSLATION.SEND_REQUEST[user?.language?.toUpperCase()]}
								</span>
							</div>
						</ThemedButton>
						{/* <ThemedButton theme={ThemedButtonThemes.WHITE} disabled>
							<MinusOutline size={16} />
							<span>Remove members</span>
						</ThemedButton> */}
					</div>
				</div>
			)}
			<div className={styles.mainContainer}>
				<TeamMembersList
					user={user}
					teamInfo={teamInfo}
					teamMembers={teamMembers}
					loading={membersLoading}
					teamSettings={teamSettings}
					checkedProps={{ checkedMembers, setCheckedMembers }}
					modalProps={{
						setEditMemberModal,
						setInvitationModal,
						setRemoveMemberModal,
						setTeamChangeModal,
					}}
					otherProps={{ setMemberInfo, setMemberId, setInvitingMembers }}
					userId={id}
				/>
			</div>
			<TeamSettingsModal
				modal={teamSettingsModal}
				setModal={setTeamSettingsModal}
				teamInfo={teamInfo}
				setViewMode={setViewMode}
			/>
			<NewMembersModal
				modal={newMembersModal}
				setModal={setNewMembersModal}
				teamId={teamInfo?.sd_id}
				sdName={sdName}
			/>
			<EditMemberModal
				modal={editMemberModal}
				setModal={setEditMemberModal}
				memberInfo={memberInfo}
				teamId={teamInfo?.sd_id}
				sdName={sdName}
			/>
			<InvitationModal
				modal={invitationModal}
				setModal={setInvitationModal}
				invitingMembers={invitingMembers}
			/>
			<RemoveMemberModal
				modal={removeMemberModal}
				setModal={setRemoveMemberModal}
				teamId={teamInfo?.sd_id}
				memberProps={{
					memberId,
					memberName: teamMembers
						?.filter(memb => memb.user_id === memberId)
						?.map(memb => `${memb.first_name} ${memb.last_name}`),
				}}
			/>

			<TeamChangeModal
				modal={teamChangeModal}
				setModal={setTeamChangeModal}
				teamId={teamInfo?.sd_id}
				memberInfo={memberInfo}
			/>
		</div>
	);
};

export default TeamView;
