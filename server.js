const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const Bear = require('./Bears/BearModel.js'); 

const server = express();

server.use(bodyParser.json());

server.get('/', function(req, res){
    res.status(200).json({ message: 'API running'});
});

server.post('/api/bears', (req, res) => {
    const bearInfo = req.body;

    if (!bearInfo.species || !bearInfo.latinName) {
        res.status(400).json({errorMessage : 'there is an error'});
    } else {
        const bear = new Bear(bearInfo);

        bear.save() // returns promise
            .then(function(newBear) {
                res.status(201).json(newBear);
            })
            .catch(function(error) {
                res.status(500).json({error: 'bear did not save'});
            });
    }
});

server.get('/api/bears', function(req, res) {
    Bear.find({})
        .then(function(bear) {
            res.status(200).json(bear);
        })
        .catch(function(error) {
            res.status(500).json({error: 'Error retreiving bears'})
        });

    res.status(200).json(bear);
})

server.get('/api/bears/:id', function(req, res) {
    const { id } = req.params;

    Bear.findById(id)
        .then(function(bear) {
            res.status(200).json(bear)
        })
        .catch(function(error) {
            res.status(500).json({error: 'there is an error'})
        });
})

// db related plumbin code
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/bears', { useMongoClient: true })
    .then(function() {
        server.listen(5000, function() {
        console.log('All your databases belong to us');
        });
    })
    .catch(function(error) {
        console.log('Database connection failed');
    });


// [API] <> [mongoose] <translate between objects and json>