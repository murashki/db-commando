// npx tsx --tsconfig ./tsconfig.json ./examples/index.ts

import config from '../dev-config.local.json';
import { enterDirectTerminalManipulation } from '../src/index.ts';
import { exitDirectTerminalManipulation } from '../src/index.ts';
import { dbCommando } from '../src/index.ts';
import { TerminatedByCtrlC } from '../src/index.ts';

enterDirectTerminalManipulation();

try {
  await dbCommando({
    dbConfig: config.db,
    environment: `development`,
    systemFolder: `.db-commando`,
    tablesConfig: {},
  });
}
catch (error) {
  if ( ! (error instanceof TerminatedByCtrlC)) {
    exitDirectTerminalManipulation();
    throw error;
  }
}

exitDirectTerminalManipulation();
process.exit(0);
