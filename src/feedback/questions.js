import React, { Component, Props } from "react";
import { FaClipboardList } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
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
    const libconCode = JSON.parse(localStorage.getItem("libCode"));
    this.setState({
      libconCode: libconCode,
    });
    this.getQuestion(libconCode)

  }
//`${process.env.REACT_APP_API_kEY}getquestion?libcode=${libconCode}&questionid=0` 
  getQuestion(){
    const libconCode = JSON.parse(localStorage.getItem("libCode"));
    fetch(
      `${process.env.REACT_APP_API_kEY}getquestion?libcode=${libconCode}&questionid=0`,
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



  deleteQuestion(item) {
    if(window.confirm("Are you sure you want to delete this feedback question?")){
      this.setState({
        bigLoader:true
      })
      let id = item.questionID;
      
     
      let url = `${process.env.REACT_APP_API_kEY}Delete?id=${id}&type=question`;
  
      fetch(url, {
        method: "POST",
        headers: {
          Accepts: "application/json",
          "content-type": "application/json",
        },
      })
      
        .then((result) => {
          result.json().then((resp) => {
            if (resp.response === "Success") {
              this.setState({
                bigLoader:false
              })
              this.getQuestion()
             
            } else {
              this.setState({
                bigLoader:false
              });
              alert("Something went wrong. Please try again.");
            }
          });
        })
        .catch((error) => {
          alert("Something went wrong.");
          this.setState({
            bigLoader:false
          })
        });
    }
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
                      <div class="table-responsive">
                      <table className="mb-0 table table-striped table-hover">
                        <thead  className="table-light">
                          <tr>
                            <th>Type</th>
                            <th>Heading</th>
                            <th>Valid From</th>
                            <th>Valid Upto</th>
                            <th>Active</th>
                            <th>Response</th>
                            <th>Edit</th>
                            <th style={{width:"20px"}}>Delete</th>
                          </tr>
                        </thead>
                        <tbody>
                          {this.state.contentData.map((item, i) => {
                            return (
                              <React.Fragment key={i}>
                                <tr>
                                  <td>{item.type}</td>
                                  <td>{item.heading}</td>
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
                                  <td className="edt" onClick={() => this.deleteQuestion(item)} style={{cursor:"pointer"}}>
                                    <p>
                                      <RiDeleteBinLine size={22} style={{color:"red"}}/>
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
              <div className="ldbi" style={{position:"fixed"}}>
              <TailSpin
                color="#00BFFF"
                height={80}
                width={100}
                ariaLabel="loading"
              />
            </div>
            ):null}
        </div>
      </>
    );
  }
}
