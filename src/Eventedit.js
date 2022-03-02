// import React, { Component } from "react";

// import {
//     EditorState,
//     convertToRaw,
//     ContentState,
//     convertFromHTML,
// } from "draft-js";
// import draftToHtml from "draftjs-to-html";
// import { FiUsers } from "react-icons/fi";
// import { BsQuestionCircle } from "react-icons/bs";

// import { Editor } from "react-draft-wysiwyg";
// import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
// import DatePicker from "react-datepicker";
// import { TailSpin } from "react-loader-spinner";
// import moment from "moment";
// import Header from './common/header';
// import { Link  ,useSearchParams  } from 'react-router-dom'

// let htmlToDraft = null;
// if (typeof window === "object") {
//     htmlToDraft = require("html-to-draftjs").default;
// }

// function withParams(Component) {
//     return props => <Component {...props} params={useSearchParams()} />;
//   }

// class Eventedit extends Component {
//     constructor(props) {
//         super(props);

//         this.state = {
//             editorState: EditorState.createEmpty(),
//             profileImg: "",
//             eventName: "",
//             validFrom: new Date(),
//             validUpto: new Date(),
//             loading: false,
//             physical: false,
//             virtual: false,
//             system: false,
//             showValidFromDate: false,
//             showValidUptoDate: false,
//             showBackBtn: false,
//             registrationLink: "",
//             location: "",
//             type: "",
//             showimage: require('./image/noimage.png')
//         };
//     }

//     static async getInitialProps({ query }) {
//         return { data: query };
//     }

//     componentDidMount() {

//         const id = this.props.params[0].get('id');
//         const type = this.props.params[0].get('type');

//         const libconCode = JSON.parse(localStorage.getItem("libCode"));
//         console.log("libconCode :- ", libconCode, "editorState ", this.state.editorState)


//         this.setState({
//             libconCode: libconCode
//         })

//         if (this.props) {
//             if (this.props.params) {
//                 if (this.props.params[0].get('id')) {
//                     //
//                     // console.log("id :- ", this.props.data.id);
//                     this.getContentDetails(libconCode,id);
//                 }
//             }
//         }
//     }

//     getContentDetails(libconCode,id) {
//         fetch(`http://192.168.1.217:1003/api/showevent?libid=${libconCode}&id=${id}`, {
//             method: "GET",
//             headers: {
//                 Accepts: "application/json",
//                 "content-type": "application/json",
//             },
//         }).then((result) => {
//             result.json().then((resp) => {
//                 console.log("Data=", resp.data);
//                 console.log("ValidFrom=", resp.data[0].contentImage);
//                 if (resp.response === "Success") {
//                     this.setState({
//                         showBackBtn: true,
//                         showValidFromDate: true,
//                         showValidUptoDate: true,
//                         contentData: resp.data,
//                         eventName: resp.data[0].eventName,
                        
//                         location: resp.data[0].location,
//                         type: resp.data[0].type,
//                         registrationLink: resp.data[0].registrationLink,
//                         // showimage: "data:image/png;base64," + resp.data[0].contentImage,
//                         showimgHover: true,
//                         physical: resp.data[0].physicalMode,
//                         system: resp.data[0].active,
//                         virtual: resp.data[0].virtualMode,
//                         validFrom: moment(resp.data[0].validFrom).format("MM-DD-YYYY hh:mm a").replace("T", " "),
//                         validUpto: moment(resp.data[0].validUpto).format("MM-DD-YYYY hh:mm a").replace("T", " "),

//                         id: resp.data[0].id,
//                     });

//                     if(resp.data[0].contentImage === null){
//                         this.setState({
//                             showimage: require('./image/noimage.png')
//                         })
//                     }else{
//                         this.setState({
//                             showimage: "data:image/png;base64," + resp.data[0].contentImage,
//                         })
//                     }

