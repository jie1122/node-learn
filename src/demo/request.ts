import http, { RequestOptions } from 'node:http';

httpRequest(
  "http://www.baidu.com"
).then(res => {
  debugger
})

function httpRequest(options: RequestOptions | string | URL) {
  return new Promise((resolve, reject) => {
      const req = http.request(options, (res) => {
          console.log(res)
          let data = '';

          res.on('data', (chunk) => {
              data += chunk;
          });

          res.on('end', () => {
              resolve(data);
          });
      });

      req.on('error', (error) => {
          reject(error);
      });

      req.end();
  });
}
