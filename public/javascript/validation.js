// $(document).ready(function () {

    // $('#table_id').DataTable();   //jquery data table
  
  
  
    $("#form").validate({
      errorClass: "validerrors",
      
  
      rules: {
        firstname: {
            lettersonly : true,
            required: true,
            minlength: 3
          },

        lastname: {
          lettersonly : true,
           required: true,
           minlength: 1
        },

        username: {
          lettersonly : true,
          required: true,
          minlength: 4
        },
  
        email: {
          required: true,
          email: true
        },
  
        password: {
          required: true,
          minlength: 5
        },

        confirmpassword : {
           required : true,
           minlength : 5,
           equalTo: password
        },

        mobilenumber: {
            required: true,
            minlength: 10
          }
  
      }

    })
  // })
  


//   $(document).ready(function(){jQuery.validator.addMethod("alphanumeric", function(value, element) {
//     return this.optional(element) || /^[\w.]+$/i.test(value);
// }), 
//     $("#signup-form").validate({
//         rules:{
//             firstname:{
//                 required:true,
//                 lettersonly : true,
//                 minlength:3,
//                 maxlength:8
//             },
//             lastname:{
//                 required:true,
//                 lettersonly : true,
//                 minlength:3,
//                 maxlength:8
//             },
//             username: {
//               lettersonly : true,
//               required: true,
//               minlength: 4
//             },
//             email:{
//                 required:true,
//                 email:true
                
//             },
//             password:{
//                 required:true,
//                 alphanumeric:true,
//                 rangelength:[7, 14]
                
//             },
//             confirmpassword:{
//                 required:true,
//                 rangelength:[7,14],
//                 equalTo: "#mainpassword"
//             },
//         },messages:{
//             firstname:{
//                 required:"enter first name",
//                 minlength:"enter atleast 3 characters",
//                 maxlength:"not more than 8 characters"
//             },
//             lastname:{
//                 required:"enter second name",
//                 minlength:"enter atleast 3 characters",
//                 maxlenth:"not more than 8 characters"
//             },
//             email:{
//                 required:"Enter your emailaddress",
//                 email:"enter a valid email adress"
//             },
//             password:{
//                 required:"enter a password",
//                 rangelength:"enter characters between 7 to 14 ",
//                 alphanumeric:"enter mix of numbers and alphabets"
//             },
//             confirmpassword:{
//                 required:"re-enter your password",
//                 rangelength:"enter characters between 7 to 14 ",
//                 equalTo:"enter same password"
//             },
//         }
     
//     })
// })
// $.validator.addMethod( "alphanumeric", function( value, element ) {
// 	return this.optional( element ) || /^\w+$/i.test( value );
// }, "Letters, numbers, and underscores only please." );