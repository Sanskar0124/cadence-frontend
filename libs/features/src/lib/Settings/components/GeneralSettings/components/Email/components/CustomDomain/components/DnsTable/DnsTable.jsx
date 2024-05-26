import React, { useState, useEffect } from "react";
import { NoDns, CopyBlank, Trash, TickGradient, Reload } from "@cadence-frontend/icons";
import { DNS_TABLE_HEADERS } from "./constants";
import styles from "./DnsTable.module.scss";
import { ThemedButton, Table } from "@cadence-frontend/widgets";
import { TableThemes } from "@cadence-frontend/themes";
import { RINGOVER_TRACKING_DOMAIN } from "./constants";
import { Button, Tooltip } from "@cadence-frontend/components";
import { ENV } from "@cadence-frontend/environments";
import {
	Common as COMMON_TRANSLATION,
	Settings as SETTINGS_TRANSLATION,
} from "@cadence-frontend/languages";
import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue } from "recoil";

function DnsTable({
	customerDomain,
	customDomain,
	updateDomain,
	customDomainSettings,
	handleAddCustomDomain,
	handleCustomDomainValidation,
	loading,
	setDeleteModal,
	handleDeleteDomain,
	customDomainValidating,
	validation,
	showDelete,
	show,
}) {
	const user = useRecoilValue(userInfo);
	if (!show)
		return (
			<div className={styles.dnsTable}>
				<NoDns />
			</div>
		);

	return (
		<div>
			<div className={styles.dnsTable}>
				<Table
					// columns={DNS_TABLE_HEADERS.map(opt => ({
					// 	label: opt.label[user?.language?.toUpperCase()],
					// 	// value: opt.label
					// }))}
					columns={DNS_TABLE_HEADERS}
					width="100%"
					height="100%"
					loading={false}
					noOfRows={1}
					theme={TableThemes.LIGHT_PURPLE_BOX_SHADOW}
				>
					<tr className={styles.dnsTableRow}>
						<td className={styles.dnsTableCell}>CNAME</td>
						<td className={styles.dnsTableCell}>{customDomain?.split(".")[0]?.trim()}</td>
						<td className={styles.dnsTableCell}>
							{customDomain?.split(".")?.slice(1)?.join(".")?.trim()}
						</td>
						<td className={styles.dnsTableCell}>
							<span>
								<p>{RINGOVER_TRACKING_DOMAIN}</p>
								<CopyBlank
									style={{ cursor: "pointer" }}
									onClick={() => {
										navigator.clipboard.writeText(ENV.CUSTOM_DOMAIN);
									}}
								/>
							</span>
						</td>
						<td className={styles.dnsTableCell}>
							{validation ? (
								<span>
									<TickGradient />
									<p className={styles.verification}>
										{COMMON_TRANSLATION.VALIDATED[user?.language?.toUpperCase()]}
									</p>
								</span>
							) : (
								<p className={styles.verification}>
									{COMMON_TRANSLATION.NOT_VALIDATED[user?.language?.toUpperCase()]}
								</p>
							)}
						</td>
						{showDelete && (
							<td className={styles.actions}>
								{!validation && (
									<Button className={styles.icon} btnwidth="1.7rem" btnheight="1.7rem">
										<Reload
											onClick={handleCustomDomainValidation}
											className={customDomainValidating ? styles.active : styles.inactive}
										/>
									</Button>
								)}
								<Button className={styles.icon} btnwidth="1.7rem" btnheight="1.7rem">
									<Trash color="#567191" onClick={() => setDeleteModal(true)} />
								</Button>
							</td>
						)}
					</tr>
				</Table>
				<div className={styles.actions}>
					<ThemedButton
						theme="GREY"
						onClick={handleAddCustomDomain}
						loading={loading}
						loadingText={"This may take a while"}
						width="fit-content"
					>
						{updateDomain
							? SETTINGS_TRANSLATION.UPDATE_EXISTING_DOMAIN[user?.language.toUpperCase()]
							: SETTINGS_TRANSLATION.SETUP_NEW_CUSTOM_DOMAIN[
									user?.language.toUpperCase()
							  ]}
					</ThemedButton>
				</div>
			</div>
		</div>
	);
}

export default DnsTable;
