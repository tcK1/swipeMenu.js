function SwipeMenu() {

    var menuWidth;
    var sideMenu;
    var sideMenuOverlay;
    var body = document.getElementsByTagName("BODY")[0];
    window.onload = function () {
        menuWidth = document.getElementsByClassName('side-menu')[0].offsetWidth;
        sideMenu = document.getElementById('sideMenu');
        sideMenuOverlay = document.getElementById('sideMenuOverlay');
        body = document.getElementsByTagName("BODY")[0];
    };

    var touchableSize = window.innerWidth * 0.1;
    var areaAllowOpen = window.innerWidth - touchableSize;
    var areaAllowClose = touchableSize;
    var open = false;

    function openSideMenu() {
        console.log("openSideMenu called");
        open = true;

        body.style.overflow = 'hidden';

        sideMenuOverlay.style.display = 'block';

        sideMenu.style.webkitTransition = 'all 0.5s ease-in-out';
        sideMenu.style.MozTransition = 'all 0.5s ease-in-out';
        sideMenu.style.msTransition = 'all 0.5s ease-in-out';
        sideMenu.style.OTransition = 'all 0.5s ease-in-out';
        sideMenu.style.transition = 'all 0.5s ease-in-out';
        sideMenu.style.right = '0%';
        sideMenuOverlay.style.webkitTransition = 'all 0.5s ease-in-out';
        sideMenuOverlay.style.MozTransition = 'all 0.5s ease-in-out';
        sideMenuOverlay.style.msTransition = 'all 0.5s ease-in-out';
        sideMenuOverlay.style.OTransition = 'all 0.5s ease-in-out';
        sideMenuOverlay.style.transition = 'all 0.5s ease-in-out';
        sideMenuOverlay.style.opacity = '0.7';
    }

    function closeSideMenu() {
        console.log("closeSideMenu called");
        open = false;
        // TODO: block scroll when menu is open

        sideMenu.style.webkitTransition = 'all 0.5s ease-in-out';
        sideMenu.style.MozTransition = 'all 0.5s ease-in-out';
        sideMenu.style.msTransition = 'all 0.5s ease-in-out';
        sideMenu.style.OTransition = 'all 0.5s ease-in-out';
        sideMenu.style.transition = 'all 0.5s ease-in-out';
        sideMenu.style.right = -Math.abs(menuWidth)+'px';
        sideMenuOverlay.style.webkitTransition = 'all 0.5s ease-in-out';
        sideMenuOverlay.style.MozTransition = 'all 0.5s ease-in-out';
        sideMenuOverlay.style.msTransition = 'all 0.5s ease-in-out';
        sideMenuOverlay.style.OTransition = 'all 0.5s ease-in-out';
        sideMenuOverlay.style.transition = 'all 0.5s ease-in-out';
        sideMenuOverlay.style.opacity = '0';

        // TODO: set to none only after opacity transition
        sideMenuOverlay.style.display = 'none';
        body.style.overflow = '';
    }

    function dinamicChange(touch) {
        body.style.overflow = 'hidden';
        sideMenuOverlay.style.display = 'block';
        sideMenu.style.transition = '';

        var total = parseInt(sideMenu.offsetWidth);
        var aux = Math.abs(parseInt(sideMenu.style.right));
        var opacityValue = (aux / total);

        console.log(total);
        console.log(aux);
        console.log(opacityValue);
        sideMenu.style.right = -Math.abs(touch.clientX)+'px';
        sideMenuOverlay.style.opacity = (0.70 - opacityValue);

    }

    document.addEventListener('touchstart', function () {
        // console.log('Touch start:');
        // console.log(event);
        var touchX = event.touches[0].clientX;
        var target = event.touches[0].target;
        // console.log(event.touches[0].target);

        // TODO: add block if click on selected elements

        this.allowOpen = (touchX > areaAllowOpen);
        this.allowClose = (touchX < areaAllowClose);

        console.log('allowOpen: ' + this.allowOpen);
        console.log('allowClose: ' + this.allowClose);
        if (this.allowOpen) sideMenuOverlay.style.display = 'block';
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
