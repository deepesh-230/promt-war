import { render, screen } from '@testing-library/react';
import { describe, it, expect, afterEach, vi } from 'vitest';
import Dashboard from './Dashboard';

describe('Dashboard Component', () => {
  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('renders the Dashboard header', () => {
    render(<Dashboard />);
    expect(screen.getByText('Welcome back, Student')).toBeInTheDocument();
    expect(screen.getByText('Here is your wellness overview.')).toBeInTheDocument();
  });

  it('renders default stats when no data is in localStorage', () => {
    render(<Dashboard />);
    expect(screen.getByText('82/100')).toBeInTheDocument();
    expect(screen.getByText('Moderate')).toBeInTheDocument();
    expect(screen.getByText('6.5 hrs')).toBeInTheDocument();
    expect(screen.getByText('8 hrs/day')).toBeInTheDocument();
  });

  it('renders insights based on localStorage journals', () => {
    const mockJournals = [
      {
        analysis: {
          recommendations: ['Drink more water', 'Take a 10 minute break']
        }
      }
    ];
    localStorage.setItem('mindmate_journals', JSON.stringify(mockJournals));
    
    render(<Dashboard />);
    expect(screen.getByText('Drink more water')).toBeInTheDocument();
    expect(screen.getByText('Take a 10 minute break')).toBeInTheDocument();
  });
});
