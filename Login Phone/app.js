// Your web app's Firebase configuration ENTER YOUR FIREBASE DETAILS HERE
var firebaseConfig = {
    apiKey: "AIzaSyCt-06uIR9YjhJucSPvyiEUFIEE6zWvc2U",
  authDomain: "createdbyandre-4d3ac.firebaseapp.com",
  projectId: "createdbyandre-4d3ac",
  storageBucket: "createdbyandre-4d3ac.appspot.com",
  messagingSenderId: "434992977239",
  appId: "1:434992977239:web:36551920f5b59e1e935a12",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var form = document.querySelector('#loginForm');
var otp_form = document.querySelector('#otpForm');
var message = document.querySelector('#messageDiv');
var sign_out = document.querySelector("#signOut");
var message_value = document.querySelector('.message');

// check if user is logged in or not
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        if(window.location.pathname != '/home.html'){
            window.location = 'home.html';
        }
    } else {
        if(window.location.pathname === '/home.html'){
            window.location = 'index.html';
        }
    }
});

if(window.location.pathname != '/home.html'){
    // verification captcha setting 
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('sign-in-button', {
        'size': 'invisible',
        'callback': (response) => {
            console.log('captcha verified');
        }
    });
    const appVerifier = window.recaptchaVerifier;
    firebase.auth().settings.appVerificationDisabledForTesting = true; // turn this off in production stage

    // user login
    if(form){
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            let phone_number = form.phone.value;
        
            // setup invisible recaptcha 
            firebase.auth().signInWithPhoneNumber(phone_number, appVerifier)
            .then((confirmationResult) => {
                console.log("OTP SEND", confirmationResult);
                form.style.display = 'none';
                otp_form.style.display = 'block';
                window.confirmationResult = confirmationResult;
            }).catch((error) => {
                showErrorMessage(error.message);
            });
            
        })
    }

    // user Sign Up
    if(form){
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            let phone_number = form.phone.value;
        
            // setup invisible recaptcha 
            firebase.auth().signUpWithPhoneNumber(phone_number, appVerifier)
            .then((confirmationResult) => {
                console.log("OTP SEND", confirmationResult);
                form.style.display = 'none';
                otp_form.style.display = 'block';
                window.confirmationResult = confirmationResult;
            }).catch((error) => {
                showErrorMessage(error.message);
            });
            
        })
    }

    // verify otp 
    if(otp_form){
        otp_form.addEventListener('submit', function(e) {
            e.preventDefault();
            let otp_number = otp_form.otp_value.value;
            confirmationResult.confirm(otp_number).then((result) => {
                // User signed in successfully.
                const user = result.user;
                window.location = 'home.html';
            }).catch((error) => {
                showErrorMessage(error.message);
            });
        })
    }

}


// show error message function 
function showErrorMessage(erro_message){
    message.style.display = 'block';
    message_value.innerText = erro_message;
    console.log(erro_message);
    setTimeout(function(){
        message.style.display = 'none';
    }, 3000);
}

// sign out  
if(sign_out){
    sign_out.addEventListener('click', function(e) {
        firebase.auth().signOut().then(() => {
            window.location = 'index.html';
        }).catch((error) => {
        // An error happened.
        });
    })
}