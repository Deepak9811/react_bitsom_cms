
import React, { Component, Props } from "react";
import { FaClipboardList } from 'react-icons/fa';
import { FaEdit } from 'react-icons/fa';
import { BsQuestionCircle } from "react-icons/bs";
import { TailSpin } from 'react-loader-spinner'

import Header from './common/header';

export default class showcontent extends Component {
    constructor(props) {
        super(props)

        this.state = {
            contentData: [],
            loading: true,
            hideTable: false
        }
    }



    render() {
        console.log("props :- ",this.props)
        return (
                <>
                
                <Header/>

                <div className='txt' id='pddd'>
                    <div className="app-main__inner">
                        <div className="app-page-title">
                            <div className="page-title-wrapper">
                                <div className="page-title-heading">
                                    <div className="page-title-icon">
                                        <FaClipboardList></FaClipboardList>
                                    </div>
                                    <div>
                                            BITSoM - DASHBOARD
                                        <div className="page-title-subheading">
                                            USER DASHBOARD
                                        </div>
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
                            <div className="col-md-6 col-xl-3">
                                <div className="card mb-3 widget-content bg-success">
                                    <div className="widget-content-wrapper text-white">
                                        <div className="widget-content-left">
                                            <div className="widget-heading">Total Content</div>
                                            {/* <div className="widget-subheading">Visited the premises</div> */}
                                        </div>
                                        <div className="widget-content-right">
                                            <div className="widget-numbers text-white"><span>06</span></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6 col-xl-3">
                                <div className="card mb-3 widget-content bg-info">
                                    <div className="widget-content-wrapper text-white">
                                        <div className="widget-content-left">
                                            <div className="widget-heading">Total Event</div>
                                            {/* <div className="widget-subheading">Visitors within premises</div> */}
                                        </div>
                                        <div className="widget-content-right">
                                            <div className="widget-numbers text-white"><span>03</span></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6 col-xl-3">
                                <div className="card mb-3 widget-content bg-warning">
                                    <div className="widget-content-wrapper text-white">
                                        <div className="widget-content-left">
                                            <div className="widget-heading">Total Feedback Quesiton</div>
                                            {/* <div className="widget-subheading">Within campus</div> */}
                                        </div>
                                        <div className="widget-content-right">
                                            <div className="widget-numbers text-white"><span>05</span></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6 col-xl-3">
                                <div className="card mb-3 widget-content bg-focus">
                                    <div className="widget-content-wrapper text-white">
                                        <div className="widget-content-left">
                                            <div className="widget-heading">Total Response</div>
                                            {/* <div className="widget-subheading">Within campus</div> */}
                                        </div>
                                        <div className="widget-content-right">
                                            <div className="widget-numbers text-white"><span>3</span></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>










                        {/* ---------------------------------------- */}



                        <>

                            {/* <div className="main-card mb-0 card">
                                <div className="card-header bg-info text-white">
                                    VISITORS
                                </div>


                                <div className="card-body">
                                    <table className="mb-0 table table-hover">
                                        <thead>
                                            <tr>
                                                <th>
                                                    Slip No</th>
                                                <th>Name</th>
                                                <th>Mobile</th>
                                                <th>Employee</th>
                                            </tr>
                                        </thead>
                                        <tbody>







                                        </tbody>
                                    </table>
                                </div>

                            </div> */}
                        </>



                    </div>
                </div >
                </>
        );
    }
}
