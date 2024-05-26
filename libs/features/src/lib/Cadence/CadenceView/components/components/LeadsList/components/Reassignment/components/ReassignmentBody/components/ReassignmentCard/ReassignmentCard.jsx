import { useState, useContext } from "react";
import { useRecoilValue } from "recoil";

import { Image } from "@cadence-frontend/components";
import { Input, Select, ThemedButton, Toggle } from "@cadence-frontend/widgets";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import { MessageContext } from "@cadence-frontend/contexts";
import { MinusOutline, PlusOutline } from "@cadence-frontend/icons";
import { userInfo } from "@cadence-frontend/atoms";

import LeadTag from "../components/LeadTag/LeadTag";
import RightArrow from "../components/RightArrow/RightArrow";
import ExtendedRightArrow from "../components/ExtendedRightArrow/ExtendedRightArrow";
import PeopleModal from "../components/PeopleModal/PeopleModal";

import styles from "./ReassignmentCard.module.scss";

const ReassignmentCard = ({
	reassignmentOption,
	ownerid,
	previousOwners,
	groupedLeads,
	setGroupedLeads,
	reassignedTo,
	setReassignedTo,
	options,
}) => {
	//Data from recoil
	const user = useRecoilValue(userInfo);

	//Context
	const { addError } = useContext(MessageContext);

	//State
	const [showPeopleModal, setShowPeopleModal] = useState(false);

	//Constant variable
	const leadCount = groupedLeads?.[reassignmentOption]?.[ownerid]?.length;

	/*Here we take totalLeadsOfOwner and total number of new owners as input 
	and divide it equally among all new owners */
	const handleAutoDistribution = (totalLeadsOfOwner, totalReassignedOwners) => {
		const minmLeads = Math.floor(totalLeadsOfOwner / totalReassignedOwners);
		let distributionNumber = Array(totalReassignedOwners).fill(minmLeads);
		const leftLeads = totalLeadsOfOwner - totalReassignedOwners * minmLeads;
		Array(leftLeads)
			?.fill(0)
			?.forEach((_, i) => (distributionNumber[i] += 1));
		return distributionNumber;
	};

	/*Here we handle options for each new owner, we can handle options in 3 cases, when we alter the selected 
	option, when we add new owner or when we remove a new owner. */
	const handleOptions = ({ index, val, type }) => {
		let selectedOptions = [];
		switch (type) {
			case "alter":
				reassignedTo?.[reassignmentOption]?.[ownerid]?.reassignedOwners?.forEach(
					(reOwner, i) => {
						i === index
							? selectedOptions?.push(val)
							: selectedOptions.push(reOwner?.user_id);
					}
				);
				break;
			case "add":
				reassignedTo?.[reassignmentOption]?.[ownerid]?.reassignedOwners?.forEach(
					reOwner => {
						selectedOptions.push(reOwner?.user_id);
					}
				);
				selectedOptions.push("");
				break;
			case "delete":
				reassignedTo?.[reassignmentOption]?.[ownerid]?.reassignedOwners?.forEach(
					(reOwner, i) => {
						i !== index && selectedOptions.push(reOwner?.user_id);
					}
				);
				break;
		}
		const remainingOptions = selectedOptions?.map(sOpt =>
			options?.filter(
				opt =>
					(opt?.value === sOpt || !selectedOptions?.includes(opt?.value)) &&
					opt?.value !== ownerid
			)
		);
		return remainingOptions;
	};

	/* Handle deletion of new owner and handle autodistribution and options accordingly.*/
	const handleDeletion = index => {
		setReassignedTo(prev => ({
			...prev,
			[reassignmentOption]: {
				...prev[reassignmentOption],
				[ownerid]: {
					...prev[reassignmentOption][ownerid],
					reassignedOwners: prev?.[reassignmentOption]?.[ownerid]?.autoDistribution
						? (() => {
								const distributionNumber = handleAutoDistribution(
									leadCount,
									prev?.[reassignmentOption]?.[ownerid]?.reassignedOwners?.length - 1
								);
								return [
									...prev[reassignmentOption][ownerid]?.reassignedOwners
										.filter((_, i) => i !== index)
										.map((newOwner, i) => ({
											...newOwner,
											count: distributionNumber[i],
										})),
								];
						  })()
						: [
								...prev[reassignmentOption][ownerid]?.reassignedOwners.filter(
									(_, i) => i !== index
								),
						  ],
					options: handleOptions({ index, type: "delete" }),
				},
			},
		}));
	};

	/*On adding new owner, automatic distribution as well options are handled  */
	const handleNewOwner = () => {
		const currentNewOwners =
			reassignedTo?.[reassignmentOption]?.[ownerid]?.reassignedOwners?.length;
		const totalUsersAvailableForReassignment = options.length - 1;
		if (currentNewOwners >= totalUsersAvailableForReassignment) {
			return addError({ text: "Unable to add a new owner as no owners are left." });
		} else if (currentNewOwners >= leadCount) {
			return addError({
				text: `Cannot add new owner as each new owner should have atleast one reassigned ${reassignmentOption}.`,
			});
		}
		setReassignedTo(prev => ({
			...prev,
			[reassignmentOption]: {
				...prev[reassignmentOption],
				[ownerid]: {
					...prev[reassignmentOption][ownerid],
					reassignedOwners: prev?.[reassignmentOption]?.[ownerid]?.autoDistribution
						? (() => {
								const distributionNumber = handleAutoDistribution(
									leadCount,
									currentNewOwners + 1
								);
								return [
									...prev[reassignmentOption][ownerid]?.reassignedOwners.map(
										(newOwner, i) => ({
											...newOwner,
											count: distributionNumber[i],
										})
									),
									{
										user_id: "",
										count: distributionNumber[distributionNumber.length - 1],
									},
								];
						  })()
						: [
								...prev[reassignmentOption][ownerid]?.reassignedOwners,
								{ user_id: "", count: 0 },
						  ],
					options: handleOptions({ type: "add" }),
				},
			},
		}));
	};
	return (
		<>
			<div className={styles.reassignmentCard}>
				<div className={styles.leadsBox}>
					<div className={styles.leads}>
						{groupedLeads?.[reassignmentOption]?.[ownerid]?.map(
							(lead, index) => index < 10 && <LeadTag lead={lead} />
						)}
						{leadCount - 10 > 0 && (
							<div className={styles.otherLeads} onClick={() => setShowPeopleModal(true)}>
								{`+${leadCount - 10} other${leadCount - 10 > 1 ? "s" : ""}`}
							</div>
						)}
					</div>
				</div>

				<div className={styles.ownerBox}>
					<div className={styles.owner}>
						<Image
							src={
								previousOwners?.[reassignmentOption]?.[
									ownerid
								]?.profile_picture?.includes("undefined")
									? "https://cdn.ringover.com/img/users/default.jpg"
									: previousOwners?.[reassignmentOption]?.[ownerid]?.profile_picture
							}
							className={styles.image}
						/>
						<div className={styles.ownerDetails}>
							<div
								className={styles.name}
							>{`${previousOwners?.[reassignmentOption]?.[ownerid]?.first_name} ${previousOwners?.[reassignmentOption]?.[ownerid]?.last_name}`}</div>
							<div className={styles.noOfLeads}>
								{leadCount} {`${reassignmentOption}${leadCount > 1 ? "s" : ""}`}
							</div>
						</div>
					</div>
				</div>
				<div className={styles.newOwnerSelection}>
					<div className={styles.newOwnerList}>
						{reassignedTo?.[reassignmentOption]?.[ownerid]?.reassignedOwners?.map(
							(newOwner, index) => (
								<div className={styles.newOwner}>
									{index === 0 ? (
										<div className={styles.arrow}>
											<RightArrow />
										</div>
									) : (
										<div className={styles.extArrow}>
											<ExtendedRightArrow />
										</div>
									)}
									<div className={styles.ownerSelection}>
										{reassignedTo[reassignmentOption][ownerid].reassignedOwners.length >
											1 && (
											<MinusOutline
												className={styles.close}
												onClick={() => {
													handleDeletion(index);
												}}
											/>
										)}
										<Select
											options={
												reassignedTo?.[reassignmentOption]?.[ownerid]?.options?.[index]
											}
											value={newOwner?.user_id}
											setValue={val => {
												setReassignedTo(prev => ({
													...prev,
													[reassignmentOption]: {
														...prev[reassignmentOption],
														[ownerid]: {
															...prev[reassignmentOption][ownerid],
															reassignedOwners: prev[reassignmentOption][
																ownerid
															]?.reassignedOwners.map((newOwner, i) =>
																i === index ? { ...newOwner, user_id: val } : newOwner
															),
															options: handleOptions({ index, val, type: "alter" }),
														},
													},
												}));
											}}
											placeholder={
												COMMON_TRANSLATION.SELECT_HERE[user?.language?.toUpperCase()]
											}
											width={"241px"}
											borderColor={"#DADCE0"}
											borderRadius={15}
											isSearchable
											numberOfOptionsVisible="7"
										/>
										<Input
											type="number"
											width={"70px"}
											value={newOwner?.count}
											setValue={val => {
												setReassignedTo(prev => ({
													...prev,
													[reassignmentOption]: {
														...prev[reassignmentOption],
														[ownerid]: {
															...prev[reassignmentOption][ownerid],
															reassignedOwners: prev[reassignmentOption][
																ownerid
															]?.reassignedOwners.map((newOwner, i) =>
																i === index ? { ...newOwner, count: val } : newOwner
															),
														},
													},
												}));
											}}
											disabled={
												reassignedTo?.[reassignmentOption]?.[ownerid]?.autoDistribution
											}
											className={styles.count}
										/>
									</div>
								</div>
							)
						)}
					</div>
					<div className={styles.controls}>
						<ThemedButton
							width={"60px"}
							theme={ThemedButtonThemes.GREY}
							onClick={() => {
								handleNewOwner();
							}}
						>
							{" "}
							<PlusOutline />
						</ThemedButton>
						<div className={styles.toggleBox}>
							<div className={styles.autoDistribution}>Automatic Distribution</div>
							<div className={styles.toggle}>
								<Toggle
									checked={
										reassignedTo?.[reassignmentOption]?.[ownerid]?.autoDistribution
									}
									onChange={() =>
										setReassignedTo(prev => {
											const distributionNumber = handleAutoDistribution(
												groupedLeads?.[reassignmentOption]?.[ownerid]?.length,
												prev?.[reassignmentOption]?.[ownerid]?.reassignedOwners?.length
											);
											return {
												...prev,
												[reassignmentOption]: {
													...prev[reassignmentOption],
													[ownerid]: {
														...prev[reassignmentOption][ownerid],
														...(!prev[reassignmentOption][ownerid].autoDistribution && {
															reassignedOwners: prev[reassignmentOption][
																ownerid
															]?.reassignedOwners.map((newOwner, i) => ({
																...newOwner,
																count: distributionNumber[i],
															})),
														}),
														autoDistribution:
															!prev[reassignmentOption][ownerid].autoDistribution,
													},
												},
											};
										})
									}
									theme="PURPLE"
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
			<PeopleModal
				modal={showPeopleModal}
				setModal={setShowPeopleModal}
				groupedLeads={groupedLeads}
				setGroupedLeads={setGroupedLeads}
				reassignmentOption={reassignmentOption}
				reassignedTo={reassignedTo}
				setReassignedTo={setReassignedTo}
				handleAutoDistribution={handleAutoDistribution}
				ownerid={ownerid}
				previousOwners={previousOwners}
			/>
		</>
	);
};

export default ReassignmentCard;
