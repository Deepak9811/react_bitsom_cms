import React, { useEffect, useState } from "react";
import Header from './common/header';
import { Helmet } from "react-helmet";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import { BiImageAdd } from "react-icons/bi";
import { TailSpin } from "react-loader-spinner";

const AddImage = () => {
    const [imagetype, setImagetype] = useState("");
    const [hideImage, sethideImage] = useState(true)
    const [showimage, setshowimage] = useState('')
    const [profileImg, setprofileImg] = useState("")
    const [loading, setloading] = useState(false)
    const [imagedata, setimagedata] = useState([])
    const [hideTable, sethidetable] = useState(false)
    const [bigLoader, setbigloader] = useState(false)
    const [getLoader, setgetLoader] = useState(true)
    // console.log("Num", imagetype);


    useEffect(() => {
        ShowImage();
    }, []);

    const ShowImage = () => {

        console.log("checking image get")
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
                    if (resp.response === "Success") {
                        console.log(resp.data);
                        setimagedata(resp.data);
                        sethidetable(false);
                        setloading(false);
                        setgetLoader(false)
                    } else {
                        sethidetable(true);
                        setgetLoader(false)


                    }

                });
            }).catch((error) => {

                sethidetable(true);

            });


    }


    const checkSaveImage = () => {
        if (imagetype !== "" && profileImg !== "") {
            saveimage();
        } else {
            alert("Please fill the details...");
        }
    }
    const saveimage = () => {
        setloading(true)
        const libconCode = JSON.parse(localStorage.getItem("libCode"));

        console.log("image :- ", profileImg)

        fetch(`${process.env.REACT_APP_API_kEY}saveimage`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "content-type": "application/json",
            },
            body: JSON.stringify({
                iID: "",
                libcode: libconCode,
                type: imagetype,
                url: ".jpg",
                active: 1,
                image: profileImg,
            })
        }).then((data) => {
            data.json().then(resp => {
                console.log(resp)
                if (resp.response === "Success") {
                    setloading(false)
                    setshowimage("")
                    alert("Uploaded image.")
                    setImagetype('')
                    sethideImage(true)
                    ShowImage();
                    setprofileImg("")
                } else {
                    alert("Something went wrong. Please try again.");
                    setloading(false)
                }
            })
        }).catch((error) => {
            alert("There is problem in your credentials.");
            setloading(false)
        });
    }





    const imageHandler = (e) => {
        sethideImage(false)

        const reader = new FileReader();
        reader.onload = () => {
            if (reader.readyState === 2) {
                let im = reader.result
                setshowimage(im)

                let png = reader.result;
                png = png.includes("data:image/png;base64,");

                let jpg = reader.result;
                jpg = jpg.includes("data:image/jpg;base64,");

                let jpeg = reader.result;
                jpeg = jpeg.includes("data:image/jpeg;base64,");



                if (png === true) {
                    let data = reader.result.replace("data:image/png;base64,", "");
                    let dt = data
                    setprofileImg(dt)

                    // console.log("replace png :- ", profileImg);
                } else if (jpg === true) {
                    let data = reader.result.replace("data:image/jpg;base64,", "");
                    let dt = data
                    setprofileImg(dt)

                    // console.log("replace jpg :- ", profileImg);
                } else if (jpeg === true) {
                    let data = reader.result.replace("data:image/jpeg;base64,", "");
                    let dt = data
                    setprofileImg(dt)

                    // console.log("replace jpeg :- ", profileImg);
                }
            }
        };
        reader.readAsDataURL(e.target.files[0]);
    };

    const deleteContent = (currEle) => {
        if (window.confirm("Are you sure you want to delete this image?")) {

            setbigloader(true)
            let id = currEle.iID;
            let url = `${process.env.REACT_APP_API_kEY}Delete?id=${id}&type=image`;

            fetch(url, {
                method: "POST",
                headers: {
                    Accepts: "application/json",
                    "content-type": "application/json",
                },
            })

                .then((result) => {
                    result.json().then((resp) => {
                        console.log(resp);
                        if (resp.response === "Success") {
                            setbigloader(false)

                            ShowImage()

                        } else {
                            setbigloader(false)
                            alert("Something went wrong. Please try again.");
                        }
                    });
                })
                .catch((error) => {
                    alert("Something went wrong.");
                    setbigloader(false)
                });
        }

    }

    // console.log("replace png :- ", profileImg);


    return (
        <>
            <Helmet>
                <title>Add Image</title>
            </Helmet>
            <Header />
            <div className="txt" id="pddd">
                <div className="app-page-title">
                    <div className="page-title-wrapper">
                        <div className="page-title-heading">
                            <div className="page-title-icon">
                                <BiImageAdd className="pe-7s-users icon-gradient bg-mean-fruit" />
                            </div>
                            <div>
                                IMAGE ADD
                                <div className="page-title-subheading">
                                    <p>
                                        Enter the details and click on SAVE button to save the
                                        details.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="page-title-actions">

                        </div>
                    </div>
                </div>

                <div className="txtb">
                    <div className="card-header bg-info text-white">
                        UPLOAD IMAGE
                    </div>

                    <div style={{ padding: "1.25rem" }}>
                        <div className="form-row">
                            <div className="col-md-4 mb-1 ">
                                <label>Type of image</label><span className="text-danger">*</span>
                                <div className="position-relative form-group ">

                                    <select

                                        id=""
                                        className="form-control"
                                        value={imagetype}
                                        aria-label="Image_Type"
                                        name="Image_Type"
                                        title="Image_Type"
                                        onChange={(event) => { setImagetype(event.target.value); }}
                                    >
                                        <option value="" hidden>Type of Image</option>
                                        <option value="Content">CONTENT</option>
                                        <option value="Event" style={{ padding: "5%" }}>EVENT</option>
                                        <option value="Other">OTHER</option>
                                    </select>
                                </div>
                            </div>

                            <div className="col-md-4 mb-1 mt-1">
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

                            <div className="col-md-1 mb--2 imghover"

                                style={{ display: hideImage ? "none" : "block" }}
                            >
                                <img

                                    src={showimage}
                                    alt="profile"
                                    className="addimage"

                                />

                                <div className="imgh">
                                    <img

                                        src={showimage}
                                        alt="profile"
                                        className="imghImage"
                                        width={500}
                                        height={500}
                                    />
                                </div>
                            </div>
                            <div style={{marginLeft:"6%"}}>
                                {loading ? (
                                    <div className="btn-wide btn " style={{ marginTop: "35%" }}>
                                        <TailSpin
                                            color="#00BFFF"
                                            height={30}
                                            width={50}
                                            ariaLabel="loading"
                                        />
                                    </div>
                                ) : (
                                    <div className="col-md-1.5 mb-1 mt-4" >

                                        <input
                                            style={{ marginTop: "3%" }}
                                            id="contentimage"
                                            name="contentimage"
                                            type="submit"
                                            className="btn-wide btn btn-success"
                                            value="Save Image"
                                            onClick={checkSaveImage}
                                        // onChange={this.imageHandler}
                                        />
                                    </div>
                                )}

                            </div>


                        </div>


                    </div>
                </div>

                {!getLoader ? (
                    <div className="txtb" style={{ marginTop: "1%" }}>
                        <div className="card-header bg-info text-white">
                            List Of Image
                        </div>

                        <div style={{ padding: "1.25rem" }}>
                            <div className="card-body">
                                {!hideTable ? (
                                    <table className="mb-0 table table-hover">
                                        <thead>
                                            <tr>
                                                <th>Type</th>
                                                <th>Url</th>
                                                <th style={{ width: "18%" }}>Image</th>
                                                <th style={{ width: "21%" }}>Active</th>

                                                <th style={{ width: "20px" }}>Delete</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {imagedata.map((currEle, ind) => {
                                                return (
                                                    <tr>
                                                        <td>{currEle.type}</td>
                                                        <td>{currEle.url}</td>
                                                        <td>
                                                            <img
                                                                src={currEle.image}

                                                                alt="profile"
                                                                className="tableimage"

                                                            />
                                                        </td>
                                                        <td>{currEle.active.toString()}</td>
                                                        <td className="edt" style={{ cursor: "pointer" }}>
                                                            <p>
                                                                <RiDeleteBinLine onClick={() => deleteContent(currEle)} size={22} style={{ color: "red" }} />
                                                            </p>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                            }
                                        </tbody>

                                    </table>
                                ) : (
                                    <h5 className="err">{"No Image Found"}</h5>
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
                    </div>
                ) : (
                    <div className="loading_c" style={{ marginTop: "5%" }}>
                        <TailSpin
                            color="#00BFFF"
                            height={60}
                            width={80}
                            ariaLabel="loading"
                        />
                    </div>
                )}

            </div>
        </>
    )
}
export default AddImage