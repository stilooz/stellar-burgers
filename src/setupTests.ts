import '@testing-library/jest-dom';

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn()
};
Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
  writable: true
});

global.fetch = jest.fn();

afterEach(() => {
  jest.clearAllMocks();
});
