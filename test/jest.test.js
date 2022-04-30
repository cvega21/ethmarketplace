import jestTest from './jestTest'

test('adds 1 + 2 = 3', () => {
  expect(jestTest(1,2)).toBe(3);
})