import { DeleteModal } from "@cadence-frontend/components";
import React from "react";

function RemoveHotLead({ modal, ...rest }) {
	const { onDelete } = modal;

	return <DeleteModal {...rest} modal item={"Hot Lead Status"} onDelete={onDelete} />;
}

export default RemoveHotLead;
