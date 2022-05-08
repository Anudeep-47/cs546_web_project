(function ($) {
  let firstname = $('#firstname');
  let lastname = $('#lastname');
  let gender = $('#gender');
  let isElse = $('#isElse');
  let number = $('#number');
  let email = $('#email');
  let reason = $('#reason');
  let isNew = $('#isNew');
  let time = $('#time');
  let notes = $('#notes');
  let edit = $('#edit');
  let save = $('#save');
  let alert = $('.errors');

  document.getElementById("firstname").disabled = true;
  document.getElementById("lastname").disabled = true;
  document.getElementById("gender").disabled = true;
  document.getElementById("isElse").disabled = true;
  document.getElementById("number").disabled = true;
  document.getElementById("email").disabled = true;
  document.getElementById("reason").disabled = true;
  document.getElementById("isNew").disabled = true;
  document.getElementById("time").disabled = true;
  document.getElementById("notes").disabled = true;
  save.hide();

  edit.click(function () {
    document.getElementById("firstname").disabled = false;
    document.getElementById("lastname").disabled = false;
    document.getElementById("gender").disabled = false;
    document.getElementById("isElse").disabled = false;
    document.getElementById("number").disabled = false;
    document.getElementById("email").disabled = false;
    document.getElementById("reason").disabled = false;
    document.getElementById("isNew").disabled = false;
    document.getElementById("time").disabled = false;
    document.getElementById("notes").disabled = false;
    edit.hide();
    save.show();
  });

  save.submit((event) => {
    event.preventDefault();
    save.unbind().submit();
  });

})(jQuery);