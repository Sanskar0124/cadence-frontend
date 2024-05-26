import { useMutation } from "react-query";

import addNoteApi from "./mutations/addNote";

const useNote = () => {
	const { mutate: addNote, isLoading: noteLoading } = useMutation(addNoteApi);

	return { addNote, noteLoading };
};

export default useNote;
