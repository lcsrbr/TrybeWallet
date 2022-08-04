import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class Header extends Component {
  render() {
    const { email, total } = this.props;

    const totalArray = total.map((item) => {
      const currency = Object.values(item.exchangeRates !== undefined
        && item.exchangeRates).find((coin) => coin.code === item.currency);
      const { ask } = currency;
      return +(item.value * ask).toFixed(2);
    });

    const soma = total.length !== 0 && totalArray.reduce((sum, i) => sum + i);
    return (
      <div className="HeaderPai shadow-lg">
        <header className="Header">
          <h1 className="fs-1">
            Trybewallet
            <span role="img" aria-label="small pouch">👝</span>
          </h1>
          <p data-testid="email-field" className="fs-4">{email}</p>
        </header>
        <div className="total-field">
          <p className="fs-5">
            Despesa Total (
            <span data-testid="header-currency-field">BRL</span>
            )
          </p>
          <p data-testid="total-field" className="fs-1">
            R$
            { Number(soma).toFixed(2)
          || (0).toFixed(2) }
          </p>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  email: state.user.email,
  total: state.wallet.expenses,
});

Header.propTypes = {
  email: PropTypes.string.isRequired,
  total: PropTypes.string.isRequired,
};

export default connect(mapStateToProps)(Header);
