import React, { useEffect } from 'react';
import { Form, Formik, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Form as BsForm } from 'react-bootstrap';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import * as authServices from '../../features/auth';
import { addBodyClass, removeBodyClass } from '../../utils';

const Signin = () => {
  const history = useHistory();
  const { url } = useRouteMatch();
  const dispatch = useDispatch();
  const authSchema = Yup.object().shape({
    username: Yup.string().required('Username is required!!'),
    password: Yup.string().required('Password is required!!'),
  });

  const onSubmit = async (values, props) => {
    const { username, password } = values;

    dispatch(authServices.login({ username, password }, history));

    props.resetForm();
  };

  // Set body class
  useEffect(() => {
    if (url === '/signin') {
      removeBodyClass('sidebar-mini');
      removeBodyClass('layout-fixed');

      addBodyClass('login-page');
    }
  }, []);

  return (
    <Formik
      initialValues={{
        username: '',
        password: ''
      }}
      validationSchema={authSchema}
      onSubmit={onSubmit}
    >
      {(formik) => {
        return (
          <div className="login-box">
            <div className="login-logo">
              <a href="../../index2.html"><b>Covid19 Bed</b>MS</a>
            </div>

            {/* /.login-logo */}
            <div className="card">
              <div className="card-body login-card-body">
                <p className="login-box-msg">ลงชื่อเข้าใช้งานระบบ (ผู้ใช้ HOSxP)</p>

                <Form>
                  <div className="input-group mb-3">
                    <BsForm.Control
                      type="text"
                      name="username"
                      value={formik.values.username}
                      onChange={formik.handleChange}
                      className="form-control"
                      placeholder="Username"
                      isInvalid={formik.errors.username && formik.touched.username}
                    />
                    <div className="input-group-append">
                      <div className="input-group-text">
                        <span className="fas fa-user"></span>
                      </div>
                    </div>
                    <ErrorMessage
                      name="username"
                      render={msg => <span className="invalid-feedback">{msg}</span>}
                    />
                  </div>
                  <div className="input-group mb-3">
                    <BsForm.Control
                      type="password"
                      name="password"
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      className="form-control"
                      placeholder="Password"
                      isInvalid={formik.errors.password && formik.touched.password}
                    />
                    <div className="input-group-append">
                      <div className="input-group-text">
                        <span className="fas fa-lock"></span>
                      </div>
                    </div>
                    <ErrorMessage
                      name="password"
                      render={msg => <span className="invalid-feedback">{msg}</span>}
                    />
                  </div>
                  <div className="row">
                    <div className="col-8">
                      <div className="icheck-primary">
                        <input type="checkbox" id="remember" />
                        <label htmlFor="remember">
                          จำข้อมูลล็อกอิน
                        </label>
                      </div>
                    </div>
                    <div className="col-4">
                      <button type="submit" className="btn btn-primary btn-block">ล็อกอิน</button>
                    </div>
                  </div>
                </Form>

                {/* /.social-auth-links */}
                {/* <div className="social-auth-links text-center mb-3">
                  <p>- OR -</p>
                  <a href="#" className="btn btn-block btn-primary">
                    <i className="fab fa-facebook mr-2"></i> Sign in using Facebook
                  </a>
                  <a href="#" className="btn btn-block btn-danger">
                    <i className="fab fa-google-plus mr-2"></i> Sign in using Google+
                  </a>
                </div> */}

                {/* <p className="mb-1">
                  <a href="forgot-password.html">I forgot my password</a>
                </p>
                <p className="mb-0">
                  <a href="register.html" className="text-center">Register a new membership</a>
                </p> */}
              </div>
            </div>
          </div>
        );
      }}
    </Formik>
  );
};

export default Signin;
