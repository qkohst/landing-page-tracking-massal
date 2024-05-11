(function () {
  "use strict";

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim();
    if (all) {
      return [...document.querySelectorAll(el)];
    } else {
      return document.querySelector(el);
    }
  };

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all);
    if (selectEl) {
      if (all) {
        selectEl.forEach((e) => e.addEventListener(type, listener));
      } else {
        selectEl.addEventListener(type, listener);
      }
    }
  };

  /**
   * Easy on scroll event listener
   */
  const onscroll = (el, listener) => {
    el.addEventListener("scroll", listener);
  };

  /**
   * Navbar links active state on scroll
   */
  let navbarlinks = select("#navbar .scrollto", true);
  const navbarlinksActive = () => {
    let position = window.scrollY + 200;
    navbarlinks.forEach((navbarlink) => {
      if (!navbarlink.hash) return;
      let section = select(navbarlink.hash);
      if (!section) return;
      if (
        position >= section.offsetTop &&
        position <= section.offsetTop + section.offsetHeight
      ) {
        navbarlink.classList.add("active");
      } else {
        navbarlink.classList.remove("active");
      }
    });
  };
  window.addEventListener("load", navbarlinksActive);
  onscroll(document, navbarlinksActive);

  /**
   * Scrolls to an element with header offset
   */
  const scrollto = (el) => {
    let header = select("#header");
    let offset = header.offsetHeight;

    if (!header.classList.contains("header-scrolled")) {
      offset -= 20;
    }

    let elementPos = select(el).offsetTop;
    window.scrollTo({
      top: elementPos - offset,
      behavior: "smooth",
    });
  };

  /**
   * Toggle .header-scrolled class to #header when page is scrolled
   */
  let selectHeader = select("#header");
  if (selectHeader) {
    const headerScrolled = () => {
      if (window.scrollY > 100) {
        selectHeader.classList.add("header-scrolled");
      } else {
        selectHeader.classList.remove("header-scrolled");
      }
    };
    window.addEventListener("load", headerScrolled);
    onscroll(document, headerScrolled);
  }

  /**
   * Scrool with ofset on links with a class name .scrollto
   */
  on(
    "click",
    ".scrollto",
    function (e) {
      if (select(this.hash)) {
        e.preventDefault();

        let navbar = select("#navbar");
        if (navbar.classList.contains("navbar-mobile")) {
          navbar.classList.remove("navbar-mobile");
          // let navbarToggle = select(".mobile-nav-toggle");
          // navbarToggle.classList.toggle("bi-list");
          // navbarToggle.classList.toggle("bi-x");
        }
        scrollto(this.hash);
      }
    },
    true
  );

  /**
   * Scroll with ofset on page load with hash links in the url
   */
  window.addEventListener("load", () => {
    if (window.location.hash) {
      if (select(window.location.hash)) {
        scrollto(window.location.hash);
      }
    }
  });

  /**
   * Testimonials slider
   */
  new Swiper(".testimonials-slider", {
    speed: 600,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    slidesPerView: "auto",
    pagination: {
      el: ".swiper-pagination",
      type: "bullets",
      clickable: true,
    },
    breakpoints: {
      320: {
        slidesPerView: 1,
        spaceBetween: 20,
      },

      991: {
        slidesPerView: 3,
        spaceBetween: 20,
      },
    },
  });

  /**
   * Porfolio isotope and filter
   */
  window.addEventListener("load", () => {
    let portfolioContainer = select(".portfolio-container");
    if (portfolioContainer) {
      let portfolioIsotope = new Isotope(portfolioContainer, {
        itemSelector: ".portfolio-item",
        layoutMode: "fitRows",
      });

      let portfolioFilters = select("#portfolio-flters li", true);

      on(
        "click",
        "#portfolio-flters li",
        function (e) {
          e.preventDefault();
          portfolioFilters.forEach(function (el) {
            el.classList.remove("filter-active");
          });
          this.classList.add("filter-active");

          portfolioIsotope.arrange({
            filter: this.getAttribute("data-filter"),
          });
          portfolioIsotope.on("arrangeComplete", function () {
            AOS.refresh();
          });
        },
        true
      );
    }
  });

  //   /**
  //    * Initiate portfolio lightbox
  //    */
  //   const portfolioLightbox = GLightbox({
  //     selector: ".portfolio-lightbox",
  //   });

  //   /**
  //    * Portfolio details slider
  //    */
  //   new Swiper(".portfolio-details-slider", {
  //     speed: 400,
  //     loop: true,
  //     autoplay: {
  //       delay: 5000,
  //       disableOnInteraction: false,
  //     },
  //     pagination: {
  //       el: ".swiper-pagination",
  //       type: "bullets",
  //       clickable: true,
  //     },
  //   });

  /**
   * Animation on scroll
   */
  window.addEventListener("load", () => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: true,
      mirror: false,
    });
  });

  $(document).ready(function () {
    setHeightCard();
    updateTableForMobile();
  });

  // Panggil fungsi saat jendela diubah ukurannya untuk menangani responsif
  $(window).resize(function () {
    updateTableForMobile();
    setHeightCard();
  });

  // Fungsi untuk mengubah struktur tabel saat mode mobile
  function updateTableForMobile() {
    var screenWidth = $(window).width();
    if (screenWidth <= 991) {
      // Loop melalui setiap kolom kecuali kolom pertama di thead
      $(".table-desktop thead th:not(:first-child)").each(function (index) {
        // Buat tabel baru untuk setiap kolom, menggabungkan judul kolom sebagai judul baru
        let newTable = $("<table class='table table-new'></table>");
        let newThead = $("<thead></thead>").appendTo(newTable);
        let newTbody = $("<tbody></tbody>").appendTo(newTable);
        $("<th colspan='2'>" + $(this).text() + "</th>").appendTo(newThead);

        // Loop melalui setiap baris di tbody dan memindahkan isinya ke tabel baru
        $(".table-desktop tbody tr").each(function () {
          let newRow = $("<tr></tr>").appendTo(newTbody);
          $("<td>" + $(this).find("td:first-child").text() + "</td>").appendTo(
            newRow
          );
          $(
            "<td>" +
              $(this)
                .find("td:eq(" + (index + 1) + ")")
                .text() +
              "</td>"
          ).appendTo(newRow);
        });
        // Ganti tabel yang lama dengan tabel baru
        $(this).closest(".table-container").append(newTable);
      });
      $(".table-desktop").hide();
    } else {
      $(".table-desktop").show();
      $(".table-new").remove();
    }
  }

  function setHeightCard() {
    var screenWidth = $(window).width();
    if (screenWidth >= 991) {
      var maxHeight = Math.max.apply(
        null,
        $(".fitur .card")
          .map(function () {
            return $(this).height();
          })
          .get()
      );
      $(".fitur .card").height(maxHeight);
    }
  }

  $(document).on("click", ".mobile-nav-toggle", function () {
    let navbar = $("#navbar");
    if (navbar.hasClass("navbar-mobile")) {
      navbar.removeClass("navbar-mobile");
    } else {
      navbar.addClass("navbar-mobile");
    }
  });
})();
