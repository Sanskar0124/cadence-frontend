import { useContext, useEffect, useRef } from "react";
import { MessageContext } from "@cadence-frontend/contexts";

import styles from "./DragNDropFile.module.scss";
import { Close, TrayArrowUp } from "@cadence-frontend/icons";
import { Button, Image } from "@cadence-frontend/components";
import { Select } from "@cadence-frontend/widgets";
import { getFileSizeFromBytes } from "@cadence-frontend/utils";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";
import { INTEGRATION_TYPE } from "@cadence-frontend/constants";

/**
 * This widget provide an interface to drag and drop file.
 *
 * Note that file extensions that are to be allowed should be given in an array (without dots[.] at beginning) to extnsAllowed props. By default extnsAllowed is a blank array signifying all file extensions are allowed.
 *
 * @widget
 * @example
 * const [file, setFile] = useState(null)
 *
 * <DragNDropFile
 *   droppedFile={file}
 *   setDroppedFile={setFile}
 *   extnsAllowed={["png", "jpg", "jpeg"]}
 * />
 **/

const DragNDropFile = ({
	droppedFile,
	setDroppedFile,
	//type setType integrationType and options have been exported for temporart solution to select whether file uploaded is for leads or contacts
	type,
	setType,
	options,
	integrationType,
	showFileDetails,
	extnsAllowed,
	placeholder,
	className,
	maxSize = 2000000,
	disabled,
}) => {
	let inputRef = useRef(null);
	let imageRef = useRef(null);
	const user = useRecoilValue(userInfo);

	const { addError } = useContext(MessageContext);

	const fileChangedHandler = (file, cb) => {
		if (disabled) return;
		if (file) {
			let ext;

			ext = file.name.split(".").pop() ?? file.type.split("/")[1];

			if (extnsAllowed.length && !extnsAllowed.includes(ext)) {
				let errorMessage = "File should be of type ";
				extnsAllowed.forEach((extn, i) => {
					errorMessage += extn;
					if (i < extnsAllowed.length - 1) errorMessage += "/";
				});
				return addError({ text: errorMessage });
			}
			if (file.size > maxSize)
				return addError({
					text: `File size should be less than ${formatBytes(maxSize)}`,
				});
			setDroppedFile(file);
		}
		if (cb && typeof cb === "function") {
			cb();
		}
	};

	const shortenFileName = fileName => {
		let splits = fileName.split(".");
		let name = splits[0];
		let extn = splits[splits.length - 1];
		let maxNameLen = 18 - extn.length;
		if (name.length > maxNameLen) {
			return `${name.substring(0, maxNameLen - 5)}...${name.substring(
				name.length - 2
			)}.${extn}`;
		} else {
			return `${name}.${extn}`;
		}
	};

	function formatBytes(bytes) {
		if (!+bytes) return "0 Bytes";

		const k = 1024;
		const dm = 1;
		const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

		const i = Math.floor(Math.log(bytes) / Math.log(k));

		return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
	}

	useEffect(() => {
		if (droppedFile && showFileDetails) {
			let reader = new FileReader();

			let imgtag = imageRef.current;
			imgtag.title = droppedFile?.name;

			reader.onload = function (event) {
				imgtag.src = event.target.result;
			};

			reader.readAsDataURL(droppedFile);
		}
	}, [droppedFile]);

	return (
		<div className={`${styles.wrapper} ${className ?? ""}`}>
			<div
				className={styles.dragNdrop}
				onDragOver={e => {
					e.preventDefault();
					e.stopPropagation();
				}}
				onDrop={e => {
					e.preventDefault();
					e.stopPropagation();
					fileChangedHandler(e.dataTransfer.files[0]);
				}}
			>
				{(integrationType === INTEGRATION_TYPE.DYNAMICS ||
					integrationType === INTEGRATION_TYPE.BULLHORN) &&
					type && (
						<div className={styles.select}>
							<Select
								placeholder="Select here"
								value={type}
								setValue={setType}
								options={options}
							></Select>
						</div>
					)}

				<TrayArrowUp />
				<p>
					{placeholder ?? COMMON_TRANSLATION.DRAG_AND_DROP[user?.language?.toUpperCase()]}
				</p>
				<p>{COMMON_TRANSLATION.OR[user?.language?.toUpperCase()]}</p>
				<Button
					className={styles.browseFilesBtn}
					onClick={() => {
						inputRef.click();
					}}
					disabled={disabled}
				>
					<input
						type="file"
						style={{ display: "none" }}
						onChange={e => {
							fileChangedHandler(e.target.files[0], () => {
								e.target.value = null;
							});
						}}
						ref={fileInput => {
							inputRef = fileInput;
						}}
					/>
					{COMMON_TRANSLATION.BROWSE_FILES[user?.language?.toUpperCase()]}
				</Button>
			</div>
			{showFileDetails && droppedFile?.name && (
				<div className={styles.fileCard}>
					<Image ref={imageRef} className={styles.image} alt="" />
					<div className={styles.info}>
						<p className={styles.fileName}>{shortenFileName(droppedFile.name)}</p>
						<p className={styles.fileSize}>
							Size: {getFileSizeFromBytes(droppedFile.size)}
						</p>
					</div>
					<Close className={styles.close} onClick={() => setDroppedFile(null)} />
				</div>
			)}
		</div>
	);
};

DragNDropFile.defaultProps = {
	showFileDetails: true,
	extnsAllowed: [],
};

export default DragNDropFile;
