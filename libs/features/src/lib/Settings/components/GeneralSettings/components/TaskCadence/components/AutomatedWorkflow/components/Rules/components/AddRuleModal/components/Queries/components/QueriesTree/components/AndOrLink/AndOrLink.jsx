import { CONDITIONANDOR } from "../../../../../../../constants";
import { Tabs, ThemedButton } from "@cadence-frontend/widgets";
import {
	TabNavBtnThemes,
	TabNavThemes,
	ThemedButtonThemes,
} from "@cadence-frontend/themes";
import styles from "./AndOrLink.module.scss";
import { PlusOutline } from "@cadence-frontend/icons";
const AndOrLink = ({
	index,
	filterNode,
	setFilter,
	originalFilter,
	onChangingOperation,
	onAddingNode,
}) => {
	return (
		index !== filterNode?.children?.length - 1 && (
			<div className={styles.nestedTabs}>
				<div className={styles.verticalLineWrapper}>
					<div className={styles.vLine}></div>
				</div>
				<div className={styles.nestedTabsBtns}>
					<div className={styles.tabSideLine}></div>

					<div className={styles.tabsAllBtns}>
						<div className={styles.tabsWrapper}>
							<Tabs
								value={filterNode?.operation}
								setValue={val => {
									setFilter(onChangingOperation(filterNode.id, val, originalFilter));
								}}
								btnBordered={false}
								theme={TabNavThemes.WHITE}
								btnTheme={TabNavBtnThemes.PRIMARY_AND_WHITE}
								tabs={CONDITIONANDOR}
								className={styles.tabsOperator}
								btnClassName={styles.tabButton}
								activeBtnClassName={styles.activeBtnClassName}
								activePillClassName={styles.activePillClassName}
								radio
								name={"operator"}
								width="150px"
							/>
						</div>

						{index === filterNode?.children?.length - 2 && (
							<ThemedButton
								theme={ThemedButtonThemes.GREY}
								onClick={() => setFilter(onAddingNode(filterNode.id, originalFilter))}
							>
								{" "}
								<PlusOutline />
							</ThemedButton>
						)}
					</div>
				</div>
			</div>
		)
	);
};

export default AndOrLink;
