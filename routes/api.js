const express = require('express');
const sql = require('mssql');

const router = express.Router();

const config = {
    user: 'samba',
    password: 'Anka1234',
    server: 'samba.database.windows.net', // You can use 'localhost\\instance' to connect to named instance
    database: 'jesse3',
    port:1433,
    encrypt: true
}

router.get('/api/menu/:table',(req,res)=>{
    const {table} = req.params
   
    sql.connect(config).then(pool => {
        // Query
        return pool.request()
            
            .query(`select * from ${table}`)
    }).then(result => {
        res.send(result.recordset);
    }).catch(err => {
      console.log(err);
    });

    
});
router.post('/api/menu/:table',(req,res)=>{
    const {table} = req.params;
    const {body} = req.body;
    var  query = {}
    if(table === 'MenuItems'){
        let {GroupCode,Barcode,Tag,CustomTags,Name,ItemType} = req.body;
        query=`insert into MenuItems (GroupCode,Barcode,Tag,CustomTags,Name,ItemType) values ('${GroupCode}', '${Barcode}', '${Tag}', '', '${Name}',1)`;
    }
    else if(table === 'MenuItemPortions'){
        let {Name,Multiplier,MenuItemId} = req.body;
        query=`insert into MenuItemPortions (Name,Multiplier,MenuItemId) values ('${Name}',${Multiplier}, ${MenuItemId})`;
    }
    else if(table === 'MenuItemPrices'){
        let {PriceTag,Price,MenuItemPortionId} = req.body;
        query=`insert into MenuItemPrices (PriceTag,Price,MenuItemPortionId) values ('${PriceTag}', ${Price},${MenuItemPortionId})`;
    }  
    else if(table === 'ScreenMenuItems'){
        let {Name,Appearance,ScreenMenuCategoryId,MenuItemId,SortOrder,AutoSelect,Quantity} = req.body;
        query=`insert into ScreenMenuItems (Name,Appearance,ScreenMenuCategoryId,MenuItemId,SortOrder,AutoSelect,Quantity,FontSize) values ('${Name}',0,${ScreenMenuCategoryId},${MenuItemId},0,'False',1,16)`;
    }
    
    
    sql.connect(config).then(pool => {
        // Query
         return pool.request()
        .query(query)
        .then((result) => {
            sql.connect(config).then(pool => {
                // Query
                 return pool.request()
                .query("SELECT TOP 1 * FROM MenuItems ORDER BY ID DESC")
                .then((result) => {
                        if(table !=='ScreenMenuItems')
                        res.send(result);
                        console.log(result);
                    }).catch(err=>{
                        console.log(err);
                   });
            }); 
	
            }).catch(err=>{
                console.log(err);
           });
    }); 
    if(table === 'ScreenMenuItems'){
        res.send({add:'OK'})
    }
});
router.put('/api/menu/:id',(req,res)=>{
  
    res.send({type:"POST"});
});
router.delete('/api/menu/:id',(req,res)=>{
    

    const {table} = req.body;
    const {id} = req.params;
    sql.connect(config).then(pool => {
        // Query
        return pool.request()
        .query(`DELETE FROM ${table} WHERE Id = ${id}`)
        .then((result) => {
            
                res.send(result);
            }).catch(err=>{
                res.send({status:'ERROR'}
            )});
    }); 
});
 
router.get('/api/daily',(req,res)=>{
    
   
   
    sql.connect(config).then(pool => {
        // Query
        return pool.request()
            
            .query(`SELECT CAST(Date AS DATE) as date,sum(totalAmount) As total FROM [dbo].[Tickets] group by CAST(Date as DATE)`)
                }).then(result => {
                
                res.send(result.recordset);
                }).catch(err => {
                  console.log(err);
                });

    
});

router.get('/api/bestSeller',(req,res)=>{
    
   
   
    sql.connect(config).then(pool => {
        // Query
        return pool.request()
            
            .query(`select menuItemName,sum(quantity) as total from orders group by MenuItemName order by sum(quantity) desc`)
                }).then(result => {
                res.send(result.recordset);
                }).catch(err => {
                  console.log(err);
                });

    
});

router.get('/api/screenMenuCategories',(req,res)=>{

    sql.connect(config).then(pool => {
        // Query
        return pool.request()
            
            .query(`SELECT * FROM [dbo].[ScreenMenuCategories]`)
                }).then(result => {
                res.send(result.recordset);
                }).catch(err => {
                  console.log(err);
                });

    
});
 
sql.on('error', err => {
    console.log(err);
})

module.exports=router; 