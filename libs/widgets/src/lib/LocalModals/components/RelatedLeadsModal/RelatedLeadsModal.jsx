import { userInfo } from "@cadence-frontend/atoms";
import { Modal, Skeleton, Title } from "@cadence-frontend/components";
import { INTEGRATION_TYPE } from "@cadence-frontend/constants";
import { MessageContext } from "@cadence-frontend/contexts";
import {
	BriefcaseSearch,
	CadenceBox,
	SalesforceBox,
	ZohoBox,
	Dynamics,
	Sellsy,
	Stop,
} from "@cadence-frontend/icons";
import {
	Checkbox,
	Label,
	SearchBar,
	ThemedButton,
	Toggle,
} from "@cadence-frontend/widgets";
import { useContext, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import styles from "./RelatedLeadsModal.module.scss";
import { Colors, capitalize } from "@cadence-frontend/utils";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { LOCAL_MODAL_TYPES } from "../../constants";

const RelatedLeadsModal = ({ lead, modal, setModal }) => {
	const instance_url = useRecoilValue(userInfo).instance_url;
	const user = useRecoilValue(userInfo);

	const { data, relatedLeadLoading, leadsSelected } = modal;
	const { addError } = useContext(MessageContext);

	const [searchValue, setSearchValue] = useState("");
	const [leadData, setLeadData] = useState(null);
	const [noLeads, setNoLeads] = useState(null);
	const [visibleLeads, setVisibleLeads] = useState([]);
	const [leadsToBeStopped, setLeadsToBeStopped] = useState(leadsSelected ?? []);
	const [includeCurrentLead, setIncludeCurrentLead] = useState(false);

	useState(() => {
		if (leadsSelected?.length > 0 && leadsSelected.includes(lead?.lead_id))
			setIncludeCurrentLead(true);
	}, []);

	const handleClose = () => {
		setModal(null);
	};
	useEffect(() => {
		user?.integration_type === INTEGRATION_TYPE.SALESFORCE
			? setLeadData(
					data
						.map(lead => {
							let obj = { ...lead };
							obj.lead_id = lead.lead_id_db;
							delete obj.lead_id_db;
							return obj;
						})
						?.filter(lead => checkIfSameLead(lead))
			  )
			: setLeadData(data?.filter(lead => checkIfSameLead(lead)));
	}, [data]);

	useEffect(() => {
		if (leadData) {
			setVisibleLeads(
				leadData?.filter(
					relatedLead =>
						`${relatedLead.first_name?.toLowerCase()} ${relatedLead.last_name?.toLowerCase()}`.includes(
							searchValue?.trim()?.toLowerCase()
						) ||
						relatedLead.first_name
							?.toLowerCase()
							.includes(searchValue?.trim()?.toLowerCase()) ||
						relatedLead.last_name
							?.toLowerCase()
							.includes(searchValue?.trim()?.toLowerCase())
				)
			);
		}
	}, [searchValue, leadData]);

	const checkIfSameLead = fetchedLead => {
		if (fetchedLead?.lead_id === lead?.lead_id) {
			return false;
		}

		return true;
	};

	const handleLinkClick = (e, lead) => {
		e.stopPropagation();
		let URL = "";

		switch (user?.integration_type) {
			case INTEGRATION_TYPE.SALESFORCE:
				if (lead.attributes.type === "Lead")
					URL = `${instance_url}/lightning/r/Lead/${lead?.Id}/view`;
				else if (lead.attributes.type === "Contact")
					URL = `${instance_url}/lightning/r/Contact/${lead?.Id}/view`;
				break;

			case INTEGRATION_TYPE.ZOHO:
				if (!lead?.zoho_url) return "";
				URL = lead?.zoho_url;
				break;
			case INTEGRATION_TYPE.DYNAMICS:
				if (!lead?.dynamics_url) return "";
				URL = lead?.dynamics_url;
				break;
			case INTEGRATION_TYPE.SELLSY:
				if (!lead?.sellsy_url) return "";
				URL = lead?.sellsy_url;
		}

		if (URL) window.open(URL, "_blank");
		else addError({ text: "This lead does not have the required info." });
	};

	const handleApply = () => {
		includeCurrentLead
			? setLeadsToBeStopped(prev => prev.filter(l => l !== lead.lead_id))
			: setLeadsToBeStopped(prev => [...prev, lead.lead_id]);

		setIncludeCurrentLead(prev => !prev);
	};

	const handleStopLeads = () => {
		if (leadsToBeStopped.length === 0) {
			return addError({ text: "No lead selected." });
		}
		const leadsSelected = [...leadsToBeStopped];
		setModal({
			modalType: LOCAL_MODAL_TYPES.CONFIRM_RELATED_LEADS_STOP,
			lead,
			data,
			leadsSelected,
			relatedLeadLoading,
			isCurrentLead: includeCurrentLead,
		});
	};

	return (
		<Modal
			isModal={modal}
			setModal={setModal}
			onClose={handleClose}
			showCloseButton
			disableOutsideClick
		>
			{!noLeads ? (
				<div className={styles.relatedLeadsModal}>
					<div className={styles.title}>
						<Title size="1.1rem">Related Leads</Title>
					</div>
					<div className={styles.search}>
						<Label>Related Leads</Label>
						<SearchBar
							height="40px"
							width="100%"
							value={searchValue}
							setValue={setSearchValue}
							className={styles.searchBar}
							placeholderText="Search"
						/>
					</div>

					<div className={styles.listBox}>
						<div className={styles.listHeader}>
							<div className={styles.leftHead}>
								<Checkbox
									className={styles.checkBox}
									disabled={visibleLeads.filter(lead => lead?.lead_id).length < 1}
									checked={
										visibleLeads.filter(lead => lead?.lead_id).length > 0 &&
										!visibleLeads
											.filter(lead => lead?.lead_id)
											.some(lead => !leadsToBeStopped.includes(lead?.lead_id))
									}
									onClick={() => {
										visibleLeads
											.filter(lead => lead?.lead_id)
											.some(lead => !leadsToBeStopped.includes(lead?.lead_id))
											? setLeadsToBeStopped(
													visibleLeads
														?.filter(lead => lead?.lead_id)
														.map(lead => lead?.lead_id)
											  )
											: setLeadsToBeStopped(prev =>
													prev.filter(
														lead =>
															!visibleLeads.some(visiLead => visiLead?.lead_id === lead)
													)
											  );
									}}
								/>
								<div className={styles.nameHead}>NAME</div>
							</div>
							<div className={styles.rightHead}>LINKS</div>
						</div>
						{visibleLeads.length > 0 ? (
							<div className={styles.list}>
								{relatedLeadLoading ? (
									<div className={styles.loading}>
										<Skeleton className={styles.loader} />
										<Skeleton className={styles.loader} />
										<Skeleton className={styles.loader} />
									</div>
								) : (
									visibleLeads?.map((lead, index) => {
										return (
											<div className={styles.listCard} key={`relLead${index}`}>
												<div className={styles.left}>
													<Checkbox
														className={styles.checkBox}
														checked={
															Boolean(lead?.lead_id) &&
															leadsToBeStopped.includes(lead?.lead_id)
														}
														disabled={!lead?.lead_id}
														onClick={() => {
															leadsToBeStopped?.includes(lead?.lead_id)
																? setLeadsToBeStopped(prev =>
																		prev?.filter(l => l !== lead?.lead_id)
																  )
																: setLeadsToBeStopped(prev => [...prev, lead?.lead_id]);
														}}
													/>
													<div className={styles.infoBox}>
														<div className={styles.name}>
															{lead?.first_name} {lead?.last_name}
														</div>
														<div className={styles.email}>{lead?.email}</div>
													</div>
												</div>
												<div className={styles.right}>
													<CadenceBox
														onClick={() => window.open(`/crm/leads/${lead?.lead_id}`)}
														style={{ cursor: "pointer" }}
														color={"white"}
														size="28px"
														disabled={!lead?.present_in_cadence}
													/>

													{user?.integration_type === INTEGRATION_TYPE.SALESFORCE && (
														<SalesforceBox
															style={{
																width: "28px",
																height: "28px",
																cursor: "pointer",
															}}
															onClick={e => handleLinkClick(e, lead)}
															color={"#00A1E0"}
															disabled={!lead.Id || !instance_url}
														/>
													)}

													{user?.integration_type === INTEGRATION_TYPE.ZOHO && (
														<ZohoBox
															style={{
																cursor: "pointer",
															}}
															size={"40px"}
															onClick={e => handleLinkClick(e, lead)}
															disabled={!lead.id || !instance_url}
														/>
													)}
													{user?.integration_type === INTEGRATION_TYPE.DYNAMICS && (
														<Dynamics
															style={{
																cursor: "pointer",
															}}
															size={"30px"}
															onClick={e => handleLinkClick(e, lead)}
															disabled={!lead.dynamics_url}
														/>
													)}
													{user?.integration_type === INTEGRATION_TYPE.SELLSY && (
														<Sellsy
															style={{
																cursor: "pointer",
															}}
															size={"30px"}
															onClick={e => handleLinkClick(e, lead)}
															disabled={!lead.sellsy_url}
														/>
													)}
												</div>
											</div>
										);
									})
								)}
							</div>
						) : (
							<div className={styles.noRelatedLeads}>
								<BriefcaseSearch />
								<div className={styles.noLeadsHead}>No Leads Found</div>
								<div className={styles.description}>
									There are currently no leads present in the tool which matches your
									search results
								</div>
							</div>
						)}
					</div>

					<div className={styles.toggleBox}>
						<div className={styles.toggleText}>Apply action to current lead as well</div>
						<div className={styles.toggleCont}>
							<Toggle
								checked={includeCurrentLead}
								onChange={handleApply}
								theme="PURPLE"
								className={styles.toggle}
							/>
						</div>
					</div>
					<ThemedButton
						theme={ThemedButtonThemes.GREY}
						className={styles.button}
						onClick={handleStopLeads}
					>
						<Stop color={Colors.lightBlue} />
						<div className={styles.btndata}>Stop</div>
					</ThemedButton>
				</div>
			) : (
				<div className={styles.noRelatedLeads}>
					<BriefcaseSearch />
					<div className={styles.title}>No Related Leads Found</div>
					<div className={styles.description}>
						`There are currently no other leads present in the tool or{" "}
						{capitalize(user?.integration_type)} from this account.`
					</div>
				</div>
			)}
		</Modal>
	);
};

export default RelatedLeadsModal;
