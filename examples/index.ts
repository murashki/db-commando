import pg from 'pg';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import config from '../dev-config.local.json';
import { enterDirectTerminalManipulation } from '../src/index.ts';
import { exitDirectTerminalManipulation } from '../src/index.ts';
import { pgCommando } from '../src/index.ts';
import { TerminatedByCtrlC } from '../src/index.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

enterDirectTerminalManipulation();

const db = new pg.Client(config.db);

const dbClient = await db.connect();

try {
  await pgCommando({
    dbClient,
    environment: `development`,
    masterMode: true,
    systemFolder: join(__dirname, '..', '.db-commando'),
  });
}
catch (error) {
  if ( ! (error instanceof TerminatedByCtrlC)) {
    db.end();
    exitDirectTerminalManipulation();
    throw error;
  }
}

db.end();
exitDirectTerminalManipulation();
