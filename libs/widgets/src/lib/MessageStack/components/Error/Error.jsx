import { useEffect, useRef, useState, useContext } from "react";
import styles from "./Error.module.scss";
import { Errors as ERROR_TRANSLATION } from "@cadence-frontend/languages";

//component
import { Close, Caution2, TriangleDown, Copy, CopyBlank } from "@cadence-frontend/icons";
import { Colors } from "@cadence-frontend/utils";
import { Tooltip } from "@cadence-frontend/components";
import { MessageContext } from "@cadence-frontend/contexts";

const Error = ({ error, remove }) => {
	const timeoutId = useRef();
	const [open, setOpen] = useState(false);
	const { addSuccess } = useContext(MessageContext);

	useEffect(() => {
		timeoutId.current = setTimeout(() => {
			remove();
		}, 10000);
	});

	const handleClose = e => {
		e.preventDefault();
		clearTimeout(timeoutId.current);
		setTimeout(() => remove(), 100);
	};

	return (
		<div
			className={`${styles.errorBox} ${styles.isActive} ${
				error.onClick && styles.isOnClick
			}`}
			onClick={
				error.onClick
					? e => {
							error.onClick();
							handleClose(e);
					  }
					: null
			}
		>
			<div className={styles.iconcontainer}>
				{error.description && error.description !== error.text && (
					<span
						className={styles.copyIcon}
						onClick={() => {
							navigator.clipboard.writeText(JSON.stringify(error));
							addSuccess("Successfully copied to clipboard.");
						}}
					>
						<CopyBlank />
					</span>
				)}
				<span
					className={styles.closeIcon}
					onClick={e => {
						e.stopPropagation();
						handleClose(e);
					}}
				>
					<Close />
				</span>
			</div>

			{/* {error.description && (
				<span className={styles.dropdownArrow} onClick={e => setOpen(prev => !prev)}>
					<TriangleDown style={open ? { rotate: "180deg" } : {}} />
				</span>
			)} */}

			<div className={styles.errorText}>
				<Caution2 color={Colors.white} />
				{error.text}
			</div>

			{error.description && error.description !== error.text && (
				<div className={styles.description}>
					{error?.correlationId && (
						<Tooltip text={"Click to copy"} theme="TOP">
							<div className={styles.errorId}>
								<p
									onClick={() => {
										navigator.clipboard.writeText(error?.correlationId);
										addSuccess("Successfully copied to clipboard.");
									}}
								>
									Error : ${error?.correlationId}
								</p>
							</div>
						</Tooltip>
					)}

					<div className={open ? styles.notTurncate : styles.errrorDesc}>
						<p>{error?.description}</p>
					</div>
				</div>
			)}

			{error.description &&
				error.description !== error.text &&
				!open &&
				error.description?.length > 100 && (
					<div className={styles.showText} onClick={e => setOpen(prev => !prev)}>
						{ERROR_TRANSLATION.SHOW_MORE["ENGLISH"]}
					</div>
				)}

			{error.description && open && (
				<div className={styles.showText} onClick={e => setOpen(prev => !prev)}>
					{ERROR_TRANSLATION.SHOW_LESS["ENGLISH"]}
				</div>
			)}
		</div>
	);
};

export default Error;
