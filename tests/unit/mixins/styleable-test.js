import Ember from 'ember';
import StyleableMixin from 'ember-variable-styles/mixins/styleable';
import { module, test } from 'qunit';

module('Unit | Mixin | styleable');

// Replace this with your real tests.
test('it works', function(assert) {
  let StyleableObject = Ember.Object.extend(StyleableMixin);
  let subject = StyleableObject.create();
  assert.ok(subject);
});
