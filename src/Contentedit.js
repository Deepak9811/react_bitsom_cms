// import React, { Component } from "react";

// import {
//   EditorState,
//   convertToRaw,
//   ContentState,
//   convertFromHTML,
// } from "draft-js";
// import draftToHtml from "draftjs-to-html";
// import { FiUsers } from "react-icons/fi";
// import { BsQuestionCircle } from "react-icons/bs";

// import { Editor } from "react-draft-wysiwyg";
// import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
// import { TailSpin } from "react-loader-spinner";

// import { Link  ,useSearchParams  } from 'react-router-dom'
// import Header from "./common/header";

// let htmlToDraft = null;
// if (typeof window === "object") {
//   htmlToDraft = require("html-to-draftjs").default;
// }

// function withParams(Component) {
//   return props => <Component {...props} params={useSearchParams()} />;
// }

// class ArticleEditor extends Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       editorState: EditorState.createEmpty(),
//       profileImg: "",
//       heading: "",
//       showChngPass: false,
//       order: "",
//       system: false,
//       app: "",
//       loading: false,
//       contentId: "",
//       showBackBtn: false,
//       heading: "",
//       showimage: "/Image/noimage.png",
//     };
//   }

//   static async getInitialProps({ query }) {
//     return { data: query };
//   }

//   componentDidMount() {
//     const id = this.props.params[0].get('id');
//     const type = this.props.params[0].get('type');
//     const libconCode = JSON.parse(localStorage.getItem("libCode"));
//     console.log("libconCode :- ", libconCode);
//     this.setState({
//       libconCode: libconCode,
//     });

//     if (this.props) {
//       console.log(this.props);
//       if (this.props.params) {
//         if (this.props.params[0].get('id')) {
//           this.getContentDetails(id, libconCode);
//           // console.log(
//           //   "heading :- ",
//           //   this.state.heading,
//           //   " order :- ",
//           //   this.state.order,
//           //   "this.props.data.id :- ",
//           //   this.props.data.id
//           // );
//         }
//       }
//     }
//   }

//   getContentDetails(id, libconCode) {
//     // const libconCode =  localStorage.setItem("user_name", JSON.stringify(resp.data.Name));

//     fetch(
//       `http://192.168.1.217:1003/api/showcontent?libid=${libconCode}&id=${id}`,
//       {
//         method: "GET",
//         headers: {
//           Accepts: "application/json",
//           "content-type": "application/json",
//         },
//       }
//     ).then((result) => {
//       result.json().then((resp) => {
//         console.log(resp);
//         if (resp.response === "Success") {
//           this.setState({
//             contentData: resp.data,
//             heading: resp.data[0].heading,
//             // showimage: "data:image/png;base64," + resp.data[0].contentimage,
//             showimgHover: true,
//             order: resp.data[0].SortOrder,
//             system: resp.data[0].Active,
//             app: resp.data[0].Show,
//             contentId: resp.data[0].contentId,
//             showBackBtn: true,
//           });

//           // if (resp.data[0].contentimage != null) {
//           //     this.setState({
//           //         showimgHover: true,
//           //     })
//           // }

//           if (resp.data[0].contentimage === null) {
//             this.setState({
//               showimage: "/Image/noimage.png",
//             });
//           } else {
//             this.setState({
//               showimage: "data:image/png;base64," + resp.data[0].contentimage,
//             });
//           }

//           const html = resp.data[0].text;
//           const contentBlock = htmlToDraft(html);
//           if (contentBlock) {
//             const contentState = ContentState.createFromBlockArray(
//               contentBlock.contentBlocks
//             );
//             const editorState = EditorState.createWithContent(contentState);
//             this.setState({
//               editorState: editorState,
//             });
//           }
//         }
//       });
//     });
//   }

//   onEditorStateChange = (editorState) => {
//     this.setState({
//       editorState,
//     });
//     console.log(draftToHtml(convertToRaw(editorState.getCurrentContent())));
//   };

//   imageHandler = (e) => {
//     this.setState({
//       hideImage: false,
//     });
//     const reader = new FileReader();
//     reader.onload = () => {
//       if (reader.readyState === 2) {
//         this.setState({
//           showimage: reader.result,
//           showimgHover: true,
//         });
//         let png = reader.result;
//         png = png.includes("data:image/png;base64,");

//         let jpg = reader.result;
//         jpg = jpg.includes("data:image/jpg;base64,");

