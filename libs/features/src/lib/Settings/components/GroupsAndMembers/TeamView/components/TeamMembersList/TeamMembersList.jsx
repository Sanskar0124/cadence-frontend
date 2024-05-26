import {
	Edit,
	GoogleBox,
	MinusOutline,
	More,
	Send,
	RightToBracket,
	OutlookBox,
	Refresh,
} from "@cadence-frontend/icons";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { ProgressiveImg, Skeleton, Button } from "@cadence-frontend/components";
import { Checkbox, ThemedButton, DropDown } from "@cadence-frontend/widgets";
import { ALL_ROLES, getIntegrationIdLabel } from "../constants";
import { ACTIONS } from "../../../Teams/constants";
import { isActionPermitted } from "../../../Teams/utils";
import { useLogin } from "@cadence-frontend/data-access";
import styles from "./TeamMembersList.module.scss";
import {
	INSTANCE_URL_TYPES,
	INTEGRATION_TYPE,
	MAIL_INTEGRATION_TYPES,
	PHONE_INTEGRATIONS,
	RINGOVER_USER_ID_BASE,
	ROLES,
} from "@cadence-frontend/constants";
import { useNavigate } from "react-router-dom";
import { useEffect, useContext, useState } from "react";
import { MessageContext } from "@cadence-frontend/contexts";
import {
	Common as COMMON_TRANSLATION,
	Cadence as CADENCE_TRANSLATION,
} from "@cadence-frontend/languages";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";
import { Colors, getIntegrationIcon, useQuery } from "@cadence-frontend/utils";

