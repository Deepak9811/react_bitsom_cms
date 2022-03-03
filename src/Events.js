import React, { Component } from "react";
import { FaClipboardList } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
// import { BiShowAlt } from "react-icons/bs";
import { BiShowAlt } from "react-icons/bi";
import { TailSpin } from "react-loader-spinner";
import Header from "./common/header";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

export default class Showevent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      eventData: [],
      loading: true,
      hideTable: false,
    };
  }

  componentDidMount() {
    const libconCode = JSON.parse(localStorage.getItem("libCode"));
    console.log("libconCode :- ", libconCode);
    this.setState({
      libconCode: libconCode,
    });

    fetch(`http://bitsom.libcon.co.in/api/showevent?libid=${libconCode}&id=0`, {
      method: "GET",
      headers: {
        Accepts: "application/json",
        "content-type": "application/json",
      },
    })
      .then((result) => {
        result.json().then((resp) => {
          console.log(resp);
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

  editEvent(item) {
    // console.log(item.contentId)
    let dk = item.id;
    // id = this.props
    // console.log(this.state.id)
    // this.props.id
    // console.log(this.props.match.params.id)
    // Router.push(`/eventedit?id=${dk}`,)
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
        </div>
      </>
    );
  }
}