//         let jpeg = reader.result;
//         jpeg = jpeg.includes("data:image/jpeg;base64,");

//         if (png === true) {
//           let data = reader.result.replace("data:image/png;base64,", "");
//           this.setState({
//             profileImg: data,
//           });
//           console.log("replace png :- ", data);
//         } else if (jpg === true) {
//           let data = reader.result.replace("data:image/jpg;base64,", "");
//           this.setState({
//             profileImg: data,
//           });
//           console.log("replace jpg :- ", data);
//         } else if (jpeg === true) {
//           let data = reader.result.replace("data:image/jpeg;base64,", "");
//           this.setState({
//             profileImg: data,
//           });
//           console.log("replace jpeg :- ", data);
//         }
//       }
//     };
//     reader.readAsDataURL(e.target.files[0]);
//   };

//   checkSaveContent() {
//     if (this.state.heading !== "" && this.state.order !== "") {
//       this.setState({
//         loading: true,
//       });
//       this.saveContent();
//     } else {
//       this.setState({
//         loading: false,
//       });
//       alert("Please fill the details...");
//       console.log(
//         "heading :- ",
//         this.state.heading,
//         ", editor :- ",
//         this.state.editorState,
//         " order :- ",
//         this.state.order
//       );
//     }
//   }

//   saveContent() {
//     const {
//       editorState,
//       heading,
//       order,
//       system,
//       app,
//       profileImg,
//       contentId,
//       libconCode,
//     } = this.state;
//     fetch(`http://192.168.1.217:1003/api/savecontent`, {
//       method: "POST",
//       headers: {
//         Accept: "application/json",
//         "content-type": "application/json",
//       },
//       body: JSON.stringify({
//         contentId: contentId,
//         libcode: libconCode,
//         heading: heading,
//         text: draftToHtml(convertToRaw(editorState.getCurrentContent())),
//         SortOrder: order,
//         imageType: ".jpg",
//         Active: system,
//         Show: app,
//         contentimage: profileImg,
//       }),
//     })
//       .then((result) => {
//         result.json().then((resp) => {
//           console.log("response :- ", resp);
//           if (resp.response === "Success") {
//             this.setState({
//               loading: false,
//               contentId: "",
//               libcode: "",
//               heading: "",
//               editorState: "",
//               order: "",
//               system: false,
//               app: false,
//               profileImg: "",
//             });
//             // Router.push('/contents')
//             alert("Content Update Successfully.");
//           } else {
//             this.setState({
//               loading: false,
//             });
//             alert("Something went wrong.");
//           }
//         });
//       })
//       .catch((error) => {
//         this.setState({
//           loading: false,
//         });
//         console.log("There is problem in your credentials." + error.message);
//       });
//   }

//   reset() {
//     this.setState({
//       editorState: "",
//       profileImg: [],
//       hideImage: true,
//       heading: "",
//       order: false,
//       system: false,
//       app: false,
//     });
//   }

//   render() {
//     // const { editorState, heading, order, system, app, profileImg, showimage } = this.state;
//     console.log(this.props);
//     return (
//       <>
//         <Header />

//         <div className="txt" id="pddd">
//           <div className="app-page-title">
//             <div className="page-title-wrapper">
//               <div className="page-title-heading">
//                 <div className="page-title-icon">
//                   <FiUsers className="pe-7s-users icon-gradient bg-mean-fruit" />
//                 </div>
//                 <div>
//                   CONTENT - ADD/UPDATE
//                   <div className="page-title-subheading">
//                     <p>
//                       Enter the details and click on SAVE button to save the
//                       details.
//                     </p>
//                   </div>
//                 </div>
//               </div>
//               <div className="page-title-actions">
//                 {/* <Link to={"/content"+"?id="+1+"&type="+"mobile"}> */}
//                 <Link to={"/content"}>
//                   <button type="button" className="mr-1 btn btn-success">
//                     <BsQuestionCircle
//                       className="fa pe-7s-help1"
//                       style={{ marginBottom: "3%" }}
//                     />{" "}
//                     Show Contents
//                   </button>
//                 </Link>
//               </div>
//             </div>
//           </div>

//           <div className="txtb">
//             <div className="card-header bg-info text-white">
//               CONTENT DETAILS
//             </div>

//             <div style={{ padding: "1.25rem" }}>
//               <div className="form-row">
//                 <div className="col-md-8 mb-1">
//                   <label>Heading</label>
//                   <span className="text-danger">*</span>

