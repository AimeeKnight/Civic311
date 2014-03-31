(function(){

  'use strict';

  $(document).ready(initialize);

  function initialize(){
    //$('.donor-email').append($.gravatar(donor.donorEmail));
    //$(document).foundation();
    //$('#id-status').click(checkStatusById);
    //$('#complete').geocomplete();
    //$('#donation').change(updateAmount);
    getEmails();
  }

  function getEmails(){
    var emails = $('.email');
    //var names = $('.donor-name');
    //emails.hide();
    //names.hide();
    //var emailStrings = [];
    //var nameStrings = [];

    /*
    $.each(emails, function(index, email){
      emailStrings.push(email.innerHTML);
    });

    $.each(names, function(index, name){
      nameStrings.push(name.innerHTML);
    });

    $.each(emailStrings, function(index, string){
      $('.gravatar-img').append($.gravatar(string));
      var $name = $('<span class="gravatar"></span>');
      $name.text(nameStrings[index]);
      $('.gravatar-img').append($name);
    });
    */

    $.each(emails, function(index, email){
      var $gravatar = $('<div class="gravatar-img"></div>');
      $gravatar.append($.gravatar(email.innerHTML));
      $('.email').append($gravatar);
      $('.emails').show();
    });
  }

})();

