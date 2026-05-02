import { line } from 'proprompt';
import { format } from 'sql-formatter';
import { highlight } from 'sql-highlight';

const FORMAT_PARAMS = {
  dataTypeCase: `upper`,
  expressionWidth: 1000,
  functionCase: `upper`,
  identifierCase: `preserve`,
  keywordCase: `upper`,
  language: `postgresql`,
  linesBetweenQueries: 1,
  logicalOperatorNewline: `before`,
  tabWidth: 2,
} as const;

const HIGHLIGHT_PARAMS = {
  colors: {
    bracket: '\x1b[2m',
    clear: '\x1b[0m',
    comment: '\x1b[2m\x1b[90m',
    function: '\x1b[0m',
    identifier: '\x1b[0m',
    keyword: '\x1b[0m',
    number: '\x1b[33m',
    special: '\x1b[2m',
    string: '\x1b[32m',
  },
};

export async function printDbQuery(query: string) {
  const formattedQuery = highlight(format(query, FORMAT_PARAMS), HIGHLIGHT_PARAMS);
  await line(formattedQuery, { as: `clear`, hardReturnSymbol: true, overflow: `hard-wrap` });
}
