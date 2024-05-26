import { Container, PageContainer, Title } from "@cadence-frontend/components";
import styles from "./Home.module.scss";
import ReconnectIntegrations from "./components/ReconnectIntegrations/ReconnectIntegrations";
import { useState } from "react";
import ActiveTag from "./components/ActiveTag/ActiveTag";
import TaskCompletion from "./components/TaskCompletion/TaskCompletion";
import ActiveCadences from "./components/ActiveCadences/ActiveCadences";
import Feeds from "./components/Feeds/Feeds";
import Calendar from "./components/Calendar/Calendar";
import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue } from "recoil";
import { Home as HOME_TRANSLATION } from "@cadence-frontend/languages";

const Home = () => {
	const [activeTag, setActiveTag] = useState("all");
	const user = useRecoilValue(userInfo);

	return (
		<Container className={styles.homeContainer}>
			<div className={styles.header}>
				<div className={styles.left}>
					<Title size="2rem">
						{HOME_TRANSLATION.YOUR_PROGRESS[user?.language.toUpperCase()]}
					</Title>
				</div>
				<div className={styles.right}>
					<ReconnectIntegrations />
				</div>
			</div>
			<div className={styles.body}>
				<div className={styles.left}>
					<div className={styles.container}>
						<ActiveTag activeTag={activeTag} setActiveTag={setActiveTag} />
						<TaskCompletion activeTag={activeTag} />
						<ActiveCadences activeTag={activeTag} />
					</div>
				</div>
				<div className={styles.right}>
					<div className={styles.container}>
						<Calendar />
					</div>
					<div className={styles.container}>
						<Feeds />
					</div>
				</div>
			</div>
		</Container>
	);
};
export default Home;
