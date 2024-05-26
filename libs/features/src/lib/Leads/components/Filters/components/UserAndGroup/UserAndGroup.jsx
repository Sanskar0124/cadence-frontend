import { useEmployees } from "@cadence-frontend/data-access";
import { Close, Tick } from "@cadence-frontend/icons";
import { TabNavThemes, ThemedButtonThemes } from "@cadence-frontend/themes";
import { Button, ErrorBoundary, Image } from "@cadence-frontend/components";
import { SearchBar, TabNavSlider, ThemedButton } from "@cadence-frontend/widgets";
import { userInfo } from "@cadence-frontend/atoms";
import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import styles from "./UserAndGroup.module.scss";
import { Tasks as TASKS_TRANSLATION } from "@cadence-frontend/languages";

// const BUTTONS = [
// 	{ label: "Users", value: "users" },
// 	{ label: "Groups", value: "groups" },
// ];

const UserAndGroup = ({ open, setOpen, userId, setUserId }) => {
	const user = useRecoilValue(userInfo);
	// const [tab, setTab] = useState("users");
	const [searchValue, setSearchValue] = useState("");
	// const [list, setList] = useState([]);
	const { employees } = useEmployees(true, user.role);

	// useEffect(() => {
	// 	if (tab === "users") setList(TEMP_DATA);
	// 	else setList(TEMP_DATA);
	// }, [tab]);

	const handleSearch = () => {
		return null;
	};

	const onClose = () => {
		setOpen(false);
	};

	return (
		<div className={`${styles.wrapper} ${open ? styles.open : styles.close}`}>
			<div className={`${styles.container} ${open ? styles.open : styles.close}`}>
				<ThemedButton
					onClick={onClose}
					className={styles.closeBtn}
					theme={ThemedButtonThemes.ICON}
				>
					<Close color={"#000"} />
				</ThemedButton>
				<div className={styles.title}>
					{TASKS_TRANSLATION.SELECT_A_USER[user?.language?.toUpperCase()]}
				</div>
				{/* <TabNavSlider
					theme={TabNavThemes.GREY}
					buttons={BUTTONS}
					value={tab}
					setValue={setTab}
					btnWidth="180px"
					className={styles.tabs}
					btnClassName={styles.tabBtns}
					activeBtnClassName={styles.tabBtnActive}
					activePillClassName={styles.activePill}
				/> */}
				<SearchBar
					width="100%"
					height="40px"
					value={searchValue}
					setValue={setSearchValue}
					onSearch={handleSearch}
				/>
				<div className={styles.list}>
					<ErrorBoundary>
						{employees
							?.filter(user =>
								`${user.first_name} ${user.last_name}`
									.toLowerCase()
									.includes(searchValue.toLowerCase())
							)
							?.sort((a, b) => a.first_name.localeCompare(b.first_name))
							?.map(user => (
								<div
									key={user.user_id}
									onClick={() => setUserId(user.user_id)}
									className={userId === user.user_id ? styles.selected : ""}
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
							))}
					</ErrorBoundary>
				</div>
			</div>
		</div>
	);
};

export default UserAndGroup;

const TEMP_DATA = [
	{ id: 1 },
	{ id: 2 },
	{ id: 3 },
	{ id: 4 },
	{ id: 5 },
	{ id: 6 },
	{ id: 7 },
	{ id: 8 },
];
