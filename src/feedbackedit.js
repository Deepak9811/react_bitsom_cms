// import React, { Component } from "react";
// import DatePicker from "react-datepicker";
// import { TailSpin } from "react-loader-spinner";
// import { FiUsers } from "react-icons/fi";
// import { BsQuestionCircle } from "react-icons/bs";
// import moment from "moment";
// import Header from './common/header';
// import { Link  ,useSearchParams  } from 'react-router-dom'

// function withParams(Component) {
//   return props => <Component {...props} params={useSearchParams()} />;
// }

// class feedbackedit extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       profileImg: "",
//       eventName: "",
//       validFrom: new Date(),
//       validUpto: new Date(),
//       loading: false,
//       physical: false,
//       active: true,
//       system: false,
//       showMcq: false,
//       showNewMcqData: false,
//       mcqQuestionId: "",
//       questionID: "",
//       mcqNewData: [],
//       Updateloading: false,
//       choice: "",
//       sortOrder: "",
//       activeMcq: false,
//       heading: "",
//       question: "",
//       question_type: "",
//       hideSaveBttn: true,
//       showValidFromDate: false,
//       showValidUptoDate: false,
//       libconCode: "",
//       upType: false,
//       activeMcq: true,

//       other_fields: [],
//       showAddMoreUpdate:false,
//     };
//   }

//   static async getInitialProps({ query }) {
//     return { data: query };
//   }

//   componentDidMount() {

//     const id = this.props.params[0].get('id');
//     const type = this.props.params[0].get('type');

//     console.log("question_type :- ", this.state.question_type);
//     const libconCode = JSON.parse(localStorage.getItem("libCode"));
//     console.log("libconCode :- ", libconCode);
//     if (libconCode) {
//       this.setState({
//         libconCode: libconCode,
//       });
//     }

//     // this.getFeedBackData(libconCode);

//     if (this.props) {
//       if (this.props.params) {
//           if (this.props.params[0].get('id')) {
//           this.getFeedBackData(id, libconCode);
//           console.log("refresh not working");
//         }
//       }
//     }
//   }

//   getFeedBackData(id, libconCode) {
//     fetch(
//       `http://bitsom.libcon.co.in/api/getquestion?libcode=${libconCode}&questionid=${id}`,
//       {
//         method: "GET",
//         headers: {
//           Accepts: "application/json",
//           "content-type": "application/json",
//         },
//       }
//     )
//       .then((result) => {
//         result.json().then((resp) => {
//           console.log(resp.data[0].type);
//           if (resp.response === "Success") {
//             this.setState({
//               upType: true,
//               showValidFromDate: true,
//               showValidUptoDate: true,
//               feedBckData: resp.data,
//               question_type: resp.data[0].type,
//               heading: resp.data[0].heading,
//               question: resp.data[0].question,
//               // validFrom: resp.data[0].validFrom,
//               // validUpto: resp.data[0].validUpto,
//               validFrom: moment(resp.data[0].validFrom)
//                 .format("MM-DD-YYYY hh:mm a")
//                 .replace("T", " "),
//               validUpto: moment(resp.data[0].validUpto)
//                 .format("MM-DD-YYYY hh:mm a")
//                 .replace("T", " "),
//               // validFrom: resp.data[0].validFrom.replace("T", " "),
//               // validUpto: resp.data[0].validUpto.replace("T", " "),
//               questionID: resp.data[0].questionID,
//               libCode: resp.data[0].libCode,
//               active: resp.data[0].active,
//               mcqNewData: resp.data[0].mcq,
//             });

//             console.log(this.state.mcqNewData);

//             if (this.state.mcqNewData.length != 0) {
//               this.setState({
//                 showNewMcqData: true,
//                 hideSaveBttn: false,
//               });
//             }

//             if(resp.data[0].type === "MCQ"){
//                 this.setState({
//                     showNewMcqData: true,
//                     hideSaveBttn: false,
//                     showAddMoreUpdate:true,
//                 })
//             }
//           }else{
//             // Router.push("/feedback/questions");
//             alert("Something went wrong. Please try again.");
//           }
//         });
//       })
//       .catch((error) => {
//         alert("There is problem in your credentials.");
//       });
//   }

//   checkFeed() {
//     if (this.state.question_type === "" || this.state.question === "") {
//       alert("Please fill the details...");
//       console.log(
//         "cheking :- ",
//         this.state.question_type,
//         " question :-",
//         this.state.question
//       );
//     } else {
//       console.log(
//         "cheking :- ",
//         this.state.question_type,
//         " question :-",
//         this.state.question
//       );
//       const {
//         active,
//         heading,
//         question,
//         question_type,
//         validFroms,
//         questionID,
//         libconCode,
//       } = this.state;
//       this.setState({
//         loading: true,
//       });
//       fetch(`http://bitsom.libcon.co.in/api/questions`, {
//         method: "POST",
//         headers: {
//           Accept: "application/json",
//           "content-type": "application/json",
//         },
//         body: JSON.stringify({
//           questionID: questionID,
//           libCode: libconCode,
//           type: question_type,
//           heading: heading,
//           question: question,
//           validFrom: moment(this.state.validFrom).format(
//             "MM-DD-YYYY hh:mm:ss a"
//           ),
//           validUpto: moment(this.state.validUpto).format(
//             "MM-DD-YYYY hh:mm:ss a"
//           ),
//           active: active,
//         }),
//       })
//         .then((result) => {
//           result.json().then((resp) => {
//             console.log(resp);
//             if (resp.response === "Success") {
//               if (this.state.showNewMcqData === true) {
//                 this.setState({
//                   showMcq: false,
//                   loading: false,
//                 });
//                 this.updateMcq();
//               } else if (question_type === "MCQ") {
//                 this.setState({
//                   mcqData: resp.data,
//                   mcqQuestionId: resp.data[0].questionID,
//                   showMcq: true,
//                   loading: false,
//                   question_type: "",
//                   heading: "",
//                   question: "",
//                   validFrom: new Date(),
//                   validUpto: new Date(),
//                   active: false,
//                 });
//               } else {
//                 this.setState({
//                   mcqData: resp.data,
//                   mcqQuestionId: resp.data[0].questionID,
//                   showMcq: false,
//                   loading: false,
//                   question_type: "",
//                   heading: "",
//                   question: "",
//                   validFrom: new Date(),
//                   validUpto: new Date(),
//                   active: false,
//                 });
//                 alert("Feedback Question Add Successfully.");
//                 // Router.push("/feedback/questions");
//               }
//             } else {
//               alert("Something wents wrong.");
//               this.setState({
//                 loading: false,
//               });
//             }
//           });
//         })
//         .catch((error) => {
//           alert(error.message);
//           this.setState({
//             loading: false,
//           });
//         });
//     }
//   }

