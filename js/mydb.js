var mysql = require('C:\\nodejs\\node_modules\\mysql');
var util = require('util');

module.exports = {
    connection: null,
    // Create a database connection
    connectDB: function () {
        var connectionConfig = {
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'orderdb'
        };
        connection = mysql.createConnection(connectionConfig);
        util.log('connection::connecting...');
        connection.connect(function (err) {
            util.log('connection::connected');
        });
    },
    // Get pizzas
    getPizzas: function (res, callback) {
        connection.query('SELECT * FROM PizzaDetails', function (err, rows, fields) {
            if (err)
                throw err;

            var pizzas = [];
            rows.forEach(function (row) {
                var pizza = {TypeOfPizza: row.TypeOfPizza, SizeOfPizza: row.SizeOfPizza,
                    extra:row.extra, qty:row.qtyqty};
                pizzas.push(pizza);
            });

            util.log('getPizzas: ' + pizzas);
            callback(res, pizzas);
        });
    },
    // Add pizza
    insertPizza: function (TypeOfPizza, SizeOfPizza, extra,qty) {
        var pizza = {TypeOfPizza: TypeOfPizza, SizeOfPizza: SizeOfPizza, extra: extra,qty:qty};
        connection.query('INSERT INTO PizzaDetails SET ?', pizza, function (err, results) {
            if (err)
                throw err;

            util.log('insertPizza: ' + results);
        });
    },
    updatePizza: function (TypeOfPizza, SizeOfPizza, extra,qty, PizzaID) {
        var pizza = {TypeOfPizza: TypeOfPizza, SizeOfPizza: SizeOfPizza, extra: extra,qty:qty};
        connection.query('UPDATE PizzaDetails SET ? WHERE PizzaID = ?', [pizza, PizzaID], function (err, results) {
            if (err)
                throw err;

            util.log('updatePizza: ' + results);
        });
    },
    deletePizza: function () {
        connection.query('DELETE FROM PizzaDetails ', function (err, results) {
            if (err)
                throw err;

            util.log('deletePizza: ' + results);
        });
    },

    // Get pizza
    getPizza: function (res, TypeOfPizza, SizeOfPizza, extra, callback) {
        connection.query("SELECT * FROM PizzaDetails WHERE TypeOfPizza = ? AND SizeOfPizza=? \n\
            AND extra = ?", TypeOfPizza,SizeOfPizza,extra, function (err, rows, fields) {
            if (err)
                throw err;

            var pizzas = [];
            rows.forEach(function (row) {
                var pizza = {UserID: row.UserID, LastName: row.LastName, FirstName: row.FirstName, EmailAddress: row.emailAddress};
                pizzas.push(pizza);
                //return true;
            });

            util.log('getPizza: ' + pizzas);
            callback(res, pizzas);
        });
    },
    updateTotal: function (grandTotal) {
        
        connection.query('UPDATE Orders SET grandTotal = ? ', grandTotal, function (err, results) {
            if (err)
                throw err;

            util.log('updateTotal: ' + results);
        });
    },

    updatePizzas: function (noOfPizza) {
        
        connection.query('UPDATE Orders SET noOfPizza = ? ', noOfPizza, function (err, results) {
            if (err)
                throw err;

            util.log('updatePizzas: ' + results);
        });
    },
    deleteOrder: function () {
        connection.query('DELETE FROM Orders ', function (err, results) {
            if (err)
                throw err;

            util.log('deletePizza: ' + results);
        });
    },
insertOrder: function (grandTotal,noOfPizza) {
        var order = { grandTotal: grandTotal, noOfPizza: noOfPizza};
        connection.query('INSERT INTO Orders SET ?', order, function (err, results) {
            if (err)
                throw err;

            util.log('insertPizza: ' + results);
        });
    }
};
