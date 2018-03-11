#!/usr/bin/env node

require('child_process').exec("gulp production", function (error, stdout, stderr) {
  console.log('Running gulp production: ' + stdout);

  if (stderr) {
    console.log('gulp stderr: ' + stderr);
  }

  if (error !== null) {
    console.log('gulp exec error: ' + error);
  }
});
