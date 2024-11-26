// jest-dom adds custom jest matchers for asserting on DOM nodes
// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import fetchMock from 'jest-fetch-mock'; // Correct import for jest-fetch-mock
import 'jest-canvas-mock'; // To mock canvas for Leaflet

// Enable fetch mocks
fetchMock.enableMocks();

import L from 'leaflet';

// Mock Leaflet icon to avoid issues with missing images
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'mockIcon',
  iconUrl: 'mockIcon',
  shadowUrl: 'mockIcon',
});

// Fix Jest's handling of `window.matchMedia`
window.matchMedia = window.matchMedia || (() => ({
  matches: false,
  addListener: () => {},
  removeListener: () => {},
}));
