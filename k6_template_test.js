import http from 'k6/http';
import { URL } from 'https://jslib.k6.io/url/1.0.0/index.js';
import { sleep, check } from 'k6';
import { Counter } from 'k6/metrics';
import papaparse from 'https://jslib.k6.io/papaparse/5.1.1/index.js';
import { SharedArray } from 'k6/data';
import { Trend } from 'k6/metrics';

export const options = {
  vus: 1,
  duration: '20s',
};


export default function () {

// show me test page
  const showmeUrl = new URL('http://127.0.0.1:2525/showme');
  const showmeResponse = http.post(showmeUrl.toString());
  console.log("showmeResponse: " + showmeResponse.body);
  const showmeResponseCheck = check(showmeResponse, {
    'status is 200': (r) => r.status === 200,                     // contains http 200 OK
    'response body': (r) => r.body.indexOf('showme') !== -1,   // constains string showme
  });

// post test url
const postTestUrl = new URL('http://127.0.0.1:2525/post_test');
const postPayload = JSON.stringify({
  username: 'templateUser',
  password:'Password01'
  });
const postParams = {
    headers: {
      'Content-Type': 'application/json',
    },
};
// call the url with parameters
const postResponse = http.post(postTestUrl.toString(), postPayload, postParams);
console.log("postResponse: " + postResponse.body);
const postResponseCheck = check(postResponse, {
  'status is 200': (r) => r.status === 200,                     // contains http 200 OK
  'response body': (r) => r.body.indexOf('userToken') !== -1,   // constains string userToken OK
});

//const res = http.get('http://127.0.0.1:2525/showme');
// http://127.0.0.1:2525/get_name?firstname=FirstName&lastName=LastName&dateOfBirth=01/01/1980&email=email@gmail.com
  const getTestUrl = new URL('http://127.0.0.1:2525/get_test');
  getTestUrl.searchParams.append('firstname', "FirstName");
  getTestUrl.searchParams.append('lastName', "LastName");
  getTestUrl.searchParams.append('dateOfBirth', "01/01/1980");
  getTestUrl.searchParams.append('email', "email@gmail.com");

  //console.log(url.toString())
  // call url
  const getResponse = http.get(getTestUrl.toString());
  console.log("getResponse: "  + getResponse.body);

// check response for correctness
  const getResponseCheck = check(getResponse, {
    'status is 200': (r) => r.status === 200,                           // http 200 OK
    'response body': (r) => r.body.indexOf('user get name OK') !== -1,  // contains user get name OK OK
  });

  const defaultUrl = new URL('http://127.0.0.1:2525/default');
  // call url
  const defaultResponse = http.get(defaultUrl.toString());
  console.log("defaultResponse: "  + defaultResponse.body);

// check response for correctness
  const defaultResponseCheck = check(defaultResponse, {
    'status is 404': (r) => r.status === 404,                           // http 200 OK
    'response body': (r) => r.body.indexOf('404 Not Found') !== -1,  // contains 404 Not Found OK
  });
}
