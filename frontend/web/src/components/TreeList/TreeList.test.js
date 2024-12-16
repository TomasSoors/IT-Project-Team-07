import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TreeList from './TreeList';

describe('TreeList Component', () => {
  const mockOnClose = jest.fn();
  const mockOnRadiusChange = jest.fn();
  const mockOnTreeListSelect = jest.fn();
  const mockOnTreeDetailSelect = jest.fn();

  const treeListMock = [
    { id: 1 },
    { id: 2 },
    { id: 3 },
  ];

  const setup = (props = {}) => {
    const defaultProps = {
      treeList: treeListMock,
      onClose: mockOnClose,
      radius: 200,
      onRadiusChange: mockOnRadiusChange,
      selectedTreeFromList: null,
      onTreeListSelect: mockOnTreeListSelect,
      onTreeDetailSelect: mockOnTreeDetailSelect,
      ...props,
    };

    return render(<TreeList {...defaultProps} />);
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders the component correctly', () => {
    setup();

    expect(screen.getByText(/Bomen in radius: 3/)).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getAllByAltText('boom')).toHaveLength(3);
  });

  test('calls onClose when close button is clicked', () => {
    setup();

    const closeButton = screen.getByRole('button');
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('displays message when treeList is empty', () => {
    setup({ treeList: [] });

    expect(screen.getByText(/Geen bomen in dit gebied/)).toBeInTheDocument();
  });

  test('updates selected tree when a tree is clicked', () => {
    setup();

    const treeItem = screen.getByText(/Boom #1/);
    fireEvent.click(treeItem);

    expect(mockOnTreeListSelect).toHaveBeenCalledWith(1);
  });

  test('deselects tree when the same tree is clicked again', () => {
    setup({ selectedTreeFromList: 1 });

    const treeItem = screen.getByText(/Boom #1/);
    fireEvent.click(treeItem);

    expect(mockOnTreeListSelect).toHaveBeenCalledWith(null);
  });

  test('radius slider triggers onRadiusChange', () => {
    setup();

    const slider = screen.getByRole('slider');
    fireEvent.change(slider, { target: { value: 300 } });

    expect(mockOnRadiusChange).toHaveBeenCalledTimes(1);
  });

  test('applies selected class when a tree is selected', () => {
    setup({ selectedTreeFromList: 1 });

    // eslint-disable-next-line testing-library/no-node-access
    const selectedTree = screen.getByText(/Boom #1/).closest('.tree-object');
    expect(selectedTree).toHaveClass('selected');
  });
});
