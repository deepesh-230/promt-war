import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Activities from './Activities';

describe('Activities Page', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('renders the Activities page headers', () => {
    render(<Activities />);
    expect(screen.getByText('Focus & Relax')).toBeInTheDocument();
    expect(screen.getByText('Pomodoro Timer')).toBeInTheDocument();
    expect(screen.getByText('Mindful Breathing')).toBeInTheDocument();
  });

  describe('Pomodoro Timer', () => {
    it('initializes with 25:00 for focus mode', () => {
      render(<Activities />);
      expect(screen.getByText('25:00')).toBeInTheDocument();
    });

    it('switches to break mode and displays 05:00', () => {
      render(<Activities />);
      const breakBtn = screen.getByText('Break (5m)');
      fireEvent.click(breakBtn);
      expect(screen.getByText('05:00')).toBeInTheDocument();
    });

    it('counts down when play button is clicked', () => {
      render(<Activities />);
      const buttons = screen.getAllByRole('button');
      // The play button is the third button (Focus, Break, Play, Reset)
      const playBtn = buttons[2];
      
      fireEvent.click(playBtn);
      
      act(() => {
        vi.advanceTimersByTime(1000); // Advance 1 second
      });
      
      expect(screen.getByText('24:59')).toBeInTheDocument();
    });
  });

  describe('Breathing Exercise', () => {
    it('initializes in an idle state', () => {
      render(<Activities />);
      expect(screen.getByText('Start Guided Breathing')).toBeInTheDocument();
      // The instruction text only appears when active
      expect(screen.queryByText('Breathe In...')).not.toBeInTheDocument();
    });

    it('starts the exercise when clicked', () => {
      render(<Activities />);
      const startBtn = screen.getByText('Start Guided Breathing');
      
      fireEvent.click(startBtn);
      
      act(() => {
        vi.advanceTimersByTime(1);
      });
      
      expect(screen.getByText('Stop')).toBeInTheDocument();
      expect(screen.getByText('Breathe In...')).toBeInTheDocument();
    });
  });
});
