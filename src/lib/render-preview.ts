import type { ProjectFile } from "@/lib/types";

/**
 * Robust live preview builder that bundles, transpiles, and renders
 * multi-file Next.js/React + Tailwind CSS components in browser iframe.
 */
export function generateLivePreviewHtml(files: ProjectFile[]): string {
  const safeFiles = files.map((f) => ({
    path: f.path,
    name: f.name,
    code: f.code || "",
  }));

  const filesJson = JSON.stringify(safeFiles).replace(/</g, "\\u003c");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Live Preview</title>
  
  <!-- Tailwind CSS -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            border: "hsl(214.3 31.8% 91.4%)",
            background: "hsl(0 0% 100%)",
            foreground: "hsl(222.2 84% 4.9%)",
            primary: {
              DEFAULT: "hsl(221.2 83.2% 53.3%)",
              foreground: "hsl(210 40% 98%)",
            },
            muted: {
              DEFAULT: "hsl(210 40% 96.1%)",
              foreground: "hsl(215.4 16.3% 46.9%)",
            },
            card: {
              DEFAULT: "hsl(0 0% 100%)",
              foreground: "hsl(222.2 84% 4.9%)",
            },
          }
        }
      }
    }
  </script>

  <!-- React 18 & ReactDOM -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js"></script>

  <!-- Babel Standalone for real-time TSX/JSX compilation -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/7.24.4/babel.min.js"></script>

  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">

  <style>
    body {
      font-family: 'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
    }
    html {
      scroll-behavior: smooth;
    }
    ::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    ::-webkit-scrollbar-thumb {
      background: rgba(100, 116, 139, 0.3);
      border-radius: 4px;
    }
  </style>