//                     const html = resp.data[0].description;
//                     const contentBlock = htmlToDraft(html);
//                     if (contentBlock) {
//                         const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
//                         const editorState = EditorState.createWithContent(contentState);
//                         this.setState({
//                             editorState: editorState,
//                         });
//                         // this.setState({
//                         //     editorState: EditorState.createWithContent(
//                         //         ContentState.createFromBlockArray(convertFromHTML(html))
//                         //     ),
//                         // });
//                     }
//                 }
//             });
//         }).catch(error => {
//             alert("There is problem in your credentials.")
//         })
//     }

//     onEditorStateChange = (editorState) => {
//         this.setState({
//             editorState,
//         });
//         // console.log(draftToHtml(convertToRaw(editorState.getCurrentContent())));
//     };

//     imageHandler = (e) => {
//         this.setState({
//             hideImage: false
//         })
//         const reader = new FileReader();
//         reader.onload = () => {
//             if (reader.readyState === 2) {
//                 this.setState({
//                     showimage: reader.result,
//                     showimgHover: true,
//                 });
//                 let png = reader.result;
//                 png = png.includes("data:image/png;base64,");

//                 let jpg = reader.result;
//                 jpg = jpg.includes("data:image/jpg;base64,");

//                 let jpeg = reader.result;
//                 jpeg = jpeg.includes("data:image/jpeg;base64,");

//                 if (png === true) {
//                     let data = reader.result.replace("data:image/png;base64,", "");
//                     this.setState({
//                         profileImg: data,
//                     });
//                     // console.log("replace png :- ", data);
//                 } else if (jpg === true) {
//                     let data = reader.result.replace("data:image/jpg;base64,", "");
//                     this.setState({
//                         profileImg: data,
//                     });
//                     // console.log("replace jpg :- ", data);
//                 } else if (jpeg === true) {
//                     let data = reader.result.replace("data:image/jpeg;base64,", "");
//                     this.setState({
//                         profileImg: data,
//                     });
//                     // console.log("replace jpeg :- ", data);
//                 }
//             }
//         };
//         reader.readAsDataURL(e.target.files[0]);
//     };

//     checkSaveContent() {
//         const {
//             editorState,
//             eventName,
//             physical,
//             system,
//             virtual,
//             profileImg,
//             validFrom,
//             validUpto,
//             location,
//             registrationLink,
//             type,
//             id,
//             libconCode
//         } = this.state;
//         if (this.state.eventName != "" && this.state.editorState != "" && location != "" && registrationLink != "" && type != "") {
//             this.setState({
//                 loading: true,
//             });
//             this.saveContent();
//         } else {
//             this.setState({
//                 loading: false,
//             });
//             alert("Please fill the details...");
//         }
//     }

//     saveContent() {
//         const {
//             editorState,
//             eventName,
//             physical,
//             system,
//             virtual,
//             profileImg,
//             validFrom,
//             validUpto,
//             location,
//             registrationLink,
//             type,
//             id,
//             libconCode
//         } = this.state;

//         fetch(`${process.env.PATH_URL}saveevent`, {
//             method: "POST",
//             headers: {
//                 Accept: "application/json",
//                 "content-type": "application/json",
//             },
//             body: JSON.stringify({
//                 id: id,
//                 libcode: libconCode,
//                 eventName: eventName,
//                 type: type,
//                 description: draftToHtml(convertToRaw(editorState.getCurrentContent())),
//                 organiser: "BITSoM",
//                 imageType: ".jpg",
//                 virtualMode: virtual,
//                 physicalMode: physical,
//                 validFrom: moment(this.state.validFrom).format("MM-DD-YYYY hh:mm:ss a"),
//                 validUpto: moment(this.state.validUpto).format("MM-DD-YYYY hh:mm:ss a"),
//                 location: location,
//                 registrationLink: registrationLink,
//                 active: system,
//                 contentImage: profileImg,
//             }),
//         })
//             .then((result) => {
//                 result.json().then((resp) => {
//                     // console.log("response :- ", resp);
//                     if (resp.response === "Success") {
//                         this.setState({
//                             loading: false,
//                             editorState: "",
//                             eventName: "",

