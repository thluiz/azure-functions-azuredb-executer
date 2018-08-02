require('dotenv').load();

import { executeSql } from './index'

const contextMock = {} as any;
contextMock.res = {};
contextMock.log = function(str) {
    console.log(str);
}
contextMock.done = function() { console.log('done'); }

executeSql(contextMock, {
    db_address: process.env.DB_ADDRESS,
    db_name: process.env.DB_NAME,
    db_user: process.env.DB_USER,
    db_password: process.env.DB_PASSWORD
}, "select 1 as success", () => {
    process.exit(0);
});