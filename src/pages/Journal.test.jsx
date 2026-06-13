import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import Journal from './Journal';
import * as geminiService from '../services/geminiService';

vi.mock('../services/geminiService');

describe('Journal Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('renders the Journal page correctly', () => {
    render(<Journal />);
    expect(screen.getByText('AI Journal')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/How are you feeling today\?/)).toBeInTheDocument();
  });

  it('submits a new journal entry and displays it', async () => {
    geminiService.analyzeJournalWithGemini.mockResolvedValueOnce({
      sentiment: "Positive",
      stressLevel: "Low",
      burnoutRisk: "Low",
      summary: "Feeling great",
      recommendations: ["Keep it up"],
      triggers: []
    });

    render(<Journal />);
    
    const input = screen.getByPlaceholderText(/How are you feeling today\?/);
    const submitBtn = screen.getByRole('button', { name: /Submit Journal Entry/i });

    fireEvent.change(input, { target: { value: 'Today was a fantastic study day!' } });
    fireEvent.click(submitBtn);

    expect(screen.getByText('Analyzing...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Today was a fantastic study day!')).toBeInTheDocument();
      expect(screen.getByText(/Sentiment: Positive/)).toBeInTheDocument();
    });
  });
});
