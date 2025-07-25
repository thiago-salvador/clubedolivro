import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the app without crashing', () => {
  render(<App />);
  // Check if the app renders without errors
  expect(document.body).toBeInTheDocument();
});
