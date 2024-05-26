import React, { useState } from "react";
import styles from "./PauseCadenceModal.module.scss";

import { Modal } from "@cadence-frontend/widgets";
import { Toggle, Checkbox, CollapseContainer } from "@cadence-frontend/widgets";

import { useContext } from "react";

// components
import { MessageContext } from "@cadence-frontend/contexts";
import { Label, ThemedButton, InputDate, InputTime } from "@cadence-frontend/widgets";
import { ThemedButtonThemes, InputThemes } from "@cadence-frontend/themes";
import { Leads } from "@cadence-frontend/icons";
import { Cadence as CADENCE_TRANSLATION } from "@cadence-frontend/languages";

// constants
import { defaultPauseStateFields } from "./constants";
import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue } from "recoil";

// const PauseCadenceModal = ({ modal, setModal, refetchLead }) => {

// 	};

function PauseCadenceModal({ isModalOpen, setIsModalOpen }) {
	const closeModel = () => {
		setIsModalOpen(false);
	};
	const { addError, addSuccess } = useContext(MessageContext);

	const [pauseTime, setPauseTime] = useState(defaultPauseStateFields);
	const [relatedCadenceToggle, setRelatedCadenceToggle] = useState(false);
	const [checked, setChecked] = useState(false);
	const arr = [1, 2, 3, 4, 5, 6, 7, 8];
	const user = useRecoilValue(userInfo);
	return (
		<Modal
			isModal={isModalOpen}
			onClose={closeModel}
			showCloseButton={true}
			className={styles.customTaskModal}
			leftCloseIcon={true}
		>
			<div className={styles.pauseCadenceModal}>
				<div className={styles.heading}>
					<h3>Pause cadence</h3>
				</div>
				<div className={styles.body}>
					<div className={styles.subheading}>
						<p>Are you sure you want to pause the cadence for following lead ?</p>
					</div>
					<div className={styles.cadence_name}>
						<h2>{CADENCE_TRANSLATION.CADENCE_NAME[user?.language?.toUpperCase()]}</h2>
						<h3>UK Prospect</h3>
					</div>
					<div className={styles.lead_name}>
						<h2>Lead name</h2>
						<div className={styles.lead_details}>
							<div className={styles.icon}>
								<Leads />
							</div>
							<div className={styles.lead_name_email}>
								<p className={styles.name}>Lorenza Cleementas</p>
								<p className={styles.email}>lorenzacleementas@waltdisney.com</p>
							</div>
						</div>
					</div>
					<div className={styles.related_leads}>
						<div className={styles.toggle}>
							<p>Pause cadence for related leads</p>
							<Toggle
								className={styles.toggler}
								checked={relatedCadenceToggle}
								onChange={() => {
									setRelatedCadenceToggle(prev => !prev);
								}}
								theme="PURPLE"
							/>
						</div>
						{relatedCadenceToggle && (
							<CollapseContainer
								className={styles.collapsibleContainer}
								openByDefault={false}
								key={"id"}
								title={<p className={styles.title}>Related leads</p>}
							>
								<div className={styles.leads}>
									{/* <p className={styles.title}>Related leads</p> */}
									<div className={styles.leads_name}>
										{arr.map(ar => {
											return (
												<div className={styles.single_lead}>
													<div className={styles.single_lead_details}>
														<div className={styles.icon}>
															<Leads />
														</div>
														<div className={styles.lead_name_email}>
															<p className={styles.name}>Lorenza Cleementas</p>
															<p className={styles.email}>
																lorenzacleementas@waltdisney.com
															</p>
														</div>
													</div>

													<div className={styles.checkbox}>
														<Checkbox
															size="60"
															theme="PURPLE"
															checked={checked}
															onChange={() => {
																setChecked(prev => !prev);
															}}
														/>
													</div>
												</div>
											);
										})}
									</div>
								</div>
							</CollapseContainer>
						)}
					</div>

					<CollapseContainer
						className={styles.collapsibleContainer}
						openByDefault={false}
						key={"id1"}
						title={<p className={styles.subTitle}>Automatically resume cadence on:</p>}
					>
						<div className={styles.main}>
							<div className={styles.inputGroup}>
								<Label className={styles.label}>Date</Label>
								<InputDate
									value={pauseTime}
									setValue={setPauseTime}
									numberOfOptionsVisible={"3"}
									height="50px"
								/>
							</div>
							<div className={styles.inputGroup}>
								<Label>Time</Label>
								<div className={styles.input_time}>
									<InputTime
										input={pauseTime}
										name="time"
										setInput={setPauseTime}
										theme={InputThemes.PRIMARY}
										type="select"
										height="50px"
									/>
								</div>
							</div>
						</div>
					</CollapseContainer>
				</div>
				<div className={styles.footer}>
					<ThemedButton
						theme={ThemedButtonThemes.PRIMARY}
						className={styles.pauseBtn}

						// loading={pauseLoading}
					>
						Pause cadence
					</ThemedButton>
				</div>
			</div>
		</Modal>
	);
}

export default PauseCadenceModal;
