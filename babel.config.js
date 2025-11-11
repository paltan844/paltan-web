module.exports = {
  presets: [
    'module:metro-react-native-babel-preset',
    '@babel/preset-react',
  ],
  plugins: [
    'react-native-reanimated/plugin',  // Reanimated 3 animations support
    [
      'module-resolver',               // Aliases define karne ke liye
      {
        root:['./src'],
        alias:{
          '@assets':'./src/assets',
          '@features':'./src/features',
          '@navigation':'./src/navigation',
          '@components':'./src/components',
          '@styles':'./src/styles',
          '@service':'./src/service',
          '@state':'./src/state',
          '@utils':'./src/utils',
        },
      },
    ],
  ],
};
