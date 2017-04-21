module.exports = {
	ecmaFeatures: {
		globalReturn: true,
		modules: true,
	},
	env: {
		browser: true,
		es6: true,
		node: true
	},
	globals: {
		window: true,
		describe: true,
		before: true,
		it: true,
		expect: true,
		sinon: true,
	},
	parser: 'babel-eslint',
	parserOptions: {
		ecmaVersion: 6
 	},
	root: true,
	extends: ['eslint:recommended', 'auz'],
	rules: {
		'max-len': ['error', 120],
	},
};