//                             validFrom: "",
//                             validUpto: "",
//                             location: "",
//                             registrationLink: "",
//                             type: "",
//                             physical: false,
//                             system: false,
//                             virtual: false,
//                         });
//                         // Router.push('/events')
//                         alert("Event Update Successfully.")
//                     } else {
//                         this.setState({
//                             loading: false,
//                         });
//                         alert("Something wents wrong.");
//                     }
//                 });
//             })
//             .catch((error) => {
//                 this.setState({
//                     loading: false,
//                 });
//                 // console.log("There is problem in your credentials." + error.message);
//             });
//     }

//     reset() {
//         this.setState({
//             loading: false,
//             editorState: "",
//             eventName: "",
//             hideImage: true,
//             profileImg: "",
//             validFrom: "",
//             validUpto: "",
//             location: "",
//             registrationLink: "",
//             type: "",
//         });
//     }

//     ExampleCustomTimeInput = ({ date, value, onChange }) => (
//         <input
//             value={value}
//             onChange={(e) => onChange(e.target.value)}
//             style={{ border: "solid 1px pink" }}
//         />
//     );

//     render() {
//         // const {
//         //     editorState,
//         //     eventName,
//         //     physical,
//         //     system,
//         //     virtual,
//         //     profileImg,
//         //     validFrom,
//         //     validUpto,
//         //     location,
//         //     registrationLink,
//         //     type,
//         // } = this.state;
//         // console.log(moment(this.state.validUpto).format("MM-DD-YYYY hh:mm:ss"))
//         // console.log(validFrom);

//         return (
//             <>
//                 <Header/>
//                 <div className="txt" id="pddd">
//                     <div className="app-page-title">
//                         <div className="page-title-wrapper">
//                             <div className="page-title-heading">
//                                 <div className="page-title-icon">
//                                     <FiUsers className="pe-7s-users icon-gradient bg-mean-fruit" />
//                                 </div>
//                                 <div>
//                                     EVENT - ADD/UPDATE
//                                     <div className="page-title-subheading">
//                                         <p>
//                                             Enter the details and click on SAVE button to save the
//                                             details.
//                                         </p>
//                                     </div>
//                                 </div>
//                             </div>
//                             <div className="page-title-actions">
//                                     <Link to={"/events"}>
//                                         <button type="button" className="mr-1 btn btn-success">
//                                             <BsQuestionCircle
//                                                 className="fa pe-7s-help1"
//                                                 style={{ marginBottom: "3%" }}
//                                             />{" "}
//                                             Show Events
//                                         </button>
//                                     </Link>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="txtb">
//                         <div className="card-header bg-info text-white">EVENT DETAILS</div>

//                         <div style={{ padding: "1.25rem" }}>
//                             <div className="form-row mb-1">
//                                 <div className="col-md-8 mb-1">
//                                     <label>Event Name</label>
//                                     <span className="text-danger">*</span>

//                                     <input
//                                         type="text"
//                                         value={this.state.eventName}
//                                         onChange={(e) => this.setState({ eventName: e.target.value })}
//                                         className="form-control"
//                                         placeholder="Event Name..."
//                                         required=""
//                                         autoFocus=""
//                                         autoComplete="on"
//                                     />
//                                 </div>

//                                 <div className="col-md-2 mb-1 ">
//                                     <label>Image</label>
//                                     <input
//                                         className="form-control-file"
//                                         id="contentimage"
//                                         name="contentimage"
//                                         type="file"
//                                         value=""
//                                         accept="image/*"
//                                         onChange={this.imageHandler}
//                                     />
//                                 </div>

//                                 {this.state.showimgHover ? (
//                                     <div className="col-md-1 mb-1 imghover" style={{ display: this.state.hideImage ? "none" : "block" }}>
//                                         <img
//                                             src={this.state.showimage}
//                                             alt="profile"
//                                             className="preImage"
//                                         />

//                                         <div className="imgh">
//                                             <img
//                                                 src={this.state.showimage}
//                                                 alt="profile"
//                                                 className="ImghImage"
//                                                 width={400}
//                                                 height={400}
//                                             />
//                                         </div>
//                                     </div>
//                                 ) : null}
//                             </div>

