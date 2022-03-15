import React, { useState, useEffect } from "react";

import { EditorState, convertToRaw, ContentState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import { FiUsers } from "react-icons/fi";
import { BiShowAlt } from "react-icons/bi";

import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { TailSpin } from "react-loader-spinner";

import { Link, useSearchParams, useNavigate } from "react-router-dom";
import Header from "./common/header";
import { Helmet } from "react-helmet";

let htmlToDraft = null;
if (typeof window === "object") {
  htmlToDraft = require("html-to-draftjs").default;
}

export default function Contentedit() {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [profileImg, setprofileImg] = useState("");
  const [heading, setheading] = useState("");
  const [showChngPass, setshowChngPass] = useState(false);
  const [order, setorder] = useState("");
  const [system, setsystem] = useState(false);
  const [app, setapp] = useState("");
  const [loading, setloading] = useState(false);
  const [contentId, setcontentId] = useState("");
  const [showBackBtn, setshowBackBtn] = useState(false);
  const [showimage, setshowimage] = useState(require("./image/noimage.png"));
  const [libconCode, setlibconCode] = useState("");
  const [contentData, setcontentData] = useState([]);
  const [showimgHover, setshowimgHover] = useState(false);
  const [hideImage, sethideImage] = useState(true);
  const [bigLoader, setbigLoader] = useState(true);
  const [imageTypes, setimageTypes] = useState(".jpg");
  const [imagePath, setimagePath] = useState("");
  const [showChngPreview, setshowChngPreview] = useState(false);
  const [popUPData, setpopUPData] = useState([]);
  const [showViewImage, setshowViewImage] = useState(false);
  const [loadingdata, setloadingdata] = useState(false);
  const [messageShow, setmessageShow] = useState("");
  const [hidePopData, sethidePopData] = useState(false);

  let [searchParams, setSearchParams] = useSearchParams();
  let naviagte = useNavigate();

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
          getContentDetails(id, libconCode);
        }
      }
    };

    components();
  }, []);

  const getContentDetails = (id, libconCode) => {
    // const libconCode =  localStorage.setItem("user_name", JSON.stringify(resp.data.Name));

    fetch(
      `${process.env.REACT_APP_API_kEY}showcontent?libid=${libconCode}&id=${id}`,
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
          // console.log(resp);
          if (resp.response === "Success") {
            setcontentData(resp.data);
            setheading(resp.data[0].heading);
            setshowimgHover(true);
            setorder(resp.data[0].SortOrder);
            setsystem(resp.data[0].Active);
            setapp(resp.data[0].Show);
            setcontentId(resp.data[0].contentId);
            setshowBackBtn(true);
            sethideImage(false);
            setbigLoader(false);
            setimagePath(resp.data[0].imageType);

            if (resp.data[0].imageType === "") {
              setshowViewImage(false);
            } else {
              setshowViewImage(true);
            }

            if (resp.data[0].contentimage === "") {
              setshowimage(require("./image/noimage.png"));
              setshowimgHover(true);
              sethideImage(false);
            } else {
              setshowimgHover(true);
              sethideImage(false);
              let img = resp.data[0].contentimage;
              setshowimage(img);
            }
            // console.log("image :- ",showimage)
            const html = resp.data[0].text;
            const contentBlock = htmlToDraft(html);
            if (contentBlock) {
              const contentState = ContentState.createFromBlockArray(
                contentBlock.contentBlocks
              );
              const editorState = EditorState.createWithContent(contentState);
              console.log(draftToHtml(convertToRaw(editorState.getCurrentContent())))
              setEditorState(editorState);
            }
          } else {
            naviagte("/contents");
            alert("Something went wrong. Please try again.");
            setbigLoader(false);
          }
        });
      })
      .catch((error) => {
        naviagte("/contents");
        alert("There is problem in your credentials.");
      });
  };

  const onEditorStateChange = (editorState) => {
    setEditorState(editorState);
    console.log(draftToHtml(convertToRaw(editorState.getCurrentContent())));
  };

  const checkSaveContent = () => {
    let editorData = draftToHtml(convertToRaw(editorState.getCurrentContent()))
    if (heading !== "" && order !== ""   && editorData !==  "<p></p>\n") {
      setloading(true);
      if (profileImg.length === 0) {
        let typ = "";
        setimageTypes(typ);
      }

      saveContent();
    } else {
      setloading(false);
      alert("Please fill the details...");
      console.log(
        "heading :- ",
        heading,
        ", editor :- ",
        editorState,
        " order :- ",
        order
      );
    }
  };

  const saveContent = () => {
    fetch(`${process.env.REACT_APP_API_kEY}savecontent`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        contentId: contentId,
        libcode: libconCode,
        heading: heading,
        text: draftToHtml(convertToRaw(editorState.getCurrentContent())),
        SortOrder: order,
        imageType: imagePath,
        Active: system,
        Show: app,
        contentimage: "",
      }),
    })
      .then((result) => {
        result.json().then((resp) => {
          console.log("response :- ", resp);
          if (resp.response === "Success") {
            setloading(false);
            setcontentId("");
            setheading("");
            setorder("");
            // seteditorState(EditorState.createEmpty())
            setapp(false);
            setsystem(false);
            setprofileImg("");

            alert("Content Update Successfully.");
            naviagte("/contents");
          } else {
            setloading(false);

            alert("Something went wrong.");
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
    setcontentId("");
    setheading("");
    setorder("");
    // seteditorState("")
    setapp(false);
    setsystem(false);
    setprofileImg("");
    sethideImage(true);
  };

  const onlyNumberAllow = (e) => {
    const re = /^[0-9\b]+$/;
    if (e.target.value === "" || re.test(e.target.value)) {
      setorder(e.target.value);
      //  this.setState({order: e.target.value})
    }
  };

  return (
    <>
      <Helmet>
        <title>Content Edit</title>
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
                CONTENT - ADD/UPDATE
                <div className="page-title-subheading">
                  <p>
                    Enter the details and click on SAVE button to save the
                    details.
                  </p>
                </div>
              </div>
            </div>
            <div className="page-title-actions">
              <Link to={"/contents"}>
                <button type="button" className="mr-1 btn btn-success">
                  <BiShowAlt
                    className="fa pe-7s-help1"
                    style={{ marginBottom: "3%" }}
                  />{" "}
                  Show Contents
                </button>
              </Link>
            </div>
          </div>
        </div>

        <div className="txtb">
          <div className="card-header bg-info text-white">CONTENT DETAILS</div>

          <div style={{ padding: "1.25rem" }}>
            <div className="form-row">
              <div className="col-md-8 mb-1">
                <label>Heading</label>
                <span className="text-danger">*</span>

                <input
                  type="text"
                  value={heading}
                  onChange={(e) => setheading(e.target.value)}
                  className="form-control"
                  placeholder="Heading Name..."
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
              <div className="col-md-2 mb-1">
                <label>Sort Order</label>
                <span className="text-danger">*</span>
                <input
                  className="form-control"
                  id="SortOrder"
                  name="SortOrder"
                  type="text"
                  maxLength={3}
                  value={order}
                  onChange={
                    (e) => onlyNumberAllow(e)
                    // setorder(e.target.value)
                  }
                  // onChange={(e) =>
                  //   {setorder( e.target.value)}

                  // }
                />
              </div>

              <div className="col-md-3 mb-1" style={{ marginLeft: "8%" }}>
                <label>Keep Active In The System</label>
                <div className="position-relative form-group m-2">
                  <div>
                    <div className="custom-checkbox custom-control">
                      <input
                        className="custom-control-input"
                        id="exampleCustomInline6"
                        name="Active"
                        type="checkbox"
                        checked={system ? "checkbox" : null}
                        onChange={() => setsystem(system ? false : true)}
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
                        checked={app ? "checkbox" : null}
                        onChange={() => setapp(app ? false : true)}
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
                      type="submit"
                      name="created"
                      value="SAVE"
                      className="btn-wide btn btn-success"
                      onClick={() => checkSaveContent()}
                    />
                    {showBackBtn ? (
                      <Link to={"/contents"}>
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
    </>
  );
}
