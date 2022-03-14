import React, { Component } from "react";
import { FaClipboardList } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import { BiShowAlt } from "react-icons/bi";
import { TailSpin } from "react-loader-spinner";
import Header from "./common/header";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { MdPreview } from "react-icons/md";
export default class Showevent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      eventData: [],
      loading: true,
      hideTable: false,
      showChngPreview: false,
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0)
    const libconCode = JSON.parse(localStorage.getItem("libCode"));
    console.log("libconCode :- ", libconCode);
    this.setState({
      libconCode: libconCode,
    });
    this.getEvent(libconCode)

  }

  
  getEvent() {
    const libconCode = JSON.parse(localStorage.getItem("libCode"));
    fetch(`http://192.168.1.217:1003/showevent?libid=${libconCode}&id=0`, {
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
              eventData: resp.data,
              loading: false,
            });
          } else {
            this.setState({
              loading: false,
              messageShow: "No data found",
              hideTable: true,
            });
            // alert("Something went wrong. Please try again.")
          }
        });
      })
      .catch((error) => {
        // alert(error.message);
        this.setState({
          loading: false,
          messageShow: "Something went wrong. Please try again.",
          hideTable: true,
        });
      });

  }


  showPreview(item) {
    // console.log("ID", item.id)
    let id = item.id
    // console.log(this.state.contentData)
    if (this.state.showChngPreview === false) {
      this.setState({
        showChngPreview: true
      })
    } else {
      this.setState({
        showChngPreview: false
      })
    }
    // console.log(this.state.showChngPreview)
    const libconCode = JSON.parse(localStorage.getItem("libCode"));

    fetch(
      `http://192.168.1.217:1003/showevent?libid=${libconCode}&id=${id}`,
      {
        method: "GET",
        headers: {
          Accepts: "application/json",
          "content-type": "application/json",
        },
      }
    ).then((result) => {
      result.json().then((resp) => {
        // console.log(resp);
        if (resp.response === "Success") {

          const html = resp.data[0].description;
          this.setState({

            htmlData: html
          })
          if (resp.data[0].imageType === "") {
            this.setState({
              hideimage: true
            })
          }
          else {
            this.setState({
              imgdata: resp.data[0].imageType,
              hideimage: false
            })

          }

        } else {
          alert("Something went wrong. Please try again.");
        }
      });
    }).catch((error) => {
      alert("There is problem ");
    });


  }

  hidePreview() {
    if (this.state.showChngPreview === false) {
      this.setState({
        showChngPreview: true
      })
    } else {
      this.setState({
        showChngPreview: false
      })
    }
  }
  

  editEvent(item) {

    let dk = item.id;

  }
  deleteEvent(item) {
    if (window.confirm("Are you sure you want to delete this event?")) {
      this.setState({
        bigLoader: true
      })
      // console.log(item);
      let id = item.id;


      let url = `http://192.168.1.217:1003/Delete?id=${id}&type=event`;

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

                bigLoader: false
              })
              this.getEvent()

            } else {
              this.setState({
                bigLoader: false
              });
              alert("Something went wrong. Please try again.");
            }
          });
        })
        .catch((error) => {
          alert("Something went wrong.");
          this.setState({
            bigLoader: false
          })
        });
    }
  }




  render() {
    return (
      <>
        <Helmet>
          <title>Events</title>
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
                    EVENT LIST
                    <div className="page-title-subheading">
                      Click on New Event to add new event to the system.
                    </div>
                  </div>
                </div>
                <div className="page-title-actions">
                  <Link to={"/event"}>
                    <button type="button" className="mr-1 btn btn-success">
                      <BiShowAlt
                        className="fa pe-7s-help1"
                        style={{ marginBottom: "3%" }}
                      />{" "}
                      New Event
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            {!this.state.loading ? (
              <>
                <div className="main-card mb-0 card">
                  <div className="card-header bg-info text-white">
                    List of Events
                  </div>
                  <div className="card-body">
                    {!this.state.hideTable ? (
                      <table className="mb-0 table table-hover">
                        <thead>
                          <tr>
                            <th style={{ width: "200px" }}>Event</th>
                            <th>Type</th>
                            <th>Valid From</th>
                            <th>Valid Upto</th>
                            <th>Organiser</th>

                            <th>Action</th>
                            <th>Preview</th>
                            <th style={{ width: "20px" }}>Delete</th>
                          </tr>
                        </thead>

                        <tbody>
                          {this.state.eventData.map((item, i) => {
                            return (
                              <React.Fragment key={i}>
                                <tr>
                                  <td>{item.eventName}</td>
                                  <td>{item.type}</td>
                                  <td>{item.validFrom.replace("T", " ")}</td>
                                  <td>{item.validUpto.replace("T", " ")}</td>
                                  <td>{item.location}</td>

                                  <Link to={"/Eventedit" + "?id=" + item.id}>
                                    <td className="edt wd-100">
                                      <p>
                                        <FaEdit></FaEdit>
                                      </p>
                                    </td>
                                  </Link>
                                  <td className="edt" style={{ cursor: "pointer" }} >
                                    <p>
                                      <MdPreview size={22} style={{ color: "green" }} onClick={() => this.showPreview(item)} />
                                    </p>
                                  </td>
                                  <td className="edt" onClick={() => this.deleteEvent(item)} style={{ cursor: "pointer" }}>
                                    <p>
                                      <RiDeleteBinLine size={22} style={{ color: "red" }} />
                                    </p>
                                  </td>

                                  
                                </tr>
                              </React.Fragment>
                            );
                          })}
                        </tbody>
                      </table>
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
                    <h5 className="modal-title" id="exampleModalLongTitle">Event Preview</h5>
                    <button type="button" className="close" onClick={() => this.hidePreview()}>
                      <span aria-hidden="true">×</span>
                    </button>
                  </div>
                  <div className="modal-body" >
                    <div className="col">
                      {this.state.hideimage ? (
                        <img
                          style={{ display: "none" }}
                          src={this.state.imgdata}
                          alt="Content"
                          width={450}
                          height={300}
                        />
                      ) : (<img
                        src={this.state.imgdata}
                        alt="Content"
                        width={450}
                        height={300}
                      />)}


                    </div>
                    <div dangerouslySetInnerHTML={{ __html: this.state.htmlData }}></div>


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
