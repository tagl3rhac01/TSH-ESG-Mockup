import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,wght@0,200..1000;1,200..1000&family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
        <script id="tailwind-config" dangerouslySetInnerHTML={{
          __html: `
            tailwind.config = {
                darkMode: "class",
                theme: {
                    extend: {
                        "colors": {
                            "primary": "var(--primary)",
                            "on-primary": "var(--on-primary)",
                            "primary-container": "var(--primary-container)",
                            "on-primary-container": "var(--on-primary-container)",
                            "secondary-container": "var(--secondary-container)",
                            "on-secondary-container": "var(--on-secondary-container)",
                            "background": "var(--background)",
                            "surface": "var(--surface)",
                            "surface-dim": "var(--surface-dim)",
                            "surface-container": "var(--surface-container)",
                            "surface-container-low": "var(--surface-container-low)",
                            "surface-container-high": "var(--surface-container-high)",
                            "surface-container-highest": "var(--surface-container-highest)",
                            "on-surface": "var(--on-surface)",
                            "on-surface-variant": "var(--on-surface-variant)",
                            "outline": "var(--outline)",
                            "outline-variant": "var(--outline-variant)",
                            "inverse-surface": "#322f35",
                            "inverse-on-surface": "#f5eff7",
                            "error": "#ba1a1a",
                            "error-container": "#ffdad6",
                            "on-error": "#ffffff",
                            "on-error-container": "#93000a",
                            "tertiary": "#765b00",
                            "tertiary-container": "#c9a74d",
                            "on-tertiary-container": "#503d00"
                        },
                        "borderRadius": {
                            "DEFAULT": "0.25rem",
                            "lg": "0.5rem",
                            "xl": "0.75rem",
                            "full": "9999px"
                        },
                        "spacing": {
                            "container-padding": "24px",
                            "element-tight": "8px",
                            "max-width": "1600px",
                            "grid-columns": "12",
                            "card-gap": "16px",
                            "unit": "4px"
                        },
                        "fontFamily": {
                            "display-lg": ["Nunito Sans"],
                            "label-caps": ["Nunito Sans"],
                            "body-md": ["Nunito Sans"],
                            "data-table": ["JetBrains Mono"],
                            "headline-sm": ["Nunito Sans"],
                            "headline-md": ["Nunito Sans"],
                            "body-sm": ["Nunito Sans"]
                        },
                        "fontSize": {
                            "display-lg": ["32px", {"lineHeight": "40px", "letterSpacing": "-0.02em", "fontWeight": "800"}],
                            "label-caps": ["11px", {"lineHeight": "16px", "letterSpacing": "0.05em", "fontWeight": "700"}],
                            "body-md": ["14px", {"lineHeight": "20px", "fontWeight": "400"}],
                            "data-table": ["13px", {"lineHeight": "16px", "fontWeight": "500"}],
                            "headline-sm": ["18px", {"lineHeight": "24px", "fontWeight": "600"}],
                            "headline-md": ["24px", {"lineHeight": "32px", "fontWeight": "700"}],
                            "body-sm": ["13px", {"lineHeight": "18px", "fontWeight": "400"}]
                        }
                    },
                }
            }
          `
        }} />
        <style dangerouslySetInnerHTML={{
          __html: `
            .material-symbols-outlined {
                font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
                vertical-align: middle;
            }
            .custom-scrollbar::-webkit-scrollbar { width: 4px; }
            .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
            .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbc4d2; border-radius: 10px; }
            .zebra-table tr:nth-child(even) {
                background-color: #f8fafc;
            }
            .status-dot {
                width: 6px;
                height: 6px;
                border-radius: 50%;
                display: inline-block;
                margin-right: 8px;
            }
            .status-pill {
                padding: 2px 8px;
                border-radius: 9999px;
                display: inline-flex;
                align-items: center;
                font-size: 11px;
                font-weight: 700;
                text-transform: uppercase;
            }
            .no-scrollbar::-webkit-scrollbar {
                display: none;
            }
            .no-scrollbar {
                -ms-overflow-style: none;
                scrollbar-width: none;
            }
          `
        }} />
      </Head>
      <body className="font-body-md text-on-surface">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
