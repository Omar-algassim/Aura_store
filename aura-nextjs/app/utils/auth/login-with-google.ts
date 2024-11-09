import {backendConstants} from '@/app/(constants)/backend-constants';
import axios from 'axios';

const loginWithGoogle = async () => {
  // const result = await axios.get(backendConstants.googleLoginUrl, {headers: {
  //   'Access-Control-Allow-Origin': '*', // should be edited to the actual domain for production
  const result = fetch(backendConstants.googleLoginUrl).then((response) => {response.json()}).then((data) => {console.log(data)}).catch((error) => {console.log(error)});
};

export default loginWithGoogle;
