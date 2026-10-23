(() => {
  'use strict';

  const bases = window.__NR_COMPACT_BASES__ = window.__NR_COMPACT_BASES__ || {};
  const patches = window.__NR_COMPACT_PATCHES__ = window.__NR_COMPACT_PATCHES__ || {};

  function clone(value) {
    if (typeof structuredClone === 'function') return structuredClone(value);
    return JSON.parse(JSON.stringify(value));
  }

  function applyPatch(current, patch, definitions) {
    if (!patch) return current;
    const kind = patch[0];
    if (kind === 'd') return applyPatch(current, patch[2], patch[1]);
    if (kind === 'r') {
      const index = patch[1];
      if (!Array.isArray(definitions) || !Number.isInteger(index) || index < 0 || index >= definitions.length)
        throw new Error('Invalid compact dictionary reference');
      return applyPatch(current, definitions[index], definitions);
    }
    if (kind === 'v') return clone(patch[1]);
    if (kind === 'o') {
      const output = current && typeof current === 'object' && !Array.isArray(current)
        ? { ...current }
        : {};
      Object.entries(patch[1] || {}).forEach(([key, child]) => {
        output[key] = applyPatch(output[key], child, definitions);
      });
      (patch[2] || []).forEach(key => delete output[key]);
      return output;
    }
    if (kind === 'a') {
      const output = Array.isArray(current) ? current.slice() : [];
      output.length = patch[2];
      Object.entries(patch[1] || {}).forEach(([index, child]) => {
        output[Number(index)] = applyPatch(output[Number(index)], child, definitions);
      });
      return output;
    }
    throw new Error(`Unknown compact-data patch kind: ${kind}`);
  }

  function materialize(key) {
    if (!Object.prototype.hasOwnProperty.call(bases, key)) {
      throw new Error(`Compact-data base is missing: ${key}`);
    }
    return applyPatch(clone(bases[key]), patches[key]);
  }

  function release(key) {
    delete bases[key];
    delete patches[key];
  }

  window.NRCompact = Object.freeze({ materialize, release });
})();
