import Cookie from 'js-cookie';
import { unWrap } from '~/utils/fetchUtils';

export default ({ $config, store }, inject ) => {
  window.initAuth = init;
  addScript()

  inject('auth', {
    signOut,
  });

  function addScript() {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.onload = () => {
      initAuth();
    }
    script.async = true;
    document.head.appendChild(script);
  }

  function init() {
    window.google.accounts.id.initialize({
      client_id: $config.auth.clientId,
      callback: parseUser,
    });
    window.google.accounts.id.renderButton(
      document.getElementById('googleButton'),
      { theme: "outline", size: "medium" }
    );
    
    if (Cookie.get($config.auth.cookieName)) {
      console.log('logowanie z cookie')
      signInVerify()
    } else {
      window.google.accounts.id.prompt();
    }
  }
  
  function parseUser(response) {
    const idToken = response.credential;
    Cookie.set($config.auth.cookieName, idToken, { expires: 1/24, sameSite: 'Lax' })
    signInVerify()
  }

  async function signInVerify() {
    try {
      const response = await unWrap(await fetch('api/user'))
      const user = response.json
      store.commit('auth/user', {
        fullName: user.name,
        profileUrl: user.image,
      })
    } catch(error) {
      console.log(error)
      signOut()
    }
  }

  function signOut() {
    window.google.accounts.id.disableAutoSelect();
    Cookie.remove($config.auth.cookieName);
    store.commit('auth/user', null);
    window.google.accounts.id.prompt();
  }
}