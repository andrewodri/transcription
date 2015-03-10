import fs from 'fs';
import util from 'util';

export default class MarkdownTransformer {
  constructor(files, outputDir) {
    this.outputDir = outputDir;

    this.buildIndex(files);

    for(let file of files){
      for(let classObject of file.classes){
        this.buildClass(classObject);
      }
    }
  }

  buildIndex(files) {
    let result = "";

    let classHeading = "# %s\n\n";
    let methodWrapper = "* %s(%s)\n";
    let parameter = "[%s](%s)";

    for(let file of files){
      for(let classObject of file.classes){
        result += util.format(classHeading, classObject.name);

        for(let method of classObject.methods){
          let params = "";
          for(let tag of method.comments.tags){
            if(tag.title == "param"){
              params += util.format(parameter, tag.name, '');
            }
          }

          result += util.format(methodWrapper, method.name, params);
        }

        result += '\n';
      }
    }

    fs.writeFileSync(this.outputDir + '/index.md', result);
  }

  buildClass(classObject) {
    let result = "";

    let classHeading = "# %s\n\n";
    let methodHeading = "## %s\n\n";
    let paragraph = "%s\n\n";
    let tableWrapper = "<table>%s</table>\n\n";
    let parameter = "<tr><td>%s</td><td>%s</td><td>%s</td><td>%s</td></tr>";

    result += util.format(classHeading, classObject.name);
    result += util.format(paragraph, classObject.comments.description);

    for(let method of classObject.methods){
      result += util.format(methodHeading, method.name);
      result += util.format(paragraph, method.comments.description);

      let table = "";
      for(let tag of method.comments.tags){
        table += util.format(parameter, tag.title, tag.name, tag.type ? tag.type.name : "", tag.description);
      }

      result += util.format(tableWrapper, table);
    }

    fs.writeFileSync(this.outputDir + '/' + classObject.name + '.md', result);
  }
}
