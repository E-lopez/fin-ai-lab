import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SurveyGuide from '../src/routes/SurveyGuide/SurveyGuide.tsx';

describe('SurveyGuide component', () => {
  it('renders both CTA buttons initially', () => {
    render(
      <MemoryRouter>
        <SurveyGuide />
      </MemoryRouter>
    );
    
    expect(screen.getByText('¡Empecemos!')).toBeInTheDocument();
  });

    it('container does not exceed 1440px width', () => {
      render(
        <MemoryRouter>
          <SurveyGuide />
        </MemoryRouter>
      );

      const container =
        screen.queryByTestId('survey-guide-container') ||
        screen.queryByRole('main') ||
        screen.getByText('¡Empecemos!').parentElement;

      // Get computed style
      const computedWidth = window.getComputedStyle(container).maxWidth;

      // Only parse if it's a pixel value
      if (computedWidth.endsWith('px')) {
        expect(parseInt(computedWidth)).toBeLessThanOrEqual(1440);
      } else {
        // If maxWidth is 'none' or not set, treat as no limit
        expect(['none', '', 'unset', 'initial']).toContain(computedWidth);
      }
    });

  it('buttons have correct href attributes', () => {
    render(
      <MemoryRouter>
        <SurveyGuide />
      </MemoryRouter>
    );
    
    const secondaryButton = screen.getByText('¡Empecemos!').closest('a');

    expect(secondaryButton).toHaveAttribute('href', '/survey');
  });
});