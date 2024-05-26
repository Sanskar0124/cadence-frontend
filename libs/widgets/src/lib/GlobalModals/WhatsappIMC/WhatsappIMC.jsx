/* eslint-disable no-console */
import { useState, useEffect, useContext } from "react";
import { useQueryClient } from "react-query";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import {
	usePhoneNumber,
	useCadenceSettings,
	useCustomVariables,
	useWhatsappActivity,
} from "@cadence-frontend/data-access";
import { MessageContext } from "@cadence-frontend/contexts";

import styles from "./WhatsappIMC.module.scss";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";
import {
	processCustomVariables,
	removeUnprocessedVariables,
} from "@cadence-frontend/utils";
import ImportTemplateModal from "../../Editor/components/ImportTemplateModal/ImportTemplateModal";
import {
	Notifications as NOTIFICATIONS_TRANSLATION,
	People as PEOPLE_TRANSLATION,
} from "@cadence-frontend/languages";
import { Div, Spinner } from "@cadence-frontend/components";
import Label from "../../Label/Label";
import Select from "../../Select/Select";
import Editor from "../../Editor/Editor";
import ThemedButton from "../../ThemedButton/ThemedButton";
import { IS_CUSTOM_VARS_AVAILABLE } from "@cadence-frontend/constants";

const WhatsappIMC = ({
	markTaskAsCompleteIfCurrent,
	lead,
	fieldMap,
	cadence,
	data: activityData,
	node,
	preview,
	validateTask = false,
	//modalProps
	onClose: onModalClose,
}) => {
	const { addError } = useContext(MessageContext);
	const { phoneNumbers, phoneNumbersLoading } = usePhoneNumber(true);

	const user = useRecoilValue(userInfo);
	const { createWhatsppActivity } = useWhatsappActivity(lead?.lead_id);
	const { replaceCustomVariables, replaceCustomVariablesLoading } = useCustomVariables(
		lead?.lead_id
	);

	const [leadPhoneNumbers, setLeadPhoneNumbers] = useState([]);
	const [content, setContent] = useState("");
	const [leadNumber, setLeadNumber] = useState("");
	const [canSend, setCanSend] = useState(false);
	const [template, setTemplate] = useState(null);
	const [templateModal, setTemplateModal] = useState(false);

	useEffect(() => {
		if (lead) {
			setLeadNumber(
				lead.Lead_phone_numbers?.filter(phoneNumber => phoneNumber.is_primary)[0]
					?.phone_number
			);

			let phoneNumbersArray = lead.Lead_phone_numbers?.filter(pn => pn.phone_number)?.map(
				phoneNumber => ({
					label: phoneNumber?.formatted_phone_number,
					value: phoneNumber?.phone_number,
				})
			);
			if (lead?.Account?.phone_number)
				phoneNumbersArray.push({
					label: `${lead.Account.phone_number}`,
					value: lead.Account.phone_number,
				});
			setLeadPhoneNumbers(phoneNumbersArray);
		}

		if (preview && activityData) {
			setContent(activityData.status);
		}

		if (node?.data) {
			let msgContent = processCustomVariables(node?.data.message, lead, {
				...lead.User,
				Company: fieldMap,
			});
			if (
				IS_CUSTOM_VARS_AVAILABLE.includes(user?.integration_type) &&
				msgContent !== ""
			) {
				replaceCustomVariables(msgContent, {
					onSuccess: data => {
						data.body = removeUnprocessedVariables(data?.body);
						setContent(data.body);
					},
					onError: err => {
						addError({
							text: err.response?.data?.msg ?? "Error while fetching custom variables",
							desc: err.response?.data?.error,
							cId: err?.response?.data?.correlationId,
						});
						msgContent = removeUnprocessedVariables(msgContent);
						setContent(msgContent);
					},
				});
			} else {
				setContent(msgContent);
			}
		}
	}, [lead, phoneNumbers, activityData, node?.data]);

	useEffect(() => {
		setCanSend(!!(content && leadNumber));
	}, [content, leadNumber]);

	const handleSendMessage = async () => {
		if (!leadNumber) {
			addError({ text: "Please select a recepient number." });
			return;
		}
		if (!content) {
			addError({ text: "Message body cannot be empty." });
			return;
		}

		const textMsg = processCustomVariables(content, lead, {
			...lead.User,
			Company: fieldMap,
		});
		const encodedTextMsg = encodeURIComponent(textMsg);
		window.open(
			`https://api.whatsapp.com/send/?phone=${leadNumber}&text=${encodedTextMsg}&type=phone_number&app_absent=0`
		);
		if (validateTask) await markTaskAsCompleteIfCurrent();
		else createWhatsppActivity(textMsg);
		handleClose();
	};

	const handleClose = () => {
		setContent("");
		onModalClose();
	};

	useEffect(() => {
		if (template)
			setContent(
				processCustomVariables(template.message, lead, {
					...lead.User,
					Company: fieldMap,
				})
			);
	}, [template]);

	return (
		<div className={styles.messageIMC}>
			{preview ? (
				<h2 className={styles.heading}>
					{NOTIFICATIONS_TRANSLATION.MESSAGE[user?.language?.toUpperCase()]}
				</h2>
			) : (
				<div className={styles.header} style={{ marginTop: "2em" }}>
					<Div
						style={{
							width: "100%",
							marginTop: "0.75em",
						}}
						className={styles.inputGroup}
						loading={phoneNumbersLoading}
					>
						<Label>To</Label>
						<Select
							value={leadNumber}
							setValue={setLeadNumber}
							className={styles.select}
							width={"100%"}
							options={leadPhoneNumbers}
							border={false}
							isSearchable
						/>
					</Div>
				</div>
			)}
			<div className={styles.body}>
				{!replaceCustomVariablesLoading ? (
					<Editor
						value={content}
						setValue={setContent}
						theme="message"
						height="400px"
						className={styles.editor}
						disabled={preview}
						lead={lead}
						fieldMap={fieldMap}
						showAllMiscVars={false}
					/>
				) : (
					<div className={styles.loaderWrapper}>
						<Spinner className={styles.loader} />
					</div>
				)}
			</div>
			{!preview && (
				<div className={styles.buttons}>
					<ThemedButton
						width="fit-content"
						theme={ThemedButtonThemes.TRANSPARENT}
						onClick={() => setTemplateModal({ type: "whatsapp" })}
					>
						<div>{PEOPLE_TRANSLATION.LOAD_TEMPLATE[user?.language?.toUpperCase()]}</div>
					</ThemedButton>
				</div>
			)}
			<div className={styles.footer}>
				{!preview && (
					<ThemedButton
						theme={ThemedButtonThemes.GREEN}
						style={{
							width: "100%",
							boxShadow: " 1.2px 8.2px 24px rgba(54, 205, 207, 0.3)",
							borderRadius: "1.5em",
						}}
						onClick={handleSendMessage}
						disabled={!canSend || replaceCustomVariablesLoading}
					>
						<div>Send</div>
					</ThemedButton>
				)}
			</div>

			<ImportTemplateModal
				modal={templateModal}
				setModal={setTemplateModal}
				setTemplate={setTemplate}
			/>
		</div>
	);
};

export default WhatsappIMC;
