import { FieldState, FormState } from '../../index';
import * as assert from 'assert';
import { delay } from '../utils';
import { useStrict } from "mobx";

useStrict(true);

describe("FieldState basic", () => {
  it("hotValue and safeValue is set to initial value", () => {
    const name = new FieldState('hello')
    assert.equal(name.value, 'hello');
    assert.equal(name.$, 'hello');
  });

  it("no validation should keep hasBeenValidated false", () => {
    const name = new FieldState('hello')
    assert.equal(name.hasBeenValidated, false);
  });

  it("validating changes hasBeenValidated to true", async () => {
    const name = new FieldState('hello')
    name.onChange('world')
    await name.validate()    
    assert.equal(name.hasBeenValidated, true);
  });

  it("reinitValue changes hasBeenValidated to false", () => {
    const name = new FieldState('world')
    name.reinitValue('world')
    assert.equal(name.hasBeenValidated, false)
  })

  it("reinitValue should change the value immediately", () => {
    const name = new FieldState('hello')
    name.reinitValue('world')

    assert.equal(name.value, 'world');
    assert.equal(name.$, 'world');
    assert.equal(name.hasBeenValidated, false);
  });

  it("reinitValue should prevent any automatic validation from running", async () => {
    const name = new FieldState('').validators(
        (val) => !val && 'value required'
    );
    name.onChange('world');
    name.reinitValue('');
    await delay(300);
    assert.equal(name.hasError, false);
    assert.equal(name.value, '');
    assert.equal(name.$, '');
    assert.equal(name.hasBeenValidated, false);
  });

  it("reinitValue followed by onChange should run validators", async () => {
    const name = new FieldState('').validators(
        (val) => !val && 'value required'
    );
    name.onChange('world');
    name.reinitValue('');
    name.onChange('');
    await delay(300);
    assert.equal(name.hasError, true);
    assert.equal(name.value, '');
    assert.equal(name.$, '');
  });

  it("reinitValue followed by validate should still validate", async () => {
    const name = new FieldState('').validators(
        (val) => !val && 'value required'
    );
    name.onChange('world');
    name.reinitValue('');
    const res = await name.validate();
    assert.equal(res.hasError, true);
    assert.equal(name.value, '');
    assert.equal(name.$, '');
  });
});
