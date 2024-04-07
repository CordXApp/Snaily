module.exports = {
    extends: ['@commitlint/config-conventional'],
    rules: {
        'type-enum': [
            2,
            'always',
            [
                'add',
                'feat',
                'fix',
                'docs',
                'chore',
                'style',
                'refactor',
                'revert',
                'update',
                "patch"
            ]
        ]
    }
}