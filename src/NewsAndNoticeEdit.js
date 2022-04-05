import React, { useState, useEffect } from "react";
import Header from "./common/header";
import { Helmet } from "react-helmet";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { RiCalendarEventLine } from "react-icons/ri";
import { BiShowAlt } from "react-icons/bi";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import { TailSpin } from "react-loader-spinner";

import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import draftToHtml from "draftjs-to-html";

let htmlToDraft = null;
if (typeof window === "object") {
  htmlToDraft = require("html-to-draftjs").default;
}

function NewsAndNotice() {
  const [heading, setheading] = useState("");
  const [imagePath, setimagePath] = useState("");
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [system, setsystem] = useState(true);
  const [inapp, setinapp] = useState(true);
  const [showChngPreview, setshowChngPreview] = useState(false);
  const [loadingdata, setloadingdata] = useState(false);
  const [popUPData, setpopUPData] = useState([]);
  const [hidePopData, sethidePopData] = useState(false);
  const [messageShow, setmessageShow] = useState("");
  const [showViewImage, setshowViewImage] = useState(false);
  const [loading, setloading] = useState(false);
  const [profileImg, setprofileImg] = useState("");
  const [imageTypes, setimageTypes] = useState(".jpg");
  const [bigLoader, setbigLoader] = useState(true);
  const [newId, setnewId] = useState('')

  let navigate = useNavigate();
  let [searchParams, setsearchParams] = useSearchParams();

  useEffect(() => {
    window.scrollTo(0, 0);
    let id = searchParams.get("id");
    setnewId(id)

    getNewsAndNotices(id);
  }, []);

  const getNewsAndNotices = (id) => {
    const libconCode = JSON.parse(localStorage.getItem("libCode"));
    console.log("libconCode :- ", libconCode);
    let url = `${process.env.REACT_APP_API_kEY}shownews?id=${id}&libcode=${libconCode}`;
    // let url = `${process.env.REACT_APP_API_kEY}getparent?libid=${libconCode}`;

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
            setheading(resp.data[0].newsheading);
            setimagePath(resp.data[0].imagetype);
            setsystem(resp.data[0].active);
            setinapp(resp.data[0].show);
            setbigLoader(false);

            const html = resp.data[0].maintext;
            const contentBlock = htmlToDraft(html);
            if (contentBlock) {
              const contentState = ContentState.createFromBlockArray(
                contentBlock.contentBlocks
              );
              const editorState = EditorState.createWithContent(contentState);
              console.log(
                draftToHtml(convertToRaw(editorState.getCurrentContent()))
              );
              setEditorState(editorState);
            }
          } else {
            navigate("/NewsAndNotices");
            alert("Something went wrong. Please try again.");
            setbigLoader(false);
          }
        });
      })
      .catch((error) => {
        navigate("/NewsAndNotices");
        alert("Something went wrong. Please try again.");
        setbigLoader(false);
      });
  };

  const onEditorStateChange = (editorState) => {
    setEditorState(editorState);

    console.log(draftToHtml(convertToRaw(editorState.getCurrentContent())));
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

  const checkNewsAndNotice = () => {
    let editorData = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    if (heading !== "" && editorData !== "<p></p>\n") {
      setloading(true);
      if (profileImg.length === 0) {
        let typ = "";
        setimageTypes(typ);
      }

      saveNewsAndNotice();
    } else {
      setloading(false);
      alert("Please fill the details...");
      console.log("heading :- ", heading, ", editor :- ", editorState);
    }
  };

  const saveNewsAndNotice = () => {
    // let url = `${process.env.REACT_APP_API_kEY}savecontent`
    let code = JSON.parse(localStorage.getItem("libCode"));
    let url = `${process.env.REACT_APP_API_kEY}savenews`;
    fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        ID: newId,
        newsheading: heading,
        libcode: code,
        maintext: draftToHtml(convertToRaw(editorState.getCurrentContent())),
        imagetype: imagePath,
        show: inapp,
        active: system,
      }),
    })
      .then((result) => {
        result.json().then((resp) => {
          // console.log("response :- ", resp);
          if (resp.response === "Success") {
            navigate("/newsandnotices");
            alert("Update Successfully.");
          } else {
            alert("Something went wrong.Please try again.");
          }
        });
      })
      .catch((error) => {
        alert("There is problem in your credentials. Please try again.");
        console.log("There is problem in your credentials." + error.message);
      });
  };

  return (
    <>
      <Helmet>
        <title>NewsAndNotice</title>
      </Helmet>

      <Header />

      {bigLoader ? (
        <div className="ldbi" style={{ position: "fixed" }}>
          <TailSpin
            color="#00BFFF"
            height={80}
            width={100}
            ariaLabel="loading"
          />
        </div>
      ) : null}

      <div className="txt" id="pddd">
        <div className="app-page-title">
          <div className="page-title-wrapper">
            <div className="page-title-heading">
              <div className="page-title-icon">
                <RiCalendarEventLine className="pe-7s-users icon-gradient bg-mean-fruit" />
              </div>
              <div>
                News And Notice - UPDATE
                <div className="page-title-subheading">
                  <p>
                    Enter the details and click on SAVE button to save the
                    details.
                  </p>
                </div>
              </div>
            </div>
            <div className="page-title-actions">
              <Link to={"/newsandnotices"}>
                <button type="button" className="mr-1 btn btn-success">
                  <BiShowAlt
                    className="fa pe-7s-help1"
                    style={{ marginBottom: "3%" }}
                  />{" "}
                  Show News And Notices
                </button>
              </Link>
            </div>
          </div>
        </div>

        <div className="txtb">
          <div className="card-header bg-info text-white">
            NEWS AND NOTICE DETAILS
          </div>

          <div style={{ padding: "1.25rem" }}>
            <div className="form-row mb-1">
              <div className="col-md-8 mb-1">
                <label>Heading</label>
                <span className="text-danger">*</span>

                <input
                  value={heading}
                  type="text"
                  className="form-control"
                  placeholder="Heading ..."
                  required=""
                  autoFocus=""
                  autoComplete="on"
                  onChange={(e) => setheading(e.target.value)}
                />
              </div>
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
                          //onClick={saveimage}
                          // onChange={this.imageHandler}
                        />
                      </a>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="mrt-2">
              <label>News And Notice Description</label>
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
              <div className="col-md-3 mb-1" style={{ marginLeft: "1%" }}>
                <label>Keep Active In The System</label>
                <div className="position-relative form-group m-2">
                  <div>
                    <div className="custom-checkbox custom-control">
                      <input
                        checked={system ? "checkbox" : null}
                        onChange={() => setsystem(system ? false : true)}
                        className="custom-control-input"
                        id="exampleCustomInline6"
                        name="Active"
                        type="checkbox"
                      />

                      <input name="Active" type="hidden" value="false" />
                      <label
                        className="custom-control-label"
                        htmlFor="exampleCustomInline6"
                      >
                        Active
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-3 mb-1" style={{ marginLeft: "8%" }}>
                <label>Keep Showing On The App</label>
                <div className="position-relative form-group m-2">
                  <div>
                    <div className="custom-checkbox custom-control">
                      <input
                        className="custom-control-input"
                        id="exampleCustomInline1"
                        name="Show"
                        type="checkbox"
                        checked={inapp ? "checkbox" : null}
                        onChange={() => setinapp(inapp ? false : true)}
                      />
                      <input name="Show" type="hidden" value="false" />
                      <label
                        className="custom-control-label"
                        htmlFor="exampleCustomInline1"
                      >
                        Show
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
                      onClick={() => checkNewsAndNotice()}
                      type="submit"
                      name="created"
                      value="SAVE"
                      className="btn-wide btn btn-success"
                    />
                    <Link to={"/newsandnotices"}>
                      <input
                        type="reset"
                        value="BACK"
                        className="btn-wide btn btn-light"
                        id="btnClear"
                        style={{ marginLeft: "2%" }}
                      />
                    </Link>
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
    </>
  );
}
export default NewsAndNotice;
