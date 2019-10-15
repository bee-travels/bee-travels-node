const fs    = require("fs");
const path  = require("path");
const mocha = require("mocha");
const suite = new mocha();

fs.readdir(path.join(__dirname, "unit"), (err, files) => {
  if (err) throw err;

  files.filter((filename) => 
    (filename.match(/\.js$/))).map((filename) => {
    suite.addFile(path.join(__dirname, "unit", filename));
  });

  suite.run((failures) => {
    process.exit(failures);
  });
});