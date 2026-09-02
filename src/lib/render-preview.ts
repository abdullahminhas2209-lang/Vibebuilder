import type { ProjectFile } from "@/lib/types";

/**
 * Builds a complete self-contained HTML page that runs the generated React + Tailwind code
 * in real-time inside the browser iframe.
 */
export function generateLivePreviewHtml(files: ProjectFile[]): string {
  // Serialize files to safely inject into iframe script
  const filesJson = JSON.stringify(
    files.map((f) => ({
      path: f.path,
      name: f.name,
      code: f.code,
    }))
  );

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Live Preview</title>
  
  <!-- Tailwind CSS CDN -->
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

  <!-- React 18 UMD -->
  <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>

  <!-- Babel Standalone for real-time TSX/JSX compilation -->
  <script src="https://unpkg.com/@babel/standalone@7.24.0/babel.min.js"></script>

  <!-- Inter Font -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">

  <style>
    body {
      font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
    }
    /* Smooth scroll */
    html {
      scroll-behavior: smooth;
    }
  </style>
</head>
<body class="bg-white text-slate-900 min-h-screen">
  <div id="root">
    <div class="flex items-center justify-center min-h-screen">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>
  </div>

  <script>
    (function() {
      const files = ${filesJson};

      // 1. Setup Lucide Icon Mock Proxy
      // Generates smart SVG placeholders for any Lucide icon requested by AI
      const LucideIcons = new Proxy({}, {
        get: function(target, prop) {
          if (typeof prop !== 'string' || prop === '$$typeof') return undefined;
          
          return function DynamicIcon(props) {
            const className = props.className || 'w-5 h-5';
            const size = props.size || 20;
            const color = props.color || 'currentColor';
            const strokeWidth = props.strokeWidth || 2;

            // Simple common icon shapes
            let pathData = "M12 2v20M2 12h20"; // default cross/star
            const name = prop.toLowerCase();
            
            if (name.includes('arrow') && name.includes('right')) pathData = "M5 12h14M12 5l7 7-7 7";
            else if (name.includes('arrow') && name.includes('left')) pathData = "M19 12H5M12 19l-7-7 7-7";
            else if (name.includes('check')) pathData = "M20 6L9 17l-5-5";
            else if (name.includes('close') || name.includes('x')) pathData = "M18 6L6 18M6 6l12 12";
            else if (name.includes('star')) pathData = "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z";
            else if (name.includes('calendar')) pathData = "M19 4H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2zM16 2v4M8 2v4M3 10h18";
            else if (name.includes('clock') || name.includes('time')) pathData = "M12 22a10 10 0 100-20 10 10 0 000 20zM12 6v6l4 2";
            else if (name.includes('map') || name.includes('pin')) pathData = "M12 21s-8-4.5-8-11.8A8 8 0 0112 2a8 8 0 018 7.2c0 7.3-8 11.8-8 11.8zM12 11a2 2 0 100-4 2 2 0 000 4z";
            else if (name.includes('phone')) pathData = "M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z";
            else if (name.includes('mail')) pathData = "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6";
            else if (name.includes('menu')) pathData = "M3 12h18M3 6h18M3 18h18";
            else if (name.includes('user')) pathData = "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z";
            else if (name.includes('shopping') || name.includes('cart') || name.includes('bag')) pathData = "M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0";
            else if (name.includes('heart')) pathData = "M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z";
            else if (name.includes('search')) pathData = "M11 19a8 8 0 100-16 8 8 0 000 16zM21 21l-4.35-4.35";
            else if (name.includes('sparkle')) pathData = "M12 2l2.4 7.2L21 12l-6.6 2.8L12 22l-2.4-7.2L3 12l6.6-2.8z";
            else if (name.includes('utensil') || name.includes('food') || name.includes('coffee')) pathData = "M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8zM6 1v3M10 1v3M14 1v3";

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

      // 2. Setup In-Memory Module System
      const moduleCache = {};
      const moduleRegistry = {};

      function customRequire(moduleName) {
        if (moduleName === 'react') return window.React;
        if (moduleName === 'react-dom' || moduleName === 'react-dom/client') return window.ReactDOM;
        if (moduleName === 'lucide-react') return LucideIcons;

        // Clean module path (e.g. "@/components/Navbar" -> "components/Navbar")
        const cleanName = moduleName.replace(/^@\//, '').replace(/^\.\//, '').replace(/\.(tsx|ts|jsx|js)$/, '');

        // Search in registry
        for (const path in moduleRegistry) {
          const normPath = path.replace(/\.(tsx|ts|jsx|js)$/, '');
          if (normPath === cleanName || normPath.endsWith('/' + cleanName) || cleanName.endsWith('/' + normPath) || normPath.split('/').pop() === cleanName.split('/').pop()) {
            if (!moduleCache[path]) {
              const module = { exports: {} };
              moduleRegistry[path](module, module.exports, customRequire);
              moduleCache[path] = module.exports;
            }
            return moduleCache[path];
          }
        }

        // Return empty mock object if module not found
        console.warn('Module not found in preview bundle:', moduleName);
        return new Proxy({}, {
          get: () => () => React.createElement('div', { className: 'p-2 text-xs bg-yellow-100 text-yellow-800 rounded' }, 'Component: ' + moduleName)
        });
      }

      // 3. Compile all files with Babel
      try {
        files.forEach(function(file) {
          // Remove "use client"; directive and type annotations
          let code = file.code.replace(/["']use client["'];?/g, '');
          
          // Transpile with Babel
          const transpiled = Babel.transform(code, {
            presets: ['react', 'typescript'],
            plugins: [
              ['transform-modules-commonjs', { strict: false }]
            ],
            filename: file.name
          }).code;

          moduleRegistry[file.path] = new Function('module', 'exports', 'require', transpiled);
        });

        // 4. Find Root Component (app/page.tsx or first page/component)
        let rootFile = files.find(f => f.path === 'app/page.tsx' || f.name === 'page.tsx') || files[0];
        
        if (!rootFile) {
          throw new Error('No files found to render.');
        }

        const rootModule = customRequire(rootFile.path);
        const RootComponent = rootModule.default || rootModule.Page || rootModule.Home || rootModule.App || Object.values(rootModule)[0];

        if (!RootComponent || typeof RootComponent !== 'function') {
          throw new Error('Could not find a default export component in ' + rootFile.path);
        }

        // 5. Mount to DOM
        const rootElement = document.getElementById('root');
        if (ReactDOM.createRoot) {
          ReactDOM.createRoot(rootElement).render(React.createElement(RootComponent));
        } else {
          ReactDOM.render(React.createElement(RootComponent), rootElement);
        }

      } catch (err) {
        console.error('Preview render error:', err);
        document.getElementById('root').innerHTML = \`
          <div class="min-h-screen bg-slate-50 flex items-center justify-center p-6">
            <div class="max-w-xl w-full bg-white rounded-2xl border border-red-200 p-6 shadow-xl">
              <div class="flex items-center gap-3 text-red-600 mb-3">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                <h3 class="font-bold text-lg">Preview Render Notice</h3>
              </div>
              <p class="text-sm text-slate-600 mb-4">\${err.message || 'An error occurred while compiling components.'}</p>
              <div class="bg-slate-900 rounded-xl p-3 overflow-x-auto text-xs font-mono text-red-300">
                \${err.stack ? err.stack.slice(0, 500) : err.toString()}
              </div>
            </div>
          </div>
        \`;
      }
    })();
  </script>
</body>
</html>`;
}
