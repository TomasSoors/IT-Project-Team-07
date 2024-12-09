import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react"; import TreeDetail from "./TreeDetail";

const mockTree = {
    id: 1,
    description: "Een eikenboom.",
    height: 20,
    latitude: 52.379189,
    longitude: 4.899431,
};

describe("TreeDetail Component", () => {
    beforeEach(() => {
        sessionStorage.setItem('token', 'mock-token');
        fetch.resetMocks();
        fetch.mockResponseOnce(JSON.stringify({ ok: true }));
    });
    test("renders without crashing", async () => {
        await act(async () => {
            render(<TreeDetail />);
        });
        expect(screen.getByText(/Selecteer een boom om de details te bekijken./i)).toBeInTheDocument();
    });

    test("displays tree details when a tree is selected", async () => {
        const onDeleteMock = jest.fn();
        const onCloseMock = jest.fn();
        await act(async () => {
            render(<TreeDetail selectedTree={mockTree} onClose={onCloseMock} onDelete={onDeleteMock} />);
        });

        expect(screen.getByText(/Boom #1/i)).toBeInTheDocument();
        expect(screen.getByText(/Een eikenboom./i)).toBeInTheDocument();
        expect(screen.getByText(/20 meter/i)).toBeInTheDocument();
        expect(screen.getByText(/52.379189, 4.899431/i)).toBeInTheDocument();
    });

    test("does not display tree details when no tree is selected", async () => {
        const onDeleteMock = jest.fn();
        const onCloseMock = jest.fn();
        await act(async () => {
            render(<TreeDetail selectedTree={null} onClose={onCloseMock} onDelete={onDeleteMock} />);
        })
        expect(screen.getByText(/Selecteer een boom om de details te bekijken./i)).toBeInTheDocument();
    });

    test("calls the onClose function when the close button is clicked", async () => {
        const onDeleteMock = jest.fn();
        const onCloseMock = jest.fn();
        await act(async () => {
            render(<TreeDetail selectedTree={mockTree} onClose={onCloseMock} onDelete={onDeleteMock} />);
        });

        const closeButton = screen.getByAltText("Close");
        fireEvent.click(closeButton);

        expect(onCloseMock).toHaveBeenCalledTimes(1);
    });

    test("displays the correct image sources", async () => {
        const onDeleteMock = jest.fn();
        const onCloseMock = jest.fn();
        await act(async () => {
            render(<TreeDetail selectedTree={mockTree} onClose={onCloseMock} onDelete={onDeleteMock} />);
        });

        const treeImage = screen.getByAltText("tree");
        const closeButtonImage = screen.getByAltText("Close");

        expect(treeImage).toHaveAttribute("src", "tree-icon.png");
        expect(closeButtonImage).toHaveAttribute("src", "close.png");
    });
    test("calls the onDelete function when delete button is clicked", async () => {
        const onDeleteMock = jest.fn();
        const onCloseMock = jest.fn();
        await act(async () => {
            render(<TreeDetail selectedTree={mockTree} onClose={onCloseMock} onDelete={onDeleteMock} />);
        });

        const deleteButton = screen.getByAltText("Delete");
        fireEvent.click(deleteButton);

        expect(onDeleteMock).toHaveBeenCalledTimes(1);
    });
});
