(function(){

  'use strict';

  $(document).ready(initialize);

  function initialize(){
    $(document).foundation();
    //$('#request-token').click(sendAccessEmail);
    $('#confirm-token').click(completeRegistration);
  }

  /*
  function sendAccessEmail(){
    var email = $('input[type=email]').val();
    console.log(email);
    var url = window.location.origin + '/admin/create';
    var data = {email:email};
    var type = 'POST';
    var success = sendBackToken;
    $.ajax({url:url, data:data, type:type, success:success});
  }
  */

  function completeRegistration(){
    var email = $('input[type=email]').val();
    var password = $('input[type=password]').val();
    var url = window.location.origin + '/admin/confirm';
    var data = {email:email, password:password};
    var type = 'POST';
    var success = sendBackToken;
    $.ajax({url:url, data:data, type:type, success:success});
  }


  function sendBackToken(data){
    console.log(data);
    window.location.href='/reports/';
    //$('input[type=hidden]').val(data.num);

  }

})();

