

module.exports = {

    count: (index) => {

        return index + 1;

    },

    progress1: (status) => {

        return status === "placed" ? "green" : null

    },

    progress2: (status) => {

        return status === "Packed" ? "green" : null
                

    },

    progress3: (status) => {

        return  status === "shipped" ? "green" : null

    },

    progress4: (status) => {

        return  status === "Delivered" ? "green" : null

    },

    progress5: (status) => {

        return  status === "Cancelled" ? "red" : null

    }

    
    

}