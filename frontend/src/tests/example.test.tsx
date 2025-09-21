import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App Component', () => {
  test('renders the app without crashing', () => {
    render(<App />);
    const linkElement = screen.getByText(/Welcome to the Student Guidance Platform/i);
    expect(linkElement).toBeInTheDocument();
  });
});