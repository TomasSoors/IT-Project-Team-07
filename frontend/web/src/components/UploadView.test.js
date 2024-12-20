import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import UploadView from './UploadView';
import data from '../../../shared/data';

jest.mock('../../../shared/data', () => ({
  addTree: jest.fn(),
}));

describe('UploadView Component', () => {
  beforeEach(() => {
    sessionStorage.setItem('token', 'mock-token');
    fetch.resetMocks();
  });

  test('renders upload interface', () => {
    render(
      <BrowserRouter>
        <UploadView />
      </BrowserRouter>
    );

    expect(screen.getByText(/Sleep je GeoJSON-bestand hierheen of/i)).toBeInTheDocument();
    expect(screen.getByText(/klik om een bestand te selecteren/i)).toBeInTheDocument();
  });

  test('validates and uploads a valid GeoJSON file', async () => {
    const mockGeoJSON = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [5.352692, 50.95306],
          },
          properties: {
            tree_id: "Tree A",
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [5.3527, 50.9531],
          },
          properties: {
            tree_id: "Tree B",
          },
        },
      ],
    };

    const file = new Blob([JSON.stringify(mockGeoJSON)], { type: 'application/geo+json' });
    const mockFile = new File([file], 'trees.geojson', { type: 'application/geo+json' });

    render(
      <BrowserRouter>
        <UploadView />
      </BrowserRouter>
    );

    const fileInput = screen.getByLabelText(/klik om een bestand te selecteren/i);
    fireEvent.change(fileInput, { target: { files: [mockFile] } });

    await waitFor(() => {
      expect(data.addTree).toHaveBeenCalledTimes(2);
      expect(data.addTree).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "Tree Tree A",
          description: "N.v.t",
          latitude: 5.352692,
          longitude: 50.95306,
        }),
        "mock-token"
      );
      expect(data.addTree).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "Tree Tree B",
          description: "N.v.t",
          latitude: 5.3527,
          longitude: 50.9531,
        }),
        "mock-token"
      );
    });
  });

  test('shows error for invalid GeoJSON file type', async () => {
    const invalidFile = new File(['Not GeoJSON'], 'invalid.txt', { type: 'text/plain' });

    render(
      <BrowserRouter>
        <UploadView />
      </BrowserRouter>
    );

    const fileInput = screen.getByLabelText(/klik om een bestand te selecteren/i);
    fireEvent.change(fileInput, { target: { files: [invalidFile] } });

    await waitFor(() => {
      expect(screen.getByText(/Selecteer een geldig GeoJSON-bestand/i)).toBeInTheDocument();
    });
  });

  test('redirects to home when token is missing', () => {
    sessionStorage.removeItem('token');

    render(
      <BrowserRouter>
        <UploadView />
      </BrowserRouter>
    );
    expect(window.location.pathname).toBe('/');
  });
  test('redirects to home when API does not respond', async () => {
    sessionStorage.setItem('token', 'mock-token');
  
    const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
  
    fetch.mockImplementationOnce(() => Promise.reject(new Error('Network Error')));
  
    render(
      <BrowserRouter>
        <UploadView />
      </BrowserRouter>
    );
  
    await waitFor(() => {
      expect(window.location.pathname).toBe('/');
    });
  
    expect(consoleErrorMock).toHaveBeenCalledWith(
      "Er is een fout opgetreden bij het verifiëren van de token: ",
      expect.any(Error)
    );
    consoleErrorMock.mockRestore();
  });
  test('redirects to home when token verification fails', async () => {
    sessionStorage.setItem('token', 'mock-token');
    fetch.mockResponseOnce(JSON.stringify({}), { status: 401 });

    render(
      <BrowserRouter>
        <UploadView />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(window.location.pathname).toBe('/');
    });
  });

  test('shows multiple errors for a single feature', async () => {
    const geoJSON = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: { type: "InvalidType", coordinates: "invalid" },
          properties: {},
        },
      ],
    };

    const file = new File([JSON.stringify(geoJSON)], 'invalid.geojson', { type: 'application/geo+json' });

    render(
      <BrowserRouter>
        <UploadView />
      </BrowserRouter>
    );

    const fileInput = screen.getByLabelText(/klik om een bestand te selecteren/i);
    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText(/Feature 0: 'tree_id' ontbreekt in properties./i)).toBeInTheDocument();
      expect(screen.getByText(/Feature 0: Ongeldige geometrie. Verwachte type 'Point'./i)).toBeInTheDocument();
      expect(screen.getByText(/Feature 0: Coördinaten zijn ongeldig./i)).toBeInTheDocument();
    });
  });

  test('shows error for missing coordinates', async () => {
    const invalidGeoJSON = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [],
          },
          properties: {
            tree_id: "Tree A",
          },
        },
      ],
    };

    const file = new File([JSON.stringify(invalidGeoJSON)], 'invalid.geojson', { type: 'application/geo+json' });

    render(
      <BrowserRouter>
        <UploadView />
      </BrowserRouter>
    );

    const fileInput = screen.getByLabelText(/klik om een bestand te selecteren/i);
    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText(/Feature 0: Coördinaten zijn ongeldig./i)).toBeInTheDocument();
    });
  });

  test('shows error for invalid file extension', async () => {
    const invalidFile = new File(['test'], 'invalid.txt', { type: 'text/plain' });

    render(
      <BrowserRouter>
        <UploadView />
      </BrowserRouter>
    );

    const fileInput = screen.getByLabelText(/klik om een bestand te selecteren/i);
    fireEvent.change(fileInput, { target: { files: [invalidFile] } });

    await waitFor(() => {
      expect(screen.getByText(/Selecteer een geldig GeoJSON-bestand./i)).toBeInTheDocument();
    });
  });
  test('handles error if token is missing during file processing', async () => {
    sessionStorage.removeItem('token');
    const validGeoJSON = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: { type: "Point", coordinates: [5.352692, 50.95306] },
          properties: { tree_id: "Tree A" },
        },
      ],
    };
    const file = new File([JSON.stringify(validGeoJSON)], 'valid.geojson', { type: 'application/geo+json' });
  
    render(
      <BrowserRouter>
        <UploadView />
      </BrowserRouter>
    );
  
    const fileInput = screen.getByLabelText(/klik om een bestand te selecteren/i);
    fireEvent.change(fileInput, { target: { files: [file] } });
  
    await waitFor(() => {
      expect(screen.getByText(/Authenticatie vereist. Log opnieuw in./i)).toBeInTheDocument();
    });
  });
  
  test('handles fetch error during token verification', async () => {
    fetch.mockImplementationOnce(() => Promise.reject(new Error('Network Error')));
  
    render(
      <BrowserRouter>
        <UploadView />
      </BrowserRouter>
    );
  
    await waitFor(() => {
      expect(window.location.pathname).toBe('/');
    });
  });
  
  test('shows error for invalid GeoJSON structure', async () => {
    const invalidGeoJSON = { invalid: "structure" };
    const file = new File([JSON.stringify(invalidGeoJSON)], 'invalid.geojson', { type: 'application/geo+json' });
  
    render(
      <BrowserRouter>
        <UploadView />
      </BrowserRouter>
    );
  
    const fileInput = screen.getByLabelText(/klik om een bestand te selecteren/i);
    fireEvent.change(fileInput, { target: { files: [file] } });
  
    await waitFor(() => {
      expect(screen.getByText(/Ongeldig GeoJSON-bestand. Verwachte 'FeatureCollection'./i)).toBeInTheDocument();
    });
  });
  
  test('parses error if GeoJSON is invalid JSON', async () => {
    const invalidJSON = "Invalid JSON";
    const file = new File([invalidJSON], 'invalid.geojson', { type: 'application/geo+json' });
  
    render(
      <BrowserRouter>
        <UploadView />
      </BrowserRouter>
    );
  
    const fileInput = screen.getByLabelText(/klik om een bestand te selecteren/i);
    fireEvent.change(fileInput, { target: { files: [file] } });
  
    await waitFor(() => {
      expect(screen.getByText(/Fout bij het verwerken van het GeoJSON-bestand./i)).toBeInTheDocument();
    });
  });
  
  test('adds valid trees and redirects to map', async () => {
    const mockSetRefresh = jest.fn();
    const mockGeoJSON = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: { type: "Point", coordinates: [5.352692, 50.95306] },
          properties: { tree_id: "Tree A" },
        },
      ],
    };
    const file = new File([JSON.stringify(mockGeoJSON)], 'valid.geojson', { type: 'application/geo+json' });
  
    render(
      <BrowserRouter>
        <UploadView setRefresh={mockSetRefresh} />
      </BrowserRouter>
    );
  
    const fileInput = screen.getByLabelText(/klik om een bestand te selecteren/i);
    fireEvent.change(fileInput, { target: { files: [file] } });
  
    await waitFor(() => {
      expect(data.addTree).toHaveBeenCalledTimes(1);
      expect(window.location.pathname).toBe('/map');
    });
  });
  
  test('handles API error while saving trees', async () => {
    data.addTree.mockImplementationOnce(() => Promise.reject(new Error('API Error')));
  
    const mockGeoJSON = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: { type: "Point", coordinates: [5.352692, 50.95306] },
          properties: { tree_id: "Tree A" },
        },
      ],
    };
    const file = new File([JSON.stringify(mockGeoJSON)], 'valid.geojson', { type: 'application/geo+json' });
  
    render(
      <BrowserRouter>
        <UploadView />
      </BrowserRouter>
    );
  
    const fileInput = screen.getByLabelText(/klik om een bestand te selecteren/i);
    fireEvent.change(fileInput, { target: { files: [file] } });
  
    await waitFor(() => {
      expect(screen.getByText(/Er is een fout opgetreden bij het toevoegen van bomen./i)).toBeInTheDocument();
    });
  });
  
});
