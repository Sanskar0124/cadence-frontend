import React, { useState } from "react";
import { Sort as SortIcon } from "@cadence-frontend/icons";
import styles from "./Sort.module.scss";
import { Button, ErrorBoundary } from "@cadence-frontend/components";
import { SORT_TYPES, SORT_ORDERS } from "./constants";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";

const Sort = () => {
	const [open, setOpen] = useState(false);
	const [type, setType] = useState("task_creation_date");
	const [order, setOrder] = useState("");

	const onClear = () => {
		setOrder("");
	};
	const user = useRecoilValue(userInfo);

	return (
		<ErrorBoundary>
			<div className={styles.sortConatiner}>
				<Button
					onClick={() => setOpen(curr => !curr)}
					className={`${styles.sortButton} ${open || order ? styles.active : ""}`}
				>
					<SortIcon />
				</Button>
				<div className={`${styles.sorting} ${open ? styles.active : ""}`}>
					<div className={styles.header}>
						<span>Sort by</span>
						{order && <Button onClick={onClear}>Clear sorting</Button>}
					</div>
					<div className={styles.container}>
						<div>
							{Object.keys(SORT_TYPES).map(name => (
								<Button
									onClick={() => setType(name)}
									className={`${name === type ? styles.active : ""}`}
								>
									{SORT_TYPES[name][user?.language?.toUpperCase()]}
								</Button>
							))}
						</div>
						<div>
							{Object.keys(SORT_ORDERS[type]).map(name => (
								<Button
									onClick={() => setOrder(name)}
									className={`${name === order ? styles.active : ""}`}
								>
									{SORT_ORDERS[type][name][user?.language?.toUpperCase()]}
								</Button>
							))}
						</div>
					</div>
				</div>
			</div>
		</ErrorBoundary>
	);
};

export default Sort;
