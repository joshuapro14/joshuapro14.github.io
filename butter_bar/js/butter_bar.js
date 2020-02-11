console.log("[butter_bar.js] working...");

const butterBarStyle = `
  .butterBar {
    -webkit-animation: changebar 2.25s infinite;
    -moz-animation: changebar 2.25s infinite;
    animation: changebar 2.25s infinite;
    text-align:center;
    padding: 0.5em;

  }

  @-webkit-keyframes changebar {
    0% {
      background-color: gold
    }
    50% {
      background-color: salmon
    }
    99.9% {
      background-color: gold
    }
  }

  @-moz-keyframes changebar {
    0% {
      background-color: gold
    }
    50% {
      background-color: salmon
    }
    99.9% {
      background-color: gold
    }
  }

  @keyframes changebar{
    0% {
      background-color: gold
    }
    50% {
      background-color: salmon
    }
    99.9% {
      background-color: gold
    }
  }

  .butterBarButton {
    padding: 0.3em;
    color: white;
    background-color: slateblue;
    cursor: pointer;
    display:inline-block;
  }

  .butterBarButton:hover {
    border-radius: 0.3em;
    background-color: darkblue;
  }


`;

let getStyleElement = () => {
  let style = document.createElement('style');
  style.type = 'text/css';
  //style.innerHTML = '.cssClass { color: #F00; }';
  style.innerHTML =butterBarStyle;
  return style;
}

let injectStyle = () => {
  let style = getStyleElement();
  document.getElementsByTagName('head')[0].appendChild(style);
}

let getPushButton = () => {
  let elem = document.createElement('div');
  elem.setAttribute('class','butterBarButton');
  elem.setAttribute('onclick','promptAndSubscribeUser()');
  elem.innerText = "Get Updates";
  return elem;
}

let getButterBarElement = () => {
  let elem = document.createElement('div');
  elem.setAttribute('class','butterBar');
  let button = getPushButton();
  elem.append(button);
  return elem;
}

let injectButterBar = (bbElem) => {
  let body = document.getElementsByTagName("BODY")[0];
  body.prepend(bbElem);
}

let injectButterBarIfNotEnabled = () => {
  window.OneSignal.isPushNotificationsEnabled(function(isEnabled) {
    console.log({isEnabled});
    if (!isEnabled) {
      injectStyle();
      let elem = getButterBarElement();
      injectButterBar(elem);
    }
  })
}

let init = async() => {
  await waitTillOneSignalIsAvailable();
  console.log("Init start")
  if(window.OneSignal){
    injectButterBarIfNotEnabled();
  }
}

//let event = new Event("oneSignalInitialized");
//let elemToListen = document.createElement('div');

let timer;
let waitTillOneSignalIsAvailable = () => {
  return new Promise(resolve => {
    //elemToListen.addEventListener('oneSignalInitialized',()=> {resolve()});
    timer = setInterval(()=>{
      if(window.OneSignal != null){
        clearInterval(timer);
        resolve();
      }else{
        console.log("timer ran!!!");
      }
    }, 500);
  })
}

function promptAndSubscribeUser() {
  console.log('promptAndSubscribeUser called');
  window.OneSignal.isPushNotificationsEnabled(function(isEnabled) {
    console.log({isEnabled});
    if (!isEnabled) {
      //window.OneSignal.showSlidedownPrompt();
      window.OneSignal.showNativePrompt();
      console.log('showNativePrompt called');
    }
  });
}

/*let init2 = () => {
  window.OneSignal = {enabled: false};
  elemToListen.dispatchEvent(event);
}

let init3 = () => {
  window.OneSignal = {enabled: true};
  elemToListen.dispatchEvent(event);
}*/

init();
