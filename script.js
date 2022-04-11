import {VoiceRSS} from "./voice.js";

const button = document.getElementById("button");
const audioElement = document.getElementById("audio");
let twoPartJoke = false; //necessary for the event listener on the button
let delivery = ""; //the delivery of the two part joke

//pass all the parameters to the main function
function TTS(text) {
  VoiceRSS.speech({
    key: "cd5fb91cff2946438b933b8262603b7c",
    src: text,
    hl: "en-us",
    v: "Linda",
    r: 0,
    c: "mp3",
    f: "44khz_16bit_stereo",
    ssml: false,
  });
}

const requestJoke = async function () {
  try {
    const response = await fetch("https://v2.jokeapi.dev/joke/Any").then(
      (response) => response.json()
    );
    if (response.type === "twopart") {
      //if is two part, i need to change the layout
      TTS(response.setup);
      button.textContent = "...so?";
      delivery = response.delivery;
      twoPartJoke = true;
    }
    if (response.type === "single") {
      TTS(response.joke);
    }
    console.log(response);
  } catch (error) {
    console.log(error);
  }
};

//for security reason, autoplay is disabled if user doens't interact wit the page first
button.addEventListener("click", function () {
  if (twoPartJoke) {
    TTS(delivery);
    button.textContent = "Tell Me A Joke";
    twoPartJoke = false;
    toggleButton();
  } else {
    toggleButton();
    requestJoke();
  }
});

//disable and re-enable the button
function toggleButton() {
  button.disabled = !button.disabled;
}
//listen for audio playing end
audioElement.addEventListener("ended", toggleButton);
