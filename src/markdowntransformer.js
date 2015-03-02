import fs from 'fs';
import util from 'util';

export default class MarkdownTransformer {
  constructor(data, mdFile) {
    let md = this.markdown(data[0][0]);

    fs.writeFileSync(mdFile, md);

    //console.log(template({data: data[0][0]}));
  }

  markdown(data) {
    let result = "";

    let classHeading = "# %s\n\n";
    let methodHeading = "## %s\n\n";
    let paragraph = "%s\n\n";
    let tableWrapper = "<table>%s</table>\n\n";
    let parameter = "<tr><td>%s</td><td>%s</td><td>%s</td><td>%s</td></tr>";

    result += util.format(classHeading, data.name);
    result += util.format(paragraph, data.comments.description);

    for(let method of data.methods){
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
