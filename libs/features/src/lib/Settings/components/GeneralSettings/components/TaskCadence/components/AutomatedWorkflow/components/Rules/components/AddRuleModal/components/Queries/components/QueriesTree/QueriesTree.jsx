import QueriesCondition from "../QueriesCondition/QueriesCondition";
import AndOrLink from "./components/AndOrLink/AndOrLink";
import styles from "./QueriesTree.module.scss";
const QueriesTree = ({
	originalFilter,
	setFilter,
	filterNode,
	body,
	onAddingNode,
	fieldMap,
	options,
	onDeletingNode,
	onChangingCondition,
	onChangingOperation,
	level,
}) => {
	return (
		<div className={`${styles.oNode} ${level === 0 && styles.bor}`}>
			<div className={`${styles.box} ${level === 0 && styles.dis}`}></div>
			{filterNode?.children?.map((item, index) => {
				return (
					<>
						{item?.operation === "condition" ? (
							<QueriesCondition
								originalFilter={originalFilter}
								setFilter={setFilter}
								parentFilter={filterNode}
								filterNode={item}
								body={body}
								options={options}
								onAddingNode={onAddingNode}
								onDeletingNode={onDeletingNode}
								onChangingCondition={onChangingCondition}
								level={level + 1}
							/>
						) : (
							<QueriesTree
								originalFilter={originalFilter}
								setFilter={setFilter}
								filterNode={item}
								options={options}
								body={body}
								onAddingNode={onAddingNode}
								onDeletingNode={onDeletingNode}
								onChangingCondition={onChangingCondition}
								onChangingOperation={onChangingOperation}
								level={level + 1}
							/>
						)}
						<AndOrLink
							index={index}
							filterNode={filterNode}
							setFilter={setFilter}
							originalFilter={originalFilter}
							onChangingOperation={onChangingOperation}
							onAddingNode={onAddingNode}
						/>
					</>
				);
			})}
		</div>
	);
};

export default QueriesTree;
