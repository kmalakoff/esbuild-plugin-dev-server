const path = require('path');
const fs = require('fs');

let string = fs.readFileSync(path.join(__dirname, 'clientCode.js'), 'utf8');
string = string.replace(`require('react-dev-utils/launchEditorEndpoint')`, `'${require('react-dev-utils/launchEditorEndpoint')}'`);

module.exports = string;
