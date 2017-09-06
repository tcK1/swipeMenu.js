function SwipeMenu() {

    var menuWidth;
    window.onload = function () {
        menuWidth = document.getElementsByClassName('side-menu')[0].offsetWidth;
    };

// var menuWidth = $('.side-menu').outerWidth();
    var touchableSize = window.innerWidth * 0.1;
    var areaAllowOpen = window.innerWidth - touchableSize;
    var areaAllowClose = touchableSize;
    var open = false;

// $('.side-menu').css({ right: -Math.abs(menuWidth) });

    var sideMenu = document.getElementsByClassName('side-menu');
    var sideMenuOverlay = document.getElementsByClassName('side-menu-overlay');


    function animSideMenu(startPosition, endPosition) {
        var elem = document.getElementById('sideMenu');
        var currentPos = startPosition;
        var id = setInterval(frame, 1);
        function frame() {
            var breakCondition = startPosition < endPosition ? currentPos >= endPosition : currentPos <= endPosition;
            if (breakCondition) {
                clearInterval(id);
            } else {
                if (startPosition < endPosition) {
                    currentPos+=10;
                    elem.style.right = currentPos  + 'px';
                } else {
                    currentPos-=10;
                    elem.style.right = currentPos  + 'px';
                }
            }
        }
    }

    function animSideMenu2(startPosition, endPosition) {
        for (i = startPosition; i <= endPosition; i++) {
            var rightValue = parseInt(document.getElementById('sideMenu').style.right, 10);
            document.getElementById('sideMenu').style.right = `${rightValue + 1}px`;
            console.log(i+" "+endPosition);
            console.log(rightValue);
        }
    }

    function openSideMenu() {
        console.log("openSideMenu called");
        open = true;
        $('body').addClass('no-scroll');
        $('.side-menu-overlay').addClass('open');
        // TODO add right after anim
        // $('.side-menu').addClass('open');
        animSideMenu(parseInt(document.getElementById('sideMenu').style.right, 10), 0);
        // document.getElementById('sideMenu').style.right = '0%';
        $('.side-menu-overlay').animate({opacity: 0.70});
        // $('.side-menu').animate({ right: '0' });
    }

    function closeSideMenu() {
        console.log("closeSideMenu called");
        open = false;
        $('body').removeClass('no-scroll');
        animSideMenu(parseInt(document.getElementById('sideMenu').style.right, 10), -Math.abs(menuWidth));

        // $('.side-menu').removeClass('open');
        // $('.side-menu-overlay').animate({opacity: 0}, function () {
        //     $('.side-menu-overlay').removeClass('open');
        // });
        // $('.side-menu').animate({right: -Math.abs(menuWidth)});
    }

    function dinamicChange(touch) {
        $('.side-menu').removeClass('open');

        var total = parseInt($('.side-menu').css('width'));
        var aux = Math.abs(parseInt($('.side-menu').css('right')));
        var opacityValue = (aux / total);
        $('.side-menu-overlay').css({opacity: (0.70 - opacityValue)});
        $('.side-menu').css({right: -Math.abs(touch.clientX)});
    }

    document.addEventListener('touchstart', function () {
        // console.log('Touch start:');
        // console.log(event);
        var touchX = event.touches[0].clientX;
        var target = event.touches[0].target;
        // console.log(event.touches[0].target);

        if ($(target).is('a') ||
            $($(target)['0'].parentElement).is('a')
        ) {
            console.log($(target));
            console.log($($(target)["0"].parentElement));
            console.log("a");
            return;
        }
        this.allowOpen = (touchX > areaAllowOpen);
        this.allowClose = (touchX < areaAllowClose);

        console.log('allowOpen: ' + this.allowOpen);
        console.log('allowClose: ' + this.allowClose);
        if (this.allowOpen) $('.side-menu-overlay').addClass('open');
        this.touchStart = touchX;
        this.timeStart = event.timeStamp;
    });

    document.addEventListener('touchmove', function (e) {
        if ((this.allowOpen && !open) || (this.allowClose && open))
            dinamicChange(event.touches[0]);
    });

    document.addEventListener('touchend', function (e) {
        // console.log('Touch end:');
        // console.log(event);
        if (!this.allowOpen && !this.allowClose) return;
        this.touchEnd = event.changedTouches[0].clientX;
        this.timeEnd = event.timeStamp;
        this.swipedLeft = (this.touchEnd < this.touchStart);
        this.swipedRight = (this.touchEnd > this.touchStart);
        this.fastSwipe = (this.timeEnd - this.timeStart) <= 300;
        (open) ? closeEvents(this) : openEvents(this);
    });

    function openEvents(context) {
        console.log("openEvents called");
        if (!context.allowOpen) return;

        if (context.touchEnd < ((window.innerWidth) / 2)) // Has already dragged more than half of the screen
            openSideMenu();
        else if (context.swipedLeft && context.fastSwipe) // Soft swipe (swipe in less than 300ms)
            openSideMenu();
        else
            closeSideMenu();
    }

    function closeEvents(context) {
        console.log("closeEvents called");
        if (!context.allowClose) return;

        if (context.touchEnd < (window.innerWidth - menuWidth)) // Touched out of menu
            closeSideMenu();
        else if (context.touchEnd > ((window.innerWidth) / 2)) // Released menu within half of the screen
            closeSideMenu();
        else if (context.swipedRight && context.fastSwipe) // Soft swipe (swipe in less than 300ms)
            closeSideMenu();
        else
            openSideMenu();
    }
}
