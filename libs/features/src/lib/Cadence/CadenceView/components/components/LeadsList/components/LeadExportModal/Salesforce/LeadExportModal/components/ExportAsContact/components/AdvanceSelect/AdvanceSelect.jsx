/* eslint-disable no-console */
import { components } from "react-select";
import { useState, useRef, useEffect } from "react";
import Creatable from "react-select/creatable";
import { themeStyles } from "./ThemeStyles";
import "./Select.scss";
import styles from "./AdvanceSelect.module.scss";
import { Plus, TriangleDown } from "@cadence-frontend/icons";
import { Colors } from "@cadence-frontend/utils";
import { Spinner } from "@cadence-frontend/components";
const themes = {
	rounded: "",
};

const AdvanceSelect = ({
	options,
	setOptions,
	value,
	setValue,
	theme = "rounded",
	width,
	height,
	borderRadius,
	borderColor,
	iconIsRotatable = "true",
	border,
	background,
	placeholder,
	menuOnTop,
	disabled,
	icon,
	isClearable,
	name,
	numberOfOptionsVisible = "5",
	onSearchTextChange,
	loading,
	...rest
}) => {
	const [inputValue, setInputValue] = useState("");
	const { roundedStyles } = themeStyles({
		width,
		height,
		menuOnTop,
		borderRadius,
		borderColor,
		border,
		background,
		iconIsRotatable,
		numberOfOptionsVisible,
		rest,
	});
	themes.rounded = roundedStyles;
	const selectRef = useRef(null);

	const setSelected = selected => {
		if (rest.isMulti && typeof value === "object" && !Array.isArray(value))
			setValue(prev => ({ ...prev, [name]: selected?.map(opt => opt.value) }));
		else if (rest.isMulti) {
			setValue(selected?.map(opt => opt.value));
		} else if (name !== null) {
			setValue(prev => ({ ...prev, [name]: selected?.value }));
		} else {
			setValue(selected?.value);
		}
	};

	let selectedOption = "";
	if (!Array.isArray(options)) {
		options = Object.keys(options ?? {})?.map(op => ({ label: options[op], value: op }));
		options?.forEach(option => {
			const val = name ? value[name] : value;
			if (option.value === val) selectedOption = option;
		});
	} else if (rest.isMulti && typeof value === "object" && !Array.isArray(value)) {
		selectedOption = value[name]?.map(val =>
			options.find(option => option.value === val)
		);
	} else if (rest.isMulti) {
		selectedOption = value?.map(val => options.find(option => option.value === val));
	} else {
		options?.forEach(option => {
			const val = name ? value[name] : value;
			if (option.value === val) selectedOption = option;
		});
		if (name && value[name])
			!options?.some(i => i.value === value[name]) &&
				setValue(prev => ({ ...prev, [name]: "" }));
		else if (!name && value) !options?.some(i => i.value === value) && setValue("");
	}

	const DropdownIndicator = props => {
		return (
			<components.DropdownIndicator {...props}>
				{icon ? icon : <TriangleDown color={Colors.lightBlue} />}
			</components.DropdownIndicator>
		);
	};

	const LoadingIndicator = props => {
		return <Spinner {...props} className={styles.loader} />;
	};

	const handleCreateOption = optionValue => {
		if (optionValue === "") return;
		const newOption = {
			label: optionValue,
			value: { name: optionValue, integration_id: "" },
			search: optionValue.toLowerCase(),
		};
		setOptions(prev => [newOption, ...prev.filter(option => option.value !== null)]);
		setInputValue("");
		setTimeout(() => setSelected(newOption), 0);
		selectRef.current.blur();
	};

	const filterOptions = (candidate, input, selectOptions) => {
		if (!input) {
			return true; // Allow the default value to pass through
		}

		const candidateText = candidate?.data?.search?.toLowerCase();
		const searchText = input?.toLowerCase();
		const isMatch = candidateText?.includes(searchText);

		if (isMatch) {
			return true; // Show the option if it matches the search
		}

		const createOptionLabel = input?.toLowerCase().trim();
		const createOption = selectOptions?.find(
			option =>
				option?.search && option?.search?.toLowerCase().trim() === createOptionLabel
		);

		return !!createOption; // Show the "create" option if it exists
	};

	const customNoOptionsMessage = () => {
		return inputValue?.length ? (
			<div className={styles.createOption} onClick={() => handleCreateOption(inputValue)}>
				<Plus />
				{`Create "${inputValue}"`}
			</div>
		) : (
			<div className={styles.noOptions}>No options</div>
		);
	};

	const handleInputChange = value => {
		setInputValue(value);
		if (onSearchTextChange && typeof onSearchTextChange === "function")
			onSearchTextChange(value);
	};

	useEffect(() => {
		if (options?.length) {
			const optionValue = inputValue ? inputValue : options[0].search;
			const createOption = {
				label: (
					<div
						className={styles.createOption}
						onClick={() => handleCreateOption(optionValue)}
					>
						<Plus />
						{`Create "${optionValue}"`}
					</div>
				),
				value: null,
				search: optionValue.toLowerCase(),
				custom: true,
			};

			//check if 'create option' can be added and add it if possible
			const ignore = options.some(
				option => option.value === null || option.value.integration_id.length === 0
			);
			if (!ignore) setOptions(prev => [createOption, ...prev]);
		}
	}, [options]);

	return (
		<Creatable
			options={options}
			value={selectedOption}
			onChange={setSelected}
			components={{ DropdownIndicator, LoadingIndicator }}
			styles={themes[theme]}
			placeholder={placeholder}
			isClearable={isClearable}
			isDisabled={disabled}
			classNamePrefix="cadence-select"
			filterOption={filterOptions}
			noOptionsMessage={customNoOptionsMessage}
			inputValue={inputValue}
			onInputChange={handleInputChange}
			ref={selectRef}
			isLoading={loading}
			isSearchable
			isCreatable
			{...rest}
		/>
	);
};

AdvanceSelect.defaultProps = {
	theme: "rounded",
	width: "100%",
	height: "40px",
	menuOnTop: false,
	disabled: false,
	name: null,
};

export default AdvanceSelect;