//                             <div className="form-row">
//                                 <div className="col-md-8 mb-1">
//                                     <label>Location</label>
//                                     <span className="text-danger">*</span>

//                                     <input
//                                         type="text"
//                                         value={this.state.location}
//                                         onChange={(e) => this.setState({ location: e.target.value })}
//                                         className="form-control"
//                                         placeholder="location..."
//                                         required=""
//                                         autoFocus=""
//                                         autoComplete="on"
//                                     />
//                                 </div>

//                                 <div className="col-md-3 mb-1 ">
//                                     <label>Valid From Date</label>
//                                     <span className="text-danger">*</span>
//                                     <div className="position-relative form-group ">
//                                         {this.state.showValidFromDate ? (
//                                             <DatePicker
//                                                 value={this.state.validFrom}
//                                                 onChange={(date) => this.setState({
//                                                     validFrom: date,
//                                                     showValidFromDate: false
//                                                 })}
//                                                 // customTimeInput={<ExampleCustomTimeInput />}
//                                                 dateFormat="MM/dd/yyyy h:mm aa"
//                                                 showTimeInput
//                                                 className="form-control"
//                                             />
//                                         ) : (
//                                             <DatePicker
//                                                 selected={this.state.validFrom}
//                                                 onChange={(date) => this.setState({ validFrom: date })}
//                                                 // customTimeInput={<ExampleCustomTimeInput />}
//                                                 dateFormat="MM/dd/yyyy hh:mm aa"
//                                                 showTimeInput
//                                                 className="form-control"
//                                             />
//                                         )}
//                                     </div>
//                                 </div>

//                                 {/* <div className="col-md-2 mb-1 ">
//                 <label>valid From Time</label><span className="text-danger">*</span>
//                 <div className="position-relative form-group ">



//                   <TimePicker value={this.state.value} onChange={this.handleChange} className='form-control' />

//                 </div>

//               </div> */}
//                             </div>

//                             <div className="form-row">
//                                 <div className="col-md-8 mb-1">
//                                     <label>Registration Link</label>
//                                     <span className="text-danger">*</span>

//                                     <input
//                                         type="text"
//                                         value={this.state.registrationLink}
//                                         onChange={(e) =>
//                                             this.setState({ registrationLink: e.target.value })
//                                         }
//                                         className="form-control"
//                                         placeholder="Registration Link..."
//                                         required=""
//                                         autoFocus=""
//                                         autoComplete="on"
//                                     />
//                                 </div>

//                                 <div className="col-md-3 mb-1 ">
//                                     <label>Valid Upto</label>
//                                     <span className="text-danger">*</span>
//                                     <div className="position-relative form-group ">



//                                         {this.state.showValidUptoDate ? (
//                                             <DatePicker
//                                                 value={this.state.validUpto}
//                                                 onChange={(date) => this.setState({
//                                                     validUpto: date,
//                                                     showValidUptoDate: false
//                                                 })}
//                                                 timeInputLabel="Time:"
//                                                 dateFormat="MM/dd/yyyy h:mm aa"
//                                                 showTimeInput
//                                                 className="form-control"
//                                             />
//                                         ) : (
//                                             <DatePicker
//                                                 selected={this.state.validUpto}
//                                                 onChange={(date) => this.setState({ validUpto: date })}
//                                                 timeInputLabel="Time:"
//                                                 dateFormat="MM/dd/yyyy h:mm aa"
//                                                 showTimeInput
//                                                 className="form-control"
//                                             />
//                                         )}
//                                     </div>
//                                 </div>
//                             </div>

//                             <div className="form-row">
//                                 <div className="col-md-3 mb-1">
//                                     <label>Type</label>
//                                     <span className="text-danger">*</span>

