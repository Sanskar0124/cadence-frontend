/* eslint-disable no-console */

import { Div } from "@cadence-frontend/components";
import React, { useContext, useEffect, useState } from "react";
import styles from "./CalendlyEvent.module.scss";
import { Select } from "@cadence-frontend/widgets";
import { MessageContext } from "@cadence-frontend/contexts";
import { useUser, useCalendlyAuth } from "@cadence-frontend/data-access";
import { Profile as PROFILE_TRANSLATION } from "@cadence-frontend/languages";

const CalendlyEvent = ({ onlyButton = false }) => {
	const [calendlyUrl, setCalendlyUrlState] = useState({
		calendly_url: "",
	});
	const { user } = useUser({ user: true });
	const { addError, addSuccess } = useContext(MessageContext);
	const {
		calendlyEventType: calendlyEventType,
		calendlyEventTypeLoading: calendlyEventTypeLoading,
		setCalendlyUrl: setCalendlyUrl,
		setCalendlyUrlLoading: setCalendlyUrlLoading,
	} = useCalendlyAuth(true);

	const postCalendlyUrl = e => {
		setCalendlyUrlState(prev => ({ ...prev, calendly_url: e.value }));
		const data = { calendly_url: e.value };
		console.log(data);

		setCalendlyUrl(data, {
			onError: err => {
				addError({
					text: err.response?.data?.msg,
					desc: err?.response?.data?.error ?? "Please contact support",
					cId: err?.response?.data?.correlationId,
				});
			},
			onSuccess: () => {
				addSuccess("Calendly Event Saved Successfully");
			},
		});
	};

	useEffect(() => {
		getCalendlyUrlValueFromUser();
	}, [user]);

	const getCalendlyUrlValueFromUser = () => {
		setCalendlyUrlState(prev => ({ ...prev, calendly_url: user?.calendly_url }));
	};
	return (
		<div className={styles.integration}>
			{!onlyButton && (
				<div className={styles.title}>
					<h2>
						{PROFILE_TRANSLATION.SELECT_CALENDLY_EVENT[user?.language?.toUpperCase()]}
					</h2>
					<p>
						{
							PROFILE_TRANSLATION.CALENDLY_EVENT_DESCRIPTION[
								user?.language?.toUpperCase()
							]
						}
					</p>
				</div>
			)}
			<Div
				loading={calendlyEventTypeLoading || setCalendlyUrlLoading}
				className={styles.eventLoading}
			>
				<Select
					placeholder="Select event name"
					options={calendlyEventType?.collection?.map(op => ({
						label: op.name,
						value: op.scheduling_url,
					}))}
					setValue={val => setCalendlyUrlState(prev => ({ ...prev, calendly_url: val }))}
					value={calendlyUrl.calendly_url}
					isSearchable
					width={"578px"}
					height={"44px"}
					onChange={e => {
						postCalendlyUrl(e);
					}}
				/>
			</Div>
		</div>
	);
};

export default CalendlyEvent;
