import axios from 'axios';
import { convert } from 'html-to-text';
import qs from 'qs';


let data = qs.stringify({
  'grant_type': 'password',
  'username': 'WApiUser',
  'password': 'tttttt'
});

let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: 'https://www.ahmedabadbrts.org:8081/token',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  data: data
};

// axios.request(config)
// .then((response) => {
//   console.log(response.data);
// })
// .catch((error) => {
//   console.log(error);
// });
console.log(convert('Turn <b>left</b> onto <b>Gurukul Rd</b>/<wbr/><b>Vishram Marg</b>'))