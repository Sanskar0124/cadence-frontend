import styles from "./InstallPackage.module.scss";
import {
	Salesforce as SALESFORCE_TRANSLATION,
	Settings as SETTINGS_TRANSLATION,
} from "@cadence-frontend/languages";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";
import { Input } from "@cadence-frontend/widgets";
import { CopyBlank } from "@cadence-frontend/icons";
import { useContext } from "react";
import { InputThemes } from "@cadence-frontend/themes";
import { Colors } from "@cadence-frontend/utils";
import { MessageContext } from "@cadence-frontend/contexts";
import { SEARCH_OPTIONS } from "../../../Search/constants";

const SF_PACKAGE_LINK = "packaging/installPackage.apexp?p0=04t7Q000000IKxW";

const InstallPackage = () => {
	const { addSuccess } = useContext(MessageContext);

	const user = useRecoilValue(userInfo);

	return (
		<div className={styles.container} id={SEARCH_OPTIONS.INSTALL_PACKAGE}>
			<div className={styles.title}>
				<h2>
					{
						SALESFORCE_TRANSLATION.INSTALL_SALESFORCE_PACKAGE[
							user?.language?.toUpperCase()
						]
					}
				</h2>
				<p>{SALESFORCE_TRANSLATION.INSTALL_DESC[user?.language?.toUpperCase()]}</p>
			</div>
			<div className={styles.settings}>
				<div className={styles.pkg}>
					<Input
						value={`https://login.salesforce.com/${SF_PACKAGE_LINK}`}
						theme={InputThemes.WHITE_WITH_GREY_BORDER}
						className={styles.input}
						style={{ textDecoration: "underline" }}
						disabled
					/>
					<div>
						<CopyBlank
							size={18}
							color={Colors.lightBlue}
							onClick={() => {
								addSuccess("Copy Successful");
								navigator.clipboard.writeText(SF_PACKAGE_LINK);
							}}
						/>
					</div>
				</div>
				<div className={styles.helpLinks}>
					<a
						href={
							user?.language === "english"
								? "https://ringovercadence.freshdesk.com/en/support/solutions/articles/103000046450-steps-for-ringover-cadence-package-installation-and-setup"
								: "https://ringovercadence.freshdesk.com/fr/support/solutions/articles/103000046450-%C3%89tapes-d-installation-et-de-configuration-du-package-cadence-salesfocre-"
						}
						target="_blank"
						rel="noreferrer"
					>
						{
							SETTINGS_TRANSLATION.READ_SUPPORT_DOCUMENTATION[
								user?.language?.toUpperCase()
							]
						}
					</a>
				</div>
			</div>
		</div>
	);
};

export default InstallPackage;
