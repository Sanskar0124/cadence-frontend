const compareTwoArrayOfObjects = (array_of_objects_first, array_of_objects_second) => {
	return (
		array_of_objects_first?.length === array_of_objects_second?.length &&
		array_of_objects_first.every(ele_1 =>
			array_of_objects_second.some(ele_2 =>
				Object.keys(ele_1).every(key =>
					key !== "attachments"
						? ele_1[key] === ele_2[key]
						: ele_1[key]?.length === ele_2[key]?.length &&
						  ele_2[key]?.every(item =>
								ele_1[key]?.some(i => i?.attachment_id === item?.attachment_id)
						  )
				)
			)
		)
	);
};

export default compareTwoArrayOfObjects;
