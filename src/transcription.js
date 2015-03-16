import polyfill from 'babel/polyfill';

import FileManager from './filemanager';
import JavascriptParser from './javascriptparser';
import JsonTransformer from './jsontransformer';
import MarkdownTransformer from './markdowntransformer';
import HtmlTransformer from './htmltransformer';

export default class Transcription {
  static transformFiles(input, output, format = 'html', template = './jade') {
    let files = FileManager.getFiles(input);
    let transformedFiles = new Map();

    switch(format){
      case "json":
        transformedFiles = JsonTransformer.transform(files);
        break;
      case "md":
        transformedFiles = MarkdownTransformer.transform(files);
        break;
      case "html":
        transformedFiles = HtmlTransformer.transform(files, template);
        break;
    }

    if(output !== undefined){
      Transcription.writeFiles(transformedFiles, output);
    }else{
      Transcription.writeStdout(transformedFiles);
    }
  }

  static transformStdin(output, format = 'html', template = './jade') {
    let data = "";
    let stdin = new Map();

    process.stdin.on('readable', () => { data += process.stdin.read() });

    process.stdin.on('end', function() {
      let transformedFiles = new Map();
      stdin.set('stdin', new JavascriptParser(data));

      switch(format){
        case "json":
          transformedFiles = JsonTransformer.transform(stdin);
          break;
        case "md":
          transformedFiles = MarkdownTransformer.transform(stdin);
          break;
        case "html":
          transformedFiles = HtmlTransformer.transform(stdin, template);
          break;
      }

      if(output !== undefined){
        Transcription.writeFiles(transformedFiles, output);
      }else{
        Transcription.writeStdout(transformedFiles);
      }
    });
  }

  static writeFiles(transformedFiles, output){
    FileManager.writeFiles(transformedFiles, output);
  }

  static writeStdout(transformedFiles){
    for(let [id, data] of transformedFiles){
      process.stdout.write(data);
      break;
    }
  }
}
