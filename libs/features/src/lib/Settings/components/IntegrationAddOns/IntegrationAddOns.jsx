import { useState } from "react";
import { useRecoilValue } from "recoil";

import { useEnrichments, useEnrichmentsConfig } from "@cadence-frontend/data-access";
import { userInfo } from "@cadence-frontend/atoms";

import Kaspr from "./components/Kaspr/Kaspr";
import Lusha from "./components/Lusha/Lusha";
import Hunter from "./components/Hunter/Hunter";
import Dropcontact from "./components/Dropcontact/Dropcontact";
import Snov from "./components/Snov/Snov";
import LinkedinExtension from "./components/LinkedinExtension/LinkedinExtension";
import ItemCard from "./components/ItemCard/ItemCard";
import Placeholder from "./components/Placeholder/Placeholder";
import { Settings as SETTINGS_TRANSLATION } from "@cadence-frontend/languages";

import { getEnrichments, INTEGRATION_TYPES } from "./constants";

import styles from "./IntegrationAddOns.module.scss";
import { Title } from "@cadence-frontend/components";

const IntegrationAddOns = props => {
	const integration_type = useRecoilValue(userInfo).integration_type;

	const { enrichmentsData, enrichmentsLoading } = useEnrichments();
	const { updateEnrichmentsConfig } = useEnrichmentsConfig();

	const [integration, setIntegration] = useState("");
	const user = useRecoilValue(userInfo);

	const goBack = () => setIntegration("");

	const renderComponent = () => {
		switch (integration) {
			case INTEGRATION_TYPES.LUSHA:
				return <Lusha goBack={goBack} {...props} />;

			case INTEGRATION_TYPES.KASPR:
				return <Kaspr goBack={goBack} {...props} />;

			case INTEGRATION_TYPES.HUNTER:
				return <Hunter goBack={goBack} {...props} />;

			case INTEGRATION_TYPES.DROPCONTACT:
				return <Dropcontact goBack={goBack} {...props} />;

			case INTEGRATION_TYPES.SNOV:
				return <Snov goBack={goBack} {...props} />;

			case INTEGRATION_TYPES.LINKEDIN_EXTENSION:
				return <LinkedinExtension goBack={goBack} {...props} />;

			default:
				return (
					<>
						<Title size="1.1rem">
							{SETTINGS_TRANSLATION.ADDONS[user?.language?.toUpperCase()]}
						</Title>
						<div className={styles.body}>
							{enrichmentsLoading ? (
								<Placeholder />
							) : (
								getEnrichments(integration_type).map(item => (
									<ItemCard
										key={item.id}
										{...item}
										data={enrichmentsData}
										setIntegration={setIntegration}
										updateEnrichmentsConfig={updateEnrichmentsConfig}
									/>
								))
							)}
						</div>
					</>
				);
		}
	};

	return <div className={styles.integrationAddOns}>{renderComponent()}</div>;
};

export default IntegrationAddOns;
