import fs from 'fs';
import util from 'util';

export default class MarkdownTransformer {
  static transform(files) {
    let markdownFiles = new Map();

    let navigation = MarkdownTransformer.buildNavigation(files);

    for(let [path, file] of files){
      for(let classObject of file.classes){
        markdownFiles.set(
          classObject.name.toLowerCase() + '.md',
          navigation + MarkdownTransformer.buildClass(classObject)
        );
      }
    }

    return markdownFiles;
  }

  static buildNavigation(files) {
    let result = "";

    let classHeading = "* %s\n";
    let methodWrapper = "    * %s(%s)\n";
    let parameter = "[%s](%s)";

    for(let [path, file] of files){
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

    return result;
  }

  static buildClass(classObject) {
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

    return result;
  }
}
