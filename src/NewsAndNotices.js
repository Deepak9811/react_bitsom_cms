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
export default class shownewsandnotice extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      hideTable: false,
      bigLoader: true,
      loading: true,
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
      
    this.getData();
    
  }

  getData() {
    const libconCode = JSON.parse(localStorage.getItem("libCode"));
    console.log("libconCode :- ", libconCode);
    let url = `http://192.168.1.217:1003/shownews?id=0&libcode=${libconCode}`;
    // let url = `${process.env.REACT_APP_API_kEY}getparent?libid=${libconCode}`;

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
              data: resp.data,
              loading: false,
              hideTable: false,
              bigLoader: false
            });
          } else {
            this.setState({
              loading: false,
              messageShow: "No data found",
              hideTable: true,
              bigLoader: false
            });
          }
        });
      })
      .catch((error) => {
        this.setState({
          loading: false,
          messageShow: "Something went wrong. Please try again.",
          hideTable: true,
          bigLoader: false
        });
      });
  }


  showPreview(item) {
    // console.log(item.ID,)
    let id = item.ID;
    // console.log(this.state.contentData)
    // if (this.state.showChngPreview === false) {
    //   this.setState({
    //     showChngPreview: true,
    //     hideImageType: true,
    //     loadingdata: false,
    //   });
    // } else {
    //   this.setState({
    //     showChngPreview: false,
    //     hideImageType: true,
    //     loadingdata: false,
    //   });
    // }
    // console.log(this.state.showChngPreview)
    const libconCode = JSON.parse(localStorage.getItem("libCode"));
    let url = `http://192.168.1.217:1003/shownews?id=${id}&libcode=${libconCode}`;
    // let url = `${process.env.REACT_APP_API_kEY}getparent?libid=${libconCode}`;

    fetch(url,
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
            const html = resp.data[0].maintext;
            this.setState({
              htmlData: html,
              loadingdata: true,
              showChngPreview: true,
            });

            if (resp.data[0].imagetype === "") {
              this.setState({
                hideImageType: true,
              });
            } else {
              this.setState({
                imgdata: resp.data[0].imagetype,
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
      let id = item.ID;
    //   let url = `${process.env.REACT_APP_API_kEY}Delete?id=${id}&type=News`;
      let url = `http://192.168.1.217:1003/Delete?id=${id}&type=News`;

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
              this.getData();
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

  render() {
    return (
        <>
        <Helmet>
          <title>News And Notices</title>
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
                         News And Notice LIST
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
                      Add News And Notice
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            {!this.state.loading ? (
              <>
                <div className="main-card mb-0 card">
                  <div className="card-header bg-info text-white">
                    List of News And Notices
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
                      <div className="table-responsive">
                        <table className="mb-0 table table-striped table-hover">
                          <thead>
                            <tr>
                              <th>Heading</th>
                              {/* <th>Sort Order</th> */}
                              <th>Active</th>
                              <th style={{ width: "75px" }}>Edit</th>
                              <th style={{ width: "20px" }}>Preview</th>
                              <th style={{ width: "20px" }}>Delete</th>
                            </tr>
                          </thead>
                          <tbody>
                            {this.state.data.map((item, i) => {
                              // console.log(item);
                              return (
                                <React.Fragment key={i}>
                                  <tr>
                                    <td>{item.newsheading}</td>
                                    <td>
                                      <p>{item.active.toString()}</p>
                                    </td>
                                    <Link  to={"/NewsAndNoticeEdit" + "?id=" + item.ID}  className="wd-100" >
                                      <td className="edt wd-100">
                                        <p style={{ marginTop: "5px" }}>
                                          <FaEdit></FaEdit>
                                        </p>
                                      </td>
                                    </Link>


                                    <td className="edt" style={{ cursor: "pointer" }}
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

          {/* {this.state.bigLoader ? (
            <div className="ldbi" style={{ position: "fixed" }}>
              <TailSpin
                color="#00BFFF"
                height={80}
                width={100}
                ariaLabel="loading"
              />
            </div>
          ) : null} */}
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
                      News And Notice Preview
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
