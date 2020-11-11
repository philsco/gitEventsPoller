const Poller = (data, int, tag, rem, cyc) => {
    var datasource = 'https://api.github.com/events'; 
    var dataset = data || new Map();
    var cycles = cyc || 0;
    var interval = int || 10000;
    var ETag = tag || "";
    var remaining = rem || 60;

    setTimeout(async () => {
        fetch(datasource, {headers: {"If-None-Match": ETag}})
        .then(resp => {
        console.log('Got response')
        console.log(resp.headers)
        return {
            data: resp.json(),
            headers: resp.headers,
            type: resp.type
        }
      })
      .then(respObj => {
          console.log("processing response")
          interTmp = respObj.headers.get("x-poll-interval");
          remaining = respObj.headers.get("X-Ratelimit-Remaining")
          console.log("interval set to " + interval);
          interval = (interTmp * 1000) +(60 - remaining) * 1000;
          console.log("calls remaining " + remaining);
          if (respObj.type === 304) {
              return []
          } else {
              ETag = respObj.headers.get('etag').match(/".*"/)[0];
              return respObj.data
          }
      })
      .then(itemArr => {
        return itemArr.map(item => {      
          return {
            id: item.id,
            type: item.type,
            created: item.payload? item.payload.pull_request? item.payload.pull_request.head?item.payload.pull_request.head
            ? item.payload.pull_request.head.repo? item.payload.pull_request.head.repo.created_at
            : null : null : null : null : null,
            comment: item.payload? item.payload.comments? item.payload.comments : null : null,
            language: item.payload? item.payload.pull_request? item.payload.pull_request.head? item.payload.pull_request.head.repo
            ? item.payload.pull_request.head.repo.language? item.payload.pull_request.head.repo.language
            : null : null : null :null : null, repo: item.repo,
          }
          })
        })
        .then(parsed => {
          parsed.forEach(item => {
            dataset.set(item.id, item)
            })
        })
        .then(() => {
        cycles ++;
        var event = new CustomEvent("refresh", {
            detail: {
              count: cycles,
              size: dataset.size,
              data: dataset
            }
        });
        window.dispatchEvent(event);
        Poller(dataset, interval, ETag, remaining, cycles);
      })
      .catch(err => {
          console.log("ERR")
          console.log(err)
      })
    }, interval)
}