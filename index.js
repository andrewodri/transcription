#!/usr/bin/env node

var commander = require('commander');
var transcription = require('./dist/transcription');
var packageJson = require('./package.json');

commander
  .version(packageJson.version)
  .option('-i, --input [path]', 'input paths')
  .option('-o, --output [path]', 'output paths')
  .option('-f, --format [format]', 'format of the output', /^(html|md|json)$/i)
  .option('-t, --template [path]', 'template path')
  .parse(process.argv);

if(commander.input !== undefined){
  transcription.transformFiles(
    commander.input
    ,commander.output
    ,commander.format
    ,commander.template
  );
}else{
  transcription.transformStdin(
    commander.output
    ,commander.format
    ,commander.template
  );
}