//   addMcq() {
//     const { activeMcq, sortOrder, choice, mcqQuestionId, mcqNewData } =
//       this.state;
//     this.setState({
//       loading: true,
//     });

//     fetch(`http://bitsom.libcon.co.in/api/insertmcq`, {
//       method: "POST",
//       headers: {
//         Accept: "application/json",
//         "content-type": "application/json",
//       },
//       body: JSON.stringify({
//         mcqid: "",
//         questionid: mcqQuestionId,
//         choice: choice,
//         sortorder: sortOrder,
//         active: activeMcq,
//       }),
//     })
//       .then((result) => {
//         result.json().then((resp) => {
//           console.log(resp);
//           if (resp.response === "Success") {
//             this.setState({
//               resp: resp.data,
//               showMcq: true,
//               loading: false,
//               choice: "",
//               sortOrder: "",
//               activeMcq: false,
//             });
//             alert("Feedback Add Successfully.");
//           } else {
//             alert("Something wents wrong.");
//             this.setState({
//               loading: false,
//             });
//           }
//         });
//       })
//       .catch((error) => {
//         alert(error.message);
//       });
//   }

//   reset() {
//     console.log("hello");
//     this.setState({
//       showMcq: false,
//       loading: false,
//       question_type: "",
//       heading: "",
//       question: "",
//       validFrom: new Date(),
//       validUpto: new Date(),
//       active: false,
//     });
//   }

//   chngeDataFormate(date) {
//     let dt = date.toString();
//     let dts = dt.split(" ");
//     let yr = dts[3];
//     let mn = dts[1];
//     let dty = dts[2];
//     let tm = dts[4];

//     let frm = yr + "-" + mn + "-" + dty + "T" + tm;

//     this.setState({ validFroms: date });

//     console.log(JSON.stringify(frm));
//   }

//   handleChange(newName, index) {
//     const { companies } = this.state;

//     const newCompanies = [...companies];
//     newCompanies[index] = newName;
//     this.setState({ companies: newCompanies });
//     console.log("input :- ", this.state.companies);
//   }

//   updateCompany(newName, index) {
//     const { mcqNewData } = this.state;
//     // const date = { name, email }
//     const newmcqNewData = [...mcqNewData];

//     newmcqNewData[index].choice = newName;
//     this.setState({ mcqNewData: newmcqNewData });

//     console.log(newmcqNewData);
//   }

//   updateOrder(newName, index) {
//     const { mcqNewData } = this.state;
//     // const date = { name, email }
//     const newmcqNewData = [...mcqNewData];

//     newmcqNewData[index].sortorder = Number(newName);
//     this.setState({ mcqNewData: newmcqNewData });

//     console.log(newmcqNewData);
//   }

//   updateActive(newName, index) {
//     const { mcqNewData } = this.state;
//     const newmcqNewData = [...mcqNewData];

//     if (newName === "false") {
//       let tr = true;
//       newmcqNewData[index].active = tr;
//     } else {
//       let fl = false;
//       newmcqNewData[index].active = fl;
//     }
//     this.setState({ mcqNewData: newmcqNewData });

//     console.log(newName, index);
//     console.log(newmcqNewData);
//   }

//   updateMcq() {
//     const { activeMcq, sortOrder, choice, mcqQuestionId, mcqNewData ,other_fields} =
//       this.state;

//       let ad1 = mcqNewData
//       let ad2 = other_fields

//       let totalArray = ad1.concat(ad2)

//       console.log(other_fields)

//     this.setState({
//       Updateloading: true,
//     });

//     fetch(`http://bitsom.libcon.co.in/api/updatemcq`, {
//       method: "POST",
//       headers: {
//         Accept: "application/json",
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(totalArray),
//     })
//       .then((result) => {
//         result.json().then((resp) => {
//           console.log(resp);
//           if (resp.response === "Success") {
//             this.setState({
//               showMcq: false,
//               Updateloading: false,
//               showNewMcqData: false,
//               choice: "",
//               sortOrder: "",
//               heading: "",
//               question: "",
//               question_type: "",
//               activeMcq: false,
//               active: false,
//             });
//             // Router.push("/feedback/questions");
//             alert("Feedback Update Successfully.");
//           } else {
//             alert("Something wents wrong.");
//             this.setState({
//               Updateloading: false,
//             });
//           }
//         });
//       })
//       .catch((error) => {
//         alert(error.message);
//         this.setState({
//           Updateloading: false,
//         });
//       });
//   }

//   addMoreFields() {
//     var newArr = {mcqid:"", questionid:this.state.questionID, choice: "",sortorder:"",active:true};
//     this.setState({
//       other_fields: this.state.other_fields.concat(newArr),
//     });
//   }

//   removeOther(index) {

//     this.state.other_fields.splice(index,1) ;

//     this.setState((prevState) => ({
//       other_fields: [...prevState.other_fields],
//     }));

//     console.log(this.state.other_fields)
//   }

//   addMoreChoice(newName, index) {
//     const { other_fields } = this.state;
//     // const date = { name, email }
//     const newmcqNewData = [...other_fields];

//     newmcqNewData[index].choice = newName;
//     this.setState({ other_fields: newmcqNewData });

//     console.log(newmcqNewData);
//   }

//   addMoreOrder(newName, index) {
//     const { other_fields } = this.state;
//     // const date = { name, email }
//     const newmcqNewData = [...other_fields];

//     newmcqNewData[index].sortorder = Number(newName);
//     this.setState({ other_fields: newmcqNewData });

//     console.log(newmcqNewData);
//   }

//   addMoreActives(newName, index) {
//       console.log(index)
//     const { other_fields } = this.state;
//     const newmcqNewData = [...other_fields];

//     if (newName === "false") {
//       let tr = true;
//       newmcqNewData[index].active = tr;
//     } else {
//       let fl = false;
//       newmcqNewData[index].active = fl;
//     }
//     this.setState({ other_fields: newmcqNewData });

//     console.log(newName, index);
//     console.log(newmcqNewData);
//   }

