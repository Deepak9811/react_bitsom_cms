import React, { useState, useEffect } from "react";

import { EditorState, convertToRaw, ContentState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import { FiUsers } from "react-icons/fi";
import { BiShowAlt } from "react-icons/bi";

import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import DatePicker from "react-datepicker";
import { TailSpin } from "react-loader-spinner";
import moment from "moment";
import Header from "./common/header";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

let htmlToDraft = null;
if (typeof window === "object") {
  htmlToDraft = require("html-to-draftjs").default;
}

function Eventedit() {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [profileImg, setprofileImg] = useState("");
  const [eventName, seteventName] = useState("");
  const [validFrom, setvalidFrom] = useState(new Date());
  const [validUpto, setvalidUpto] = useState(new Date());
  const [loading, setloading] = useState(false);
  const [physical, setphysical] = useState(false);
  const [virtual, setvirtual] = useState(false);
  const [system, setsystem] = useState(false);
  const [showValidFromDate, setshowValidFromDate] = useState(false);
  const [showValidUptoDate, setshowValidUptoDate] = useState(false);
  const [showBackBtn, setshowBackBtn] = useState(false);
  const [registrationLink, setregistrationLink] = useState("");
  const [location, setlocation] = useState("");
  const [type, settype] = useState("");
  const [showimage, setshowimage] = useState(require("./image/noimage.png"));
  const [contentData, setcontentData] = useState([]);
  const [showimgHover, setshowimgHover] = useState(false);
  const [id, setid] = useState("");
  const [libconCode, setlibconCode] = useState("");
  const [hideImage, sethideImage] = useState(true);
  const [bigLoader, setbigLoader] = useState(true);
  const [imageTypes, setimageTypes] = useState(".jpg");
  const [imagePath, setimagePath] = useState("");
  const [showViewImage, setshowViewImage] = useState(false);
  const [showChngPreview, setshowChngPreview] = useState(false);
  const [popUPData, setpopUPData] = useState([]);
  const [loadingdata, setloadingdata] = useState(false);
  const [messageShow, setmessageShow] = useState("");
  const [hidePopData, sethidePopData] = useState(false);

  let naviagte = useNavigate();
  let [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    window.scrollTo(0, 0);
    const components = async () => {
      const id = searchParams.get("id");
      const type = searchParams.get("type");
      const libconCode = JSON.parse(localStorage.getItem("libCode"));
      // console.log("libconCode :- ", libconCode);
      setlibconCode(libconCode);

      if (searchParams) {
        // console.log(searchParams);
        if (searchParams.get("id")) {
          getContentDetails(libconCode, id);
        }
      }
    };

    components();
  }, []);

  const getContentDetails = (libconCode, id) => {
    fetch(`${process.env.REACT_APP_API_kEY}showevent?libid=${libconCode}&id=${id}`, {
      method: "GET",
      headers: {
        Accepts: "application/json",
        "content-type": "application/json",
      },
    })
      .then((result) => {
        result.json().then((resp) => {
          console.log("Data=", resp.data);
          //   console.log("ValidFrom=", resp.data[0].contentImage);
          if (resp.response === "Success") {
            setshowBackBtn(true);
            setshowValidFromDate(true);
            setshowValidUptoDate(true);
            setcontentData(resp.data);
            seteventName(resp.data[0].eventName);
            setlocation(resp.data[0].location);
            settype(resp.data[0].type);
            setregistrationLink(resp.data[0].registrationLink);
            setshowimgHover(true);
            setphysical(resp.data[0].physicalMode);
            setsystem(resp.data[0].active);
            setvirtual(resp.data[0].virtualMode);
            setvalidFrom(
              moment(resp.data[0].validFrom)
                .format("MM-DD-YYYY hh:mm a")
                .replace("T", " ")
            );
            setvalidUpto(
              moment(resp.data[0].validUpto)
                .format("MM-DD-YYYY hh:mm a")
                .replace("T", " ")
            );
            setid(resp.data[0].id);
            setbigLoader(false);
            setimagePath(resp.data[0].imageType);

            if (resp.data[0].imageType === "") {
              setshowViewImage(false);
            } else {
              setshowViewImage(true);
            }

            if (resp.data[0].contentImage === "") {
              setshowimage(require("./image/noimage.png"));
              setshowimgHover(true);
              sethideImage(false);
            } else {
              setshowimgHover(true);
              sethideImage(false);

              let img = resp.data[0].contentImage;
              setshowimage(img);
            }

            const html = resp.data[0].description;
            const contentBlock = htmlToDraft(html);
            if (contentBlock) {
              const contentState = ContentState.createFromBlockArray(
                contentBlock.contentBlocks
              );
              const editorState = EditorState.createWithContent(contentState);
              setEditorState(editorState);
            }
          } else {
            naviagte("/events");
            alert("Something went wrong. Please try again.");
            setbigLoader(false);
          }
        });
      })
      .catch((error) => {
        alert("There is problem in your credentials.");
      });
  };

  const onEditorStateChange = (editorState) => {
    setEditorState(editorState);
    // this.setState({
    //   editorState,
    // });
    console.log(draftToHtml(convertToRaw(editorState.getCurrentContent())));
  };

  const checkSaveContent = () => {
    let editorData = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    // if (this.state.eventName != "" && this.state.editorState != "" && location != "" && registrationLink != "" && type != "") {
    if (
      eventName !== "" &&
      editorState !== "" &&
      location != "" &&
      registrationLink != "" &&
      type != "" &&
      editorData !== "<p></p>\n"
    ) {
      setloading(true);

      if (profileImg.length === 0) {
        let typ = "";
        setimageTypes(typ);
        // console.log("this.state.profileImg :- ",this.state.profileImg.length,this.state.imageTypes)
      }
      saveContent();
    } else {
      setloading(false);

      alert("Please fill the details...");
    }
  };

  const saveContent = () => {
    console.log("chekcing");

    fetch(`${process.env.REACT_APP_API_kEY}saveevent`, {
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
        imageType: imagePath,
        virtualMode: virtual,
        physicalMode: physical,
        validFrom: moment(validFrom).format("MM-DD-YYYY hh:mm:ss a"),
        validUpto: moment(validUpto).format("MM-DD-YYYY hh:mm:ss a"),
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
            naviagte("/events");
            alert("Event Update Successfully.");
          } else {
            setloading(false);
            // this.setState({
            //     loading: false,
            // });
            alert("Something wents wrong.");
          }
        });
      })
      .catch((error) => {
        setloading(false);
        console.log("There is problem in your credentials." + error.message);
      });
  };
  const openPopUP = () => {
    // this.setState(prevState => ({ showChngPreview: !prevState.showChngPreview }));

    if (showChngPreview === true) {
      setshowChngPreview(false);
    } else {
      setshowChngPreview(true);
    }
    setloadingdata(false);
    const libconCode = JSON.parse(localStorage.getItem("libCode"));

    let url = `${process.env.REACT_APP_API_kEY}showimage?id=0&libcode=${libconCode}`;

    fetch(url, {
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
            setpopUPData(resp.data);
            setloadingdata(true);
            sethidePopData(false);
          } else {
            setloadingdata(true);
            sethidePopData(true);
            setmessageShow("No data found");
          }
        });
      })
      .catch((error) => {
        setloadingdata(true);
        setmessageShow("Something went wrong. Please try again.");
        sethidePopData(true);
      });
  };

  const getImageDetails = (item, i) => {
    if (showChngPreview === true) {
      setshowChngPreview(false);
    } else {
      setshowChngPreview(true);
    }

    setimagePath(item.url);
    setshowViewImage(true);
  };
  const removeImage = () => {
    setshowViewImage(false);
    setimagePath("");
  };
  const reset = () => {
    setloading(false);
    setshowBackBtn(false);
    setshowValidFromDate(false);
    setshowValidUptoDate(false);
    setcontentData("");
    seteventName("");
    setlocation("");
    settype("");
    setregistrationLink("");
    setshowimgHover(false);
    setphysical(false);
    setsystem(false);
    setvirtual(false);
    setid("");
  };

  return (
    <>
      <Helmet>
        <title>Event Edit</title>
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
                  value={eventName}
                  onChange={(e) => seteventName(e.target.value)}
                  className="form-control"
                  placeholder="Event Name..."
                  required=""
                  autoFocus=""
                  autoComplete="on"
                />
              </div>

              {/* <div className="col-md-2 mb-1 ">
                                    <label>Image</label>
                                    <input
                                        className="form-control-file"
                                        id="contentimage"
                                        name="contentimage"
                                        type="file"
                                        value=""
                                        accept="image/*"
                                        onChange={imageHandler}
                                    />
                                </div> */}

              {/* {showimgHover ? (
                                    <div className="col-md-1 mb-1 imghover" style={{ display: hideImage ? "none" : "block" }}>
                                        <img
                                            src={showimage}
                                            alt="profile"
                                            className="preImage"
                                        />

                                        <div className="imgh">
                                            <img
                                                src={showimage}
                                                alt="profile"
                                                className="ImghImage"
                                                width={400}
                                                height={400}
                                            />
                                        </div>
                                    </div>
                                ) : null} */}
            </div>

            <div className="form-row">
              <div className="col-md-6 mb-1">
                <label>Image Path</label>
                <span className="text-danger"></span>

                <input
                  value={imagePath}
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
                      style={{ width: "110px" }}
                      id="contentimage"
                      name="contentimage"
                      type="submit"
                      className="btn-wide btn btn-success"
                      value="Select Image"
                      onClick={() => openPopUP()}
                    />
                  </div>
                  <div className="col-md-3" style={{ marginTop: "31px" }}>
                    <input
                      id="contentimage"
                      name="contentimage"
                      type="submit"
                      className="btn-wide btn btn-danger"
                      value="Remove Image"
                      onClick={() => removeImage()}
                      // onChange={this.imageHandler}
                    />
                  </div>

                  {/* URL CHANGE .................*/}
                  <div className="col-md-3" style={{ marginTop: "31px" }}>
                    <a href="/addimage" target={"_blank"}>
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
                  {showViewImage ? (
                    <div className="col-md-3" style={{ marginTop: "31px" }}>
                      <a href={`${imagePath}`} target={"_blank"}>
                        <input
                          style={{ width: "110px" }}
                          id="contentimage"
                          name="contentimage"
                          type="submit"
                          className="btn-wide btn btn-warning"
                          value="View Image"
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
                  value={location}
                  onChange={(e) => setlocation(e.target.value)}
                  className="form-control"
                  placeholder="location..."
                  required=""
                  autoFocus=""
                  autoComplete="on"
                />
              </div>

              <div className="col-md-3 mb-1 ">
                <label>Valid From Date</label>
                <span className="text-danger">*</span>
                <div className="position-relative form-group ">
                  {showValidFromDate ? (
                    <DatePicker
                      value={validFrom}
                      onChange={(data) => {
                        setvalidFrom(data);
                        setshowValidFromDate(false);
                      }}
                      // onChange={(date) => setState({
                      //     validFrom: date,
                      //     showValidFromDate: false
                      // })}
                      dateFormat="MM/dd/yyyy h:mm aa"
                      showTimeInput
                      className="form-control"
                    />
                  ) : (
                    <DatePicker
                      selected={validFrom}
                      // onChange={(date) => setState({ validFrom: date })}
                      onChange={(data) => setvalidFrom(data)}
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
                  value={registrationLink}
                  onChange={(e) => setregistrationLink(e.target.value)}
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
                  {showValidUptoDate ? (
                    <DatePicker
                      value={validUpto}
                      onChange={(data) => {
                        setvalidUpto(data);
                        setshowValidUptoDate(false);
                      }}
                      // onChange={(date) => setState({
                      //     validUpto: date,
                      //     showValidUptoDate: false
                      // })}
                      timeInputLabel="Time:"
                      dateFormat="MM/dd/yyyy h:mm aa"
                      showTimeInput
                      className="form-control"
                    />
                  ) : (
                    <DatePicker
                      selected={validUpto}
                      // onChange={(date) => setState({ validUpto: date })}
                      onChange={(data) => setvalidUpto(data)}
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
                  value={type}
                  onChange={(e) => settype(e.target.value)}
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
                editorState={editorState}
                toolbarClassName="toolbar-class"
                wrapperClassName="wrapper-class"
                editorClassName="editor-class"
                onEditorStateChange={onEditorStateChange}
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
                        checked={physical ? "checkbox" : null}
                        onChange={
                          () => setphysical(physical ? false : true)
                          // setState({
                          //     physical: physical ? false : true,
                          // })
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
                        checked={virtual ? "checkbox" : null}
                        onChange={
                          () => setvirtual(virtual ? false : true)
                          // setState({
                          //     virtual: virtual ? false : true,
                          // })
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
                        checked={system ? "checkbox" : null}
                        onChange={
                          () => setsystem(system ? false : true)
                          // setState({
                          //     system: system ? false : true,
                          // })
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
                {!loading ? (
                  <>
                    <input
                      type="submit"
                      name="created"
                      value="SAVE"
                      className="btn-wide btn btn-success"
                      onClick={() => checkSaveContent()}
                    />

                    {showBackBtn ? (
                      <Link to={"/events"}>
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
                          onClick={() => reset()}
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
          </div>

          {showChngPreview ? (
            <>
              <div
                className="modal fade bd-ChangePassword show"
                style={{ display: "block" }}
              >
                <div className="modal-dialog " style={{ background: "#fff" }}>
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 id="exampleModalLongTitle">Image List</h5>
                      <button
                        type="button"
                        className="close"
                        onClick={() => openPopUP()}
                      >
                        <span aria-hidden="true">×</span>
                      </button>
                    </div>
                    <div className="modal-body">
                      {loadingdata ? (
                        <>
                          {!hidePopData ? (
                            <div className="form-row">
                              {popUPData.map((item, i) => {
                                return (
                                  <React.Fragment key={i}>
                                    <div
                                      className="col-4"
                                      onClick={() => getImageDetails(item, i)}
                                      style={{ marginBottom: "2%" }}
                                    >
                                      <img
                                        src={item.url}
                                        alt="Content"
                                        width={150}
                                        height={100}
                                        style={{
                                          borderRadius: "5px",
                                          backgroundColor: "#ebebeb",
                                          cursor: "pointer",
                                        }}
                                      />
                                    </div>
                                  </React.Fragment>
                                );
                              })}
                            </div>
                          ) : (
                            <h5 className="err">{messageShow}</h5>
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
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : null}

          {bigLoader ? (
            <div className="ldbi">
              <TailSpin
                color="#00BFFF"
                height={80}
                width={100}
                ariaLabel="loading"
              />
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}

export default Eventedit;
