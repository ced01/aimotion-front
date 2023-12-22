import React, { useEffect, useState } from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import SpRecognition from '../../browserutils/speechrecognition/speechrecognition';
import useListenerMachine  from "../../hooks/listener/useListenerMachine";
import listenerMachine from "../../machines/listener/listenerMachine";
import * as path from 'path';
import "./Listener.css";

const synth = window.speechSynthesis;
let voices = [];

function setSpeech(){
  return new Promise(
    function (resolve, reject) {
      let id;
      id = setInterval(() => {
        if (synth.getVoices().length !== 0) {
          resolve(synth.getVoices());
          clearInterval(id);
        }
      }, 10);
    }
  )
}

if( voices.length === 0 ){
  setSpeech().then((vs) => voices = vs);
}

const speak = ( msg ) => {
  
  let utterThis = null;
  if (synth.speaking) {
    console.error('speechSynthesis.speaking');
    return;
  }
  if ( msg.value !== '' ) {
    utterThis = new SpeechSynthesisUtterance(msg);
    utterThis.voice = voices[8];
    utterThis.pitch = 1;
    utterThis.rate = 1;
    utterThis.onend = function (event) {
      console.log(event);
    }
    utterThis.onerror = function (event) {
      console.error(event);
    }
    //if(voices.length !== 0){
    synth.speak(utterThis);
   // }
  }
}

function Listener () {

  const { state, context, send } = useListenerMachine(listenerMachine);
  const listenMode = ["askwho","responseforname","listen","responseformsg"].includes(state);
  const spRecognition = new SpRecognition();
  const [image,setImage] = useState(null);
  let pictureNb = Math.round(Math.random()*3);

  useEffect(()=> {
    if(context.emotion){
      import("../../assets/images/"+context.emotionpicture+"/" + context.emotionpicture + (pictureNb !== 0 ? pictureNb : 1) +".jpg").then(image => {
        setImage(image.default);
      });
    } 
  },[context.emotion])
  
  let emotionPicture = {
    position: "absolute"
  }

  useEffect(()=> {
    //speak(context.msg);
    if( listenMode ){
      if(state === "askwho"){
        import("../../assets/images/question/question" + ( pictureNb !== 0 ? pictureNb : 1 ) +".jpg").then(image => {
          setImage(image.default);
        });
        spRecognition.setOnResult("question",send);
      }
      if(state === "responseforname"){
        spRecognition.setOnResult("response",send);
      }
      if(state === "listen"){
        import("../../assets/images/question/question" + ( pictureNb !== 0 ? pictureNb : 1 ) +".jpg").then(image => {
          setImage(image.default);
        });
        spRecognition.setOnResult("question",send);
      }
      if(state === "responseformsg"){
        spRecognition.setOnResult("response",send);
      }
      spRecognition.start();
    }

  },[state]);

  return (
    <Container>
    { image ? <img src={image} width="100%" height="100%" style={emotionPicture}/> : null }
      <Container className="box">
        <Row>
            <Col className="title">
            <h3>{ context.title + (context.surname ? ", "+ context.surname : "") } </h3>
            </Col> 
        </Row>
        <Row>
            <Col className={`content iamsg`}>
            { context.msg }
            </Col> 
        </Row>
        <Row>
            <Col className={`content response`}>
              { context.emotion ? `Je pense que vous ressentez cette émotion : ${context.emotion}` : ''}
            </Col> 
        </Row>
      </Container>
    </Container>
  );
}

export default Listener;