//   render() {
//     // const {
//     //   activeMcq,
//     //   sortOrder,
//     //   choice,
//     //   active,
//     //   addChoice,
//     //   validFrom,
//     //   validUpto,
//     //   heading,
//     //   question,
//     //   type,
//     //   question_type,
//     //   companies,
//     //   mcqNewData,
//     // } = this.state;
//     // console.log(this.state)
//     return (
//       <>
//          <Header/>
//         <div className="txt" id="pddd">
//           <div className="app-page-title">
//             <div className="page-title-wrapper">
//               <div className="page-title-heading">
//                 <div className="page-title-icon">
//                   <FiUsers className="pe-7s-users icon-gradient bg-mean-fruit" />
//                 </div>
//                 <div>
//                   FEEDBACK - ADD/UPDATE
//                   <div className="page-title-subheading">
//                     <p>
//                       Enter the details and click on SAVE button to save the
//                       details.
//                     </p>
//                   </div>
//                 </div>
//               </div>
//               <div className="page-title-actions">
//                   <Link to="/feedback/questions">
//                     <button type="button" className="mr-1 btn btn-success">
//                       <BsQuestionCircle
//                         className="fa pe-7s-help1"
//                         style={{ marginBottom: "3%" }}
//                       />{" "}
//                       Show Feedbacks
//                     </button>
//                   </Link>
//               </div>
//             </div>
//           </div>

//           <div className="txtb">
//             <div className="card-header bg-info text-white">
//               FEEDBACK DETAILS
//             </div>

//             <div style={{ padding: "1.25rem" }}>
//               {!this.state.showMcq ? (
//                 <>
//                   <div className="form-row">
//                     <div className="col-md-3 mb-1 ">
//                       <label>Type</label>
//                       <span className="text-danger">*</span>
//                       <div className="position-relative form-group ">
//                         <select
//                           disabled={this.state.upType ? true : false}
//                           id=""
//                           className="form-control"
//                           value={this.state.question_type}
//                           aria-label="question_type"
//                           name="question_type"
//                           title="question_type"
//                           onChange={(e) =>
//                             this.setState({ question_type: e.target.value })
//                           }
//                         >
//                           <option value="" hidden>
//                             Type of Question
//                           </option>
//                           <option value="GEN">GENERAL</option>
//                           <option value="MCQ">MCQ</option>
//                           <option value="Rate">RATE</option>
//                         </select>
//                       </div>
//                     </div>

//                     <div className="col-md-8 mb-1">
//                       <label>Heading</label>
//                       <input
//                         type="text"
//                         value={this.state.heading}
//                         onChange={(e) =>
//                           this.setState({ heading: e.target.value })
//                         }
//                         className="form-control"
//                         placeholder="Heading..."
//                         required=""
//                         autoFocus=""
//                         autoComplete="on"
//                       />
//                     </div>
//                   </div>

//                   <div className="form-row">
//                     <div className="col-md-11 mb-1">
//                       <label>Question</label>
//                       <span className="text-danger">*</span>

//                       <div className="position-relative form-group ">
//                         <input
//                           type="text"
//                           value={this.state.question}
//                           onChange={(e) =>
//                             this.setState({ question: e.target.value })
//                           }
//                           className="form-control"
//                           placeholder="Question..."
//                           required=""
//                           autoFocus=""
//                           autoComplete="on"
//                         />
//                       </div>
//                     </div>
//                   </div>

//                   <div className="form-row">
//                     <div className="col-md-3 mb-1 ">
//                       <label>Valid From</label>
//                       <span className="text-danger">*</span>
//                       <div className="position-relative form-group ">
//                         {/* <DatePicker
//                                 selected={validFrom}
//                                 // onChange={(date) => this.chngeDataFormate(date)}
//                                 onChange={(date) => this.setState({ validFrom: date })}
//                                 timeInputLabel="Time:"
//                                 dateFormat="MM/dd/yyyy h:mm aa"
//                                 showTimeInput
//                                 className='form-control'
//                             /> */}

//                         {this.state.showValidFromDate ? (
//                           <DatePicker
//                             value={this.state.validFrom}
//                             onChange={(date) =>
//                               this.setState({
//                                 validFrom: date,
//                                 showValidFromDate: false,
//                               })
//                             }
//                             // customTimeInput={<ExampleCustomTimeInput />}
//                             dateFormat="MM/dd/yyyy h:mm aa"
//                             showTimeInput
//                             className="form-control"
//                           />
//                         ) : (
//                           <DatePicker
//                             selected={this.state.validFrom}
//                             onChange={(date) =>
//                               this.setState({ validFrom: date })
//                             }
//                             // customTimeInput={<ExampleCustomTimeInput />}
//                             dateFormat="MM/dd/yyyy h:mm aa"
//                             showTimeInput
//                             className="form-control"
//                           />
//                         )}
//                       </div>
//                     </div>

//                     <div className="col-md-3 mb-1 ">
//                       <label>Valid Upto</label>
//                       <span className="text-danger">*</span>
//                       <div className="position-relative form-group ">
//                         {/* <DatePicker
//                                 selected={validUpto}
//                                 onChange={(date) => this.setState({ validUpto: date })}
//                                 timeInputLabel="Time:"
//                                 dateFormat="MM/dd/yyyy h:mm aa"
//                                 showTimeInput
//                                 className='form-control'
//                             /> */}

//                         {this.state.showValidUptoDate ? (
//                           <DatePicker
//                             value={this.state.validUpto}
//                             onChange={(date) =>
//                               this.setState({
//                                 validUpto: date,
//                                 showValidUptoDate: false,
//                               })
//                             }
//                             // customTimeInput={<ExampleCustomTimeInput />}
//                             dateFormat="MM/dd/yyyy h:mm aa"
//                             showTimeInput
//                             className="form-control"
//                           />
//                         ) : (
//                           <DatePicker
//                             selected={this.state.validUpto}
//                             onChange={(date) =>
//                               this.setState({ validUpto: date })
//                             }
//                             // customTimeInput={<ExampleCustomTimeInput />}
//                             dateFormat="MM/dd/yyyy h:mm aa"
//                             showTimeInput
//                             className="form-control"
//                           />
//                         )}
//                       </div>
//                     </div>

//                     <div className="col-md-3 mb-1" style={{ marginLeft: "8%" }}>
//                       <label>Active</label>
//                       <span className="text-danger">*</span>
//                       <div className="position-relative form-group m-2">
//                         <div>
//                           <div className="custom-checkbox custom-control">
//                             <input
//                               className="custom-control-input"
//                               id="exampleCustomInline1"
//                               name="Show"
//                               type="checkbox"
//                               checked={this.state.active ? "checkbox" : null}
//                               onChange={() =>
//                                 this.setState({
//                                   active: this.state.active ? false : true,
//                                 })
//                               }
//                             />
//                             <input name="Show" type="hidden" value="false" />
//                             <label
//                               className="custom-control-label"
//                               htmlFor="exampleCustomInline1"
//                             >
//                               Active
//                             </label>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {this.state.hideSaveBttn && (
//                     <div className="card-footer">
//                       <div className="col-md-12 mb-0 text-center">
//                         {!this.state.loading ? (
//                           <>
//                             <input
//                               type="submit"
//                               name="created"
//                               value="SAVE"
//                               className="btn-wide btn btn-success"
//                               onClick={() => this.checkFeed()}
//                             />

