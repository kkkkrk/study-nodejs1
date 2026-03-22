const express = require('express')
const app = express()

app.use(express.static(__dirname + '/public'))
app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.urlencoded({extended:true}))

const {MongoClient} = require('mongodb');

let db;
const url = 'mongodb+srv://admin:dudwns123@cluster0.hs2mcpz.mongodb.net/?appName=Cluster0';
new MongoClient(url).connect().then((client)=>{
    console.log('DB 연결 성공');
    db = client.db('forum');
    app.listen(8080, () => {
    console.log('http://localhost:8080 에서 서버 실행중')
})}).catch((err)=>{
    console.log(err);
})
app.get('/', (요청, 응답)=>{
    응답.sendFile(__dirname + '/index.html')
})
app.get('/news', (요청, 응답)=>{
    db.collection('post').insertOne({title:'어쩌구'});
    응답.send('오늘 비옴')
})
app.get('/about', (요청, 응답)=>{
    응답.sendFile(__dirname + '/introduce.html')
})
app.get('/list', async (요청, 응답)=>{
    let result = await db.collection('post').find().toArray()
    응답.render('list.ejs',{글목록: result})
})
app.get('/write', (요청, 응답)=>{
    응답.render('write.ejs')
})
app.post('/add', async (요청, 응답) => {
    try{
    if(요청.body.title == ''){
        응답.send("제목 입력 안 함");
    } else if(요청.body.content == ''){
        응답.send("내용 입력 안 함");
    }
    else{
        await db.collection('post').insertOne({title: 요청.body.title, content: 요청.body.content})
        응답.redirect('/list')
    }
    } catch(e) {
        console.log(e)
        응답.status(500).send('서버에러 남')
    }
})
