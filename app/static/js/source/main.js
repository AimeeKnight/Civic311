(function(){

  'use strict';

  $(document).ready(initialize);

  function initialize(){
    $(document).foundation();
    $('#id-status').click(checkStatusById);
    $('#complete').geocomplete();
    $('#donation').change(updateAmount);
    //$.fn.geocomplete('#complete');
  }

  function checkStatusById(){
    var idVal = $('#id-val').val();
    window.location.href = ('/reports/'+ idVal);
  }

  function updateAmount(){
    var donation = $('#donation option:selected').text();
    donation = donation.replace(/\$/g, '');
    donation *= 100;
    $('#donate input[name="amount"]').val(donation);
    $('#donate > script').attr('data-amount', donation);
    $('#donate > script').attr('src', 'https://checkout.stripe.com/checkout.js');
  }

})();

