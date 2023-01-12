async function changeAdress(index) {
    // window.alert(addressId)
    $.ajax({
      url: `/changeAddress`,
      data: {
        index: index,
  
      },
  
      method: "post",
      success: (response) => {
        if (response.success) {
          $("#adrs").load(location.href + " #adrs>*", "");
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

  async function order() {
    window.alert("one")
    $.ajax({
      url: `/viewOrder`,
     
  
      method: "get",
      success: (response) => {
        if (response.success) {
          $("#adrs").load(location.href + " #adrs>*", "");
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
 


     
      async function applyCoupon(index) {
        let doc = document.getElementById('fir').value
        $.ajax({
          url: `/applyCoupon`,
          data: {
            coupon: doc,
      
          },
      
          method: "post",
          success: (response) => {
            if (response.applicable) {
              $("#subtotal").load(location.href + " #subtotal>*", "");
             

              let timerInterval
              Swal.fire({
                
                title: 'coupon applied!',
                
                timer: 1500,
                timerProgressBar: true,
                didOpen: () => {
                  Swal.showLoading()
                  const b = Swal.getHtmlContainer().querySelector('b')
                  timerInterval = setInterval(() => {
                    b.textContent = Swal.getTimerLeft()
                  }, 100)
                },
                willClose: () => {
                  clearInterval(timerInterval)
                }
              }).then((result) => {
                /* Read more about handling dismissals below */
                if (result.dismiss === Swal.DismissReason.timer) {
                  console.log('I was closed by the timer')
                }
              })
      
            } else if (response.error) {
              // window.location = "/signin";
      
              Swal.fire({
                position: "center",
                icon: "info",
                title: "Sorry... coupon is not valid",
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

      async function orderCancel(orderId) {
        // window.alert(orderId)
        $.ajax({
          url: `/cancelOrder`,
          data: {
            orderId: orderId,
      
          },
      
          method: "post",
          success: (response) => {
            if (response.cancel) {
              $("#cancel").load(location.href + " #cancel>*", "");
              Swal.fire({
                position: "center",
                icon: "success",
                title: " Order cancelled",
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
      