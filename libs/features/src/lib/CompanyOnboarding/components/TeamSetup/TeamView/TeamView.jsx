import { useEffect, useState } from "react";
import { useSubDepartment } from "@cadence-frontend/data-access";

import styles from "./TeamView.module.scss";
import { Container, Image, Skeleton, Title } from "@cadence-frontend/components";
import { BackButton, ThemedButton } from "@cadence-frontend/widgets";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { PlusOutline, Send } from "@cadence-frontend/icons";
import { Colors } from "@cadence-frontend/utils";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue } from "recoil";
import TeamMembersList from "./components/TeamMembersList/TeamMembersList";
import NewMembersModal from "./components/NewMembersModal/NewMembersModal";
import EditMemberModal from "./components/EditMemberModal/EditMemberModal";
import InvitationModal from "./components/InvitationModal/InvitationModal";
import RemoveMemberModal from "./components/RemoveMemberModal/RemoveMemberModal";

const TeamView = ({ teamId, setTeamId, setDisableNext, sdName }) => {
	const {
		subDepartment: teamInfo,
		subDepartmentLoading: teamLoading,
		users: teamMembers,
		usersLoading: membersLoading,
	} = useSubDepartment(teamId);
	const user = useRecoilValue(userInfo);

	const [memberId, setMemberId] = useState(null);
	const [memberInfo, setMemberInfo] = useState(null);
	const [checkedMembers, setCheckedMembers] = useState([]);
	const [newMembersModal, setNewMembersModal] = useState(false);
	const [editMemberModal, setEditMemberModal] = useState(false);
	const [invitationModal, setInvitationModal] = useState(false);
	const [removeMemberModal, setRemoveMemberModal] = useState(false);
	const [invitingMembers, setInvitingMembers] = useState([]);

	return (
		<Container style={{ overflowY: "hidden", display: "flex", flexDirection: "column" }}>
			<div className={styles.header}>
				<div className={styles.left}>
					<BackButton
						text={COMMON_TRANSLATION.GROUPS[user?.language?.toUpperCase()]}
						onClick={() => setTeamId("")}
					/>
					{teamLoading ? (
						<Skeleton className={styles.titlePlaceholder} />
					) : (
						<Title size={16}>{teamInfo?.name}</Title>
					)}
					<a
						href="https://www.loom.com/share/191a7ae44ebd4c6985e0719a0a995d3a"
						target="_blank"
						rel="noreferrer"
					>
						{
							COMMON_TRANSLATION.WATCH_HOW_TO_INVITE_TEAM_MEMBERS[
								user?.language?.toUpperCase()
							]
						}
					</a>
				</div>
				<div className={styles.right}>
					<ThemedButton
						theme={ThemedButtonThemes.GREY}
						onClick={() => {
							setInvitingMembers(checkedMembers);
							setInvitationModal(prevState => !prevState);
						}}
						disabled={membersLoading || checkedMembers.length < 1}
						// width={user?.language === "french" ? "162%" : "100%"}
					>
						<Send
							color={
								membersLoading || checkedMembers.length < 1
									? Colors.blackShade8
									: Colors.lightBlue
							}
							size={17}
						/>
						<div>
							<span>
								{COMMON_TRANSLATION.SEND_REQUEST[user?.language?.toUpperCase()]}
							</span>
						</div>
					</ThemedButton>
					<ThemedButton
						theme={ThemedButtonThemes.GREY}
						onClick={() => setNewMembersModal(prevState => !prevState)}
						disabled={teamLoading}
						// width="auto"
					>
						<PlusOutline
							color={teamLoading ? Colors.blackShade8 : Colors.lightBlue}
							size={17}
						/>
						<div>{COMMON_TRANSLATION.ADD_MEMBERS[user?.language?.toUpperCase()]}</div>
					</ThemedButton>
				</div>
			</div>

			<div className={styles.mainContainer}>
				<TeamMembersList
					teamMembers={teamMembers}
					loading={membersLoading}
					checkedProps={{ checkedMembers, setCheckedMembers }}
					modalProps={{ setEditMemberModal, setInvitationModal, setRemoveMemberModal }}
					otherProps={{ setMemberInfo, setMemberId, setInvitingMembers }}
				/>
			</div>
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
		</Container>
	);
};

export default TeamView;
