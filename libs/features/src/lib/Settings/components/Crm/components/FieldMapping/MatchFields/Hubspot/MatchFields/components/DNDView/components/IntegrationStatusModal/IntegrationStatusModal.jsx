import { Plus, MinusOutline } from "@cadence-frontend/icons";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { Button, Modal, Title } from "@cadence-frontend/components";
import { MessageContext } from "@cadence-frontend/contexts";
import { Input, Label, Select, ThemedButton } from "@cadence-frontend/widgets";
import { useState, useEffect } from "react";
import styles from "./IntegrationStatusModal.module.scss";
import React, { useContext } from "react";
import { Settings as SETTINGS_TRANSLATION } from "@cadence-frontend/languages";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";

const IntegrationStatusModal = ({
	modal,
	setModal,
	integrationStatus,
	setIntegrationStatus,
	disqualificationReason,
	setDisqualifcationReason,
}) => {
	const onClose = () => {
		setModal(false);
	};
	const { addError, addSuccess } = useContext(MessageContext);
	const [availableOptions, setAvailableOptions] = useState({});
	const [reasonInput, setReasonInput] = useState("");
	const [reasons, setReasons] = useState([]);
	const user = useRecoilValue(userInfo);

	const reasonValidation = () => {
		if (reasonInput === "" || reasonInput.trim() === "") {
			addError({ text: "Enter a valid input." });
			return false;
		} else return true;
	};

	useEffect(() => {
		generateAvailableOptions();
	}, [integrationStatus, modal]);

	const generateAvailableOptions = () => {
		const obj = {};
		integrationStatus?.value?.picklist_values?.forEach(({ value, label }, _) => {
			obj[value] = label;
		});
		setAvailableOptions(obj);
	};

	const addReason = () => {
		if (!reasonValidation()) return;

		if (
			reasons.find(
				reason => reason.label.toLowerCase() === reasonInput.trim().toLowerCase()
			)
		)
			return addError({ text: "Cannot add duplicate Reason" });

		setReasons(prev => [
			...prev,
			{ label: reasonInput.trim(), value: reasonInput.trim() },
		]);
		setReasonInput("");
	};

	const deleteReason = reason => {
		setReasons(prev => prev.filter(rea => rea.label !== reason));
	};

	useEffect(() => {
		setReasons(disqualificationReason.value.picklist_values);
	}, [modal]);

	useEffect(() => {
		setDisqualifcationReason({
			...disqualificationReason,
			value: {
				name: disqualificationReason.value.name,
				picklist_values: reasons,
			},
		});
	}, [reasons]);

	const getReasonshort = str => {
		return (
			str.split(" ").splice(0, 6).join(" ") + `${str.split(" ").length > 6 ? "..." : ""}`
		);
	};

	return (
		<Modal
			isModal={modal ? true : false}
			onClose={onClose}
			showCloseButton={true}
			className={styles.integrationStatusModal}
		>
			<div className={styles.header}>
				<Title size="1.2rem">
					{SETTINGS_TRANSLATION.SET_DEFAULT_STATUS[user?.language.toUpperCase()]}
				</Title>
			</div>

			<div className={styles.body}>
				<div className={styles.row}>
					<div className={styles.left}>
						<Title size="1.2rem" className={styles.title}>
							Conversion status
						</Title>
						<Label className={styles.label}>
							Select the status for which lead will be converted
						</Label>

						<Select
							value={integrationStatus.value.converted?.value}
							type="select"
							options={availableOptions}
							className={styles.input}
							placeholder={
								integrationStatus.value.converted?.label ?? "Select default status "
							}
							setValue={val =>
								setIntegrationStatus({
									...integrationStatus,
									value: {
										...integrationStatus.value,
										converted: integrationStatus.value.picklist_values.filter(
											op => op.value === val
										)[0],
									},
								})
							}
						/>
					</div>
					<div className={styles.right}>
						<Title size="1.2rem" className={styles.title}>
							Disqualification status
						</Title>
						<Label className={styles.label}>
							Select the status for which lead will be disqualified
						</Label>

						<Select
							type="select"
							className={styles.input}
							placeholder={
								integrationStatus.value.disqualified?.label ?? "Select default status "
							}
							options={availableOptions}
							value={integrationStatus.value.disqualified?.value}
							setValue={val => {
								setIntegrationStatus({
									...integrationStatus,
									value: {
										...integrationStatus.value,
										disqualified: integrationStatus.value.picklist_values.filter(
											op => op.value === val
										)[0],
									},
								});
							}}
						/>
					</div>
				</div>

				<div className={styles.bottom}>
					<Title size="1.2rem" className={styles.title}>
						Disqualification reasons
					</Title>
					<Label className={styles.label}>
						Enter reasons users can select for disqualifying a lead
					</Label>
					<div className={styles.inputReasonWrapper}>
						<Input
							type={"text"}
							value={reasonInput}
							placeholder={"Type reason"}
							className={styles.inputReason}
							setValue={setReasonInput}
						/>
						<div className={styles.buttonAddWrapper}>
							<ThemedButton
								onClick={() => addReason()}
								theme={ThemedButtonThemes.TRANSPARENT}
								className={styles.buttonAdd}
							>
								{" "}
								<Plus /> Add
							</ThemedButton>
						</div>
					</div>
					<div className={styles.typedReasons}>
						{!reasons?.length ? (
							<Label className={styles.label} style={{ textAlign: "center" }}>
								No reasons added yet
							</Label>
						) : (
							<div className={styles.reasonsRow}>
								{reasons?.map((reasons, i) => (
									<div className={styles.reason}>
										<div title={reasons.label}>{getReasonshort(reasons.label)}</div>

										<div>
											<MinusOutline
												className={styles.buttonReasonRemove}
												onClick={() => deleteReason(reasons.label)}
											/>
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				</div>
			</div>
		</Modal>
	);
};

export default IntegrationStatusModal;
