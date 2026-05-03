import pg from 'pg';
import url from 'url';
import path from 'path';
import config from '../dev-config.local.json';
import { enterDirectTerminalManipulation } from '../src/index.ts';
import { exitDirectTerminalManipulation } from '../src/index.ts';
import { pgCommando } from '../src/index.ts';
import { TerminatedByCtrlC } from '../src/index.ts';

enterDirectTerminalManipulation();

const db = new pg.Client(config.db);

const dbClient = await db.connect();

try {
  await pgCommando({
    dbClient,
    environment: `development`,
    masterMode: true,
    systemFolder: path.join(import.meta.dirname, '..', '.db-commando'),
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
