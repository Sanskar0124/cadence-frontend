import React, { useState } from "react";
import styles from "./ShareCadenceList.module.scss";
import { Input, ThemedButton } from "@cadence-frontend/widgets";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import {
	Cadence as CADENCE_TRANSLATION,
	Common as COMMON_TRANSLATION,
} from "@cadence-frontend/languages";
import { Tick, TriangleDown } from "@cadence-frontend/icons";
import { ProgressiveImg } from "@cadence-frontend/components";
import { CADENCE_TYPES } from "@cadence-frontend/constants";

function ShareCadenceList({
	list,
	listLoading,
	selectedRecipients,
	setSelectedRecipients,
	dropdownBtnRef,
	elementRef,
	isDropdown,
	setIsDropdown,
	user,
	type,
	...rest
}) {
	const getId = () => {
		if (type === CADENCE_TYPES.PERSONAL) {
			return `user_id`;
		} else if (type === CADENCE_TYPES.TEAM) {
			return `sd_id`;
		}
	};
	const [searchValue, setSearchValue] = useState("");

	const handleSelectRecipient = recipient => {
		try {
			if (
				selectedRecipients?.filter(rec => rec?.[getId()] === recipient?.[getId()])
					?.length > 0
			)
				setSelectedRecipients(prev =>
					prev?.filter(rec_id => rec_id?.[getId()] !== recipient?.[getId()])
				);
			else setSelectedRecipients(prev => [...prev, recipient]);
		} catch (err) {
			// do nothing
		}
	};

	return (
		<div className={styles.selectRecipient}>
			<ThemedButton
				theme={ThemedButtonThemes.WHITE}
				className={styles.selectRecipientBtn}
				ref={dropdownBtnRef}
			>
				<div className={styles.searchBar}>
					<Input
						value={searchValue}
						setValue={setSearchValue}
						placeholder={"Search Recipient By Name"}
					/>
					<TriangleDown
						onClick={() => {
							if (isDropdown) setIsDropdown(false);
						}}
					/>
				</div>
			</ThemedButton>
			<div
				className={`${styles.dropdown} ${isDropdown ? styles.open : ""}`}
				ref={elementRef}
			>
				{isDropdown && (
					<div className={styles.list}>
						{listLoading ? (
							<div className={styles.emptyStateForSearch}>Loading Recipient List</div>
						) : list
								?.filter(rec => rec?.[getId()] !== user?.[getId()])
								?.filter(rec => {
									let name;
									if (type === CADENCE_TYPES.PERSONAL)
										name = rec?.first_name + " " + rec?.last_name;
									else if (type === CADENCE_TYPES.TEAM) name = rec?.name;
									if (name?.toLowerCase()?.includes(searchValue?.toLowerCase() || ""))
										return true;
									return false;
								})?.length <= 0 ? (
							<div className={styles.emptyStateForSearch}>No users found</div>
						) : (
							list
								?.filter(rec => rec?.[getId()] !== user?.[getId()])
								?.filter(rec => {
									let name;
									if (type === CADENCE_TYPES.PERSONAL)
										name = rec?.first_name + " " + rec?.last_name;
									else if (type === CADENCE_TYPES.TEAM) name = rec?.name;
									if (name?.toLowerCase()?.includes(searchValue?.toLowerCase() || ""))
										return true;
									return false;
								})
								?.map((recipient, index) => (
									<div
										key={index}
										onClick={() => {
											handleSelectRecipient(recipient);
										}}
										className={`${styles.selectRecipient} ${
											selectedRecipients?.filter(
												rec => rec?.[getId()] === recipient?.[getId()]
											)?.length > 0
												? styles.selected
												: ""
										}`}
									>
										<div className={styles.info}>
											<div className={styles.icon}>
												<ProgressiveImg
													className={styles.logo}
													src={recipient?.profile_picture}
													alt="profile_picture"
												/>
											</div>
											<div className={styles.metadata}>
												<span className={styles.name}>
													{type === CADENCE_TYPES.PERSONAL
														? `${recipient?.first_name + ` ${recipient?.last_name}`}`
														: type === CADENCE_TYPES.TEAM
														? `${recipient?.name}`
														: ""}
												</span>
												{type === CADENCE_TYPES.PERSONAL && (
													<span className={styles.subDepartment}>
														{recipient?.Sub_Department?.name}
													</span>
												)}
											</div>
										</div>
										{selectedRecipients?.filter(
											rec => rec?.[getId()] === recipient?.[getId()]
										)?.length > 0 && (
											<div className={styles.tick}>
												<Tick />
											</div>
										)}
									</div>
								))
						)}
					</div>
				)}
			</div>
		</div>
	);
}

export default ShareCadenceList;
