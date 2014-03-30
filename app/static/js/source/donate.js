(function(){

  'use strict';

  $(document).ready(initialize);

  function initialize(){
    getEmails();
  }

  function getEmails(){
    var emails = $('.email');
    var names = $('.donor-name');
    emails.hide();
    names.hide();
    var emailStrings = [];
    var nameStrings = [];

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
  }

})();

