import React, { useContext, useState } from "react";

import { PageContainer } from "@cadence-frontend/components";
import { InputThemes, ThemedButtonThemes } from "@cadence-frontend/themes";
import {
	BackButton,
	Label,
	Input,
	Select,
	ThemedButton,
} from "@cadence-frontend/widgets";
import { useLeadImport } from "@cadence-frontend/data-access";
import SelectCadence from "./components/SelectCadence/SelectCadence";
import { MessageContext } from "@cadence-frontend/contexts";

import { COMPANY_SIZE_OPTIONS } from "./constants";

import styles from "./LeadInfo.module.scss";
import { Goto, CopyBlank } from "@cadence-frontend/icons";
import { Colors } from "@cadence-frontend/utils";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import { Tasks as TASKS_TRANSLATION } from "@cadence-frontend/languages";
import { Cadence as CADENCE_TRANSLATION } from "@cadence-frontend/languages";

const LeadInfo = ({
	setActivePage,
	lead,
	user,
	cadenceSelected,
	setCadenceSelected,
	salesforceLeadUrl,
	setSalesforceLeadUrl,
}) => {
	const {
		importLeadToSalesforce,
		importLeadToSalesforceLoading,
		importLeadsToSalesforceError,
		importLeadToCadence,
		importLeadToCadenceLoading,
	} = useLeadImport();

	const [input, setInput] = useState(lead ?? {});
	const [isDuplicate, setIsDuplicate] = useState(false);
	const { addError } = useContext(MessageContext);

	const handleSubmit = () => {
		const importToSfBody = { type: "lead", profile: input };
		importLeadToSalesforce(importToSfBody, {
			onSuccess: data => {
				setSalesforceLeadUrl(
					`${user?.Integration_Token?.instance_url}/lightning/r/Lead/${data.salesforce_lead_id}/view`
				);
				const importToCadenceBody = {
					leads: [
						{
							...data,
							cadence_id: cadenceSelected.id,
							salesforce_owner_id: user.salesforce_owner_id,
						},
					],
				};
				importLeadToCadence(importToCadenceBody, {
					onSuccess: data => {
						setActivePage(5);
					},
				});
			},
			onError: err => {
				const error = err.response.data;
				if (error?.msg?.toLowerCase().includes("duplicate")) {
					const type = error.data.type;
					let url = "";
					setIsDuplicate(type);
					if (type === "lead")
						url = `${user?.Integration_Token?.instance_url}/lightning/r/Lead/${error.data.salesforce_lead_id}/view`;
					else
						url = `${user?.Integration_Token?.instance_url}/lightning/r/Contact/${error.data.salesforce_contact_id}/view`;
					setSalesforceLeadUrl(url);
				} else {
					addError({ text: error?.msg, desc: error?.error, cId: error?.correlationId });
				}
			},
		});
	};

	return (
		<PageContainer className={styles.pageContainer}>
			<div className={styles.innerBox}>
				<div className={styles.upperBoundary}></div>
				<div className={styles.leadInfo}>
					<BackButton text="back" onClick={() => setActivePage(1)} />
					<div className={styles.inputGroup}>
						<Label>
							{CADENCE_TRANSLATION.SELECT_CADENCE_FOR_LEAD[user?.language?.toUpperCase()]}
						</Label>
						<SelectCadence
							cadenceSelected={cadenceSelected}
							setCadenceSelected={setCadenceSelected}
						/>
					</div>
					<div className={styles.leadInfoHead}>
						<h3>Lead information</h3>
						{isDuplicate ? (
							<ThemedButton theme={ThemedButtonThemes.RED} className={styles.btnDup}>
								Duplicate
							</ThemedButton>
						) : (
							<ThemedButton theme={ThemedButtonThemes.PRIMARY} className={styles.btnDup}>
								New
							</ThemedButton>
						)}
					</div>
					<div className={styles.main}>
						<div className={styles.inputGroup}>
							<Label>{TASKS_TRANSLATION.FIRST_NAME[user?.language?.toUpperCase()]}</Label>
							<Input
								value={input}
								setValue={setInput}
								name="firstName"
								className={styles.input}
								theme={InputThemes.WHITE_WITH_GREY_BORDER}
							/>
						</div>
						<div className={styles.inputGroup}>
							<Label>{COMMON_TRANSLATION.LAST_NAME[user?.language?.toUpperCase()]}</Label>
							<Input
								value={input}
								setValue={setInput}
								name="lastName"
								className={styles.input}
								theme={InputThemes.WHITE_WITH_GREY_BORDER}
							/>
						</div>
						<div className={styles.inputGroup}>
							<Label>{TASKS_TRANSLATION.POSITION[user?.language?.toUpperCase()]}</Label>
							<Input
								value={input}
								setValue={setInput}
								name="position"
								className={styles.input}
								theme={InputThemes.WHITE_WITH_GREY_BORDER}
							/>
						</div>
						<div className={styles.inputGroup}>
							<Label>Email</Label>
							<Input
								value={input}
								setValue={setInput}
								name="email"
								className={styles.input}
								theme={InputThemes.WHITE_WITH_GREY_BORDER}
							/>
						</div>
						<div className={styles.inputGroup}>
							<Label>{COMMON_TRANSLATION.LINKEDIN[user?.language?.toUpperCase()]}</Label>
							<Input
								value={input}
								setValue={setInput}
								name="linkedinUrl"
								className={styles.input}
								theme={InputThemes.WHITE_WITH_GREY_BORDER}
							/>
						</div>
						<div className={styles.inputGroup}>
							<Label>Location</Label>
							<Input
								value={input}
								setValue={setInput}
								name="location"
								className={styles.input}
								theme={InputThemes.WHITE_WITH_GREY_BORDER}
							/>
						</div>
						<div className={styles.inputGroup}>
							<Label>MobilePhone</Label>
							<Input
								value={input}
								setValue={setInput}
								name="mobilePhone"
								className={styles.input}
								theme={InputThemes.WHITE_WITH_GREY_BORDER}
							/>
						</div>
						<div className={styles.inputGroup}>
							<Label>Phone</Label>
							<Input
								value={input}
								setValue={setInput}
								name="phone"
								className={styles.input}
								theme={InputThemes.WHITE_WITH_GREY_BORDER}
							/>
						</div>
						<div className={styles.inputGroup}>
							<Label>Account name</Label>
							<Input
								value={input}
								setValue={setInput}
								name="companyName"
								className={styles.input}
								theme={InputThemes.WHITE_WITH_GREY_BORDER}
							/>
						</div>
						<div className={styles.inputGroup}>
							<Label>Account size</Label>
							<Select
								value={input}
								setValue={setInput}
								name="companySize"
								borderColor="#DADCE0"
								borderRadius="15px"
								width="100%"
								options={COMPANY_SIZE_OPTIONS}
								height="40px"
							/>
						</div>
						<div className={styles.inputGroup}>
							<Label>Account LinkedIn</Label>
							<Input
								value={input}
								setValue={setInput}
								name="companySocialUrl"
								className={styles.input}
								theme={InputThemes.WHITE_WITH_GREY_BORDER}
							/>
						</div>
						<div className={styles.inputGroup}>
							<Label>Account website</Label>
							<Input
								value={input}
								setValue={setInput}
								name="companyUrl"
								className={styles.input}
								theme={InputThemes.WHITE_WITH_GREY_BORDER}
							/>
						</div>
						<div className={styles.inputGroup}>
							<Label>Account phone</Label>
							<Input
								value={input}
								setValue={setInput}
								name="companyPhone"
								className={styles.input}
								theme={InputThemes.WHITE_WITH_GREY_BORDER}
							/>
						</div>
						<div className={styles.inputGroup}>
							<Label>City</Label>
							<Input
								value={input}
								setValue={setInput}
								name="companyCity"
								className={styles.input}
								theme={InputThemes.WHITE_WITH_GREY_BORDER}
							/>
						</div>
						<div className={styles.inputGroup}>
							<Label>State</Label>
							<Input
								value={input}
								setValue={setInput}
								name="companyState"
								className={styles.input}
								theme={InputThemes.WHITE_WITH_GREY_BORDER}
							/>
						</div>
						<div className={styles.inputGroup}>
							<Label>Country</Label>
							<Input
								value={input}
								setValue={setInput}
								name="companyCountry"
								className={styles.input}
								theme={InputThemes.WHITE_WITH_GREY_BORDER}
							/>
						</div>
						<div className={styles.inputGroup}>
							<Label>Postal code</Label>
							<Input
								value={input}
								setValue={setInput}
								name="companyPostal"
								className={styles.input}
								theme={InputThemes.WHITE_WITH_GREY_BORDER}
							/>
						</div>
						<div className={styles.inputGroup}>
							<Label>Industry</Label>
							<Input
								value={input}
								setValue={setInput}
								name="companyIndustry"
								className={styles.input}
								theme={InputThemes.WHITE_WITH_GREY_BORDER}
							/>
						</div>
						<div className={styles.inputGroup}>
							<Label>Company location</Label>
							<Input
								value={input}
								setValue={setInput}
								name="companyLocation"
								className={styles.input}
								theme={InputThemes.WHITE_WITH_GREY_BORDER}
							/>
						</div>
						<div className={styles.inputGroup}>
							<Label>Founded year</Label>
							<Input
								value={input}
								setValue={setInput}
								name="companyFoundedYear"
								className={styles.input}
								theme={InputThemes.WHITE_WITH_GREY_BORDER}
							/>
						</div>
					</div>
					{/* addError()
					<p className="error">
						{!importLeadsToSalesforceError?.response?.data?.msg
							?.toLowerCase()
							?.includes("duplicate") &&
							importLeadsToSalesforceError?.response?.data?.msg}
					</p> */}
					{isDuplicate ? (
						<div className={styles.duplicate}>
							<p>This {isDuplicate} already exists in Salesforce</p>
							<div className={styles.btns}>
								<ThemedButton
									theme={ThemedButtonThemes.WHITE}
									className={styles.whiteBtn}
									onClick={() => window.open(salesforceLeadUrl, "_blank")}
								>
									<Goto color={Colors.lightBlue} />
									<span>Go to {isDuplicate}</span>
								</ThemedButton>
								<ThemedButton
									theme={ThemedButtonThemes.WHITE}
									className={styles.whiteBtn}
									onClick={() => navigator.clipboard.writeText(salesforceLeadUrl)}
								>
									<CopyBlank />
									<span>Copy URL</span>
								</ThemedButton>
							</div>
						</div>
					) : (
						<ThemedButton
							theme={ThemedButtonThemes.PRIMARY}
							className={styles.btn}
							onClick={handleSubmit}
							loading={importLeadToCadenceLoading || importLeadToSalesforceLoading}
						>
							Import to Cadence
						</ThemedButton>
					)}
				</div>
			</div>
		</PageContainer>
	);
};

export default LeadInfo;
