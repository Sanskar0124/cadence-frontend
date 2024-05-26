/**
 * This component is currently only supported in pipedrive
 */
import { Input, Label, Select, ThemedButton } from "@cadence-frontend/widgets";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import styles from "./InputSelectGroup.module.scss";
import React, { useState } from "react";
import { EMAIL_OPTIONS, PHONE_OPTIONS } from "./constants";
import { Delete, Plus } from "@cadence-frontend/icons";
import { Colors } from "@cadence-frontend/utils";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { ENRICH_LOGO_MAP } from "../GlobalModals/EditLeadIMC/constants";

const InputSelectGroup = ({
	label,
	input,
	setInput,
	field_key,
	field_id,
	handlePrimaryEmailClick,
	editable = true,
	user,
}) => {
	const handleDelete = key => {
		setInput(prev => [...prev?.filter((i, k) => k !== key)]);
	};

	const handleAdd = item => {
		setInput(prev => [
			...prev,
			{
				// [field_id]: "",
				[field_key]: "",
				is_primary: false,
				type: "home",
			},
		]);
	};
	return (
		<div className={styles.inputSelectBox}>
			{input?.map((inp, key) => {
				return (
					<div className={styles.current}>
						<div className={styles.inputBox}>
							<Input
								placeholder="Type here"
								disabled={!editable}
								value={inp?.[field_key]}
								setValue={val => {
									setInput(prev => [
										...prev?.map((i, k) => {
											if (k === key) {
												return {
													...i,
													[field_key]: val,
												};
											} else return i;
										}),
									]);
								}}
								name={field_key}
								className={`${styles.inputSelect} ${!editable && styles.disabled}`}
							/>
							{inp.isEnriched && (
								<div className={styles.enrichLogo}>{ENRICH_LOGO_MAP[inp.isEnriched]}</div>
							)}
						</div>
						<div className={styles.selectBox}>
							<Select
								placeholder={
									COMMON_TRANSLATION.SELECT_HERE[user?.language?.toUpperCase()]
								}
								borderRadius={"0 15px 15px 0"}
								options={label === "phone" ? PHONE_OPTIONS : EMAIL_OPTIONS}
								disabled={!editable}
								value={inp.type}
								setValue={val => {
									setInput(prev => [
										...prev?.map((i, k) => {
											if (k === key) {
												return {
													...i,
													type: val,
												};
											} else return i;
										}),
									]);
								}}
							></Select>
						</div>
						<button
							btnwidth="fit-content"
							onClick={() => handlePrimaryEmailClick(inp)}
							disabled={inp?.[field_key]?.length < 1}
							className={`${styles.radioBtn} ${inp?.is_primary ? styles.primary : ""}`}
						></button>
						{input?.length > 1 && (
							<div
								className={styles.delete}
								onClick={() => editable && handleDelete(key)}
							>
								<Delete color={Colors.veryLightBlue} size="1.4rem" />
							</div>
						)}
					</div>
				);
			})}
			<div className={styles.addMore}>
				<ThemedButton
					theme={ThemedButtonThemes.TRANSPARENT}
					width={"14%"}
					disabled={!editable}
					className={styles.button}
					onClick={() => handleAdd()}
				>
					<Plus />
					Add one more
				</ThemedButton>
			</div>
		</div>
	);
};

export default InputSelectGroup;
