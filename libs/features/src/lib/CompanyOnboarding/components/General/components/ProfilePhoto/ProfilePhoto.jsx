import { useState, useRef, useEffect, useContext } from "react";
import { useUser } from "@cadence-frontend/data-access";
import { MessageContext } from "@cadence-frontend/contexts";

import styles from "./ProfilePhoto.module.scss";
import { DragNDropFile } from "@cadence-frontend/widgets";
import { Button, ProfilePicture } from "@cadence-frontend/components";
import { Camera } from "@cadence-frontend/icons";

const ProfilePhoto = ({ image, setImage }) => {
	const imgRef = useRef(null);
	const { addError } = useContext(MessageContext);
	useEffect(() => {
		if (image) imgRef.current.src = URL.createObjectURL(image);
	}, [image]);

	const handleImageChange = e => {
		const [file] = e.target.files;
		if (file) {
			const ext = file.type.split("/")[1];
			if (ext === "jpeg" || ext === "png") {
				// to update the image displayed in the modal
				imgRef.current.src = URL.createObjectURL(file);
				setImage(file);
			} else {
				addError({ text: "Image should be of type jpeg/jpg/png" });
			}
		}
		e.target.value = null;
	};

	return (
		<div className={styles.profilePhoto}>
			<div className={styles.left}>
				<div className={styles.image}>
					<ProfilePicture ref={imgRef} />
					<input type="file" id="profile-picture" hidden onChange={handleImageChange} />
					<label className={styles.fileLabel} htmlFor="profile-picture">
						<Camera size={25} />
					</label>
				</div>
			</div>

			{/* <div className={styles.right}>
					<DragNDropFile
						droppedFile={image}
						setDroppedFile={setImage}
						extnsAllowed={["png", "jpg", "jpeg"]}
						className={styles.dragNDrop}
						showFileDetails={false}
					/>
				</div> */}
		</div>
	);
};

export default ProfilePhoto;