//                                     <input
//                                         type="text"
//                                         value={this.state.type}
//                                         onChange={(e) => this.setState({ type: e.target.value })}
//                                         className="form-control"
//                                         placeholder="Type..."
//                                         required=""
//                                         autoFocus=""
//                                         autoComplete="on"
//                                     />
//                                 </div>
//                             </div>

//                             <div className="mrt-2">
//                                 <label>Content Description</label>
//                                 <span className="text-danger">*</span>
//                             </div>

//                             <div className="textEditor">
//                                 <Editor
//                                     editorState={this.state.editorState}
//                                     toolbarClassName="toolbar-class"
//                                     wrapperClassName="wrapper-class"
//                                     editorClassName="editor-class"
//                                     onEditorStateChange={this.onEditorStateChange}
//                                     // toolbarOnFocus
//                                     toolbar={{
//                                         options: [
//                                             "inline",
//                                             "blockType",
//                                             "fontSize",
//                                             "fontFamily",
//                                             "list",
//                                             "textAlign",
//                                             "colorPicker",
//                                             "link",
//                                             "embedded",
//                                             "emoji",
//                                             "history",
//                                         ],
//                                         inline: { inDropdown: false },
//                                         list: { inDropdown: false },
//                                         textAlign: { inDropdown: false },
//                                         link: { inDropdown: false },
//                                         history: { inDropdown: false },
//                                         // image: {
//                                         //     urlEnabled: false,
//                                         //     uploadEnabled: false,
//                                         //     uploadCallback: this.uploadImageCallBack,
//                                         //     previewImage: false,
//                                         //     alignmentEnabled: false,
//                                         //     alt: { present: false, mandatory: false }
//                                         // },
//                                     }}
//                                 />
//                                 {/* <textarea
//                         disabled
//                         value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
//                     /> */}
//                             </div>

//                             <div
//                                 className="form-row"
//                                 style={{ marginTop: "2%", marginBottom: "2%" }}
//                             >
//                                 <div className="col-md-3 mb-1">
//                                     <label>Is Physical Mode</label>
//                                     <div className="position-relative form-group m-2">
//                                         <div>
//                                             <div className="custom-checkbox custom-control">
//                                                 <input
//                                                     className="custom-control-input"
//                                                     id="exampleCustomInline6"
//                                                     name="Active"
//                                                     type="checkbox"
//                                                     checked={this.state.physical ? "checkbox" : null}
//                                                     onChange={() =>
//                                                         this.setState({
//                                                             physical: this.state.physical ? false : true,
//                                                         })
//                                                     }
//                                                 />

//                                                 <input name="Active" type="hidden" value="false" />
//                                                 <label
//                                                     className="custom-control-label"
//                                                     htmlFor="exampleCustomInline6"
//                                                 >
//                                                     Physical
//                                                 </label>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 <div className="col-md-3 mb-1" style={{ marginLeft: "8%" }}>
//                                     <label>Is Virtual Mode</label>
//                                     <div className="position-relative form-group m-2">
//                                         <div>
//                                             <div className="custom-checkbox custom-control">
//                                                 <input
//                                                     className="custom-control-input"
//                                                     id="exampleCustomInline1"
//                                                     name="Show"
//                                                     type="checkbox"
//                                                     checked={this.state.virtual ? "checkbox" : null}
//                                                     onChange={() =>
//                                                         this.setState({
//                                                             virtual: this.state.virtual ? false : true,
//                                                         })
//                                                     }
//                                                 />
//                                                 <input name="Show" type="hidden" value="false" />
//                                                 <label
//                                                     className="custom-control-label"
//                                                     htmlFor="exampleCustomInline1"
//                                                 >
//                                                     Virtual
//                                                 </label>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 <div className="col-md-3 mb-1" style={{ marginLeft: "8%" }}>
//                                     <label>Keep Active In The System</label>
//                                     <div className="position-relative form-group m-2">
//                                         <div>
//                                             <div className="custom-checkbox custom-control">
//                                                 <input
//                                                     className="custom-control-input"
//                                                     id="systemActivity"
//                                                     name="Active"
//                                                     type="checkbox"
//                                                     checked={this.state.system ? "checkbox" : null}
//                                                     onChange={() =>
//                                                         this.setState({
//                                                             system: this.state.system ? false : true,
//                                                         })
//                                                     }
//                                                 />

