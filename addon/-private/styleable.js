import Ember from 'ember';
const CSS_SUFFIX = 'CSS';

export default class Styleable{

  constructor(subject){
    this.parent = subject;
    this.declarations = {};

    this.findDeclarations(subject);
  }

  findDeclarations(subject){
    for (let prop in subject) {
      if (prop.match(CSS_SUFFIX)) {
        this.buildDeclaration(prop.replace(CSS_SUFFIX, ''));
      }
    }
  }

  buildDeclaration(declarationName, subject){
    if (!subject) {
      subject = this.parent;
    }
    const styleCSS = subject.get(`${declarationName}${CSS_SUFFIX}`);
    const parsed = this.parseValues(styleCSS);

    this.declarations[declarationName] = {
      parsed,
      refs: null
    };

    this.declarations[declarationName].refs = this.buildReferences(parsed);
    this.setInitialValues(this.declarations[declarationName]);
  }

  parseValues(style){
    const vars = style.match(/{{\s*[\w\.]+\s*}}/g);
    const rest = style.split(/{{\s*[\w\.]+\s*}}/g);

    let totalLength = vars.length + rest.length,
      varsIndex = 0,
      restIndex = 0,
      combined = [];

    while (varsIndex + restIndex < totalLength) {
      if (rest[restIndex] !== undefined) {
        combined.push(rest[restIndex]);
        restIndex++;
      }
      if (vars[varsIndex] !== undefined) {
        combined.push(vars[varsIndex]);
        varsIndex++;
      }
    }

    return combined;
  }

  buildReferences(parts){
    let refs = {};
    parts.forEach( (part, i) => {
      if(i%2 !== 0) {
        refs[part.match(/[\w\.]+/)[0]] = i;
      }
    });
    return refs;
  }

  setInitialValues(declaration){
    for(let ref in declaration.refs){
      declaration.parsed[declaration.refs[ref]] = this.parent.get(ref) || undefined;
    }
  }

  render(declarationName){
    return Ember.String.htmlSafe(this.declarations[declarationName].parsed.join(''));
  }

  renderAll(){
    let declarations = [];
    for(let declaration in this.declarations) {
      declarations.push(this.declarations[declaration].parsed.join(''));
    }
    return Ember.String.htmlSafe(declarations.join(''));
  }

  updateValue(declarationName, valueName, value){
    this.declarations[declarationName].parsed[this.declarations[declarationName].refs[valueName]] = value;
  }

}
