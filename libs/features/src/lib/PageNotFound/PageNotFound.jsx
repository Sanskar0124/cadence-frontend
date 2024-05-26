import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

//components
import { Container } from "@cadence-frontend/components";
import {
	PageNotFoundImg,
	Tasks,
	Leads,
	Cadences,
	Statistics,
	Templates,
	Settings,
} from "@cadence-frontend/icons";
import { userInfo } from "@cadence-frontend/atoms";

//constants and style
import { TYPE_MAP } from "./constants";
import styles from "./PageNotFound.module.scss";
import { Colors, useQuery } from "@cadence-frontend/utils";
import { useRecoilValue } from "recoil";

const PageNotFound = () => {
	const [page, setPage] = useState("tasks");
	const [pageName, setPageName] = useState("Tasks");
	const location = useLocation();
	const user = useRecoilValue(userInfo);

	const Query = useQuery();
	let type = Query.get("type")?.toUpperCase();

	useEffect(() => {
		if (type === "LEAD" || type === "LEAD_NOT_ASSOCIATED") {
			setPage("leads");
		} else if (type === "CADENCE" || type === "CADENCE_NOT_ASSOCIATED")
			setPage("cadence");
		else {
			let path = location.pathname.split("/");
			setPage(path[1]);
		}
	}, [location]);

	const RenderIcon = () => {
		switch (page) {
			case "tasks":
				setPageName("Tasks");
				return <Tasks style={{ color: Colors.veryLightBlue }} />;
			case "leads":
				setPageName("People");
				return <Leads style={{ color: Colors.veryLightBlue }} />;
			case "cadence":
				setPageName("Cadence");
				return <Cadences style={{ color: Colors.veryLightBlue }} />;
			case "stats":
				setPageName("Statistics");
				return <Statistics style={{ color: Colors.veryLightBlue }} />;
			case "templates":
				setPageName("Templates");
				return <Templates style={{ color: Colors.veryLightBlue }} />;
			case "settings":
				setPageName("Settings");
				return <Settings style={{ color: Colors.veryLightBlue }} />;
			case "profile":
				setPageName("Profile");
				return <Leads style={{ color: Colors.veryLightBlue }} />;
			default:
				setPage("Tasks");
				setPageName("Tasks");
				return <Tasks style={{ color: Colors.veryLightBlue }} />;
		}
	};
	// if (isHidden) return null;
	return (
		<Container className={styles.mainwrapper}>
			<div className={styles.pagenotfound}>
				<div className={styles.image}>
					<PageNotFoundImg />
				</div>
				<div className={styles.content}>
					<div className={styles.content_text}>
						<div className={styles.content_text_404}>404</div>
						<div className={styles.content_text_message}>
							{type !== "LEAD" &&
							type !== "LEAD_NOT_ASSOCIATED" &&
							type !== "CADENCE" &&
							type !== "CADENCE_NOT_ASSOCIATED"
								? "Ooops! The page you were looking for could not be found"
								: TYPE_MAP[type][user?.language?.toUpperCase()]}
						</div>
					</div>
					<Link to={`/${page}`} className={styles.content_link}>
						<div className={styles.content_link_icon}>
							<RenderIcon />
						</div>
						<div className={styles.content_link_text}>Go back to {pageName} page</div>
					</Link>
				</div>
			</div>
		</Container>
	);
};

export default PageNotFound;
