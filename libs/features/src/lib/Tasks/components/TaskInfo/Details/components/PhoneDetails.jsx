import React, { useEffect, useRef, useState } from "react";
import styles from "../Details.module.scss";
import { Building, Home, Phone } from "@cadence-frontend/icons";
import { GLOBAL_MODAL_TYPES } from "@cadence-frontend/constants";
import { useOutsideClickHandler } from "@cadence-frontend/utils";

function PhoneDetails({
	phone,
	setActiveModalParams,
	lead,
	fieldMap,
	refetchLead,
	handleCallClick,
}) {
	const [isPhone, setIsPhone] = useState(false);
	const phoneDropDown = useRef();
	useOutsideClickHandler(phoneDropDown, () => setIsPhone(false));

	return (
		<span
			key={phone.lpn_id}
			className={styles.mobile}
			onClick={() => setIsPhone(!isPhone)}
			ref={phoneDropDown}
		>
			{phone?.phone_number ? (
				phone.is_primary ? (
					<Phone size="1.1rem" />
				) : (
					<Home size="1.1rem" />
				)
			) : (
				<Building size="1.1rem" />
			)}
			<a>{phone?.phone_number ? phone?.phone_number : phone}</a>
			{isPhone && (
				<div className={styles.phoneOptions}>
					<div
						onClick={() =>
							setActiveModalParams({
								type: GLOBAL_MODAL_TYPES.MESSAGE,
								typeSpecificProps: {
									lead,
									fieldMap,
									refetchLead,
								},
								modalProps: {
									isModal: true,
									onClose: () =>
										setActiveModalParams(prev => ({
											...prev,
											modalProps: { isModal: false },
										})),
								},
							})
						}
					>
						SMS
					</div>
					<div onClick={() => handleCallClick(phone.formatted_phone_number)}>Call</div>
					<div
						onClick={() =>
							setActiveModalParams({
								type: GLOBAL_MODAL_TYPES.WHATSAPP,
								typeSpecificProps: {
									lead,
									fieldMap,
									refetchLead,
								},
								modalProps: {
									isModal: true,
									onClose: () =>
										setActiveModalParams(prev => ({
											...prev,
											modalProps: { isModal: false },
										})),
								},
							})
						}
					>
						Whatsapp message
					</div>
				</div>
			)}
		</span>
	);
}

export default PhoneDetails;
