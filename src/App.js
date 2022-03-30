
import Home from './home'
import Login from './login'
import Event from './Event'
import Error from './Error'
import Events from './Events'
import Content from './Content'
import AddImage from './AddImage'
import Contents from './Contents'
import Feedback from './feedback'
import Eventedit from './Eventedit'
import Contentedit from './Contentedit'
import Feedbackedit from './feedbackedit'
import Question from './feedback/questions'
import FeedbackResponse from './Feedbackresponse'

import Protected from './common/Protected';

import {Route,Routes}  from 'react-router-dom';

import { Subcontent } from './Subcontent'
import { Component } from 'react/cjs/react.production.min';

function App() {
 
    return (
    
      <>
      <Routes>
     
       
       
        <Route exact path='/Login' element={<Login name="Login Page"></Login>}></Route>
        <Route element={<Protected/>}> 
        <Route exact path='/' element={<Home/> }></Route>

        <Route exact path='/addImage' element={<AddImage />}></Route>
        
  
        <Route exact path='/Content' element={<Content />}></Route>
       
        <Route exact path='/Content/:id' element={<Content />}></Route>
        <Route exact path='/Contents' element={<Contents />}></Route>
        <Route exact path='/Contentedit' element={<Contentedit />}></Route>
        <Route exact path='/Subcontent' element={<Subcontent />}></Route>
  
        <Route exact path='/Events' element={<Events name="Events Page"></Events>}></Route>
        <Route exact path='/Event' element={<Event name="Event Page"></Event>}></Route>
        <Route exact path='/Eventedit' element={<Eventedit name="Eventedit Page"></Eventedit>}></Route>
  
        <Route exact path='/feedback' element={<Feedback name="Feedback Page"></Feedback>}></Route>
        <Route exact path='/Feedbackedit' element={<Feedbackedit name="Feedbackedit Page"></Feedbackedit>}></Route>
        <Route exact path='/feedback/questions' element={<Question name="Question Page"></Question>}></Route>
        <Route exact path='/Feedbackresponse' element={<FeedbackResponse name="Feedback response Page"></FeedbackResponse>}></Route>
        </Route>
  
       <Route path='*' element={<Error/>} ></Route>
      </Routes>


      
      </>
    );
  // }
  
  
}

export default App;