//                   <input
//                     type="text"
//                     value={this.state.heading}
//                     onChange={(e) => this.setState({ heading: e.target.value })}
//                     className="form-control"
//                     placeholder="Heading Name..."
//                     required=""
//                     autoFocus=""
//                     autoComplete="on"
//                   />
//                 </div>

//                 <div className="col-md-2 mb-1 mt-1">
//                   <label>Image</label>
//                   <input
//                     className="form-control-file"
//                     id="contentimage"
//                     name="contentimage"
//                     type="file"
//                     value=""
//                     accept="image/*"
//                     onChange={this.imageHandler}
//                   />
//                 </div>

//                 {/* {this.state.showimgHover ? (
//                                     <div className="col-md-1 mb-1 imghover" style={{ display: this.state.hideImage ? "none" : "block" }}>
//                                         <Image src={this.state.showimage} alt="profile" className='preImage' width={500}
//                                             height={500} />

//                                         <div className='imgh' >
//                                             <Image src={this.state.showimage} alt="profile" className='imghImage' width={500}
//                                                 height={500} />
//                                         </div>
//                                     </div>
//                                 ) : null} */}

//                 {this.state.showimgHover ? (
//                   <div
//                     className="col-md-1 mb-1 imghover"
//                     style={{ display: this.state.hideImage ? "none" : "block" }}
//                   >
//                     <img
//                       src={this.state.showimage}
//                       alt="profile"
//                       className="preImage"
//                       width={500}
//                       height={500}
//                     />

//                     <div className="imgh">
//                       <img
//                         src={this.state.showimage}
//                         alt="profile"
//                         className="ImghImage"
//                         width={500}
//                         height={500}
//                       />
//                     </div>
//                   </div>
//                 ) : null}
//               </div>

//               <div className="mrt-2">
//                 <label>Content Description</label>
//                 <span className="text-danger">*</span>
//               </div>

//               <div className="textEditor">
//                 <Editor
//                   editorState={this.state.editorState}
//                   toolbarClassName="toolbar-class"
//                   wrapperClassName="wrapper-class"
//                   editorClassName="editor-class"
//                   onEditorStateChange={this.onEditorStateChange}
//                   // toolbarOnFocus
//                   toolbar={{
//                     options: [
//                       "inline",
//                       "blockType",
//                       "fontSize",
//                       "fontFamily",
//                       "list",
//                       "textAlign",
//                       "colorPicker",
//                       "link",
//                       "embedded",
//                       "emoji",
//                       "history",
//                     ],
//                     inline: { inDropdown: false },
//                     list: { inDropdown: false },
//                     textAlign: { inDropdown: false },
//                     link: { inDropdown: false },
//                     history: { inDropdown: false },
//                     // image: {
//                     //     urlEnabled: false,
//                     //     uploadEnabled: false,
//                     //     uploadCallback: this.uploadImageCallBack,
//                     //     previewImage: false,
//                     //     alignmentEnabled: false,
//                     //     alt: { present: false, mandatory: false }
//                     // },
//                   }}
//                 />
//                 {/* <textarea
//                         disabled
//                         value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
//                     /> */}
//               </div>

//               <div
//                 className="form-row"
//                 style={{ marginTop: "2%", marginBottom: "2%" }}
//               >
//                 <div className="col-md-2 mb-1">
//                   <label>Sort Order</label>
//                   <span className="text-danger">*</span>
//                   <input
//                     className="form-control"
//                     id="SortOrder"
//                     name="SortOrder"
//                     type="number"
//                     value={this.state.order}
//                     onChange={(e) =>
//                       this.setState({
//                         order: e.target.value,
//                       })
//                     }
//                   />
//                 </div>

//                 <div className="col-md-3 mb-1" style={{ marginLeft: "8%" }}>
//                   <label>Keep Active In The System</label>
//                   <div className="position-relative form-group m-2">
//                     <div>
//                       <div className="custom-checkbox custom-control">
//                         <input
//                           className="custom-control-input"
//                           id="exampleCustomInline6"
//                           name="Active"
//                           type="checkbox"
//                           checked={this.state.system ? "checkbox" : null}
//                           onChange={() =>
//                             this.setState({
//                               system: this.state.system ? false : true,
//                             })
//                           }
//                         />

