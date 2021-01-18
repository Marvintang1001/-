

export default {
    db : [
        {
            'name' : 'mongo',
            'type' : 'mongodb',
            'host' : 'localhost',
            'port' : 27017,
            'database' : 'inventory',
            'entities' : ['dist/domain/**/repository/mongo.js'],
        },
    ],
};
