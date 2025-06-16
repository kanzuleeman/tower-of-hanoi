const diskStyles = [
    { width: 140, class: 'disk1', color: '#FF6633' },
    { width: 125, class: 'disk2', color: '#FFB399' },
    { width: 110, class: 'disk3', color: '#FF33FF' },
    { width: 95,  class: 'disk4', color: '#FFFF99' },
    { width: 80,  class: 'disk5', color: '#00B3E6' },
    { width: 65,  class: 'disk6', color: '#E6B333' },
    { width: 50,  class: 'disk7', color: '#3366E6' },
    { width: 35,  class: 'disk8', color: '#B34D4D' }
  ];

  let draggedDisk = null;
  let moveCount = 0;

  function getTotalDisks() {
    return parseInt($('#diskCount').val());
  }

  function getOptimalMoves() {
    return Math.pow(2, getTotalDisks()) - 1;
  }

  function updateDraggable() {
    $('.disk').attr('draggable', false);
    $('.tower').each(function () {
      const disks = $(this).find('.disk');
      if (disks.length > 0) {
        disks.last().attr('draggable', true);
      }
    });
  }

  function repositionDisks(tower) {
    const disks = tower.find('.disk');
    disks.each(function (i) {
      $(this).css('bottom', `${i * 22}px`);
    });
  }

  function updateMoveCounter() {
    $('#moveCounter').text(moveCount);
  }

  function checkWinCondition() {
    const total = getTotalDisks();
    const tower3Disks = $('#tower3').find('.disk').length;

    if (tower3Disks === total) {
      setTimeout(() => {
        const optimal = getOptimalMoves();
        if (moveCount === optimal) {
          alert(`🎉 Perfect! You solved it in the optimal ${moveCount} moves!`);
        } else {
          alert(`🎉 You won in ${moveCount} moves!\nOptimal: ${optimal} moves.`);
        }
      }, 200);
    }
  }

  function generateDisks(count) {
    const tower1 = $('#tower1');
    tower1.empty();
    $('#tower2, #tower3').empty();

    for (let i = 0; i < count; i++) {
      const disk = $('<div></div>')
        .addClass('disk')
        .addClass(diskStyles[i].class)
        .css({
          width: diskStyles[i].width + 'px',
          backgroundColor: diskStyles[i].color,
          bottom: `${i * 22}px`
        });

      tower1.append(disk);
    }

    moveCount = 0;
    updateMoveCounter();
    updateDraggable();
  }

  function resetGame() {
    generateDisks(getTotalDisks());
  }

  $(document).ready(function () {
    generateDisks(getTotalDisks());

    $('#diskCount').on('change', function () {
      resetGame();
    });

    $(document).on('dragstart', '.disk', function () {
      draggedDisk = $(this);
    });

    $('.tower').on('dragover', function (e) {
      e.preventDefault();
      $(this).addClass('highlight');
    });

    $('.tower').on('dragleave', function () {
      $(this).removeClass('highlight');
    });

    $('.tower').on('drop', function (e) {
      e.preventDefault();
      $(this).removeClass('highlight');

      const targetTower = $(this);
      if (!draggedDisk) return;

      const targetDisks = targetTower.find('.disk');
      const draggedWidth = draggedDisk.outerWidth();
      const topDiskWidth = targetDisks.length > 0 ? targetDisks.last().outerWidth() : Infinity;

      if (draggedWidth < topDiskWidth) {
        draggedDisk.detach().appendTo(targetTower);
        repositionDisks(targetTower);
        repositionDisks(draggedDisk.closest('.tower'));
        updateDraggable();
        moveCount++;
        updateMoveCounter();
        checkWinCondition();
      } else {
        alert("❌ Invalid move! You can't place a larger disk on a smaller one.");
      }

      draggedDisk = null;
    });

    $('#resetBtn').on('click', function () {
      resetGame();
    });
  });