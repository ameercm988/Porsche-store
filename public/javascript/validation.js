// $(document).ready(function () {

    $('#table_id').DataTable();   //jquery data table
  
  
  
    $("#form").validate({
      errorClass: "validerrors",
      
  
      rules: {
        firstname: {
            required: true,
            minlength: 3
          },

        lastname: {
           required: true,
           minlength: 1
        },

        username: {
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

        mobilenumber: {
            required: true,
            minlength: 10
          }
  
      }
    })
  // })
  
