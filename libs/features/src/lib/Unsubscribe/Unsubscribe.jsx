import { useContext, useEffect, useState } from "react";

import { UnsubscribeArt } from "@cadence-frontend/icons";
import { useUnsubscribe } from "@cadence-frontend/data-access";
import { useQuery } from "@cadence-frontend/utils";
import { ThemedButtonThemes } from "@cadence-frontend/themes";

import { PageContainer, Title } from "@cadence-frontend/components";
import { ThemedButton } from "@cadence-frontend/widgets";

import styles from "./Unsubscribe.module.scss";

import { useNavigate } from "react-router-dom";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";
import { MessageContext } from "@cadence-frontend/contexts";

const Unsubscribe = () => {
	const navigate = useNavigate();
	const query = useQuery();
	const id = query.get("id");
	const node = query.get("node");
	const { addError } = useContext(MessageContext);
	const user = useRecoilValue(userInfo);

	const { unsubscribeLoading: loading, unsubscribe } = useUnsubscribe();
	const [success, setSuccess] = useState(null);

	useEffect(() => {
		if (sessionStorage.getItem("unsubscribed")) setSuccess(true);
		else setSuccess(false);
	}, []);

	const onUnsubscribe = () => {
		unsubscribe(
			{ id, node },
			{
				onSuccess: () => {
					setSuccess(true);
					sessionStorage.setItem("unsubscribed", true);
				},
				onError: err =>
					addError({
						text: err.response?.data?.msg,
						desc: err?.response?.data?.error || "Please contact support",
						cId: err?.response?.data?.correlationId,
					}),
			}
		);
	};

	return (
		<PageContainer className={styles.unsubscribePageContainer}>
			{/* <div className="header">
				<span className="logo">
					<Logo size="2rem" />
				</span>{" "}
				ringover
			</div> */}
			<div className={styles.content}>
				<div className={styles.top}>
					{success !== null &&
						(success ? (
							<Title size="1.75rem" className={styles.successMsg}>
								{
									COMMON_TRANSLATION.UNSUBSCRIBED_SUCCESSFULLY[
										user?.language?.toUpperCase() || "ENGLISH"
									]
								}
							</Title>
						) : (
							<>
								<Title size="1.75rem" className={styles.unsubscribe}>
									{
										COMMON_TRANSLATION.UNSUBSCRIBE[
											user?.language?.toUpperCase() || "ENGLISH"
										]
									}
								</Title>
								<p>
									{
										COMMON_TRANSLATION.IF_YOU_UNSUBSCRIBED[
											user?.language?.toUpperCase() || "ENGLISH"
										]
									}
								</p>
								<div className={styles.buttons}>
									<ThemedButton
										width="200px"
										theme={ThemedButtonThemes.PRIMARY}
										onClick={onUnsubscribe}
										loading={loading}
										loadingText="Unsubscribing"
									>
										Unsubscribe
									</ThemedButton>
								</div>
							</>
						))}
				</div>
				<div className={styles.bottom}>
					<UnsubscribeArt />
				</div>
			</div>
		</PageContainer>
	);
};

export default Unsubscribe;
