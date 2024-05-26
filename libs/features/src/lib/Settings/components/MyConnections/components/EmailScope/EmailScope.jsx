import React, { useContext, useState } from "react";
import styles from "./EmailScope.module.scss";

import {
	Profile as PROFILE_TRANSLATION,
	Common as COMMON_TRANSLATION,
} from "@cadence-frontend/languages";
import { MessageContext } from "@cadence-frontend/contexts";
import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue } from "recoil";
import { Upgrade } from "@cadence-frontend/icons";
import { ThemedButton } from "@cadence-frontend/widgets";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { Modal } from "@cadence-frontend/components";

const EmailScope = () => {
	const { addError, addSuccess } = useContext(MessageContext);
	const user = useRecoilValue(userInfo);
	const [modal, setModal] = useState(false);

	return (
		<>
			<div className={styles.container}>
				<div className={styles.title}>
					<h1>{COMMON_TRANSLATION.ADVANCE_SCOPE[user?.language?.toUpperCase()]}</h1>
					<p>
						Upgrade to advanced scope to be able to view, read and reply to all your
						prospect’s mails directly from Cadence.
					</p>
				</div>
				<div className={styles.settings}>
					{user?.email_scope_level === "advance" ? (
						<div className={styles.greyBox}>
							<div>
								<Upgrade size="24px" />
								<div>Upgraded to advanced scope</div>
							</div>

							<ThemedButton theme={ThemedButtonThemes.TRANSPARENT} width="fit-content">
								<div>{COMMON_TRANSLATION.DOWNGRADE[user.language?.toUpperCase()]}</div>
							</ThemedButton>
						</div>
					) : (
						<ThemedButton
							theme={ThemedButtonThemes.GREY}
							width="fit-content"
							onClick={() => setModal(true)}
						>
							<Upgrade size="24px" />
							<div>Upgrade now</div>
						</ThemedButton>
					)}
				</div>
			</div>

			<Modal
				isModal={modal}
				onClose={() => setModal(false)}
				className={styles.upgradeModal}
				showCloseButton
			>
				<h1>Upgrade to advance scope</h1>
				<p>
					Follow the directions given below to complete your domain verification to
					upgrade.
				</p>

				<div className={styles.stpesWrapper}>
					<div className={styles.header}>
						<h1>Pre requisites</h1>
						<p>Access to google admin console</p>
					</div>
					<div className={styles.steps}>
						<h2>Steps</h2>
						<p>
							{" "}
							1.{" "}
							<a
								href="https://admin.google.com/"
								className={styles.linktext}
								target="_blank"
								rel="noreferrer"
							>
								Sign in
							</a>{" "}
							to your{" "}
							<a
								href="https://support.google.com/a/answer/182076"
								rel="noreferrer"
								target="_blank"
								className={styles.linktext}
							>
								Google Admin console.
							</a>
						</p>
						<p>
							{" "}
							2. On the Admin console Home page, go to{" "}
							<span className={styles.boldText}>Security &gt; API controls</span>.
						</p>

						<p>
							{" "}
							3. Click{" "}
							<span className={styles.boldText}> Manage Third-Party App Access</span>.
						</p>

						<p>
							{" "}
							4. Under <span className={styles.boldText}> App access control</span>, click{" "}
							<span className={styles.boldText}> Manage Third-Party App Access</span>.
						</p>

						<p>
							{" "}
							5. For<span className={styles.boldText}> Configured apps</span>, click Add
							app.
						</p>
						<p>
							{" "}
							6. Choose{" "}
							<span className={styles.boldText}>OAuth App Name or Client ID</span>,{" "}
							<span className={styles.boldText}>Android</span>, or{" "}
							<span className={styles.boldText}>IOS</span>.
						</p>
						<p>
							{" "}
							7. Enter the app's client ID and click{" "}
							<span className={styles.boldText}>Search</span>. (
							<span className={styles.highlightedText}>
								927318954624-5slerlie1eo58m1jl1rja4b2p2pqqf5f.apps.googleusercontent.com
							</span>
							){" "}
						</p>
						<p>
							{" "}
							8. Point to the app and click{" "}
							<span className={styles.boldText}>Select</span>.
						</p>

						<p>
							{" "}
							9. Check the boxes for the client IDs that you want to configure and click{" "}
							<span className={styles.boldText}>Select</span>. (check the{" "}
							<span className={styles.boldText}>Trust internal, domain-owned apps </span>{" "}
							box &gt; click <span className={styles.boldText}> Save</span>.)
						</p>
						<p>
							{" "}
							10. Select <span className={styles.boldText}> Trusted </span>.{" "}
						</p>
					</div>
				</div>
			</Modal>
		</>
	);
};

export default EmailScope;
