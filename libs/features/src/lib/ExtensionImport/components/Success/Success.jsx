import React from "react";

import { PageContainer } from "@cadence-frontend/components";
import { RoundedTickGradient, Goto, CopyBlank } from "@cadence-frontend/icons";
import { Label, BackButton, ThemedButton } from "@cadence-frontend/widgets";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { Colors } from "@cadence-frontend/utils";
import styles from "./Success.module.scss";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";
import { Salesforce as SALESFORCE_TRANSLATION } from "@cadence-frontend/languages";

const Success = ({ salesforceLeadUrl, setActivePage }) => {
	const user = useRecoilValue(userInfo);
	return (
		<PageContainer className={styles.pageContainer}>
			<div className={styles.success}>
				<div className={styles.upperBoundary}></div>
				<BackButton text="back" onClick={() => setActivePage(1)} />
				<div className={styles.main}>
					<div className={styles.inputGroup}>
						<Label>
							{SALESFORCE_TRANSLATION.SALESFORCE_LEAD_URL[user?.language?.toUpperCase()]}
						</Label>
						<div
							className={styles.input}
							onClick={async () => await navigator.clipboard.writeText(salesforceLeadUrl)}
						>
							{salesforceLeadUrl}
						</div>
					</div>
					<div className={styles.completion}>
						<div className={styles.exportCompletion}>
							<div>
								<RoundedTickGradient />
								<p>
									{
										SALESFORCE_TRANSLATION.SALESFORCE_EXPORT_COMPLETED[
											user?.language?.toUpperCase()
										]
									}
								</p>
							</div>
							<div className={styles.progressBar}></div>
						</div>
						<div className={styles.exportCompletion}>
							<div>
								<RoundedTickGradient />
								<p>
									{
										SALESFORCE_TRANSLATION.CADENCE_EXPORT_COMPLETED[
											user?.language?.toUpperCase()
										]
									}
								</p>
							</div>
							<div className={styles.progressBar}></div>
						</div>
					</div>
				</div>

				<div className={styles.btns}>
					<ThemedButton
						theme={ThemedButtonThemes.WHITE}
						className={styles.whiteBtn}
						onClick={() => window.open(salesforceLeadUrl, "_blank")}
					>
						<Goto color={Colors.lightBlue} />
						<span>Go to lead</span>
					</ThemedButton>
					<ThemedButton
						theme={ThemedButtonThemes.WHITE}
						className={styles.whiteBtn}
						onClick={() => navigator.clipboard.writeText(salesforceLeadUrl)}
					>
						<CopyBlank />
						<span>Copy URL</span>
					</ThemedButton>
				</div>
			</div>
		</PageContainer>
	);
};

export default Success;
