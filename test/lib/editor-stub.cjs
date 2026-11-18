// Stands in for an editor: records its arguments where the test asked.
require('fs').writeFileSync(process.env.EDITOR_STUB_MARKER, JSON.stringify(process.argv.slice(2)));
