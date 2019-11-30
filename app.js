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



app.get('/api/:table',(req,res)=>{
    const {table} = req.params
    console.log(table);
   
    sql.connect(config).then(pool => {
        // Query
        return pool.request()
            
            .query(`select * from ${table}`)
    }).then(result => {
        console.log(result.recordset);
        res.send(result.recordset);
    }).catch(err => {
      console.log(err);
    });

    
});
app.post('/api/:table',(req,res)=>{
    const {table} = req.params;
    console.log(req.body);
    const {body} = req.body;
    var  query = {}
    if(table === 'MenuItems'){
        let {GroupCode,Barcode,Tag,CustomTags,Name,ItemType} = body;
        query = {query:`insert into MenuItems (GroupCode,Barcode,Tag,CustomTags,Name,ItemType) values ('${GroupCode}', '${Barcode}', '${Tag}', '${CustomTags}', '${Name}',1)`}
    }
    else if(table === 'MenuItemPortions'){
        let {Name,Multiplier,MenuItemId} = body;
        query = {query:`insert into MenuItemPortions (Name,Multiplier,MenuItemId) values ('${Name}',${Multiplier} ${MenuItemId})`};
    }
    else if(table === 'MenuItemPrices'){
        let {PriceTag,Price,MenuItemPortionId} = body;
        query = {query:`insert into MenuItemPrices (PriceTag,Price,MenuItemPortionId) values ('${PriceTag}', ${Price},${MenuItemPortionId})`};
    }
    
    console.log(query);
    
    console.log('OK');
    console.log(table);
    
    sql.connect(config).then(pool => {
        // Query
         return pool.request()
        .query(query)
        .then((result) => {
                console.log(result);
            }).catch(err=>{
                console.log(err);
           });
    }); 
    res.send({satus:"ERR"});
});
app.put('/api/:id',(req,res)=>{
    console.log(req)
    res.send({type:"POST"});
});
app.delete('/api/:id',(req,res)=>{
    console.log(req.params.id);

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
