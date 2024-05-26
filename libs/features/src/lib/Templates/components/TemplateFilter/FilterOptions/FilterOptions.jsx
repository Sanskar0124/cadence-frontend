import { useUsers, useSubDepartments } from "@cadence-frontend/data-access";

import { userInfo } from "@cadence-frontend/atoms";
import React, { useEffect, useState, useCallback, forwardRef } from "react";

import { useRecoilValue } from "recoil";
import { Leads, Tick } from "@cadence-frontend/icons";

import { Colors } from "@cadence-frontend/utils";
import { ProgressiveImg } from "@cadence-frontend/components";
// import {TABS}

import styles from "./FilterOptions.module.scss";

import { TABS } from "../../../../Statistics/components/SelectUser/constants";

import Placeholder from "../../../../Statistics/components/SelectUser/components/Placeholder/Placeholder";

const FilterOptions = ({ tab, filters, setFilters }) => {
	const curr_user_id = useRecoilValue(userInfo).user_id;
	const curr_name = useRecoilValue(userInfo).first_name;
	let { users, usersLoading } = useUsers({ users: tab === TABS.USERS });
	let { subDepartments, subDepartmentsLoading } = useSubDepartments(tab === TABS.GROUPS);

	const usersSelected = filters?.users;
	const groupsSelected = filters?.groups;

	const observer = useRef();
	const elementRef = useRef(null);

	const lastOptionRef = useCallback(
		cadence => {
			if (tab === CADENCE_TYPES.PERSONAL) return;
			if (isFetchingNextPage || isFetching) return;
			if (observer.current) observer.current.disconnect();
			observer.current = new IntersectionObserver(entries => {
				if (entries[0].isIntersecting && hasNextPage) fetchNextPage();
			});
			if (cadence) observer.current.observe(cadence);
		},
		[isFetchingNextPage, isFetching, hasNextPage]
	);

	const checkUserSelect = user_id => {
		return usersSelected?.includes(user_id);
	};

	const checkSubdepartmentSelect = sd_id => {
		return groupsSelected?.includes(sd_id);
	};

	const handleUserSelect = user_id => {
		usersSelected?.includes(user_id)
			? setFilters(prevState => {
					return {
						...prevState,
						users: prevState.users.filter(userId => userId !== user_id),
					};
			  })
			: setFilters(prevState => {
					return {
						...prevState,
						users: [...prevState.users, user_id],
					};
			  });
	};

	const handleGroupSelect = sd_id => {
		groupsSelected?.includes(sd_id)
			? setFilters(prevState => {
					return {
						...prevState,
						groups: prevState.groups.filter(ksd_id => sd_id !== ksd_id),
					};
			  })
			: setFilters(prevState => {
					return {
						...prevState,
						groups: [...prevState.groups, sd_id],
					};
			  });
	};

	return tab === TABS.USERS ? (
		usersLoading ? (
			<Placeholder rows={6} />
		) : (
			<div className={styles.list}>
				{users
					?.sort((a, b) =>
						b.first_name === "All_users" ? 1 : a.first_name.localeCompare(b.first_name)
					)

					?.map(user => (
						<UserRow
							user={user}
							checkUserSelect={checkUserSelect}
							checkSubdepartmentSelect={checkSubdepartmentSelect}
						/>
					))}
			</div>
		)
	) : subDepartmentsLoading ? (
		<Placeholder rows={6} />
	) : (
		<div className={styles.sdList}>
			{subDepartments
				?.sort((a, b) => a.name.localeCompare(b.name))
				?.map(subd => (
					<>
						<div
							key={subd.sd_id}
							onClick={() => handleGroupSelect(subd.sd_id)}
							className={`${styles.subd} ${
								checkSubdepartmentSelect(subd.sd_id) ? styles.selected : ""
							}`}
						>
							<div className={styles.info}>
								<ProgressiveImg
									src={
										subd.is_profile_picture_present
											? subd.profile_picture
											: "https://cdn.ringover.com/img/users/default.jpg"
									}
									className={styles.img}
								/>

								<div>
									<span>{subd.name}</span>
								</div>
							</div>
							<div className={styles.tick}>
								<Tick />
							</div>
						</div>
					</>
				))}
		</div>
	);
};

const UserRow = forwardRef(({ user, handleUserSelect, checkUserSelect }, ref) => {
	return (
		<div
			key={user.user_id}
			onClick={() => handleUserSelect(user.user_id)}
			className={`${styles.user} ${checkUserSelect(user.user_id) ? styles.selected : ""}`}
			ref={ref}
		>
			<div className={styles.info}>
				<ProgressiveImg src={user.profile_picture} className={styles.img} />

				<div>
					<span>
						{user.first_name} {user.last_name}
					</span>
					<span>{user?.Sub_Department?.name}</span>
				</div>
			</div>
			<div className={styles.tick}>
				<Tick />
			</div>
		</div>
	);
});

const GroupRow = forwardRef();

export default FilterOptions;
