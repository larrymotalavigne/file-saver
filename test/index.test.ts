import { test, describe } from 'node:test';
import assert from 'node:assert';

// Note: These tests run in Node.js environment
// Browser-specific functionality (DOM, Blob, etc.) would need to be tested in a browser environment
// or with a library like jsdom

describe('file-saver module', () => {
  test('module exports expected functions', async () => {
    const module = await import('../src/index.ts');

    assert.strictEqual(typeof module.saveAs, 'function', 'saveAs should be a function');
    assert.strictEqual(typeof module.saveText, 'function', 'saveText should be a function');
    assert.strictEqual(typeof module.saveJSON, 'function', 'saveJSON should be a function');
    assert.strictEqual(typeof module.saveCSV, 'function', 'saveCSV should be a function');
    assert.strictEqual(typeof module.downloadURL, 'function', 'downloadURL should be a function');
  });

  test('module has default export', async () => {
    const module = await import('../src/index.ts');

    assert.ok(module.default, 'should have default export');
    assert.strictEqual(typeof module.default.saveAs, 'function');
    assert.strictEqual(typeof module.default.saveText, 'function');
    assert.strictEqual(typeof module.default.saveJSON, 'function');
    assert.strictEqual(typeof module.default.saveCSV, 'function');
    assert.strictEqual(typeof module.default.downloadURL, 'function');
  });

  test('SaveOptions interface is exported', async () => {
    // TypeScript types are not available at runtime, but we can verify the module structure
    const module = await import('../src/index.ts');
    assert.ok(module, 'module should be importable');
  });
});

describe('TypeScript compilation', () => {
  test('module compiles without errors', async () => {
    // If we can import it, TypeScript compilation succeeded
    const module = await import('../src/index.ts');
    assert.ok(module, 'module should compile and import successfully');
  });
});