</head>
<body class="bg-white text-slate-900 min-h-screen">
  <div id="root">
    <div class="flex flex-col items-center justify-center min-h-screen p-8 text-center text-slate-500">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-2 border-indigo-600 border-t-transparent mb-3"></div>
      <p class="text-xs font-medium tracking-wide">Compiling & rendering components...</p>
    </div>
  </div>

  <script>
    function showError(msg, details) {
      const root = document.getElementById('root');
      if (!root) return;
      root.innerHTML = \`
        <div class="min-h-screen bg-slate-50 flex items-center justify-center p-6">
          <div class="max-w-xl w-full bg-white rounded-2xl border border-red-200 p-6 shadow-xl">
            <div class="flex items-center gap-3 text-red-600 mb-2">
              <svg class="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
              <h3 class="font-bold text-base">Preview Render Notice</h3>
            </div>
            <p class="text-sm text-slate-700 mb-3 font-medium">\${escapeHtml(msg || 'An issue occurred during component rendering.')}</p>
            \${details ? \`<div class="bg-slate-900 rounded-xl p-3 overflow-x-auto text-xs font-mono text-red-300">\${escapeHtml(details)}</div>\` : ''}
          </div>
        </div>
      \`;
    }

    function escapeHtml(str) {
      return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    window.addEventListener('error', function(e) {
      showError(e.message, (e.filename || '') + ':' + (e.lineno || ''));
    });

    (function() {
      try {
        const files = ${filesJson};
        if (!files || files.length === 0) {
          showError('No files available to render.');
          return;
        }

        // 1. Setup Lucide SVG Icon Proxy
        const LucideIcons = new Proxy({}, {
          get: function(target, prop) {
            if (typeof prop !== 'string' || prop === '$$typeof' || prop === 'default' || prop === '__esModule') return undefined;
            
            return function DynamicIcon(props) {
              props = props || {};
              const className = props.className || 'w-5 h-5';
              const size = props.size || 20;
              const color = props.color || 'currentColor';
              const strokeWidth = props.strokeWidth || 2;

              let pathData = "M12 2v20M2 12h20"; // default
              const name = prop.toLowerCase();
              
              if (name.includes('arrow') && name.includes('right')) pathData = "M5 12h14M12 5l7 7-7 7";
              else if (name.includes('arrow') && name.includes('left')) pathData = "M19 12H5M12 19l-7-7 7-7";
              else if (name.includes('check')) pathData = "M20 6L9 17l-5-5";
              else if (name.includes('close') || name.includes('x') || name.includes('delete') || name.includes('trash')) pathData = "M18 6L6 18M6 6l12 12";
              else if (name.includes('star')) pathData = "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z";
              else if (name.includes('calendar')) pathData = "M19 4H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2zM16 2v4M8 2v4M3 10h18";
              else if (name.includes('clock') || name.includes('time') || name.includes('history')) pathData = "M12 22a10 10 0 100-20 10 10 0 000 20zM12 6v6l4 2";
              else if (name.includes('calculator')) pathData = "M4 2h16a2 2 0 012 2v16a2 2 0 01-2 2H4a2 2 0 01-2-2V4a2 2 0 012-2zM8 6h8M8 10h2M14 10h2M8 14h2M14 14h2M8 18h2M14 18h2";
              else if (name.includes('map') || name.includes('pin')) pathData = "M12 21s-8-4.5-8-11.8A8 8 0 0112 2a8 8 0 018 7.2c0 7.3-8 11.8-8 11.8zM12 11a2 2 0 100-4 2 2 0 000 4z";
              else if (name.includes('phone')) pathData = "M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z";
              else if (name.includes('mail')) pathData = "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6";
              else if (name.includes('menu')) pathData = "M3 12h18M3 6h18M3 18h18";
              else if (name.includes('user')) pathData = "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z";
              else if (name.includes('shopping') || name.includes('cart') || name.includes('bag')) pathData = "M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0";
              else if (name.includes('heart')) pathData = "M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z";
              else if (name.includes('search')) pathData = "M11 19a8 8 0 100-16 8 8 0 000 16zM21 21l-4.35-4.35";
              else if (name.includes('sparkle') || name.includes('sparkles')) pathData = "M12 2l2.4 7.2L21 12l-6.6 2.8L12 22l-2.4-7.2L3 12l6.6-2.8z";
              else if (name.includes('rotate') || name.includes('refresh') || name.includes('undo')) pathData = "M1 4v6h6M23 20v-6h-6M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15";
              else if (name.includes('plus')) pathData = "M12 5v14M5 12h14";
              else if (name.includes('minus')) pathData = "M5 12h14";
              else if (name.includes('divide')) pathData = "M12 6a1 1 0 100-2 1 1 0 000 2zM5 12h14M12 20a1 1 0 100-2 1 1 0 000 2z";
              else if (name.includes('percent')) pathData = "M19 5L5 19M6.5 6.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM17.5 17.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z";
              else if (name.includes('equal')) pathData = "M5 9h14M5 15h14";

              return React.createElement('svg', {
                xmlns: 'http://www.w3.org/2000/svg',
                width: size,
                height: size,
                viewBox: '0 0 24 24',
                fill: 'none',
                stroke: color,
                strokeWidth: strokeWidth,
                strokeLinecap: 'round',
                strokeLinejoin: 'round',
                className: className,
                ...props
              }, React.createElement('path', { d: pathData }));
            };
          }
        });

        // 2. Setup In-Memory CommonJS Module Environment
        const moduleRegistry = {};
        const moduleCache = {};

        function requireModule(specifier) {
          if (specifier === 'react') {
            const r = window.React;
            return Object.assign({ default: r }, r);
          }
          if (specifier === 'react-dom' || specifier === 'react-dom/client') {
            const rd = window.ReactDOM;
            return Object.assign({ default: rd }, rd);
          }
          if (specifier === 'lucide-react') {
            return Object.assign({ default: LucideIcons }, LucideIcons);
          }

          // Normalize path
          const clean = specifier.replace(/^@\//, '').replace(/^\.\//, '').replace(/^\.\.\//, '').replace(/\.(tsx|ts|jsx|js)$/, '');

          // Look up in registry
          for (const key in moduleRegistry) {
            const normKey = key.replace(/\.(tsx|ts|jsx|js)$/, '');
            if (
              normKey === clean ||
              normKey.endsWith('/' + clean) ||
              clean.endsWith('/' + normKey) ||
              normKey.split('/').pop() === clean.split('/').pop()
            ) {
              if (!moduleCache[key]) {
                const module = { exports: {} };
                moduleRegistry[key](module, module.exports, requireModule);
                moduleCache[key] = module.exports;
              }
              return moduleCache[key];
            }
          }

          // Fallback dummy component if an unknown sub-component is imported
          console.warn('Unknown module requested in preview:', specifier);
          const fallbackName = specifier.split('/').pop() || 'Component';
          const DummyComponent = function(props) {
            return React.createElement('div', { className: 'p-2 text-xs bg-slate-100 text-slate-700 rounded border my-1' }, fallbackName);
          };
          return { default: DummyComponent, [fallbackName]: DummyComponent };
        }

        // 3. Compile all files with Babel using 'env', 'react', 'typescript' presets
        files.forEach(function(file) {
          try {
            let src = file.code || '';
            // Remove Next.js directives
            src = src.replace(/["']use client["'];?/g, '');

            // Transpile using Babel Standalone with full CommonJS module transformation
            const transpiled = Babel.transform(src, {
              presets: [
                ['env', { modules: 'commonjs' }],
                'react',
                'typescript'
              ],
              filename: file.name
            }).code;

            moduleRegistry[file.path] = new Function('module', 'exports', 'require', transpiled);
          } catch (compErr) {
            console.error('File compile error for ' + file.path + ':', compErr);
            showError('Compile Error in ' + file.path, compErr.message);
          }
        });

        // 4. Resolve Root Component
        const rootCandidate = files.find(f => f.path === 'app/page.tsx' || f.name === 'page.tsx') || files[0];
        if (!rootCandidate) {
          showError('Could not find root page (app/page.tsx).');
          return;
        }

        const rootModule = requireModule(rootCandidate.path);
        const RootComponent = rootModule.default || rootModule.Page || rootModule.Home || rootModule.App || (typeof rootModule === 'function' ? rootModule : null) || Object.values(rootModule).find(v => typeof v === 'function');

        if (!RootComponent) {
          showError('Root component in ' + rootCandidate.path + ' could not be resolved.', 'Exports: ' + Object.keys(rootModule).join(', '));
          return;
        }

        // 5. Mount Component to Root DOM
        const rootEl = document.getElementById('root');
        if (ReactDOM.createRoot) {
          const root = ReactDOM.createRoot(rootEl);
          root.render(React.createElement(RootComponent));
        } else {
          ReactDOM.render(React.createElement(RootComponent), rootEl);
        }

      } catch (err) {
        console.error('Mounting error:', err);
        showError(err.message, err.stack);
      }
    })();
  </script>
</body>
</html>`;
}
