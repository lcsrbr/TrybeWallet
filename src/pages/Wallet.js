import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Header from '../components/Header';
import Table from '../components/Table';
import WalletForm from '../components/WalletForm';
import { fetchAPI, getWalletInfos } from '../redux/actions';
import travolta from '../imgs/john-travolta-wallet.gif';

const alimentacao = 'Alimentação';

class Wallet extends React.Component {
    state= {
      edit: false,
      id: 0,
      value: '',
      description: '',
      currency: 'USD',
      method: 'Dinheiro',
      tag: alimentacao,
      finances: [],
    }

    componentDidMount() {
      const { getData } = this.props;
      getData();
    }

  handleChange = ({ target }) => {
    const { name, value } = target;
    this.setState({ [name]: value });
  }

  editButton = (id) => {
    this.setState({ edit: true, id });
  }

  removeButton = (id) => {
    const { accountsInfos, sendInfos } = this.props;
    const teste = accountsInfos.filter((item) => item.id !== id);
    sendInfos(teste);
    this.setState({ finances: teste });
  }

  editSendInfo = () => {
    this.setState({ edit: false });
    const { sendInfos, CoinsInfo, getData, accountsInfos } = this.props;
    getData();
    const { id, value, description, currency, method, tag } = this.state;
    const object = { id,
      value,
      description,
      currency,
      method,
      tag,
      exchangeRates: CoinsInfo };
    const filtered = accountsInfos.filter((item) => item.id !== id);
    const obj = [
      ...filtered,
      object];
    const fill = obj.sort((a, b) => a.id - b.id);
    this.setState(() => (
      sendInfos(fill) && {
        finances: fill,
        value: '',
        description: '',
        currency: 'USD',
        method: 'Dinheiro',
        tag: 'Alimentação',
      }));
  }

  submitButton = () => {
    const { sendInfos, getData, CoinsInfo } = this.props;
    getData();
    const { value, description, currency, method, tag, finances } = this.state;
    const object = { id: finances.length,
      value,
      description,
      currency,
      method,
      tag,
      exchangeRates: CoinsInfo };
    this.setState((previous) => (
      sendInfos([
        ...previous.finances,
        object]) && {
        finances: [
          ...previous.finances,
          object,
        ],
        value: '',
        description: '',
        currency: 'USD',
        method: 'Dinheiro',
        tag: alimentacao,
      }));
  }

  render() {
    const { accountsInfos } = this.props;
    const { edit, value, description, currency, method, tag, finances } = this.state;

    return (
      <div className="wallet">
        <Header />
        <WalletForm
          value={ value }
          description={ description }
          currency={ currency }
          method={ method }
          tag={ tag }
          finances={ finances }
          edit={ edit }
          handleChange={ this.handleChange }
          submitButton={ this.submitButton }
          editSendInfo={ this.editSendInfo }
        />
        <br />
        <table className="walletTable">
          { finances.length === 0 && (
            <div className="noFunds">
              <img
                className="travolta
              shadow-sm"
                src={ travolta }
                alt="John Travolta Broke"
              />
            </div>
          )}
          {finances.length > 0 && <Table />}
          { accountsInfos.map((account) => {
            const current = Object.values(account.exchangeRates !== undefined
              && account.exchangeRates).find((coin) => coin.code === account.currency);
            return (
              <tbody className="shadow-sm" key={ account.id }>
                <tr>
                  <td>{ account.description }</td>
                  <td>{ account.tag }</td>
                  <td>{ account.method }</td>
                  <td>
                    { Number(account.value).toFixed(2) }
                  </td>
                  <td>
                    { current.name }
                  </td>
                  <td>
                    { (Math.round(current.ask * 100) / 100).toFixed(2)}
                  </td>
                  <td>
                    { +(((account.value) * (current.ask))).toFixed(2) }
                  </td>
                  <td> Real </td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-danger"
                      data-testid="delete-btn"
                      onClick={ () => this.removeButton(account.id) }
                    >
                      Remover
                    </button>
                    <span>
                      {'     '}
                    </span>
                    <button
                      type="button"
                      className="btn btn-warning"
                      data-testid="edit-btn"
                      onClick={ () => this.editButton(account.id) }
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              </tbody>

            );
          })}
        </table>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({

  CoinsInfo: state.wallet.currenciesInfos,
  accountsInfos: state.wallet.expenses,
  Coins: state.wallet.currencies,
});

const mapDispatchToProps = (dispatch) => ({
  getData: () => dispatch(fetchAPI()),
  sendInfos: (obj) => dispatch(getWalletInfos(obj)),
});

Wallet.propTypes = {
  accountsInfos: PropTypes.string.isRequired,
  sendInfos: PropTypes.func.isRequired,
  CoinsInfo: PropTypes.func.isRequired,
  getData: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Wallet);
