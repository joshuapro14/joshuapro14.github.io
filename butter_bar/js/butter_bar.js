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
  style.innerHTML =butterBarStyle;
  return style;
}
let styleInjectedFlag = false;

let injectStyle = () => {
  if(!styleInjectedFlag){
    let style = getStyleElement();
    document.getElementsByTagName('head')[0].appendChild(style);
    styleInjectedFlag = true;
  }
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
  elem.setAttribute('id','butterBar');
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
    if (!isEnabled && Notification.permission === 'default') {
      injectStyle();
      let elem = getButterBarElement();
      injectButterBar(elem);
    }
  })
}

let removeButterBarIfExist = () => {
  let bbElem = document.getElementById('butterBar');
  console.log({bbElem,'log':'removeButterBarIfExist'});
  if(bbElem != null){
    console.log({'bbElem-parent':bbElem.parentNode});
  }
  if(bbElem != null && bbElem.parentNode != null){
    bbElem.parentNode.removeChild(bbElem);
  }
}

let init = async() => {
  await waitTillOneSignalIsAvailable();
  console.log("Init start")
  if(window.OneSignal){
    injectButterBarIfNotEnabled();
  }
}

let timer;
let waitTillOneSignalIsAvailable = () => {
  return new Promise(resolve => {
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

let repaintButterBarAsPerPermission = () => {
  let permission= Notification.permission;
  console.log({permission,'log':'repaintButterBarAsPerPermission started'})

  window.OneSignal.on('notificationPermissionChange', function(permissionChange) {
    var currentPermission = permissionChange.to;
    console.log('New permission state:', {currentPermission,permissionChange});
  });

  let t = setInterval(()=>{
    permission = Notification.permission;
    console.log({permission});
    if(permission != 'default'){
      clearInterval(t);
      removeButterBarIfExist();
    }else{
      console.log("timer ran for permission set!!!");
    }
  }, 500);
}

let waitFor = (timeinMs) => {
  return new Promise(resolve => {
    setTimeout(()=> resolve(), timeinMs);
  })
}

let showNativeNotification = () => {
  //await waitFor(0);
  window.OneSignal.showNativePrompt();
  console.log('showNativePrompt called');
  //repaintButterBarAsPerPermission();
  removeButterBarIfExist();
}

function promptAndSubscribeUser() {
  console.log('promptAndSubscribeUser called');
  window.OneSignal.isPushNotificationsEnabled(function(isEnabled) {
    console.log({isEnabled});
    if (!isEnabled ) {
      //window.OneSignal.showSlidedownPrompt();
      showNativeNotification();
    }
  });
}


init();
