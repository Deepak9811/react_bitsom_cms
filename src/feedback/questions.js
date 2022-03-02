import React, { Component, Props } from "react";
import { FaClipboardList } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
// import { BiShowAlt } from "react-icons/bs";
import { BiShowAlt } from "react-icons/bi";
import { TailSpin } from "react-loader-spinner";
import Header from "../common/header";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

export default class showfeedbacks extends Component {
  constructor(props) {
    super(props);

    this.state = {
      contentData: [],
      loading: true,
      hideTable: false,
    };
  }

  componentDidMount() {
    console.log("hello");
    const libconCode = JSON.parse(localStorage.getItem("libCode"));
    console.log("libconCode :- ", libconCode);
    this.setState({
      libconCode: libconCode,
    });

    fetch(
      `http://192.168.1.217:1003/api/getquestion?libcode=${libconCode}&questionid=0`,
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
          console.log(resp);
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
        // alert(error.message);
        this.setState({
          loading: false,
          messageShow: "Something went wrong. Please try again.",
          hideTable: true,
        });
      });
  }

  static async getInitialProps({ query }) {
    return { path: query.id };
  }

  editFeedback(item) {
    let questionID = item.questionID;
    // Router.push(`/feedbackedit?id=${questionID}`,)
  }

  showResponse(item) {
    console.log(item);
    let questionID = item.questionID;
    // Router.push(`/feedbackresponse?id=${questionID}&type=${item.type}`)
  }

  render() {
    return (
      <>
       <Helmet>
          <title>Feedback Questions</title>
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
                    FEEDBACK LIST
                    <div className="page-title-subheading">
                      Click on New Feedback to add new Feedback to the system.
                    </div>
                  </div>
                </div>
                <div className="page-title-actions">
                  <Link to={"/feedback"}>
                    <button type="button" className="mr-1 btn btn-success">
                      <BiShowAlt
                        className="fa pe-7s-help1"
                        style={{ marginBottom: "3%" }}
                      />{" "}
                      New Feedback
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            {!this.state.loading ? (
              <>
                <div className="main-card mb-0 card">
                  <div className="card-header bg-info text-white">
                    List of FEEDBACK
                  </div>

                  <div className="card-body">
                    {!this.state.hideTable ? (
                      <table className="mb-0 table table-hover">
                        <thead>
                          <tr>
                            <th>Type</th>
                            <th>Question</th>
                            <th>Valid From</th>
                            <th>Valid Upto</th>
                            <th>Active</th>
                            <th>Check</th>
                            <th>Edit</th>
                          </tr>
                        </thead>
                        <tbody>
                          {this.state.contentData.map((item, i) => {
                            console.log(item.Active);
                            return (
                              <React.Fragment key={i}>
                                <tr>
                                  <td>{item.type}</td>
                                  <td>{item.question}</td>
                                  <td>{item.validFrom.replace("T", " ")}</td>
                                  <td>{item.validUpto.replace("T", " ")}</td>
                                  <td>{item.active.toString()}</td>

                                  <td className="edt">
                                    <Link  to={"/feedbackresponse" + "?id=" +item.questionID +"&type=" + item.type} className="wd-100">
                                      <span>Show</span>
                                    </Link>
                                  </td>
                                    
                                  <td className="edt"  >
                                    <Link    to={"/feedbackedit" + "?id=" +item.questionID +"&type=" + item.type} className="wd-100" >
                                      <p>
                                        <FaEdit></FaEdit>
                                      </p>
                                    </Link>
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
        </div>
      </>
    );
  }
}
