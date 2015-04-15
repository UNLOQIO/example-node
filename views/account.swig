<!DOCTYPE html>
<html lang="en">
<head>
   <meta charset="utf-8">
   <meta http-equiv="X-UA-Compatible" content="IE=edge">
   <meta name="viewport" content="width=device-width, initial-scale=1">
   <meta name="description" content="">
   <meta name="author" content="">
   <title>Securely logged in!</title>
   <!-- Bootstrap core CSS -->
   <link href="/css/bootstrap.min.css" rel="stylesheet">
   <!-- Custom styles for this template -->
   <link href="/css/login.css" rel="stylesheet">
</head>

<body>
<div class="container">
   <br/>
   <nav class="navbar navbar-default">
      <div class="container-fluid">
         <div class="navbar-header">
            <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-5">
               <span class="sr-only">Toggle navigation</span>
               <span class="icon-bar"></span>
               <span class="icon-bar"></span>
               <span class="icon-bar"></span>
            </button>
            <a class="navbar-brand" href="#">Signed in as <b>{{ user.email }}</b></a>
         </div>
         <div class=" navbar-right " style="margin-top: 10px; margin-right: 10px;">
            <button id="btnLogout" type="button" class="btn btn-danger btn-sm">Logout</button>
         </div>

      </div>
   </nav>
   <div class="alert alert-success" role="alert">
      <strong>Well done!</strong> You successfully authenticated with no password on our website!
   </div>
   <div class="alert alert-info" role="alert">
      <strong>Notice</strong> This page contains information that is not publicly available and required user authentication.
   </div>

   <div class="table-responsive" style="width: 60%">
      <br/><br/>
      <table class="table">
         <thead>
            <tr>
               <th>#ID</th>
               <th>Asset name</th>
               <th>My Asset Description</th>
               <th>My Asset Value</th>
            </tr>
         </thead>
         <tbody>
         <tr>
            <th colspan="4" class="info">Custom Company secured data </th>
         </tr>
         <tr>
            <td>1</td>
            <td>London</td>
            <td>London, UK Page</td>
            <td>http://myapp.com</td>
         </tr>
         <tr>
            <td>2</td>
            <td>My second asset</td>
            <td>CD Case</td>
            <td>-</td>
         </tr>
         </tbody>
      </table>
   </div>

</div> <!-- /container -->
<script type="text/javascript" src="/jquery-1.11.1.min.js"></script>
<script type="text/javascript">
   $(document).ready(function() {
      $("#btnLogout").on('click', function(e) {
         $.post('/logout').done(function() {
            window.location.href = '/';
         }).error(function(err) {
            alert(err.message || 'Something bad happened.');
         })
      });
      // We start an internal checker for session life.
      setInterval(function() {
         $.get('/ping').done(function(d) {
            if(!d || typeof d !== 'object') return;
            if(d.session) return;
            window.location.href = '/?expired=true';
         })
      }, 3000);
   });
</script>
</body>
</html>
