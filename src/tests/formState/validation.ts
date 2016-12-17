import { FieldState, FormState } from '../../index';
import * as assert from 'assert';
import { delay } from '../utils';

describe("FormState validation", () => {
  it("should validate a nested FieldState and pass if valid", async () => {
    const name = new FieldState({
      value: '',
    });
    const form = new FormState({
      name,
    });
    const res = await form.validate();
    assert.equal(res.hasError, false);
    assert.equal(form.hasError, false);
  });

  it("should validate a nested FieldState and fail if invalid", async () => {
    const name = new FieldState({
      value: '',
      validators: [
        (val) => !val && 'value required'
      ]
    });
    const form = new FormState({
      name,
    });
    const res = await form.validate();
    assert.equal(res.hasError, true);
    assert.equal(form.hasError, true);
    assert.equal(form.error, 'value required');
    assert.equal(form.safeValue.name.error, 'value required');
  });

  it("should validate a nested - nested FieldState and pass if valid", async () => {
    const name = new FieldState({
      value: '',
    });
    const form = new FormState({
      name: new FormState({
        name
      })
    });
    const res = await form.validate();
    assert.equal(res.hasError, false);
    assert.equal(form.hasError, false);
  });

  it("should validate a nested - nested FieldState and fail if invalid", async () => {
    const name = new FieldState({
      value: '',
      validators: [
        (val) => !val && 'value required'
      ]
    });
    const form = new FormState({
      name: new FormState({
        name
      })
    });
    const res = await form.validate();
    assert.equal(res.hasError, true);
    assert.equal(form.hasError, true);
    assert.equal(form.error, 'value required');
    assert.equal(form.safeValue.name.error, 'value required');
    assert.equal(form.safeValue.name.safeValue.name.safeValue, '');
  });
});

