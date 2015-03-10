import minimist from 'minimist';
import polyfill from 'babel/polyfill';

import FileManager from './filemanager';
import JsonTransformer from './jsontransformer';
import MarkdownTransformer from './markdowntransformer';
import HtmlTransformer from './htmltransformer';

let args = minimist(process.argv.slice(2));

let fileManager = new FileManager(args._[0]);

switch(args.f){
  case "json":
    //let json = new JsonTransformer(code, args.o);
    break;
  case "markdown":
    //let md = new MarkdownTransformer(code, args.o);
    break;
  case "html":
    let html = new HtmlTransformer(fileManager.files, args.o, args.t);
    break;
}
