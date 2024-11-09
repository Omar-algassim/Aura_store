'use client';
// Code to create a session in local storage

const createSession = (jwt: string, user: object) => {
    if (jwt && user) {
      localStorage.setItem('jwt', jwt);
      localStorage.setItem('user', JSON.stringify(user));
      console.log(`User ${user} signed up successfully with jwt ${jwt}`);
    }
};


export default createSession;
