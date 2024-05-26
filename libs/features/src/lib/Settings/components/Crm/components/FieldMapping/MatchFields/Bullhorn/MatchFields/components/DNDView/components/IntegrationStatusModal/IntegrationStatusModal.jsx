import React, { useContext, useEffect, useState } from "react";
import styles from "./IntegrationStatusModal.module.scss";
import { Button, Modal, Title } from "@cadence-frontend/components";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import { VIEWS } from "../../../../constants";
import { Input, Select, ThemedButton, Toggle } from "@cadence-frontend/widgets";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";
import { MessageContext } from "@cadence-frontend/contexts";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { MinusOutline, Plus, Trash } from "@cadence-frontend/icons";
import { Colors } from "@cadence-frontend/utils";
import { Label } from "recharts";

const STATUS_TEXT_MAP = {
	disqualified: {
		statusTitle: "Disqualification status",
		statusDesc: "Select the status for which lead will be disqualified",
		reasonTitle: "Disqualification reasons",
		reasonDesc: "Enter reasons users can select for disqualifying a lead",
	},
	converted: {
		statusTitle: "Conversion status",
		statusDesc: "Select the status for which lead will be converted",
	},
	custom: {
		statusTitle: "Select status",
		statusDesc: "Select the status for which you would like to add custom reasons",
		reasonTitle: "Add reasons",
		reasonDesc: "Enter reasons users can select when selecting this status",
	},
};

const STATUS_TYPE = {
	DISQUALIFIED: "disqualified",
	CONVERTED: "converted",
	CUSTOM: "custom",
};

