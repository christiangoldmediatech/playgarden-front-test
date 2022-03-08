document.addEventListener("DOMContentLoaded", () => {
    let menuMobilePopup = document.querySelector("#modal-menu-pg")
    let bodyPage = document.querySelector("body")

    
    function bodyScrollDisabled() {
        bodyPage.classList.add("scroll-disabled")
    }

    function bodyScrollEnabled() {
        bodyPage.classList.remove("scroll-disabled")
    }
    
    /* POPUP */
    function closePopupPg(modal) {
        modal.classList.remove("active")
        if (modal.querySelector(".modal-content").classList.contains("fade")) {
            modal.classList.add("closing")
            setTimeout(() => {
                modal.classList.remove("closing")
            }, 450);
            bodyScrollEnabled()
        }
    }

    function openPopupPg(modal) {
        modal.classList.add("active")
        bodyScrollDisabled();
    }
    document.querySelectorAll(".modal-button").forEach(modalButton => {
        let modal = document.querySelector("#" + modalButton.dataset.modal)
        modalButton.addEventListener("click", (e) => {
            e.preventDefault()
            openPopupPg(modal)
        })
        modal.addEventListener("click", (evt) => {
            if (evt.target == modal) {
                closePopupPg(modal)
            }
        })
        modal.querySelectorAll(".modal-close").forEach(btnClose => {
            btnClose.addEventListener("click", () => {
                closePopupPg(modal)
            })
        });
    });
    window.addEventListener("keyup", (evt) => {
        if (evt.code == "Escape") {
            let modalActive = document.querySelector(".modal-pg.active")
            if (modalActive) {
                closePopupPg(modalActive)
            }
        }
    })
    
    /* MENU */
    
    
    /* MENU */
    document.querySelectorAll(".container-list-menu-mobile").forEach(containerListMenuMobilePg => {
        let navbar = document.querySelector(".header-landing-2")
        let navPos = navbar.getBoundingClientRect().top;
        let header = document.querySelector("#header-landing-2")
        header.style.setProperty("--offset-margin-header", (navPos + navbar.offsetHeight) +"px");
        navbar.style.setProperty("--top-menu-sticky", navPos + "px");
        
        window.addEventListener("scroll", e => {
            let scrollPos = window.scrollY;
            
            if(scrollPos > navPos + navbar.offsetHeight){
              navbar.classList.add('sticky-remove-btns');
            }
            else{
              navbar.classList.remove('sticky-remove-btns');
            }
        });

        document.querySelectorAll(".menu-view-more").forEach(viewMoreDesktop => {
            viewMoreDesktop.addEventListener("click",(evt) =>{
                evt.preventDefault()
            })
        });
        document.querySelectorAll(".content-menu-mobile a").forEach(linkMenuMobile => {
            if(!linkMenuMobile.classList.contains("more-menu-link")){
                linkMenuMobile.addEventListener("click",() => {
                    closePopupPg(menuMobilePopup)
                })
            }
        });

        function resizeHeightUpdate(){
            header.style.setProperty("--offsetMarginHeader", (navPos + navbar.offsetHeight) +"px");
            containerListMenuMobilePg.querySelectorAll(".more-menu").forEach(menuMoreItem => {
                menuMoreItem.style.setProperty("--height-menu", menuMoreItem.querySelector(".submenu").offsetHeight +"px");
            });
        }
        containerListMenuMobilePg.querySelectorAll(".more-menu").forEach(menuMoreItem => {
            let linkMenuMoreItem = menuMoreItem.querySelector("a");
            linkMenuMoreItem.addEventListener("click",(e)=>{
                e.preventDefault();
                resizeHeightUpdate()
                if(!menuMoreItem.classList.contains("open")){
                    let menuMoreMobileOpenTemp = containerListMenuMobilePg.querySelector(".more-menu.open")
                    if(menuMoreMobileOpenTemp){
                        menuMoreMobileOpenTemp.classList.remove("open");
                    }
                }
                menuMoreItem.classList.toggle("open");
            })
        });
        window.addEventListener('resize', resizeHeightUpdate)
    });



}, false);
