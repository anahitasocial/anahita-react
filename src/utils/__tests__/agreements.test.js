/* eslint-env jest */
import agreements from '../agreements';

const { compareVersions, needsAcceptance } = agreements;

describe('compareVersions', () => {
  it('compares numerically, not as text', () => {
    // As strings "1.10.0" < "1.9.0", which would stop re-prompting the day any
    // part reached double digits.
    expect(compareVersions('1.10.0', '1.9.0')).toBe(1);
    expect(compareVersions('2.0.0', '10.0.0')).toBe(-1);
  });

  it('treats a missing part as zero', () => {
    expect(compareVersions('1.0', '1.0.0')).toBe(0);
    expect(compareVersions('1', '1.0.0')).toBe(0);
  });

  it('orders each part in turn', () => {
    expect(compareVersions('1.0.1', '1.0.0')).toBe(1);
    expect(compareVersions('1.1.0', '1.0.9')).toBe(1);
    expect(compareVersions('1.0.0', '1.0.1')).toBe(-1);
  });
});

describe('needsAcceptance', () => {
  it('asks somebody who has accepted nothing', () => {
    expect(needsAcceptance(undefined, '1.0.0')).toBe(true);
    expect(needsAcceptance({ accepted: false, version: '' }, '1.0.0')).toBe(true);
  });

  // An acceptance with no version recorded proves nothing about what was
  // agreed, and must not read as current.
  it('asks somebody whose acceptance has no version', () => {
    expect(needsAcceptance({ accepted: true, version: '' }, '1.0.0')).toBe(true);
  });

  it('does not ask somebody who is current', () => {
    expect(needsAcceptance({ accepted: true, version: '1.0.0' }, '1.0.0')).toBe(false);
    expect(needsAcceptance({ accepted: true, version: '1.0' }, '1.0.0')).toBe(false);
  });

  it('asks again when the version in force moves ahead', () => {
    expect(needsAcceptance({ accepted: true, version: '1.0.0' }, '1.0.1')).toBe(true);
    expect(needsAcceptance({ accepted: true, version: '1.9.0' }, '1.10.0')).toBe(true);
  });

  // A rollback is not a new document. Re-prompting for text somebody has
  // already accepted teaches them to click through it.
  it('does not ask again when the version in force moves backwards', () => {
    expect(needsAcceptance({ accepted: true, version: '2.0.0' }, '1.0.0')).toBe(false);
  });
});
