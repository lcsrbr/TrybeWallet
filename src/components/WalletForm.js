import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { fetchAPI, getWalletInfos } from '../redux/actions';

class WalletForm extends Component {
  render() {
    const {
      submitButton,
      handleChange,
      editSendInfo,
      Coins,
      value,
      description,
      currency,
      method,
      tag,
      edit,
    } = this.props;
    // const three = 3;
    return (
      <form className="formDiv border border-3 rounded shadow p-3">
        <label className="form-label" htmlFor="value">
          Valor
          <input
            className="form-control"
            data-testid="value-input"
            type="text"
            name="value"
            id="value"
            value={ value }
            onChange={ handleChange }
          />
        </label>
        <label className="form-label" htmlFor="description">
          Descrição
          <input
            className="form-control"
            data-testid="description-input"
            type="text"
            name="description"
            id="description"
            value={ description }
            onChange={ handleChange }
          />
        </label>
        <label className="form-label" htmlFor="currency">
          Moeda
          <select
            className="form-select"
            data-testid="currency-input"
            name="currency"
            id="currency"
            value={ currency }
            onChange={ handleChange }
          >
            { Coins && Coins.map((coin, index) => (
              <option key={ coin && index }>
                { coin }
              </option>
            ))}
          </select>
        </label>
        <label className="form-label" htmlFor="method">
          Método de pagamento
          <select
            className="form-select"
            data-testid="method-input"
            name="method"
            id="method"
            value={ method }
            onChange={ handleChange }
          >
            <option>Dinheiro </option>
            <option> Cartão de crédito </option>
            <option> Cartão de débito </option>
          </select>
        </label>
        <label className="form-label" htmlFor="tag">
          Tag
          <select
            className="form-select"
            data-testid="tag-input"
            name="tag"
            id="tag"
            value={ tag }
            onChange={ handleChange }
          >
            <option> Alimentação </option>
            <option> Lazer </option>
            <option> Trabalho </option>
            <option> Transporte </option>
            <option> Saúde </option>
          </select>
        </label>
        {!edit && (
          <button
            className="btn btn-success"
            type="button"
            onClick={ () => submitButton() }
          >
            Adicionar despesa
          </button>
        )}
        {edit && (
          <button
            className="btn btn-warning"
            type="button"
            onClick={ () => editSendInfo() }
          >
            Editar despesa
          </button>
        )}
      </form>
    );
  }
}

WalletForm.propTypes = {
  handleChange: PropTypes.func.isRequired,
  editSendInfo: PropTypes.func.isRequired,
  submitButton: PropTypes.func.isRequired,
  Coins: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  currency: PropTypes.string.isRequired,
  method: PropTypes.string.isRequired,
  tag: PropTypes.string.isRequired,
  edit: PropTypes.bool.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  getData: () => dispatch(fetchAPI()),
  sendInfos: (obj) => dispatch(getWalletInfos(obj)),
});

const mapStateToProps = (state) => ({
  Coins: state.wallet.currencies,
  CoinsInfo: state.wallet.currenciesInfos,

});

export default connect(mapStateToProps, mapDispatchToProps)(WalletForm);
