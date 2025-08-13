import styled, { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    background-color: #111;
    color: #fff;
    font-family: 'Segoe UI', sans-serif;
    display: flex;
    justify-content: center;
    padding: 2rem;
  }

  /* Ensure drag and drop works properly */
  * {
    box-sizing: border-box;
  }

  /* Fix for react-beautiful-dnd in React 18 */
  [data-rbd-droppable-id] {
    min-height: 50px;
  }

  [data-rbd-draggable-id] {
    touch-action: none;
  }
`;

export const NeonButton = styled.button`
  background: transparent;
  border: 2px solid violet;
  color: violet;
  padding: 0.5rem 1rem;
  margin: 0.25rem;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.3s ease;

  &:hover {
    box-shadow: 0 0 10px violet, 0 0 20px violet;
    background-color: rgba(238, 130, 238, 0.1);
  }
`;

export const Input = styled.input`
  padding: 0.5rem;
  border-radius: 6px;
  border: 1px solid violet;
  background-color: #222;
  color: white;
  margin-right: 1rem;
`;
