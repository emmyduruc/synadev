/** ESLint rules for client components and screens. */
export const componentStandardsRules = {
  'no-restricted-syntax': [
    'error',
    {
      selector: 'ClassDeclaration',
      message:
        'Classes are not allowed. Use functions, hooks, and modules instead.',
    },
    {
      selector:
        'Literal[value=/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/]',
      message:
        'Use semanticColors or colors from @/utils/colors instead of hardcoded hex strings.',
    },
    {
      selector: 'Literal[value=/^rgba?\\(/]',
      message:
        'Use semanticColors or colors from @/utils/colors instead of hardcoded rgb/rgba strings.',
    },
    {
      selector:
        'BinaryExpression[operator=/^(===|!==|==|!=)$/] > Literal[value.type="string"]',
      message:
        'Use named constants instead of string literals in comparisons (see @/lib/ui).',
    },
    {
      selector: 'ConditionalExpression > Literal[value.type="string"]',
      message:
        'Use named constants instead of string literals in ternary expressions.',
    },
    {
      selector:
        'CallExpression[callee.property.name="includes"] > Literal[value.type="string"]',
      message:
        'Use named constants instead of string literals in .includes() checks.',
    },
  ],
};
