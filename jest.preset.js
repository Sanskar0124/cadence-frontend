const nxPreset = require("@nrwl/jest/preset");

module.exports = {
	...nxPreset,
	transform: {
		"^.+\\.svg$": "<rootDir>/../../__mocks__/svgTransformer.js",
	},
};
