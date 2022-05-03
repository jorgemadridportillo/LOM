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
  userEvent.keyboard('{Enter}'); // Answer second question
  userEvent.keyboard('Test2'); // Enter input
  userEvent.keyboard('{Enter}'); // Answer third question
  userEvent.keyboard('asdfasdf'); // Enter input
  try {
    screen.getByText(/asdfasdf/);
  } catch(err){
    expect(err).toBeDefined();
  }
  userEvent.keyboard('12345'); // Enter input
  userEvent.keyboard('{Enter}'); // Answer fourth question
  expect(screen.getByText(/12345/)).toBeInTheDocument();
});


test('test the questionaire can be completed wrongly', async () => {
  render(<App />);
  await waitFor(() => {
    screen.getByText(/ENTER/);
  }, {timeout: 50});

  userEvent.keyboard('{Enter}');
  userEvent.keyboard('{Enter}'); // Answer first choice question
  userEvent.keyboard('{Enter}'); // Answer second question
  userEvent.keyboard('{Enter}'); // Answer third question
  userEvent.keyboard('{Enter}'); // Answer fourth question
  userEvent.keyboard('{Enter}'); // Answer fifth question
  userEvent.keyboard('{Enter}'); // Answer sixth question
  userEvent.keyboard('{Enter}'); // Answer seventh question
  userEvent.keyboard('{Enter}'); // Answer eighth question
  userEvent.keyboard('{Enter}'); // Answer ninth question
  userEvent.keyboard('{Enter}'); // Answer tenth question
  expect(screen.getByText(/your weak human intelligence/)).toBeInTheDocument();
  expect(screen.getByText(/You got 1 questions correct/)).toBeInTheDocument();
});

test('test the questionaire can be completed correctly', async () => {
  render(<App />);
  await waitFor(() => {
    screen.getByText(/ENTER/);
  }, {timeout: 50});

  userEvent.keyboard('{Enter}');
  userEvent.keyboard('{arrowright}');
  userEvent.keyboard('{Enter}'); // Answer first choice question
  userEvent.keyboard('Magellan'); // Enter input
  userEvent.keyboard('{Enter}'); // Answer second question
  userEvent.keyboard('Elvis'); // Enter input
  userEvent.keyboard('{Enter}'); // Answer third question
  userEvent.keyboard('110'); // Enter input
  userEvent.keyboard('{Enter}'); // Answer fourth question
  userEvent.keyboard('{Enter}'); // Answer fifth question
  userEvent.keyboard('21'); // Enter input
  userEvent.keyboard('{Enter}'); // Answer sixth question
  userEvent.keyboard('Terminator'); // Enter input
  userEvent.keyboard('{Enter}'); // Answer seventh question
  userEvent.keyboard('2.718'); // Enter input
  userEvent.keyboard('{Enter}'); // Answer eighth question
  userEvent.keyboard('{arrowright}');
  userEvent.keyboard('{arrowright}');
  userEvent.keyboard('{Enter}'); // Answer ninth question
  userEvent.keyboard('6'); // Enter input
  userEvent.keyboard('{Enter}'); // Answer tenth question
  expect(screen.getByText(/humanity might be saved for this time/)).toBeInTheDocument();
  expect(screen.getByText(/You got 10 questions correct/)).toBeInTheDocument();
});
