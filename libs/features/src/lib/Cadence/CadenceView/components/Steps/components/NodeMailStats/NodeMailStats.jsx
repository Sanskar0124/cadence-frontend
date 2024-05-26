import { useEffect, useState, useCallback, useRef } from "react";
import { useCadenceStepStats, useNodeStats } from "@cadence-frontend/data-access";

import styles from "./NodeMailStats.module.scss";
import { Button, Tooltip } from "@cadence-frontend/components";
import {
	Unsubscribe,
	Bounced,
	Close,
	ClickGradient as Click,
	Reply,
	CheckCircle2,
	LeadsGradient,
	ViewGradient,
	SkipGradient,
	TimeGradient,
	RefreshGradient,
	MinusGradient2,
	PauseYellowGradient,
} from "@cadence-frontend/icons";
import { SearchBar, ThemedButton } from "@cadence-frontend/widgets";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import {
	Cadence as CADENCE_TRANSLATION,
	Common as COMMON_TRANSLATION,
	Tasks as TASKS_TRANSLATION,
} from "@cadence-frontend/languages";
import LeadsWrapper from "./LeadsWrapper";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";
import Placeholder from "./components/Placeholder/Placeholder";
import { Colors } from "@cadence-frontend/utils";

const header = {
	BOUNCED: [COMMON_TRANSLATION.BOUNCED_MAILS, <Bounced size="1.43em" />, "Bounced mail"],
	CLICKED: [
		COMMON_TRANSLATION.LINK_CLICKED,
		<Click size="1.2em" color="black" />,
		"Link clicked",
	],
	PEOPLE: [CADENCE_TRANSLATION.ACTIVE_PEOPLE, <LeadsGradient size="1.2em" />],
	OPENED: [COMMON_TRANSLATION.MAIL_VIEWED, <ViewGradient size="1.35em" />, "Viewed mail"],
	UNSUBSCRIBED: [
		COMMON_TRANSLATION.UNSUBSCRIBED_PEOPLE,
		<Unsubscribe size="1.43em" color={Colors.red} />,
		"Unsubscribed",
	],
	REPLIED: [COMMON_TRANSLATION.REPLIED_MAILS, <Reply size="1.2em" />, "Replied"],
	DONETASKS: [TASKS_TRANSLATION.DONE_TASKS, <CheckCircle2 size="1.12em" />],
	SKIPPEDTASKS: [TASKS_TRANSLATION.SKIPPED_TASKS, <SkipGradient size="1.28em" />],
	PAUSEDLEADS: [CADENCE_TRANSLATION.PAUSED_LEADS, <PauseYellowGradient size="1.43em" />],
	SCHEDULEDTASKS: [TASKS_TRANSLATION.SCHEDULED_TASKS, <TimeGradient size="1.15em" />],
	CONVERTEDLEADS: [
		CADENCE_TRANSLATION.CONVERTED_LEADS,
		<RefreshGradient size="1.15em" />,
	],
	DISQUALIFIEDLEADS: [
		CADENCE_TRANSLATION.DISQUALIFIED_LEADS,
		<MinusGradient2 size="1.15em" />,
	],
};

const maps = {
	PEOPLE: "current",
	DONETASKS: "done",
	SKIPPEDTASKS: "skipped",
	PAUSEDLEADS: "paused",
	DISQUALIFIEDLEADS: "trash",
	CONVERTEDLEADS: "converted",
	SCHEDULEDTASKS: "scheduled",

	BOUNCED: "bounced",
	CLICKED: "clicked",
	OPENED: "opened",
	UNSUBSCRIBED: "unsubscribed",
	REPLIED: "replied",
};

