import { add } from '../../src/example';

describe('example', () => {
  it('add()', () => {
    const actual = add(1, 2);
    expect(actual).toEqual(3);
  });
});
