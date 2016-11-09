import Ember from 'ember';

export default Ember.Mixin.create({

  init(){
    this._super(...arguments);
    this._styleable.compileDeclarations(this);
  },

  _styleable: {

    parent: null,
    declarations: {},

    compileDeclarations(subject){
      this.parent = subject;

      for(let prop in subject){
        if(prop.match('CSS$') === 'CSS'){
          const cleanName = prop.replace(/CSS/g,'');
          const parsed = this.parseValues(subject[prop]);

          this.declarations[cleanName] = {
            parsed,
            refs: null
          };

          this.declarations[cleanName].refs = this.buildReferences(parsed);
          this.firstRender(this.declarations[cleanName]);
        }
      }
    },

    parseValues(style){
      const vars = style.match(/{{\s*[\w\.]+\s*}}/g),
            rest = style.split(/{{\s*[\w\.]+\s*}}/g);

      let totalLength = vars.length + rest.length,
          varsIndex = 0,
          restIndex = 0,
          combined = [];

      while(varsIndex + restIndex < totalLength){
        if(rest[restIndex] !== undefined){
          combined.push(rest[restIndex]);
          restIndex++;
        }
        if(vars[varsIndex] !== undefined){
          combined.push(vars[varsIndex]);
          varsIndex++;
        }
      }

      return combined;
    },

    buildReferences(parts){
      const refs = {};
      parts.forEach( (part, i) => {
        if(i % 2 !== 0) {
          refs[part.match(/[\w\.]+/)[0]] = i;
        }
      });
      return refs;
    },

    firstRender(declaration){
      for(let ref in declaration.refs){
        declaration.parsed[declaration.refs[ref]] = this.parent.get(ref) || undefined;
      }
    },

    render(declarationName){
      return this.declarations[declarationName].parsed.join('');
    }

  }

});
