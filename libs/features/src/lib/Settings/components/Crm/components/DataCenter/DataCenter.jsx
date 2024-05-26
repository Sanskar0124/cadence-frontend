import { Div } from "@cadence-frontend/components";
import { Select } from "@cadence-frontend/widgets";
import React, { useState, useEffect, useContext } from "react";
import styles from "./DataCenter.module.scss";
import { DATA_CENTER_OPTIONS } from "../../constants";
import { useSettings, useUser } from "@cadence-frontend/data-access";
import { MessageContext } from "@cadence-frontend/contexts";
import { ROLES } from "@cadence-frontend/constants";

const DataCenter = ({ tokenValidityStatus }) => {
	const [dataCenter, setDataCenter] = useState("");
	const { updateDataCenter, dataCenterLoading } = useSettings({ enabled: false });
	const { addSuccess, addError } = useContext(MessageContext);
	const { user: userDetails } = useUser({ user: true });
	const [loading, setLoading] = useState(false);

	const getUpdateDataCenter = e => {
		setDataCenter(e.value);
		updateDataCenter(
			{ dataCenter: e.value },
			{
				onSuccess: data => {
					addSuccess(data.msg);
				},
				onError: err => {
					addError({
						text: err.response?.data?.msg,
						desc: err?.response?.data?.error ?? "Please contact support",
						cId: err?.response?.data?.correlationId,
					});
				},
			}
		);
	};

	useEffect(() => {
		setLoading(true);
		if (userDetails?.Integration_Token?.data_center) {
			setDataCenter(userDetails?.Integration_Token?.data_center);
			setLoading(false);
		}
	}, [userDetails]);

	const dataCenterVisibility = () => {
		if (
			userDetails?.Integration_Token?.data_center &&
			userDetails?.role === ROLES.SUPER_ADMIN
		) {
			return true;
		} else if (
			!userDetails?.Integration_Token?.data_center &&
			userDetails?.role === ROLES.SUPER_ADMIN
		)
			return false;
		else if (userDetails?.role !== ROLES.SUPER_ADMIN) {
			return true;
		} else {
			return false;
		}
	};

	return (
		<div className={styles.container}>
			<div className={styles.title}>
				<h2>Select data center</h2>
				<p>Select the data center for Zoho Integration.</p>
			</div>

			<div className={styles.settings}>
				<Div loading={dataCenterLoading || loading}>
					<Select
						width="400px"
						options={Object.keys(DATA_CENTER_OPTIONS).map(center => ({
							label: center,
							value: DATA_CENTER_OPTIONS[center],
						}))}
						placeholder={"Select data center"}
						isSearchable
						value={dataCenter}
						setValue={val => setDataCenter(val)}
						disabled={dataCenterVisibility()}
						onChange={e => getUpdateDataCenter(e)}
					/>
				</Div>
			</div>
		</div>
	);
};

export default DataCenter;
