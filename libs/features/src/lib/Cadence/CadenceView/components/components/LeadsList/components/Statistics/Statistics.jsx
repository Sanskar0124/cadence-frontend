import { useParams } from "react-router-dom";

import { Button, ErrorBoundary, Tooltip } from "@cadence-frontend/components";
import { Close } from "@cadence-frontend/icons";
import HighlightBox from "../HighlightBox/HighlightBox";
import { OwnersList, Owner } from "./components/OwnersList/OwnersList";

import styles from "./Statistics.module.scss";
import { ThemedButton } from "@cadence-frontend/widgets";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { Statistics as STATISTICS_TRANSLATION } from "@cadence-frontend/languages";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";
import {
	Cadence as CADENCE_TRANSLATION,
	Common as COMMON_TRANSLATION,
} from "@cadence-frontend/languages";

const Statistics = ({ cadenceName, statsData, leadsLoading, onClose }) => {
	let { id: cadenceId } = useParams();
	cadenceId = parseInt(cadenceId);
	const user = useRecoilValue(userInfo);

	return (
		<>
			<div className={styles.title}>
				<ThemedButton
					className={styles.closeBtn}
					onClick={onClose}
					theme={ThemedButtonThemes.ICON}
				>
					<Tooltip text="Close">
						<Close color={"#567191"} />
					</Tooltip>
				</ThemedButton>
				<h3>
					{STATISTICS_TRANSLATION.STATISTICS_FOR[user?.language?.toUpperCase()]}{" "}
					{cadenceName ?? ""}
				</h3>
			</div>
			<div className={styles.leadStats}>
				<HighlightBox
					label={CADENCE_TRANSLATION?.TOTAL_LEADS?.[user?.language?.toUpperCase()]}
					value={statsData?.totalLeads}
				/>
				<HighlightBox
					label={CADENCE_TRANSLATION?.NO_OF_OWNERS?.[user?.language?.toUpperCase()]}
					value={statsData?.noOfOwners}
				/>
			</div>
			<ErrorBoundary>
				<OwnersList
					columns={[
						CADENCE_TRANSLATION?.OWNER_NAME?.[user?.language?.toUpperCase()],
						COMMON_TRANSLATION?.LEADS?.[user?.language?.toUpperCase()],
					]}
				>
					{statsData?.owners &&
						Object.keys(statsData?.owners)
							?.sort((a, b) => a.localeCompare(b))
							?.map((ownerName, i) => {
								const {
									count,
									is_profile_picture_present,
									profile_picture,
									Sub_Department,
								} = statsData?.owners[ownerName];

								return (
									<Owner
										key={i}
										imageURL={is_profile_picture_present ? profile_picture : undefined}
										ownerName={ownerName}
										ownerRole={Sub_Department?.name}
										noOfLeads={count}
										loading={leadsLoading}
									/>
								);
							})}
				</OwnersList>
			</ErrorBoundary>
		</>
	);
};

export default Statistics;
