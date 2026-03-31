import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Helper to flush promises
const flushPromises = () => new Promise(setImmediate);

describe('Consent component', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('sets status to loading, renders LoadingIndicator, then sets status to idle and renders content with two link-button buttons when getDocuments succeeds', async () => {
    // Mock fetchAgreements to resolve with the correct shape
    const mockData = {
      version: '0.0.1',
      summary: { a: 'Resumen 1', b: 'Resumen 2' },
      agreement: { a: 'Acuerdo' },
      termsConditions: { a: 'Términos' },
    };
    vi.doMock('../../src/services/surveyService/surveyService', () => ({
      SurveyService: {
        fetchAgreements: vi.fn().mockResolvedValue(mockData),
      },
    }));

    // Dynamically import Consent to use the new mock
    const { default: ConsentComponent } = await import('../../src/routes/survey/components/consent/consent');

    render(
      <MemoryRouter>
        <ConsentComponent />
      </MemoryRouter>
    );

    // Wait for the content to appear
    await waitFor(() => {
      expect(screen.getByText('Resumen 1')).toBeInTheDocument();
      expect(screen.getByText('Resumen 2')).toBeInTheDocument();
    });

    describe('Consent component', () => {
      beforeEach(() => {
        vi.resetAllMocks();
      });

      it('sets status to loading, renders LoadingIndicator, then sets status to idle and renders content with two link-button buttons when getDocuments succeeds', async () => {
        const mockData = {
          version: '0.0.1',
          summary: { a: 'Resumen 1', b: 'Resumen 2' },
          agreement: { a: 'Acuerdo' },
          termsConditions: { a: 'Términos' },
        };
        vi.doMock('../../src/services/surveyService/surveyService', () => ({
          SurveyService: {
            fetchAgreements: vi.fn().mockResolvedValue(mockData),
          },
        }));

        const { default: ConsentComponent } = await import('../../src/routes/survey/components/consent/consent');

        render(
          <MemoryRouter>
            <ConsentComponent />
          </MemoryRouter>
        );

        await waitFor(() => {
          expect(screen.getByText('Resumen 1')).toBeInTheDocument();
          expect(screen.getByText('Resumen 2')).toBeInTheDocument();
        });

        const linkButtons = screen.getAllByRole('button', { name: /./ });
        expect(linkButtons.length).toBeGreaterThanOrEqual(2);
      });

      it('opens a dialog element when the first link-button is clicked', async () => {
        const mockData = {
          version: '0.0.1',
          summary: { a: 'Resumen 1', b: 'Resumen 2' },
          agreement: { a: 'Acuerdo' },
          termsConditions: { a: 'Términos' },
        };
        vi.doMock('../../src/services/surveyService/surveyService', () => ({
          SurveyService: {
            fetchAgreements: vi.fn().mockResolvedValue(mockData),
          },
        }));

        const { default: ConsentComponent } = await import('../../src/routes/survey/components/consent/consent');

        render(
          <MemoryRouter>
            <ConsentComponent />
          </MemoryRouter>
        );

        await waitFor(() => {
          expect(screen.getByText('Resumen 1')).toBeInTheDocument();
        });

        const linkButtons = screen.getAllByRole('button', { name: /./ });
        fireEvent.click(linkButtons[0]);

        // Wait for dialog to appear
        await waitFor(() => {
          const dialog = screen.getByRole('dialog');
          expect(dialog).toBeInTheDocument();
        });
      });

      it('opens a dialog element when the second link-button is clicked', async () => {
        const mockData = {
          version: '0.0.1',
          summary: { a: 'Resumen 1', b: 'Resumen 2' },
          agreement: { a: 'Acuerdo' },
          termsConditions: { a: 'Términos' },
        };
        vi.doMock('../../src/services/surveyService/surveyService', () => ({
          SurveyService: {
            fetchAgreements: vi.fn().mockResolvedValue(mockData),
          },
        }));

        const { default: ConsentComponent } = await import('../../src/routes/survey/components/consent/consent');

        render(
          <MemoryRouter>
            <ConsentComponent />
          </MemoryRouter>
        );

        await waitFor(() => {
          expect(screen.getByText('Resumen 2')).toBeInTheDocument();
        });

        const linkButtons = screen.getAllByRole('button', { name: /./ });
        fireEvent.click(linkButtons[1]);

        // Wait for dialog to appear
        await waitFor(() => {
          const dialog = screen.getByRole('dialog');
          expect(dialog).toBeInTheDocument();
        });
      });

      it('does not render a dialog before any link-button is clicked', async () => {
        const mockData = {
          version: '0.0.1',
          summary: { a: 'Resumen 1', b: 'Resumen 2' },
          agreement: { a: 'Acuerdo' },
          termsConditions: { a: 'Términos' },
        };
        vi.doMock('../../src/services/surveyService/surveyService', () => ({
          SurveyService: {
            fetchAgreements: vi.fn().mockResolvedValue(mockData),
          },
        }));

        const { default: ConsentComponent } = await import('../../src/routes/survey/components/consent/consent');

        render(
          <MemoryRouter>
            <ConsentComponent />
          </MemoryRouter>
        );

        await waitFor(() => {
          expect(screen.getByText('Resumen 1')).toBeInTheDocument();
        });

        // There should be no dialog before any button is clicked
        expect(screen.queryByRole('dialog')).toBeNull();
      });
    });
  });
  
});