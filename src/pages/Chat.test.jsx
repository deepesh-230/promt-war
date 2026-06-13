import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import Chat from './Chat';
import * as geminiService from '../services/geminiService';

vi.mock('../services/geminiService');

describe('Chat Component', () => {
  beforeEach(() => {
    // Mock scrollIntoView
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('renders default greeting message', () => {
    render(<Chat />);
    expect(screen.getByText(/Hi! I'm your AI wellness mentor/i)).toBeInTheDocument();
  });

  it('sends a message and displays response', async () => {
    geminiService.chatWithMentor.mockResolvedValueOnce("That sounds tough, but you can do it!");

    render(<Chat />);
    
    const input = screen.getByPlaceholderText('Type your message...');
    const submitBtn = screen.getByRole('button', { name: /Send Message/i });

    fireEvent.change(input, { target: { value: 'I am so stressed about my physics test' } });
    fireEvent.click(submitBtn);

    // Optimistically rendered
    expect(screen.getByText('I am so stressed about my physics test')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('That sounds tough, but you can do it!')).toBeInTheDocument();
    });
  });
});
