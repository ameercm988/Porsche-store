
// $(document).ready(function () {

$('#table_id').DataTable();   //jquery data table


$("#form").validate({
  errorClass: "validerrors",

  rules: {

    firstname: {
      required: true,
      minlength: 3,
      lettersonly: true
    },
    lastname: {
      required: true,
      minlength: 1,
      lettersonly: true
    },
    username: {
      required: true,
      minlength: 4,
      alphanumeric: true,
    },
    email: {
      required: true,
      email: true
    },
    password: {
      required: true,
      minlength: 5
    },
    confirmpassword: {
      required: true,
      minlength: 5,
      equalTo: "#password"
    },
    mobilenumber: {
      required: true,
      minlength: 10
    },
    name: {
      required: true,
      minlength: 3,
      lettersonly: true
    },
    price: {
      required: true,
    },
    description: {
      required: true,
    },
    category: {
      required: true,
      lettersonly: true
    },
  }, messages: {

    firstname: {
      required: "Enter first name",
      minlength: "Enter atleast 3 characters",
    },
    lastname: {
      required: "Enter last name",
      minlength: "Enter atleast 3 characters",
    },
    firstname: {
      required: "Enter first name",
      minlength: "Enter atleast 3 characters",
    },
    confirmpassword: {
      equalTo: "Passwords doesn't match"
    },
  }
})
// })

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

// LettersOnly

jQuery.validator.addMethod("lettersonly", function (value, element) {
  return this.optional(element) || /^[a-z]+$/i.test(value);
}, "Letters only please");

// Alphanumeric

jQuery.validator.addMethod("alphanumeric", function (value, element) {
  return this.optional(element) || /^[\w.]+$/i.test(value);
}, "Letters, numbers, and underscores only please");


