import styles from "./SelectLeads.module.scss";
import { useState, useEffect, useRef } from "react";
import { BULK_LEADS_SELECTION_OPTIONS } from "./constant";
import { useOutsideClickHandler } from "@cadence-frontend/utils";

const SelectLeads = ({
	modal,
	setModal,
	checkedLeads,
	setCheckedLeads,
	cadenceLeadsStats,
	setSelectAllLeads,
	leads,
	isFetching,
	selectAllLeads,
	filtersCount,
	refreshInternalState,
	active,
	setActive,
}) => {
	const selectLeadRef = useRef(null);
	useOutsideClickHandler(selectLeadRef, () => setModal(false));

	const handleCurrentPageLeads = () => {
		setActive(BULK_LEADS_SELECTION_OPTIONS.CURRENT_LEADS);

		if (selectAllLeads) {
			setSelectAllLeads(false);
		}

		if (leads?.length > 0)
			if (checkedLeads?.length !== leads?.filter(lead => lead.lead_id).length) {
				setModal(false);
				setCheckedLeads(leads.filter(lead => lead?.lead_id).map(lead => lead.lead_id));
			} else if (active === BULK_LEADS_SELECTION_OPTIONS.CURRENT_LEADS) {
				setActive("");
				setModal(false);
				setCheckedLeads([]);
			}
		setModal(false);
	};

	const handleAllLeads = () => {
		setActive(BULK_LEADS_SELECTION_OPTIONS.ALL_LEADS);
		setSelectAllLeads(true);
		setModal(false);

		if (active === BULK_LEADS_SELECTION_OPTIONS.ALL_LEADS) {
			if (checkedLeads?.length === leads?.filter(lead => lead?.lead_id)?.length) {
				setActive("");
				setSelectAllLeads(false);
				setModal(false);
				setCheckedLeads([]);
			}
		}
	};

	useEffect(() => {
		if (leads?.length > 0 && !isFetching && selectAllLeads) {
			if (checkedLeads?.length !== leads?.filter(lead => lead?.lead_id)?.length) {
				setCheckedLeads(leads?.filter(lead => lead?.lead_id)?.map(lead => lead?.lead_id));
			}
		}
	}, [isFetching, selectAllLeads]);

	useEffect(() => {
		setActive();
	}, [refreshInternalState]);

	return (
		<div
			className={`${styles.leadsModalOverlay} ${modal && styles.open} ${
				checkedLeads?.length > 0 && styles.checkedModal
			}`}
			ref={selectLeadRef}
		>
			<div
				className={`${styles.allLeads} ${
					active === BULK_LEADS_SELECTION_OPTIONS.ALL_LEADS ? styles.active : ""
				}`}
				onClick={handleAllLeads}
			>
				<p>{`Select all ${filtersCount ? "filtered" : ""} leads ${
					!filtersCount ? `(${cadenceLeadsStats?.totalLeads ?? ""})` : ""
				}`}</p>
			</div>

			<div
				className={`${styles.visibleLeads} ${
					active === BULK_LEADS_SELECTION_OPTIONS.CURRENT_LEADS ? styles.active : ""
				}`}
				onClick={handleCurrentPageLeads}
			>
				<p>{`Select currently visible leads ${
					!filtersCount ? `(${leads?.length ?? ""})` : ""
				}`}</p>
			</div>
		</div>
	);
};

export default SelectLeads;