//                               <Link to="/feedback/questions">
//                                 <input
//                                   type="reset"
//                                   value="BACK"
//                                   className="btn-wide btn btn-light"
//                                   id="btnClear"
//                                   style={{ marginLeft: "2%" }}
//                                 />
//                               </Link>
//                           </>
//                         ) : (
//                           <div className="btn-wide btn ">
//                             <TailSpin
//                               color="#00BFFF"
//                               height={30}
//                               width={50}
//                               ariaLabel="loading"
//                             />
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   )}
//                 </>
//               ) : (
//                 <div>
//                   <div className="form-row">
//                     <div className="col-md-5 mb-1">
//                       <label>Choice</label>
//                       <span className="text-danger">*</span>
//                       <input
//                         type="text"
//                         value={this.state.choice}
//                         onChange={(e) =>
//                           this.setState({ choice: e.target.value })
//                         }
//                         className="form-control"
//                         placeholder="Choice..."
//                         required=""
//                         autoFocus=""
//                         autoComplete="on"
//                       />
//                     </div>

//                     <div className="col-md-5 mb-1 ">
//                       <label>Sort Order</label>
//                       <span className="text-danger">*</span>
//                       <div className="position-relative form-group ">
//                         <input
//                           type="number"
//                           value={this.state.sortOrder}
//                           onChange={(e) =>
//                             this.setState({ sortOrder: e.target.value })
//                           }
//                           className="form-control"
//                           placeholder="Short Order..."
//                           required=""
//                           autoFocus=""
//                           autoComplete="on"
//                         />
//                       </div>
//                     </div>

//                     <div className="col-md-2 mb-1" style={{ marginTop: "3%" }}>
//                       {/* <label>Active</label><span className="text-danger">*</span> */}
//                       <div className="position-relative form-group m-2">
//                         <div style={{ marginLeft: "20%" }}>
//                           <div className="custom-checkbox custom-control">
//                             <input
//                               className="custom-control-input"
//                               id="exampleCustomInline1"
//                               name="Show"
//                               type="checkbox"
//                               checked={this.state.activeMcq ? "checkbox" : null}
//                               onChange={() =>
//                                 this.setState({
//                                   activeMcq: this.state.activeMcq ? false : true,
//                                 })
//                               }
//                             />
//                             <input name="Show" type="hidden" value="false" />
//                             <label
//                               className="custom-control-label"
//                               htmlFor="exampleCustomInline1"
//                             >
//                               Active
//                             </label>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="card-footer">
//                     <div className="col-md-12 mb-0 text-center">
//                       {!this.state.loading ? (
//                         <>
//                           <input
//                             type="submit"
//                             name="created"
//                             value="SAVE"
//                             className="btn-wide btn btn-success"
//                             onClick={() => this.addMcq()}
//                           />
//                             <Link to="/feedback/questions">
//                               <input
//                                 type="reset"
//                                 value="BACK"
//                                 className="btn-wide btn btn-light"
//                                 id="btnClear"
//                                 style={{ marginLeft: "2%" }}
//                               />
//                             </Link>
//                         </>
//                       ) : (
//                         <div className="btn-wide btn ">
//                           <TailSpin
//                             color="#00BFFF"
//                             height={30}
//                             width={50}
//                             ariaLabel="loading"
//                           />
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* --------------------------------------NEW-DATA-FOR-UPDATE--------------------------------------------------------------- */}

//               {this.state.showNewMcqData && (
//                 <div>
//                   {this.state.mcqNewData.map((item, index) => {
//                     // console.log(item.choice)
//                     return (
//                       <React.Fragment key={index}>
//                         <div>
//                           <div className="form-row">
//                             <div className="col-md-5 mb-1">
//                               <label>Choice</label>
//                               <span className="text-danger">*</span>
//                               <input
//                                 type="text"
//                                 key={index}
//                                 value={item.choice}
//                                 onChange={(e) =>
//                                   this.updateCompany(e.target.value, index)
//                                 }
//                                 className="form-control"
//                               ></input>
//                               {/* <input
//                                         type="text"
//                                         value={item.choice}
//                                         onChange={(e) =>
//                                             // this.setState({ choice: e.target.value })
//                                             this.handleChange(e.target.value, i)
//                                         }
//                                         key={i}
//                                         className="form-control"
//                                         placeholder="Choice..."
//                                     /> */}
//                             </div>

//                             <div className="col-md-5 mb-1 ">
//                               <label>Sort Order</label>
//                               <span className="text-danger">*</span>
//                               <div className="position-relative form-group ">
//                                 <input
//                                   type="number"
//                                   value={item.sortorder}
//                                   onChange={(e) =>
//                                     this.updateOrder(e.target.value, index)
//                                   }
//                                   key={index}
//                                   className="form-control"
//                                   placeholder="Short Order..."
//                                   required=""
//                                   autoFocus=""
//                                   autoComplete="on"
//                                 />
//                               </div>
//                             </div>

//                             <div
//                               className="col-md-1 mb-1"
//                               style={{ marginLeft: "3%", marginTop: "2.7%" }}
//                             >
//                               {/* <label>Active</label><span className="text-danger">*</span> */}
//                               <div className="position-relative form-group m-2">
//                                 <div>
//                                   <div className="custom-checkbox custom-control">
//                                     <input
//                                       className="custom-control-input"
//                                       id={`${index}`}
//                                       name="Show"
//                                       type="checkbox"
//                                       value={item.active}
//                                       checked={item.active ? "checkbox" : null}
//                                       onChange={(e) =>
//                                         this.updateActive(e.target.value, index)
//                                       }
//                                     />
//                                     <input
//                                       name="Show"
//                                       type="hidden"
//                                       value="false"
//                                     />
//                                     <label
//                                       className="custom-control-label"
//                                       htmlFor={`${index}`}
//                                     >
//                                       Active
//                                     </label>
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </React.Fragment>
//                     );
//                   })}

//                   {/* ----------------------------ADD-MORE-OPTION---------------------------------------------------------- */}

//                   {this.state.other_fields.map((item, addMoreIndex) => {
//                       console.log(item,addMoreIndex)
//                     return item.delete !== true ? (
//                       <div className="form-row">
//                         <div className="col-md-5 mb-1">
//                           <label>Choice</label>
//                           <span className="text-danger">*</span>
//                           <input
//                             type="text"
//                             key={addMoreIndex}
//                             value={item.choice}
//                             onChange={(e) =>
//                               this.addMoreChoice(e.target.value, addMoreIndex)
//                             }
//                             className="form-control"
//                           />
//                         </div>

