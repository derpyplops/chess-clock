module.exports = {
	'env': {
		'browser': true,
		'es2021': true
	},
	'extends': [
		'eslint:recommended',
		'plugin:vue/vue3-recommended',
		"@vue/typescript/recommended"
	],
	'parser': 'vue-eslint-parser',
	'parserOptions': {
		'ecmaVersion': 12,
		'parserOptions': {
			'parser': '@typescript-eslint/parser',
			'sourceType': 'module'
		},
	},
	'plugins': [
		'vue',
		'@typescript-eslint'
	]
}
