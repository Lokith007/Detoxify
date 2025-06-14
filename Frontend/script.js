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
             alert("sucess");
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
    if('serviceWorker' in navigator && 'PushManager' in windows){
        const registration = await navigator.serviceWorker.register(sw.js);
        const subscription = await registration.pushManager.subscribe({
             userVisibleOnly: true,
             applicationServerKey: urlBase64ToUint8Array(process.env.publicKey),
        });

        await fetch('http://localhost:5000/alert/subscribe',{
            method:'POST',
            header: {
             'Content-Type': 'application/json'
            },
            body : json.stringify(subscription),
            credentials:"include",
        });
    }
    else{
        console.warn('Pushmanager is not supported');
    }
}

// call the registerServiceWorker to get the notification permission from the user.