//                                                 <input name="Active" type="hidden" value="false" />
//                                                 <label
//                                                     className="custom-control-label"
//                                                     htmlFor="systemActivity"
//                                                 >
//                                                     Active
//                                                 </label>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>

//                             <div className="card-footer">
//                                 <div className="col-md-12 mb-0 text-center">
//                                     {!this.state.loading ? (
//                                         <>
//                                             <input
//                                                 type="submit"
//                                                 name="created"
//                                                 value="SAVE"
//                                                 className="btn-wide btn btn-success"
//                                                 onClick={() => this.checkSaveContent()}
//                                             />

//                                             {this.state.showBackBtn ? (

//                                                     <Link to={"/events"}>
//                                                         <input
//                                                             type="reset"
//                                                             value="BACK"
//                                                             className="btn-wide btn btn-light"
//                                                             id="btnClear"
//                                                             style={{ marginLeft: "2%" }}
//                                                         />
//                                                     </Link>
//                                             ) : (
//                                                     <Link to={"#"}>
//                                                         <input
//                                                             type="reset"
//                                                             value="RESET"
//                                                             className="btn-wide btn btn-light"
//                                                             id="btnClear"
//                                                             style={{ marginLeft: "2%" }}
//                                                             onClick={() => this.reset()}
//                                                         />
//                                                     </Link>

//                                             )}
//                                         </>
//                                     ) : (
//                                         <div className="btn-wide btn ">
//                                             <TailSpin
//                                                 color="#00BFFF"
//                                                 height={30}
//                                                 width={50}
//                                                 ariaLabel="loading"
//                                             />
//                                         </div>
//                                     )}
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </>
//         );
//     }
// }



// export default withParams(Eventedit)



import React, { useState, useEffect } from "react";


import {
    EditorState,
    convertToRaw,
    ContentState,
} from "draft-js";
import draftToHtml from "draftjs-to-html";
import { FiUsers } from "react-icons/fi";
// import { BiShowAlt } from "react-icons/bs";
import { BiShowAlt } from "react-icons/bi";

import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import DatePicker from "react-datepicker";
import { TailSpin } from "react-loader-spinner";
import moment from "moment";
import Header from './common/header';
import { Link  ,useSearchParams,useNavigate  } from 'react-router-dom'
import { Helmet } from "react-helmet";

let htmlToDraft = null;
if (typeof window === "object") {
    htmlToDraft = require("html-to-draftjs").default;
}

