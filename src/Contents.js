import React, { Component, Props } from "react";
import { FaClipboardList } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import { AiOutlineDown, AiOutlineUp } from "react-icons/ai";

import { MdPreview } from "react-icons/md";
import { BiShowAlt } from "react-icons/bi";
import { TailSpin } from "react-loader-spinner";
import { Link, useNavigate } from "react-router-dom";
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
      imgdata: '',
      xoffset: 0,
      yoffset: 0,
      delta: 10,
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    const libconCode = JSON.parse(localStorage.getItem("libCode"));
    // console.log("libconCode :- ", libconCode);
    this.setState({
      libconCode: libconCode,
    });

    this.getContent(libconCode)
  }



  showPreview(item) {
    // console.log(item.contentId,)
    let id = item.contentId
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
      `http://192.168.1.217:1003/showcontent?libid=${libconCode}&id=${id}`,
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

          const html = resp.data[0].text;
          this.setState({
            htmlData: html
          })

          if (resp.data[0].imageType === "") {
            this.setState({
              hideImageType: true
            })
          } else {
            this.setState({
              imgdata: resp.data[0].imageType,
              hideImageType: false
            })
          }

        } else {
          alert("Something went wrong. Please try again.");
        }
      });
    }).catch((error) => {
      alert("There is problem in your credentials.");
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



  getContent() {
    const libconCode = JSON.parse(localStorage.getItem("libCode"));
    // console.log("libconCode :-", libconCode)
    let url = `http://192.168.1.217:1003/showcontent?libid=${libconCode}&id=0`;

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
        this.setState({
          loading: false,
          messageShow: "Something went wrong. Please try again.",
          hideTable: true,
        });
      });
  }

  deleteContent(item) {
    if (window.confirm("Are you sure you want to delete this content?")) {
      this.setState({
        bigLoader: true
      })
      // console.log(item);
      let id = item.contentId;
      let url = `http://192.168.1.217:1003/Delete?id=${id}&type=content`;

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
              this.getContent()

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


  upData(item, index) {

    var check = this.state.contentData.findIndex(el => el.SortOrder === item.SortOrder)
      const addDown = [...this.state.contentData]

    addDown[index].SortOrder = check -1
    addDown[index-1].SortOrder = check 

    console.log("addDown :- ", addDown)


    this.setState({
      contentData: addDown
    })


    var tmp = this.state.contentData[check];
    this.state.contentData[check] = this.state.contentData[check-1];
    this.state.contentData[check-1] = tmp;



    const newmcqNewData = [...this.state.contentData];

    this.setState({
      contentData: newmcqNewData
    })
    console.log(check)


  }

  downData(item, index) {

    var check = this.state.contentData.findIndex(el => el.SortOrder === item.SortOrder)


    const addDown = [...this.state.contentData]

    addDown[index].SortOrder = check +1
    addDown[index+1].SortOrder = check 

    console.log("addDown :- ", addDown)


    this.setState({
      contentData: addDown
    })

    var tmp = this.state.contentData[check];
    this.state.contentData[check] = this.state.contentData[check+1];
    this.state.contentData[check+1] = tmp;

    const newmcqNewData = [...this.state.contentData];

    this.setState({
      contentData: newmcqNewData
    })
    console.log(check)


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
                  </div>

                  <div className="card-body">
                    {!this.state.hideTable ? (
                      <table className="mb-0 table table-hover">
                        <thead>
                          <tr>
                            <th>Heading</th>
                            <th>Sort Order</th>
                            <th>Active</th>
                            <th style={{ width: "75px" }}>Action</th>
                            <th style={{ width: "82px" }}>Preview</th>
                            <th style={{ width: "20px" }}>Delete</th>
                            <th style={{ width: "20px" }}>Position</th>

                          </tr>
                        </thead>
                        <tbody>
                          {this.state.contentData.map((item, i) => {
                            console.log(item);
                            return item.delete !== true ? (
                              <tr>
                                <td>{item.heading}</td>
                                <td>{item.SortOrder}</td>
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
                                <td className="edt" style={{ cursor: "pointer" }} onClick={() => this.showPreview(item)}>
                                  <p>
                                    <MdPreview size={22} style={{ color: "green" }} />
                                  </p>
                                </td>
                                <td className="edt" onClick={() => this.deleteContent(item)} style={{ cursor: "pointer" }}>
                                  <p>
                                    <RiDeleteBinLine size={22} style={{ color: "red" }} />
                                  </p>
                                </td>

                                <td style={{display:"flex" ,position:"absolute"}}>
                                  <p onClick={() => this.upData(item, i)} style={{ cursor: "pointer" }}>
                                    <AiOutlineUp size={20} style={{ color: "black" }} />
                                  </p>
                                  <p onClick={() => this.downData(item, i)} style={{ cursor: "pointer" }}>
                                    <AiOutlineDown size={20} style={{ color: "black" }} />
                                  </p>
                                </td>
                              </tr>
                            ) : null;
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
                    <h5 className="modal-title" id="exampleModalLongTitle">Content Preview</h5>
                    <button type="button" className="close" onClick={() => this.hidePreview()}>
                      <span aria-hidden="true">×</span>
                    </button>
                  </div>
                  <div className="modal-body" >
                    <div className="col">
                      {this.state.hideImageType ? (
                        <img
                          style={{ display: "none" }}
                          src={this.state.imgdata}
                          alt="Content"
                          width={450}
                          height={300}
                        />
                      ) : (

                        <img
                          src={this.state.imgdata}
                          alt="Content"
                          width={450}
                          height={300}
                        />

                      )}




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
