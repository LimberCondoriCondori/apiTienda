var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
//var usersRouter = require('./routes/users');
var usersRouter = require('./routes/api/users');
var productRouter = require('./routes/api/product');
var citaRouter =require('./routes/api/cita');
var chatRouter = require('./routes/api/chat');
var compraRouter = require('./routes/api/compra');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/product', productRouter);
app.use('/compra', compraRouter); 
app.use('/cita',citaRouter);
app.use("/chat",chatRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
var port = 8001;
app.listen(port,()=>{
  console.log("corriendo en el puerto" + port);
})
//parte del chat para el servicio
const appSocket=require("express")();
var serverSocketIO=appSocket.listen(8002,()=>{
  console.log("socket corriendo en el puerto: "+8002);
});
const socketIO=require("socket.io");
const IO=socketIO(serverSocketIO);
const chatCtl=require('./routes/api/chatController');
IO.on('connection',(mysocket)=>{
  console.log("usuario conectado");
  //IO.emit("5d27aaeb2602945efbb5fc87",{msn:"hello",idUser:"5d27aaeb2602945efbb5fc87"}); 
  mysocket.on("msnserver",async(docs)=>{
    //console.log(docs);
    let resultm=chatCtl.setMessage(docs);
    var chat=await chatCtl.get({_id:docs.idChat});
    //console.log(resultm);
      IO.emit(chat[0].idComprador,resultm);
      IO.emit(chat[0].idVendedor,resultm);
  });
  mysocket.on("showMsn",(data)=>{
    chatCtl.updateMessage(data);
  });
});


//fin parte chat servicio
module.exports = app;
