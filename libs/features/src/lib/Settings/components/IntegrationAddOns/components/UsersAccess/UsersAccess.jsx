import { useState, useEffect } from "react";
import { useRecoilValue } from "recoil";

import { Image, Title } from "@cadence-frontend/components";
import { Label, ThemedButton, Checkbox, Toggle } from "@cadence-frontend/widgets";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import { userInfo } from "@cadence-frontend/atoms";

import Placeholder from "../IntegrationPlaceholder/Placeholder";

import styles from "./UsersAccess.module.scss";

const UsersAccess = ({
	accessLoading,
	subDepartments,
	checkedUserIds,
	setCheckedUserIds,
	uncheckedUserIds,
	setUncheckedUserIds,
	enabledSdIds,
	setEnabledSdIds,
	disabledSdIds,
	setDisabledSdIds,
	userAccessField,
	sdNewUserAccessField,
}) => {
	const user = useRecoilValue(userInfo);

	const [subDepartmentsData, setSubDepartmentsData] = useState([]);
	const [selectedSDIndex, setSelectedSDIndex] = useState(0);

	useEffect(() => {
		if (subDepartments) setSubDepartmentsData(subDepartments);
	}, [subDepartments]);

	const handleClearAll = () => {
		const sds = [...subDepartmentsData];
		const users = subDepartmentsData[selectedSDIndex].Users.map(user => ({
			...user,
			User_Token: { ...user.User_Token, [userAccessField]: false },
		}));
		sds[selectedSDIndex].Users = users;
		setSubDepartmentsData(sds);

		const userIds = subDepartments[selectedSDIndex].Users.map(user => user.user_id);
		setUncheckedUserIds(prev => [...new Set([...prev, ...userIds])]);
		setCheckedUserIds(prev => [
			...new Set(prev.filter(userId => !userIds.includes(userId))),
		]);
	};

	const handleUserCheck = (user_id, currValue) => {
		const sds = [...subDepartmentsData];
		const users = subDepartmentsData[selectedSDIndex].Users.map(user => {
			if (user.user_id === user_id)
				return {
					...user,
					User_Token: { ...user.User_Token, [userAccessField]: !currValue },
				};
			else return user;
		});
		sds[selectedSDIndex].Users = users;
		setSubDepartmentsData(sds);

		if (checkedUserIds.includes(user_id)) {
			setCheckedUserIds(prev => [...new Set(prev.filter(userId => userId !== user_id))]);
			return;
		} else if (uncheckedUserIds.includes(user_id)) {
			setUncheckedUserIds(prev => [
				...new Set(prev.filter(userId => userId !== user_id)),
			]);
			return;
		}

		if (currValue) {
			setUncheckedUserIds(prev => [...new Set([...prev, user_id])]);
			setCheckedUserIds(prev => [...new Set(prev.filter(userId => userId !== user_id))]);
		} else {
			setCheckedUserIds(prev => [...new Set([...prev, user_id])]);
			setUncheckedUserIds(prev => [
				...new Set(prev.filter(userId => userId !== user_id)),
			]);
		}
	};

	const isSDChecked = index => {
		if (!subDepartmentsData[index].Users.length) return false;

		for (const user of subDepartmentsData[index].Users)
			if (user.User_Token?.[userAccessField]) return true;

		return false;
	};

	const handleSDCheck = (e, index) => {
		if (!subDepartmentsData[index].Users.length) return false;

		const isChecked = isSDChecked(index);
		const sds = [...subDepartmentsData];
		const users = subDepartmentsData[index].Users.map(user => ({
			...user,
			User_Token: { ...user.User_Token, [userAccessField]: !isChecked },
		}));
		sds[selectedSDIndex].Users = users;
		setSubDepartmentsData(sds);

		const userIds = users.map(user => user.user_id);

		if (isChecked) {
			setUncheckedUserIds(prev => [...new Set([...prev, ...userIds])]);
			setCheckedUserIds(prev => [
				...new Set(prev.filter(userId => !userIds.includes(userId))),
			]);
		} else {
			setCheckedUserIds(prev => [...new Set([...prev, ...userIds])]);
			setUncheckedUserIds(prev => [
				...new Set(prev.filter(userId => !userIds.includes(userId))),
			]);
		}
	};

	const handleNewUsersAccessChange = () => {
		const sd = subDepartmentsData[selectedSDIndex];
		const value = sd.Sub_Department_Setting[sdNewUserAccessField];
		const sds = [...subDepartmentsData];
		sds[selectedSDIndex].Sub_Department_Setting[sdNewUserAccessField] = !value;
		setSubDepartmentsData(sds);

		if (enabledSdIds.includes(sd.sd_id)) {
			setEnabledSdIds(prev => [...new Set(prev.filter(sd_id => sd_id !== sd.sd_id))]);
			return;
		} else if (disabledSdIds.includes(sd.sd_id)) {
			setDisabledSdIds(prev => [...new Set(prev.filter(sd_id => sd_id !== sd.sd_id))]);
			return;
		}

		if (value) {
			setDisabledSdIds(prev => [...new Set([...prev, sd.sd_id])]);
			setEnabledSdIds(prev => [...new Set(prev.filter(sd_id => sd_id !== sd.sd_id))]);
		} else {
			setEnabledSdIds(prev => [...new Set([...prev, sd.sd_id])]);
			setDisabledSdIds(prev => [...new Set(prev.filter(sd_id => sd_id !== sd.sd_id))]);
		}
	};

	return (
		<div className={styles.teamsSettings}>
			<Title size="1.1rem">
				{COMMON_TRANSLATION.GROUPS_AND_MEMBERS[user?.language?.toUpperCase()]}
			</Title>
			<div className={styles.divider} />
			<div className={styles.teamsContainer}>
				<div className={styles.teams}>
					{accessLoading && <Placeholder number={6} width="230px" />}
					{subDepartmentsData?.map((sd, index) => (
						<div
							className={`${styles.team} ${
								index === selectedSDIndex ? styles.active : ""
							}`}
							onClick={() => setSelectedSDIndex(index)}
							key={sd.sd_id}
						>
							{isSDChecked(index) ? (
								<Checkbox checked={true} onChange={e => handleSDCheck(e, index)} />
							) : (
								<Checkbox checked={false} onChange={e => handleSDCheck(e, index)} />
							)}

							<Image
								src={
									sd.name === "Admin"
										? "https://storage.googleapis.com/apt-cubist-307713.appspot.com/admins-icon.png"
										: sd.profile_picture
								}
								onError={({ currentTarget }) => {
									currentTarget.onerror = null; // prevents looping
									currentTarget.src = "https://cdn.ringover.com/img/users/default.jpg";
								}}
							/>
							<h4>{sd.name}</h4>
						</div>
					))}
				</div>
				<div className={styles.users}>
					<div className={styles.usersHeader}>
						{selectedSDIndex !== 0 && (
							<div className={styles.userDefaultAccess}>
								<p>
									{
										COMMON_TRANSLATION.GIVE_ACCESS_TO_NEWLY_ADDED_USERS[
											user?.language?.toUpperCase()
										]
									}
								</p>
								<Toggle
									checked={
										subDepartmentsData[selectedSDIndex]?.Sub_Department_Setting?.[
											sdNewUserAccessField
										]
									}
									onChange={handleNewUsersAccessChange}
									className={styles.toggle}
									theme="PURPLE"
								/>
							</div>
						)}
						{!!subDepartmentsData[selectedSDIndex]?.Users.length && (
							<ThemedButton
								theme={ThemedButtonThemes.TRANSPARENT}
								className={styles.clearAllBtn}
								width="auto"
								onClick={handleClearAll}
							>
								<div>{COMMON_TRANSLATION.CLEAR_ALL[user?.language?.toUpperCase()]}</div>
							</ThemedButton>
						)}
					</div>
					{!!subDepartmentsData[selectedSDIndex]?.Users.length && (
						<div className={styles.user}>
							<div className={styles.left}>
								<Label className={styles.label}>
									{COMMON_TRANSLATION.MEMBERS[user?.language?.toUpperCase()]}
								</Label>
							</div>
							<div className={styles.right}>
								<Label>{COMMON_TRANSLATION.ACCESS[user?.language?.toUpperCase()]}</Label>
							</div>
						</div>
					)}
					{accessLoading && <Placeholder number={9} width="250px" />}
					{subDepartmentsData &&
						subDepartmentsData[selectedSDIndex]?.Users?.map(user => (
							<div className={styles.user} key={user.user_id}>
								<div className={styles.left}>
									<Image
										src={user.profile_picture}
										onError={({ currentTarget }) => {
											currentTarget.onerror = null; // prevents looping
											currentTarget.src =
												"https://cdn.ringover.com/img/users/default.jpg";
										}}
									/>
									<h4>{`${user.first_name} ${user.last_name}`}</h4>
								</div>
								<div className={styles.right}>
									<Checkbox
										checked={user.User_Token?.[userAccessField]}
										onChange={() =>
											handleUserCheck(user.user_id, user.User_Token?.[userAccessField])
										}
									/>
								</div>
							</div>
						))}
				</div>
			</div>
		</div>
	);
};

export default UsersAccess;
