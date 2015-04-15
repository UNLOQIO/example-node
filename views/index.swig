<!DOCTYPE html>
<html lang="en">
<head>
   <meta charset="utf-8">
   <meta http-equiv="X-UA-Compatible" content="IE=edge">
   <meta name="viewport" content="width=device-width, initial-scale=1">
   <meta name="description" content="">
   <meta name="author" content="">
   <title>Application login</title>
   <!-- Bootstrap core CSS -->
   <link href="/css/bootstrap.min.css" rel="stylesheet">
   <!-- Custom styles for this template -->
   <link href="/css/login.css" rel="stylesheet">
</head>

<body>
<div id="loading">
   <div class="loader"></div>
</div>
<div class="container">
   <form class="form-signin" id="frmLogin">
      <h2 class="form-signin-heading">Please sign in</h2>
      <br />
      <label for="inputEmail" class="sr-only">Email address</label>
      <input value="" type="email" id="inputEmail" class="form-control" placeholder="Email address" required autofocus>
      <br/><br/>
      <button class="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
   </form>
   <br/>
   {% if expired %}
   <div class="error">
      Your session has expired.
   </div>
   {% endif %}
</div> <!-- /container -->
<script type="text/javascript" src="/jquery-1.11.1.min.js"></script>
<script type="text/javascript">
   $(document).ready(function() {
      $("#frmLogin").submit(function(e) {
         e.preventDefault();
         e.stopPropagation();
         var email = $("#inputEmail").val();
         if(!email || email.indexOf('@') === -1) return false;
         $("#loading").show();
         $.post('/login', {
            email: email
         }).success(function(d) {
            $("#loading").hide();
            if(typeof d !== 'object' || !d) {
               return alert('Something really bad happened.');
            }
            if(d.error) {
               return alert(d.message);
            } else {
               window.location.href = '/account';
            }
         }).error(function(e) {
            $("#loading").hide();
            alert(e.message || 'Something bad happened.');
         });
         return false;
      });
   });
</script>
</body>
</html>