//                         <div className="col-md-5 mb-1 ">
//                           <label>Sort Order</label>
//                           <span className="text-danger">*</span>
//                           <div className="position-relative form-group ">
//                             <input
//                               type="number"
//                               value={item.sortorder}
//                               onChange={(e) =>
//                                 this.addMoreOrder(e.target.value, addMoreIndex)
//                               }
//                               key={addMoreIndex}
//                               className="form-control"
//                               placeholder="Short Order..."
//                               required=""
//                               autoFocus=""
//                               autoComplete="on"
//                             />
//                           </div>
//                         </div>

//                         <div
//                           className="col-md-1 mb-1"
//                           style={{ marginLeft: "3%", marginTop: "2.7%" }}
//                         >
//                           {/* <label>Active</label><span className="text-danger">*</span> */}
//                           <div className="position-relative form-group m-2">
//                             <div>
//                               <div className="custom-checkbox custom-control">
//                                 <input
//                                   className="custom-control-input"
//                                   id={`${addMoreIndex+9811}`}
//                                   name="Show"
//                                   type="checkbox"
//                                   value={item.active}
//                                   checked={item.active ? "checkbox" : null}
//                                   onChange={(e) =>
//                                     this.addMoreActives(e.target.value, addMoreIndex)
//                                   }
//                                 />
//                                 <input
//                                   name="Show"
//                                   type="hidden"
//                                   value="false"
//                                 />
//                                 <label
//                                   className="custom-control-label"
//                                   htmlFor={`${addMoreIndex+9811}`}
//                                 >
//                                   Active
//                                 </label>
//                               </div>
//                             </div>
//                           </div>
//                         </div>

//                         <span
//                           className="addotherurl removeMore"
//                           onClick={() => this.removeOther(addMoreIndex)}
//                         >
//                           <svg
//                             style={{ marginTop: "5px" }}
//                             viewBox="0 0 512 512"
//                             className="svg-inline--fa fa-minus-circle fa-w-16 fa-2x"
//                           >
//                             <path
//                               fill="currentColor"
//                               d="M140 284c-6.6 0-12-5.4-12-12v-32c0-6.6 5.4-12 12-12h232c6.6 0 12 5.4 12 12v32c0 6.6-5.4 12-12 12H140zm364-28c0 137-111 248-248 248S8 393 8 256 119 8 256 8s248 111 248 248zm-48 0c0-110.5-89.5-200-200-200S56 145.5 56 256s89.5 200 200 200 200-89.5 200-200z"
//                             ></path>
//                           </svg>
//                         </span>
//                       </div>
//                     ) : null;
//                   })}

//                   {this.state.showAddMoreUpdate &&(
//                     <div className="col-12 pd-0 addmore"  >
//                     <label className="form-label add-more">
//                       Add more fields
//                     </label>
//                     <span className="addotherurl cursor" onClick={() => this.addMoreFields()}>
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         viewBox="0 0 512 512"
//                       >
//                         <path
//                           fill="currentColor"
//                           d="M384 240v32c0 6.6-5.4 12-12 12h-88v88c0 6.6-5.4 12-12 12h-32c-6.6 0-12-5.4-12-12v-88h-88c-6.6 0-12-5.4-12-12v-32c0-6.6 5.4-12 12-12h88v-88c0-6.6 5.4-12 12-12h32c6.6 0 12 5.4 12 12v88h88c6.6 0 12 5.4 12 12zm120 16c0 137-111 248-248 248S8 393 8 256 119 8 256 8s248 111 248 248zm-48 0c0-110.5-89.5-200-200-200S56 145.5 56 256s89.5 200 200 200 200-89.5 200-200z"
//                         ></path>
//                       </svg>
//                     </span>
//                   </div>
//                   )}

//                   {/* -------------------------SAVE-UPDATE-------------------------------------------- */}

//                   <div className="card-footer">
//                     <div className="col-md-12 mb-0 text-center">
//                       {!this.state.Updateloading ? (
//                         <>
//                           <input
//                             type="submit"
//                             name="created"
//                             value="SAVE"
//                             className="btn-wide btn btn-success"
//                             onClick={() => this.checkFeed()}
//                           />

//                             <Link to="/feedback/questions">
//                               <input
//                                 type="reset"
//                                 value="BACK"
//                                 className="btn-wide btn btn-light"
//                                 id="btnClear"
//                                 style={{ marginLeft: "2%" }}
//                               />
//                             </Link>
//                         </>
//                       ) : (
//                         <div className="btn-wide btn ">
//                           <TailSpin
//                             color="#00BFFF"
//                             height={30}
//                             width={50}
//                             ariaLabel="loading"
//                           />
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* ---------------------------------------------------------------------------------------------------- */}
//             </div>
//           </div>
//         </div>
//       </>
//     );
//   }
// }

// export default  withParams(feedbackedit)

import React, { useState, useEffect } from "react";

import DatePicker from "react-datepicker";
import { TailSpin } from "react-loader-spinner";
import { FiUsers } from "react-icons/fi";
// import { BiShowAlt } from "react-icons/bs";
import { BiShowAlt } from "react-icons/bi";
import moment from "moment";
import Header from "./common/header";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

