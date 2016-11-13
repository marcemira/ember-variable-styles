import Ember from 'ember';

export default Ember.Mixin.create({

  init(){
    this._super(...arguments);
    this._styleable.init(this);
  },

  _styleable: {

    parent: null,
    declarations: {},

    init(subject){
      this.parent = subject;
      this.findDeclarations(subject);
    },

    findDeclarations(subject){
      for(let prop in subject){
        if(prop.match("CSS$") === 'CSS'){
          this.buildDeclaration(prop.replace(/CSS/g,''));
        }
      }
    },

    buildDeclaration(declarationName){
      const styleCSS = this.parent.get(`${declarationName}CSS`);
      const parsed = this.parseValues(styleCSS);

      this.declarations[declarationName] = {
        parsed,
        refs: null
      };

      this.declarations[declarationName].refs = this.buildReferences(parsed);
      this.firstRender(this.declarations[declarationName]);
    },

    parseValues(style){
      const vars = style.match(/{{\s*[\w\.]+\s*}}/g);
      const rest = style.split(/{{\s*[\w\.]+\s*}}/g);

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
      let refs = {};
      parts.forEach( (part, i) => {
        if(i%2 !== 0) {
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
      return Ember.String.htmlSafe(this.declarations[declarationName].parsed.join(''));
    },

    updateValue(declarationName, valueName, value){
      const declaration = this.declarations[declarationName];
      declaration.parsed[declaration.refs[valueName]] = value;
    }

  },

  rebuildStyle(declarationName){
    this._styleable.buildDeclaration(declarationName);
  },

  renderStyle(declarationName){
    return this._styleable.render(declarationName);
  },

  renderStylePersist(declarationName){
    let rendered = this._styleable.render(declarationName);
    this.set('style', rendered);
  },

  updateStyle(declarationName, valueName, value){
    this._styleable.updateValue(declarationName, valueName, value);
  },

  updateStylePersist(declarationName, valueName, value){
    this._styleable.updateValue(declarationName, valueName, value);
    this.set(valueName, value);
  },

  updateStyleRender(declarationName, valueName, value){
    this._styleable.updateValue(declarationName, valueName, value);
    this._styleable.render(declarationName);
  },

  updateStyleRenderPersist(declarationName, valueName, value){
    this._styleable.updateValue(declarationName, valueName, value);
    this._styleable.render(declarationName);
    this.set(valueName, value);
  },

  updateStyleRenderPersistThrottle(declarationName, valueName, value, spacing){
    this._styleable.updateValue(declarationName, valueName, value);
    this._styleable.render(declarationName);
    Ember.run.throttle(this, () => {
      this.set(valueName, value);
    }, spacing);
  }

});
