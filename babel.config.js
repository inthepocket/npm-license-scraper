const presets = [
  "@babel/preset-typescript",
  [
    "@babel/env",
    {
      targets: {
        node: true,
      }
    },
  ],
];

module.exports = { presets };
