document.getElementById("login").addEventListener('submit',function(event){
    event.preventDefault();

    const email=document.getElementById('login-email');
    const pass=document.getElementById('login-password');
    const data={
        email:email.value,
        pass:pass.value
    };

    fetch('http://localhost:5000/app/login',{
        method:'POST',
        headers: {
              'Content-Type': 'application/json'
        },
        body : JSON.stringify(data)
    })
    .then(response=>response.json())
    .then(result=>{
        const {message}=result
        if(message === 'nuf'){
            alert ('User name is wrong');
        }
        else if(message==='wp')
        {
            alert('Password is wrong');
        }
        else{
             const name=result.name
             alert("success");
            window.location.href = `/index.html?name=${name}`;
        }
})
    .catch(error=> {
        console.log('Error : ',error);
    });
});


document.getElementById("signup").addEventListener('submit', async function(event) {
    event.preventDefault();

    const username = document.getElementById('signup-name');
    const email = document.getElementById('signup-email');
    const pass = document.getElementById('signup-password');
    const cpass = document.getElementById('signup-confirm-password');

    const data = { name: username.value, mail: email.value, pass: pass.value };

    if (pass.value !== cpass.value) {
        alert('Password and Confirm password don\'t match');
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/app/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.message === 'mae') {
            alert('An account already exists for this email!');
        } else if (result.message === 's') {
            alert('Signup successful!');
            window.location.href = `/index.html?name=${username.value}`;
        } else {
            alert('Unexpected response from server.');
        }

    } catch (error) {
        console.error("Error during signup:", error);
        alert("Signup failed. Please try again.");
    }
    registerServiceWorker();
});

// Cookie rendering 


function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i)
    outputArray[i] = rawData.charCodeAt(i);
  return outputArray;
}

async function registerServiceWorker(){
    if('serviceWorker' in navigator && 'PushManager' in window){
        const permission = await Notification.requestPermission();
        console.log('🔔 Notification permission:', permission);
        if (permission !== 'granted') {
             alert('Notification permission not granted');
             return;
        }

        const public_key =await fetch('http://localhost:5000/alert/getkey',{
            method : 'GET'
        })
        .then(res=>res.text());

        const registration = await navigator.serviceWorker.register('sw.js');
        const subscription = await registration.pushManager.subscribe({
             userVisibleOnly: true,
             applicationServerKey: urlBase64ToUint8Array(public_key),
        });
        await fetch('http://localhost:5000/alert/subscribe',{
            method:'POST',
            headers: {
             'Content-Type': 'application/json'
            },
            body : JSON.stringify(subscription),
            credentials:"include",
        });
    }
    else{
        console.warn('Pushmanager is not supported');
    }
}

// call the registerServiceWorker to get the notification permission from the user.

async function sos() {
  try {
    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });

    const lat = position.coords.latitude;
    const long = position.coords.longitude;

    if(!lat){
        alert ("please ensure that you have given location access");
        return;
    }
    const response = await fetch('http://localhost:5000/alert/sos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ latitude: lat, longitude: long })
    });

    const data = await response.json();
    alert("🚨 SOS Sent Successfully");
  } catch (error) {
    alert("❌ Error: " + error.message + "\nMake sure location access is allowed.");
  }
}


  function toggleEmergencyModal() {
    const modal = document.getElementById("emergency-modal");
    modal.style.display = modal.style.display === "block" ? "none" : "block";
  }

  function showSOS() {
    alert("📞 Call 112 or contact the nearest emergency center immediately!");
  }
function startChallengeVideo() {
    const modal = document.getElementById("challenge-video-modal");
    const video = document.getElementById("challenge-video");

    modal.style.display = "block";
    video.currentTime = 0;
    video.play();

   
    if (video.requestFullscreen) {
      video.requestFullscreen();
    } else if (video.webkitRequestFullscreen) {
      video.webkitRequestFullscreen();
    } else if (video.msRequestFullscreen) {
      video.msRequestFullscreen();
    }

    video.controls = false;
    video.addEventListener("timeupdate", preventSkip);
  }

  function preventSkip(e) {
    const video = e.target;
    if (Math.abs(video.currentTime - video._lastTime || 0) > 1) {
      video.currentTime = video._lastTime;
    }
    video._lastTime = video.currentTime;
  }

  function closeChallengeVideo() {
    const modal = document.getElementById("challenge-video-modal");
    const video = document.getElementById("challenge-video");
    modal.style.display = "none";
    video.controls = true; 
    video.removeEventListener("timeupdate", preventSkip);
  }


document.getElementById("appointment").addEventListener('submit', async function(event) {
  event.preventDefault();

  const date = document.getElementById('date').value;

  try {
    const response = await fetch('http://localhost:5000/app/appointment');
    const info = await response.json();

    const data = {
      receiverEmail: info.gmail,
      senderName: info.name,
      doctorName: info.doctorName || "Assigned Therapist", // optional fallback
      date: date,
    };

    const sendResponse = await fetch('http://localhost:5000/app/sendmail', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const result = await sendResponse.json();
    const { message } = result;

    if (message === 'Missing required fields') {
      alert('Login First');
    } else if (message === 'Failed to send email') {
      alert('Try again');
      window.location.reload();
    } else {
      alert('Successfully sent');
      window.location.reload();
    }

  } catch (err) {
    console.error('Error:', err);
  }
});