const NodeMailStats = ({ statsData, onClose, cadence }) => {
	const observer = useRef();
	const [query, setQuery] = useState("");
	const user = useRecoilValue(userInfo);
	const { node_id, stats, type, isSMS } = statsData;
	const {
		statsLeads,
		statsLeadsLoading,
		fetchNextPage,
		hasNextPage,
		isFetching,
		isFetchingNextPage,
	} = useCadenceStepStats(node_id, maps[type], stats?.ab_template_id, isSMS, query);
	const leadsWrapperHeight = (() => {
		switch (type) {
			case "PEOPLE":
			case "DONETASKS":
			case "PAUSEDLEADS":
			case "SKIPPEDTASKS":
			case "SCHEDULEDTASKS":
			case "CONVERTEDLEADS":
			case "DISQUALIFIEDLEADS":
				return "calc(100vh - 395px)";
			default:
				return "calc(100vh - 440px)";
		}
	})();

	useEffect(() => {
		setQuery("");
	}, [statsData]);

	const showTotalStats = type => {
		switch (type) {
			case "PEOPLE":
				return (
					<div className={styles.highlightBox}>
						<p>{`${CADENCE_TRANSLATION.ACTIVE_PEOPLE[user?.language?.toUpperCase()]}`}</p>
						<span>{stats?.count ?? 0}</span>
					</div>
				);
			case "DONETASKS":
				return (
					<div className={`${styles.highlightBox} ${styles.green}`}>
						<p>{`${
							TASKS_TRANSLATION.TOTAL_DONE_TASKS[user?.language?.toUpperCase()]
						}`}</p>
						<span>{stats?.count ?? 0}</span>
					</div>
				);
			case "SKIPPEDTASKS":
				return (
					<div className={`${styles.highlightBox} ${styles.pink}`}>
						<p>{`${
							TASKS_TRANSLATION.TOTAL_SKIPPED_TASKS[user?.language?.toUpperCase()]
						}`}</p>
						<span>{stats?.count ?? 0}</span>
					</div>
				);
			case "PAUSEDLEADS":
				return (
					<div className={`${styles.highlightBox} ${styles.orange}`}>
						<p>{`${
							CADENCE_TRANSLATION.TOTAL_PAUSED_LEADS[user?.language?.toUpperCase()]
						}`}</p>
						<span>{stats?.count ?? 0}</span>
					</div>
				);
			case "SCHEDULEDTASKS":
				return (
					<div className={`${styles.highlightBox} ${styles.orange}`}>
						<p>{`${
							TASKS_TRANSLATION.TOTAL_SCHEDULED_TASKS[user?.language?.toUpperCase()]
						}`}</p>
						<span>{stats?.count ?? 0}</span>
					</div>
				);
			case "CONVERTEDLEADS":
				return (
					<div className={`${styles.highlightBox} ${styles.green}`}>
						<p>{`${
							CADENCE_TRANSLATION.TOTAL_CONVERTED_LEADS[user?.language?.toUpperCase()]
						}`}</p>
						<span>{stats?.count ?? 0}</span>
					</div>
				);
			case "DISQUALIFIEDLEADS":
				return (
					<div className={`${styles.highlightBox} ${styles.red}`}>
						<p>{`${
							CADENCE_TRANSLATION.TOTAL_DISQUALIFIED_LEADS[user?.language?.toUpperCase()]
						}`}</p>
						<span>{stats?.count ?? 0}</span>
					</div>
				);
			default:
				return (
					<>
						<div className={styles.statWrapper}>
							<div
								className={`${styles.highlightBox} ${
									type === "BOUNCED" || type === "UNSUBSCRIBED" ? styles.red : ""
								}`}
							>
								<p>% {header[type]?.[2]}</p>
								<span>{stats?.total_sent === 0 ? "..." : stats?.percentage + "%"}</span>
							</div>
							<div
								className={`${styles.highlightBox} ${
									type === "BOUNCED" || type === "UNSUBSCRIBED" ? styles.red : ""
								}`}
							>
								<p>{header[type]?.[2]}</p>
								<span>{stats?.count}</span>
							</div>
						</div>
						<div
							className={`${styles.highlightBox} ${
								type === "BOUNCED" || type === "UNSUBSCRIBED" ? styles.red : ""
							}`}
						>
							<p>
								{`${
									CADENCE_TRANSLATION?.TOTAL_MAILS_SENT[user?.language?.toUpperCase()]
								}`}
							</p>
							<span>{stats?.total_sent}</span>
						</div>
					</>
				);
		}
	};

	const lastCadenceRef = useCallback(
		cadence => {
			if (isFetchingNextPage || isFetching) return;
			if (observer.current) observer.current.disconnect();
			observer.current = new IntersectionObserver(entries => {
				if (entries[0].isIntersecting && hasNextPage) fetchNextPage();
			});
			if (cadence) observer.current.observe(cadence);
		},
		[isFetchingNextPage, isFetching, hasNextPage]
	);

	return (
		<div className={styles.NodeMailStats}>
			<div className={styles.header}>
				<ThemedButton
					className={styles.closeBtn}
					onClick={onClose}
					theme={ThemedButtonThemes.ICON}
				>
					<Tooltip text={COMMON_TRANSLATION.CLOSE[user?.language?.toUpperCase()]}>
						<Close color={"#567191"} />
					</Tooltip>
				</ThemedButton>
				<h3>
					{header[type]?.[1]}
					<span>{header[type]?.[0]?.[user?.language?.toUpperCase()]}</span>
				</h3>
			</div>
			<div className={styles.main}>
				{showTotalStats(type)}
				<div className={styles.searchBarWrapper}>
					<SearchBar
						width="100%"
						value={query}
						setValue={setQuery}
						height="44px"
						className={styles.searchBar}
					/>
				</div>

				<div className={styles.leadsWrapper} style={{ height: leadsWrapperHeight }}>
					{statsLeadsLoading && <Placeholder rows={5} />}
					{statsLeads?.map((lead, index) => {
						const isLastCadence = index === statsLeads.length - 1;
						return isLastCadence ? (
							<>
								<LeadsWrapper
									lead={lead}
									cadence={cadence}
									key={lead?.lead_id}
									ref={statsLeads?.length > 9 ? lastCadenceRef : null}
								/>
								{isFetchingNextPage && <Placeholder rows={1} />}
							</>
						) : (
							<LeadsWrapper lead={lead} cadence={cadence} key={lead?.lead_id} />
						);
					})}
				</div>
			</div>
		</div>
	);
};

export default NodeMailStats;
