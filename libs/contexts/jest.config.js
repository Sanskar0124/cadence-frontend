module.exports = {
	displayName: "contexts",
	preset: "../../jest.preset.js",
	transform: {
		"^.+\\.[tj]sx?$": "babel-jest",
	},
	moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
	coverageDirectory: "../../coverage/libs/contexts",
};
