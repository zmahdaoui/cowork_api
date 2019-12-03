module.exports = {
  apps : [{
    name: 'API_COWORK',
    script: 'app.js',

    env: {
      NODE_ENV: 'development',
      API_KEY: 'MY_SECRET_KEY',
      EMAIL: 'mh-zakarya@hotmail.fr',
      PASSWORD: '789456123qwq'
    },
    env_production: {
      NODE_ENV: 'production',
      API_KEY: 'MY_SECRET_KEY',
      EMAIL: 'mh-zakarya@hotmail.fr',
      PASSWORD: '789456123qwq'
    }
  }],

  deploy : {
    production : {
      user : 'node',
      host : '212.83.163.1',
      ref  : 'origin/master',
      repo : 'git@github.com:repo.git',
      path : '/var/www/production',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production'
    }
  }
};
