export default
  function getDataRequest (callback) {
      const request = new XMLHttpRequest();
      request.open('GET', "https://en.wikipedia.org/w/api.php?action=opensearch&search=Seona+Dancing&format=json&origin=*", true);
      request.onload = function () {
          var data = JSON.parse(this.response);
          if (request.status >= 200 && request.status < 400) {
              callback(data)
          } else {
              console.log('error');
          }
      };
      request.send();
  }
