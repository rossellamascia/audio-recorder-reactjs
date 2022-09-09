import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders homepage', () => {
  render(<App />);
  const linkElement = screen.getByText(/Press the microphone to record/i);
  expect(linkElement).toBeInTheDocument();
});
