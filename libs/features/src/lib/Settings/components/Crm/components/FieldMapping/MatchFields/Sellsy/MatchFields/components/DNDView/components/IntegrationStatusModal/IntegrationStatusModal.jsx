import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { Modal, Title } from "@cadence-frontend/components";
import { Label, Select, ThemedButton } from "@cadence-frontend/widgets";
import { useState, useEffect } from "react";
import styles from "./IntegrationStatusModal.module.scss";

const IntegrationStatusModal = ({
	modal,
	setModal,
	integrationStatus,
	setIntegrationStatus,
}) => {
	const onClose = () => {
		setModal(false);
	};
	const [availableOptions, setAvailableOptions] = useState({});

	useEffect(() => {
		generateAvailableOptions();
	}, [integrationStatus, modal]);

	console.log(integrationStatus, "Inte");
	const generateAvailableOptions = () => {
		const obj = {};
		integrationStatus?.value?.picklist_values?.forEach(({ value, label }, _) => {
			// if (
			// 	value !== integrationStatus.value.converted?.value &&
			// 	value !== integrationStatus.value.disqualified?.value
			// )
			obj[value] = label;
		});
		setAvailableOptions(obj);
	};

	return (
		<Modal
			isModal={modal ? true : false}
			onClose={onClose}
			showCloseButton={true}
			className={styles.integrationStatusModal}
		>
			<div className={styles.header}>
				<Title size="1.2rem">Set default status</Title>
			</div>
			<div className={styles.body}>
				<Title size="1.2rem" className={styles.title}>
					Disqualification Status
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
				<Title size="1.2rem" className={styles.title}>
					Conversion status
				</Title>
				<Label className={styles.label}>
					Select the status for which lead will be converted
				</Label>
				<Select
					type="select"
					className={styles.input}
					options={availableOptions}
					value={integrationStatus.value.converted?.value}
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
			<div className={styles.footer}>
				{/* <ThemedButton theme={ThemedButtonThemes.PRIMARY} onClick={() => onClose()}>
					Save status
				</ThemedButton> */}
			</div>
		</Modal>
	);
};

export default IntegrationStatusModal;
