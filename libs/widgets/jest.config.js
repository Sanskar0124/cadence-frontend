module.exports = {
	displayName: "widgets",
	preset: "../../jest.preset.js",
	transform: {
		"^.+\\.[tj]sx?$": "babel-jest",
	},
	moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
	coverageDirectory: "../../coverage/libs/widgets",
};
