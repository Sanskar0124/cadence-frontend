import React, { useEffect, useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { PageContainer } from "@cadence-frontend/components";
import {
	RingoverLogo,
	SalesforceDisconnected,
	SalesforceCloud,
	Tick,
} from "@cadence-frontend/icons";
import { MessageContext } from "@cadence-frontend/contexts";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { Input, Label, ThemedButton } from "@cadence-frontend/widgets";
import { InputThemes } from "@cadence-frontend/themes";
import { useLinkedinExtract, useUser } from "@cadence-frontend/data-access";

import styles from "./LinkedInUrl.module.scss";

import { Colors } from "@cadence-frontend/utils";
import {
	Common as COMMON_TRANSLATION,
	Salesforce as SALESFORCE_TRANSLATION,
} from "@cadence-frontend/languages";

const COOKIE =
	"AQEDAQkP8y0DWHuzAAABgUNO7AgAAAGBZ1twCE0ADK7yybiZf_tegWsoHir9-hzMumzbOU1R8vmTVUUBoOCJcrAG-tB49Vp4FIJLNM6Ibdvbeytu3G4hH1Pgp2PjK0yJnUsAYmN3a4yVulqspQNBBM9v";

const LinkedInUrl = ({ setActivePage, setLead, setUser }) => {
	const { user, fetchUser } = useUser();
	const {
		extractLeadInfo,
		extractLeadInfoLoading,
		extractLeadInfoError,
		extractLeadsFromSearch,
	} = useLinkedinExtract();

	const navigate = useNavigate();
	const { addError } = useContext(MessageContext);
	const [input, setInput] = useState();
	const [cookie, setCookie] = useState();

	useEffect(() => {
		fetchUser();
	}, []);

	useEffect(() => {
		if (user) {
			setUser(user);
		}
	}, [user]);

	const handleSubmit = () => {
		if (!input) {
			addError({ text: "Provide the LinkedIn URL" });
			return;
		}
		if (!cookie) {
			addError({ text: "Provide the cookie" });
			return;
		}
		const isMultiple = input?.includes("/search/results/");
		if (isMultiple) {
			const body = {
				cookie: COOKIE,
				search_url: input,
			};
			extractLeadsFromSearch(body, {
				onSuccess: () => {
					setActivePage(4);
				},
			});
		} else {
			const body = {
				cookie: cookie || COOKIE,
				linkedinUrl: input,
			};

			extractLeadInfo(body, {
				onSuccess: data => {
					setLead(data);
					setActivePage(isMultiple ? 4 : 3);
				},
				onError: err => {
					addError({
						text: extractLeadInfoError?.response?.data?.msg,
						desc: extractLeadInfoError?.response?.data?.error ?? "Please contact support",
						cId: extractLeadInfoError?.response?.data?.correlationId,
					});
				},
			});
		}
	};

	return (
		<PageContainer className={styles.container}>
			<div className={styles.linkedinUrl}>
				<div className={styles.upperBoundary}></div>
				<div className={styles.header}>
					<div className={styles.logo}>
						<RingoverLogo />
						<div>
							<span>{COMMON_TRANSLATION.CADENCE[user?.language?.toUpperCase()]}</span>
							<span>{COMMON_TRANSLATION.BY_RINGOVER[user?.language?.toUpperCase()]}</span>
						</div>
					</div>
					{user?.Integration_Token?.is_logged_out ? (
						<div className={styles.sfConnected}>
							<SalesforceDisconnected />
							<span>
								{
									SALESFORCE_TRANSLATION.SALESFORCE_NOT_CONNECTED[
										user?.language?.toUpperCase()
									]
								}
							</span>
						</div>
					) : (
						<div className={styles.sfConnected}>
							<div className={styles.sfTick}>
								<Tick size="0.7rem" color={Colors.white} />
							</div>
							<span>Salesforce connected</span>
						</div>
					)}
				</div>
				{user?.Integration_Token?.is_logged_out ? (
					<div className={styles.mainSalesforce}>
						<h3></h3>
						<p>
							Please connect to SalesSalesforce not connectedforce on the cadence tool to
							use the extension
						</p>
						<ThemedButton
							className={styles.btn}
							theme={ThemedButtonThemes.WHITE}
							onClick={() => navigate("/settings")}
						>
							<SalesforceCloud />
							<div>
								{
									SALESFORCE_TRANSLATION.CONNECT_TO_SALESFORCE[
										user?.language?.toUpperCase()
									]
								}
							</div>
						</ThemedButton>
					</div>
				) : (
					<div className={styles.main}>
						<p>
							{
								SALESFORCE_TRANSLATION.EXTRACT_INFORMATION_FROM_LINKEDIN[
									user?.language?.toUpperCase()
								]
							}
						</p>
						<div className={styles.inputGroup}>
							<Label>
								{SALESFORCE_TRANSLATION.ENTER_LINKEDIN_URL[user?.language?.toUpperCase()]}
							</Label>
							<Input
								value={input}
								setValue={setInput}
								theme={InputThemes.WHITE_WITH_GREY_BORDER}
								className={styles.input}
							/>
							<Label>
								{SALESFORCE_TRANSLATION.ENTER_COOKIE[user?.language?.toUpperCase()]}
							</Label>
							<Input
								value={cookie}
								setValue={setCookie}
								theme={InputThemes.WHITE_WITH_GREY_BORDER}
								className={styles.input}
							/>
						</div>
						<ThemedButton
							theme={ThemedButtonThemes.PRIMARY}
							className={styles.btn}
							onClick={handleSubmit}
							loading={extractLeadInfoLoading}
							disabled={user?.Integration_Token?.is_logged_out}
						>
							<div>
								{
									SALESFORCE_TRANSLATION.EXTRACT_INFORMATION[
										user?.language?.toUpperCase()
									]
								}
							</div>
						</ThemedButton>
					</div>
				)}
			</div>
		</PageContainer>
	);
};

export default LinkedInUrl;
