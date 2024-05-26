import styles from "./Queries.module.scss";
import QueriesTree from "./components/QueriesTree/QueriesTree";
import QueriesCondition from "./components/QueriesCondition/QueriesCondition";

const Queries = ({
	originalFilter,
	setFilter,
	fieldMap,
	options,
	body,
	onAddingNode,
	onDeletingNode,
	onChangingCondition,
	onChangingOperation,
}) => {
	return originalFilter?.operation === "condition" ? (
		<QueriesCondition
			originalFilter={originalFilter}
			filterNode={originalFilter}
			setFilter={setFilter}
			body={body}
			options={options}
			onAddingNode={onAddingNode}
			onDeletingNode={onDeletingNode}
			onChangingCondition={onChangingCondition}
			level={0}
		/>
	) : (
		<QueriesTree
			originalFilter={originalFilter}
			setFilter={setFilter}
			filterNode={originalFilter}
			options={options}
			body={body}
			onAddingNode={onAddingNode}
			onDeletingNode={onDeletingNode}
			onChangingCondition={onChangingCondition}
			onChangingOperation={onChangingOperation}
			level={0}
		/>
	);
};

export default Queries;
