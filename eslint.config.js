import js from "@eslint/js";

export default [
    js.configs.recommended,
    {
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: "module",
            globals: {
                window: "readonly",
                document: "readonly",
                localStorage: "readonly",
                fetch: "readonly",
                setTimeout: "readonly",
                clearTimeout: "readonly",
                console: "readonly",
                requestAnimationFrame: "readonly",
                IntersectionObserver: "readonly",
                performance: "readonly",
                Math: "readonly",
                Object: "readonly",
                Date: "readonly",
                JSON: "readonly",
                Array: "readonly",
                parseFloat: "readonly",
                parseInt: "readonly",
                Promise: "readonly",
                Chart: "readonly",
                THREE: "readonly",
                tsParticles: "readonly",
                location: "readonly",
                ResizeObserver: "readonly"
            }
        },
        rules: {
            "no-unused-vars": "warn",
            "no-undef": "error"
        }
    }
];
