const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

export default class SpRecognition {

    constructor(){
        this.message = "";
        this.speechRecognition = new SpeechRecognition();
        this.speechRecognition.continuous = true;
    }

    start = () => {
        this.speechRecognition.start();
        console.log("Speech this.speechRecognition is started");
    }

    stop = () => {
        this.speechRecognition.stop();
        console.log("Speech this.speechRecognition is stopped");
    }

    setEventForMachine(eventForMachine){
        this.eventForMachine = eventForMachine;
    }
    setOnResult(eventForMachine,send){
        this.speechRecognition.onresult = (event) => {
            send(eventForMachine, { value :  event.results[0][0].transcript });
        };
    }
    getEventForMachine(){
        return this.eventForMachine;
    }
}