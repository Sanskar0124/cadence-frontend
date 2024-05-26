import { useCallback, useEffect, useState, useContext } from "react";
import { useRecoilValue } from "recoil";

import { userInfo } from "@cadence-frontend/atoms";
import { MessageContext } from "@cadence-frontend/contexts";

import { LinkedinBox } from "@cadence-frontend/icons";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import {
	Common as COMMON_TRANSLATION,
	Addons as ADDONS_TRANSLATION,
} from "@cadence-frontend/languages";
import { useEnrichmentsConfig } from "@cadence-frontend/data-access";

import { BackButton, Label, Select, ThemedButton } from "@cadence-frontend/widgets";

import MatchFields from "./components/MatchFields/MatchFields";
import { TABS, EXPORT_TYPE_OPTIONS } from "./constants";

import { cleanUpdateEnrichmentsConfigBody } from "../../utils";

import styles from "./LinkedinExtension.module.scss";
import { INTEGRATION_TYPE } from "@cadence-frontend/constants";

const LinkedinExtension = ({ goBack }) => {
	const user = useRecoilValue(userInfo);

	const { addError, addSuccess } = useContext(MessageContext);

	const {
		enrichmentsConfig,
		fetchEnrichmentsConfig,
		enrichmentsConfigLoading,
		updateEnrichmentsConfig,
		updateEnrichmentsConfigLoading,
	} = useEnrichmentsConfig();

	const [activeTab, setActiveTab] = useState(TABS.FIELD_MAP);
	const [postData, setPostData] = useState(null);
	const [ifUnsavedChangesForFieldMapping, setIfUnsavedChangesForFieldMapping] =
		useState(null);
	const [config, setConfig] = useState({});

	useEffect(() => {
		if (enrichmentsConfig) setConfig(enrichmentsConfig);
	}, [enrichmentsConfig]);

	const renderComponent = useCallback(() => {
		switch (activeTab) {
			case TABS.FIELD_MAP:
				return (
					<MatchFields
						setPostData={setPostData}
						setDisableNext={() => null}
						setIfUnsavedChanges={setIfUnsavedChangesForFieldMapping}
					/>
				);

			case TABS.ACCESS:
				return null;

			default:
				return null;
		}
	}, [activeTab]);

	const handleSave = async () => {
		if (typeof postData === "function")
			await postData({
				cb: () => null,
			});
		handleConfigUpdate();
	};

	const handleConfigUpdate = () => {
		const body = { ...config, integration_type: user.integration_type };

		updateEnrichmentsConfig(cleanUpdateEnrichmentsConfigBody(body), {
			onError: err => {
				addError({
					text: err?.response?.data?.msg,
					desc: err?.response?.data?.error,
					cId: err?.response?.data?.correlationId,
				});
			},
			onSuccess: () => {
				fetchEnrichmentsConfig();
			},
		});
	};

	return (
		<div className={styles.linkedinExtension}>
			<div className={styles.header}>
				<div className={styles.left}>
					<BackButton
						text={COMMON_TRANSLATION.INTEGRATIONS[user?.language?.toUpperCase()]}
						onClick={goBack}
					/>
					<div className={styles.titleContainer}>
						<LinkedinBox size="45px" color="#3275B3" />
						<h2 className={styles.title}>
							{ADDONS_TRANSLATION.LINKEDIN_EXTENSION[user?.language?.toUpperCase()]}
						</h2>
					</div>
				</div>
				<div className={styles.right}>
					{INTEGRATION_TYPE.SALESFORCE === user?.integration_type && (
						<div className={styles.inputGroup}>
							<Label>
								{ADDONS_TRANSLATION.DEFAULT_EXPORT_TYPE[user?.language?.toUpperCase()]}
							</Label>
							<Select
								options={EXPORT_TYPE_OPTIONS}
								value={config}
								name="default_linkedin_export_type"
								setValue={setConfig}
								width="150px"
							/>
						</div>
					)}
					<ThemedButton
						theme={ThemedButtonThemes.PRIMARY}
						className={styles.saveBtn}
						onClick={handleSave}
						width="fit-content"
					>
						{COMMON_TRANSLATION.SAVE[user?.language?.toUpperCase()]}
					</ThemedButton>
				</div>
			</div>

			<div className={styles.integrationSettings}></div>

			<div className={styles.main}>{renderComponent()}</div>
		</div>
	);
};

export default LinkedinExtension;
