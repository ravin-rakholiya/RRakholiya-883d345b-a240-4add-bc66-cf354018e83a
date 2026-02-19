import { AuthEffects } from './auth.effects';

describe('AuthEffects', () => {
  it('should export a record of effects', () => {
    expect(AuthEffects).toBeDefined();
    expect(typeof AuthEffects).toBe('object');
    expect(Object.keys(AuthEffects).length).toBeGreaterThan(0);
  });
});
