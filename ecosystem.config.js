module.exports = {
  apps: [
    {
      name: 'fiamasam',
      script: 'server.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      // Gestion des logs
      log_file: './logs/combined.log',
      out_file: './logs/out.log',
      error_file: './logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm Z',
      
      // Redémarrage automatique
      watch: false,
      max_memory_restart: '1G',
      restart_delay: 4000,
      
      // Variables d'environnement spécifiques
      env_vars: {
        NODE_OPTIONS: '--max-old-space-size=4096'
      }
    }
  ]
};
