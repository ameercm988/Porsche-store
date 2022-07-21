
  
  
  
    $("#signup").validate({
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

  

  $("#login").validate({
    errorClass: "validerrors",
    

    rules: {


      email: {
        required: true,
        email: true
      },

      password: {
        required: true,
        minlength: 5
      },

     
    }

  })