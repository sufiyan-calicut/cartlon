async function addtoWishlist(prodId) {
    // window.alert("one")
    $.ajax({
      url: `/addtowishlist/${prodId}`,
      data: {
        id: prodId,
       
      },
  
      method: "post",
      success: (response) => {
     if (response.loginerr) {
          // window.location = "/signin";
  
          Swal.fire({
            position: "center",
            icon: "error",
            title: "please login first",
            customClass: "swal-wide",
            showConfirmButton: false,
            timer: 1000,
          });
        }else if (response.added){
            $("#productCard").load(location.href + " #productCard>*", "");
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Item added to wishlist",
            customClass: "swal-wide",
            showConfirmButton: false,
            timer: 1000,
          });
  
        }else {
            $("#productCard").load(location.href + " #productCard>*", "");
          Swal.fire({
            position: "center",
            icon: "error",
            title: "Something wrong!!!",
            customClass: "swal-wide",
            showConfirmButton: false,
            timer: 1000,
          });
  
        }
  
  
      }
    })
  }


//   REMOVE FROM WISHLIST

async function removeWishlist(prodId) {
    // window.alert("one")
    $.ajax({
      url: `/removewishlist/${prodId}`,
      data: {
        id: prodId,
       
      },
  
      method: "post",
      success: (response) => {
     if (response.remove) {
          // window.location = "/signin";
          $("#productCard").load(location.href + " #productCard>*", "");
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Removed from wishlist",
            customClass: "swal-wide",
            showConfirmButton: false,
            timer: 1000,
          });
        }else {

          Swal.fire({
            position: "center",
            icon: "error",
            title: "Something wrong!!!",
            customClass: "swal-wide",
            showConfirmButton: false,
            timer: 1000,
          });
  
        }
  
  
      }
    })
  }