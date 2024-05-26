import { ROLES } from "@cadence-frontend/constants";
import { useSubDepartments, useUsers } from "@cadence-frontend/data-access";
import { Close, Tick } from "@cadence-frontend/icons";
import { TabNavThemes, ThemedButtonThemes } from "@cadence-frontend/themes";
import { Div, ErrorBoundary, Image } from "@cadence-frontend/components";
import { SearchBar, TabNavSlider, ThemedButton } from "@cadence-frontend/widgets";
import { userInfo } from "@cadence-frontend/atoms";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import styles from "./UserAndGroup.module.scss";
import {
	Common as COMMON_TRANSLATION,
	Tasks as TASKS_TRANSLATION,
	Templates as TEMPLATES_TRANSLATION,
} from "@cadence-frontend/languages";

const BUTTONS = [
	{ label: TASKS_TRANSLATION.USERS, value: "users" },
	{ label: TASKS_TRANSLATION.GROUPS, value: "groups" },
];

const TABS = {
	USERS: "users",
	GROUPS: "groups",
};

const UserAndGroup = ({ open, setOpen, filters, setFilters, resetFilter }) => {
	const user_id = useRecoilValue(userInfo).user_id;
	const role = useRecoilValue(userInfo).role;
	const user = useRecoilValue(userInfo);

	const [showOverlay, setShowOverlay] = useState(false);

	const [searchValue, setSearchValue] = useState("");
	const [tab, setTab] = useState(TABS.USERS);

	const { users, usersLoading } = useUsers({ users: open });
	const { subDepartments, subDepartmentsLoading } = useSubDepartments(
		tab === TABS.GROUPS
	);

	const onClose = () => setOpen(false);

	useEffect(() => {
		if (open) setShowOverlay(true);
	}, [open]);

	const onAnimationEnd = () => {
		if (!open) setShowOverlay(false);
	};

	const isAdmin = role === ROLES.ADMIN || role === ROLES.SUPER_ADMIN;

	return (
		showOverlay && (
			<div className={`${styles.wrapper} ${open ? styles.open : ""}`}>
				<div
					className={`${styles.container} ${open ? styles.open : styles.close}`}
					onAnimationEnd={onAnimationEnd}
				>
					<ThemedButton
						onClick={onClose}
						className={styles.closeBtn}
						theme={ThemedButtonThemes.ICON}
					>
						<Close />
					</ThemedButton>
					<div className={styles.title}>
						<span>
							{" "}
							{tab === TABS.GROUPS
								? TASKS_TRANSLATION.SELECT_A_GROUP[user?.language?.toUpperCase()]
								: TASKS_TRANSLATION.SELECT_A_USER[user?.language?.toUpperCase()]}
						</span>
						{tab === TABS.GROUPS ? (
							<ThemedButton
								theme={ThemedButtonThemes.TRANSPARENT}
								width="fit-content"
								onClick={() => resetFilter("sd_id")}
								style={{ display: !filters.sd_id ? "none" : "block" }}
							>
								<div>{COMMON_TRANSLATION.RESET[user?.language?.toUpperCase()]}</div>
							</ThemedButton>
						) : (
							<ThemedButton
								theme={ThemedButtonThemes.TRANSPARENT}
								width="fit-content"
								onClick={() => resetFilter("user_id")}
								style={{ display: !filters.user_id ? "none" : "block" }}
							>
								<div>{COMMON_TRANSLATION.RESET[user?.language?.toUpperCase()]}</div>
							</ThemedButton>
						)}
					</div>
					{isAdmin && (
						<TabNavSlider
							theme={TabNavThemes.GREY}
							buttons={BUTTONS.map(opt => ({
								label: opt.label[user?.language?.toUpperCase()],
								value: opt.value,
							}))}
							value={tab}
							setValue={setTab}
							className={styles.tabs}
							btnClassName={styles.tabBtns}
							activeBtnClassName={styles.tabBtnActive}
							activePillClassName={styles.activePill}
						/>
					)}
					<SearchBar
						width="100%"
						height="40px"
						value={searchValue}
						setValue={setSearchValue}
						placeholderText={
							tab === TABS.USERS
								? TEMPLATES_TRANSLATION.SEARCH_BY_USER[user?.language.toUpperCase()]
								: TEMPLATES_TRANSLATION.SEARCH_BY_USER[user?.language.toUpperCase()]
						}
					/>
					<ErrorBoundary>
						{tab === TABS.USERS ? (
							<div className={`${styles.list} ${isAdmin ? styles.admin : ""}`}>
								{usersLoading ? (
									<Placeholder />
								) : (
									users
										?.filter(user =>
											`${user.first_name} ${user.last_name}`
												.toLowerCase()
												.includes(searchValue.toLowerCase())
										)
										?.sort((a, b) => a.first_name.localeCompare(b.first_name))
										?.sort((a, b) => {
											if (a.user_id === user_id) return -1;
											return 0;
										})
										?.map(user => (
											<div
												key={user.user_id}
												onClick={() =>
													setFilters(prev => ({ ...prev, user_id: user.user_id }))
												}
												className={
													filters.user_id === user.user_id ? styles.selected : ""
												}
											>
												<div className={styles.info}>
													<Image
														src={
															user.is_profile_picture_present
																? user.profile_picture
																: "https://cdn.ringover.com/img/users/default.jpg"
														}
													/>
													<div>
														<span>
															{user_id === user.user_id
																? "You"
																: `${user.first_name} ${user.last_name}`}
														</span>
													</div>
												</div>
												<div className={styles.tick}>
													<Tick />
												</div>
											</div>
										))
								)}
							</div>
						) : (
							<div className={`${styles.list} ${styles.admin}`}>
								{subDepartmentsLoading ? (
									<Placeholder />
								) : (
									subDepartments
										?.filter(subd =>
											subd.name.toLowerCase().includes(searchValue.toLowerCase())
										)
										?.sort((a, b) => a.name.localeCompare(b.name))
										?.map(subd => (
											<div
												key={subd.sd_id}
												onClick={() =>
													setFilters(prev => ({ ...prev, sd_id: subd.sd_id }))
												}
												className={filters.sd_id === subd.sd_id ? styles.selected : ""}
											>
												<div className={styles.info}>
													<Image
														src={
															subd.is_profile_picture_present
																? subd.profile_picture
																: "https://cdn.ringover.com/img/users/default.jpg"
														}
													/>
													<div>
														<span>{subd.name}</span>
													</div>
												</div>
												<div className={styles.tick}>
													<Tick />
												</div>
											</div>
										))
								)}
							</div>
						)}
					</ErrorBoundary>
				</div>
			</div>
		)
	);
};

export default UserAndGroup;

const Placeholder = () => {
	return (
		<div className={styles.placeholder}>
			{[...Array(5).keys()].map(() => (
				<Div loading />
			))}
		</div>
	);
};
