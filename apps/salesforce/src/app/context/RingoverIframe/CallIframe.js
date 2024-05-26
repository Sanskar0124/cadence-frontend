import { useEffect, useMemo, useState, createContext, useCallback } from "react";
import { useLocation } from "react-router-dom";

import RingoverSDK from "./ringover-sdk";

import { Button } from "@cadence-frontend/components";
import { Call, Close } from "@cadence-frontend/icons";
import { Colors, useForceUpdate } from "@cadence-frontend/utils";
import {
	IFRAME_POSITION,
	ROUTES_WITHOUT_CALL_IFRAME,
	PHONE_INTEGRATIONS,
} from "@cadence-frontend/constants";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";

export const CallIframeContext = createContext();

const options = {
	type: "absolute",
	size: "small",
	container: "root",
	position: {
		top: null,
		bottom: "20px",
		left: "70px",
		right: null,
	},
	border: false,
	animation: false,
	trayicon: false,
	zIndex: 999999,
};

const CallIframeProvider = ({ children }) => {
	const location = useLocation();

	const forceUpdate = useForceUpdate();

	const user = useRecoilValue(userInfo);

	const is_call_iframe_fixed = user.is_call_iframe_fixed;

	const [loading, setLoading] = useState(false);
	const [position, setPosition] = useState(IFRAME_POSITION.RIGHT);

	const simpleSDK = useMemo(() => {
		return new RingoverSDK(options);
	}, []);

	useEffect(() => {
		const iframe = document.querySelector("iframe[src='https://app.ringover.com']");
		if (iframe) {
			if (is_call_iframe_fixed) {
				iframe.style.right = null;
				iframe.style.left = "70px";
			} else {
				iframe.style.left = null;
				iframe.style.right = position === IFRAME_POSITION.RIGHT ? "30px" : "47%";
			}
		}
	}, [
		is_call_iframe_fixed,
		document.querySelector("iframe[src='https://app.ringover.com']"),
	]);

	useEffect(() => {
		if (ROUTES_WITHOUT_CALL_IFRAME.includes(window.location.pathname)) {
			simpleSDK.hide();
			simpleSDK.destroy();
		} else {
			simpleSDK.generate();
			simpleSDK.hide();
		}
		forceUpdate();
	}, [simpleSDK, location]);

	useEffect(() => {
		if (simpleSDK && !is_call_iframe_fixed) {
			forceUpdate();
			const iframe = document.querySelector("iframe[src='https://app.ringover.com']");
			if (iframe) {
				iframe.style.right = position === IFRAME_POSITION.RIGHT ? "30px" : "47%";
			}
		}
	}, [position]);

	const isCallAndSmsDisabled = useCallback(
		() => user?.phone_system === PHONE_INTEGRATIONS.NONE,
		[user]
	);

	return (
		<CallIframeContext.Provider
			value={{ simpleSDK, forceUpdate, loading, setLoading, setPosition }}
		>
			{!ROUTES_WITHOUT_CALL_IFRAME.includes(window.location.pathname) &&
				user.ringover_tokens?.id_token && (
					<div className={"ringoverCallIframe"}>
						<Button
							onClick={() => {
								simpleSDK.toggle();
								forceUpdate();
							}}
							className={`callButton ${
								isCallAndSmsDisabled() ? "callButtonDisabled" : ""
							}`}
						>
							<Call size="1.5rem" color={Colors.white} />
						</Button>
						{simpleSDK.isDisplay() && (
							<Button
								btnwidth="40px"
								className={`closeBtn ${
									is_call_iframe_fixed
										? "closeBtnLeft"
										: position === IFRAME_POSITION.RIGHT
										? "closeBtnRight"
										: "closeBtnCenter"
								}`}
								// style={closeBtnStyles}
								onClick={() => {
									simpleSDK.hide();
									forceUpdate();
								}}
							>
								<Close />
							</Button>
						)}
					</div>
				)}
			{children}
		</CallIframeContext.Provider>
	);
};

export default CallIframeProvider;
