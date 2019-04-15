module.exports = function(app, passport, db) {

// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    // app.get('/test', function(req, res) {
    //     res.render('test.ejs');
    // });

    // PROFILE SECTION =========================
    //all urls app can reach/ end points ' profile'


    app.get('/test', isLoggedIn, function(req, res) {
      console.log("get /test");
        db.collection('posts').find().toArray((err, result) => {
          if (err) return console.log(err)
          res.render('test.ejs', {
            user : req.user,
            posts: result
          })
        })
    });

    app.get('/oneVideo/:videoId', isLoggedIn, function(req, res) {
      const videoId = req.params.videoId
      console.log("this is the video id", videoId);
        db.collection('posts').findOne({videoId: videoId},(err, result) => {
          if (err) return console.log(err)
          console.log(result);
          res.render('oneVideo.ejs', {
            user : req.user,
            post: result
          })
        })
    });
    //passing in user that came with the request as well as the messages^

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

// message board routes ===============================================================

    // app.post('/vids', (req, res) => {
    //   db.collection('posts').save({name: req.body.name, vid: req.body.vid, description:req.body.description, link: req.body.link, }, (err, result) => {
    //     if (err) return console.log(err)
    //     console.log('saved to database')
    //     res.redirect('/profile')
    //   })
    // })

    app.post('/videoList', (req, res) => {
      db.collection('posts').insertOne({videoId: req.body.videoId}, (err, result) => {
        if (err) return console.log("Something is wrong! ", err)
        console.log('saved to database')
        res.redirect('/test')
      })
    })

    app.put('/videoList', (req, res) => {
      console.log(req.body)
      db.collection('posts')
      .findOneAndUpdate({videoId: req.body.videoId}, (err, result) => {
        if (err) return res.send(err)
        res.send(result)
      })
    })


    // app.put('/messages', (req, res) => {
    //   db.collection('messages')
    //   .findOneAndUpdate({name: req.body.name, msg: req.body.msg}, {
    //     $set: {
    //       thumbUp:req.body.thumbUp + 1
    //     }
    //   }, {
    //     sort: {_id: -1},
    //     upsert: true
    //   }, (err, result) => {
    //     if (err) return res.send(err)
    //     res.send(result)
    //   })
    // })

    app.delete('/vids', (req, res) => {
      db.collection('posts').findOneAndDelete({name: req.body.name, vid: req.body.vid, link: req.body.link}, (err, result) => {
        if (err) return res.send(500, err)
        res.send('Message deleted!')
      })
    })

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        //passport stratagies (local strategy is just email and password, additional strategies are facebook etc logins)
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/test', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/test', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
