import { Caution2 } from "@cadence-frontend/icons";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { Colors } from "@cadence-frontend/utils";
import { ThemedButton } from "@cadence-frontend/widgets";
import React from "react";
import styles from "./ErrorBoundary.module.scss";
import { AuthorizedApi } from "libs/data-access/src/lib/api";

class ErrorBoundary extends React.Component {
	constructor(props) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(error) {
		// Update state so the next render will show the fallback UI.
		return { hasError: true };
	}

	componentDidCatch(error, errorInfo) {
		// You can also log the error to an error reporting service
		if (window.location.hostname !== "cadence.ringover.com") return;
		AuthorizedApi.post("/v2/bug-report/frontend-crash", {
			err: {
				error: error.toString(),
				errorInfo,
			},
			pageURL: window.location.href,
			user: {
				user_id: JSON.parse(localStorage.getItem("userInfo"))?.userInfo?.user_id,
				role: JSON.parse(localStorage.getItem("userInfo"))?.userInfo?.role,
				name: `${JSON.parse(localStorage.getItem("userInfo"))?.userInfo?.first_name} ${
					JSON.parse(localStorage.getItem("userInfo"))?.userInfo?.last_name
				}}`,
				email: JSON.parse(localStorage.getItem("userInfo"))?.userInfo?.email,
				integration_type: JSON.parse(localStorage.getItem("userInfo"))?.userInfo
					?.integration_type,
			},
		})
			.then(res => res.data.data)
			.catch(err => console.log(err));
	}

	render() {
		if (this.state.hasError || this.props.error) {
			// You can render any custom fallback UI
			return (
				<div className={styles.errorBoundary}>
					<Caution2 size="2rem" color={Colors.red} />
					<span>Sorry, Something went wrong</span>
					<p>Please refresh the page</p>
					<ThemedButton
						theme={ThemedButtonThemes.GREY}
						width="fit-content"
						height="40px"
						onClick={() => window.location.reload()}
					>
						Refresh
					</ThemedButton>
				</div>
			);
		}

		return this.props.children || null;
	}
}

export default ErrorBoundary;
