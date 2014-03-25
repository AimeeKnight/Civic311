(function(){

  'use strict';

  $(document).ready(initialize);

  function initialize(){
    $(document).foundation();
    $('#id-status').click(checkStatusById);
    $('#complete').geocomplete();
    //$.fn.geocomplete('#complete');
  }

  function checkStatusById(){
    var idVal = $('#id-val').val();
    window.location.href = ('/reports/'+ idVal);
  }

})();

