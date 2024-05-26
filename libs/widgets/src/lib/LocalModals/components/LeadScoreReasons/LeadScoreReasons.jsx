/* eslint-disable react/jsx-no-useless-fragment */
import { ErrorBoundary, Modal, Skeleton } from "@cadence-frontend/components";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Placeholder from "./components/Placeholder/Placeholder";
import styles from "./LeadScoreReasons.module.scss";
import SingleReason from "./components/SingleReason/SingleReason";
import { useLead } from "@cadence-frontend/data-access";
import { formatNumber } from "@cadence-frontend/utils";

/**
 * This modal is used currently in - Task Quick View, People Page Lead Info
 * The purpose of this modal is:
 * To show the prior reasons for scoring a lead.
 * @returns JSX
 */
function LeadScoreReasons({ modal, setModal, lead }) {
	let {
		leadScoreReasonsData,
		leadScoreReasonsLoading,
		refetchLeadScoreReasons,
		leadScoreReasonsRefetching,
		leadScoreReasonsError,
		fetchNextPage,
		hasNextPage,
		isFetching,
		isFetchingNextPage,
		leadScoreData,
		leadScoreDataLoading,
	} = useLead(null, false, lead?.lead_id, true);

	const [leadScoreReasons, setLeadScoreReasons] = useState([]);
	const handleClose = () => {
		setModal(null);
	};

	useEffect(() => {
		if (leadScoreReasonsData) {
			setLeadScoreReasons(leadScoreReasonsData);
		}
	}, [leadScoreReasonsData]);

	let observer = useRef();

	const lastLeadScoreReasonRef = useCallback(
		reason => {
			if (isFetchingNextPage || isFetching) return;
			if (observer.current) observer.current.disconnect();
			let options = {
				root: document.querySelector(".intersectionRootLeadScoreReasons"),
				rootMargin: "0px",
				threshold: 1.0,
			};
			observer.current = new IntersectionObserver(entries => {
				if (entries[0].isIntersecting && hasNextPage) {
					fetchNextPage();
				}
			}, options);
			if (reason) observer.current.observe(reason);
		},
		[isFetchingNextPage, isFetching, hasNextPage]
	);

	return (
		<Modal
			className={`intersectionRootLeadScoreReason`}
			isModal={modal}
			onClose={handleClose}
			showCloseButton
		>
			<div className={`${styles.header}`}>
				<p className={styles.modalHeading}>Hot Lead Activity</p>
				<span>
					{/* Lead Name */}
					<p>{`${lead?.first_name} ${lead?.last_name}`}</p>
					{/* Score */}
					<span>
						{leadScoreDataLoading ? "" : `${leadScoreData?.lead_score ?? 0} pts`}
					</span>
				</span>
			</div>
			{
				<div className={`${styles.leadScoreReasons}`}>
					{leadScoreReasonsLoading ? (
						<Placeholder rows={11} />
					) : (
						<>
							{leadScoreReasons?.length > 0 ? (
								leadScoreReasons?.map((leadScore, index) => {
									return index === leadScoreReasons.length - 1 ? (
										<>
											<SingleReason
												reason={leadScore}
												lead={lead}
												key={leadScore?.reason_id}
												ref={lastLeadScoreReasonRef}
											/>
											{(leadScoreReasonsRefetching || isFetchingNextPage) && (
												<Skeleton
													className={styles.skeleton}
													style={{
														minHeight: "3em !important",
													}}
												/>
											)}
										</>
									) : (
										<SingleReason
											reason={leadScore}
											lead={lead}
											key={leadScore?.reason_id}
										/>
									);
								})
							) : (
								<p className={styles.emptyState}>
									No Lead Score Details Available for this Lead
								</p>
							)}
						</>
					)}
				</div>
			}
		</Modal>
	);
}

export default LeadScoreReasons;
