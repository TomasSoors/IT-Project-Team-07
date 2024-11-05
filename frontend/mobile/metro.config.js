// mobile/metro.config.js
const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

module.exports = (async () => {
  const {
    resolver: { sourceExts, assetExts },
  } = await getDefaultConfig(__dirname);

  return {
    resolver: {
      assetExts: assetExts.filter(ext => ext !== 'svg'),
      sourceExts: [...sourceExts, 'svg'],
      nodeModulesPaths: [
        path.resolve(__dirname, 'node_modules'),
        path.resolve(__dirname, '../shared'), // Toegang tot de shared folder
      ],
    },
    watchFolders: [path.resolve(__dirname, '../shared')], // Voeg de shared folder toe aan watchFolders
  };
})();