function Eventedit() {
    const [editorState, setEditorState] = useState(EditorState.createEmpty())
    const [profileImg, setprofileImg] = useState('')
    const [eventName, seteventName] = useState('')
    const [validFrom, setvalidFrom] = useState(new Date())
    const [validUpto, setvalidUpto] = useState(new Date())
    const [loading, setloading] = useState(false)
    const [physical, setphysical] = useState(false)
    const [virtual, setvirtual] = useState(false)
    const [system, setsystem] = useState(false)
    const [showValidFromDate, setshowValidFromDate] = useState(false)
    const [showValidUptoDate, setshowValidUptoDate] = useState(false)
    const [showBackBtn, setshowBackBtn] = useState(false)
    const [registrationLink, setregistrationLink] = useState("")
    const [location, setlocation] = useState("")
    const [type, settype] = useState("")
    const [showimage, setshowimage] = useState(require('./image/noimage.png'))
    const [contentData, setcontentData] = useState([])
    const [showimgHover, setshowimgHover] = useState(false)
    const [id, setid] = useState("")
    const [libconCode, setlibconCode] = useState("")
    const [hideImage, sethideImage] = useState(true)
    const [bigLoader, setbigLoader] = useState(true)

    let naviagte = useNavigate()
    let [searchParams,setSearchParams]=useSearchParams()


    useEffect(() => {

        const componentwillMount = async () => {
          const id = searchParams.get('id');
        const type = searchParams.get('type');
        const libconCode = JSON.parse(localStorage.getItem("libCode"));
        // console.log("libconCode :- ", libconCode);
        setlibconCode(libconCode)
    
        if (searchParams) {
          // console.log(searchParams);
          if (searchParams.get('id')) {
              getContentDetails(libconCode,id);
          }
        }
        };
    
        componentwillMount();
      }, []);


      const getContentDetails=(libconCode,id)=> {
          fetch(`http://192.168.1.217:1003/api/showevent?libid=${libconCode}&id=${id}`, {
              method: "GET",
              headers: {
                  Accepts: "application/json",
                  "content-type": "application/json",
              },
          }).then((result) => {
              result.json().then((resp) => {
                  console.log("Data=", resp.data);
                //   console.log("ValidFrom=", resp.data[0].contentImage);
                  if (resp.response === "Success") {
                      setshowBackBtn(true)
                      setshowValidFromDate(true)
                      setshowValidUptoDate(true)
                      setcontentData(resp.data)
                      seteventName(resp.data[0].eventName)
                      setlocation(resp.data[0].location)
                      settype(resp.data[0].type)
                      setregistrationLink(resp.data[0].registrationLink)
                      setshowimgHover(true)
                      setphysical(resp.data[0].physicalMode)
                      setsystem(resp.data[0].active)
                      setvirtual(resp.data[0].virtualMode)
                      setvalidFrom(moment(resp.data[0].validFrom).format("MM-DD-YYYY hh:mm a").replace("T", " "))
                      setvalidUpto(moment(resp.data[0].validUpto).format("MM-DD-YYYY hh:mm a").replace("T", " "))
                      setid(resp.data[0].id)
                      setbigLoader(false)
  
                      if(resp.data[0].contentImage === null){
                        setshowimage(require('./image/noimage.png'))
                        setshowimgHover(true)
                        sethideImage(false)
                      }else{
                        setshowimgHover(true)
                        sethideImage(false)

                        let img = "data:image/png;base64," + resp.data[0].contentImage 
                        setshowimage(img)
                      }
  
                      const html = resp.data[0].description;
                      const contentBlock = htmlToDraft(html);
                      if (contentBlock) {
                          const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
                          const editorState = EditorState.createWithContent(contentState);
                          setEditorState(editorState)
                      }
                  }else{
                    naviagte("/events");
                      alert("Something went wrong. Please try again.");
                      setbigLoader(false)
                  }
              });
          }).catch(error => {
              alert("There is problem in your credentials.")
          })
      }


    const onEditorStateChange = (editorState) => {
        setEditorState(editorState)
        // this.setState({
        //   editorState,
        // });
        console.log(draftToHtml(convertToRaw(editorState.getCurrentContent())));
      };


      
  const imageHandler = (e) => {
    // console.log(e)
    sethideImage(false)
    
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setshowimage(reader.result)
        setshowimgHover(true)
      
        let png = reader.result;
        png = png.includes("data:image/png;base64,");

        let jpg = reader.result;
        jpg = jpg.includes("data:image/jpg;base64,");

        let jpeg = reader.result;
        jpeg = jpeg.includes("data:image/jpeg;base64,");

        if (png === true) {
          let data = reader.result.replace("data:image/png;base64,", "");
          setprofileImg(data)
         
          // console.log("replace png :- ", data);
        } else if (jpg === true) {
          let data = reader.result.replace("data:image/jpg;base64,", "");
          setprofileImg(data)
        
          // console.log("replace jpg :- ", data);
        } else if (jpeg === true) {
          let data = reader.result.replace("data:image/jpeg;base64,", "");
          setprofileImg(data)
          
          // console.log("replace jpeg :- ", data);
        }
      }
    };
    reader.readAsDataURL(e.target.files[0]);
  };


  
  const checkSaveContent=()=> {
    // if (this.state.eventName != "" && this.state.editorState != "" && location != "" && registrationLink != "" && type != "") {
    if (eventName !== "" && editorState !== "" && location != "" && registrationLink != "" && type != "") {
      setloading(true)
      saveContent();

    // console.log(
    //     "id:", id,
    //    " libcode:", libconCode,
    //   "  eventName:", eventName,
    //   "  type:" ,type,
    //     "description:", draftToHtml(convertToRaw(editorState.getCurrentContent())),
    //    " organiser:", "BITSoM",
    //     "imageType:", ".jpg",
    //     "virtualMode:", virtual,
    //  "   physicalMode: ",physical,
    //     "validFrom:", moment(validFrom).format("MM-DD-YYYY hh:mm:ss a"),
    //   "  validUpto:" ,moment(validUpto).format("MM-DD-YYYY hh:mm:ss a"),
    //    " location:" ,location,
    //    " registrationLink:", registrationLink,
    //    " active:" ,system,
    //     "contentImage: ",profileImg,
    // )
    } else {
      setloading(false)
      
      alert("Please fill the details...");
    }
  }



  
  const saveContent=()=> {

    console.log("chekcing")

    fetch(`http://192.168.1.217:1003/api/saveevent`, {
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
            imageType: ".jpg",
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
                    // this.setState({
                    //     loading: false,
                    //     editorState: "",
                    //     eventName: "",

                    //     validFrom: "",
                    //     validUpto: "",
                    //     location: "",
                    //     registrationLink: "",
                    //     type: "",
                    //     physical: false,
                    //     system: false,
                    //     virtual: false,
                    // });

                    // setloading(false)
                    // setshowBackBtn(false)
                    //   setshowValidFromDate(false)
                    //   setshowValidUptoDate(false)
                    //   setcontentData("")
                    //   seteventName("")
                    //   setlocation("")
                    //   settype("")
                    //   setregistrationLink("")
                    //   setshowimgHover(false)
                    //   setphysical(false)
                    //   setsystem(false)
                    //   setvirtual(false)
                    //   setid("")
                
                    naviagte('/events')
                    alert("Event Update Successfully.")
                } else {
                    setloading(false)
                    // this.setState({
                    //     loading: false,
                    // });
                    alert("Something wents wrong.");
                }
            });
        })
        .catch((error) => {
            setloading(false)
            console.log("There is problem in your credentials." + error.message);
        });
}

