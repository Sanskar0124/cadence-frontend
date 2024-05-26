export default function (task) {
	return task?.Node?.type ?? task?.name;
}
