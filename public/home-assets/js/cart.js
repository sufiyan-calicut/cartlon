async function addToCart(prodId, ProdPrice,productName) {
  // window.alert("one")
  $.ajax({
    url: `/addtocart/${prodId}`,
    data: {
      id: prodId,
      productName : productName,
      price: Number.parseFloat(ProdPrice),
      // applycoupen: applycoupen,
    },

    method: "post",
    success: (response) => {
      if (response.cart) {
        $("#subtotal").load(location.href + " #subtotal>*", "");
        Swal.fire({
          position: "center",
          icon: "success",
          title: " cart exists",
          customClass: "swal-wide",
          showConfirmButton: false,
          timer: 1000,
        });

      } else if (response.loginerr) {
        // window.location = "/signin";

        Swal.fire({
          position: "center",
          icon: "error",
          title: "please login first",
          customClass: "swal-wide",
          showConfirmButton: false,
          timer: 1000,
        });
      } else if (response.added) {
        $("#productCard").load(location.href + " #productCard>*", "");
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Item added to cart",
          customClass: "swal-wide",
          showConfirmButton: false,
          timer: 1000,
        });

      } else if (response.updated) {
        $("#productCard").load(location.href + " #productCard>*", "");
        Swal.fire({
          position: "right-end",
          icon: "success",
          title: " cart updated",
          customClass: "swal-wide",
          showConfirmButton: false,
          timer: 1000,
        });


      }

    }
  })
}


async function removefromCart(cartId) {
  // window.alert("one")
  $.ajax({
    url: `/deletefromCart/${cartId}`,
    data: {
      name: cartId,

    },

    method: "post",
    success: (response) => {
      if (response.status) {
        $("#cart").load(location.href + " #cart>*", "");
        Swal.fire({
          position: "center",
          icon: "success",
          title: " cart updated",
          customClass: "swal-wide",
          showConfirmButton: false,
          timer: 1000,
        });

      } else if (response.loginerr) {
        // window.location = "/signin";

        Swal.fire({
          position: "center",
          icon: "error",
          title: "please login first",
          customClass: "swal-wide",
          showConfirmButton: false,
          timer: 1000,
        });
      } else if (response.added) {
        $("#productCard").load(location.href + " #productCard>*", "");
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Item added to cart",
          customClass: "swal-wide",
          showConfirmButton: false,
          timer: 1000,
        });

      } else if (response.deleted) {
        $("#cart").load(location.href + " #cart>*", "");
        Swal.fire({
          position: "right-end",
          icon: "info",
          title: " deleted from cart",
          customClass: "swal-wide",
          showConfirmButton: false,
          timer: 1000,
        });


      }

    }
  })
}


async function increase(cartId) {
  // window.alert("one")
  $.ajax({
    url: `/increment/${cartId}`,
    data: {
      name: cartId,

    },

    method: "post",
    success: (response) => {
      if (response.success) {
        $("#cart").load(location.href + " #cart>*", "");
        // Swal.fire({
        //   position: "center",
        //   icon: "success",
        //   title: " cart updated",
        //   customClass: "swal-wide",
        //   showConfirmButton: false,
        //   timer: 1000,
        // });

      } else if (response.loginerr) {
        // window.location = "/signin";

        Swal.fire({
          position: "center",
          icon: "error",
          title: "please login first",
          customClass: "swal-wide",
          showConfirmButton: false,
          timer: 1000,
        });
      } else if (response.added) {
        $("#productCard").load(location.href + " #productCard>*", "");
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Item added to cart",
          customClass: "swal-wide",
          showConfirmButton: false,
          timer: 1000,
        });

      } else if (response.updated) {
        $("#productCard").load(location.href + " #productCard>*", "");
        Swal.fire({
          position: "right-end",
          icon: "success",
          title: " cart updated",
          customClass: "swal-wide",
          showConfirmButton: false,
          timer: 1000,
        });


      }

    }
  })
}


async function decrease(cartId) {
  // window.alert("one")
  $.ajax({
    url: `/decrement/${cartId}`,
    data: {
      name: cartId,

    },

    method: "post",
    success: (response) => {
      if (response.success) {
        $("#cart").load(location.href + " #cart>*", "");
        // Swal.fire({
        //   position: "center",
        //   icon: "success",
        //   title: " cart updated",
        //   customClass: "swal-wide",
        //   showConfirmButton: false,
        //   timer: 1000,
        // });

      } else if (response.loginerr) {
        // window.location = "/signin";

        Swal.fire({
          position: "center",
          icon: "error",
          title: "please login first",
          customClass: "swal-wide",
          showConfirmButton: false,
          timer: 1000,
        });
      } else if (response.added) {
        $("#productCard").load(location.href + " #productCard>*", "");
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Item added to cart",
          customClass: "swal-wide",
          showConfirmButton: false,
          timer: 1000,
        });

      } else if (response.updated) {
        $("#productCard").load(location.href + " #productCard>*", "");
        Swal.fire({
          position: "right-end",
          icon: "success",
          title: " cart updated",
          customClass: "swal-wide",
          showConfirmButton: false,
          timer: 1000,
        });


      }else if (response.deleted) {
      


        Swal.fire({
          position: "right-end",
          icon: "success",
          title: " Deleted from cart",
          customClass: "swal-wide",
          showConfirmButton: false,
          timer: 1000,
        });

        location.href = '/cart';


      }else if (response.Deleted) {
        

        Swal.fire({
          position: "right-end",
          icon: "success",
          title: " Deleted from cart",
          customClass: "swal-wide",
          showConfirmButton: false,
          timer: 1000,
        });
        window.location.href = '/cart';

      }

    }
  })
}
