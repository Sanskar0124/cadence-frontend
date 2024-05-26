import React, { useState, useEffect, useContext, useRef } from "react";

import styles from "./Feeds.module.scss";

//components
import { ThemedButton } from "@cadence-frontend/widgets";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { TriangleDown, Tick } from "@cadence-frontend/icons";

import { useTasks } from "@cadence-frontend/data-access";
import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue } from "recoil";
import { MessageContext } from "@cadence-frontend/contexts";
import { useLead } from "@cadence-frontend/data-access";

import { tempActivities } from "./components/LiveFeeds/tempData";

import { Filters } from "./constants";
import LiveFeeds from "./components/LiveFeeds/LiveFeeds";

import { useOutsideClickHandler } from "@cadence-frontend/utils";
import {
	Home as HOME_TRANSLATION,
	Common as COMMON_TRANSLATION,
} from "@cadence-frontend/languages";
import { ErrorBoundary } from "@cadence-frontend/components";

const Feeds = () => {
	const user = useRecoilValue(userInfo);
	const { addError } = useContext(MessageContext);
	const { setActiveLeadId } = useLead();

	const elementRef = useRef(null);
	const dropdownBtnRef = useRef();

	const { userId } = useTasks({ tasks: true, taskActivity: true }, user.role);

	const [filter, setFilter] = useState(
		JSON.parse(localStorage.getItem("home-feed-filters")) ?? ["all"]
	);
	const [isDropdown, setIsDropdown] = useState(false);

	const outsideClickCb = e => {
		if (dropdownBtnRef.current.contains(e.target)) {
			setIsDropdown(prev => !prev);
			e.stopPropagation();
		} else setIsDropdown(false);
	};

	useOutsideClickHandler(elementRef, outsideClickCb);

	useEffect(() => {
		localStorage.setItem("home-feed-filters", JSON.stringify(filter));
	}, [filter]);

	return (
		<ErrorBoundary>
			<div className={styles.feed}>
				<div className={styles.header}>
					<h2>{HOME_TRANSLATION.PEOPLE_LIVE_FEED[user?.language?.toUpperCase()]}</h2>
					<div className={styles.filter}>
						<ThemedButton
							theme={ThemedButtonThemes.WHITE}
							className={styles.selectFilterBtn}
							ref={dropdownBtnRef}
						>
							<div>
								{filter.length > 0 && !filter.includes("all")
									? `${filter.length} ${
											COMMON_TRANSLATION.FILTER[user?.language?.toUpperCase()]
									  }(s)`
									: `${COMMON_TRANSLATION.ALL_FILTERS[user?.language?.toUpperCase()]}`}
							</div>
							<TriangleDown />
						</ThemedButton>

						<div
							ref={elementRef}
							className={`${styles.dropdown} ${isDropdown ? styles.open : ""}`}
						>
							{isDropdown && (
								<>
									<div className={styles.totalSelected}>
										<span>
											{COMMON_TRANSLATION.TOTAL_SELECTED[user?.language.toUpperCase()]} :{" "}
											{filter.includes("all") ? 0 : `${filter.length}`}
										</span>
										{filter.length > 0 && filter[0] !== "all" && (
											<ThemedButton
												theme={ThemedButtonThemes.TRANSPARENT}
												width="fit-content"
												onClick={() => setFilter(["all"])}
											>
												<div>
													{COMMON_TRANSLATION.CLEAR[user?.language?.toUpperCase()]}
												</div>
											</ThemedButton>
										)}
									</div>
									<div className={styles.list}>
										{Filters?.map((fill, index) => (
											<div
												key={index}
												onClick={() => {
													if (fill.value === "all") setFilter(["all"]);
													else
														setFilter(prev => {
															let ar = prev.filter(i => i !== "all");
															return ar.includes(fill.value)
																? ar.filter(i => i !== fill.value).length === 0
																	? ["all"]
																	: ar.filter(i => i !== fill.value)
																: [...ar, fill.value];
														});
												}}
												className={`${styles.filter} ${
													filter.includes(fill.value) ? styles.selected : ""
												}`}
											>
												<div className={styles.info}>
													<div className={styles.icon}>
														{filter.includes(fill.value) ? fill.gradientIcon : fill.icon}
													</div>
													<div>
														<span
														// style={{ textTransform: index !== 0 ? "capitalize" : "" }}
														>
															{fill.text[user?.language?.toUpperCase()]}
														</span>
													</div>
												</div>
												{filter.includes(fill.value) && (
													<div className={styles.tick}>
														<Tick />
													</div>
												)}
											</div>
										))}
									</div>
								</>
							)}
						</div>
					</div>
				</div>
				<LiveFeeds
					setActiveLeadId={setActiveLeadId}
					leadLoading={false}
					userId={userId}
					filter={filter}
				/>
			</div>
		</ErrorBoundary>
	);
};

export default Feeds;
