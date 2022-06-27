var express = require('express');
const { readdirSync } = require('fs');
var app = express()
var mongodb = require('mongodb');
app.set('view engine', 'hbs')
app.use(express.urlencoded({
    extended: true
}))

var MongoClient = require('mongodb').MongoClient
var url = 'mongodb://localhost:27017'

app.get('/', async(req, res) => {
    let server = await MongoClient.connect(url)
    let dbo = server.db("Student")
    let students = await dbo.collection('student').find().toArray()
    let grades = await dbo.collection('grade').find().toArray()

    res.render('home', {'students': students,'grades':grades})
})

app.post('/search',async (req,res)=>{
    let name = req.body.txtName
    let server = await MongoClient.connect(url)
    let dbo = server.db("Student")
    let result = await dbo.collection('student').find({'name':name}).toArray()
    if(result==0){
        res.write('Not found')
        res.end()
    }else{
        let firstStudent=result[0]
        var a = firstStudent.name
        // console.log(firstStudent._id)
        let result2=await dbo.collection('grade').find({'std_id':firstStudent._id}).toArray()
        // console.log(result2[0].mark)
        
        var b = result2[0].mark

    }
    res.render('home',{'name':a,'mark':b})
})

const PORT = process.env.PORT || 5000
app.listen(PORT)
console.log('server is running')