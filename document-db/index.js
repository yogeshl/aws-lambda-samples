
const docDB = require("./mongo-db");
const mongoose = require('mongoose');
const employee = mongoose.model('employee');

exports.handler = function (event, context, callback) {
    
  context.callbackWaitsForEmptyEventLoop = false;    
    
  console.log('Body:', event.body);
  console.log('Method:', event.method);
  console.log('Query:', event.query);

   switch (event.method) {
    
        case 'GET':
                getData(event.query.email);
             break
        case 'POST':
             updateData (event.body );
             break;
    }

    function getData (userId, email){
    
        docDB.getConnection()
          .then(db => {
                employee.findOne({ email: email}, (err, data) => {
                    if (err) {
                        return callback(null,{statusCode: 500, message: 'Error while fetching data.'});
                    }
                return callback(null,{statusCode: 200, message: data});
                });
            })
            .catch(err => {
                    console.log("an error occured : ", err);
                    return callback(null,{statusCode: 400, message: 'Response Error'});
            });
    }
    
    function updateData (payload){
    
        docDB.getConnection() 
          .then(db => {
                employee.updateOne({ email: payload.email }, { age: payload.age, updatedOn: Date.now() }, (err, data) => {
                  if (err) {
                      return callback(null,{statusCode:500, message: "Error while updating data." });
                  }
                return callback(null,{statusCode:200,message:"Updated successfully"});
            });
        })
        .catch(err => {
            console.log("an error occured : ", err);
            return callback(null,{statusCode: 400, message: 'Response Error'});
        });
    }
};

