
//user posts video link to inputs
//when the submit happens
//the

//takes url and breaks it down into the parameters as key and value pairs
//then specifies the video id value and passes it into api method loadVideoById
document.getElementById('getVideo').addEventListener('click', function () {
  var url = document.querySelector('#videoUrl').value;

//makes a sub string of all characters after the ?
  var queryString = url.substring( url.indexOf('?') + 1 );

//makes an empty object
  var params = {};
  // Split into key/value pairs
  queries = queryString.split("&");
  // Convert the array of strings into an object
  console.log("url: ", url, "querrystring: ", queryString, "querries: ", queries);
  for ( i = 0, l = queries.length; i < l; i++ ) { // loop through queries
    temp = queries[i].split('='); // split query into key and value
    params[temp[0]] = temp[1]; //add the key/value pair to the params object
    console.log("temp: ", temp, "params: ", params);
  }
  console.log(params)
  // player.loadVideoById(params.v)

  fetch('videoList', {
    method: 'post',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      'videoId': params.v
    })
  })
  // .then(response => {
  //   if (response.ok) return response.json()
  // })
  .then(data => {
    console.log("about to reload client side: ", data)
    window.location.reload(true)
  })
})

//end of parser
//
