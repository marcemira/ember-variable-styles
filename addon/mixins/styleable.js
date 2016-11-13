import Ember from 'ember';
import Styleable from '../-private/styleable';

export default Ember.Mixin.create({

  init(){
    this._super(...arguments);
    this.set('_styleable', new Styleable(this));
  },

  attributeBindings: ['style'],

  rebuildStyle(declarationName, subject){
    this._styleable.buildDeclaration(declarationName, subject);
  },

  renderStyle(declarationName){
    return this._styleable.render(declarationName);
  },

  renderAllStyles(){
    this._styleable.renderAll();
  },

  renderStylePersist(declarationName){
    this.set('style', this._styleable.render(declarationName));
  },

  renderAllStylesPersist(){
    this.set('style', this._styleable.renderAll());
  },

  updateStyle(declarationName, valueName, value){
    this._styleable.updateValue(declarationName, valueName, value);
  },

  updateStylePersist(declarationName, valueName, value){
    this.updateStyle(...arguments);
    this.set(valueName, value);
  },

  updateStyleRender(declarationName, valueName, value){
    this._styleable.updateValue(declarationName, valueName, value);
    this.set('style', this._styleable.renderAll());
  },

  updateStyleRenderPersist(declarationName, valueName, value){
    this.updateStyleRender(...arguments);
    this.set(valueName, value);
    this.set('style', this._styleable.renderAll());
  },

  updateStylesRender(array){
    array.forEach( update => {
      this._styleable.updateValue(update.declaration, update.property, update.value);
    });
    this.set('style', this._styleable.renderAll());
  },

  updateStylesRenderPersist(array){
    let hash = {};

    array.forEach( update => {
      this._styleable.updateValue(update.declaration, update.property, update.value);
      hash[update.property] = update.value;
    });

    this.setProperties(hash);
    this.set('style', this._styleable.renderAll());
  },

  updateStyleRenderPersistThrottle(declarationName, valueName, value, spacing){
    this._styleable.updateValue(declarationName, valueName, value);
    this._styleable.render(declarationName);
    Ember.run.throttle(this, () => {
      this.set(valueName, value);
    }, spacing);

    this.set('style', this._styleable.renderAll());
  },

  updateStylesRenderPersistThrottle(array, spacing){
    let hash = {};

    array.forEach( update => {
      this._styleable.updateValue(update.declaration, update.property, update.value);
      hash[update.property] = update.value;
    });

    Ember.run.throttle(this, () => {
      this.setProperties(hash);
    }, spacing);

    this.set('style', this._styleable.renderAll());
  }

});
