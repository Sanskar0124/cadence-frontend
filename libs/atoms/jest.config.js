module.exports = {
	displayName: "atoms",
	preset: "../../jest.preset.js",
	transform: {
		"^.+\\.[tj]sx?$": "babel-jest",
	},
	moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
	coverageDirectory: "../../coverage/libs/atoms",
};
