import React, { Component } from "react";
import { FaClipboardList } from "react-icons/fa";
import { GiRoundStar } from "react-icons/gi";
// import { BiShowAlt } from "react-icons/bs";
import { BiShowAlt } from "react-icons/bi";
import { TailSpin } from "react-loader-spinner";
import ProgressBar from "react-bootstrap/ProgressBar";
import Header from "./common/header";
import { Link, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet";

function withParams(Component) {
  return (props) => <Component {...props} params={useSearchParams()} />;
}

class showfeedbackresponse extends Component {
  constructor(props) {
    super(props);

    this.state = {
      contentData: [],
      rating: "",
      loading: true,
      colorProg: "",
      answer: [],
      hideRate: true,
      showRate: true,
      showError: false,
    };
  }

  static async getInitialProps({ query }) {
    return { data: query };
  }

  componentDidMount() {
    const id = this.props.params[0].get("id");
    const type = this.props.params[0].get("type");

    const libconCode = JSON.parse(localStorage.getItem("libCode"));
    console.log("libconCode :- ", libconCode);
    this.setState({
      libconCode: libconCode,
    });

    if (this.props) {
      if (this.props.params) {
        if (this.props.params[0].get("id")) {
          this.getResponse(id, type, libconCode);
        }
      }
    }
  }

  getResponse(questionID, type, libconCode) {
    // http://bitsom.libcon.co.in/api/showpercentage?libcode=CLBITSOM&QUESTIONID=1

    fetch(
      `http://bitsom.libcon.co.in/api/showpercentage?libcode=${libconCode}&QUESTIONID=${questionID}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "content-type": "application/json",
        },
      }
    )
      .then((data) => {
        data.json().then((resp) => {
          console.log("questionID :- ", resp);
          if (resp.response === "Success") {
            console.log("questionID :- ", resp.data[0].Answer);
            this.setState({
              contentData: resp.data,
              rating: resp.data[0].question,
              loading: false,
              answer: resp.data[0].Answer,
            });
            console.log(this.state.answer);
            if (type === "GEN") {
              console.log(type);
              this.setState({
                hideRate: false,
                wdGen: "95%",
              });
            }

            if (type === "RATE") {
              console.log(type);
              this.setState({
                showRate: false,
              });
            }

            if (resp.data[0].Answer.length === 0) {
              console.log("checking length :- ", resp.data[0].Answer.length);

              this.setState({
                showError: true,
                messageShow: "No response found.",
              });
            }
          } else {
            // Router.push("/feedback/showfeedbacks")
            // alert("No data found.");
            this.setState({
              showError: true,
              loading: false,
              messageShow: "No data found.",
            });
          }
        });
      })
      .catch((erro) => {
        console.log("There is problem in " + erro.message);
        this.setState({
          showError: true,
          loading: false,
          messageShow: "Something Went wrong. Please try again.",
        });
      });
  }

  // chngColor(item) {
  //     if (item.percentage < 10) {
  //         // console.log("red :-", item.percentage)
  //         this.state.colorProg = "info"
  //         // this.setState({
  //         //     colorProg:"info"
  //         // })

  //     } else if (item.percentage < 30) {
  //         // console.log("blue :- ", item.percentage)
  //         this.state.colorProg = "success"

  //     } else if (item.percentage < 50) {
  //         // console.log("black :- ", item.percentage)
  //         this.state.colorProg = "warning"

  //     } else if (item.percentage < 60) {
  //         // console.log("yellow :- ", item.percentage)
  //         this.state.colorProg = "danger"

  //     } else if (item.percentage < 70) {
  //         // console.log("pink :- ", item.percentage)
  //         this.state.colorProg = "danger"
  //     } else if (item.percentage <= 100) {
  //         // console.log("pink :- ", item.percentage)
  //         this.state.colorProg = "danger"
  //     }
  // }

  render() {
    const { contentData, loading } = this.state;
    return (
      <>
        <Helmet>
          <title>feedback Response</title>
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
                    FEEDBACK RESPONSE
                    <div className="page-title-subheading">
                      Click on Show Feedback to Show Feedbacks List to the
                      system.
                    </div>
                  </div>
                </div>
                <div className="page-title-actions">
                  <Link to="/feedback/questions">
                    <button type="button" className="mr-1 btn btn-success">
                      <BiShowAlt
                        className="fa pe-7s-help1"
                        style={{ marginBottom: "3%" }}
                      />
                      Show Feedbacks
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            {!loading ? (
              <>
                <div className="main-card mb-0 card">
                  <div className="card-header bg-info text-white">
                    List of Feedback Response
                  </div>

                  {this.state.showRate ?(
                    <div className="card-body">
                    {contentData.map((item, i) => {
                      
                      // console.log(item.Percentage)
                      return (
                        <React.Fragment key={i}>
                          <div className="resp">
                            <div className="flx">
                              <h4>{i + 1}. </h4>
                              <h3> {item.question}</h3>
                            </div>

                            {this.state.showError && (
                              <h5 className="err">{this.state.messageShow}</h5>
                            )}

                            {this.state.answer.map((item, i) => {
                              console.log(item.percentage);
                              // {
                              //     this.chngColor(item)
                              // }
                              return (
                                <React.Fragment key={i}>
                                  <div className="flx pdanswer">
                                    <h5
                                      style={{
                                        width: this.state.hideRate
                                          ? "25%"
                                          : "95%",
                                      }}
                                    >
                                      {i + 1}. {item.answer}
                                    </h5>

                                    {this.state.hideRate && (
                                      <div className="prgbr">
                                        <ProgressBar
                                          max={100}
                                          min={0}
                                          variant={this.state.colorProg}
                                          now={Number(item.percentage) + 4}
                                          label={`${Number(item.percentage)} %`}
                                        />
                                      </div>
                                    )}
                                  </div>
                                </React.Fragment>
                              );
                            })}
                          </div>
                        </React.Fragment>
                      );
                    })}

                    <div
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                      }}
                    >
                      <Link to="/feedback/questions">
                        <input
                          type="reset"
                          value="BACK"
                          className="btn-wide btn btn-light"
                          id="btnClear"
                          style={{ marginLeft: "43%" }}
                        />
                      </Link>
                    </div>
                  </div>
                  ):(
                    <div className="card-body">
                    <div className="resp">
                      <div className="flx">
                        <h3> {this.state.contentData[0].question}</h3>
                      </div>

                      {this.state.showError && (
                        <h5 className="err">{this.state.messageShow}</h5>
                      )}

                      <div className="pdanswer">
                        <div className="flr">
                          <div ><h5>{this.state.answer[0].answer} </h5> </div>
                            <div className="rt">
                            <GiRoundStar size={21} color="#ffc83d"/>
                            </div>
                          :
                          <div className="prgbr">
                            <ProgressBar
                              max={100}
                              min={0}
                              variant={this.state.colorProg}
                              now={Number(this.state.answer[0].percentage) + 4}
                              label={`${Number(
                                this.state.answer[0].percentage
                              )} %`}
                            />
                          </div>
                        </div>

                        <div className="flr">
                          <div ><h5>{this.state.answer[1].answer} </h5> </div>
                            <div className="rt">
                            <GiRoundStar size={21} color="#ffc83d"/> <GiRoundStar size={21} color="#ffc83d"/>
                            </div>
                          :
                          <div className="prgbr">
                            <ProgressBar
                              max={100}
                              min={0}
                              variant={this.state.colorProg}
                              now={Number(this.state.answer[1].percentage) + 4}
                              label={`${Number(
                                this.state.answer[1].percentage
                              )} %`}
                            />
                          </div>
                        </div>

                        <div className="flr">
                          <div ><h5>{this.state.answer[2].answer} </h5> </div>
                            <div className="rt">
                            <GiRoundStar size={21} color="#ffc83d"/> <GiRoundStar size={21} color="#ffc83d"/> <GiRoundStar size={21} color="#ffc83d"/>
                            </div>
                          :
                          <div className="prgbr">
                            <ProgressBar
                              max={100}
                              min={0}
                              variant={this.state.colorProg}
                              now={Number(this.state.answer[2].percentage) + 4}
                              label={`${Number(
                                this.state.answer[2].percentage
                              )} %`}
                            />
                          </div>
                        </div>

                        <div className="flr">
                          <div ><h5>{this.state.answer[3].answer} </h5> </div>
                            <div className="rt">
                            <GiRoundStar size={21} color="#ffc83d"/> <GiRoundStar size={21} color="#ffc83d"/> <GiRoundStar size={21} color="#ffc83d"/> <GiRoundStar size={21} color="#ffc83d"/>
                            </div>
                          :
                          <div className="prgbr">
                            <ProgressBar
                              max={100}
                              min={0}
                              variant={this.state.colorProg}
                              now={Number(this.state.answer[3].percentage) + 4}
                              label={`${Number(
                                this.state.answer[3].percentage
                              )} %`}
                            />
                          </div>
                        </div>

                        <div className="flr">
                          <div ><h5>{this.state.answer[4].answer} </h5> </div>
                            <div className="rt">
                            <GiRoundStar size={21} color="#ffc83d"/> <GiRoundStar size={21} color="#ffc83d"/> <GiRoundStar size={21} color="#ffc83d"/> <GiRoundStar size={21} color="#ffc83d"/> <GiRoundStar size={21} color="#ffc83d"/>
                            </div>
                          :
                          <div className="prgbr">
                            <ProgressBar
                              max={100}
                              min={0}
                              variant={this.state.colorProg}
                              now={Number(this.state.answer[4].percentage) + 4}
                              label={`${Number(
                                this.state.answer[4].percentage
                              )} %`}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                      }}
                    >
                      <Link to="/feedback/questions">
                        <input
                          type="reset"
                          value="BACK"
                          className="btn-wide btn btn-light"
                          id="btnClear"
                          style={{ marginLeft: "43%" }}
                        />
                      </Link>
                    </div>
                  </div>
                  )}

                  

                



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

export default withParams(showfeedbackresponse);
