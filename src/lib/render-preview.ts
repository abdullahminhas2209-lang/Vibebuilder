import type { ProjectFile } from "@/lib/types";

/**
 * Robust live preview builder that bundles, transpiles, and renders
 * multi-file Next.js/React + Tailwind CSS components in a sandboxed browser iframe.
 */
export function generateLivePreviewHtml(files: ProjectFile[]): string {
  const safeFiles = files.map((f) => ({
    path: f.path,
    name: f.name,
    code: f.code || "",
  }));

  // Separate CSS files to inject directly into <style> tag
  const cssCode = files
    .filter((f) => f.path.endsWith(".css") || f.name.endsWith(".css"))
    .map((f) => f.code || "")
    .join("\n");

  const filesJson = JSON.stringify(safeFiles).replace(/</g, "\\u003c");
  const escapedCss = cssCode.replace(/<\/style>/gi, "<\\/style>");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Live Preview</title>
  
  <!-- Early error handling in <head> -->
  <script>
    function escapeHtml(str) {
      return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    window.showError = function(msg, details) {
      console.error('Preview Error:', msg, details);
      var root = document.getElementById('root');
      if (!root) return;
      root.innerHTML = '<div class="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">' +
        '<div class="max-w-2xl w-full bg-white rounded-2xl border border-red-200 p-6 shadow-xl">' +
          '<div class="flex items-center gap-3 text-red-600 mb-2">' +
            '<svg class="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>' +
            '<h3 class="font-bold text-base">Preview Render Notice</h3>' +
          '</div>' +
          '<p class="text-sm text-slate-700 mb-3 font-medium">' + escapeHtml(msg || 'An issue occurred during component rendering.') + '</p>' +
          (details ? '<pre class="bg-slate-900 rounded-xl p-4 overflow-x-auto text-xs font-mono text-red-300 whitespace-pre-wrap">' + escapeHtml(details) + '</pre>' : '') +
        '</div>' +
      '</div>';
    };

    window.__onCdnError = function(cdnName) {
      window.showError('Failed to load required compiler libraries from CDN: ' + cdnName, 'Please check your internet connection or browser extensions.');
    };

    window.onerror = function(msg, url, lineNo, colNo, error) {
      console.error('Global preview error:', msg, error);
      window.showError(msg, (url || '') + ':' + (lineNo || '') + (error && error.stack ? '\\n' + error.stack : ''));
    };

    window.onunhandledrejection = function(event) {
      console.error('Unhandled promise rejection:', event.reason);
      var reason = event.reason;
      window.showError('Unhandled Promise Rejection: ' + (reason ? reason.message || reason : 'Unknown error'), reason && reason.stack);
    };
  </script>

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
            secondary: {
              DEFAULT: "hsl(210 40% 96.1%)",
              foreground: "hsl(222.2 47.4% 11.2%)",
            },
            destructive: {
              DEFAULT: "hsl(0 84.2% 60.2%)",
              foreground: "hsl(210 40% 98%)",
            },
            muted: {
              DEFAULT: "hsl(210 40% 96.1%)",
              foreground: "hsl(215.4 16.3% 46.9%)",
            },
            accent: {
              DEFAULT: "hsl(210 40% 96.1%)",
              foreground: "hsl(222.2 47.4% 11.2%)",
            },
            popover: {
              DEFAULT: "hsl(0 0% 100%)",
              foreground: "hsl(222.2 84% 4.9%)",
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
  <script onerror="window.__onCdnError && window.__onCdnError('React 18 CDN')" src="https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js"></script>
  <script onerror="window.__onCdnError && window.__onCdnError('ReactDOM 18 CDN')" src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js"></script>

  <!-- Babel Standalone for real-time TSX/JSX compilation -->
  <script onerror="window.__onCdnError && window.__onCdnError('Babel Standalone CDN')" src="https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/7.24.4/babel.min.js"></script>

  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">

  <style>
    body {
      font-family: 'Plus Jakarta Sans', 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
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

  ${escapedCss ? `<style id="custom-app-css">\n${escapedCss}\n</style>` : ""}
</head>
<body class="bg-white text-slate-900 min-h-screen">
  <div id="root">
    <div class="flex flex-col items-center justify-center min-h-screen p-8 text-center text-slate-500 font-sans">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-2 border-indigo-600 border-t-transparent mb-3"></div>
      <p class="text-xs font-medium tracking-wide">Compiling & rendering components...</p>
    </div>
  </div>

  <script>
    (function() {
      try {
        var files = ${filesJson};
        if (!files || files.length === 0) {
          window.showError('No files available to render.');
          return;
        }

        if (typeof window.React === 'undefined' || typeof window.ReactDOM === 'undefined') {
          window.showError('React runtime not loaded.', 'Please ensure scripts from cdnjs/unpkg are not blocked.');
          return;
        }

        if (typeof window.Babel === 'undefined') {
          window.showError('Babel compiler not loaded.', 'Please ensure Babel script is accessible.');
          return;
        }

        var React = window.React;
        var ReactDOM = window.ReactDOM;

        // 1. Next.js Link & Image Stubs
        var NextLink = function Link(props) {
          var href = props && props.href ? props.href : '#';
          var children = props ? props.children : null;
          var className = props ? props.className : undefined;
          return React.createElement('a', Object.assign({}, props, {
            href: href,
            className: className,
            onClick: function(e) {
              if (href && href.startsWith('#')) {
                // allow in-page anchor navigation
              } else {
                e.preventDefault();
              }
            }
          }), children);
        };

        var NextImage = function Image(props) {
          var src = props && props.src ? props.src : '';
          var alt = props && props.alt ? props.alt : 'Image';
          var width = props ? props.width : undefined;
          var height = props ? props.height : undefined;
          var className = props ? props.className : undefined;
          var fallback = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80';
          var imageSrc = (typeof src === 'string' && (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:'))) ? src : fallback;
          return React.createElement('img', Object.assign({}, props, {
            src: imageSrc,
            alt: alt,
            width: width,
            height: height,
            className: className,
            loading: 'lazy'
          }));
        };

        // 2. Comprehensive Icon Factory Proxy
        function createIconProxy() {
          var iconCache = {};
          return new Proxy({}, {
            get: function(target, prop) {
              if (typeof prop !== 'string') return undefined;
              if (prop === '__esModule') return true;
              if (prop === '$$typeof') return undefined;
              if (prop === 'default') return target;

              if (iconCache[prop]) return iconCache[prop];

              var IconComponent = function(props) {
                props = props || {};
                var className = props.className || 'w-5 h-5';
                var size = props.size || 20;
                var color = props.color || 'currentColor';
                var strokeWidth = props.strokeWidth || 2;
                var name = prop.toLowerCase();

                var pathData = "M12 2v20M2 12h20"; // default
                if (name.includes('arrow') && name.includes('right')) pathData = "M5 12h14M12 5l7 7-7 7";
                else if (name.includes('arrow') && name.includes('left')) pathData = "M19 12H5M12 19l-7-7 7-7";
                else if (name.includes('arrow') && name.includes('up')) pathData = "M12 19V5M5 12l7-7 7 7";
                else if (name.includes('arrow') && name.includes('down')) pathData = "M12 5v14M19 12l-7 7-7-7";
                else if (name.includes('chevron') && name.includes('right')) pathData = "M9 18l6-6-6-6";
                else if (name.includes('chevron') && name.includes('left')) pathData = "M15 18l-6-6 6-6";
                else if (name.includes('chevron') && name.includes('down')) pathData = "M6 9l6 6 6-6";
                else if (name.includes('chevron') && name.includes('up')) pathData = "M18 15l-6-6-6 6";
                else if (name.includes('check')) pathData = "M20 6L9 17l-5-5";
                else if (name.includes('close') || name.includes('x') || name.includes('delete') || name.includes('trash')) pathData = "M18 6L6 18M6 6l12 12";
                else if (name.includes('star')) pathData = "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z";
                else if (name.includes('calendar')) pathData = "M19 4H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2zM16 2v4M8 2v4M3 10h18";
                else if (name.includes('clock') || name.includes('time') || name.includes('history')) pathData = "M12 22a10 10 0 100-20 10 10 0 000 20zM12 6v6l4 2";
                else if (name.includes('utensils') || name.includes('fork') || name.includes('knife') || name.includes('chef') || name.includes('food') || name.includes('restaurant')) pathData = "M18 2v20M6 2v6a4 4 0 004 4v10M6 2a2 2 0 012 2v4M10 2a2 2 0 00-2 2v4";
                else if (name.includes('map') || name.includes('pin') || name.includes('location')) pathData = "M12 21s-8-4.5-8-11.8A8 8 0 0112 2a8 8 0 018 7.2c0 7.3-8 11.8-8 11.8zM12 11a2 2 0 100-4 2 2 0 000 4z";
                else if (name.includes('phone')) pathData = "M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z";
                else if (name.includes('mail')) pathData = "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6";
                else if (name.includes('menu')) pathData = "M3 12h18M3 6h18M3 18h18";
                else if (name.includes('user')) pathData = "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z";
                else if (name.includes('shopping') || name.includes('cart') || name.includes('bag')) pathData = "M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0";
                else if (name.includes('heart')) pathData = "M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z";
                else if (name.includes('search')) pathData = "M11 19a8 8 0 100-16 8 8 0 000 16zM21 21l-4.35-4.35";
                else if (name.includes('sparkle') || name.includes('sparkles') || name.includes('zap') || name.includes('flame') || name.includes('fire')) pathData = "M12 2l2.4 7.2L21 12l-6.6 2.8L12 22l-2.4-7.2L3 12l6.6-2.8z";
                else if (name.includes('plus')) pathData = "M12 5v14M5 12h14";
                else if (name.includes('minus')) pathData = "M5 12h14";
                else if (name.includes('info')) pathData = "M12 16v-4M12 8h.01M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10z";
                else if (name.includes('filter') || name.includes('slider')) pathData = "M22 3H2l8 9.46V19l4 2v-8.54L22 3z";
                else if (name.includes('send')) pathData = "M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z";
                else if (name.includes('coffee') || name.includes('cup') || name.includes('mug')) pathData = "M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8zM6 1v3M10 1v3M14 1v3";
                else if (name.includes('globe')) pathData = "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z";
                else if (name.includes('shield') || name.includes('lock')) pathData = "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z";
                else if (name.includes('dumbbell') || name.includes('fitness') || name.includes('gym')) pathData = "M6.5 6.5l11 11M6 12l6-6M12 18l6-6M4 14l6-6M14 20l6-6";

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
                  className: className
                }, React.createElement('path', { d: pathData }));
              };

              iconCache[prop] = IconComponent;
              return IconComponent;
            }
          });
        }

        var UniversalIconProxy = createIconProxy();

        // 3. Class Names & Utility Functions Stub
        function cnHelper() {
          var classes = [];
          for (var i = 0; i < arguments.length; i++) {
            var arg = arguments[i];
            if (!arg) continue;
            if (typeof arg === 'string' || typeof arg === 'number') {
              classes.push(arg);
            } else if (Array.isArray(arg)) {
              classes.push(cnHelper.apply(null, arg));
            } else if (typeof arg === 'object') {
              for (var key in arg) {
                if (arg[key]) classes.push(key);
              }
            }
          }
          return classes.join(' ');
        }

        var cvaHelper = function(base, config) {
          return function(props) {
            props = props || {};
            var result = [base || ''];
            if (config && config.variants) {
              for (var variantKey in config.variants) {
                var val = props[variantKey] || (config.defaultVariants && config.defaultVariants[variantKey]);
                if (val && config.variants[variantKey][val]) {
                  result.push(config.variants[variantKey][val]);
                }
              }
            }
            if (props.className) result.push(props.className);
            return cnHelper(result);
          };
        };

        // 4. Universal Built-in UI Components & Proxies
        var UIComponents = {
          Button: function Button(props) {
            props = props || {};
            var className = cnHelper("inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm", props.className);
            return React.createElement('button', Object.assign({}, props, { className: className }), props.children);
          },
          Card: function Card(props) {
            props = props || {};
            var className = cnHelper("rounded-xl border border-slate-200 bg-white text-slate-950 shadow-sm", props.className);
            return React.createElement('div', Object.assign({}, props, { className: className }), props.children);
          },
          CardHeader: function CardHeader(props) {
            props = props || {};
            var className = cnHelper("flex flex-col space-y-1.5 p-6", props.className);
            return React.createElement('div', Object.assign({}, props, { className: className }), props.children);
          },
          CardTitle: function CardTitle(props) {
            props = props || {};
            var className = cnHelper("text-xl font-semibold leading-none tracking-tight", props.className);
            return React.createElement('h3', Object.assign({}, props, { className: className }), props.children);
          },
          CardDescription: function CardDescription(props) {
            props = props || {};
            var className = cnHelper("text-sm text-slate-500", props.className);
            return React.createElement('p', Object.assign({}, props, { className: className }), props.children);
          },
          CardContent: function CardContent(props) {
            props = props || {};
            var className = cnHelper("p-6 pt-0", props.className);
            return React.createElement('div', Object.assign({}, props, { className: className }), props.children);
          },
          CardFooter: function CardFooter(props) {
            props = props || {};
            var className = cnHelper("flex items-center p-6 pt-0", props.className);
            return React.createElement('div', Object.assign({}, props, { className: className }), props.children);
          },
          Badge: function Badge(props) {
            props = props || {};
            var className = cnHelper("inline-flex items-center rounded-full border border-slate-200 px-2.5 py-0.5 text-xs font-semibold bg-slate-100 text-slate-800 transition-colors", props.className);
            return React.createElement('div', Object.assign({}, props, { className: className }), props.children);
          },
          Input: function Input(props) {
            props = props || {};
            var className = cnHelper("flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50", props.className);
            return React.createElement('input', Object.assign({}, props, { className: className }));
          },
          Textarea: function Textarea(props) {
            props = props || {};
            var className = cnHelper("flex min-h-[80px] w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50", props.className);
            return React.createElement('textarea', Object.assign({}, props, { className: className }));
          },
          Separator: function Separator(props) {
            props = props || {};
            var className = cnHelper("shrink-0 bg-slate-200 h-[1px] w-full my-4 border-0", props.className);
            return React.createElement('hr', Object.assign({}, props, { className: className }));
          },
          Avatar: function Avatar(props) {
            props = props || {};
            var className = cnHelper("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", props.className);
            return React.createElement('div', Object.assign({}, props, { className: className }), props.children);
          },
          AvatarImage: function AvatarImage(props) {
            props = props || {};
            var className = cnHelper("aspect-square h-full w-full object-cover", props.className);
            return React.createElement('img', Object.assign({}, props, { className: className }));
          },
          AvatarFallback: function AvatarFallback(props) {
            props = props || {};
            var className = cnHelper("flex h-full w-full items-center justify-center rounded-full bg-slate-100 text-slate-600 text-xs font-medium", props.className);
            return React.createElement('div', Object.assign({}, props, { className: className }), props.children);
          },
          Dialog: function Dialog(props) {
            var open = props && props.open !== undefined ? props.open : true;
            return props && props.children ? props.children : null;
          },
          DialogTrigger: function DialogTrigger(props) {
            return props && props.children ? props.children : null;
          },
          DialogContent: function DialogContent(props) {
            props = props || {};
            var className = cnHelper("fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm", props.className);
            return React.createElement('div', { className: className },
              React.createElement('div', { className: "relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl" }, props.children)
            );
          },
          DialogHeader: function DialogHeader(props) {
            props = props || {};
            var className = cnHelper("flex flex-col space-y-1.5 text-center sm:text-left mb-4", props.className);
            return React.createElement('div', Object.assign({}, props, { className: className }), props.children);
          },
          DialogTitle: function DialogTitle(props) {
            props = props || {};
            var className = cnHelper("text-lg font-semibold leading-none tracking-tight", props.className);
            return React.createElement('h2', Object.assign({}, props, { className: className }), props.children);
          },
          DialogDescription: function DialogDescription(props) {
            props = props || {};
            var className = cnHelper("text-sm text-slate-500", props.className);
            return React.createElement('p', Object.assign({}, props, { className: className }), props.children);
          },
          DialogClose: function DialogClose(props) {
            return props && props.children ? props.children : null;
          },
          Tabs: function Tabs(props) {
            props = props || {};
            return React.createElement('div', { className: cnHelper("w-full", props.className) }, props.children);
          },
          TabsList: function TabsList(props) {
            props = props || {};
            return React.createElement('div', { className: cnHelper("inline-flex h-10 items-center justify-center rounded-lg bg-slate-100 p-1 text-slate-500", props.className) }, props.children);
          },
          TabsTrigger: function TabsTrigger(props) {
            props = props || {};
            return React.createElement('button', { className: cnHelper("inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-all text-slate-700 hover:bg-white hover:text-slate-900 shadow-sm", props.className) }, props.children);
          },
          TabsContent: function TabsContent(props) {
            props = props || {};
            return React.createElement('div', { className: cnHelper("mt-2 ring-offset-background focus-visible:outline-none", props.className) }, props.children);
          }
        };

        function createFallbackComponent(name) {
          var Fallback = function(props) {
            props = props || {};
            return React.createElement('div', Object.assign({}, props, {
              className: cnHelper("p-1", props.className)
            }), props.children);
          };
          Fallback.displayName = name || 'Component';
          return Fallback;
        }

        // 5. Framer Motion Stubs
        var motionTags = ['div', 'section', 'button', 'span', 'p', 'h1', 'h2', 'h3', 'h4', 'ul', 'li', 'a', 'form', 'nav', 'header', 'footer', 'main', 'article'];
        var motionObject = {};
        motionTags.forEach(function(tag) {
          motionObject[tag] = function MotionComponent(props) {
            props = props || {};
            var domProps = Object.assign({}, props);
            delete domProps.initial;
            delete domProps.animate;
            delete domProps.exit;
            delete domProps.transition;
            delete domProps.whileHover;
            delete domProps.whileTap;
            delete domProps.whileInView;
            delete domProps.viewport;
            return React.createElement(tag, domProps, domProps.children);
          };
        });

        // 6. In-Memory CommonJS Module Registry with Auto-Interop
        var moduleRegistry = {};
        var moduleCache = {};

        function wrapWithInterop(rawExports) {
          if (!rawExports || (typeof rawExports !== 'object' && typeof rawExports !== 'function')) {
            return { default: rawExports };
          }

          return new Proxy(rawExports, {
            get: function(target, prop) {
              if (prop === '__esModule') return true;
              if (prop in target) return target[prop];

              // If default export requested but missing, find first named export
              if (prop === 'default') {
                for (var k in target) {
                  if (typeof target[k] === 'function' || (target[k] && typeof target[k] === 'object')) {
                    return target[k];
                  }
                }
                return target;
              }

              // If named export matches known UI component
              if (typeof prop === 'string' && UIComponents[prop]) {
                return UIComponents[prop];
              }

              // If named export looks like a component (starts with uppercase)
              if (typeof prop === 'string' && /^[A-Z]/.test(prop)) {
                return createFallbackComponent(prop);
              }

              // If helper function requested (e.g. cn)
              if (prop === 'cn' || prop === 'clsx' || prop === 'twMerge') {
                return cnHelper;
              }

              if (prop === 'cva') {
                return cvaHelper;
              }

              return undefined;
            }
          });
        }

        function normalizeSpecifier(spec) {
          var s = String(spec || '').trim();
          while (s.charAt(0) === '.' || s.charAt(0) === '/' || s.charAt(0) === '\\\\') {
            s = s.slice(1);
          }
          if (s.indexOf('@/') === 0) s = s.slice(2);
          if (s.indexOf('src/') === 0) s = s.slice(4);
          s = s.replace(/\\.(tsx|ts|jsx|js)$/i, '');
          return s.toLowerCase();
        }

        function requireModule(specifier) {
          if (specifier === 'react') {
            var r = window.React;
            return Object.assign({ default: r }, r);
          }
          if (specifier === 'react-dom' || specifier === 'react-dom/client') {
            var rd = window.ReactDOM;
            return Object.assign({ default: rd }, rd);
          }
          if (specifier === 'react/jsx-runtime' || specifier === 'react/jsx-dev-runtime') {
            return {
              jsx: React.createElement,
              jsxs: React.createElement,
              Fragment: React.Fragment
            };
          }
          if (specifier === 'lucide-react' || specifier.startsWith('react-icons') || specifier.startsWith('@heroicons')) {
            return UniversalIconProxy;
          }
          if (specifier === 'next/link') {
            return { default: NextLink, Link: NextLink };
          }
          if (specifier === 'next/image') {
            return { default: NextImage, Image: NextImage };
          }
          if (specifier === 'next/font/google') {
            var fontStub = function() { return { className: 'font-sans' }; };
            return new Proxy({}, { get: function() { return fontStub; } });
          }
          if (specifier === 'next/navigation') {
            return {
              useRouter: function() { return { push: function(){}, replace: function(){}, back: function(){}, forward: function(){}, prefetch: function(){} }; },
              usePathname: function() { return '/'; },
              useSearchParams: function() { return new URLSearchParams(); },
              useParams: function() { return {}; },
            };
          }
          if (specifier === 'framer-motion') {
            return {
              motion: motionObject,
              AnimatePresence: function(props) { return props ? props.children : null; }
            };
          }
          if (specifier === 'clsx' || specifier === 'classnames') {
            return { default: cnHelper, clsx: cnHelper };
          }
          if (specifier === 'tailwind-merge') {
            return { default: cnHelper, twMerge: cnHelper };
          }
          if (specifier === '@/lib/utils' || specifier === '../lib/utils' || specifier === './utils' || specifier.endsWith('/utils')) {
            return { default: cnHelper, cn: cnHelper, clsx: cnHelper, twMerge: cnHelper, cva: cvaHelper };
          }

          var clean = normalizeSpecifier(specifier);

          for (var key in moduleRegistry) {
            var normKey = normalizeSpecifier(key);

            if (
              normKey === clean ||
              normKey.endsWith('/' + clean) ||
              clean.endsWith('/' + normKey) ||
              normKey.split('/').pop() === clean.split('/').pop()
            ) {
              if (!moduleCache[key]) {
                var moduleObj = { exports: {} };
                // Guard against circular dependency
                moduleCache[key] = wrapWithInterop(moduleObj.exports);
                moduleRegistry[key](moduleObj, moduleObj.exports, requireModule);
                moduleCache[key] = wrapWithInterop(moduleObj.exports);
              }
              return moduleCache[key];
            }
          }

          // Check if it's a UI component module (e.g. @/components/ui/button)
          var baseName = specifier.split('/').pop() || 'Component';
          var pascalName = baseName.charAt(0).toUpperCase() + baseName.slice(1);
          var comp = UIComponents[pascalName] || createFallbackComponent(pascalName);
          var dynamicUIModule = Object.assign({ default: comp, [pascalName]: comp, [baseName]: comp }, UIComponents);
          return wrapWithInterop(dynamicUIModule);
        }

        // 7. Compile all files with Babel using 'env', 'react', 'typescript' presets
        var compileErrors = [];
        files.forEach(function(file) {
          if (file.path.endsWith('.css') || file.name.endsWith('.css')) return;
          try {
            var src = file.code || '';
            // Remove Next.js / React Server Component directives
            src = src.replace(/["']use client["'];?/g, '');
            src = src.replace(/["']use server["'];?/g, '');

            // Transpile using Babel Standalone with CommonJS transformation
            var transpiled = Babel.transform(src, {
              presets: [
                ['env', { modules: 'commonjs' }],
                ['react', { runtime: 'classic' }],
                'typescript'
              ],
              filename: file.name
            }).code;

            moduleRegistry[file.path] = new Function('module', 'exports', 'require', transpiled);
          } catch (compErr) {
            console.error('File compile error for ' + file.path + ':', compErr);
            compileErrors.push(file.path + ': ' + compErr.message);
          }
        });

        // 8. React Error Boundary Component
        class PreviewErrorBoundary extends React.Component {
          constructor(props) {
            super(props);
            this.state = { hasError: false, error: null, errorInfo: null };
          }
          static getDerivedStateFromError(error) {
            return { hasError: true, error: error };
          }
          componentDidCatch(error, errorInfo) {
            this.setState({ errorInfo: errorInfo });
            console.error('Preview Runtime Error:', error, errorInfo);
          }
          render() {
            if (this.state.hasError) {
              return React.createElement('div', { className: 'min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans' },
                React.createElement('div', { className: 'max-w-xl w-full bg-white rounded-2xl border border-red-200 p-6 shadow-xl' },
                  React.createElement('div', { className: 'flex items-center gap-2 text-red-600 font-bold text-base mb-2' },
                    React.createElement('span', null, '⚠️'),
                    React.createElement('span', null, 'Component Render Error')
                  ),
                  React.createElement('p', { className: 'text-sm text-slate-700 font-medium mb-3' }, this.state.error && this.state.error.message ? this.state.error.message : 'An error occurred while rendering component.'),
                  this.state.error && this.state.error.stack ? React.createElement('div', { className: 'bg-slate-900 rounded-xl p-3 overflow-x-auto text-xs font-mono text-red-300 whitespace-pre-wrap' }, this.state.error.stack) : null
                )
              );
            }
            return this.props.children;
          }
        }

        // 9. Resolve Root Component
        var rootCandidate = files.find(function(f) {
          var p = f.path.toLowerCase();
          return p === 'app/page.tsx' || p === 'page.tsx' || p.endsWith('/page.tsx') || p === 'pages/index.tsx' || p === 'app.tsx' || p === 'src/app.tsx';
        }) || files.find(function(f) {
          return !f.path.endsWith('.css') && !f.name.endsWith('.css') && !f.path.toLowerCase().includes('layout');
        }) || files[0];

        if (!rootCandidate) {
          window.showError('Could not find root page component.');
          return;
        }

        var rootModule = requireModule(rootCandidate.path);
        var RootComponent = rootModule.default || rootModule.Page || rootModule.Home || rootModule.App || rootModule.HomePage || rootModule.Main || (typeof rootModule === 'function' ? rootModule : null);

        if (!RootComponent) {
          window.showError('Root component in ' + rootCandidate.path + ' could not be resolved.', 'Exports: ' + Object.keys(rootModule).join(', '));
          return;
        }

        // 10. Mount Component to Root DOM
        var rootEl = document.getElementById('root');
        var appElement = React.createElement(PreviewErrorBoundary, null, React.createElement(RootComponent));

        if (ReactDOM.createRoot) {
          var root = ReactDOM.createRoot(rootEl);
          root.render(appElement);
        } else {
          ReactDOM.render(appElement, rootEl);
        }

      } catch (err) {
        console.error('Mounting error:', err);
        window.showError(err.message, err.stack);
      }
    })();
  </script>
</body>
</html>`;
}
