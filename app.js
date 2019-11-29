const express = require('express');
const bodyParser = require('body-parser')
const sql = require('mssql');
const app = express();


const port = process.env.PORT || 4000;

app.use(bodyParser.json());

const config = {
    user: 'samba',
    password: 'Anka1234',
    server: 'samba.database.windows.net', // You can use 'localhost\\instance' to connect to named instance
    database: 'neptune_test',
    port:1433,
    encrypt: true
}



app.get('/api',(req,res)=>{
    const {table} = req.body
    console.log(table);
   
    sql.connect(config).then(pool => {
        // Query
        return pool.request()
            
            .query(`select * from ${table}`)
    }).then(result => {
        console.log(result.output);
        res.send(result);
    }).catch(err => {
      console.log(err);
    });

    
});
app.post('/api',(req,res)=>{
    const {table, GroupCode, Barcode, Tag, CustomTags, ItemType, Name} = req.body;
    console.log(req.body);
    console.log('OK');
    //console.log(table);
    //
    //sql.connect(config).then(pool => {
    //    // Query
    //    return pool.request()
    //    .query(`insert into MenuItems (GroupCode, Barcode, Tag, CustomTags, ItemType, Name) values ('${GroupCode}', '${Barcode}', '${Tag}', '${CustomTags}', ${ItemType}, '${Name}')`)
    //    .then((result) => {
    //            res.send({status:'OK'});
    //        }).catch(err=>{
    //            res.send({status:'ERROR'}
    //        )});
    //}); 
    res.send(req.body);
});
app.put('/api/:id',(req,res)=>{
    console.log(req)
    res.send({type:"POST"});
});
app.delete('/api/:id',(req,res)=>{
    console.log(req.params.id);
    console.log(req.params.d);
    const {table} = req.body;
    const {id} = req.params;
    sql.connect(config).then(pool => {
        // Query
        return pool.request()
        .query(`DELETE FROM ${table} WHERE Id = ${id}`)
        .then((result) => {
            
                res.send({status:'OK'});
            }).catch(err=>{
                res.send({status:'ERROR'}
            )});
    }); 
});
 

 
sql.on('error', err => {
    console.log(err);
})

app.listen(port);
console.log('You are listening to port 4000');