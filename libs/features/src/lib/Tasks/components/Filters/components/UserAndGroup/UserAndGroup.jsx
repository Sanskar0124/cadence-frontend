import { ROLES } from "@cadence-frontend/constants";
import { useEmployees, useSubDepartments } from "@cadence-frontend/data-access";
import { ArrowDown, Close, Tick, TriangleDown } from "@cadence-frontend/icons";
import { TabNavThemes, ThemedButtonThemes } from "@cadence-frontend/themes";
import { Button, Div, ErrorBoundary, Image } from "@cadence-frontend/components";
import { SearchBar, TabNavSlider, ThemedButton } from "@cadence-frontend/widgets";
import { userInfo } from "@cadence-frontend/atoms";
import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import styles from "./UserAndGroup.module.scss";
import {
	Common as COMMON_TRANSLATION,
	Tasks as TASKS_TRANSLATION,
} from "@cadence-frontend/languages";

const BUTTONS = [
	{ label: TASKS_TRANSLATION.USERS, value: "users" },
	{ label: TASKS_TRANSLATION.GROUPS, value: "groups" },
];

const TABS = {
	USERS: "users",
	GROUPS: "groups",
};

const UserAndGroup = ({
	open,
	setOpen,
	userId,
	setUserId,
	setSelectedUser,
	resetCadenceFilter,
}) => {
	const role = useRecoilValue(userInfo).role;
	const [accordian, setAccordian] = useState(null);
	const [tab, setTab] = useState(TABS.USERS);
	const [searchValue, setSearchValue] = useState("");
	const user = useRecoilValue(userInfo);
	const { employees, employeesLoading } = useEmployees(
		userId ? true : open,
		role,
		accordian
	);
	const { subDepartments, subDepartmentsLoading } = useSubDepartments(
		tab === TABS.GROUPS
	);

	const onClose = () => {
		setOpen(false);
	};

	const [showOverlay, setShowOverlay] = useState(false);

	useEffect(() => {
		if (open) setShowOverlay(true);
	}, [open]);

	const onAnimationEnd = () => {
		if (!open) setShowOverlay(false);
	};

	useEffect(() => {
		if (userId && employees) {
			let selectedUser = employees?.find(user => user.user_id === userId);
			if (selectedUser)
				setSelectedUser(`${selectedUser?.first_name} ${selectedUser?.last_name}`);
		}
	}, [userId, employees]);

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
						<Close color={"#000"} />
					</ThemedButton>
					<div className={styles.title}>
						{tab === TABS.GROUPS
							? TASKS_TRANSLATION.SELECT_A_GROUP[user?.language?.toUpperCase()]
							: TASKS_TRANSLATION.SELECT_A_USER[user?.language?.toUpperCase()]}
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
						height="50px"
						value={searchValue}
						setValue={setSearchValue}
					/>
					<ErrorBoundary>
						{tab === TABS.USERS ? (
							<div className={`${styles.employeeList} ${isAdmin ? styles.admin : ""}`}>
								{employeesLoading ? (
									<Placeholder />
								) : (
									employees
										?.filter(user =>
											`${user.first_name} ${user.last_name}`
												.toLowerCase()
												.includes(searchValue.toLowerCase())
										)
										?.sort((a, b) => a.first_name.localeCompare(b.first_name))
										?.map(user => (
											<div
												key={user.user_id}
												onClick={() => {
													setUserId(user?.user_id);
													resetCadenceFilter();
												}}
												className={`${userId === user.user_id ? styles.selected : ""}`}
											>
												<div className={styles.info}>
													<Image src={user.profile_picture} />
													<div>
														<span>
															{user.first_name} {user.last_name}
														</span>
														<span>{user.Sub_Department.name}</span>
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
							<div className={styles.sdList}>
								{subDepartmentsLoading ? (
									<Placeholder />
								) : (
									subDepartments
										?.filter(subd =>
											subd.name.toLowerCase().includes(searchValue.toLowerCase())
										)
										?.sort((a, b) => a.name.localeCompare(b.name))
										?.map(subd => (
											<>
												<div
													key={subd.sd_id}
													onClick={() =>
														setAccordian(prev =>
															prev === subd.sd_id ? null : subd.sd_id
														)
													}
													className={accordian === subd.sd_id ? styles.selected : ""}
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
													<div className={styles.arrow}>
														<TriangleDown />
													</div>
												</div>
												{accordian === subd.sd_id && (
													<div className={styles.dropdown}>
														{employeesLoading ? (
															<Placeholder />
														) : employees.length > 0 ? (
															employees
																?.sort((a, b) => a.first_name.localeCompare(b.first_name))
																?.map(user => (
																	<div
																		key={user.user_id}
																		onClick={() => {
																			setUserId(user?.user_id);
																			resetCadenceFilter();
																		}}
																		className={`${
																			userId === user.user_id ? styles.selected : ""
																		}`}
																	>
																		<div className={styles.info}>
																			<Image src={user.profile_picture} />
																			<div>
																				<span>
																					{user.first_name} {user.last_name}
																				</span>
																			</div>
																		</div>
																		<div className={styles.tick}>
																			<Tick />
																		</div>
																	</div>
																))
														) : (
															<span className={styles.noEmp}>
																{
																	COMMON_TRANSLATION.NO_EMPLOYEES_PRESENT[
																		user?.language?.toUpperCase()
																	]
																}
															</span>
														)}
													</div>
												)}
											</>
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
			{[...Array(6).keys()].map(() => (
				<Div loading />
			))}
		</div>
	);
};