//                         <input name="Active" type="hidden" value="false" />
//                         <label
//                           className="custom-control-label"
//                           htmlFor="exampleCustomInline6"
//                         >
//                           Active
//                         </label>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="col-md-3 mb-1" style={{ marginLeft: "8%" }}>
//                   <label>Keep Showing On The App</label>
//                   <div className="position-relative form-group m-2">
//                     <div>
//                       <div className="custom-checkbox custom-control">
//                         <input
//                           className="custom-control-input"
//                           id="exampleCustomInline1"
//                           name="Show"
//                           type="checkbox"
//                           checked={this.state.app ? "checkbox" : null}
//                           onChange={() =>
//                             this.setState({
//                               app: this.state.app ? false : true,
//                             })
//                           }
//                         />
//                         <input name="Show" type="hidden" value="false" />
//                         <label
//                           className="custom-control-label"
//                           htmlFor="exampleCustomInline1"
//                         >
//                           Show
//                         </label>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="card-footer">
//                 <div className="col-md-12 mb-0 text-center">
//                   {!this.state.loading ? (
//                     <>
//                       <input
//                         type="submit"
//                         name="created"
//                         value="SAVE"
//                         className="btn-wide btn btn-success"
//                         onClick={() => this.checkSaveContent()}
//                       />
//                       {this.state.showBackBtn ? (
//                         <Link to={"/contents"}>
//                           <input
//                             type="reset"
//                             value="BACK"
//                             className="btn-wide btn btn-light"
//                             id="btnClear"
//                             style={{ marginLeft: "2%" }}
//                           />
//                         </Link>
//                       ) : (
//                         <Link to={"#"}>
//                           <input
//                             type="reset"
//                             value="RESET"
//                             className="btn-wide btn btn-light"
//                             id="btnClear"
//                             style={{ marginLeft: "2%" }}
//                             onClick={() => this.reset()}
//                           />
//                         </Link>
//                       )}
//                     </>
//                   ) : (
//                     <div className="btn-wide btn ">
//                       <TailSpin
//                         color="#00BFFF"
//                         height={30}
//                         width={50}
//                         ariaLabel="loading"
//                       />
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </>
//     );
//   }
// }


// export default withParams(ArticleEditor)


import React, { useState, useEffect } from "react";

import {
  EditorState,
  convertToRaw,
  ContentState,
} from "draft-js";
import draftToHtml from "draftjs-to-html";
import { FiUsers } from "react-icons/fi";
import { BiShowAlt } from "react-icons/bi";

import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { TailSpin } from "react-loader-spinner";

import { Link  ,useSearchParams,useNavigate  } from 'react-router-dom'
import Header from "./common/header";
import { Helmet } from "react-helmet";

let htmlToDraft = null;
if (typeof window === "object") {
  htmlToDraft = require("html-to-draftjs").default;
}

