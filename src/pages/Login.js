import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { loginUser as loginUserAction } from '../redux/actions';
import walletImg from '../imgs/login-image.png';
// import { createUser } from '../services/userAPI';
// import Loading from './Loading';
// import Loading from '../pages/Loading';

class Login extends Component {
state = {
  email: '',
  password: '',
  changeOfButton: true,
  loading: false,
  redirect: false,
};

    handleChange = ({ target }) => {
      const { name, value } = target;
      this.setState({
        [name]: value,
      }, this.handleEnableButton);
    };

    handleEnableButton = () => {
      const { password, email } = this.state;
      const minCharacters = 6;
      if (password.length >= minCharacters
        && email.includes('@') && email.includes('.com')) {
        this.setState({
          changeOfButton: false,
        });
      } else {
        this.setState({
          changeOfButton: true,
        });
      }
    };

    clickEventButton = () => {
      const { email } = this.state;
      const { loginUser } = this.props;
      loginUser(email);
      this.setState(
        { loading: true, redirect: true },
      );
    }

    render() {
      const { email, changeOfButton, password, loading, redirect } = this.state;
      return (
        <div id="loginPai">
          <img className="login-image" src={ walletImg } alt="wallet" />
          <form
            id="login-page"
            className="mb-3
          border
          bg-success
          text-white
          shadow p-3
          p-3
          rounded"
          >
            <label htmlFor="email" className="form-label">
              <h1 className="fs-4">
                Trybewallet
                <span role="img" aria-label="small pouch">👝</span>
              </h1>
              <span className="fs-5">E-mail</span>
              <input
                name="email"
                className="form-control"
                data-testid="email-input"
                type="text"
                onChange={ this.handleChange }
                value={ email }
              />
            </label>
            <label htmlFor="password" className="form-label">
              <span className="fs-5">Senha</span>
              <input
                name="password"
                className="form-control"
                data-testid="password-input"
                type="text"
                onChange={ this.handleChange }
                value={ password }
              />
            </label>
            <button
              type="button"
              data-testid="login-submit-button"
              disabled={ changeOfButton }
              onClick={ this.clickEventButton }
              name="Entrar"
              className="btn btn-primary"
              value="Entrar"
            >
              Entrar
            </button>
            { loading && <span>Carregando...</span> }
            { redirect && <Redirect to="/carteira" /> }
          </form>
        </div>
      );
    }
}

const mapDispatchToProps = (dispatch) => ({
  loginUser: (email) => (
    dispatch(loginUserAction(email))),
});

Login.propTypes = {
  loginUser: PropTypes.string.isRequired,
};

export default connect(null, mapDispatchToProps)(Login);
