import React, { Component } from "react";

import {
  EditorState,
  convertToRaw,
} from "draft-js";
import draftToHtml from "draftjs-to-html";
import { FiUsers } from "react-icons/fi";
// import { BiShowAlt } from "react-icons/bs";
import { BiShowAlt } from "react-icons/bi";

import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import DatePicker from "react-datepicker";
import { TailSpin } from "react-loader-spinner";
import Header from './common/header';
import { Link } from 'react-router-dom'
import { withRouter } from './withRouter'
import moment from "moment";

import "react-datepicker/dist/react-datepicker.css";
import { Helmet } from "react-helmet";

let htmlToDraft = null;
if (typeof window === "object") {
  htmlToDraft = require("html-to-draftjs").default;
}


class Event extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editorState: EditorState.createEmpty(),
      profileImg: "",
      eventName: "",
      validFrom: new Date(),
      validUpto: new Date(),
      loading: false,
      physical: false,
      virtual: false,
      system: false,
      showValidFromDate: false,
      showValidUptoDate: false,
      showBackBtn: false,
      registrationLink: "",
      location: "",
      type: "",
      imageTypes: ".jpg",
      popUPData: []
    };
  }

  static async getInitialProps({ query }) {
    return { data: query };
  }

  componentDidMount() {
    window.scrollTo(0, 0)

    const libconCode = JSON.parse(localStorage.getItem("libCode"));
    console.log("libconCode :- ", libconCode, "editorState ", this.state.editorState)


    this.setState({
      libconCode: libconCode
    })


  }


  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    });
    // console.log(draftToHtml(convertToRaw(editorState.getCurrentContent())));
  };

  openPopUP() {
    this.setState(prevState => ({ showChngPreview: !prevState.showChngPreview }));
     this.state.loadingdata=false;
    const libconCode = JSON.parse(localStorage.getItem("libCode"));

    let url = `http://192.168.1.217:1003/showimage?id=0&libcode=${libconCode}`;

    fetch(url, {
      method: "GET",
      headers: {
        Accepts: "application/json",
        "content-type": "application/json",
      },
    })
      .then((result) => {
        result.json().then((resp) => {
          console.log(resp)
          if (resp.response === "Success") {
            this.setState({
              popUPData: resp.data,
              loadingdata:true
            })
          }
        });
      }).catch((error) => {


      });

  }
  getImageDetails(item, i) {
    this.setState(prevState => ({ showChngPreview: !prevState.showChngPreview }));
    this.setState({
      imagePath: item.url,
      showViewImage: true
    })
  }

  removeImage() {
    this.setState({
      imagePath: "",
      showViewImage: false
    })

  }
  imageHandler = (e) => {
    this.setState({
      hideImage: false
    })
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        this.setState({
          showimage: reader.result,
          showimgHover: true,
        });
        let png = reader.result;
        png = png.includes("data:image/png;base64,");

        let jpg = reader.result;
        jpg = jpg.includes("data:image/jpg;base64,");

        let jpeg = reader.result;
        jpeg = jpeg.includes("data:image/jpeg;base64,");

        if (png === true) {
          let data = reader.result.replace("data:image/png;base64,", "");
          this.setState({
            profileImg: data,
          });
          // console.log("replace png :- ", data);
        } else if (jpg === true) {
          let data = reader.result.replace("data:image/jpg;base64,", "");
          this.setState({
            profileImg: data,
          });
          // console.log("replace jpg :- ", data);
        } else if (jpeg === true) {
          let data = reader.result.replace("data:image/jpeg;base64,", "");
          this.setState({
            profileImg: data,
          });
          // console.log("replace jpeg :- ", data);
        }
      }
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  checkSaveContent() {
    const {
      editorState,
      eventName,
      physical,
      system,
      virtual,
      profileImg,
      validFrom,
      validUpto,
      location,
      registrationLink,
      type,
      id,
      libconCode
    } = this.state;
    if (this.state.eventName !== "" && this.state.editorState !== "" && location !== "" && registrationLink !== "" && type !== "") {
      this.setState({
        loading: true,
      });
      if (this.state.profileImg.length === 0) {
        let typ = ""
        this.state.imageTypes = typ
        // console.log("this.state.profileImg :- ",this.state.profileImg.length,this.state.imageTypes)
      }
      this.saveContent();
    } else {
      this.setState({
        loading: false,
      });
      alert("Please fill the details...");
    }
  }

  saveContent() {
    const {
      editorState,
      eventName,
      physical,
      system,
      virtual,
      profileImg,
      validFrom,
      validUpto,
      location,
      registrationLink,
      type,
      id,
      libconCode
    } = this.state;

    fetch(`http://192.168.1.217:1003/saveevent`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        id: id,
        libcode: libconCode,
        eventName: eventName,
        type: type,
        description: draftToHtml(convertToRaw(editorState.getCurrentContent())),
        organiser: "BITSoM",
        imageType: this.state.imagePath,
        virtualMode: virtual,
        physicalMode: physical,
        validFrom: moment(this.state.validFrom).format("MM-DD-YYYY hh:mm:ss a"),
        validUpto: moment(this.state.validUpto).format("MM-DD-YYYY hh:mm:ss a"),
        location: location,
        registrationLink: registrationLink,
        active: system,
        contentImage: profileImg,
      }),
    })
      .then((result) => {
        result.json().then((resp) => {
          // console.log("response :- ", resp);
          if (resp.response === "Success") {
            this.setState({
              loading: false,
              editorState: "",
              eventName: "",

              validFrom: "",
              validUpto: "",
              location: "",
              registrationLink: "",
              type: "",
              physical: false,
              system: false,
              virtual: false,
            });
            alert("Event Add Successfully.")
            this.props.navigate('/events')
          } else {
            this.setState({
              loading: false,
            });
            alert("Something wents wrong.");
          }
        });
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });
        // console.log("There is problem in your credentials." + error.message);
      });
  }

  reset() {
    this.setState({
      loading: false,
      editorState: "",
      eventName: "",
      hideImage: true,
      profileImg: "",
      validFrom: new Date(),
      validUpto: new Date(),
      location: "",
      registrationLink: "",
      type: "",
      physical: false,
      system: false,
      virtual: false,
    });
  }

  ExampleCustomTimeInput = ({ date, value, onChange }) => (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{ border: "solid 1px pink" }}
    />
  );

  render() {

    return (
      <>

        <Helmet>
          <title>Event</title>
        </Helmet>

        <Header />

        <div className="txt" id="pddd">
          <div className="app-page-title">
            <div className="page-title-wrapper">
              <div className="page-title-heading">
                <div className="page-title-icon">
                  <FiUsers className="pe-7s-users icon-gradient bg-mean-fruit" />
                </div>
                <div>
                  EVENT - ADD/UPDATE
                  <div className="page-title-subheading">
                    <p>
                      Enter the details and click on SAVE button to save the
                      details.
                    </p>
                  </div>
                </div>
              </div>
              <div className="page-title-actions">
                <Link to={"/events"}>
                  <button type="button" className="mr-1 btn btn-success">
                    <BiShowAlt
                      className="fa pe-7s-help1"
                      style={{ marginBottom: "3%" }}
                    />{" "}
                    Show Events
                  </button>
                </Link>
              </div>
            </div>
          </div>

          <div className="txtb">
            <div className="card-header bg-info text-white">EVENT DETAILS</div>

            <div style={{ padding: "1.25rem" }}>
              <div className="form-row mb-1">
                <div className="col-md-8 mb-1">
                  <label>Event Name</label>
                  <span className="text-danger">*</span>

                  <input
                    type="text"
                    value={this.state.eventName}
                    onChange={(e) => this.setState({ eventName: e.target.value })}
                    className="form-control"
                    placeholder="Event Name..."
                    required=""
                    autoFocus=""
                    autoComplete="on"
                  />
                </div>

              </div>

              <div className="form-row">
                <div className="col-md-6 mb-1">
                  <label>Image Path</label>
                  <span className="text-danger"></span>

                  <input
                    value={this.state.imagePath}
                    type="text"
                    readOnly={true}
                    className="form-control"
                    placeholder="Image Path....."
                    required=""
                    autoFocus=""
                    autoComplete="on"
                  />
                </div>
                <div className="col-md-6">
                  <div className="form-row">
                    <div className="col-md-3" style={{ marginTop: "31px" }}>
                      <input
                      style={{width:"110px"}}
                        id="contentimage"
                        name="contentimage"
                        type="submit"
                        className="btn-wide btn btn-success"
                        value="Select Image"
                        onClick={() => this.openPopUP()}
                       
                      />
                    </div>
                    <div className="col-md-3" style={{ marginTop: "31px" }}>
                      <input

                        id="contentimage"
                        name="contentimage"
                        type="submit"
                        className="btn-wide btn btn-danger"
                        value="Remove Image"
                        onClick={() => this.removeImage()}
                      // onChange={this.imageHandler}
                      />
                    </div>
                    {/* URL CHANGE .................*/}
                    <div className="col-md-3" style={{ marginTop: "31px" }}>
                      <a href="http://localhost:3000/addimage" target={"_blank"}>

                        <input
                          style={{ width: "110px" }}
                          id="contentimage"
                          name="contentimage"
                          type="submit"
                          className="btn-wide btn btn-primary"
                          value="Add Image"
                          //onClick={() => this.removeImage()}

                        />

                      </a>
                    </div>
                    {/* URL CHANGE ....................*/}

                    {this.state.showViewImage ? (
                       <div className="col-md-3" style={{ marginTop: "31px" }}>
                      <a href={`${this.state.imagePath}`} target={"_blank"}>
                       
                          <input
                            style={{width:"110px"}}
                            id="contentimage"
                            name="contentimage"
                            type="submit"
                            className="btn-wide btn btn-warning"
                            value="View Image"
                          //onClick={saveimage}
                          // onChange={this.imageHandler}
                          />
                       
                      </a>
                      </div>
                    ) : null}
                  </div>
                </div>

              </div>




              <div className="form-row">
                <div className="col-md-8 mb-1">
                  <label>Location</label>
                  <span className="text-danger">*</span>

                  <input
                    type="text"
                    value={this.state.location}
                    onChange={(e) => this.setState({ location: e.target.value })}
                    className="form-control"
                    placeholder="Location..."
                    required=""
                    autoFocus=""
                    autoComplete="on"
                  />
                </div>

                <div className="col-md-3 mb-1 ">
                  <label>Valid From </label>
                  <span className="text-danger">*</span>
                  <div className="position-relative form-group ">
                    {this.state.showValidFromDate ? (
                      <DatePicker
                        value={this.state.validFrom}
                        onChange={(date) => this.setState({
                          validFrom: date,
                          showValidFromDate: false
                        })}
                        // customTimeInput={<ExampleCustomTimeInput />}
                        dateFormat="MM/dd/yyyy h:mm aa"
                        showTimeInput
                        className="form-control"
                      />
                    ) : (
                      <DatePicker
                        selected={this.state.validFrom}
                        onChange={(date) => this.setState({ validFrom: date })}
                        // customTimeInput={<ExampleCustomTimeInput />}
                        dateFormat="MM/dd/yyyy hh:mm aa"
                        showTimeInput
                        className="form-control"
                      />
                    )}
                  </div>
                </div>

                
              </div>

              <div className="form-row">
                <div className="col-md-8 mb-1">
                  <label>Registration Link</label>
                  <span className="text-danger">*</span>

                  <input
                    type="text"
                    value={this.state.registrationLink}
                    onChange={(e) =>
                      this.setState({ registrationLink: e.target.value })
                    }
                    className="form-control"
                    placeholder="Registration Link..."
                    required=""
                    autoFocus=""
                    autoComplete="on"
                  />
                </div>

                <div className="col-md-3 mb-1 ">
                  <label>Valid Upto</label>
                  <span className="text-danger">*</span>
                  <div className="position-relative form-group ">



                    {this.state.showValidUptoDate ? (
                      <DatePicker
                        value={this.state.validUpto}
                        onChange={(date) => this.setState({
                          validUpto: date,
                          showValidUptoDate: false
                        })}
                        timeInputLabel="Time:"
                        dateFormat="MM/dd/yyyy h:mm aa"
                        showTimeInput
                        className="form-control"
                      />
                    ) : (
                      <DatePicker
                        selected={this.state.validUpto}
                        onChange={(date) => this.setState({ validUpto: date })}
                        timeInputLabel="Time:"
                        dateFormat="MM/dd/yyyy h:mm aa"
                        showTimeInput
                        className="form-control"
                      />
                    )}
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="col-md-3 mb-1">
                  <label>Type</label>
                  <span className="text-danger">*</span>

                  <input
                    type="text"
                    value={this.state.type}
                    onChange={(e) => this.setState({ type: e.target.value })}
                    className="form-control"
                    placeholder="Type..."
                    required=""
                    autoFocus=""
                    autoComplete="on"
                  />
                </div>
              </div>

              <div className="mrt-2">
                <label>Content Description</label>
                <span className="text-danger">*</span>
              </div>

              <div className="textEditor">
                <Editor
                  editorState={this.state.editorState}
                  toolbarClassName="toolbar-class"
                  wrapperClassName="wrapper-class"
                  editorClassName="editor-class"
                  onEditorStateChange={this.onEditorStateChange}
                  // toolbarOnFocus
                  toolbar={{
                    options: [
                      "inline",
                      "blockType",
                      "fontSize",
                      "fontFamily",
                      "list",
                      "textAlign",
                      "colorPicker",
                      "link",
                      "embedded",
                      "emoji",
                      "history",
                    ],
                    inline: { inDropdown: false },
                    list: { inDropdown: false },
                    textAlign: { inDropdown: false },
                    link: { inDropdown: false },
                    history: { inDropdown: false },
                    
                  }}
                />
                
              </div>

              <div
                className="form-row"
                style={{ marginTop: "2%", marginBottom: "2%" }}
              >
                <div className="col-md-3 mb-1">
                  <label>Is Physical Mode</label>
                  <div className="position-relative form-group m-2">
                    <div>
                      <div className="custom-checkbox custom-control">
                        <input
                          className="custom-control-input"
                          id="exampleCustomInline6"
                          name="Active"
                          type="checkbox"
                          checked={this.state.physical ? "checkbox" : null}
                          onChange={() =>
                            this.setState({
                              physical: this.state.physical ? false : true,
                            })
                          }
                        />

                        <input name="Active" type="hidden" value="false" />
                        <label
                          className="custom-control-label"
                          htmlFor="exampleCustomInline6"
                        >
                          Physical
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-3 mb-1" style={{ marginLeft: "8%" }}>
                  <label>Is Virtual Mode</label>
                  <div className="position-relative form-group m-2">
                    <div>
                      <div className="custom-checkbox custom-control">
                        <input
                          className="custom-control-input"
                          id="exampleCustomInline1"
                          name="Show"
                          type="checkbox"
                          checked={this.state.virtual ? "checkbox" : null}
                          onChange={() =>
                            this.setState({
                              virtual: this.state.virtual ? false : true,
                            })
                          }
                        />
                        <input name="Show" type="hidden" value="false" />
                        <label
                          className="custom-control-label"
                          htmlFor="exampleCustomInline1"
                        >
                          Virtual
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-3 mb-1" style={{ marginLeft: "8%" }}>
                  <label>Keep Active In The System</label>
                  <div className="position-relative form-group m-2">
                    <div>
                      <div className="custom-checkbox custom-control">
                        <input
                          className="custom-control-input"
                          id="systemActivity"
                          name="Active"
                          type="checkbox"
                          checked={this.state.system ? "checkbox" : null}
                          onChange={() =>
                            this.setState({
                              system: this.state.system ? false : true,
                            })
                          }
                        />

                        <input name="Active" type="hidden" value="false" />
                        <label
                          className="custom-control-label"
                          htmlFor="systemActivity"
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
                        onClick={() => this.checkSaveContent()}
                      />

                      {this.state.showBackBtn ? (

                        <Link to={"/events"} >
                          <input
                            type="reset"
                            value="BACK"
                            className="btn-wide btn btn-light"
                            id="btnClear"
                            style={{ marginLeft: "2%" }}
                          />
                        </Link>
                      ) : (
                        <Link to={"#"}>
                          <input
                            type="reset"
                            value="RESET"
                            className="btn-wide btn btn-light"
                            id="btnClear"
                            style={{ marginLeft: "2%" }}
                            onClick={() => this.reset()}
                          />
                        </Link>

                      )}
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
              {this.state.showChngPreview ? (
                <>
                  <div
                    className="modal fade bd-ChangePassword show"
                    style={{ display: "block" }}
                  >
                    <div className="modal-dialog " style={{ background: "#fff" }}>
                      <div className="modal-content">
                        <div className="modal-header">
                          <h5 id="exampleModalLongTitle">Image List</h5>
                          


                          <button type="button" className="close" onClick={() => this.openPopUP()}>
                            <span aria-hidden="true">×</span>
                          </button>
                        </div>
                        
                        <div className="modal-body" >
                        {
                          this.state.loadingdata ?(
                            <div className="form-row">
                            {this.state.popUPData.map((item, i) => {
                              return (
                                <React.Fragment key={i}>
                                  <div className="col-4" onClick={() => this.getImageDetails(item, i)} style={{ marginBottom: "2%" }}>
                                    <img
                                      src={item.url}
                                      alt="Content"
                                      width={150}
                                      height={100}
                                      style={{ borderRadius: "5px", backgroundColor: "#ebebeb" }}
                                    />
                                  </div>

                                </React.Fragment>
                              )
                            })}
                          </div>
                          ):(
                            <div className="btn-wide btn " style={{marginLeft:"40%"}}>
                      <TailSpin
                      
                        color="#00BFFF"
                        height={30}
                        width={50}
                        ariaLabel="loading"
                      />
                    </div>
                          )
                        }
                         
                        </div>



                      </div>
                    </div>
                  </div>

                </>
              ) : null}
            </div>
          </div>
        </div>
      </>
    );
  }
}


export default withRouter(Event)