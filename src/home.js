import React, { useState, useEffect } from "react";
import { FaClipboardList } from "react-icons/fa";
import { BiBookContent,BiChevronsRight } from "react-icons/bi";
import { MdFeedback } from "react-icons/md";
import { BsFillCalendarEventFill,BsReceipt } from "react-icons/bs";
import { Helmet } from "react-helmet";
import Header from "./common/header";
import { Link } from "react-router-dom";
import { TailSpin } from "react-loader-spinner";

const Home = () => {

  const [countData, setcountData] = useState('')
  const [content, setcontent] = useState("0")
  const [event, setevent] = useState("0")
  const [feedback, setfeedback] = useState("0")
  const [response, setresponse] = useState("0")
  const [loader, setloader] = useState(true)



  useEffect(() => {
    getCountData()
  }, [])


  const getCountData=()=>{
    console.log("Deepak singh")
    const libconCode = JSON.parse(localStorage.getItem("libCode"));
    let url = `http://bitsom.libcon.co.in/api/count?libid=${libconCode}`
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
            setcountData(resp.data[0])
            setcontent(resp.data[0].Contents)
            setevent(resp.data[0].Events)
            setfeedback(resp.data[0].Question)
            setresponse(resp.data[0].Response)
            setloader(false)
          } else {
            
            // alert("Something went wrong. Please try again.")
          }
        });
      })
      .catch((error) => {
        alert("There is problem in your credentials.");
        setloader(false)
      });
  }
  

  return (
    <>
    <Helmet>
      <title>Home</title>
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
                BITSoM - DASHBOARD
                <div className="page-title-subheading">USER DASHBOARD</div>
              </div>
            </div>
            {/* <div className="page-title-actions">
                                <button type="button" className="mr-1 btn btn-success" >
                                    <BsQuestionCircle className="fa pe-7s-help1" style={{ marginBottom: "3%" }} /> {" "}
                                    Daily Filter
                                </button>
                            </div> */}
          </div>
        </div>

        {/* --------------------------------------------- */}

        <div className="row">

          <div className="col-sm-10 col-md-6 col-xl-3">
            <div className="card mb-3 widget-chart">
              <div className="widget-chart-content">
                <div className="icon-wrapper rounded">
                  <div className="icon-wrapper-bg bg-warning"></div>
                  <div className="lnr-laptop-phone text-warning wd-100">
                    <BiBookContent size={30} />
                  </div>
                </div>
                <div className="widget-numbers">

                  {!loader ? ( <span>{content}</span>):(
                    <div className="loading_c">
                    <TailSpin
                      color="#00BFFF"
                      height={30}
                      width={50}
                      ariaLabel="loading"
                    />
                  </div>
                  )}
                 
                </div>
                <div className="widget-subheading fsize-1 pt-2 opacity-10 text-warning font-weight-bold">
                  Contents
                </div>
                <div className="widget-description opacity-8">
                  <Link to={"/contents"} className="mrabt">
                  <span className="text-danger pr-1 mg-l-5">
                  More
                      <BiChevronsRight size={25}/>
                  </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="col-sm-10 col-md-6 col-xl-3">
            <div className="card mb-3 widget-chart">
              <div className="widget-chart-content">
                <div className="icon-wrapper rounded">
                  <div className="icon-wrapper-bg bg-danger"></div>
                  <div className="lnr-graduation-hat text-danger wd-100">
                    <BsFillCalendarEventFill size={30} />
                  </div>
                </div>
                <div className="widget-numbers">

                  {!loader ? ( <span>{event}</span>):(
                    <div className="loading_c">
                    <TailSpin
                      color="#00BFFF"
                      height={30}
                      width={50}
                      ariaLabel="loading"
                    />
                  </div>
                  )}
                </div>
                <div className="widget-subheading fsize-1 pt-2 opacity-10 text-danger font-weight-bold">
                  Events
                </div>
                <div className="widget-description opacity-8">
                  <Link to={"/events"} className="mrabt">
                  <span className="text-info pl-1 mg-l-5">
                  More
                      <BiChevronsRight size={25}/>
                  </span>
                  </Link>
                  </div>
              </div>
            </div>
          </div>


          <div className="col-sm-10 col-md-12 col-xl-3">
            <div className="card mb-3 widget-chart">
              <div className="widget-chart-content">
                <div className="icon-wrapper rounded">
                  <div className="icon-wrapper-bg bg-info"></div>
                  <div className="lnr-diamond text-info wd-100">
                    <MdFeedback size={30} />
                  </div>
                </div>
                <div className="widget-numbers text-danger">

                  {!loader ? ( <span>{feedback}</span>):(
                    <div className="loading_c">
                    <TailSpin
                      color="#00BFFF"
                      height={30}
                      width={50}
                      ariaLabel="loading"
                    />
                  </div>
                  )}
                </div>
                <div className="widget-subheading fsize-1 pt-2 opacity-10 text-info font-weight-bold">
                  Feedback
                </div>
                <div className="widget-description opacity-8">
                  <Link to={"/feedback/questions"} className="mrabt">
                  <span className="text-success pl-1 mg-l-5">
                  More
                      <BiChevronsRight size={25}/>
                  </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>




          <div className="col-sm-10 col-md-6 col-xl-3">
            <div className="card mb-3 widget-chart">
              <div className="widget-chart-content">
                <div className="icon-wrapper rounded">
                  <div className="icon-wrapper-bg bg-warning"></div>
                  <div className="lnr-laptop-phone text-warning wd-100">
                    <BsReceipt size={30} />
                  </div>
                </div>
                <div className="widget-numbers">
                  {!loader ? ( <span>{response}</span>):(
                    <div className="loading_c">
                    <TailSpin
                      color="#00BFFF"
                      height={30}
                      width={50}
                      ariaLabel="loading"
                    />
                  </div>
                  )}
                </div>
                <div className="widget-subheading fsize-1 pt-2 opacity-10 text-warning font-weight-bold">
                  Responses
                </div>
                <div className="widget-description opacity-8">
                  <Link to={"/feedback/questions"} className="mrabt">
                  <span className="text-danger pr-1 mg-l-5">
                  More
                      <BiChevronsRight size={25}/>
                  </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>




        </div>

        {/* ---------------------------------------- */}

        <></>
      </div>
    </div>
  </>
  )
}

export default Home