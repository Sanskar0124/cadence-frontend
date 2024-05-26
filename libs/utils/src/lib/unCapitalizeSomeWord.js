import capitalizeFirstLetter from "./Capitalize";

const unCapitalizeSomeWord = str => {
	let characters = str.split(" ");
	const capitalizeStrArr = [];
	const matchedWords = ["de", "al", "en", "du", "des"];
	for (let i = 0; i < characters.length; i++) {
		if (matchedWords.includes(characters[i])) {
			capitalizeStrArr.push(characters[i]);
		} else {
			let capitalizeStr = capitalizeFirstLetter(characters[i]);
			capitalizeStrArr.push(capitalizeStr);
		}
	}
	let newStr = capitalizeStrArr.join(" ");
	return newStr;
};
export default unCapitalizeSomeWord;
