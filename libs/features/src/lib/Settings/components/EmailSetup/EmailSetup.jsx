import { userInfo } from "@cadence-frontend/atoms";
import { Title } from "@cadence-frontend/components";
import { MAIL_INTEGRATION_TYPES } from "@cadence-frontend/constants";
import { Google, Link, Link2, LinkBox, Outlook } from "@cadence-frontend/icons";
import {
	Settings as SETTINGS_TRANSLATION,
	useIntegrationTranslations,
} from "@cadence-frontend/languages";
import { Colors } from "@cadence-frontend/utils";
import { useRecoilValue } from "recoil";
import styles from "./EmailSetup.module.scss";
import { SEARCH_CATEGORY, SEARCH_OPTIONS } from "../Search/constants";
import EmailScope from "./components/EmailScope/EmailScope";

const EmailSetup = () => {
	const user = useRecoilValue(userInfo);

	const INTEGRATION_TRANSLATIONS = useIntegrationTranslations(user?.integration_type);

	return (
		<div className={styles.emailSetup}>
			<Title size="1.1rem">
				{SETTINGS_TRANSLATION.EMAIL_SYSTEM[user?.language?.toUpperCase()]}
			</Title>
			<div className={styles.divider} />
			{/* {Connected Mail System} */}
			<div className={styles.container} id={SEARCH_OPTIONS.CONNECTED_MAIL_SYSTEM}>
				<div className={styles.title}>
					<h2>
						{SETTINGS_TRANSLATION.CONNECTED_MAIL_SYSTEM[user?.language?.toUpperCase()]}
					</h2>
					<p>
						{
							INTEGRATION_TRANSLATIONS.USE_EMAIL_WITH_DATABASE[
								user?.language?.toUpperCase()
							]
						}
					</p>
				</div>

				<div className={styles.settings}>
					<div className={`${styles.greyBox} ${styles.active}`}>
						<div>
							{user?.mail_integration_type === MAIL_INTEGRATION_TYPES.GOOGLE ? (
								<>
									<Google />
									{
										SETTINGS_TRANSLATION
											.YOUR_ORGANIZATION_IS_COMMECTED_WITH_GOOGLE_WORKSPACE[
											user?.language?.toUpperCase()
										]
									}
								</>
							) : (
								<>
									<Outlook size="2.4rem" />
									{
										SETTINGS_TRANSLATION
											.YOUR_ORGANIZATION_IS_COMMECTED_WITH_MICROSOFT_OUTLOOK[
											user?.language?.toUpperCase()
										]
									}
								</>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* Setup Google Domain */}
			{/* {user?.mail_integration_type === MAIL_INTEGRATION_TYPES.GOOGLE && (
				<>
					<EmailScope styles={styles} />
					<div className={styles.divider} />
					<div className={styles.container} id={SEARCH_OPTIONS.SETUP_GOOGLE_DOMAIN}>
						<div className={styles.title}>
							<h2>
								{SETTINGS_TRANSLATION.SETUP_GOOGLE_DOMAIN[user?.language?.toUpperCase()]}
							</h2>
							<p>
								{
									SETTINGS_TRANSLATION.WE_REQUIRE_YOUR_G_SUIT_ACCOUNT[
										user?.language?.toUpperCase()
									]
								}
							</p>
						</div>
						<div className={styles.settings}>
							<a
								href="https://docs.google.com/document/d/1SOLQnMc71V3A7dE5m3jHKlEe8uxaQBzfq6moJsNaeSE/edit"
								target="_blank"
								rel="noreferrer"
							>
								<Link2 color={Colors.blue} />{" "}
								{
									SETTINGS_TRANSLATION.DOCUMENTATION_TO_SETUP_DOMAIN[
										user?.language.toUpperCase()
									]
								}
							</a>
						</div>
					</div>
				</>
			)} */}
		</div>
	);
};

export default EmailSetup;
