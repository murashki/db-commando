import { plainObjectTable } from 'proprompt';
import type { DbCommandoContext } from '../../@types/DbCommandoContext.ts';

export async function handleServerInfoModule(context: DbCommandoContext): Promise<void> {
  const result = await context.dbConnection.query<{
    activeConnections: string;
    database: string;
    dbSize: string;
    maxConnections: string;
    serverHost: string;
    serverPort: string;
    serverStartTime: string;
    tableCount: string;
    user: string;
    version: string;
  }>(`
    SELECT
      current_database() AS "database",
      current_user AS "user",
      current_setting('server_version') AS "version",
      host(inet_server_addr()) AS "serverHost",
      inet_server_port()::text AS "serverPort",
      pg_postmaster_start_time()::text AS "serverStartTime",
      current_setting('max_connections') AS "maxConnections",
      (SELECT count(*)::text FROM pg_stat_activity WHERE datname = current_database()) AS "activeConnections",
      pg_size_pretty(pg_database_size(current_database())) AS "dbSize",
      (SELECT count(*)::text FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE') AS "tableCount"
  `);

  const row = result.rows[0];

  await plainObjectTable([
    { Metric: `Version`, Value: row.version },
    { Metric: `Database`, Value: row.database },
    { Metric: `User`, Value: row.user },
    { Metric: `Server host`, Value: row.serverHost },
    { Metric: `Server port`, Value: row.serverPort },
    { Metric: `Server started at`, Value: row.serverStartTime },
    { Metric: `Max connections`, Value: row.maxConnections },
    { Metric: `Active connections`, Value: row.activeConnections },
    { Metric: `Database size`, Value: row.dbSize },
    { Metric: `Tables`, Value: row.tableCount },
  ]);
}