(() => {
  function loadScript(url, callback) {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    script.onload = callback;
    document.head.appendChild(script);
  }

  function onLoad() {
    if (!window.SockJS || !window.ReactErrorOverlay) return;

    var SockJS = window.SockJS;
    var reo = window.ReactErrorOverlay;
    var launchEditorEndpoint = require('react-dev-utils/launchEditorEndpoint');

    // enable reporting
    reo.setEditorHandler((location) => {
      var components = [];
      for (var key in location) components.push(`${key}=${encodeURIComponent(location[key])}`);
      fetch(`${launchEditorEndpoint}?${components.join('&')}`);
    });
    reo.startReportingRuntimeErrors({});

    function errorMessage(e, stack) {
      // react-error-overlay assumes relative filenames
      function relativefile(file) {
        return !file.startsWith('./') ? `./${file}` : file;
      }

      if (!e.location) return `Error: ${e.text}`;
      var pluginText = e.pluginName ? `[plugin: ${e.pluginName}] ` : '';
      var message = stack ? '' : `${relativefile(e.location.file)}\n`;
      message += `Error: ${pluginText}${e.text}\n\tat ${e.location.lineText}`;
      message += ` (${stack ? `${e.location.file}:` : ''}${e.location.line}:${e.location.column})`;
      return message;
    }

    // listen for build results
    var origin = window.location.origin.replace(/\/+$/, '');
    var connection = new SockJS(`${origin}/esbuild`);
    connection.onmessage = (event) => {
      var result = JSON.parse(event.data);
      if (result.errors.length) return reo.reportBuildError(errorMessage(result.errors[0]));
      window.location.reload();
    };
  }

  window.process = window.process || {};
  window.process.env = window.process.env || 'development'; // react-error-overlay expects process
  loadScript('https://cdn.jsdelivr.net/npm/sockjs-client@1/dist/sockjs.min.js', onLoad);
  loadScript('https://cdn.jsdelivr.net/npm/react-error-overlay@6.0.9/lib/index.min.js', onLoad);
})();
