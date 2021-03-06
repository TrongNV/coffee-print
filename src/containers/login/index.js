import React, { Component } from "react";
import styled from "styled-components";
import { reduxForm, Field } from "redux-form";
import { autobind } from "core-decorators";
import { push } from "react-router-redux";
import { connectAutoBindAction } from "utils/redux";
import Button from "reactstrap/lib/Button";
import InputLabel from "components/elements/input-label";
import Clearfix from "components/elements/clearfix";
import Logo from "components/logo";
import { createValidateComponent } from "hoc/redux-form-validate";
import Api from "api/Api";
import { setAuthToken } from "utils/auth";
import { getAuthMe } from "redux/actions/userAction";
import swal from "sweetalert2";

const FInput = createValidateComponent(InputLabel);

const LoginContainer = styled.form`
  width: 500px;
  margin-left: auto;
  margin-right: auto;
  margin-top: 60px;
`;

const Heading = styled.h1`
  margin-top: 25px;
  font-size: 30px;
`;

@reduxForm({
  form: "Login"
})
@connectAutoBindAction(() => ({}), { push, getAuthMe })
@autobind
export default class Login extends Component {
  static propTypes = {};
  onSubmit(values) {
    Api.authLogin({
      username: values.username,
      password: values.password
    }).then(res => {
      if (res.token) {
        setAuthToken(res.token);
        this.props.getAuthMe();
        setTimeout(() => {
          this.props.push("/");
        }, 400);
      } else {
        swal({
          title: "Đăng nhập thất bại",
          type: "error"
        });
      }
    });
  }
  render() {
    return (
      <LoginContainer onSubmit={this.props.handleSubmit(this.onSubmit)}>
        <Logo isCenter />
        <Heading className="text-center">Đăng nhập</Heading>
        <Field name="username" label="Username" component={FInput} />
        <Field
          name="password"
          type="password"
          label="Password"
          component={FInput}
        />
        <Clearfix height={10} />
        <Button block color="primary">Đăng nhập</Button>
      </LoginContainer>
    );
  }
}
