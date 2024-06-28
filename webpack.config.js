const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = {
  // Opciones de configuración de Webpack si las tienes

  plugins: [
    // Otros plugins que puedas tener
    new CopyWebpackPlugin({
      patterns: [
        { from: path.resolve(__dirname, 'src/templates'), to: 'templates' },
      ],
    }),
  ],
};
