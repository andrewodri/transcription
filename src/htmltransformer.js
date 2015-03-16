import fs from 'fs';
import jade from 'jade';

export default class HtmlTransformer {
  static transform(files, template) {
    let htmlFiles = new Map();

    let navTemplate = jade.compileFile(template + '/index.jade');
    let classTemplate = jade.compileFile(template + '/class.jade');

    let navigation = navTemplate({files: Array.from(files.values())});

    for(let [path, file] of files){
      for(let classObject of file.classes){
        htmlFiles.set(
          classObject.name.toLowerCase() + '.html',
          classTemplate({data: classObject, navigation})
        );
      }
    }

    return htmlFiles;
  }
}
