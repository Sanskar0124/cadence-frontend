import { useCallback, useEffect, useRef, useState, forwardRef } from "react";
import { useRecoilValue } from "recoil";

import { Div, Modal } from "@cadence-frontend/components";
import { TabNavThemes, ThemedButtonThemes } from "@cadence-frontend/themes";
import {
	InputRadio,
	SearchBar,
	ThemedButton,
	TabNavSlider,
} from "@cadence-frontend/widgets";

import { useTemplateImport } from "@cadence-frontend/data-access";
import { TEMPLATE_LEVELS, TEMPLATE_LEVELS_OPTIONS } from "@cadence-frontend/constants";

import { Templates as TEMPLATES_TRANSLATION } from "@cadence-frontend/languages";
import { userInfo } from "@cadence-frontend/atoms";

import styles from "./ImportTemplateModal.module.scss";

const TEMPLATE_ID_TYPES = {
	sms: "mt_id",
	email: "et_id",
	linkedin: "lt_id",
	script: "st_id",
	whatsapp: "wt_id",
};

const ImportTemplateModal = ({ modal, setModal, setTemplate }) => {
	const [activeLevel, setActiveLevel] = useState(TEMPLATE_LEVELS.USER);
	const [selected, setSelected] = useState(null);
	const [searchValue, setSearchValue] = useState("");

	const observer = useRef();
	const elementRef = useRef(null);

	const onClose = () => {
		setModal(false);
	};

	const onSave = () => {
		let templateToSave = selected;
		setTemplate(() => templateToSave);
		setSelected(null);
		onClose();
	};
	const user = useRecoilValue(userInfo);

	const {
		templates: templatesData,
		templateLoading,
		fetchNextPage,
		hasNextPage,
		isFetching,
		isFetchingNextPage,
		refetch,
	} = useTemplateImport({
		templateLevel: activeLevel,
		templateType: modal?.type,
		enabled: Boolean(modal),
	});

	useEffect(() => {
		if (modal) refetch();
	}, [modal, activeLevel]);

	const lastTemplateRef = useCallback(
		template => {
			if (isFetchingNextPage || isFetching) return;
			if (observer.current) observer.current.disconnect();

			observer.current = new IntersectionObserver(entries => {
				if (entries[0].isIntersecting && hasNextPage) fetchNextPage();
			});
			if (template) observer.current.observe(template);
		},
		[isFetchingNextPage, isFetching, hasNextPage]
	);

	return (
		<Modal
			isModal={Boolean(modal)}
			onClose={onClose}
			className={styles.modal}
			showCloseButton
		>
			<h2 className={styles.title}>
				{TEMPLATES_TRANSLATION.CHOOSE_TEMPLATE[user?.language?.toUpperCase()]}
			</h2>

			<TabNavSlider
				theme={TabNavThemes.GREY}
				buttons={TEMPLATE_LEVELS_OPTIONS.map(opt => ({
					label: opt.label[user?.language?.toUpperCase()],
					value: opt.value,
				}))}
				value={activeLevel}
				setValue={setActiveLevel}
				className={styles.tabs}
				btnClassName={styles.tabBtns}
				activeBtnClassName={styles.tabBtnActive}
				activePillClassName={styles.activePill}
			/>

			<SearchBar
				width="100%"
				height="40px"
				value={searchValue}
				setValue={setSearchValue}
				className={styles.searchBar}
			/>

			<div className={styles.templateBoxWapper}>
				{templateLoading ? (
					<div className={styles.placeholders}>
						{[...Array(5).keys()].map(() => (
							<Div loading width="100%" />
						))}
					</div>
				) : (
					<div className={styles.templateBox} ref={elementRef}>
						{templatesData?.length === 0 ? (
							<div className={styles.fallback}>
								{
									TEMPLATES_TRANSLATION.NO_TEMPLATES_PRESENT[
										user?.language?.toUpperCase()
									]
								}
							</div>
						) : (
							templatesData
								?.filter(template =>
									template.name.toLowerCase().includes(searchValue.toLowerCase())
								)
								.map((template, index) => {
									const isLastItem = index === templatesData.length - 1;
									return isLastItem ? (
										<>
											<TemplateRow
												template={template}
												selected={selected}
												setSelected={setSelected}
												tab={activeLevel}
												templateType={modal?.type}
												ref={
													templatesData?.filter(template =>
														template.name
															.toLowerCase()
															.includes(searchValue.toLowerCase())
													)?.length > 9
														? lastTemplateRef
														: null
												}
											/>
											{isFetchingNextPage && <Placeholder rows={1} />}
										</>
									) : (
										<TemplateRow
											template={template}
											tab={activeLevel}
											selected={selected}
											setSelected={setSelected}
											templateType={modal?.type}
										/>
									);
								})
						)}
					</div>
				)}
			</div>

			<ThemedButton
				className={styles.saveBtn}
				theme={ThemedButtonThemes.PRIMARY}
				onClick={onSave}
				disabled={!selected}
			>
				{TEMPLATES_TRANSLATION.IMPORT[user?.language?.toUpperCase()]}
			</ThemedButton>
		</Modal>
	);
};

export default ImportTemplateModal;

const Placeholder = ({ rows }) => {
	return (
		<div>
			{[...Array(rows).keys()].map(() => (
				<Div loading className={styles.placeholder} />
			))}
		</div>
	);
};

const TemplateRow = forwardRef(
	({ template, selected, setSelected, templateType, tab }, ref) => {
		const optionChangeHandler = template => {
			setSelected(prev =>
				prev?.[TEMPLATE_ID_TYPES[templateType]] ===
				template?.[TEMPLATE_ID_TYPES[templateType]]
					? null
					: template
			);
		};
		return (
			<div
				ref={ref}
				className={styles.template}
				key={template?.[TEMPLATE_ID_TYPES[templateType]]}
			>
				<InputRadio
					size={24}
					className={styles.radio}
					checked={
						selected?.[TEMPLATE_ID_TYPES[templateType]] ===
						template?.[TEMPLATE_ID_TYPES[templateType]]
					}
					value={template}
					onChange={() => optionChangeHandler(template)}
				/>

				<span className={styles.name}>{template.name}</span>
			</div>
		);
	}
);
