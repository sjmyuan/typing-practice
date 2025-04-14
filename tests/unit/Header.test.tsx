import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from '../../src/components/Header';

describe('Header Component', () => {
  it('renders without crashing', () => {
    const { getByText } = render(<Header />);
    expect(getByText('Typing Practice')).toBeInTheDocument();
  });
});
