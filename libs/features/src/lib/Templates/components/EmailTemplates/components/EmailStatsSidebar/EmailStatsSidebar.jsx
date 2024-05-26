import { useEffect, useState, useMemo } from "react";
import { useNodeStats } from "@cadence-frontend/data-access";

import styles from "./EmailStatsSidebar.module.scss";
import { Button, Skeleton, Tooltip } from "@cadence-frontend/components";
import {
	Unsubscribe,
	View,
	Bounced,
	Leads,
	Close,
	ClickGradient as Click,
	Reply,
} from "@cadence-frontend/icons";
import { SearchBar, ThemedButton } from "@cadence-frontend/widgets";
import { ThemedButtonThemes } from "@cadence-frontend/themes";

import { TEMPLATE_SIDEBAR_OPTIONS } from "../../../../constants";
import LeadsWrapper from "./components/LeadsWrapper";

const header = {
	clicked: ["Link clicked", <Click size="1.2em" color="black" />, "Link clicked"],
	bounced: ["Mail bounced", <Bounced size="1.2em" />, "Bounced mail"],
	replied: ["Mail replied", <Reply size="1.2em" />, "Replied mail"],
	viewed: ["Mail viewed", <View size="1.2em" />, "Viewed mail"],
	unsubscribed: ["Unsubscribed people", <Unsubscribe size="1.2em" />, "Unsubscribed"],
};

const EmailStatsSidebar = ({
	onSidebarClose,
	sidebarState,
	selectedStat,
	setSelectedStat,
	leadsData,
}) => {
	const { stats, type } = selectedStat;

	const [query, setQuery] = useState("");
	const showFilter = sidebarState === TEMPLATE_SIDEBAR_OPTIONS.FILTER;
	const showCard = sidebarState === TEMPLATE_SIDEBAR_OPTIONS.TEMPLATE_DATA;
	const showStats = sidebarState === TEMPLATE_SIDEBAR_OPTIONS.STAT_DATA;
	const { leads, leadsLoading, leadsError } = leadsData;

	useEffect(() => {
		setQuery("");
	}, [selectedStat]);

	return (
		<div
			className={`${styles.EmailStatsSidebar}  ${
				showStats
					? styles.preview
					: showStats && !showFilter && !showCard
					? styles.launch
					: styles.close
			} `}
		>
			<div className={styles.header}>
				<ThemedButton
					className={styles.closeBtn}
					onClick={() => {
						setSelectedStat({ stats: null, type: null, et_id: null });
						onSidebarClose();
					}}
					theme={ThemedButtonThemes.ICON}
				>
					<Tooltip text="Close">
						<Close color={"#567191"} />
					</Tooltip>
				</ThemedButton>
				<h3>
					<span style={{ verticalAlign: "middle" }}>
						{" "}
						{header[type === "opened" ? "viewed" : type]?.[1]}{" "}
					</span>
					{header[type === "opened" ? "viewed" : type]?.[0]}
				</h3>
			</div>
			<div className={styles.main}>
				<div className={styles.lightenTheme} style={{ width: "90%" }}>
					Total mails sent: &nbsp;&nbsp;{stats?.sent}
				</div>
				<div className={styles.statWrapper}>
					<div className={styles.lightenTheme}>
						<div>% {header[type === "opened" ? "viewed" : type]?.[2]} : &nbsp;</div>
						<div>{stats?.percentage} %</div>
					</div>

					<div className={styles.lightenTheme}>
						<div>{header[type === "opened" ? "viewed" : type]?.[2]}: &nbsp; &nbsp;</div>
						<div>{stats?.[type]}</div>
					</div>
				</div>

				<div className={styles.searchBarWrapper}>
					<SearchBar
						width="100%"
						value={query}
						setValue={setQuery}
						height="40px"
						className={styles.searchBar}
					/>
				</div>

				<div className={styles.leadsWrapper}>
					{leadsLoading ? (
						<div className={styles.leadsLoader}>
							<Skeleton className={styles.leadSkeleton} />
							<Skeleton className={styles.leadSkeleton} />
							<Skeleton className={styles.leadSkeleton} />
						</div>
					) : (
						leads
							?.filter(lead =>
								`${lead.first_name} ${lead.last_name}`
									.toLowerCase()
									.includes(query.toLowerCase())
							)
							.map(lead => <LeadsWrapper key={lead?.lead_id} lead={lead} />)
					)}
				</div>
			</div>
		</div>
	);
};

export default EmailStatsSidebar;
