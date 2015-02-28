import jade from 'jade';

export default class Transformer {
  constructor(data) {
    let template = jade.compileFile('./template.jade');

    console.log(template({data: data[0][0]}));
  }
}
