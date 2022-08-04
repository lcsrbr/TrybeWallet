import React from 'react';
import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import { renderWithRouterAndRedux } from './helpers/renderWith';
import App from '../App';
// import { MemoryRouter } from 'react-router-dom';

describe('Teste da pagina de login.',
  () => {
    it('inicia a aplicação na página de login e na rota /.',
      () => {
        const { history } = renderWithRouterAndRedux(<App />);
        const { pathname } = history.location;
        expect(pathname).toBe('/');
        const emailTestId = screen.getByTestId('email-input')
        expect(emailTestId).toBeInTheDocument();
        const passwordTestId = screen.getByTestId('password-input')
        expect(passwordTestId).toBeInTheDocument();
        const button = screen.getByTestId('login-submit-button')
        expect(button).toBeInTheDocument();
        expect(button).toBeDisabled();
    });
    it('o botão só habilita com um e-mail válido e senha de seis dígitos ou mais',
    () => {
        renderWithRouterAndRedux(<App />);
        const emailTestId = screen.getByTestId('email-input')
        const button = screen.getByTestId('login-submit-button');
        const passwordTestId = screen.getByTestId('password-input');
        userEvent.type(emailTestId, 'email@email@.br');
        userEvent.type(passwordTestId, '123456');
        expect(button).toBeDisabled();
    
        userEvent.type(emailTestId, 'email@teste.com');
        userEvent.type(passwordTestId, 'test');
        expect(button).toBeDisabled();
    
        userEvent.type(emailTestId, 'email@teste.com');
        userEvent.type(passwordTestId, '123456');
        expect(button).toBeEnabled();
      });
      it('o acesso é liberado e o e-mail salvo na store.', () => {
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
      });
  });