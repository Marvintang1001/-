

export default {
    db : [
        {
            'name' : 'postgres',
            'type' : 'postgres',
            'host' : 'localhost',
            'port' : 5432,
            'username' : 'admin',
            'password' : 'app',
            'database' : 'anniversary',
            'entities' : ['dist/domain/**/repository/postgres.js'],
            'migrations' : ['dist/migration/*.js'],
            'cli' : {'migrationsDir' : 'src/migration'},
        },
    ],
};
