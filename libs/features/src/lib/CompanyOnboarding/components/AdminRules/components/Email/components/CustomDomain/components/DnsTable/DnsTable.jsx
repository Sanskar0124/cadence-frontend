import React, { useState, useEffect } from "react";
import { NoDns, CopyBlank, Trash, TickGradient } from "@cadence-frontend/icons";
import { DNS_TABLE_HEADERS } from "./constants";
import styles from "./DnsTable.module.scss";
import { ThemedButton, Table } from "@cadence-frontend/widgets";
import { TableThemes } from "@cadence-frontend/themes";
import { RINGOVER_TRACKING_DOMAIN } from "./constants";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue } from "recoil";

function DnsTable({
	customerDomain,
	customDomain,
	updateDomain,
	customDomainSettings,
	handleAddCustomDomain,
	loading,
	setDeleteModal,
	handleDeleteDomain,
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
					columns={DNS_TABLE_HEADERS}
					width="100%"
					height="100%"
					loading={false}
					noOfRows={1}
					theme={TableThemes.LIGHT_PURPLE_BOX_SHADOW}
				>
					<tr className={styles.dnsTableRow}>
						<td className={styles.dnsTableCell}>CNAME</td>
						<td className={styles.dnsTableCell}>{customDomain?.split(".")[0]}</td>
						<td className={styles.dnsTableCell}>
							{customDomain?.split(".")?.slice(1)?.join(".")}
						</td>
						<td className={styles.dnsTableCell}>
							<span>
								<p>{RINGOVER_TRACKING_DOMAIN}</p>
								<CopyBlank
									style={{ cursor: "pointer" }}
									onClick={() => {
										navigator.clipboard.writeText("customer.ringover.xyz");
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
							<td>
								<Trash
									color="#567191"
									style={{
										cursor: "pointer",
									}}
									onClick={() => setDeleteModal(true)}
								/>
							</td>
						)}
					</tr>
				</Table>
				<ThemedButton
					theme="GREY"
					onClick={handleAddCustomDomain}
					loading={loading}
					loadingText={"This may take a while"}
				>
					{updateDomain
						? "Update existing Custom Tracking Domain"
						: "Setup new Custom Tracking Domain"}
				</ThemedButton>
			</div>
		</div>
	);
}

export default DnsTable;
