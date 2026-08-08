import { afterEach, describe, expect, it } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { EmptyState } from '@/components/EmptyState';

afterEach(cleanup);

describe('EmptyState', () => {
  it('renders a meaningful heading and body text, never a blank/dead end', () => {
    render(
      <EmptyState
        icon="info"
        title="No projects yet"
        body="Once you book a design audit, your project timeline appears here."
      />,
    );
    expect(
      screen.getByRole('heading', { name: 'No projects yet' }),
    ).toBeDefined();
    expect(screen.getByText(/book a design audit/)).toBeDefined();
  });

  it('defaults the heading to h3 so it never outranks a page/section h2', () => {
    render(<EmptyState icon="info" title="No projects yet" />);
    expect(
      screen.getByRole('heading', { level: 3, name: 'No projects yet' }),
    ).toBeDefined();
  });

  it('headingAs="h2" is honoured for a standalone empty state', () => {
    render(<EmptyState icon="info" title="No projects yet" headingAs="h2" />);
    expect(
      screen.getByRole('heading', { level: 2, name: 'No projects yet' }),
    ).toBeDefined();
  });

  it('renders the one action when given, keeping the state actionable rather than a dead end', () => {
    render(
      <EmptyState
        icon="info"
        title="No projects yet"
        action={<a href="/book-audit">Book a design audit</a>}
      />,
    );
    expect(
      screen.getByRole('link', { name: 'Book a design audit' }),
    ).toBeDefined();
  });
});
