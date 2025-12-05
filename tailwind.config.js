/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // 🌙 Enable Dark Mode using class strategy

  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Scan all files for Tailwind classes
  ],

  theme: {
    extend: {
      colors: {
        // Optional: You can extend theme with custom colors if needed
      },

      // Smooth transition for dark/light theme
      transitionProperty: {
        theme: "background-color, color, border-color",
      },
    },
  },

  plugins: [],
};