const TeamMembersList = ({
	teamMembers,
	loading,
	checkedProps,
	modalProps,
	otherProps,
	user,
	teamInfo,
	teamSettings,
	userId,
}) => {
	const query = useQuery();
	const scrollToUserId = query.get("user");
	const integration_type = useRecoilValue(userInfo).integration_type;
	const { checkedMembers, setCheckedMembers } = checkedProps;
	const {
		setEditMemberModal,
		setInvitationModal,
		setRemoveMemberModal,
		setTeamChangeModal,
	} = modalProps;
	const { setMemberInfo, setMemberId, setInvitingMembers } = otherProps;

	const { sendResetPasswordLink, sendResetPasswordLinkLoading } = useLogin();
	const navigate = useNavigate();

	const { addError, addSuccess } = useContext(MessageContext);
	const INTEGRATION_ICON = getIntegrationIcon({
		integration_type,
		box: true,
	});
	const [highlight, setHighlight] = useState(false);

	useEffect(() => {
		if (teamMembers?.length && scrollToUserId) {
			document?.getElementById(scrollToUserId)?.lastElementChild?.scrollIntoView();
			setHighlight(true);
			setTimeout(() => {
				setHighlight(false);
			}, 3000);
		}
	}, [teamMembers]);

	const getIntegrationSpecificTokenValidity = ({ memb, integration_type }) => {
		try {
			switch (integration_type) {
				case INTEGRATION_TYPE.SALESFORCE:
				case INTEGRATION_TYPE.PIPEDRIVE:
				case INTEGRATION_TYPE.SELLSY:
				case INTEGRATION_TYPE.DYNAMICS:
				case INTEGRATION_TYPE.HUBSPOT:
				case INTEGRATION_TYPE.ZOHO:
					return !memb[INSTANCE_URL_TYPES[integration_type]]?.is_logged_out;

				default:
					return false;
			}
		} catch (err) {
			console.log("Error while retrieving token validity", err);
			return false;
		}
	};

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<div className={`${styles.row} ${styles.labels}`}>
					<div className={styles.col}>
						<Checkbox
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
						COMMON_TRANSLATION?.TEAM_MEMBER_NAME[user?.language?.toUpperCase()],
						COMMON_TRANSLATION?.EMAIL_ID[user?.language?.toUpperCase()],
						COMMON_TRANSLATION?.RINGOVER_ID[user?.language?.toUpperCase()],
						getIntegrationIdLabel(integration_type, true),
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
								<div
									memb={memb.user_id}
									className={`${styles.row} ${
										highlight && scrollToUserId === memb?.user_id && styles.highlight
									}`}
									key={memb.user_id}
									id={memb.user_id}
								>
									<div className={styles.col}>
										<Checkbox
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
									<div className={`${styles.col} ${styles.info}`}>
										<span className={styles.name}>
											<ProgressiveImg
												className={styles.profileImg}
												src={memb.profile_picture}
											/>
											{memb.first_name} {memb.last_name}
										</span>
										<div className={styles.connectStatus}>
											{integration_type !== INTEGRATION_TYPE.GOOGLE_SHEETS &&
												integration_type !== INTEGRATION_TYPE.EXCEL &&
												integration_type !== INTEGRATION_TYPE.SHEETS && (
													<INTEGRATION_ICON
														disabled={
															!getIntegrationSpecificTokenValidity({
																memb,
																integration_type,
															})
														}
														size={20}
													/>
												)}
											{teamSettings?.mail_integration_type ===
											MAIL_INTEGRATION_TYPES.GOOGLE ? (
												<GoogleBox
													disabled={memb.User_Token?.is_google_token_expired}
													size={20}
												/>
											) : (
												<OutlookBox
													disabled={memb.User_Token?.is_outlook_token_expired}
													size={20}
												/>
											)}
										</div>
									</div>
									<div className={`${styles.col} ${styles.email}`} title={memb.email}>
										<span>{memb.email ?? "..."}</span>
									</div>
									<div
										className={`${styles.col} ${styles.ringoverId}`}
										title={parseInt(memb.ringover_user_id) + RINGOVER_USER_ID_BASE}
									>
										<span>
											{memb.ringover_user_id
												? parseInt(memb.ringover_user_id) + RINGOVER_USER_ID_BASE
												: "..."}
										</span>
									</div>
									<div
										className={`${styles.col} ${styles.salesforceId}`}
										title={memb.integration_id}
									>
										<span>{memb.integration_id ?? "..."}</span>
									</div>
									<div className={`${styles.col} ${styles.role}`}>
										<span>
											{memb.role
												? ALL_ROLES[memb.role]
													? ALL_ROLES[memb.role]
													: memb.role
												: "..."}
										</span>
									</div>
									<div className={`${styles.col} ${styles.actions}`}>
										<ThemedButton
											width="50px"
											height="40px"
											theme={ThemedButtonThemes.GREY}
											disabled={
												!isActionPermitted({
													role: user?.role,
													sdId: teamInfo?.sd_id,
													userSdId: user?.sd_id,
													action: ACTIONS.UPDATE,
												})
											}
											onClick={() => {
												setEditMemberModal(prevState => !prevState);
												setMemberInfo(memb);
											}}
										>
											<div>
												<Edit size={16} className={styles.more} />
											</div>
										</ThemedButton>
										<DropDown
											btn={
												<ThemedButton
													theme={ThemedButtonThemes.GREY}
													width="50px"
													height="40px"
													disabled={
														!isActionPermitted({
															role: user?.role,
															sdId: teamInfo?.sd_id,
															userSdId: user?.sd_id,
															action: ACTIONS.UPDATE,
														})
													}
												>
													<div>
														<More size={16} className={styles.more} />
													</div>
												</ThemedButton>
											}
											width={"max-content"}
											top={"50px"}
											right={"10px"}
											tooltipText={COMMON_TRANSLATION.MORE[user?.language?.toUpperCase()]}
											className={styles.dropDown}
										>
											{(user?.role === ROLES.ADMIN || user?.role === ROLES.SUPER_ADMIN) &&
												memb.role !== ROLES.SUPER_ADMIN && (
													<Button
														onClick={() => {
															navigate(
																`/access/account?email=${encodeURIComponent(memb?.email)}`
															);
															// window.location.href=`/access/account?email=${memb?.email}`
														}}
														disabled={false}
													>
														<div>
															{" "}
															<RightToBracket size={17} />
														</div>
														<div>
															{
																COMMON_TRANSLATION.GET_ACCESS[
																	user?.language?.toUpperCase()
																]
															}
														</div>
													</Button>
												)}
											{user?.role === ROLES.SUPER_ADMIN &&
												memb.role !== ROLES.SUPER_ADMIN &&
												memb.role !== ROLES.ADMIN && (
													<Button
														onClick={() => {
															setMemberInfo(memb);
															setTeamChangeModal(prev => !prev);
														}}
														disabled={false}
													>
														<div>
															{" "}
															<Refresh color={Colors.lightBlue} size={17} />
														</div>
														<div>
															{
																COMMON_TRANSLATION.CHANGE_TEAM[
																	user?.language?.toUpperCase()
																]
															}
														</div>
													</Button>
												)}
											{isActionPermitted({
												role: user?.role,
												sdId: teamInfo?.sd_id,
												userSdId: user?.sd_id,
												action: ACTIONS.UPDATE,
											}) &&
												memb.role !== ROLES.SUPER_ADMIN && (
													<Button
														onMouseDown={() => {
															setInvitingMembers([memb]);
															setInvitationModal(prevState => !prevState);
														}}
														disabled={
															!isActionPermitted({
																role: user?.role,
																sdId: teamInfo?.sd_id,
																userSdId: user?.sd_id,
																action: ACTIONS.UPDATE,
															})
														}
													>
														<div>
															{" "}
															<Send size={17} />
														</div>
														<div className={styles.sendRequest}>
															{
																COMMON_TRANSLATION.SEND_REQUEST[
																	user?.language?.toUpperCase()
																]
															}
														</div>
													</Button>
												)}
											{isActionPermitted({
												role: user?.role,
												sdId: teamInfo?.sd_id,
												userSdId: user?.sd_id,
												action: ACTIONS.UPDATE,
											}) &&
												memb.role !== ROLES.SUPER_ADMIN && (
													<Button
														onMouseDown={() => {
															setMemberId(memb.user_id);
															setRemoveMemberModal(prevState => !prevState);
														}}
														className={styles.rmvBtn}
													>
														<div>
															{" "}
															<MinusOutline size={16} />
														</div>
														<div>
															{
																COMMON_TRANSLATION.REMOVE_MEMBER[
																	user?.language?.toUpperCase()
																]
															}
														</div>
													</Button>
												)}
										</DropDown>
									</div>
								</div>
						  ))
						: [...Array(8)].map((_, i) => (
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
