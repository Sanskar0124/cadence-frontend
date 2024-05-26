import React, { useContext, useEffect, useState } from "react";

import { PageContainer, Spinner } from "@cadence-frontend/components";
import {
	BackButton,
	Label,
	SearchBar,
	ThemedButton,
	Toggle,
} from "@cadence-frontend/widgets";
import { Goto, CopyBlank } from "@cadence-frontend/icons";
import { useLeadImport } from "@cadence-frontend/data-access";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import SelectCadence from "../LeadInfo/components/SelectCadence/SelectCadence";

import { IMPORT_STATUS } from "./constants";

import styles from "./MultipleLeadsInfo.module.scss";
import { Colors } from "@cadence-frontend/utils";
import { SocketContext } from "@cadence-frontend/contexts";
import { SOCKET_ON_EVENTS } from "@cadence-frontend/constants";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import { Cadence as CADENCE_TRANSLATION } from "@cadence-frontend/languages";

const MultipleLeadsInfo = ({
	setActivePage,
	cadenceSelected,
	setCadenceSelected,
	leads,
	setLeads,
	allLeadsFetched,
	setAllLeadsFetched,
	user,
}) => {
	const { importLeadsToSalesforce, importLeadToCadence } = useLeadImport();
	const { addSocketHandler } = useContext(SocketContext);
	const [searchValue, setSearchValue] = useState("");
	const [selectedLeads, setSelectedLeads] = useState([]);
	const [importStatus, setImportStatus] = useState(IMPORT_STATUS.NOT_STARTED);
	const [importedLeads, setImportedLeads] = useState([]); // first SF then Cadence

	useEffect(() => {
		addSocketHandler({
			event_name: SOCKET_ON_EVENTS.PROFILE,
			key: "extensionImport",
			handler: lead => {
				setLeads(prev => [...prev, lead]);
				setSelectedLeads(prev => [...prev, lead.linkedinUrl]);
			},
		});
		addSocketHandler({
			event_name: SOCKET_ON_EVENTS.PROFILES,
			key: "extensionImport",
			handler: lead => setAllLeadsFetched(true),
		});
		addSocketHandler({
			event_name: SOCKET_ON_EVENTS.IMPORTS,
			key: "extensionImport",
			handler: data => setImportedLeads(data.success),
		});
	}, []);

	useEffect(() => {
		if (importedLeads?.length) {
			const importToCadenceBody = {
				leads: importedLeads,
			};
			importLeadToCadence(importToCadenceBody, {
				onSuccess: data => {
					setImportStatus(IMPORT_STATUS.COMPLETE);
					setImportedLeads(data); // CADENCE
				},
			});
		}
	}, [importedLeads]);

	const handleToggle = linkedinUrl => {
		if (selectedLeads.includes(linkedinUrl))
			setSelectedLeads(prev => prev.filter(url => url !== linkedinUrl));
		else setSelectedLeads(prev => [...prev, linkedinUrl]);
	};

	const handleSubmit = () => {
		setImportStatus(IMPORT_STATUS.IN_PROGRESS);
		const importToSfBody = {
			type: "lead",
			profiles: leads,
		};
		importLeadsToSalesforce(importToSfBody, {
			// onSuccess: (data) => {},
		});
	};

	return (
		<PageContainer className={styles.pageContainer}>
			<div className={styles.innerBox}>
				<div className={styles.upperBoundary}></div>
				<div className={styles.multipleLeadsInfo}>
					<BackButton text="back" onClick={() => setActivePage(1)} />

					<div className={styles.inputGroup}>
						<Label>
							{CADENCE_TRANSLATION.SELECT_CADENCE_FOR_LEAD[user?.language?.toUpperCase()]}
						</Label>
						<SelectCadence
							className={styles.selectCadence}
							cadenceSelected={cadenceSelected}
							setCadenceSelected={setCadenceSelected}
						/>
					</div>

					<div className={styles.total}>
						<h3>
							Total leads: <span>{leads?.length}</span>{" "}
						</h3>
						{/* {!allLeadsFetched && <Spinner className={styles.spinner} />} */}
					</div>
					<SearchBar
						width="70%"
						height="40px"
						value={searchValue}
						setValue={setSearchValue}
						className={styles.searchBar}
					/>

					<div className={styles.list}>
						{/* {leads
							?.filter(lead =>
								lead.fullName?.toLowerCase()?.includes(searchValue.toLowerCase())
							)
							?.map(lead => (
								<div className={styles.lead} key={lead.linkedinUrl}>
									<div className={styles.left}>
										<p>{lead.fullName}</p>
									</div>
									<div className={styles.right}>
										<Toggle
											onChange={() => handleToggle(lead.linkedinUrl)}
											checked={selectedLeads.includes(lead.linkedinUrl)}
										/>
									</div>
								</div>
							))} */}
						<div className={styles.lead}>
							<div className={styles.left}>
								<p>Vansh</p>
							</div>
							<div className={styles.right}>
								<Toggle
								// onChange={() => handleToggle(lead.linkedinUrl)}
								// checked={selectedLeads.includes(lead.linkedinUrl)}
								/>
							</div>
						</div>
						<div className={styles.lead}>
							<div className={styles.left}>
								<p>Vansh</p>
							</div>
							<div className={styles.right}>
								<Toggle
								// onChange={() => handleToggle(lead.linkedinUrl)}
								// checked={selectedLeads.includes(lead.linkedinUrl)}
								/>
							</div>
						</div>
						<div className={styles.lead}>
							<div className={styles.left}>
								<p>Vansh</p>
							</div>
							<div className={styles.right}>
								<Toggle
								// onChange={() => handleToggle(lead.linkedinUrl)}
								// checked={selectedLeads.includes(lead.linkedinUrl)}
								/>
							</div>
						</div>
						<div className={styles.lead}>
							<div className={styles.left}>
								<p>Vansh</p>
							</div>
							<div className={styles.right}>
								<ThemedButton
									theme={ThemedButtonThemes.RED}
									className={styles.btn}
									// onClick={() => navigator.clipboard.writeText(salesforceLeadUrl)}
								>
									{COMMON_TRANSLATION.DUPLICATE[user?.language?.toUpperCase()]}
								</ThemedButton>
							</div>
						</div>
						<div className={styles.lead}>
							<div className={styles.left}>
								<p>Vansh</p>
							</div>
							<div className={styles.right}>
								<ThemedButton
									theme={ThemedButtonThemes.PRIMARY}
									className={styles.btn}
									// onClick={() => navigator.clipboard.writeText(salesforceLeadUrl)}
								>
									New
								</ThemedButton>
							</div>
						</div>
						<div className={styles.lead}>
							<div className={styles.left}>
								<p>Vansh</p>
							</div>
							<div className={styles.buttons}>
								<Goto color={Colors.lightBlue} />
								<CopyBlank color={Colors.lightBlue} />
							</div>
						</div>
						<div className={styles.lead}>
							<div className={styles.left}>
								<p>Vansh</p>
							</div>
							<div className={styles.buttons}>
								<Goto color={Colors.lightBlue} />
								<CopyBlank color={Colors.lightBlue} />
							</div>
						</div>
						<div className={styles.lead}>
							<div className={styles.left}>
								<p>Vansh</p>
							</div>
							<div className={styles.buttons}>
								<Goto color={Colors.lightBlue} />
								<CopyBlank color={Colors.lightBlue} />
							</div>
						</div>
					</div>

					{importStatus === IMPORT_STATUS.NOT_STARTED && (
						<ThemedButton
							theme={ThemedButtonThemes.PRIMARY}
							className={styles.btn}
							onClick={handleSubmit}
						>
							Import to Cadence
						</ThemedButton>
					)}
				</div>
			</div>
		</PageContainer>
	);
};

export default MultipleLeadsInfo;
