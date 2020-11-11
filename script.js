const API_KEY = "zbmE4M5x8MyNfPJSBQo00GMThv87eFhmVVfbPtid";

const makeRequest = (method, url, callback) => {
  const xmlHttp = new XMLHttpRequest();
            
  xmlHttp.onload = () => {
    if(xmlHttp.status == 200) {
      callback(JSON.parse(xmlHttp.response));
    } else {
      console.log("There was an error processing the request");
    }
  }

  xmlHttp.open(method, url);
  xmlHttp.send();
}