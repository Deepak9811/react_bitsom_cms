import React, { Component } from "react";
import { AiOutlineRocket } from "react-icons/ai";
import { BiDirections, BiImageAdd ,BiDotsVerticalRounded} from "react-icons/bi";
import { HiOutlineUserCircle } from "react-icons/hi";
import {
  MdOutlinePersonAddAlt,
  MdKeyboardArrowDown,
  MdOutlineFeedback,
} from "react-icons/md";
import { Link } from "react-router-dom";
export default class header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showDropdown: false,
      showNav: false,
      className:
        "app-container app-theme-white body-tabs-shadow fixed-sidebar fixed-footer fixed-header",
      showNDHideSideNav: true,
      showBtnInMobile: true,
      crossBtn: true,
      showChngPass: false,
      newPass: "",
      newPassRetype: "",
      clasID: false,
      userName: "BITSoM",
    };
  }

  componentDidMount() {
    let user_name = JSON.parse(localStorage.getItem("user_name"));
    if (user_name) {
      this.setState({
        userName: user_name,
      });
    }
  }

  showDrop() {
    if (this.state.showDropdown === false) {
      this.setState({ showDropdown: true });
    } else {
      this.setState({ showDropdown: false });
    }
  }

  showNdHideNav() {
    if (this.state.showNav === false) {
      this.setState({
        showNav: true,
      });
    } else {
      this.setState({
        showNav: false,
      });
    }
  }

  showSideNave() {
    var cl = "#pddd";
    var element = document.querySelector(cl);

    this.setState((prevState) => ({
      showNDHideSideNav: !prevState.showNDHideSideNav,
    }));

    if (this.state.showNDHideSideNav === true) {
      this.setState({
        className:
          "app-container app-theme-white body-tabs-shadow fixed-sidebar fixed-footer fixed-header closed-sidebar",
        crossBtn: false,
      });
      element.style.paddingLeft = "8%";
    } else {
      this.setState({
        className:
          "app-container app-theme-white body-tabs-shadow fixed-sidebar fixed-footer fixed-header",
        crossBtn: true,
      });
      element.style.padding = "2.3% 3% 5% 23%";
    }
  }

  showSideNaveInMobile() {
    this.setState((prevState) => ({
      showBtnInMobile: !prevState.showBtnInMobile,
    }));
    if (this.state.showBtnInMobile === true) {
      this.setState({
        className:
          "app-container app-theme-white body-tabs-shadow fixed-sidebar fixed-footer fixed-header closed-sidebar-mobile closed-sidebar sidebar-mobile-open",
        crossBtn: false,
      });
    } else {
      this.setState({
        className:
          "app-container app-theme-white body-tabs-shadow fixed-sidebar fixed-footer fixed-header closed-sidebar-mobile closed-sidebar",
        crossBtn: true,
      });
    }
  }

  showPas() {
    if (this.state.showChngPass === false) {
      this.setState({
        showChngPass: true,
      });
    } else {
      this.setState({
        showChngPass: false,
      });
    }
  }

  checkUpdatePass() {
    if (this.state.newPass === "" && this.state.newPassRetype === "") {
      alert("Password should not be blank !!!");
    } else if (this.state.newPass === this.state.newPassRetype) {
      this.updatePass();
    } else if (this.state.newPass !== this.state.newPassRetype) {
      alert("Password not match!!!");
    } else {
      alert("Please enter details correctly.");
    }
  }

  updatePass() {
    const { newPass, newPassRetype } = this.state;
    let user_email = JSON.parse(localStorage.getItem("user_email"));

    fetch(
      `${process.env.REACT_APP_API_kEY}Changepassword?email=${user_email}&password=${newPassRetype}`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "content-type": "application/json",
        },
      }
    )
      .then((result) => {
        result.json().then((resp) => {
          if (resp.response === "Success") {
            this.setState({
              showChngPass: false,
              newPass: "",
              newPassRetype: "",
            });
            setTimeout(() => {
              alert(resp.message);
            }, 500);
          } else {
            alert("Something wents wrong.");
          }
        });
      })
      .catch((error) => {
        alert(error.message);
      });
  }

  logOUt() {
    localStorage.clear();
  }

  render() {
    const { newPass, newPassRetype } = this.state;
    return (
      <>
        <div className={this.state.className}>
          <div className="app-header header-shadow">
            <div className="app-header__logo">
              <div className="logo-src"></div>
              <div className="header__pane ml-auto">
                <div>
                  {this.state.crossBtn ? (
                    <button
                      type="button"
                      className="hamburger close-sidebar-btn hamburger--elastic"
                      onClick={() => this.showSideNave()}
                    >
                      <span className="hamburger-box">
                        <span className="hamburger-inner"></span>
                      </span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="hamburger close-sidebar-btn hamburger--elastic is-active"
                      onClick={() => this.showSideNave()}
                    >
                      <span className="hamburger-box">
                        <span className="hamburger-inner"></span>
                      </span>
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div className="app-header__mobile-menu">
              <div>
                {this.state.crossBtn ? (
                  <button
                    onClick={() => this.showSideNaveInMobile()}
                    type="button"
                    className="hamburger hamburger--elastic mobile-toggle-nav"
                  >
                    <span className="hamburger-box">
                      <span className="hamburger-inner"></span>
                    </span>
                  </button>
                ) : (
                  <button
                    type="button"
                    className="hamburger hamburger--elastic mobile-toggle-nav is-active"
                    onClick={() => this.showSideNaveInMobile()}
                  >
                    <span className="hamburger-box">
                      <span className="hamburger-inner"></span>
                    </span>
                  </button>
                )}
              </div>
            </div>
            <div className="app-header__menu">
              <span>
                <button
                onClick={() => this.showDrop()}
                  type="button"
                  className="btn-icon btn-icon-only btn btn-primary btn-sm mobile-toggle-header-nav"
                >
                  <span className="btn-icon-wrapper">
                    <BiDotsVerticalRounded size={22}/>
                  </span>
                </button>
              </span>
            </div>
            <div className="app-header__content">
              <div className="app-header-left">
                <div className="search-wrapper">
                  <img
                    src={require("../image/CLBITSOM.png")}
                    alt="logo"
                    width={45}
                    height={45}
                  />
                </div>
              </div>

              <div className="app-header-right">
                <div className="header-btn-lg pr-0">
                  <div className="widget-content p-0">
                    <div className="widget-content-wrapper">
                      <div className="widget-content-left  ml-3 header-user-info">
                        <div className="btn-group">
                          <Link to={"#"} className="p-0 btn">
                            <div onClick={() => this.showDrop()}>
                              <div className="widget-heading">
                                {this.state.userName}
                                <MdKeyboardArrowDown
                                  style={{
                                    height: "5%",
                                    width: "20px",
                                  }}
                                />
                              </div>
                              <div className="widget-subheading">
                                Library User
                              </div>
                            </div>
                          </Link>

                          <div
                            style={{
                              display: this.state.showDropdown
                                ? "block"
                                : "none",
                            }}
                            className="dropdown-menu dropdown-menu-right"
                          >
                            <span
                              onClick={() => this.showPas()}
                              className="dropdown-item"
                            >
                              <HiOutlineUserCircle />
                              &nbsp;Change Password
                            </span>

                            <form action="/Account/Logout" method="post">
                              <Link
                                to="/login"
                                onClick={() => this.logOUt()}
                                className="dropdown-item"
                              >
                                <MdKeyboardArrowDown />
                                &nbsp;Logout
                              </Link>
                            </form>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="app-main">
            <div className="app-sidebar sidebar-shadow  ps ps--active-y">
              <div className="app-header__logo">
                <div className="logo-src"></div>
                <div className="header__pane ml-auto">
                  <div>
                    <button
                      type="button"
                      className="hamburger close-sidebar-btn hamburger--elastic"
                    >
                      <span className="hamburger-box">
                        <span className="hamburger-inner"></span>
                      </span>
                    </button>
                  </div>
                </div>
              </div>
              <div className="app-header__mobile-menu">
                <div>
                  <button
                    type="button"
                    className="hamburger hamburger--elastic mobile-toggle-nav"
                  >
                    <span className="hamburger-box">
                      <span className="hamburger-inner"></span>
                    </span>
                  </button>
                </div>
              </div>
              <div className="app-header__menu">
                <span>
                  <button
                    type="button"
                    className="btn-icon btn-icon-only btn btn-primary btn-sm mobile-toggle-header-nav"
                  >
                    <span className="btn-icon-wrapper">
                      <i className="fa fa-ellipsis-v fa-w-6"></i>
                    </span>
                  </button>
                </span>
              </div>
              <div className="scrollbar-sidebar">
                <div className="app-sidebar__inner">
                  <ul className="vertical-nav-menu">
                    <li className="app-sidebar__heading">Dashboards</li>
                    <li>
                      <Link to={"/"}>
                        <>
                          <AiOutlineRocket className="svgicon" />
                        </>
                        Dashboard
                      </Link>
                    </li>
                    <li className="app-sidebar__heading">Masters</li>
                    <li>
                      <Link to={"/contents"}>
                        <BiDirections className="svgicon" />
                        Contents
                      </Link>
                    </li>
                    <li>
                      <Link to={"/content"}>
                        <MdOutlinePersonAddAlt className="svgicon" />
                        Add Content
                      </Link>
                    </li>
                    <li>
                      <Link to={"/events"}>
                        <BiDirections className="svgicon" />
                        Events
                      </Link>
                    </li>
                    <li>
                      <Link to={"/event"}>
                        <MdOutlinePersonAddAlt className="svgicon" />
                        Add Event
                      </Link>
                    </li>

                    <li>
                      <Link to={"/feedback"}>
                        <MdOutlineFeedback className="svgicon" />
                        Add Feedback
                      </Link>
                    </li>

                    <li>
                      <Link to={"/feedback/questions"}>
                        <MdOutlineFeedback className="svgicon" />
                        Show Feedback
                      </Link>
                    </li>

                    <li>
                      <Link to={"/addImage"}>
                        <BiImageAdd className="svgicon" />
                        Add Image
                      </Link>
                    </li>

                    <li>
                      <Link to={"/NewsAndNotices"}>
                        <BiImageAdd className="svgicon" />
                       News And Notices
                      </Link>
                    </li>


                    <li>
                      <Link to={"/NewsAndNotice"}>
                        <BiImageAdd className="svgicon" />
                       Add News And Notices
                      </Link>
                    </li>

                   
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* -----------------------DROPDOWN------------------------------------------- */}

        {this.state.showChngPass ? (
          <>
            <div
              onClick={() => this.showPas()}
              className="modal-backdrop fade show"
            ></div>

            <div
              className="modal fade bd-ChangePassword show"
              style={{ display: "block" }}
            >
              <div className="modal-dialog " style={{ background: "#fff" }}>
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLongTitle">
                      Change Password
                    </h5>
                    <button
                      type="button"
                      className="close"
                      onClick={() => this.showPas()}
                    >
                      <span aria-hidden="true">×</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    <p>Enter new password and click on Submit button.</p>
                    <div className="form-row">
                      <div className="col-md-6 mb-3">
                        <label>New Password</label>

                        <input
                          type="password"
                          maxLength="50"
                          className="form-control"
                          placeholder="New Password"
                          required=""
                          autoFocus=""
                          autoComplete="off"
                          value={newPass}
                          onChange={(event) =>
                            this.setState({
                              newPass: event.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label>Retype Password</label>
                        <input
                          id="txtRetypePassword"
                          maxLength="50"
                          type="password"
                          autoComplete="off"
                          className="form-control"
                          placeholder="Retype Password"
                          value={newPassRetype}
                          onChange={(event) =>
                            this.setState({
                              newPassRetype: event.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button
                        onClick={() => this.showPas()}
                        className="btn btn-secondary"
                      >
                        Close
                      </button>
                      <button
                        onClick={() => this.checkUpdatePass()}
                        className="btn btn-primary"
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </>
    );
  }
}
