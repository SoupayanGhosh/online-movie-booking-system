import { render, screen } from '@testing-library/react';
import LoadingSpinner from './LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders with default props', () => {
    render(<LoadingSpinner />);
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders with custom text', () => {
    const customText = 'Please wait...';
    render(<LoadingSpinner text={customText} />);
    expect(screen.getByText(customText)).toBeInTheDocument();
  });

  it('renders with different sizes', () => {
    const { rerender } = render(<LoadingSpinner size="small" />);
    expect(screen.getByRole('status')).toHaveClass('w-4 h-4');

    rerender(<LoadingSpinner size="medium" />);
    expect(screen.getByRole('status')).toHaveClass('w-8 h-8');

    rerender(<LoadingSpinner size="large" />);
    expect(screen.getByRole('status')).toHaveClass('w-12 h-12');
  });

  it('renders in fullscreen mode', () => {
    render(<LoadingSpinner fullScreen />);
    expect(screen.getByRole('status').parentElement).toHaveClass('fixed inset-0');
  });

  it('is accessible', () => {
    render(<LoadingSpinner />);
    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite');
    expect(screen.getByText('Loading...')).toHaveAttribute('aria-label', 'Loading...');
  });
}); 