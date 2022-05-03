import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
import {Controller} from './Controller';
import {EventEmitter} from './EventEmitter';
import userEvent from '@testing-library/user-event'

Controller.promptTimeout = 1;
beforeEach(() => {
  Controller.reset();
  EventEmitter.reset();
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

  userEvent.keyboard('{Enter}');
  const choices = document.querySelectorAll('.choices');
  expect(choices.length).toEqual(1);
  const firstChoice = choices.item(0).getElementsByClassName('choice').item(0);
  const secondChoice = choices.item(0).getElementsByClassName('choice').item(1);
  const thirdChoice = choices.item(0).getElementsByClassName('choice').item(2);
  expect(firstChoice.classList.contains('active')).toBeTruthy();
  userEvent.keyboard('{arrowright}');
  expect(!firstChoice.classList.contains('active')).toBeTruthy();
  expect(secondChoice.classList.contains('active')).toBeTruthy();
  userEvent.keyboard('{arrowright}');
  expect(thirdChoice.classList.contains('active')).toBeTruthy();
  expect(!secondChoice.classList.contains('active')).toBeTruthy();
  userEvent.keyboard('{arrowright}');
  expect(firstChoice.classList.contains('active')).toBeTruthy();
  expect(!thirdChoice.classList.contains('active')).toBeTruthy();
  userEvent.keyboard('{arrowleft}');
  expect(thirdChoice.classList.contains('active')).toBeTruthy();
  expect(!firstChoice.classList.contains('active')).toBeTruthy();
});

test('test input question', async () => {
  render(<App />);
  await waitFor(() => {
    screen.getByText(/ENTER/);
  }, {timeout: 50});

  userEvent.keyboard('{Enter}');
  userEvent.keyboard('{Enter}'); // Answer first choice question
  const lineItems = document.querySelectorAll('.lines li');
  expect(lineItems.length).toEqual(7);
  userEvent.keyboard('Test'); // Enter input
  userEvent.keyboard('{Enter}'); // Answer second question
  const lineItems2 = document.querySelectorAll('.lines li');
  expect(lineItems2.length).toEqual(10);
  expect(screen.getByText(/Test/)).toBeInTheDocument();
});


test('test number input question', async () => {
  render(<App />);
  await waitFor(() => {
    screen.getByText(/ENTER/);
  }, {timeout: 50});

  userEvent.keyboard('{Enter}');
  userEvent.keyboard('{Enter}'); // Answer first choice question
  userEvent.keyboard('Test'); // Enter input
  userEvent.keyboard('{Enter}'); // Answer second choice
  userEvent.keyboard('Test2'); // Enter input
  userEvent.keyboard('{Enter}'); // Answer second choice
  userEvent.keyboard('asdfasdf'); // Enter input
  try {
    screen.getByText(/asdfasdf/);
  } catch(err){
    expect(err).toBeDefined();
  }
  userEvent.keyboard('12345'); // Enter input
  userEvent.keyboard('{Enter}'); // Answer second choice
  expect(screen.getByText(/12345/)).toBeInTheDocument();
});
