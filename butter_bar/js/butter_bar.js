console.log("[butter_bar.js] working...");

const butterBarStyle = `
  .butterBar {
    -webkit-animation: changebar 2.25s infinite;
    -moz-animation: changebar 2.25s infinite;
    animation: changebar 2.25s infinite;
    text-align:center;
    padding: 0.5em;
    position: fixed;
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
    background-color: darkblue;
    cursor: pointer;
    display:inline-block;
    border-radius: 0.3em;
  }

  .butterBarButton:hover {
    background-color: slateblue;
  }

  .pageLink {
    display : inline-block;
    padding: 0.2em;
    cursor: pointer;
    margin: 0.2em;
    border: 0.3em solid black;
    border-radius: 0.3em;
  }

  .pageLink:hover {
    background-color: darkblue;
    color:white;
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
  elem.innerText = "OK";
  return elem;
}

let getButterBarElement = () => {
  let elem = document.createElement('div');
  elem.setAttribute('id','butterBar');
  elem.setAttribute('class','butterBar');
  elem.innerText = "Please click [Allow] to be notified with updates";
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
    addListenerForSubscriptionChange();

    injectButterBarIfNotEnabled();
  }
}

let addListenerForSubscriptionChange = () => {
  if(window.OneSignal != null){
    window.OneSignal.on('subscriptionChange', function (isSubscribed) {
     console.log("The user's subscription state is now:", isSubscribed);
   });

   window.OneSignal.on('notificationPermissionChange', function(permissionChange) {
     var currentPermission = permissionChange.to;
     console.log('New permission state:', {currentPermission,permissionChange});
   });
  }
}

let timer;
const maxWaitForOneSignal = 8000;
const waitIntervalForOneSignal = 500;
let waitTillOneSignalIsAvailable = () => {
  return new Promise(resolve => {
    let waited = 0;
    timer = setInterval(()=>{
      if(window.OneSignal != null){
        clearInterval(timer);
        resolve();
      }
      if(waited >= maxWaitForOneSignal){
        clearInterval(timer);
        resolve();
      }
      waited += waitIntervalForOneSignal;
    }, waitIntervalForOneSignal);
  })
}

//Need to change: repaint on subscription change, remove setInterval
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
