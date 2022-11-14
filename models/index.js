const dbConfig = require('../config/dbConfig.js');

const {Sequelize, DataTypes} = require('sequelize');

const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD, {
        host: dbConfig.HOST,
        dialect: dbConfig.dialect,
        operatorsAliases: false,

        pool: {
            max: dbConfig.pool.max,
            min: dbConfig.pool.min,
            acquire: dbConfig.pool.acquire,
            idle: dbConfig.pool.idle

        }
    }
)

sequelize.authenticate()
.then(() => {
    console.log('connected..')
})
.catch(err => {
    console.log('Error'+ err)
})

const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize

db.users = require('./User.js')(sequelize, DataTypes)
db.phones = require('./Phone.js')(sequelize, DataTypes)

db.sequelize.sync({ force: false })
.then(() => {
    console.log('re-sync')
})

db.users.hasMany(db.phones, {
    foreignKey: 'user_id',
    as: 'phone'
})

db.phones.belongsTo(db.users, {
    foreignKey: 'user_id',
    as: 'user'
})

module.exports = db