const IntegrationStatusModal = ({
	modal,
	setModal,
	currentView,
	isLeadContactAccountStatusMapped,
	defaultIntStatus,
	setDefaultIntStatus,
	integrationStatus,
	setIntegrationStatus,
	disqualificationReason,
	setDisqualifcationReason,
	headingRef,
}) => {
	const user = useRecoilValue(userInfo);
	const { addError } = useContext(MessageContext);
	const [availableOptions, setAvailableOptions] = useState({});
	const [reasonInput, setReasonInput] = useState("");
	const [activeStatus, setActiveStatus] = useState({
		type: STATUS_TYPE.DISQUALIFIED,
		name: null,
	});

	// Side effects

	useEffect(() => {
		generateAvailableOptions();
	}, [integrationStatus, modal, activeStatus]);

	useEffect(() => {
		setIntegrationStatus({
			...integrationStatus,
			value: {
				...integrationStatus.value,
				custom_actions: integrationStatus.value.custom_actions?.map((act, indx) => ({
					...act,
					name: `Custom ${indx + 1}`,
				})),
			},
		});
	}, [modal]);

	//Functions
	const onClose = () => {
		if (
			integrationStatus.value.custom_actions?.length &&
			integrationStatus.value.custom_actions?.find(action => !action.value)
		) {
			setIntegrationStatus({
				...integrationStatus,
				value: {
					...integrationStatus.value,
					custom_actions: integrationStatus.value.custom_actions?.filter(
						action => action.value
					),
				},
			});
		}
		setModal(false);
	};

	const onDefaultIntChange = () => {
		let statusValue = "";

		if (headingRef?.current === "Account & leads") {
			statusValue = defaultIntStatus === VIEWS.LEAD ? VIEWS.ACCOUNT : VIEWS.LEAD;
		} else {
			statusValue = defaultIntStatus === VIEWS.CONTACT ? VIEWS.ACCOUNT : VIEWS.CONTACT;
		}

		setDefaultIntStatus(statusValue);
	};

	const generateAvailableOptions = () => {
		let disabledOptions = integrationStatus?.value?.picklist_values?.filter(
			({ value }) => {
				return (
					integrationStatus.value.converted?.value === value ||
					integrationStatus.value.disqualified?.value === value ||
					integrationStatus.value.custom_actions?.some(action => action.value === value)
				);
			}
		);
		let options = integrationStatus?.value?.picklist_values?.map(({ label, value }) => ({
			label,
			value,
			isDisabled: disabledOptions?.some(
				({ label: disabledLabel, value: disabledValue }) =>
					disabledValue === value && disabledLabel === label
			),
		}));
		setAvailableOptions(options);
	};

	const onAddCustomStatus = () => {
		setIntegrationStatus({
			...integrationStatus,
			value: {
				...integrationStatus.value,
				custom_actions: [
					...(integrationStatus.value.custom_actions || []),
					{
						label: "",
						value: "",
						name: `Custom ${(integrationStatus.value.custom_actions?.length ?? 0) + 1}`,
					},
				],
			},
		});
		setActiveStatus({
			type: STATUS_TYPE.CUSTOM,
			name: `Custom ${(integrationStatus.value.custom_actions?.length ?? 0) + 1}`,
		});
	};

	const onDeleteCustomAction = customAction => {
		if (activeStatus.name === customAction.name)
			setActiveStatus({ type: STATUS_TYPE.DISQUALIFIED, name: STATUS_TYPE.DISQUALIFIED });
		setIntegrationStatus({
			...integrationStatus,
			value: {
				...integrationStatus.value,
				custom_actions: integrationStatus.value.custom_actions.filter(
					act => act.name !== customAction.name
				),
			},
		});
	};

	const setStatus = val => {
		let updatedStatus = {};
		if (activeStatus.type === STATUS_TYPE.CUSTOM)
			updatedStatus = {
				custom_actions: integrationStatus.value.custom_actions.map(act =>
					act.name === activeStatus.name
						? {
								...act,
								...integrationStatus.value.picklist_values.find(op => op.value === val),
						  }
						: act
				),
			};
		if (
			activeStatus.type === STATUS_TYPE.DISQUALIFIED ||
			activeStatus.type === STATUS_TYPE.CONVERTED
		)
			updatedStatus = {
				[activeStatus.type]: integrationStatus.value.picklist_values.find(
					op => op.value === val
				),
			};
		setIntegrationStatus({
			...integrationStatus,
			value: {
				...integrationStatus.value,
				...updatedStatus,
			},
		});
	};

	const addReason = () => {
		if (!reasonValidation()) return;

		if (activeStatus.type === STATUS_TYPE.CUSTOM) {
			if (
				integrationStatus.value.custom_actions
					.find(act => act.name === activeStatus.name)
					?.reasons?.find(
						rea => rea.label.toLowerCase() === reasonInput.trim().toLowerCase()
					)
			)
				return addError({ text: "Cannot add duplicate Reason" });
			setIntegrationStatus({
				...integrationStatus,
				value: {
					...integrationStatus.value,
					custom_actions: [...(integrationStatus.value.custom_actions || [])].map(act =>
						act.name === activeStatus.name
							? {
									...act,
									reasons: [
										...(act.reasons || []),
										{ label: reasonInput.trim(), value: reasonInput.trim() },
									],
							  }
							: act
					),
				},
			});
		} else {
			if (
				disqualificationReason.value.picklist_values.find(
					rea => rea.label.toLowerCase() === reasonInput.trim().toLowerCase()
				)
			)
				return addError({ text: "Cannot add duplicate Reason" });
			setDisqualifcationReason({
				...disqualificationReason,
				value: {
					...disqualificationReason.value,
					picklist_values: [
						...disqualificationReason.value.picklist_values,
						{ label: reasonInput.trim(), value: reasonInput.trim() },
					],
				},
			});
		}
		setReasonInput("");
	};

	const deleteReason = reason => {
		if (activeStatus.type === STATUS_TYPE.CUSTOM) {
			setIntegrationStatus({
				...integrationStatus,
				value: {
					...integrationStatus.value,
					custom_actions: [...(integrationStatus.value.custom_actions || [])].map(act =>
						act.name === activeStatus.name
							? {
									...act,
									reasons: act.reasons.filter(rea => rea.label !== reason),
							  }
							: act
					),
				},
			});
		} else {
			setDisqualifcationReason({
				...disqualificationReason,
				value: {
					...disqualificationReason.value,
					picklist_values: disqualificationReason.value.picklist_values.filter(
						rea => rea.label !== reason
					),
				},
			});
		}
	};

	const getReasonshort = str => {
		return (
			str.split(" ").splice(0, 6).join(" ") + `${str.split(" ").length > 6 ? "..." : ""}`
		);
	};

	const getReasons = () => {
		if (activeStatus.type === STATUS_TYPE.CUSTOM)
			return integrationStatus?.value?.custom_actions?.find(
				act => act.name === activeStatus.name
			)?.reasons;
		return disqualificationReason?.value?.picklist_values;
	};

	const reasonValidation = () => {
		if (reasonInput === "" || reasonInput.trim() === "") {
			addError({ text: "Enter a valid input." });
			return false;
		} else return true;
	};

	const isAddCustomDisabled = () => {
		let usedActions = 0;
		if (integrationStatus.value.converted) usedActions++;
		if (integrationStatus.value.disqualified) usedActions++;
		return (
			integrationStatus.value.custom_actions?.length + usedActions ===
			integrationStatus?.value?.picklist_values?.length
		);
	};

	return (
		<Modal
			className={styles.integrationStatusModal}
			isModal={modal ? true : false}
			onClose={onClose}
			showCloseButton={true}
		>
			<div className={styles.header}>
				<Title size="1.2rem">
					Configure{" "}
					{currentView === VIEWS.LEAD
						? COMMON_TRANSLATION.LEAD[user?.language?.toUpperCase()]
						: currentView === VIEWS.CONTACT
						? COMMON_TRANSLATION.CONTACT[user?.language?.toUpperCase()]
						: currentView === VIEWS.CANDIDATE
						? "Candidate"
						: "Account"}{" "}
					integration status
				</Title>
				{(currentView === VIEWS.CONTACT ||
					currentView === VIEWS.ACCOUNT ||
					currentView === VIEWS.LEAD) &&
					isLeadContactAccountStatusMapped && (
						<span>
							Set as default integration status{" "}
							<Toggle
								theme="PURPLE"
								checked={defaultIntStatus === currentView}
								onChange={onDefaultIntChange}
							/>
						</span>
					)}
			</div>

			<div className={styles.body}>
				<div className={styles.nav}>
					<div className={styles.statuses}>
						<div
							onClick={() =>
								setActiveStatus({
									type: STATUS_TYPE.DISQUALIFIED,
									name: STATUS_TYPE.DISQUALIFIED,
								})
							}
							className={
								activeStatus.type === STATUS_TYPE.DISQUALIFIED ? styles.active : ""
							}
						>
							Disqualification
						</div>
						<div
							onClick={() =>
								setActiveStatus({
									type: STATUS_TYPE.CONVERTED,
									name: STATUS_TYPE.CONVERTED,
								})
							}
							className={activeStatus.type === STATUS_TYPE.CONVERTED ? styles.active : ""}
						>
							Conversion
						</div>
						{[...(integrationStatus.value.custom_actions || [])].map(action => (
							<div
								className={activeStatus.name === action.name ? styles.active : ""}
								onClick={() =>
									setActiveStatus({ type: STATUS_TYPE.CUSTOM, name: action.name })
								}
							>
								<span>{action.label ? action.label : action.name}</span>{" "}
								<Trash
									color={Colors.red}
									size="1rem"
									onClick={() => onDeleteCustomAction(action)}
								/>
							</div>
						))}
					</div>

					<ThemedButton
						width="fit-content"
						theme={ThemedButtonThemes.WHITE}
						onClick={onAddCustomStatus}
						disabled={isAddCustomDisabled()}
					>
						<Plus /> Add custom
					</ThemedButton>
				</div>

				<div className={styles.content}>
					<div className={styles.status}>
						<span className={styles.title}>
							{STATUS_TEXT_MAP[activeStatus.type]?.statusTitle}
						</span>
						<p className={styles.desc}>
							{STATUS_TEXT_MAP[activeStatus.type]?.statusDesc}
						</p>

						<Select
							value={
								activeStatus.type === STATUS_TYPE.CUSTOM
									? integrationStatus.value.custom_actions?.find(
											act => act.name === activeStatus.name
									  )?.value
									: integrationStatus.value[activeStatus.type]?.value
							}
							type="select"
							options={availableOptions}
							className={styles.input}
							placeholder="Select default status"
							setValue={setStatus}
							isClearable={activeStatus.type !== STATUS_TYPE.CUSTOM}
							key={activeStatus.name}
						/>
					</div>

					{activeStatus.type !== STATUS_TYPE.CONVERTED && (
						<div className={styles.reasons}>
							<span className={styles.title}>
								{STATUS_TEXT_MAP[activeStatus.type]?.reasonTitle}
							</span>
							<p className={styles.desc}>
								{STATUS_TEXT_MAP[activeStatus.type]?.reasonDesc}
							</p>

							<div
								className={styles.inputReasonWrapper}
								onKeyDown={e => e.key === "Enter" && addReason(e)}
							>
								<Input
									type={"text"}
									placeholder={"Type reason"}
									className={styles.inputReason}
									value={reasonInput}
									setValue={setReasonInput}
								/>
								<div className={styles.buttonAddWrapper}>
									<ThemedButton
										onClick={addReason}
										theme={ThemedButtonThemes.TRANSPARENT}
										className={styles.buttonAdd}
									>
										<Plus /> Add
									</ThemedButton>
								</div>
							</div>

							<div className={styles.typedReasons}>
								{!getReasons()?.length ? (
									<Label className={styles.label} style={{ textAlign: "center" }}>
										No reasons added yet
									</Label>
								) : (
									<div className={styles.reasonsRow}>
										{getReasons()?.map(reason => (
											<div className={styles.reason} key={reason.label}>
												<div title={reason.label}>{getReasonshort(reason.label)}</div>

												<div>
													<MinusOutline
														className={styles.buttonReasonRemove}
														onClick={() => deleteReason(reason.label)}
													/>
												</div>
											</div>
										))}
									</div>
								)}
							</div>
						</div>
					)}
				</div>
			</div>

			<ThemedButton theme={ThemedButtonThemes.PRIMARY} onClick={onClose}>
				Save
			</ThemedButton>
		</Modal>
	);
};

export default IntegrationStatusModal;
