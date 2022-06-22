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
    console.log(Cookie.get($config.auth.cookieName))
    window.google.accounts.id.initialize({
      client_id: $config.auth.clientId,
      callback: parseUser,
    });
    window.google.accounts.id.renderButton(
      document.getElementById('googleButton'),
      { theme: "outline", size: "medium" }
    );
    window.google.accounts.id.prompt();
  }
  
  async function parseUser(response) {
    const idToken = response.credential;
    Cookie.set($config.auth.cookieName, idToken, { expires: 1/24, sameSite: 'Lax' })

    try {
      const response = await unWrap(await fetch('api/user'))
      const user = response.json

    /**
     * Wywalone poniższe dwie linie, ponieważ nie dekodujemy już tokena funkcją,
     * tylko zbieramy dane z naszego middleware (API Algolia proxy)
     */
    // const decodedResponse = decodeJwtResponse(response.credential);
    // const userData = decodedResponse.payload;

      store.commit('auth/user', {
        fullName: user.name,
        profileUrl: user.image,
      })
    } catch(error) {
      console.log(error)
    }

  }

  function signOut() {
    window.google.accounts.id.disableAutoSelect();
    Cookie.remove($config.auth.cookieName);
    store.commit('auth/user', null);
    window.google.accounts.id.prompt();
  }

  function decodeJwtResponse(token) {
    const segments = token.split('.');

    if (segments.length !== 3) {
      throw new Error('Not enough or too many segments');
    }

    // base64 decode and parse JSON
    const header = JSON.parse(base64urlDecode(segments[0]));
    const payload = JSON.parse(base64urlDecode(segments[1]));

    return {
      header: header,
      payload: payload,
      signature: segments[2]
    }
  }

  function base64urlDecode(str) {
    return Buffer.from(base64urlUnescape(str), 'base64').toString();
    // return new Buffer(base64urlUnescape(str), 'base64').toString();
  };
  
  function base64urlUnescape(str) {
    str += Array(5 - str.length % 4).join('=');
    return str.replace(/\-/g, '+').replace(/_/g, '/');
  } 
}