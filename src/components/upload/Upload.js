import React, { Component } from 'react';
import './Upload.css';
import axios from 'axios';
import {Progress} from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class Upload extends Component {
  constructor(props) {
    super(props);
    this.uploadFile = this.uploadFile.bind(this);
    this.onChangeHandler = this.onChangeHandler.bind(this);
    this.state = {
      selectedFile: ''
    }
  }

  maxSelectFile=(event)=>{
    let files = event.target.files // create file object
      if (files.length > 2) {
        const msg = 'Only 2 images can be uploaded at a time'
        event.target.value = null // discard selected file
        console.log(msg)
        toast.error(msg);

        return false;
      }
    return true;
 }
 checkMimeType=(event)=>{
    let files = event.target.files     //getting file object
    let err = ''     //define message container
    const types = ['image/png', 'image/jpeg', 'image/gif'] // list allow mime type
    for(var x = 0; x<files.length; x++) {  // loop access array
        if (types.every(type => files[x].type !== type)) {
        err += files[x].type+' is not a supported format\n';
      }
    };
    if (err !== '') {
        event.target.value = null
        console.log(err)
        toast.error(err);

        return false;
    }
    return true;
  }

  checkFileSize=(event)=>{
    let files = event.target.files
    let size = 1500000
    let err = "";
    for(var x = 0; x<files.length; x++) {
      if (files[x].size > size) {
        err += files[x].type+'is too large, please pick a smaller file\n';
      }
    };
    if (err !== '') {
        event.target.value = null
        console.log(err)
        toast.error(err);
        return false
      }
    return true;
  }

  onChangeHandler=event=>{
    var files = event.target.files
    if(this.maxSelectFile(event) && this.checkMimeType(event) && this.checkFileSize(event) ) {
      this.setState({ selectedFile: files, loaded:0 })
    }
  }


  uploadFile = e => {
    e.preventDefault()
    const data = new FormData()
    for (const key of Object.keys(this.state.selectedFile)) {
      data.append('file', this.state.selectedFile[key])
    }
    axios.post("http://localhost:8000/upload", data, {
        onUploadProgress: ProgressEvent => {
          this.setState({
            loaded: (ProgressEvent.loaded / ProgressEvent.total*100),
        })
      },
    })
    .then(res =>toast.success('upload success'))
    .catch(err => {
      toast.error('upload fail')
    })
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <form method="post" onSubmit={this.uploadFile}>
              <div className="form-group files color">
                <label>Upload Your File </label>
                <input type="file" className="form-control" name="file" multiple onChange={this.onChangeHandler}/>
              </div>
              <div className="form-group">
                <Progress max="100" color="success" value={this.state.loaded} >{Math.round(this.state.loaded,2) }%</Progress>
              </div>
              <div  className="form-group">
                  <button className="btn btn-success brn-block">Upload</button>
              </div>
            </form>
          </div>
        </div>
        <div className="form-group">
          <ToastContainer />
        </div>
      </div>
    );
  }
}
export default Upload;
