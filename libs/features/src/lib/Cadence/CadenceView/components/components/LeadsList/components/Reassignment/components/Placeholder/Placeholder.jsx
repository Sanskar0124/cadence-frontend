import { Div } from "@cadence-frontend/components";

import styles from "./Placeholder.module.scss";

const Placeholder = () => {
	return (
		<>
			<div className={styles.header}>
				<div className={styles.exit}>
					<Div loading />
				</div>
				<div className={styles.buttons}>
					<div className={styles.count}>
						<Div loading />
					</div>

					<div className={styles.btn}>
						<Div loading />
					</div>
				</div>
			</div>
			<div className={styles.selectedLeads}>
				<div className={styles.header}>
					<Div loading />
					<Div loading />
					<div className={styles.ownerBox}>
						<Div loading />
					</div>
				</div>
				<div className={styles.leads}>
					{[...Array(2).keys()].map((_, index) => (
						<>
							<div className={styles.reassignmentCard}>
								<div className={styles.leadsBox}>
									<div className={styles.leadsIn}>
										{[...Array(8).keys()].map((_, index) => (
											<div className={styles.leadTag}>
												<Div loading />
											</div>
										))}
									</div>
								</div>

								<div className={styles.ownerBox}>
									<div className={styles.owner}>
										<Div loading />
									</div>
								</div>
								<div className={styles.newOwnerSelection}>
									<div className={styles.newOwnerList}>
										{[...Array(2).keys()].map((_, index) => (
											<div className={styles.newOwner}>
												<div className={styles.ownerSelection}>
													<Div loading className={styles.select} />
													<Div loading className={styles.input} />
												</div>
											</div>
										))}
									</div>
									<div className={styles.controls}>
										<Div loading className={styles.controlOne} />
										<Div loading className={styles.controlTwo} />
									</div>
								</div>
							</div>
							{index !== 1 && (
								<div className={styles.separator}>
									<Div loading />
								</div>
							)}
						</>
					))}
				</div>
			</div>
		</>
	);
};

export default Placeholder;
