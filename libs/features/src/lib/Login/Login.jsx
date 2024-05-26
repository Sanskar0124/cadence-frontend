/* eslint-disable react/jsx-no-useless-fragment */
import { userInfo } from "@cadence-frontend/atoms";
import { PageContainer } from "@cadence-frontend/components";
import { CadenceLogo } from "@cadence-frontend/icons";
import { useQuery } from "@cadence-frontend/utils";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import ConnectRingover from "./ConnectRingover/ConnectRingover";
import styles from "./Login.module.scss";

const Login = () => {
	const query = useQuery();
	const isLoggedOut = query.get("logout");
	const [user] = useRecoilState(userInfo);

	useEffect(() => {
		if (!isLoggedOut && user?.ringover_tokens?.accessToken)
			return (window.location.href = "/crm/home");
	}, [user]);

	useEffect(() => {
		//temp remove old user
		localStorage.removeItem("recoil-persist");
	}, []);

	return (
		<PageContainer className={styles.loginContainer}>
			<div className={styles.container2}>
				<div className={styles.logo}>
					<CadenceLogo size="38px" />
					<div>
						<span>Cadence</span>
						<span>by Ringover</span>
					</div>
				</div>
				<div className={styles.content}>
					<h2>Welcome back</h2>
					<p>Connect seamlessly to Cadence with your Ringover account</p>
					<ConnectRingover width="436px" />
				</div>
				<div className={styles.bgLogo1}>
					<CadenceLogo size="180px" />
				</div>
				<div className={styles.bgLogo2}>
					<CadenceLogo size="170px" />
				</div>
				<div className={styles.bgLogo3}>
					<CadenceLogo size="400px" />
				</div>
			</div>
		</PageContainer>
	);
};

export default Login;
