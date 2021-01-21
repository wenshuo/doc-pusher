const path = require('path');
const autoprefixer = require('autoprefixer');

 // Export a function. Accept the base config as the only param.
module.exports = ({ config, mode }) => {
  // `mode` has a value of 'DEVELOPMENT' or 'PRODUCTION'
  // You can change the configuration based on that.
  // 'PRODUCTION' is used when building the static version of storybook.

  // Make whatever fine-grained changes you need
  config.module.rules.push({
    test: /\.scss$/,
    exclude: /\.(module\.scss|module\.css)$/,
    use: [
      'style-loader',
      'css-loader',
      'resolve-url-loader',
      {
        loader: 'postcss-loader',
        options: {
          plugins: [autoprefixer]
        }
      },
      {
        loader: 'sass-loader',
        options: {
          sourceMap: true
        }
      },
      {
        loader: 'sass-resources-loader',
        options: {
          resources: [
            require.resolve('cui/src/css/settings/_index.scss'),
            require.resolve('cui/src/css/helpers/_index.scss'),
            './src/styles/settings/_index.scss',
            './src/styles/helpers/_index.scss'
          ]
        }
      }
    ]
  });

  config.module.rules.push({
    test: /\.(module\.scss)$/,
    use: [
      'style-loader',
      {
        loader: 'css-loader',
        options: {
          modules: {
            localIdentName: '[name]__[local]--[contenthash:base64:5]'
          },
          importLoaders: 1
        }
      },
      'resolve-url-loader',
      {
        loader: 'postcss-loader',
        options: {
          plugins: [autoprefixer]
        }
      },
      {
        loader: 'sass-loader',
        options: {
          sourceMap: true
        }
      },
      {
        loader: 'sass-resources-loader',
        options: {
          resources: [
            require.resolve('cui/src/css/settings/_index.scss'),
            require.resolve('cui/src/css/helpers/_index.scss'),
            './src/styles/settings/_index.scss',
            './src/styles/helpers/_index.scss'
          ]
        }
      }
    ]
  });

  config.module.rules.push({
    test: /\.jsx$/,
    use: [
      require.resolve('@storybook/source-loader'),
      {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env', '@babel/preset-react']
        }
      }
    ],
    exclude: /node_modules/,
    enforce: 'pre',
  });

  config.resolve.modules.push(path.resolve(__dirname, '../node_modules'));
  config.resolve.modules.push(path.resolve(__dirname, '../../../node_modules'));

  // Return the altered config
  return config;
};
