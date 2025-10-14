export default {
  testEnvironment: "node",
  transform: {}, // Disable Babel transforms since Node supports ESM
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1", // correct key name
  },
};
