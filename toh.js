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
    const topDisk = $(this).find('.disk').last();
    if (topDisk.length) {
      topDisk.attr('draggable', true);
    }
  });
}


function repositionDisks(tower) {
  tower.find('.disk').each((index, disk) => {
    $(disk).css('bottom', `${index * 22}px`);
  });
}


function updateMoveCounter() {
  $('#moveCounter').text(moveCount);
}

function checkWinCondition() {
  const totalDisks = getTotalDisks();
  const optimalMoves = getOptimalMoves();

  ['#tower1', '#tower2', '#tower3'].forEach(towerSelector => {
    if ($(towerSelector).find('.disk').length === totalDisks) {
      setTimeout(() => {
        const message = (moveCount === optimalMoves)
          ? `🎉 Perfect! You solved it in the optimal ${moveCount} moves!`
          : `🎉 You won in ${moveCount} moves!\nOptimal: ${optimalMoves} moves.`;
        alert(message);
      }, 200);
    }
  });
}


function generateDisks(count) {
  const tower1 = $('#tower1');
  tower1.empty();
  $('#tower2, #tower3').empty();

  const minWidth = 40;
  const maxWidth = 150;
  const step = (maxWidth - minWidth) / (count - 1);
  const widths = [];

  for (let i = 0; i < count; i++) {
    widths.push(maxWidth - i * step);
  }

  widths.sort((a, b) => b - a);

  widths.forEach((width, i) => {
    const color = getRandomColor();
    const disk = $('<div></div>')
      .addClass('disk')
      .css({
        width: `${width}px`,
        backgroundColor: color,
        bottom: `${i * 22}px`,
        textAlign: 'center',
        lineHeight: '20px',
        color: 'black'
      })
      .text(count - i);

    tower1.append(disk);
  });

  moveCount = 0;
  updateMoveCounter();
  updateDraggable();
}


function getRandomColor() {
  return '#' + Array.from({ length: 6 }, () =>
    '0123456789ABCDEF'[Math.floor(Math.random() * 16)]
  ).join('');
}
function resetGame() {
  generateDisks(getTotalDisks());
}



$(document).ready(function () {
  generateDisks(getTotalDisks());

  $('#diskCount').on('change', resetGame);
  $('#resetBtn').on('click', resetGame);

  $(document).on('dragstart', '.disk', function () {
    draggedDisk = $(this);
  });

  $('.tower').on('dragover', function (e) {
    e.preventDefault();

    if (!draggedDisk) return;

    const targetTower = $(this);
    const targetDisks = targetTower.find('.disk');
    const draggedWidth = draggedDisk.outerWidth();
    const topDiskWidth = targetDisks.last().outerWidth() || Infinity;

    if (draggedWidth < topDiskWidth) {
      const originTower = draggedDisk.closest('.tower');

      draggedDisk.detach().appendTo(targetTower);

      repositionDisks(originTower);
      repositionDisks(targetTower);

      moveCount++;
      updateMoveCounter();
      updateDraggable();
      checkWinCondition();

      draggedDisk = null;
    }
  });

  $('.tower').on('dragleave', function () {
    $(this).removeClass('highlight');
  });
});
