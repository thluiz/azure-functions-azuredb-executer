"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').load();
const index_1 = require("./index");
const contextMock = {};
contextMock.res = {};
contextMock.log = function (str) {
    console.log(str);
};
contextMock.done = function () { console.log('done'); };
index_1.executeSql(contextMock, {
    db_address: process.env.DB_ADDRESS,
    db_name: process.env.DB_NAME,
    db_user: process.env.DB_USER,
    db_password: process.env.DB_PASSWORD
}, "select 1 as success", () => {
    process.exit(0);
});
//# sourceMappingURL=test.js.map