const FeedbackEdit = () => {
  const [validFrom, setvalidFrom] = useState(new Date());
  const [validUpto, setvalidUpto] = useState(new Date());
  const [loading, setloading] = useState(false);
  const [active, setactive] = useState(false);
  const [showMcq, setshowMcq] = useState(false);
  const [showNewMcqData, setshowNewMcqData] = useState(false);
  const [mcqQuestionId, setmcqQuestionId] = useState("");
  const [questionID, setquestionID] = useState("");
  const [mcqNewData, setmcqNewData] = useState([]);
  const [Updateloading, setUpdateloading] = useState(false);
  const [choice, setchoice] = useState("");
  const [sortOrder, setsortOrder] = useState("");
  const [activeMcq, setactiveMcq] = useState(false);
  const [heading, setheading] = useState("");
  const [question, setquestion] = useState("");
  const [question_type, setquestion_type] = useState("");
  const [hideSaveBttn, sethideSaveBttn] = useState(true);
  const [showValidFromDate, setshowValidFromDate] = useState(false);
  const [showValidUptoDate, setshowValidUptoDate] = useState(false);
  const [libconCode, setlibconCode] = useState("");
  const [upType, setupType] = useState(false);
  // const [activeMcq, setactiveMcq] = useState(true)
  const [other_fields, setother_fields] = useState([]);
  const [feedBckData, setfeedBckData] = useState([]);
  const [mcqData, setmcqData] = useState([]);
  const [resp, setresp] = useState([]);
  const [showAddMoreUpdate, setshowAddMoreUpdate] = useState("");
  const [libCode, setlibCode] = useState("");
  const [bigLoader, setbigLoader] = useState(true)

  // const [order, setorder] = useState('')

  let [searchParams, setSearchParams] = useSearchParams();
  let naviagte = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0)
    const componentwillMount = async () => {
      const id = searchParams.get("id");
      const type = searchParams.get("type");
      const libconCode = JSON.parse(localStorage.getItem("libCode"));
      // console.log("libconCode :- ", libconCode);
      setlibconCode(libconCode);

      if (searchParams) {
        // console.log(searchParams);
        if (searchParams.get("id")) {
          getFeedBackData(id, libconCode);
        }
      }
    };

    componentwillMount();
  }, []);

  const getFeedBackData = (id, libconCode) => {
    fetch(
      `http://bitsom.libcon.co.in/api/getquestion?libcode=${libconCode}&questionid=${id}`,
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
            // this.setState({
            //   upType: true,
            //   showValidFromDate: true,
            //   showValidUptoDate: true,
            //   feedBckData: resp.data,
            //   question_type: resp.data[0].type,
            //   heading: resp.data[0].heading,
            //   question: resp.data[0].question,
            //   // validFrom: resp.data[0].validFrom,
            //   // validUpto: resp.data[0].validUpto,
            //   validFrom: moment(resp.data[0].validFrom)
            //     .format("MM-DD-YYYY hh:mm a")
            //     .replace("T", " "),
            //   validUpto: moment(resp.data[0].validUpto)
            //     .format("MM-DD-YYYY hh:mm a")
            //     .replace("T", " "),
            //   // validFrom: resp.data[0].validFrom.replace("T", " "),
            //   // validUpto: resp.data[0].validUpto.replace("T", " "),
            //   questionID: resp.data[0].questionID,
            //   libCode: resp.data[0].libCode,
            //   active: resp.data[0].active,
            //   mcqNewData: resp.data[0].mcq,
            // });
            setbigLoader(false)
            setupType(true);
            setshowValidFromDate(true);
            setshowValidUptoDate(true);
            setfeedBckData(resp.data);
            setquestion_type(resp.data[0].type);
            setheading(resp.data[0].heading);
            setquestion(resp.data[0].question);
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
            setquestionID(resp.data[0].questionID);
            setlibCode(resp.data[0].libCode);
            setactive(resp.data[0].active);
            setmcqNewData(resp.data[0].mcq);

            console.log(mcqNewData);

            if (mcqNewData.length !== 0) {
              setshowNewMcqData(true);
              sethideSaveBttn(false);
              // this.setState({
              //   showNewMcqData: true,
              //   hideSaveBttn: false,
              // });
            }

            if (resp.data[0].type === "MCQ") {
              setshowNewMcqData(true);
              sethideSaveBttn(false);
              setshowAddMoreUpdate(true);
              // this.setState({
              //     showNewMcqData: true,
              //     hideSaveBttn: false,
              //     showAddMoreUpdate:true,
              // })
            }
          } else {
            // Router.push("/feedback/questions");
              naviagte("/feedback/questions");
            alert("Something went wrong. Please try again.");
            setbigLoader(false)
          }
        });
      })
      .catch((error) => {
        alert("There is problem in your credentials.");
        naviagte("/feedback/questions");
      });
  };

  const checkFeed = () => {
    if (question_type === "" || question === "" || heading === "") {
      alert("Please fill the details...");
      // console.log("cheking :- ",  question_type, " question :-",   question   );
    } else {
      // console.log("cheking :- ", question_type,  " question :-",    question );
      setloading(true);

      fetch(`http://bitsom.libcon.co.in/api/questions`, {
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
          validFrom: moment(validFrom).format("MM-DD-YYYY hh:mm:ss a"),
          validUpto: moment(validUpto).format("MM-DD-YYYY hh:mm:ss a"),
          active: active,
        }),
      })
        .then((result) => {
          result.json().then((resp) => {
            console.log(resp);
            if (resp.response === "Success") {
              if (showNewMcqData === true) {
                setshowMcq(false);
                setloading(false);
                // this.setState({
                //   showMcq: false,
                //   loading: false,
                // });
                updateMcq();
              } else if (question_type === "MCQ") {
                // this.setState({
                //   mcqData: resp.data,
                //   mcqQuestionId: resp.data[0].questionID,
                //   showMcq: true,
                //   loading: false,
                //   question_type: "",
                //   heading: "",
                //   question: "",
                //   validFrom: new Date(),
                //   validUpto: new Date(),
                //   active: false,
                // });

                setmcqData(resp.data);
                setmcqQuestionId(resp.data[0].questionID);
                setshowMcq(true);
                setloading(false);
                setquestion_type("");
                setheading("");
                setquestion("");
                setvalidFrom(new Date());
                setvalidUpto(new Date());
                setactive(false);
              } else {
                // this.setState({
                //   mcqData: resp.data,
                //   mcqQuestionId: resp.data[0].questionID,
                //   showMcq: false,
                //   loading: false,
                //   question_type: "",
                //   heading: "",
                //   question: "",
                //   validFrom: new Date(),
                //   validUpto: new Date(),
                //   active: false,
                // });

                setmcqData(resp.data);
                setmcqQuestionId(resp.data[0].questionID);
                setshowMcq(false);
                setloading(false);
                setquestion_type("");
                setheading("");
                setquestion("");
                setvalidFrom(new Date());
                setvalidUpto(new Date());
                setactive(false);

                alert("Feedback Question Add Successfully.");
                naviagte("/feedback/questions");
                naviagte("/feedback/questions");
              }
            } else {
              alert("Something wents wrong.");
              setloading(false);
              // this.setState({
              //   loading: false,
              // });
            }
          });
        })
        .catch((error) => {
          alert(error.message);
          setloading(false);
          // this.setState({
          //   loading: false,
          // });
        });
    }
  };

  const addMcq = () => {
    setloading(true);

    fetch(`http://bitsom.libcon.co.in/api/insertmcq`, {
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
            // this.setState({
            //   resp: resp.data,
            //   showMcq: true,
            //   loading: false,
            //   choice: "",
            //   sortOrder: "",
            //   activeMcq: false,
            // });
            setresp(resp.data);
            setshowMcq(true);
            setloading(false);
            setchoice("");
            setsortOrder("");
            setactiveMcq(false);
            alert("Feedback Add Successfully.");
          } else {
            alert("Something wents wrong.");
            setloading(false);
            // this.setState({
            //   loading: false,
            // });
          }
        });
      })
      .catch((error) => {
        alert(error.message);
        setloading(false);
      });
  };

  const reset = () => {
    console.log("hello");
    // this.setState({
    //   showMcq: false,
    //   loading: false,
    //   question_type: "",
    //   heading: "",
    //   question: "",
    //   validFrom: new Date(),
    //   validUpto: new Date(),
    //   active: false,
    // });

    setshowMcq(false);
    setloading(false);
    setquestion_type("");
    setheading("");
    setquestion("");
    setvalidFrom(new Date());
    setvalidUpto(new Date());
    setactive(false);
  };

  const updateCompany = (newName, index) => {
    // const { mcqNewData } = mcqNewData;
    // const date = { name, email }
    const newmcqNewData = [...mcqNewData];

    newmcqNewData[index].choice = newName;
    setmcqNewData(newmcqNewData);
    // this.setState({ mcqNewData: newmcqNewData });

    console.log(newmcqNewData);
  };

  const updateOrder = (newName, index) => {
    const re = /^[0-9\b]+$/;
    if (newName === '' || re.test(newName)) {
      // setorder(newName)
      const newmcqNewData = [...mcqNewData];

      newmcqNewData[index].sortorder = Number(newName);
      setmcqNewData(newmcqNewData);
      console.log(newmcqNewData);
    }
    // const { mcqNewData } = this.state;
    // const date = { name, email }
    // const newmcqNewData = [...mcqNewData];

    // newmcqNewData[index].sortorder = Number(newName);
    // setmcqNewData(newmcqNewData);
    // this.setState({ mcqNewData: newmcqNewData });

    // console.log(newmcqNewData);
  };

  const updateActive = (newName, index) => {
    // const { mcqNewData } = this.state;
    const newmcqNewData = [...mcqNewData];

    if (newName === "false") {
      let tr = true;
      newmcqNewData[index].active = tr;
    } else {
      let fl = false;
      newmcqNewData[index].active = fl;
    }
    setmcqNewData(newmcqNewData);
    // this.setState({ mcqNewData: newmcqNewData });

    console.log(newName, index);
    console.log(newmcqNewData);
  };

  const updateMcq = () => {
    let ad1 = mcqNewData;
    let ad2 = other_fields;

    let totalArray = ad1.concat(ad2);

    // console.log(other_fields)

    // console.log(totalArray)

    setUpdateloading(true);

    fetch(`http://bitsom.libcon.co.in/api/updatemcq`, {
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
            // this.setState({
            //   showMcq: false,
            //   Updateloading: false,
            //   showNewMcqData: false,
            //   choice: "",
            //   sortOrder: "",
            //   heading: "",
            //   question: "",
            //   question_type: "",
            //   activeMcq: false,
            //   active: false,
            // });

            setshowMcq(false);
            setUpdateloading(false);
            setshowNewMcqData(false);
            setchoice("");
            setsortOrder("");
            setheading("");
            setquestion("");
            setquestion_type("");
            setactiveMcq(false);
            setactive(false);
            naviagte("/feedback/questions");
            // Router.push("/feedback/questions");
            alert("Feedback Update Successfully.");
          } else {
            alert("Something wents wrong.");
            setUpdateloading(false);
            // this.setState({
            //   Updateloading: false,
            // });
          }
        });
      })
      .catch((error) => {
        alert(error.message);
        setUpdateloading(false);
        // this.setState({
        //   Updateloading: false,
        // });
      });
  };

  const addMoreFields = () => {
    var newArr = {
      mcqid: "",
      questionid: questionID,
      choice: "",
      sortorder: "",
      active: true,
    };
    setother_fields(other_fields.concat(newArr));
    // this.setState({
    //   other_fields: this.state.other_fields.concat(newArr),
    // });
  };

  const removeOther = (index) => {
    other_fields.splice(index, 1);

    // setother_fields((prevState) => ({
    //    ...prevState.other_fields
    // }))

    // setother_fields((prevState) => ({
    //   ...prevState.other_fields
    // }));

    // setother_fields(prevState => {
    //   return new Map(prevState.other_fields).set(other_fields);
    // });

    const other = other_fields;
    // const date = { name, email }
    const newmcqNewData = [...other];

    setother_fields(newmcqNewData);

    // this.setState((prevState) => ({
    //   other_fields: [...prevState.other_fields],
    // }));

    // console.log(othexr_fields)
  };
  // console.log(other_fields)

  const addMoreChoice = (newName, index) => {
    const other = other_fields;
    // const date = { name, email }
    const newmcqNewData = [...other];

    newmcqNewData[index].choice = newName;
    // this.setState({ other_fields: newmcqNewData });

    setother_fields(newmcqNewData);

    console.log(newmcqNewData);
  };

  const addMoreOrder = (newName, index) => {

    const re = /^[0-9\b]+$/;
      if (newName === '' || re.test(newName)) {
        const other = other_fields;
        // const date = { name, email }
        const newmcqNewData = [...other];
    
        newmcqNewData[index].sortorder = Number(newName);
        setother_fields(newmcqNewData);
        // this.setState({ other_fields: newmcqNewData });
    
        console.log(newmcqNewData);
      }


    // const other = other_fields;
    // // const date = { name, email }
    // const newmcqNewData = [...other];

    // newmcqNewData[index].sortorder = Number(newName);
    // setother_fields(newmcqNewData);
    // // this.setState({ other_fields: newmcqNewData });

    // console.log(newmcqNewData);
  };

  const addMoreActives = (newName, index) => {
    console.log(index);
    const other = other_fields;
    // const date = { name, email }
    const newmcqNewData = [...other];

    if (newName === "false") {
      let tr = true;
      newmcqNewData[index].active = tr;
    } else {
      let fl = false;
      newmcqNewData[index].active = fl;
    }
    // this.setState({ other_fields: newmcqNewData });

    setother_fields(newmcqNewData);

    console.log(newName, index);
    console.log(newmcqNewData);
  };

  const onlyNuberAllow=(e)=>{
    const re = /^[0-9\b]+$/;
      if (e.target.value === '' || re.test(e.target.value)) {
        setsortOrder(e.target.value)
        //  this.setState({order: e.target.value})
      }
  }

  return (
    <>
    <>
    <Helmet>
          <title>Feedback Edit</title>
        </Helmet>
    </>

      <Header />
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
              <Link to="/feedback/questions">
                <button type="button" className="mr-1 btn btn-success">
                  <BiShowAlt
                    className="fa pe-7s-help1"
                    style={{ marginBottom: "3%" }}
                  />{" "}
                  Show Feedbacks
                </button>
              </Link>
            </div>
          </div>
        </div>

        <div className="txtb">
          <div className="card-header bg-info text-white">FEEDBACK DETAILS</div>

          <div style={{ padding: "1.25rem" }}>
            {!showMcq ? (
              <>
                <div className="form-row">
                  <div className="col-md-3 mb-1 ">
                    <label>Type</label>
                    <span className="text-danger">*</span>
                    <div className="position-relative form-group ">
                      <select
                        disabled={upType ? true : false}
                        id=""
                        className="form-control"
                        value={question_type}
                        aria-label="question_type"
                        name="question_type"
                        title="question_type"
                        onChange={(e) => setquestion_type(e.target.value)}
                      >
                        <option value="" hidden>
                          Type of Question
                        </option>
                        <option value="GEN">GENERAL</option>
                        <option value="MCQ">MCQ</option>
                        <option value="RATE">RATE</option>
                      </select>
                    </div>
                  </div>

                  <div className="col-md-8 mb-1">
                    <label>Heading</label><span className="text-danger">*</span>
                    <input
                      type="text"
                      value={heading}
                      onChange={(e) => setheading(e.target.value)}
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
                        value={question}
                        onChange={(e) => setquestion(e.target.value)}
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
                      {showValidFromDate ? (
                        <DatePicker
                          value={validFrom}
                          onChange={(date) =>
                            //  this.setState({
                            //    validFrom: date,
                            //    showValidFromDate: false,
                            //  })

                            {
                              setvalidFrom(date);
                              setshowValidFromDate(false);
                            }
                          }
                          dateFormat="MM/dd/yyyy h:mm aa"
                          showTimeInput
                          className="form-control"
                        />
                      ) : (
                        <DatePicker
                          selected={validFrom}
                          onChange={(date) =>
                            //  this.setState({ validFrom: date })
                            setvalidFrom(date)
                          }
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
                      {showValidUptoDate ? (
                        <DatePicker
                          value={validUpto}
                          onChange={(date) =>
                            //  this.setState({
                            //    validUpto: date,
                            //    showValidUptoDate: false,
                            //  })
                            {
                              setvalidUpto(date);
                              setshowValidUptoDate(false);
                            }
                          }
                          dateFormat="MM/dd/yyyy h:mm aa"
                          showTimeInput
                          className="form-control"
                        />
                      ) : (
                        <DatePicker
                          selected={validUpto}
                          onChange={(date) =>
                            //  this.setState({ validUpto: date })
                            setvalidUpto(date)
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
                            checked={active ? "checkbox" : null}
                            onChange={() =>
                              //  this.setState({
                              //    active: active ? false : true,
                              //  })
                              setactive(active ? false : true)
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

                {hideSaveBttn && (
                  <div className="card-footer">
                    <div className="col-md-12 mb-0 text-center">
                      {!loading ? (
                        <>
                          <input
                            type="submit"
                            name="created"
                            value="SAVE"
                            className="btn-wide btn btn-success"
                            onClick={() => checkFeed()}
                          />

                          <Link to="/feedback/questions">
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
                      value={choice}
                      onChange={(e) =>
                        //  this.setState({ choice: e.target.value })
                        setchoice(e.target.value)
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
                        type="text"
                        value={sortOrder}
                        maxLength={3}
                        onChange={(e) =>
                          onlyNuberAllow(e)
                          //  this.setState({ sortOrder: e.target.value })
                          // setsortOrder(e.target.value)
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
                            checked={activeMcq ? "checkbox" : null}
                            onChange={() =>
                              //  this.setState({
                              //    activeMcq: activeMcq ? false : true,
                              //  })

                              setactiveMcq(activeMcq ? false : true)
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
                    {!loading ? (
                      <>
                        <input
                          type="submit"
                          name="created"
                          value="SAVE"
                          className="btn-wide btn btn-success"
                          onClick={() => addMcq()}
                        />
                        <Link to="/feedback/questions">
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
            )}

            {/* --------------------------------------NEW-DATA-FOR-UPDATE--------------------------------------------------------------- */}

            {showNewMcqData && (
              <div>
                {mcqNewData.map((item, index) => {
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
                                updateCompany(e.target.value, index)
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
                                type="text"
                                maxLength={3}
                                value={item.sortorder}
                                onChange={(e) =>
                                  updateOrder(e.target.value, index)
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
                                      updateActive(e.target.value, index)
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

                {other_fields.map((item, addMoreIndex) => {
                  console.log(item, addMoreIndex, item.delete);
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
                            addMoreChoice(e.target.value, addMoreIndex)
                          }
                          className="form-control"
                        />
                      </div>

                      <div className="col-md-5 mb-1 ">
                        <label>Sort Order</label>
                        <span className="text-danger">*</span>
                        <div className="position-relative form-group ">
                          <input
                            type="text"
                            maxLength={3}
                            value={item.sortorder}
                            onChange={(e) =>
                              addMoreOrder(e.target.value, addMoreIndex)
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
                                id={`${addMoreIndex + 9811}`}
                                name="Show"
                                type="checkbox"
                                value={item.active}
                                checked={item.active ? "checkbox" : null}
                                onChange={(e) =>
                                  addMoreActives(e.target.value, addMoreIndex)
                                }
                              />
                              <input name="Show" type="hidden" value="false" />
                              <label
                                className="custom-control-label"
                                htmlFor={`${addMoreIndex + 9811}`}
                              >
                                Active
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>

                      <span
                        className="addotherurl removeMore"
                        onClick={() => removeOther(addMoreIndex)}
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

                {showAddMoreUpdate && (
                  <div className="col-12 pd-0 addmore">
                    <label className="form-label add-more">
                      Add more fields
                    </label>
                    <span
                      className="addotherurl cursor"
                      onClick={() => addMoreFields()}
                    >
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
                    {!Updateloading ? (
                      <>
                        <input
                          type="submit"
                          name="created"
                          value="SAVE"
                          className="btn-wide btn btn-success"
                          onClick={() => checkFeed()}
                        />

                        <Link to="/feedback/questions">
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
            )}


            {bigLoader ? (
              <div className="ldbi">
              <TailSpin
                color="#00BFFF"
                height={80}
                width={100}
                ariaLabel="loading"
              />
            </div>
            ):null}

            

            {/* ---------------------------------------------------------------------------------------------------- */}
          </div>
        </div>
      </div>
    </>
  );
};

export default FeedbackEdit;
