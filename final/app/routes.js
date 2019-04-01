
//get video, tags and beats for post from database
app.get('/', (req, res) => {
  //console.log(db)
  db.collection('fruits').find().toArray((err, result) => {
    if (err) return console.log(err)
    res.render('index.ejs', {fruits: result})
  })
})

//post a new video with its respective tags to the database
app.post('/fruits', (req, res) => {
  db.collection('fruits').save({fruit: req.body.fruit, thumbUp: 0, thumbDown:0}, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/')
  })
})

//update additional tags added, and songs submitted by producers
app.put('/fruits', (req, res) => {
  db.collection('fruits')
  .findOneAndUpdate({fruit: req.body.fruit}, {
    $set: {
      thumbUp:req.body.thumbUp + 1
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})

//delete video tags and songs from (entire post) from database
app.delete('/fruits', (req, res) => {
  db.collection('fruits').findOneAndDelete({fruit: req.body.fruit}, (err, result) => {
    if (err) return res.send(500, err)
    res.send('Message deleted!')
  })
})
