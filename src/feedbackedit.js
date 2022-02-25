import React, { Component } from "react";
import DatePicker from "react-datepicker";
import { TailSpin } from "react-loader-spinner";
import { FiUsers } from "react-icons/fi";
import { BsQuestionCircle } from "react-icons/bs";
import moment from "moment";
import Header from './common/header';
import { Link    } from 'react-router-dom'

export default class feedback extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profileImg: "",
      eventName: "",
      validFrom: new Date(),
      validUpto: new Date(),
      loading: false,
      physical: false,
      active: true,
      system: false,
      showMcq: false,
      showNewMcqData: false,
      mcqQuestionId: "",
      questionID: "",
      mcqNewData: [],
      Updateloading: false,
      choice: "",
      sortOrder: "",
      activeMcq: false,
      heading: "",
      question: "",
      question_type: "",
      hideSaveBttn: true,
      showValidFromDate: false,
      showValidUptoDate: false,
      libconCode: "",
      upType: false,
      activeMcq: true,

      other_fields: [],
      showAddMoreUpdate:false,
    };
  }

  static async getInitialProps({ query }) {
    return { data: query };
  }

  componentDidMount() {
    console.log("question_type :- ", this.state.question_type);
    const libconCode = JSON.parse(localStorage.getItem("libCode"));
    console.log("libconCode :- ", libconCode);
    if (libconCode) {
      this.setState({
        libconCode: libconCode,
      });
    }

    // this.getFeedBackData(libconCode);

    if (this.props) {
      if (this.props.data) {
        if (this.props.data.id) {
          this.getFeedBackData(this.props.data.id, libconCode);
          console.log("refresh not working");
        }
      }
    }
  }

  getFeedBackData(id, libconCode) {
    fetch(
      `http://192.168.1.217:1003/api/getquestion?libcode=${libconCode}&questionid=${id}`,
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
          console.log(resp.data[0].type);
          if (resp.response === "Success") {
            this.setState({
              upType: true,
              showValidFromDate: true,
              showValidUptoDate: true,
              feedBckData: resp.data,
              question_type: resp.data[0].type,
              heading: resp.data[0].heading,
              question: resp.data[0].question,
              // validFrom: resp.data[0].validFrom,
              // validUpto: resp.data[0].validUpto,
              validFrom: moment(resp.data[0].validFrom)
                .format("MM-DD-YYYY hh:mm a")
                .replace("T", " "),
              validUpto: moment(resp.data[0].validUpto)
                .format("MM-DD-YYYY hh:mm a")
                .replace("T", " "),
              // validFrom: resp.data[0].validFrom.replace("T", " "),
              // validUpto: resp.data[0].validUpto.replace("T", " "),
              questionID: resp.data[0].questionID,
              libCode: resp.data[0].libCode,
              active: resp.data[0].active,
              mcqNewData: resp.data[0].mcq,
            });

            console.log(this.state.mcqNewData);

            if (this.state.mcqNewData.length != 0) {
              this.setState({
                showNewMcqData: true,
                hideSaveBttn: false,
              });
            }

            if(resp.data[0].type === "MCQ"){
                this.setState({
                    showNewMcqData: true,
                    hideSaveBttn: false,
                    showAddMoreUpdate:true,
                })
            }
          }else{
            // Router.push("/feedback/questions");
            alert("Something went wrong. Please try again.");
          }
        });
      })
      .catch((error) => {
        alert("There is problem in your credentials.");
      });
  }

  checkFeed() {
    if (this.state.question_type === "" || this.state.question === "") {
      alert("Please fill the details...");
      console.log(
        "cheking :- ",
        this.state.question_type,
        " question :-",
        this.state.question
      );
    } else {
      console.log(
        "cheking :- ",
        this.state.question_type,
        " question :-",
        this.state.question
      );
      const {
        active,
        heading,
        question,
        question_type,
        validFroms,
        questionID,
        libconCode,
      } = this.state;
      this.setState({
        loading: true,
      });
      fetch(`http://192.168.1.217:1003/api/questions`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          questionID: questionID,
          libCode: libconCode,
          type: question_type,
          heading: heading,
          question: question,
          validFrom: moment(this.state.validFrom).format(
            "MM-DD-YYYY hh:mm:ss a"
          ),
          validUpto: moment(this.state.validUpto).format(
            "MM-DD-YYYY hh:mm:ss a"
          ),
          active: active,
        }),
      })
        .then((result) => {
          result.json().then((resp) => {
            console.log(resp);
            if (resp.response === "Success") {
              if (this.state.showNewMcqData === true) {
                this.setState({
                  showMcq: false,
                  loading: false,
                });
                this.updateMcq();
              } else if (question_type === "MCQ") {
                this.setState({
                  mcqData: resp.data,
                  mcqQuestionId: resp.data[0].questionID,
                  showMcq: true,
                  loading: false,
                  question_type: "",
                  heading: "",
                  question: "",
                  validFrom: new Date(),
                  validUpto: new Date(),
                  active: false,
                });
              } else {
                this.setState({
                  mcqData: resp.data,
                  mcqQuestionId: resp.data[0].questionID,
                  showMcq: false,
                  loading: false,
                  question_type: "",
                  heading: "",
                  question: "",
                  validFrom: new Date(),
                  validUpto: new Date(),
                  active: false,
                });
                alert("Feedback Question Add Successfully.");
                // Router.push("/feedback/questions");
              }
            } else {
              alert("Something wents wrong.");
              this.setState({
                loading: false,
              });
            }
          });
        })
        .catch((error) => {
          alert(error.message);
          this.setState({
            loading: false,
          });
        });
    }
  }

  addMcq() {
    const { activeMcq, sortOrder, choice, mcqQuestionId, mcqNewData } =
      this.state;
    this.setState({
      loading: true,
    });

    fetch(`http://192.168.1.217:1003/api/insertmcq`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        mcqid: "",
        questionid: mcqQuestionId,
        choice: choice,
        sortorder: sortOrder,
        active: activeMcq,
      }),
    })
      .then((result) => {
        result.json().then((resp) => {
          console.log(resp);
          if (resp.response === "Success") {
            this.setState({
              resp: resp.data,
              showMcq: true,
              loading: false,
              choice: "",
              sortOrder: "",
              activeMcq: false,
            });
            alert("Feedback Add Successfully.");
          } else {
            alert("Something wents wrong.");
            this.setState({
              loading: false,
            });
          }
        });
      })
      .catch((error) => {
        alert(error.message);
      });
  }

  reset() {
    console.log("hello");
    this.setState({
      showMcq: false,
      loading: false,
      question_type: "",
      heading: "",
      question: "",
      validFrom: new Date(),
      validUpto: new Date(),
      active: false,
    });
  }

  chngeDataFormate(date) {
    let dt = date.toString();
    let dts = dt.split(" ");
    let yr = dts[3];
    let mn = dts[1];
    let dty = dts[2];
    let tm = dts[4];

    let frm = yr + "-" + mn + "-" + dty + "T" + tm;

    this.setState({ validFroms: date });

    console.log(JSON.stringify(frm));
  }

  handleChange(newName, index) {
    const { companies } = this.state;

    const newCompanies = [...companies];
    newCompanies[index] = newName;
    this.setState({ companies: newCompanies });
    console.log("input :- ", this.state.companies);
  }

  updateCompany(newName, index) {
    const { mcqNewData } = this.state;
    // const date = { name, email }
    const newmcqNewData = [...mcqNewData];

    newmcqNewData[index].choice = newName;
    this.setState({ mcqNewData: newmcqNewData });

    console.log(newmcqNewData);
  }

  updateOrder(newName, index) {
    const { mcqNewData } = this.state;
    // const date = { name, email }
    const newmcqNewData = [...mcqNewData];

    newmcqNewData[index].sortorder = Number(newName);
    this.setState({ mcqNewData: newmcqNewData });

    console.log(newmcqNewData);
  }

  updateActive(newName, index) {
    const { mcqNewData } = this.state;
    const newmcqNewData = [...mcqNewData];

    if (newName === "false") {
      let tr = true;
      newmcqNewData[index].active = tr;
    } else {
      let fl = false;
      newmcqNewData[index].active = fl;
    }
    this.setState({ mcqNewData: newmcqNewData });

    console.log(newName, index);
    console.log(newmcqNewData);
  }

  updateMcq() {
    const { activeMcq, sortOrder, choice, mcqQuestionId, mcqNewData ,other_fields} =
      this.state;

      let ad1 = mcqNewData
      let ad2 = other_fields

      let totalArray = ad1.concat(ad2)

      console.log(other_fields)




    this.setState({
      Updateloading: true,
    });


    fetch(`http://192.168.1.217:1003/api/updatemcq`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(totalArray),
    })
      .then((result) => {
        result.json().then((resp) => {
          console.log(resp);
          if (resp.response === "Success") {
            this.setState({
              showMcq: false,
              Updateloading: false,
              showNewMcqData: false,
              choice: "",
              sortOrder: "",
              heading: "",
              question: "",
              question_type: "",
              activeMcq: false,
              active: false,
            });
            // Router.push("/feedback/questions");
            alert("Feedback Update Successfully.");
          } else {
            alert("Something wents wrong.");
            this.setState({
              Updateloading: false,
            });
          }
        });
      })
      .catch((error) => {
        alert(error.message);
        this.setState({
          Updateloading: false,
        });
      });
  }

  addMoreFields() {
    var newArr = {mcqid:"", questionid:this.state.questionID, choice: "",sortorder:"",active:true};
    this.setState({
      other_fields: this.state.other_fields.concat(newArr),
    });
  }

  removeOther(index) {
    
    this.state.other_fields.splice(index,1) ;

    this.setState((prevState) => ({
      other_fields: [...prevState.other_fields],
    }));

    console.log(this.state.other_fields)
  }


  addMoreChoice(newName, index) {
    const { other_fields } = this.state;
    // const date = { name, email }
    const newmcqNewData = [...other_fields];

    newmcqNewData[index].choice = newName;
    this.setState({ other_fields: newmcqNewData });

    console.log(newmcqNewData);
  }


  addMoreOrder(newName, index) {
    const { other_fields } = this.state;
    // const date = { name, email }
    const newmcqNewData = [...other_fields];

    newmcqNewData[index].sortorder = Number(newName);
    this.setState({ other_fields: newmcqNewData });

    console.log(newmcqNewData);
  }


  addMoreActives(newName, index) {
      console.log(index)
    const { other_fields } = this.state;
    const newmcqNewData = [...other_fields];

    if (newName === "false") {
      let tr = true;
      newmcqNewData[index].active = tr;
    } else {
      let fl = false;
      newmcqNewData[index].active = fl;
    }
    this.setState({ other_fields: newmcqNewData });

    console.log(newName, index);
    console.log(newmcqNewData);
  }

  render() {
    // const {
    //   activeMcq,
    //   sortOrder,
    //   choice,
    //   active,
    //   addChoice,
    //   validFrom,
    //   validUpto,
    //   heading,
    //   question,
    //   type,
    //   question_type,
    //   companies,
    //   mcqNewData,
    // } = this.state;
    // console.log(this.state)
    return (
      <>
         <Header/>
        <div className="txt" id="pddd">
          <div className="app-page-title">
            <div className="page-title-wrapper">
              <div className="page-title-heading">
                <div className="page-title-icon">
                  <FiUsers className="pe-7s-users icon-gradient bg-mean-fruit" />
                </div>
                <div>
                  FEEDBACK - ADD/UPDATE
                  <div className="page-title-subheading">
                    <p>
                      Enter the details and click on SAVE button to save the
                      details.
                    </p>
                  </div>
                </div>
              </div>
              <div className="page-title-actions">
                  <a href="/feedback/questions">
                    <button type="button" className="mr-1 btn btn-success">
                      <BsQuestionCircle
                        className="fa pe-7s-help1"
                        style={{ marginBottom: "3%" }}
                      />{" "}
                      Show Feedbacks
                    </button>
                  </a>
              </div>
            </div>
          </div>

          <div className="txtb">
            <div className="card-header bg-info text-white">
              FEEDBACK DETAILS
            </div>

            <div style={{ padding: "1.25rem" }}>
              {!this.state.showMcq ? (
                <>
                  <div className="form-row">
                    <div className="col-md-3 mb-1 ">
                      <label>Type</label>
                      <span className="text-danger">*</span>
                      <div className="position-relative form-group ">
                        <select
                          disabled={this.state.upType ? true : false}
                          id=""
                          className="form-control"
                          value={this.state.question_type}
                          aria-label="question_type"
                          name="question_type"
                          title="question_type"
                          onChange={(e) =>
                            this.setState({ question_type: e.target.value })
                          }
                        >
                          <option value="" hidden>
                            Type of Question
                          </option>
                          <option value="GEN">GENERAL</option>
                          <option value="MCQ">MCQ</option>
                          <option value="Rate">RATE</option>
                        </select>
                      </div>
                    </div>

                    <div className="col-md-8 mb-1">
                      <label>Heading</label>
                      <input
                        type="text"
                        value={this.state.heading}
                        onChange={(e) =>
                          this.setState({ heading: e.target.value })
                        }
                        className="form-control"
                        placeholder="Heading..."
                        required=""
                        autoFocus=""
                        autoComplete="on"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="col-md-11 mb-1">
                      <label>Question</label>
                      <span className="text-danger">*</span>

                      <div className="position-relative form-group ">
                        <input
                          type="text"
                          value={this.state.question}
                          onChange={(e) =>
                            this.setState({ question: e.target.value })
                          }
                          className="form-control"
                          placeholder="Question..."
                          required=""
                          autoFocus=""
                          autoComplete="on"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="col-md-3 mb-1 ">
                      <label>Valid From</label>
                      <span className="text-danger">*</span>
                      <div className="position-relative form-group ">
                        {/* <DatePicker
                                selected={validFrom}
                                // onChange={(date) => this.chngeDataFormate(date)}
                                onChange={(date) => this.setState({ validFrom: date })}
                                timeInputLabel="Time:"
                                dateFormat="MM/dd/yyyy h:mm aa"
                                showTimeInput
                                className='form-control'
                            /> */}

                        {this.state.showValidFromDate ? (
                          <DatePicker
                            value={this.state.validFrom}
                            onChange={(date) =>
                              this.setState({
                                validFrom: date,
                                showValidFromDate: false,
                              })
                            }
                            // customTimeInput={<ExampleCustomTimeInput />}
                            dateFormat="MM/dd/yyyy h:mm aa"
                            showTimeInput
                            className="form-control"
                          />
                        ) : (
                          <DatePicker
                            selected={this.state.validFrom}
                            onChange={(date) =>
                              this.setState({ validFrom: date })
                            }
                            // customTimeInput={<ExampleCustomTimeInput />}
                            dateFormat="MM/dd/yyyy h:mm aa"
                            showTimeInput
                            className="form-control"
                          />
                        )}
                      </div>
                    </div>

                    <div className="col-md-3 mb-1 ">
                      <label>Valid Upto</label>
                      <span className="text-danger">*</span>
                      <div className="position-relative form-group ">
                        {/* <DatePicker
                                selected={validUpto}
                                onChange={(date) => this.setState({ validUpto: date })}
                                timeInputLabel="Time:"
                                dateFormat="MM/dd/yyyy h:mm aa"
                                showTimeInput
                                className='form-control'
                            /> */}

                        {this.state.showValidUptoDate ? (
                          <DatePicker
                            value={this.state.validUpto}
                            onChange={(date) =>
                              this.setState({
                                validUpto: date,
                                showValidUptoDate: false,
                              })
                            }
                            // customTimeInput={<ExampleCustomTimeInput />}
                            dateFormat="MM/dd/yyyy h:mm aa"
                            showTimeInput
                            className="form-control"
                          />
                        ) : (
                          <DatePicker
                            selected={this.state.validUpto}
                            onChange={(date) =>
                              this.setState({ validUpto: date })
                            }
                            // customTimeInput={<ExampleCustomTimeInput />}
                            dateFormat="MM/dd/yyyy h:mm aa"
                            showTimeInput
                            className="form-control"
                          />
                        )}
                      </div>
                    </div>

                    <div className="col-md-3 mb-1" style={{ marginLeft: "8%" }}>
                      <label>Active</label>
                      <span className="text-danger">*</span>
                      <div className="position-relative form-group m-2">
                        <div>
                          <div className="custom-checkbox custom-control">
                            <input
                              className="custom-control-input"
                              id="exampleCustomInline1"
                              name="Show"
                              type="checkbox"
                              checked={this.state.active ? "checkbox" : null}
                              onChange={() =>
                                this.setState({
                                  active: this.state.active ? false : true,
                                })
                              }
                            />
                            <input name="Show" type="hidden" value="false" />
                            <label
                              className="custom-control-label"
                              htmlFor="exampleCustomInline1"
                            >
                              Active
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {this.state.hideSaveBttn && (
                    <div className="card-footer">
                      <div className="col-md-12 mb-0 text-center">
                        {!this.state.loading ? (
                          <>
                            <input
                              type="submit"
                              name="created"
                              value="SAVE"
                              className="btn-wide btn btn-success"
                              onClick={() => this.checkFeed()}
                            />

                              <a href="/feedback/questions">
                                <input
                                  type="reset"
                                  value="BACK"
                                  className="btn-wide btn btn-light"
                                  id="btnClear"
                                  style={{ marginLeft: "2%" }}
                                />
                              </a>
                          </>
                        ) : (
                          <div className="btn-wide btn ">
                            <TailSpin
                              color="#00BFFF"
                              height={30}
                              width={50}
                              ariaLabel="loading"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div>
                  <div className="form-row">
                    <div className="col-md-5 mb-1">
                      <label>Choice</label>
                      <span className="text-danger">*</span>
                      <input
                        type="text"
                        value={this.state.choice}
                        onChange={(e) =>
                          this.setState({ choice: e.target.value })
                        }
                        className="form-control"
                        placeholder="Choice..."
                        required=""
                        autoFocus=""
                        autoComplete="on"
                      />
                    </div>

                    <div className="col-md-5 mb-1 ">
                      <label>Sort Order</label>
                      <span className="text-danger">*</span>
                      <div className="position-relative form-group ">
                        <input
                          type="number"
                          value={this.state.sortOrder}
                          onChange={(e) =>
                            this.setState({ sortOrder: e.target.value })
                          }
                          className="form-control"
                          placeholder="Short Order..."
                          required=""
                          autoFocus=""
                          autoComplete="on"
                        />
                      </div>
                    </div>

                    <div className="col-md-2 mb-1" style={{ marginTop: "3%" }}>
                      {/* <label>Active</label><span className="text-danger">*</span> */}
                      <div className="position-relative form-group m-2">
                        <div style={{ marginLeft: "20%" }}>
                          <div className="custom-checkbox custom-control">
                            <input
                              className="custom-control-input"
                              id="exampleCustomInline1"
                              name="Show"
                              type="checkbox"
                              checked={this.state.activeMcq ? "checkbox" : null}
                              onChange={() =>
                                this.setState({
                                  activeMcq: this.state.activeMcq ? false : true,
                                })
                              }
                            />
                            <input name="Show" type="hidden" value="false" />
                            <label
                              className="custom-control-label"
                              htmlFor="exampleCustomInline1"
                            >
                              Active
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="card-footer">
                    <div className="col-md-12 mb-0 text-center">
                      {!this.state.loading ? (
                        <>
                          <input
                            type="submit"
                            name="created"
                            value="SAVE"
                            className="btn-wide btn btn-success"
                            onClick={() => this.addMcq()}
                          />
                            <a href="/feedback/questions">
                              <input
                                type="reset"
                                value="BACK"
                                className="btn-wide btn btn-light"
                                id="btnClear"
                                style={{ marginLeft: "2%" }}
                              />
                            </a>
                        </>
                      ) : (
                        <div className="btn-wide btn ">
                          <TailSpin
                            color="#00BFFF"
                            height={30}
                            width={50}
                            ariaLabel="loading"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* --------------------------------------NEW-DATA-FOR-UPDATE--------------------------------------------------------------- */}

              {this.state.showNewMcqData && (
                <div>
                  {this.state.mcqNewData.map((item, index) => {
                    // console.log(item.choice)
                    return (
                      <React.Fragment key={index}>
                        <div>
                          <div className="form-row">
                            <div className="col-md-5 mb-1">
                              <label>Choice</label>
                              <span className="text-danger">*</span>
                              <input
                                type="text"
                                key={index}
                                value={item.choice}
                                onChange={(e) =>
                                  this.updateCompany(e.target.value, index)
                                }
                                className="form-control"
                              ></input>
                              {/* <input
                                        type="text"
                                        value={item.choice}
                                        onChange={(e) =>
                                            // this.setState({ choice: e.target.value })
                                            this.handleChange(e.target.value, i)
                                        }
                                        key={i}
                                        className="form-control"
                                        placeholder="Choice..."
                                    /> */}
                            </div>

                            <div className="col-md-5 mb-1 ">
                              <label>Sort Order</label>
                              <span className="text-danger">*</span>
                              <div className="position-relative form-group ">
                                <input
                                  type="number"
                                  value={item.sortorder}
                                  onChange={(e) =>
                                    this.updateOrder(e.target.value, index)
                                  }
                                  key={index}
                                  className="form-control"
                                  placeholder="Short Order..."
                                  required=""
                                  autoFocus=""
                                  autoComplete="on"
                                />
                              </div>
                            </div>

                            <div
                              className="col-md-1 mb-1"
                              style={{ marginLeft: "3%", marginTop: "2.7%" }}
                            >
                              {/* <label>Active</label><span className="text-danger">*</span> */}
                              <div className="position-relative form-group m-2">
                                <div>
                                  <div className="custom-checkbox custom-control">
                                    <input
                                      className="custom-control-input"
                                      id={`${index}`}
                                      name="Show"
                                      type="checkbox"
                                      value={item.active}
                                      checked={item.active ? "checkbox" : null}
                                      onChange={(e) =>
                                        this.updateActive(e.target.value, index)
                                      }
                                    />
                                    <input
                                      name="Show"
                                      type="hidden"
                                      value="false"
                                    />
                                    <label
                                      className="custom-control-label"
                                      htmlFor={`${index}`}
                                    >
                                      Active
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </React.Fragment>
                    );
                  })}

                  {/* ----------------------------ADD-MORE-OPTION---------------------------------------------------------- */}

                  {this.state.other_fields.map((item, addMoreIndex) => {
                      console.log(item,addMoreIndex)
                    return item.delete !== true ? (
                      <div className="form-row">
                        <div className="col-md-5 mb-1">
                          <label>Choice</label>
                          <span className="text-danger">*</span>
                          <input
                            type="text"
                            key={addMoreIndex}
                            value={item.choice}
                            onChange={(e) =>
                              this.addMoreChoice(e.target.value, addMoreIndex)
                            }
                            className="form-control"
                          />
                        </div>

                        <div className="col-md-5 mb-1 ">
                          <label>Sort Order</label>
                          <span className="text-danger">*</span>
                          <div className="position-relative form-group ">
                            <input
                              type="number"
                              value={item.sortorder}
                              onChange={(e) =>
                                this.addMoreOrder(e.target.value, addMoreIndex)
                              }
                              key={addMoreIndex}
                              className="form-control"
                              placeholder="Short Order..."
                              required=""
                              autoFocus=""
                              autoComplete="on"
                            />
                          </div>
                        </div>

                        <div
                          className="col-md-1 mb-1"
                          style={{ marginLeft: "3%", marginTop: "2.7%" }}
                        >
                          {/* <label>Active</label><span className="text-danger">*</span> */}
                          <div className="position-relative form-group m-2">
                            <div>
                              <div className="custom-checkbox custom-control">
                                <input
                                  className="custom-control-input"
                                  id={`${addMoreIndex+9811}`}
                                  name="Show"
                                  type="checkbox"
                                  value={item.active}
                                  checked={item.active ? "checkbox" : null}
                                  onChange={(e) =>
                                    this.addMoreActives(e.target.value, addMoreIndex)
                                  }
                                />
                                <input
                                  name="Show"
                                  type="hidden"
                                  value="false"
                                />
                                <label
                                  className="custom-control-label"
                                  htmlFor={`${addMoreIndex+9811}`}
                                >
                                  Active
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>

                        <span
                          className="addotherurl removeMore"
                          onClick={() => this.removeOther(addMoreIndex)}
                        >
                          <svg
                            style={{ marginTop: "5px" }}
                            viewBox="0 0 512 512"
                            className="svg-inline--fa fa-minus-circle fa-w-16 fa-2x"
                          >
                            <path
                              fill="currentColor"
                              d="M140 284c-6.6 0-12-5.4-12-12v-32c0-6.6 5.4-12 12-12h232c6.6 0 12 5.4 12 12v32c0 6.6-5.4 12-12 12H140zm364-28c0 137-111 248-248 248S8 393 8 256 119 8 256 8s248 111 248 248zm-48 0c0-110.5-89.5-200-200-200S56 145.5 56 256s89.5 200 200 200 200-89.5 200-200z"
                            ></path>
                          </svg>
                        </span>
                      </div>
                    ) : null;
                  })}


                  {this.state.showAddMoreUpdate &&(
                    <div className="col-12 pd-0 addmore"  >
                    <label className="form-label add-more">
                      Add more fields
                    </label>
                    <span className="addotherurl cursor" onClick={() => this.addMoreFields()}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                      >
                        <path
                          fill="currentColor"
                          d="M384 240v32c0 6.6-5.4 12-12 12h-88v88c0 6.6-5.4 12-12 12h-32c-6.6 0-12-5.4-12-12v-88h-88c-6.6 0-12-5.4-12-12v-32c0-6.6 5.4-12 12-12h88v-88c0-6.6 5.4-12 12-12h32c6.6 0 12 5.4 12 12v88h88c6.6 0 12 5.4 12 12zm120 16c0 137-111 248-248 248S8 393 8 256 119 8 256 8s248 111 248 248zm-48 0c0-110.5-89.5-200-200-200S56 145.5 56 256s89.5 200 200 200 200-89.5 200-200z"
                        ></path>
                      </svg>
                    </span>
                  </div>
                  )}
                  

                  {/* -------------------------SAVE-UPDATE-------------------------------------------- */}

                  <div className="card-footer">
                    <div className="col-md-12 mb-0 text-center">
                      {!this.state.Updateloading ? (
                        <>
                          <input
                            type="submit"
                            name="created"
                            value="SAVE"
                            className="btn-wide btn btn-success"
                            onClick={() => this.checkFeed()}
                          />

                            <a href="/feedback/questions">
                              <input
                                type="reset"
                                value="BACK"
                                className="btn-wide btn btn-light"
                                id="btnClear"
                                style={{ marginLeft: "2%" }}
                              />
                            </a>
                        </>
                      ) : (
                        <div className="btn-wide btn ">
                          <TailSpin
                            color="#00BFFF"
                            height={30}
                            width={50}
                            ariaLabel="loading"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ---------------------------------------------------------------------------------------------------- */}
            </div>
          </div>
        </div>
      </>
    );
  }
}
