import React from 'react';
import userEvent from '@testing-library/user-event';
import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import { renderWithRouterAndRedux } from './helpers/renderWith';
import mockData from './helpers/mockData'
import App from '../App';
import Wallet from '../pages/Wallet';
// import { MemoryRouter } from 'react-router-dom';

const api = Promise.resolve({
    json: () => Promise.resolve(mockData),
    ok: true,
  });
  const mockAPI = jest.spyOn(global, 'fetch').mockImplementation(() => api);
  afterEach(() => jest.clearAllMocks());

describe('Teste do /walletForm dentro de /carteira.',
  () => {
      it('os campos de preenchimento estão em tela e iniciam vazios', () => {
        renderWithRouterAndRedux(<Wallet />, '/carteira');;
        const valueTestId = screen.getByTestId('value-input')
        const descriptionTestId = screen.getByTestId('description-input')
        const currencyTestId = screen.getByTestId('currency-input')
        const methodTestId = screen.getByTestId('method-input')
        const tagTestId = screen.getByTestId('tag-input')
        expect(valueTestId).toBeInTheDocument();
        expect(valueTestId.innerHTML).toBe('');
        expect(descriptionTestId).toBeInTheDocument();
        expect(descriptionTestId.innerHTML).toBe('');
        expect(currencyTestId).toBeInTheDocument();
        expect(methodTestId).toBeInTheDocument();
        const dinheiro = screen.getByRole('option', { name: "Dinheiro" });
        expect(dinheiro).toBeInTheDocument();
        expect(tagTestId).toBeInTheDocument();
        const alimentacao = screen.getByRole('option', { name: "Alimentação" });
        expect(alimentacao).toBeInTheDocument();
      });

      it('Um campo para selecionar em qual moeda será registrada a despesa', async () => {
        renderWithRouterAndRedux(<Wallet />, '/carteira');
        const moeda = await screen.findByRole('combobox', {
          name: /moeda/i,
        });
        const moedas = within(moeda).getAllByRole('option');
        const moedasMap = moedas.map((moeda) => moeda.value);
        const moedasEsperadas = [
          'USD', 'CAD', 'EUR', 'GBP', 'ARS', 'BTC', 'LTC',
          'JPY', 'CHF', 'AUD', 'CNY', 'ILS', 'ETH', 'XRP', 'DOGE',
        ];
        expect(moedasMap).toEqual(moedasEsperadas);
        expect(mockAPI).toBeCalled();
        expect(mockAPI).toBeCalledWith('https://economia.awesomeapi.com.br/json/all');
        expect(moeda).toBeInTheDocument();
      });
      it('os campos são preenchidos e salvos na store.', async () => {
        const { store } = renderWithRouterAndRedux(<Wallet />, '/carteira');
        const valueTestId = screen.getByTestId('value-input')
        const descriptionTestId = screen.getByTestId('description-input')
        const currencyTestId = await screen.getByTestId('currency-input')
        const methodTestId = screen.getByTestId('method-input')
        const tagTestId = screen.getByTestId('tag-input')
        const totalField = screen.getByTestId('total-field');
        const button = await screen.findByRole('button', {
            name: /adicionar despesa/i,
        });
        userEvent.type(valueTestId, '10');
        userEvent.type(descriptionTestId, 'dez dols');
        userEvent.selectOptions(currencyTestId, 'USD');
        userEvent.selectOptions(methodTestId, 'Cartão de débito');
        userEvent.selectOptions(tagTestId, 'Trabalho');
        userEvent.click(button);
        expect(totalField).toContainHTML('47.53');
        userEvent.type(valueTestId, '20');
        userEvent.type(descriptionTestId, 'vinte euros');
        userEvent.selectOptions(currencyTestId, 'EUR');
        userEvent.selectOptions(methodTestId, 'Cartão de crédito');
        userEvent.selectOptions(tagTestId, 'Lazer');
        userEvent.click(button);
        expect(totalField).toContainHTML('150.07');
        await waitFor(() => {
            expect(mockAPI).toBeCalledTimes(3);
          });
          const stateEsperado = [
            {
                id: 0,
                value: '10',
                currency: 'USD',
                method: 'Cartão de débito',
                tag: 'Trabalho',
                description: 'dez dols',
                exchangeRates: mockData,
              },
              {
                id: 1,
                value: '20',
                currency: 'EUR',
                method: 'Cartão de crédito',
                tag: 'Lazer',
                description: 'vinte euros',
                exchangeRates: mockData,
              },
          ];
          expect(store.getState().wallet.expenses).toStrictEqual(stateEsperado);
      });
      it('o botão de remover remove a conta e altera a informação na store.', async () => {
        const { store } = renderWithRouterAndRedux(<Wallet />, '/carteira');
        const valueTestId = screen.getByTestId('value-input')
        const descriptionTestId = screen.getByTestId('description-input')
        const currencyTestId = await screen.getByTestId('currency-input')
        const methodTestId = screen.getByTestId('method-input')
        const tagTestId = screen.getByTestId('tag-input')
        const totalField = screen.getByTestId('total-field');
        const button = await screen.findByRole('button', {
            name: /adicionar despesa/i,
        });
        userEvent.type(valueTestId, '10');
        userEvent.type(descriptionTestId, 'dez dols');
        userEvent.selectOptions(currencyTestId, 'USD');
        userEvent.selectOptions(methodTestId, 'Cartão de débito');
        userEvent.selectOptions(tagTestId, 'Trabalho');
        userEvent.click(button);
        expect(totalField).toContainHTML('47.53');
        userEvent.type(valueTestId, '20');
        userEvent.type(descriptionTestId, 'vinte euros');
        userEvent.selectOptions(currencyTestId, 'EUR');
        userEvent.selectOptions(methodTestId, 'Cartão de crédito');
        userEvent.selectOptions(tagTestId, 'Lazer');
        userEvent.click(button);
        expect(totalField).toContainHTML('150.07');
        const removes = screen.getAllByTestId('delete-btn')
        userEvent.click(removes[0])
        await waitFor(() => {
            expect(mockAPI).toBeCalledTimes(3);
          });
          const stateEsperado = [        
              {
                id: 1,
                value: '20',
                currency: 'EUR',
                method: 'Cartão de crédito',
                tag: 'Lazer',
                description: 'vinte euros',
                exchangeRates: mockData,
              },
          ];
          expect(store.getState().wallet.expenses).toStrictEqual(stateEsperado);
      });
      it('o botão de editar edita a conta e altera a informação na store.', async () => {
        const { store } = renderWithRouterAndRedux(<Wallet />, '/carteira');
        const valueTestId = screen.getByTestId('value-input')
        const descriptionTestId = screen.getByTestId('description-input')
        const currencyTestId = await screen.getByTestId('currency-input')
        const methodTestId = screen.getByTestId('method-input')
        const tagTestId = screen.getByTestId('tag-input')
        const totalField = screen.getByTestId('total-field');
        const button = await screen.findByRole('button', {
            name: /adicionar despesa/i,
        });
        userEvent.type(valueTestId, '10');
        userEvent.type(descriptionTestId, 'dez dols');
        userEvent.selectOptions(currencyTestId, 'USD');
        userEvent.selectOptions(methodTestId, 'Cartão de débito');
        userEvent.selectOptions(tagTestId, 'Trabalho');
        userEvent.click(button);
        expect(totalField).toContainHTML('47.53');
        userEvent.type(valueTestId, '20');
        userEvent.type(descriptionTestId, 'vinte euros');
        userEvent.selectOptions(currencyTestId, 'EUR');
        userEvent.selectOptions(methodTestId, 'Cartão de crédito');
        userEvent.selectOptions(tagTestId, 'Lazer');
        userEvent.click(button);
        expect(totalField).toContainHTML('150.07');
        const edits = screen.getAllByTestId('edit-btn')
        const stateEsperado = [
            {
                id: 0,
                value: '10',
                currency: 'USD',
                method: 'Cartão de débito',
                tag: 'Trabalho',
                description: 'dez dols',
                exchangeRates: mockData,
              },
              {
                id: 1,
                value: '20',
                currency: 'EUR',
                method: 'Cartão de crédito',
                tag: 'Lazer',
                description: 'vinte euros',
                exchangeRates: mockData,
              },
          ];
        userEvent.click(edits[0])
        const editButton = await screen.findByRole('button', {
            name: /editar despesa/i,
        });
        userEvent.type(valueTestId, '20');
        userEvent.type(descriptionTestId, 'vinte dols');
        userEvent.selectOptions(currencyTestId, 'USD');
        userEvent.selectOptions(methodTestId, 'Cartão de crédito');
        userEvent.selectOptions(tagTestId, 'Lazer');
        userEvent.click(editButton);
        const stateEditadoEsperado = [
            {
                id: 0,
                value: '20',
                currency: 'USD',
                method: 'Cartão de crédito',
                tag: 'Lazer',
                description: 'vinte dols',
                exchangeRates: mockData,
              },
              {
                id: 1,
                value: '20',
                currency: 'EUR',
                method: 'Cartão de crédito',
                tag: 'Lazer',
                description: 'vinte euros',
                exchangeRates: mockData,
              },
          ];
        await waitFor(() => {
            expect(mockAPI).toBeCalledTimes(4);
          });

          expect(store.getState().wallet.expenses).toStrictEqual(stateEditadoEsperado);
      });
  });