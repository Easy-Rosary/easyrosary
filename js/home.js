(function () {
  var R = window.ROSARY;
  window.buildRosary(document.getElementById('hero-beads'));

  var key = R.todaySet();
  var set = R.sets[key];
  var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  document.getElementById('today-sub').textContent =
    R.todayNote() || days[new Date().getDay()] + ' is for the ' + set.name + ' Mysteries.';

  var list = document.getElementById('today-list');
  set.mysteries.forEach(function (mys) {
    var li = document.createElement('li');
    var title = document.createElement('strong');
    var ref = document.createElement('span');
    title.textContent = mys.title;
    ref.textContent = mys.scripture;
    li.appendChild(title);
    li.appendChild(ref);
    list.appendChild(li);
  });

  var cta = document.getElementById('today-cta');
  cta.href = 'pray?set=' + key;
  cta.textContent = 'Pray the ' + set.name + ' Mysteries';
})();