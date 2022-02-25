import Menu from './Menu';

import Header from './common/header';
import Home from './home'

import Content from './Content'
import Contents from './Contents'
import Contentedit from './Contentedit'

import Events from './Events'
import Event from './Event'
import Eventedit from './Eventedit'

import Login from './login'

import Feedback from './feedback'
import Question from './feedback/questions'
import Feedbackedit from './feedbackedit'
import FeedbackResponse from './Feedbackresponse'

import {Route,Routes,Switch,Navigate}  from 'react-router-dom';

import { Component } from 'react/cjs/react.production.min';

function App() {

  // if (window.location.pathname === '/login'){
  //   return(
  //     <>
  //   <Routes>
     
  //    <Route exact path='/Login' element={<Login name="Login Page"></Login>}></Route>
  //    <Route exact path='/' element={<Home name="Home Page"></Home>}></Route>

  //   <Route path='*' Navigate="/" ></Route>
  //  </Routes></>
  //   )
  // }else{
  //   console.log("else",localStorage.getItem("user_name"))
    return (
    
      <>
      {/* <Header></Header> */}
      <Routes>
     
        <Route exact path='/Login' element={<Login name="Login Page"></Login>}></Route>
        <Route exact path='/' element={<Home name="Home Page"></Home>}></Route>
  
        <Route exact path='/Content' element={<Content />}></Route>
        <Route exact path='/Contents' element={<Contents name="Contents Page"></Contents>}></Route>
        <Route exact path='/Contentedit' element={<Contentedit name="Content edit Page"></Contentedit>}></Route>
  
        <Route exact path='/Events' element={<Events name="Events Page"></Events>}></Route>
        <Route exact path='/Event' element={<Event name="Event Page"></Event>}></Route>
        <Route exact path='/Eventedit' element={<Eventedit name="Eventedit Page"></Eventedit>}></Route>
  
        <Route exact path='/feedback' element={<Feedback name="Feedback Page"></Feedback>}></Route>
        <Route exact path='/Feedbackedit' element={<Feedbackedit name="Feedbackedit Page"></Feedbackedit>}></Route>
        <Route exact path='/feedback/questions' element={<Question name="Question Page"></Question>}></Route>
        <Route exact path='/Feedbackresponse' element={<FeedbackResponse name="Feedback response Page"></FeedbackResponse>}></Route>
  
  
       <Route path='*' Navigate="/" ></Route>
      </Routes>


      
      </>
    );
  // }
  
  
}

export default App;
