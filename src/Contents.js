import React, { Component } from "react";
import { FaClipboardList } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import { AiOutlineDown, AiOutlineUp } from "react-icons/ai";

import { MdPreview } from "react-icons/md";
import { BiShowAlt } from "react-icons/bi";
import { TailSpin } from "react-loader-spinner";
import { Link } from "react-router-dom";
import Header from "./common/header";
import { Helmet } from "react-helmet";
export default class showcontent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      contentData: [],
      loading: true,
      hideTable: false,
      bigLoader: false,
      showChngPreview: false,
      imgdata: "",
      showUpDateDataBtn: false,
      updateLoader: false,
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    const libconCode = JSON.parse(localStorage.getItem("libCode"));
    // console.log("libconCode :- ", libconCode);

    this.getContent();

    this.setState({
      libconCode: libconCode,
    });
  }

  getContent() {
    const libconCode = JSON.parse(localStorage.getItem("libCode"));
    console.log("libconCode :- ", libconCode);
    let url = `${process.env.REACT_APP_API_kEY}showcontent?libid=${libconCode}&id=0`;

    fetch(url, {
      method: "GET",
      headers: {
        Accepts: "application/json",
        "content-type": "application/json",
      },
    })
      .then((result) => {
        result.json().then((resp) => {
          // console.log(resp);
          if (resp.response === "Success") {
            this.setState({
              contentData: resp.data,
              loading: false,
              hideTable: false,
            });
          } else {
            this.setState({
              loading: false,
              messageShow: "No data found",
              hideTable: true,
            });
          }
        });
      })
      .catch((error) => {
        this.setState({
          loading: false,
          messageShow: "Something went wrong. Please try again.",
          hideTable: true,
        });
      });
  }

  showPreview(item) {
    // console.log(item.contentId,)
    let id = item.contentId;
    // console.log(this.state.contentData)
    if (this.state.showChngPreview === false) {
      this.setState({
        showChngPreview: true,
        hideImageType: true,
        loadingdata: false,
      });
    } else {
      this.setState({
        showChngPreview: false,
        hideImageType: true,
        loadingdata: false,
      });
    }
    // console.log(this.state.showChngPreview)
    const libconCode = JSON.parse(localStorage.getItem("libCode"));

    fetch(
      `${process.env.REACT_APP_API_kEY}showcontent?libid=${libconCode}&id=${id}`,
      {
        method: "GET",
        headers: {
          Accepts: "application/json",
          "content-type": "application/json",
        },
      }
    )
      .then((result) => {
        result.json().then((resp) => {
          // console.log(resp);
          if (resp.response === "Success") {
            const html = resp.data[0].text;
            this.setState({
              htmlData: html,
              loadingdata: true,
            });

            if (resp.data[0].imageType === "") {
              this.setState({
                hideImageType: true,
              });
            } else {
              this.setState({
                imgdata: resp.data[0].imageType,
                hideImageType: false,
              });
            }
          } else {
            this.setState({
              hideImageType: true,
              loadingdata: true,
              hidePopData: true,
              messageShow: "No data found",
            });
          }
        });
      })
      .catch((error) => {
        this.setState({
          hideImageType: true,
          loadingdata: true,
          hidePopData: true,
          messageShow: "Something went wrong. Please try again.",
        });
      });
  }

  hidePreview() {
    if (this.state.showChngPreview === false) {
      this.setState({
        showChngPreview: true,
      });
    } else {
      this.setState({
        showChngPreview: false,
      });
    }
  }

  deleteContent(item) {
    if (window.confirm("Are you sure you want to delete this content?")) {
      this.setState({
        bigLoader: true,
      });
      // console.log(item);
      let id = item.contentId;
      let url = `${process.env.REACT_APP_API_kEY}Delete?id=${id}&type=content`;

      fetch(url, {
        method: "POST",
        headers: {
          Accepts: "application/json",
          "content-type": "application/json",
        },
      })
        .then((result) => {
          result.json().then((resp) => {
            // console.log(resp);
            if (resp.response === "Success") {
              this.setState({
                bigLoader: false,
              });
              this.getContent();
            } else {
              this.setState({
                bigLoader: false,
              });
              alert("Something went wrong. Please try again.");
            }
          });
        })
        .catch((error) => {
          alert("Something went wrong.");
          this.setState({
            bigLoader: false,
          });
        });
    }
  }

  upData(item, index) {
    var check = this.state.contentData.findIndex(
      (el) => el.contentId === item.contentId
    );
    if (check !== 0) {
      const addDown = [...this.state.contentData];

      addDown[index].SortOrder = check - 1;
      addDown[index - 1].SortOrder = check;

      this.setState({
        contentData: addDown,
      });

      var tmp = this.state.contentData[check];
      this.state.contentData[check] = this.state.contentData[check - 1];
      this.state.contentData[check - 1] = tmp;

      const newmcqNewData = [...this.state.contentData];

      this.setState({
        contentData: newmcqNewData,
        showUpDateDataBtn: true,
      });
    }
  }

  downData(item, index) {
    var check = this.state.contentData.findIndex(
      (el) => el.contentId === item.contentId
    );

    if (check !== this.state.contentData.length - 1) {
      const addDown = [...this.state.contentData];

      addDown[index].SortOrder = check + 1;
      addDown[index + 1].SortOrder = check;

      this.setState({
        contentData: addDown,
      });

      var tmp = this.state.contentData[check];
      this.state.contentData[check] = this.state.contentData[check + 1];
      this.state.contentData[check + 1] = tmp;

      const newmcqNewData = [...this.state.contentData];
      this.setState({
        contentData: newmcqNewData,
        showUpDateDataBtn: true,
      });

      console.log(check, this.state.contentData[check + 1]);
    }
  }

  updateData() {
    console.log(this.state.contentData);
    this.setState({
      updateLoader: true,
    });

    let url = `${process.env.REACT_APP_API_kEY}updatecontent`;

    fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(this.state.contentData),
    })
      .then((result) => {
        result.json().then((resp) => {
          console.log("response update :- ", resp);
          if (resp.response === "Success") {
            alert("Contents Upadate Succesfully.");
            this.getContent();
            this.setState({
              updateLoader: false,
              showUpDateDataBtn: false,
            });
          } else {
            this.setState({
              updateLoader: false,
            });
          }
        });
      })
      .catch((error) => {
        this.setState({
          updateLoader: false,
        });
        alert("Something went wrong. Please try again.");
      });
  }

  render() {
    return (
      <>
        <Helmet>
          <title>Contents</title>
        </Helmet>
        <Header />

        <div className="txt" id="pddd">
          <div className="app-main__inner">
            <div className="app-page-title">
              <div className="page-title-wrapper">
                <div className="page-title-heading">
                  <div className="page-title-icon">
                    <FaClipboardList></FaClipboardList>
                  </div>
                  <div>
                    CONTENT LIST
                    <div className="page-title-subheading">
                      Click on New Content to add new content to the system.
                    </div>
                  </div>
                </div>
                <div className="page-title-actions">
                  <Link to="/content">
                    <button type="button" className="mr-1 btn btn-success">
                      <BiShowAlt
                        className="fa pe-7s-help1"
                        style={{ marginBottom: "3%" }}
                      />{" "}
                      New Content
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            {!this.state.loading ? (
              <>
                <div className="main-card mb-0 card">
                  <div className="card-header bg-info text-white">
                    List of contentS
                    {this.state.showUpDateDataBtn ? (
                      <div className="col-md-3 ps-a">
                        {!this.state.updateLoader ? (
                          <input
                            id="contentimage"
                            name="contentimage"
                            type="submit"
                            className="btn-wide btn btn-danger fl-r"
                            value="Update"
                            onClick={() => this.updateData()}
                            // onChange={this.imageHandler}
                          />
                        ) : (
                          <div className="fl-r mrr-15">
                            <TailSpin
                              color="#FFF"
                              height={30}
                              width={50}
                              ariaLabel="loading"
                            />
                          </div>
                        )}
                      </div>
                    ) : null}
                  </div>

                  <div className="card-body">
                    {!this.state.hideTable ? (
                      <div class="table-responsive">
                        <table className="mb-0 table table-striped table-hover">
                          <thead>
                            <tr>
                              <th>Heading</th>
                              {/* <th>Sort Order</th> */}
                              <th>Active</th>
                              <th style={{ width: "75px" }}>Action</th>
                              <th style={{ width: "82px" }}>Preview</th>
                              <th style={{ width: "20px" }}>Delete</th>
                              <th style={{ width: "20px" }}>Position</th>
                            </tr>
                          </thead>
                          <tbody>
                            {this.state.contentData.map((item, i) => {
                              // console.log(item);
                              return (
                                <React.Fragment key={i}>
                                  <tr>
                                    <td>{item.heading}</td>
                                    {/* <td>{item.SortOrder}</td> */}
                                    <td>
                                      <p>{item.Active.toString()}</p>
                                    </td>
                                    <Link
                                      to={
                                        "/Contentedit" + "?id=" + item.contentId
                                      }
                                      className="wd-75px"
                                    >
                                      <td className="edt wd-100">
                                        <p>
                                          <FaEdit></FaEdit>
                                        </p>
                                      </td>
                                    </Link>
                                    <td
                                      className="edt"
                                      style={{ cursor: "pointer" }}
                                      onClick={() => this.showPreview(item)}
                                    >
                                      <p style={{ marginBottom: "5px" }}>
                                        <MdPreview
                                          size={22}
                                          style={{ color: "green" }}
                                        />
                                      </p>
                                    </td>
                                    <td
                                      className="edt"
                                      onClick={() => this.deleteContent(item)}
                                      style={{ cursor: "pointer" }}
                                    >
                                      <p style={{ marginBottom: "5px" }}>
                                        <RiDeleteBinLine
                                          size={22}
                                          style={{ color: "red" }}
                                        />
                                      </p>
                                    </td>

                                    <td>
                                      <p
                                        onClick={() => this.upData(item, i)}
                                        className="wd-50 crp"
                                      >
                                        <AiOutlineUp color="#000" size={20} />
                                      </p>
                                      <p
                                        onClick={() => this.downData(item, i)}
                                        className="wd-50 crp"
                                      >
                                        <AiOutlineDown size={20} color="#000" />
                                      </p>
                                    </td>
                                  </tr>
                                </React.Fragment>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <h5 className="err">{this.state.messageShow}</h5>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="loading_c">
                <TailSpin
                  color="#00BFFF"
                  height={60}
                  width={80}
                  ariaLabel="loading"
                />
              </div>
            )}
          </div>

          {this.state.bigLoader ? (
            <div className="ldbi" style={{ position: "fixed" }}>
              <TailSpin
                color="#00BFFF"
                height={80}
                width={100}
                ariaLabel="loading"
              />
            </div>
          ) : null}
        </div>

        {/*  */}
        {this.state.showChngPreview ? (
          <>
            <div
              className="modal fade bd-ChangePassword show"
              style={{ display: "block" }}
            >
              <div className="modal-dialog " style={{ background: "#fff" }}>
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLongTitle">
                      Content Preview
                    </h5>
                    <button
                      type="button"
                      className="close"
                      onClick={() => this.hidePreview()}
                    >
                      <span aria-hidden="true">×</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    <>
                      {this.state.loadingdata ? (
                        <>
                          {!this.state.hidePopData ? (
                            <>
                              <div className="col">
                                {!this.state.hideImageType ? (
                                  <img
                                    src={this.state.imgdata}
                                    alt="dk"
                                    width={450}
                                    height={300}
                                  />
                                ) : null}
                              </div>
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: this.state.htmlData,
                                }}
                              ></div>
                            </>
                          ) : (
                            <h5 className="err">{this.state.messageShow}</h5>
                          )}
                        </>
                      ) : (
                        <div
                          className="btn-wide btn "
                          style={{ marginLeft: "40%" }}
                        >
                          <TailSpin
                            color="#00BFFF"
                            height={30}
                            width={50}
                            ariaLabel="loading"
                          />
                        </div>
                      )}
                    </>
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
