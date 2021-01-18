

export default {
    db : [
        {
            'name' : 'mysql',
            'type' : 'mysql',
            'host' : 'localhost',
            'username' : 'root',
            'password' : '1234',
            'database' : 'inventory',
            'entities' : ['dist/domain/**/repository/mysql.js'],
        },
    ],
};
