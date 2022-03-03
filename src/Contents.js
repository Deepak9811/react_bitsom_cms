import React, { Component, Props } from "react";
import { FaClipboardList } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
// import { BiShowAlt } from "react-icons/bs";
import { BiShowAlt } from "react-icons/bi";
import { TailSpin } from "react-loader-spinner";
import { Link  ,useNavigate  } from 'react-router-dom'
import Header from './common/header';
import { Helmet } from "react-helmet";


export default class showcontent extends Component {
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
    console.log("libconCode :- ", libconCode);
    this.setState({
      libconCode: libconCode,
    });

    fetch(
      `http://bitsom.libcon.co.in/api/showcontent?libid=${libconCode}&id=0`,
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
        // alert("There is problem in your credentials.");
        this.setState({
          loading: false,
          messageShow: "Something went wrong. Please try again.",
          hideTable: true,
        });
      });
  }

  // static async getInitialProps({ query }) {
  //   return { path: query.id };
  // }

  editContent(item) {
    console.log(item.contentId);
    let contentId = item.contentId;
    // contentId = this.props
    // console.log(this.state.contentId)
    // this.props.contentId
    // console.log(this.props.match.params.contentId)
    // Router.push(`/contentedit?id=${contentId}`)
  }

  render() {
    return (
      <>

<Helmet>
          <title>Contents</title>
        </Helmet>
            <Header/>



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
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {this.state.contentData.map((item, i) => {
                            console.log(item.Active);
                            return (
                              <React.Fragment key={i}>
                                <tr>
                                  <td>{item.heading}</td>
                                  <td>{item.SortOrder}</td>
                                  <td>
                                    <p>{item.Active.toString()}</p>
                                  </td>
                                    <Link to={"/Contentedit"+"?id="+item.contentId} className="wd-100">
                                  <td className="edt wd-100" >
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
