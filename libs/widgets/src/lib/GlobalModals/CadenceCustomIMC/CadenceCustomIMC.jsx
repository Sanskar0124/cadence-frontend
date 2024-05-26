/* eslint-disable no-console */
import ReactHtmlParser from "html-react-parser";
import { useState, useEffect, useContext } from "react";
import {
	processCustomVariables,
	removeUnprocessedVariables,
} from "@cadence-frontend/utils";
import { useCustomVariables } from "@cadence-frontend/data-access";
import { MessageContext } from "@cadence-frontend/contexts";

//components
import styles from "./CadenceCustomIMC.module.scss";
import { Input, ThemedButton } from "@cadence-frontend/widgets";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { Modal, Spinner } from "@cadence-frontend/components";
import { INTEGRATION_TYPE, IS_CUSTOM_VARS_AVAILABLE } from "@cadence-frontend/constants";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";

//constants
const TASK_NAME_MAP = {
	cadence_custom: "Custom Task",
	data_check: "Data Check",
	other: "Other",
};

const CadenceCustomIMC = ({
	//typeSpecificProps
	type,
	data,
	node,
	markTaskAsCompleteIfCurrent,
	lead,
	fieldMap,
	//modalProps
	onClose,
}) => {
	const user = useRecoilValue(userInfo);
	const { addError } = useContext(MessageContext);
	const { replaceCustomVariables, replaceCustomVariablesLoading } = useCustomVariables(
		lead?.lead_id
	);

	const [loading, setLoading] = useState();
	const [value, setValue] = useState("");
	const handleSubmit = async () => {
		setLoading(true);
		try {
			await markTaskAsCompleteIfCurrent();
		} catch (err) {
			console.log(err);
		} finally {
			setLoading(false);
			onClose();
		}
	};

	useEffect(() => {
		if (node?.data) {
			let processedScipt;
			if (type === "view_script") {
				processedScipt = processCustomVariables(node?.data?.script, lead, {
					...lead.User,
					Company: fieldMap,
				});
			} else {
				processedScipt = processCustomVariables(node?.data?.message, lead, {
					...lead.User,
					Company: fieldMap,
				});
			}
			if (
				IS_CUSTOM_VARS_AVAILABLE.includes(user?.integration_type) &&
				processedScipt !== ""
			) {
				replaceCustomVariables(processedScipt, {
					onSuccess: data => {
						data.body = removeUnprocessedVariables(data?.body);
						setValue(data.body);
					},
					onError: err => {
						addError({
							text: err.response?.data?.msg ?? "Error while fetching custom variables",
							desc: err.response?.data?.error,
							cId: err?.response?.data?.correlationId,
						});
						processedScipt = removeUnprocessedVariables(processedScipt);
						setValue(processedScipt);
					},
				});
			} else {
				setValue(processedScipt);
			}
		}
	}, [data, node]);

	return (
		<div className={styles.cadenceCustomModalIMC}>
			<div className={styles.header}>{type.replace("_", " ")} Instructions</div>
			<div className={styles.body}>
				{!replaceCustomVariablesLoading ? (
					ReactHtmlParser(value)
				) : (
					<div className={styles.loaderWrapper}>
						<Spinner className={styles.loader} />
					</div>
				)}
			</div>
			{type !== "view_script" && (
				<div className={styles.footer}>
					<ThemedButton
						theme={ThemedButtonThemes.GREEN}
						style={{
							width: "100%",
							boxShadow: " 1.2px 8.2px 24px rgba(54, 205, 207, 0.3)",
							borderRadius: "1.5em",
						}}
						loading={loading}
						onClick={handleSubmit}
					>
						{`Complete ${TASK_NAME_MAP[type]}`}
					</ThemedButton>
				</div>
			)}
		</div>
	);
};

export default CadenceCustomIMC;
