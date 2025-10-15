const webpack = require('webpack');
const config = require('./webpack.config.js');

// Set production mode
config.mode = 'production';

// Optimize for production
config.optimization = {
  minimize: true,
  splitChunks: {
    chunks: 'all',
  },
};

const compiler = webpack(config);

compiler.run((err, stats) => {
  if (err) {
    console.error('Build failed:', err);
    process.exit(1);
  }

  if (stats.hasErrors()) {
    console.error('Build completed with errors:');
    console.error(stats.toString({ colors: true, errors: true, warnings: false }));
    process.exit(1);
  }

  console.log('Build completed successfully!');
  console.log(stats.toString({ colors: true, chunks: false, modules: false }));
});