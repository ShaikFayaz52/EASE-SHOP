// Auth helper: initializes Firebase if config exists, otherwise provides a dev fallback.
(function(){
  // Simple helper to show messages
  function toast(msg){ alert(msg); }

  // Expose auth helpers to global scope
  window.appAuth = {
    init: init,
    signInWithGoogle: signInWithGoogle,
    sendPhoneOtpDev: sendPhoneOtpDev,
    verifyOtpDev: verifyOtpDev,
    signOut: signOut
  };

  let firebaseApp = null;
  let auth = null;
  let recaptchaVerifier = null;

  function init(){
    if(window.FIREBASE_CONFIG){
      // load firebase if not present
      if(!window.firebase){
        console.warn('Firebase SDK not loaded. Make sure to include firebase-app and firebase-auth scripts in the page.');
      }
      try{
        firebaseApp = firebase.initializeApp(window.FIREBASE_CONFIG);
        auth = firebase.auth();
        // monitor auth state
        auth.onAuthStateChanged(user=>{
          localStorage.setItem('appUser', JSON.stringify(user?{uid:user.uid, displayName:user.displayName, email:user.email, phoneNumber:user.phoneNumber}:null));
          if(user) window.location.href = 'profile.html';
        });
      }catch(e){ console.error('Firebase init error', e); }
    } else {
      // dev-mode: monitor localStorage 'devUser'
      window.addEventListener('storage', ()=>{});
    }
  }

  async function signInWithGoogle(){
    if(auth){
      const provider = new firebase.auth.GoogleAuthProvider();
      try{ await auth.signInWithPopup(provider); }
      catch(e){ toast('Google sign-in failed: '+e.message); }
      return;
    }
    // dev fallback: create fake user using prompt for email
    const email = prompt('Enter your Gmail address for dev sign-in');
    if(!email) return;
    const user = { uid: 'dev-'+btoa(email).slice(0,8), displayName: email.split('@')[0], email };
    localStorage.setItem('appUser', JSON.stringify(user));
    window.location.href = 'profile.html';
  }

  // Dev OTP: generate and store OTP in localStorage (visible to user in dev mode)
  function sendPhoneOtpDev(phone){
    const code = (''+Math.floor(100000 + Math.random()*900000));
    localStorage.setItem('dev_otp_'+phone, code);
    // In a real app you'd send via SMS provider. For dev we show it.
    toast('Dev OTP for '+phone+': '+code);
    return Promise.resolve();
  }

  function verifyOtpDev(phone, code){
    const expected = localStorage.getItem('dev_otp_'+phone);
    if(expected && expected === code){
      const user = { uid: 'dev-'+phone, displayName: phone, phoneNumber: phone };
      localStorage.setItem('appUser', JSON.stringify(user));
      window.location.href = 'profile.html';
      return true;
    }
    return false;
  }

  function signOut(){
    if(auth){ auth.signOut(); }
    localStorage.removeItem('appUser');
    // also clear firebase local state
    if(window.location.pathname.endsWith('profile.html')) window.location.href = 'index.html';
  }

  // initialize on load
  document.addEventListener('DOMContentLoaded', init);
})();
