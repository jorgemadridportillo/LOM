import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
import {Controller} from './Controller';
import userEvent from '@testing-library/user-event'

Controller.promptTimeout = 1;
beforeEach(() => {
  Controller.reset();
});

test('renders the terminal ul', () => {
  render(<App />);
  const ul = document.getElementsByClassName('lines');
  expect(ul).toBeDefined();
  expect(ul.length).toEqual(1);
});

test('renders the terminal intro', async () => {
  render(<App />);
  await waitFor(() => {
    expect(screen.getByText(/ENTER/)).toBeInTheDocument();
  }, {timeout: 50});
});

test('renders the first question', async () => {
  render(<App />);
  await waitFor(() => {
    screen.getByText(/ENTER/);
  }, {timeout: 50});

  userEvent.keyboard('{Enter}');
  const lineItems = document.querySelectorAll('.lines li');
  expect(lineItems).toBeDefined();
  expect(lineItems.length).toEqual(4);
});

test('navigate through a choice', async () => {
  render(<App />);
  await waitFor(() => {
    screen.getByText(/ENTER/);
  }, {timeout: 50});

  console.log(Controller);

  userEvent.keyboard('{Enter}');
  userEvent.keyboard('{arrowright}');
});