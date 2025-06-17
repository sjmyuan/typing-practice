import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PracticeArea from './PracticeArea';

describe('PracticeArea', () => {
  const prompt = 'hello';

  it('marks correct characters in green', () => {
    render(<PracticeArea prompt={prompt} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'h' } });
    const chars = screen.getAllByTestId('practice-char');
    expect(chars[0]).toHaveClass('text-green-600');
  });

  it('marks incorrect characters in red', () => {
    render(<PracticeArea prompt={prompt} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'x' } });
    const chars = screen.getAllByTestId('practice-char');
    expect(chars[0]).toHaveClass('text-red-600');
  });

  it('updates marking in real-time when using backspace', () => {
    render(<PracticeArea prompt={prompt} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'hx' } });
    let chars = screen.getAllByTestId('practice-char');
    expect(chars[1]).toHaveClass('text-red-600');
    // Simulate backspace
    fireEvent.change(input, { target: { value: 'h' } });
    chars = screen.getAllByTestId('practice-char');
    expect(chars[1]).not.toHaveClass('text-red-600');
    expect(chars[1]).not.toHaveClass('text-green-600');
  });

  it('remains accurate and responsive with rapid input', () => {
    render(<PracticeArea prompt={prompt} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'hezlo' } });
    const chars = screen.getAllByTestId('practice-char');
    expect(chars[0]).toHaveClass('text-green-600'); // h
    expect(chars[1]).toHaveClass('text-green-600'); // e
    expect(chars[2]).toHaveClass('text-red-600');   // z (should be l)
    expect(chars[3]).toHaveClass('text-green-600'); // l
    expect(chars[4]).toHaveClass('text-green-600'); // o
  });
});
