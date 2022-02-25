import React, { Component } from "react";

import { TailSpin } from "react-loader-spinner";
import { Bars } from "react-loader-spinner";

import {withRouter} from './withRouter'

import { useNavigate ,Link    } from 'react-router-dom'

 class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      pass: "",
      loggedin: false,
      loading: false,
      showpage: true,
    };
  }

  componentDidMount() {
    this.setState({
      showpage: false,
    });
    // var user_email = localStorage.getItem("user_email");
    // if (user_email) {
    //     Router.push("/");
    //     // this.setState({
    //     //     showpage: false
    //     // })
    //     console.log(user_email)
    // } else {
    //     console.log("no user found")
    //     this.setState({
    //         showpage: false
    //     })
    // }
  }

  loginCheck = (e) => {
    e.preventDefault();

    if (this.state.email === "" || this.state.pass === "") {
      this.setState({ message: "Please enter your account details to login." });
    } else if(this.state.email === "dk" && this.state.pass === "9811"){
      localStorage.setItem("user_name", JSON.stringify("Deepak singh"));
      this.props.navigate('/Content'+"?id="+1)
    }

    // if (this.state.email === "" || this.state.pass === "") {
    //   this.setState({ message: "Please enter your account details to login." });
    // } else if (this.state.email !== "" && this.state.pass !== "") {
    //   this.login();
    // }
  };

  login() {
    this.setState({ loading: true });

    fetch(`http://192.168.1.217:1003/api/Login`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Email: this.state.email,
        Password: this.state.pass,
      }),
    })
      .then((result) => {
        result.json().then((resp) => {
          if (resp.response === "Success") {
            localStorage.setItem("libCode", JSON.stringify(resp.data.LibCode));
            localStorage.setItem("user_name", JSON.stringify(resp.data.Name));
            localStorage.setItem("user_email", JSON.stringify(resp.data.Email));
            localStorage.setItem("user_info", JSON.stringify(resp.data));
            if (this.state.remberLogin === true) {
              localStorage.setItem("logged_in",JSON.stringify(true));
            }
            // <Redirect to='/'/>
            // Router.push(`/`);
            this.props.navigate('/Content')
          } else {
            this.setState({
              message: "No data found please check your details.",
              loading: false,
            });
            // this.setState({ message: "Try with other details." });
            console.log(resp.response);
          }
        });
      })

      //CATCHING ERROR FROM FETCH (IF ANY) IN API
      .catch((error) => {
        this.setState({
          message: "Please check your credentials.",
          loading: false,
        });
      });
  }

  render() {
    const { email, pass } = this.state;
    console.log(this.state);
    return (
      <>
       

        {!this.state.showpage ? (
          <div className="bckLog">
            <div className="modal-dialog w-100 mx-auto mb-3 text-center nmc">
              <span style={{ fontSize: "22px" }}>L I B C O N</span>
            </div>

            <div className="form-signin ">
              <form
                type="POST"
                onSubmit={(e) => {
                  this.loginCheck(e);
                }}
              >
                <div className="modal-body">
                  <div className="h5 modal-title text-center">
                    <h4 className="mt-2">
                      <span>Sign In</span>
                    </h4>
                  </div>

                  <div className="position-relative form-group">
                    <label htmlFor="inputEmail" className="sr-only">
                      Email address
                    </label>
                    <input
                      type="text"
                      id="inputEmail"
                      className="form-control valid"
                      placeholder="Email"
                      required=""
                      autoFocus=""
                      autoComplete=""
                      value={email}
                      onChange={(event) =>
                        this.setState({
                          email: event.target.value,
                          message: "",
                        })
                      }
                    />
                  </div>

                  <div className="position-relative form-group">
                    <label htmlFor="inputPassword" className="sr-only mt-5">
                      Password
                    </label>
                    <input
                      type="password"
                      id="inputPassword"
                      className="form-control mt-10"
                      placeholder="Password"
                      required=""
                      value={pass}
                      onChange={(event) =>
                        this.setState({ pass: event.target.value, message: "" })
                      }
                    />
                  </div>

                  <div
                    className="position-relative form-check"
                    style={{ display: "none" }}
                  >
                    <input
                      className="form-check-input"
                      id="remembereee"
                      // name="RememberMe"
                      value={"true"}
                      type="checkbox"
                      checked={this.state.remberLogin ? "checkbox" : null}
                      onChange={() =>
                        this.setState((prevState) => ({
                          remberLogin: !prevState.remberLogin,
                        }))
                      }
                    />
                    <input 
                                name="RememberMe" 
                                type="hidden" 
                                value="false" />
                    <label className="form-check-label" htmlFor="remembereee">
                      Keep me logged in
                    </label>
                  </div>

                  {this.state.message ? (
                    <p className="type_error">{this.state.message}</p>
                  ) : null}
                </div>

                <div className="modal-footer clearfix">
                  <Link to={"/Content"+"?id="+1}>
                  <div className="float-left">
                      <a href="#" className="btn-lg btn btn-link">Recover Password</a>
                  </div>
                  </Link>
                  <div className="float-right">
                    {!this.state.loading ? (
                      <button
                        className="btn btn-primary btn-lg"
                        type="submit"
                        onClick={(e) => {
                          this.loginCheck(e);
                        }}
                      >
                        Login to Dashboard
                      </button>
                    ) : (
                      <div className="loader_in_option2">
                        <TailSpin
                          color="#00BFFF"
                          height={30}
                          width={50}
                          ariaLabel="loading"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </form>
            </div>


            <div className="text-center text-white opacity-8 mt-3">Copyright © Continuum Electroproducts LLP 2022</div>



          </div>
        ) : (
          <div className="loginloader">
            <Bars color="#00BFFF" height={60} width={80} ariaLabel="loading" />
          </div>
        )}
      </>
    );
  }
}


export default withRouter(Login)