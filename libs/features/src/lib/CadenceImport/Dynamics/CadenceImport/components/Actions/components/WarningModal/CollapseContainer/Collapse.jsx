import { Title } from "@cadence-frontend/components";
import { CheckboxTheme } from "@cadence-frontend/themes";
import { Checkbox, CollapseContainer, Table } from "@cadence-frontend/widgets";
import { useState } from "react";

const Collapse = ({
	iessuesInLead,
	issue,
	styles,
	checkedIssueLead,
	setCheckedIssueLead,
}) => {
	const [isCollapse, setIsCollapse] = useState(null);

	const getColumn = () => {
		const checkLead = lead => {
			if (lead?.length === 1) {
				const isLead =
					checkedIssueLead.filter(each =>
						Boolean(iessuesInLead[issue]?.leads?.some(el => el.Id === each.Id))
					).length !== 0 &&
					checkedIssueLead.filter(each =>
						Boolean(iessuesInLead[issue]?.leads?.some(el => el.Id === each.Id))
					);

				return Boolean(isLead);
			} else {
				return false;
			}
		};

		const TABLE_COLUMNS = [
			<Checkbox
				className={styles.checkBox}
				checked={
					iessuesInLead[issue]?.leads?.length ===
						checkedIssueLead.filter(chl => chl.issue === issue).length ||
					checkLead(iessuesInLead[issue]?.leads)
				}
				onChange={() => {
					iessuesInLead[issue]?.leads?.length ===
					checkedIssueLead?.filter(chl => chl.issue === issue).length
						? setCheckedIssueLead(prev => prev.filter(l => l.issue !== issue))
						: setCheckedIssueLead(prev => [
								...prev,
								...iessuesInLead[issue]?.leads.map(lead => ({ ...lead, issue })),
						  ]);
				}}
				theme={CheckboxTheme.ORANGE}
			/>,
			"Sno.",
			"Name",
			"Company",
			// "Title",
			"Email",
			"Company Phone",
			"Linkedin",
			"Owner",
		];

		return TABLE_COLUMNS;
	};

	const onCollapse = isCollapse => {
		setIsCollapse(isCollapse);
	};

	return (
		<CollapseContainer
			openByDefault={false}
			className={`${styles.collapsibleContainer} ${
				!isCollapse && styles.unactiveCollapse
			}`}
			title={
				<>
					<div className={styles.header}>
						<Title size={".9rem"} className={styles.title}>
							{iessuesInLead[issue]?.leads?.length} leads are missing{" "}
							{iessuesInLead[issue].name}.
						</Title>
					</div>
				</>
			}
			onCollapse={onCollapse}
		>
			<div className={styles.tableWrapper}>
				<Table
					columns={getColumn(iessuesInLead[issue]?.leads)}
					noOfRows={6}
					height="calc(auto - 190px)"
					className={styles.table}
				>
					{iessuesInLead[issue]?.leads?.map((lead, index) => {
						return (
							<tr key={lead.Id} className={styles.tableRow}>
								<td onClick={e => e.stopPropagation()} className={styles.checkBoxTd}>
									<Checkbox
										className={styles.checkBox}
										checked={Boolean(checkedIssueLead?.find(chl => chl.Id === lead.Id))}
										// disabled={isLeadError(lead)}
										onChange={() => {
											checkedIssueLead?.find(chl => chl.Id === lead.Id)
												? setCheckedIssueLead(prevState =>
														prevState.filter(chl => chl.Id !== lead.Id)
												  )
												: setCheckedIssueLead(prevState => [
														...prevState,
														{ ...lead, issue },
												  ]);
										}}
										theme={CheckboxTheme.ORANGE}
									/>
								</td>

								<td>{index + 1}</td>

								<td className={styles.name}>
									<div>
										{lead.first_name} {lead.last_name}
									</div>
								</td>

								<td>{lead.Account?.name}</td>

								{/* <td>{lead.job_position}</td> */}

								<td
									title={lead?.emails?.map((mail, index) => {
										return index === 0 && mail.email_id ? mail.email_id : null;
									})}
								>
									{lead?.emails?.map((mail, index) => index === 0 && mail.email_id)}
								</td>

								{/* <td>
										{lead?.phone_numbers?.map(
											(phone, index) => index === 0 && phone.phone_number
										)}
									</td> */}

								<td>
									{
										lead?.phone_numbers?.filter((phone, index) => {
											if (phone.phone_number !== null) return phone;
										})[0]?.phone_number
									}
								</td>

								<td title={lead?.linkedin_url}>{lead?.linkedin_url}</td>

								<td>{lead.Owner?.name}</td>
							</tr>
						);
					})}
				</Table>
			</div>
		</CollapseContainer>
	);
};

export default Collapse;
