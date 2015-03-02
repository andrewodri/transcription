import minimist from 'minimist';
import polyfill from 'babel/polyfill';

import Parser from './parser';
import JsonTransformer from './jsontransformer';
import MarkdownTransformer from './markdowntransformer';
import HtmlTransformer from './htmltransformer';

let args = minimist(process.argv.slice(2));

let code = new Parser(args._[0]);

switch(args.f){
  case "json":
    let json = new JsonTransformer(code, args.o);
    break;
  case "markdown":
    let md = new MarkdownTransformer(code, args.o);
    break;
  case "html":
    let html = new HtmlTransformer(code, args.o, args.t);
    break;
}
