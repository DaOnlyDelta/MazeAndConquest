(function() {
    const levelSelect = document.getElementById('levelSelect');
    const mainMenu = document.getElementById('mainMenu');
    const tableSelect = document.getElementById('tableSelect');
    drawTable(tableSelect, 7, 6);

    function backToMenu() {
        levelSelect.style.display = 'none';
        mainMenu.style.display = 'block';
    }

    const levelSelectBack = document.getElementById('levelSelectBack');
    levelSelectBack.addEventListener('pointerenter', () => playSound('hover'));
    levelSelectBack.addEventListener('click', () => {
        playSound('click2');
        backToMenu();
    });

    const levelWrapper = document.getElementById('levelWrapper');
    const levels = Array.from(levelWrapper.children);

    levels.forEach((div) => {
        div.addEventListener('pointerenter', () => playSound('hover'));
        div.addEventListener('click', () => {
            switch (div.currentTarget.id) {
                case 'lvl1':
                    // Open lvl 1
                    break;
                
                case 'lvl2':
                    // Open lvl 2
                    break;
                
                case 'lvl3':
                    // Open lvl 3
                    break;
                
                case 'lvl4':
                    // Open lvl 4
                    break;
            }
        });
    });
})();