export default function Contentedit() {
   const [editorState, setEditorState] = useState(EditorState.createEmpty())
   const [profileImg, setprofileImg] = useState('')
   const [heading, setheading] = useState('')
   const [showChngPass, setshowChngPass] = useState(false)
   const [order, setorder] = useState('')
   const [system, setsystem] = useState(false)
   const [app, setapp] = useState("")
   const [loading, setloading] = useState(false)
   const [contentId, setcontentId] = useState("")
   const [showBackBtn, setshowBackBtn] = useState(false)
   const [showimage, setshowimage] = useState(require('./image/noimage.png'))
   const [libconCode, setlibconCode] = useState("")
   const [contentData, setcontentData] = useState([])
   const [showimgHover, setshowimgHover] = useState(false)
   const [hideImage, sethideImage] = useState(true)
   const [bigLoader, setbigLoader] = useState(true)
   let [searchParams,setSearchParams]=useSearchParams()
   let naviagte = useNavigate()


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
          getContentDetails(id, libconCode);
      }
    }
    };

    componentwillMount();
  }, []);


 const getContentDetails=(id, libconCode)=> {
    // const libconCode =  localStorage.setItem("user_name", JSON.stringify(resp.data.Name));

    fetch(
      `http://192.168.1.217:1003/api/showcontent?libid=${libconCode}&id=${id}`,
      {
        method: "GET",
        headers: {
          Accepts: "application/json",
          "content-type": "application/json",
        },
      }
    ).then((result) => {
      result.json().then((resp) => {
        // console.log(resp);
        if (resp.response === "Success") {
          setcontentData(resp.data)
          setheading(resp.data[0].heading)
          setshowimgHover(true)
          setorder(resp.data[0].SortOrder)
          setsystem(resp.data[0].Active)
          setapp(resp.data[0].Show)
          setcontentId(resp.data[0].contentId)
          setshowBackBtn(true)
          sethideImage(false)
          setbigLoader(false)

          if (resp.data[0].contentimage === null) {
            setshowimage(require('./image/noimage.png'))
            setshowimgHover(true)
            sethideImage(false)
            
          } else {
            setshowimgHover(true)
            sethideImage(false)
            let img = "data:image/png;base64," + resp.data[0].contentimage 
            setshowimage(img)
          
          }
          // console.log("image :- ",showimage)
          const html = resp.data[0].text;
          const contentBlock = htmlToDraft(html);
          if (contentBlock) {
            const contentState = ContentState.createFromBlockArray(
              contentBlock.contentBlocks
            );
            const editorState = EditorState.createWithContent(contentState);
            setEditorState(editorState)
          }
        }else{
          naviagte("/contents");
            alert("Something went wrong. Please try again.");
            setbigLoader(false)
        }
      });
    }).catch((error) => {
      naviagte("/contents");
      alert("There is problem in your credentials.");
    });
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
    if (heading !== "" && order !== "") {
      setloading(true)
      // this.setState({
      //   loading: true,
      // });

      // console.log( "contentId : ", contentId,
      //   "libcode : ", libconCode,
      //   "heading : ", heading,
      //   "text : ", draftToHtml(convertToRaw(editorState.getCurrentContent())),
      //   "SortOrder : ", order,
      //   "imageType : ", ".jpg",
      //   "Active : ", system,
      //  " Show : ", app,
      //   "contentimage : ", profileImg,)
      saveContent();
    } else {
      setloading(false)
      // this.setState({
      //   loading: false,
      // });
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
  }

  
  const saveContent=()=> {
  
    fetch(`http://192.168.1.217:1003/api/savecontent`, {
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
        imageType: ".jpg",
        Active: system,
        Show: app,
        contentimage: profileImg,
      }),
    })
      .then((result) => {
        result.json().then((resp) => {
          console.log("response :- ", resp);
          if (resp.response === "Success") {
            setloading(false)
            setcontentId("")
            setheading("")
            setorder("")
            // seteditorState(EditorState.createEmpty())
            setapp(false)
            setsystem(false)
            setprofileImg("")
            // this.setState({
            //   loading: false,
            //   contentId: "",
            //   // libcode: "",
            //   heading: "",
            //   editorState: "",
            //   order: "",
            //   system: false,
            //   app: false,
            //   profileImg: "",
            // });
            // Router.push('/contents')
            alert("Content Update Successfully.");
            naviagte('/contents')
          } else {
            setloading(false)
            // this.setState({
            //   loading: false,
            // });
            alert("Something went wrong.");
          }
        });
      })
      .catch((error) => {
        setloading(false)
        // this.setState({
        //   loading: false,
        // });
        console.log("There is problem in your credentials." + error.message);
      });
  }


  const reset=()=> {
           setloading(false)
            setcontentId("")
            setheading("")
            setorder("")
            // seteditorState("")
            setapp(false)
            setsystem(false)
            setprofileImg("")
            sethideImage(true)
    // this.setState({
    //   editorState: "",
    //   profileImg: [],
    //   hideImage: true,
    //   heading: "",
    //   order: false,
    //   system: false,
    //   app: false,
    // });
  }

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
            <Link to={"/content"}>
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
        <div className="card-header bg-info text-white">
          CONTENT DETAILS
        </div>

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

            <div className="col-md-2 mb-1 mt-1">
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
              <div
                className="col-md-1 mb-1 imghover"
                style={{ display: hideImage ? "none" : "block" }}
              >
                <img
                  src={showimage}
                  alt="profile"
                  className="preImage"
                  width={500}
                  height={500}
                />

                <div className="imgh">
                  <img
                    src={showimage}
                    alt="profile"
                    className="ImghImage"
                    width={500}
                    height={500}
                  />
                </div>
              </div>
            ) : null}
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
                type="number"
                value={order}
                onChange={(e)=>setorder(e.target.value)} 
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
                      onChange={() =>
                        setsystem(system ? false : true)
                      }
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
                      onChange={() =>
                        setapp(app ? false : true )
                      }
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
  </>
  )
}
