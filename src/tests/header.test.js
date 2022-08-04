import React from 'react';
import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import { renderWithRouterAndRedux } from './helpers/renderWith';
import App from '../App';
// import { MemoryRouter } from 'react-router-dom';

describe('Teste do /header dentro de /carteira.',
  () => {
      it('o cabecalho possui as informações do e-mail.', () => {
        const { store, history } = renderWithRouterAndRedux(<App />, '/');
        const validEmail = 'email@email.com'
        const emailTestId = screen.getByTestId('email-input')
        const button = screen.getByTestId('login-submit-button');
        const passwordTestId = screen.getByTestId('password-input');
        userEvent.type(emailTestId, validEmail);
        userEvent.type(passwordTestId, '123456');
        expect(button).toBeEnabled();
        userEvent.click(button);
        const { pathname } = history.location;
        expect(pathname).toBe('/carteira');
        expect(store.getState().user.email).toBe(validEmail);
        const emailField = screen.getByTestId('email-field');
        expect(emailField.innerHTML).not.toBe('');
        expect(emailField).toContainHTML(store.getState().user.email);
      });
      it('o cabecalho possui as informações de despesa total.', () => {
        const { history } = renderWithRouterAndRedux(<App />, '/');
        const validEmail = 'email@email.com'
        const emailTestId = screen.getByTestId('email-input')
        const button = screen.getByTestId('login-submit-button');
        const passwordTestId = screen.getByTestId('password-input');
        userEvent.type(emailTestId, validEmail);
        userEvent.type(passwordTestId, '123456');
        expect(button).toBeEnabled();
        userEvent.click(button);
        const { pathname } = history.location;
        expect(pathname).toBe('/carteira');
        const totalField = screen.getByTestId('total-field');
        expect(totalField.innerHTML).toBe('0.00');
      });
      it('o cabecalho possui as informações de moeda BRL.', () => {
        const { history } = renderWithRouterAndRedux(<App />, '/');
        const validEmail = 'email@email.com'
        const emailTestId = screen.getByTestId('email-input')
        const button = screen.getByTestId('login-submit-button');
        const passwordTestId = screen.getByTestId('password-input');
        userEvent.type(emailTestId, validEmail);
        userEvent.type(passwordTestId, '123456');
        expect(button).toBeEnabled();
        userEvent.click(button);
        const { pathname } = history.location;
        expect(pathname).toBe('/carteira');
        const headerCurrencyField = screen.getByTestId('header-currency-field');
        expect(headerCurrencyField.innerHTML).toBe('BRL');
      });
  });