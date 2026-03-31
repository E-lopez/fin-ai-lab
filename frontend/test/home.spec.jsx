import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Home from '../src/routes/home/Home';

describe('Home component', () => {
  it('renders both CTA buttons initially', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    
    expect(screen.getByText('Comienza aquí!')).toBeInTheDocument();
  });

  it('renders the main title', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    expect(screen.getByText('Un préstamo que')).toBeInTheDocument();
    expect(screen.getByText('te ayuda de verdad')).toBeInTheDocument();
    expect(screen.getByText('Queremos verte avanzar')).toBeInTheDocument();
    expect(screen.getByText('© 2025 All rights reserved')).toBeInTheDocument();
  });    

  it('buttons have correct href attributes', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    
    const secondaryButton = screen.getByText('Comienza aquí!').closest('a');

    expect(secondaryButton).toHaveAttribute('href', '/guide');
  });
});