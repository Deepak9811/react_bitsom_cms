import React, { useState, useEffect } from "react";
import { FaClipboardList } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import { AiOutlineDown, AiOutlineUp } from "react-icons/ai";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { MdPreview } from "react-icons/md";
import { BiShowAlt } from "react-icons/bi";
import { TailSpin } from "react-loader-spinner";
// import { Link } from "react-router-dom";
import Header from "./common/header";
import { Helmet } from "react-helmet";

export const Subcontent = () => {
  const [libconCode, setlibconCode] = useState("");
  const [contentData, setcontentData] = useState([]);
  const [loading, setloading] = useState(true);
  const [hideTable, sethideTable] = useState(false);
  const [messageShow, setmessageShow] = useState("");
  const [showChngPreview, setshowChngPreview] = useState(false);
  const [hideImageType, sethideImageType] = useState(false);
  const [loadingdata, setloadingdata] = useState(true);
  const [htmlData, sethtmlData] = useState([]);
  const [imgdata, setimgdata] = useState([]);
  const [hidePopData, sethidePopData] = useState("");
  const [bigLoader, setbigLoader] = useState(false);
  const [showUpDateDataBtn, setshowUpDateDataBtn] = useState(false);
  const [updateLoader, setupdateLoader] = useState(false);
  const [parentName, setparentName] = useState("");

  let [searchParams, setsearchParams] = useSearchParams();
  let naviagte = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);

    const libconCode = JSON.parse(localStorage.getItem("libCode"));
    // console.log("libconCode :- ", id);

    getChildData();

    setlibconCode(libconCode);
  }, []);

  const getChildData = () => {
    let id = searchParams.get("id");
    let parentName = searchParams.get("parent");

    setparentName(parentName);
    const libconCode = JSON.parse(localStorage.getItem("libCode"));
    console.log("libconCode :- ", parentName);
    let url = `${process.env.REACT_APP_API_kEY}showcontent?libid=${libconCode}&id=${id}`;

    fetch(url, {
      method: "GET",
      headers: {
        Accepts: "application/json",
        "content-type": "application/json",
      },
    })
      .then((result) => {
        result.json().then((resp) => {
          console.log(resp.data[0].childContent.length);
          if (resp.response === "Success") {
            if (resp.data[0].childContent.length !== 0) {
              setcontentData(resp.data[0].childContent);
              setloading(false);
              sethideTable(false);
            } else {
              setloading(false);
              sethideTable(true);
              setmessageShow("No data found");
            }
          } else {
            setloading(false);
            sethideTable(true);
            setmessageShow("No data found");
          }
        });
      })
      .catch((error) => {
        // setloading(false);
        // sethideTable(true);
        // setmessageShow("Something went wrong. Please try again.");
        // this.setState({
        //   loading: false,
        //   messageShow: "Something went wrong. Please try again.",
        //   hideTable: true,
        // });
      });
  };


  const showPreview = (item) => {
    // console.log(item.contentId,)
    let id = item.contentId;
    // console.log(this.state.contentData)
    if (showChngPreview === false) {
      setshowChngPreview(true);
      sethideImageType(true);
      setloadingdata(false);

      //   this.setState({
      //     showChngPreview: true,
      //     hideImageType: true,
      //     loadingdata: false,
      //   });
    } else {
      setshowChngPreview(false);
      sethideImageType(true);
      setloadingdata(false);

      //   this.setState({
      //     showChngPreview: false,
      //     hideImageType: true,
      //     loadingdata: false,
      //   });
    }
    // console.log(this.state.showChngPreview)
    const libconCode = JSON.parse(localStorage.getItem("libCode"));

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
            const html = resp.data[0].text;
            sethtmlData(html);
            setloadingdata(true);
            // this.setState({
            //   htmlData: html,
            //   loadingdata: true,
            // });

            if (resp.data[0].imageType === "") {
              sethideImageType(true);
              //   this.setState({
              //     hideImageType: true,
              //   });
            } else {
              setimgdata(resp.data[0].imageType);
              sethideImageType(false);
              //   this.setState({
              //     imgdata: resp.data[0].imageType,
              //     hideImageType: false,
              //   });
            }
          } else {
            sethideImageType(true);
            setloadingdata(true);
            sethidePopData(true);
            setmessageShow("No data found");
            // this.setState({
            //   hideImageType: true,
            //   loadingdata: true,
            //   hidePopData: true,
            //   messageShow: "No data found",
            // });
          }
        });
      })
      .catch((error) => {
        sethideImageType(true);
        setloadingdata(true);
        sethidePopData(true);
        setmessageShow("Something went wrong. Please try again.");

        // this.setState({
        //   hideImageType: true,
        //   loadingdata: true,
        //   hidePopData: true,
        //   messageShow: "Something went wrong. Please try again.",
        // });
      });
  };

  const hidePreview = () => {
    if (showChngPreview === false) {
      setshowChngPreview(true);
      //   this.setState({
      //     showChngPreview: true,
      //   });
    } else {
      setshowChngPreview(false);
      //   this.setState({
      //     showChngPreview: false,
      //   });
    }
  };

  const deleteContent = (item) => {
    if (window.confirm("Are you sure you want to delete this content?")) {
      setbigLoader(true);
      //   this.setState({
      //     bigLoader: true,
      //   });
      // console.log(item);
      let id = item.contentId;
      let url = `${process.env.REACT_APP_API_kEY}Delete?id=${id}&type=content`;

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
              setbigLoader(false);
              //   this.setState({
              //     bigLoader: false,
              //   });
              getChildData();
            } else {
              setbigLoader(false);
              //   this.setState({
              //     bigLoader: false,
              //   });
              alert("Something went wrong. Please try again.");
            }
          });
        })
        .catch((error) => {
          alert("Something went wrong.");
          setbigLoader(false);
        });
    }
  };

  const upData = (item, index) => {
    var check = contentData.findIndex((el) => el.contentId === item.contentId);
    if (check !== 0) {
      const addDown = [...contentData];

      addDown[index].SortOrder = check - 1;
      addDown[index - 1].SortOrder = check;

      setcontentData(addDown);

      //   this.setState({
      //     contentData: addDown,
      //   });

      var tmp = contentData[check];
      contentData[check] = contentData[check - 1];
      contentData[check - 1] = tmp;

      const newmcqNewData = [...contentData];

      setcontentData(newmcqNewData);
      setshowUpDateDataBtn(true);

      //   this.setState({
      //     contentData: newmcqNewData,
      //     showUpDateDataBtn: true,
      //   });
    }
  };

  const downData = (item, index) => {
    var check = contentData.findIndex((el) => el.contentId === item.contentId);

    if (check !== contentData.length - 1) {
      const addDown = [...contentData];

      addDown[index].SortOrder = check + 1;
      addDown[index + 1].SortOrder = check;

      setcontentData(addDown);

      //   this.setState({
      //     contentData: addDown,
      //   });

      var tmp = contentData[check];
      contentData[check] = contentData[check + 1];
      contentData[check + 1] = tmp;

      const newmcqNewData = [...contentData];

      setcontentData(newmcqNewData);
      setshowUpDateDataBtn(true);

      //   this.setState({
      //     contentData: newmcqNewData,
      //     showUpDateDataBtn: true,
      //   });

      console.log(check, contentData[check + 1]);
    }
  };

  const updateData = () => {
    console.log(contentData);
    setupdateLoader(true);
    // this.setState({
    //   updateLoader: true,
    // });

    let url = `${process.env.REACT_APP_API_kEY}updatecontent`;

    fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contentData),
    })
      .then((result) => {
        result.json().then((resp) => {
          console.log("response update :- ", resp);
          if (resp.response === "Success") {
            alert("Sub-Contents Upadate Succesfully.");
            setupdateLoader(false);
            getChildData();
            setshowUpDateDataBtn(false);
            // this.setState({
            //   updateLoader: false,
            //   showUpDateDataBtn: false,
            // });
          } else {
            setupdateLoader(false);
            // this.setState({
            //   updateLoader: false,
            // });
          }
        });
      })
      .catch((error) => {
        setupdateLoader(false);
        alert("Something went wrong. Please try again.");
      });
  };

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
                 SUB-CONTENT LIST
                  <div className="page-title-subheading">
                    Click on show content to show the content list.
                  </div>
                </div>
              </div>
              <div className="page-title-actions">
                <Link to="/contents">
                  <button type="button" className="mr-1 btn btn-success">
                    <BiShowAlt
                      className="fa pe-7s-help1"
                      style={{ marginBottom: "3%" }}
                    />{" "}
                    Show Content
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {!loading ? (
            <>
              <div className="main-card mb-0 card">
                <div className="card-header bg-info text-white">
                  List of sub-contentS
                  {showUpDateDataBtn ? (
                    <div className="col-md-3 ps-a">
                      {!updateLoader ? (
                        <input
                          id="contentimage"
                          name="contentimage"
                          type="submit"
                          className="btn-wide btn btn-danger fl-r"
                          value="Update"
                          onClick={() => updateData()}
                          // onChange={imageHandler}
                        />
                      ) : (
                        <div className="fl-r mrr-15">
                          <TailSpin
                            color="#FFF"
                            height={30}
                            width={50}
                            ariaLabel="loading"
                          />
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>

                <div className="card-body">
                  {!hideTable ? (
                    <div className="table-responsive">
                      <table className="mb-0 table table-striped table-hover">
                        <thead>
                          <tr>
                            <th>Heading</th>
                            {/* <th>Sort Order</th> */}
                            <th>Active</th>
                            <th style={{ width: "75px" }}>Edit</th>
                            <th style={{ width: "82px" }}>Preview</th>
                            <th style={{ width: "20px" }}>Delete</th>
                            <th style={{ width: "20px" }}>Position</th>
                          </tr>
                        </thead>
                        <tbody>
                          {contentData.map((item, i) => {
                            // console.log(item);
                            return (
                              <React.Fragment key={i}>
                                <tr>
                                  <td>{item.heading}</td>
                                  {/* <td>{item.SortOrder}</td> */}
                                  <td>
                                    <p>{item.Active.toString()}</p>
                                  </td>
                                  <Link
                                    to={
                                      "/Contentedit" +
                                      "?id=" +
                                      item.contentId +
                                      "&childId=" +
                                      item.parentId
                                      + "&parentname=" + parentName
                                    }
                                    className="wd-100"
                                  >
                                    <td className="edt wd-100">
                                      <p>
                                        <FaEdit></FaEdit>
                                      </p>
                                    </td>
                                  </Link>

                                  <td
                                    className="edt"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => showPreview(item)}
                                  >
                                    <p style={{ marginBottom: "5px" }}>
                                      <MdPreview
                                        size={22}
                                        style={{ color: "green" }}
                                      />
                                    </p>
                                  </td>

                                  <td
                                    className="edt"
                                    onClick={() => deleteContent(item)}
                                    style={{ cursor: "pointer" }}
                                  >
                                    <p style={{ marginBottom: "5px" }}>
                                      <RiDeleteBinLine
                                        size={22}
                                        style={{ color: "red" }}
                                      />
                                    </p>
                                  </td>

                                  <td>
                                    <p
                                      onClick={() => upData(item, i)}
                                      className="wd-50 crp"
                                    >
                                      <AiOutlineUp color="#000" size={20} />
                                    </p>
                                    <p
                                      onClick={() => downData(item, i)}
                                      className="wd-50 crp"
                                    >
                                      <AiOutlineDown size={20} color="#000" />
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
                    <h5 className="err">{messageShow}</h5>
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
      </div>

      {/*  */}
      {showChngPreview ? (
        <>
          <div
            className="modal fade bd-ChangePassword show"
            style={{ display: "block" }}
          >
            <div className="modal-dialog " style={{ background: "#fff" }}>
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" >
                   Sub-Content Preview
                  </h5>
                  <button
                    type="button"
                    className="close"
                    onClick={() => hidePreview()}
                  >
                    <span aria-hidden="true">×</span>
                  </button>
                </div>
                <div className="modal-body">
                  <>
                    {loadingdata ? (
                      <>
                        {!hidePopData ? (
                          <>
                            <div className="col">
                              {!hideImageType ? (
                                <img
                                  src={imgdata}
                                  alt="dk"
                                  width={450}
                                  height={300}
                                />
                              ) : null}
                            </div>
                            <div
                              dangerouslySetInnerHTML={{
                                __html: htmlData,
                              }}
                            ></div>
                          </>
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
                  </>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
};
