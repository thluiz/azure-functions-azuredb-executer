var Connection = require("tedious").Connection;
var Request = require("tedious").Request;

/**
 * @param db_address Azure SqlDatabase address ('<AzureSQLDBName>.database.windows.net')
 * @param db_user Azure SqlDatabase User
 * @param db_password Azure SqlDatabase Password
 * @param db_name Azure SqlDatabase Name
 */
export interface IAzureDatabaseConnectionProperties {
    db_address: string,
    db_user: string,
    db_password: string,
    db_name: string
}

/**
 * Execute the given sql under context sent by azure with the azure database connection
 * @param context Azure context send by azure functions
 * @param connection Azure database connection parameters
 * @param sql Sql to be executed
 */
export function executeSql(
  context, connection: IAzureDatabaseConnectionProperties, sql: string, callback? : () => void
) {
  const request = new Request(sql, function(err, rowCount) {
    if (err) {
      context.log(err);

      context.res = {
        status: 500,
        body: "Failed to connect to execute statement."
      };
      context.done();
    } else {
        context.log(rowCount + " rows");
        context.done();

        if(callback) {
            callback();
        }
    }
  });

  request.on("row", function(columns) {
    columns.forEach(function(column) {
      context.log(column.value);
    });
  });

  execute(context, connection, request);
}

/**
 * Execute the given Tedious Request under context sent by azure with the azure database connection
 * @param context Azure context send by azure functions
 * @param connection  Azure database connection parameters
 * @param request Tedious Request to Be executed. Do not forget to call a context.done() after execution
 */
export function execute(
    context, connection: IAzureDatabaseConnectionProperties, request: Request
  ) {
    context.log("Starting JavaScript DB Executer");

    getConnection(context, connection, (conn) => {
        conn.execSql(request);
    });
}

function getConnection(context, connection: IAzureDatabaseConnectionProperties, exec : (conn) => void) {
    var config = {
        userName: connection.db_user,
        password: connection.db_password,
        server: connection.db_address,
        options: {
          database: connection.db_name,
          encrypt: true
        }
      };

      var conn = new Connection(config);

      conn.on("connect", function(err) {
        if (err) {
          context.log(err);

          context.res = {
            status: 500,
            body: "Unable to establish a connection."
          };
          context.done();
        } else {

          exec(conn);
        }
      });
}