const reset=()=> {
    setloading(false)
    setshowBackBtn(false)
      setshowValidFromDate(false)
      setshowValidUptoDate(false)
      setcontentData("")
      seteventName("")
      setlocation("")
      settype("")
      setregistrationLink("")
      setshowimgHover(false)
      setphysical(false)
      setsystem(false)
      setvirtual(false)
      setid("")
}

  return (
    <>
    <Helmet>
          <title>Event Edit</title>
        </Helmet>
                <Header/>
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

                                <div className="col-md-2 mb-1 ">
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
                                </div>

                                {showimgHover ? (
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
                                ) : null}
                            </div>

                            <div className="form-row">
                                <div className="col-md-8 mb-1">
                                    <label>Location</label>
                                    <span className="text-danger">*</span>

                                    <input
                                        type="text"
                                        value={location}
                                        onChange={(e) =>  setlocation( e.target.value)}
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
                                                onChange={(data)=> {setvalidFrom(data);setshowValidFromDate(false)}}
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
                                                onChange={(data)=> setvalidFrom(data)}
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
                                        onChange={(e) =>
                                            setregistrationLink(e.target.value)
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



                                        {showValidUptoDate ? (
                                            <DatePicker
                                                value={validUpto}
                                                onChange={(data)=> {setvalidUpto(data);setshowValidUptoDate(false)}}
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
                                                onChange={(data)=> setvalidUpto(data)}
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
                                                    onChange={() =>
                                                        setphysical(physical ? false : true)
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
                                                    onChange={() =>
                                                        setvirtual(virtual ? false : true)
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
                                                    onChange={() =>
                                                        setsystem(system ? false : true)
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
                    </div>
                </div>
            </>
  )
}

export default Eventedit