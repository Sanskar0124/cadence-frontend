import { useEffect, useState, useContext, useRef } from "react";
import { useRecoilValue } from "recoil";
import { useSubDepartments, useUsers } from "@cadence-frontend/data-access";

import { userInfo } from "@cadence-frontend/atoms";
import { SearchBar, ThemedButton } from "@cadence-frontend/widgets";
import { BadgeAccountHorizontal, Plus } from "@cadence-frontend/icons";
import { ThemedButtonThemes } from "@cadence-frontend/themes";

import CreateTeamModal from "./components/CreateTeamModal/CreateTeamModal";
import TeamSettingsModal from "./components/TeamSettingsModal/TeamSettingsModal";
import TeamCardsList from "./components/TeamCardsList/TeamCardsList";
import { Settings as SETTINGS_TRANSLATION } from "@cadence-frontend/languages";

// constants
import { ACTIONS } from "./constants";

// utils
import { isActionPermitted } from "./utils";

import styles from "./Teams.module.scss";
import { MessageContext } from "@cadence-frontend/contexts";
import { Skeleton, Title } from "@cadence-frontend/components";
import { useOutsideClickHandler } from "@cadence-frontend/utils";
import { useNavigate } from "react-router-dom";
import { TABS } from "../../../constants";

const Teams = ({ setSdId, setSdName }) => {
	const user = useRecoilValue(userInfo);
	const navigate = useNavigate();
	const { addError } = useContext(MessageContext);

	const subDepartmentsDataAccess = useSubDepartments(true, true);
	const { groupMembers, groupMembersLoading } = useUsers({ users: true });
	const { subDepartments, subDepartmentsLoading } = subDepartmentsDataAccess;

	const searchResultRef = useRef(null);
	const [teamInfo, setTeamInfo] = useState(null);
	const [createTeamModal, setCreateTeamModal] = useState(false);
	const [teamSettingsModal, setTeamSettingsModal] = useState(false);
	const [searchDropdown, setSearchDropDown] = useState(true);

	const [search, setSearch] = useState("");
	const [searchResults, setSearchResults] = useState({
		groups: [],
		members: [],
	});

	useOutsideClickHandler(searchResultRef, () => setSearchDropDown(false));
	const getMembers = () => {
		if (search?.trim() === "") return;
		groupMembers(search, {
			onSuccess: res => {
				setSearchResults({
					members: [...res],
					groups: [
						...subDepartments?.filter(item =>
							item?.name?.toLocaleLowerCase().includes(search)
						),
					],
				});
			},
			onError: err => {
				addError({
					text: err?.response?.data?.msg,
					desc: err?.response?.data?.error || "Please contact support",
					cId: err?.response?.data?.correlationId,
				});
			},
		});
	};

	useEffect(() => {
		getMembers();
	}, [search]);

	const checkIfNoMember = () =>
		searchResults?.groups?.length === 0 && searchResults?.members?.length === 0;

	const clickHandler = (sd_id, name) => {
		setSdId(sd_id);
		setSdName(name);
	};

	return (
		<div className={styles.teams}>
			<Title size="1.1rem">
				{SETTINGS_TRANSLATION.COMPANY_GROUPS[user?.language?.toUpperCase()]}
			</Title>
			<div className={styles.divider} />
			<div className={styles.header}>
				<div className={styles.left}>
					<SearchBar
						width="360px"
						height="40px"
						value={search}
						setValue={setSearch}
						onFocus={() => setSearchDropDown(true)}
						onClick={() => setSearchDropDown(true)}
					/>
					<div
						className={`${styles.searchResults} ${
							search?.trim() !== "" &&
							!checkIfNoMember() &&
							searchDropdown &&
							styles.active
						}`}
						ref={searchResultRef}
					>
						{search?.trim() !== "" && groupMembersLoading ? (
							<div className={styles.searchPlaceholder}>
								<Skeleton className={styles.searchLoader} />
								<Skeleton className={styles.searchLoader} />
								<Skeleton className={styles.searchLoader} />
							</div>
						) : (
							search?.trim() !== "" && (
								<>
									{searchResults?.groups?.length !== 0 && (
										<div>
											<h1 className={styles.heading}>
												Groups ({searchResults?.groups?.length})
											</h1>
											{searchResults.groups.map(item => (
												<div onClick={() => clickHandler(item?.sd_id, item?.name)}>
													<img
														src={
															item?.is_profile_picture_present
																? item?.profile_picture
																: "https://cdn.ringover.com/img/users/default.jpg"
														}
														alt=""
													/>
													<div className={styles.text}>
														<p>{item?.name}</p>
														<div className={styles.subText}>
															{item?.Users?.length} members
														</div>
													</div>
												</div>
											))}
										</div>
									)}
									{searchResults?.members?.length !== 0 && (
										<div>
											<h1 className={styles.heading}>
												Members ({searchResults?.members?.length})
											</h1>
											{searchResults.members.map(item => (
												<div
													onClick={() => {
														navigate(
															`/settings?view=${TABS.GROUPS_AND_MEMBERS}&user=${item?.user_id}`
														);
														clickHandler(
															item?.Sub_Department?.sd_id,
															item?.Sub_Department?.name
														);
													}}
												>
													<img src={item?.profile_picture} alt="" />
													<div className={styles.text}>
														<p>{`${item?.first_name} ${item?.last_name}`}</p>
														<div className={styles.subText}>
															{item?.Sub_Department?.name}
														</div>
													</div>
												</div>
											))}
										</div>
									)}
								</>
							)
						)}
					</div>
				</div>
				<div className={styles.right}>
					<ThemedButton
						width="fit-content"
						height="40px"
						theme={ThemedButtonThemes.GREY}
						onClick={() => setCreateTeamModal(true)}
						disabled={!isActionPermitted({ role: user.role, action: ACTIONS.CREATE })}
					>
						<Plus />
						<div>{SETTINGS_TRANSLATION.NEW_GROUP[user?.language?.toUpperCase()]}</div>
					</ThemedButton>
				</div>
			</div>

			<div className={styles.body}>
				<TeamCardsList
					teams={subDepartments}
					loading={subDepartmentsLoading}
					setTeamSettingsModal={setTeamSettingsModal}
					setTeamInfo={setTeamInfo}
					setSdId={setSdId}
					setSdName={setSdName}
				/>
			</div>

			<CreateTeamModal
				modal={createTeamModal}
				setModal={setCreateTeamModal}
				subDepartmentsDataAccess={subDepartmentsDataAccess}
			/>
			<TeamSettingsModal
				modal={teamSettingsModal}
				setModal={setTeamSettingsModal}
				teamInfo={teamInfo}
			/>
		</div>
	);
};

export default Teams;
