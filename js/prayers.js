/* Prayer texts, mystery data, and the step-by-step sequence builder. */
(function () {
  var prayers = {
    cross: {
      title: 'Sign of the Cross',
      text: 'In the name of the Father, and of the Son, and of the Holy Spirit. Amen.'
    },
    creed: {
      title: 'Apostles’ Creed',
      text: 'I believe in God, the Father almighty, Creator of heaven and earth; and in Jesus Christ, His only Son, our Lord, who was conceived by the Holy Spirit, born of the Virgin Mary, suffered under Pontius Pilate, was crucified, died, and was buried; He descended into hell; on the third day He rose again from the dead; He ascended into heaven, and is seated at the right hand of God the Father almighty; from there He will come to judge the living and the dead. I believe in the Holy Spirit, the holy Catholic Church, the communion of saints, the forgiveness of sins, the resurrection of the body, and life everlasting. Amen.'
    },
    ourfather: {
      title: 'Our Father',
      text: 'Our Father, who art in heaven, hallowed be thy name; thy kingdom come; thy will be done on earth as it is in heaven. Give us this day our daily bread; and forgive us our trespasses as we forgive those who trespass against us; and lead us not into temptation, but deliver us from evil. Amen.'
    },
    hailmary: {
      title: 'Hail Mary',
      text: 'Hail Mary, full of grace, the Lord is with thee; blessed art thou among women, and blessed is the fruit of thy womb, Jesus. Holy Mary, Mother of God, pray for us sinners, now and at the hour of our death. Amen.'
    },
    glory: {
      title: 'Glory Be',
      text: 'Glory be to the Father, and to the Son, and to the Holy Spirit, as it was in the beginning, is now, and ever shall be, world without end. Amen.'
    },
    fatima: {
      title: 'Fatima Prayer',
      text: 'O my Jesus, forgive us our sins, save us from the fires of hell, lead all souls to heaven, especially those most in need of thy mercy.'
    },
    queen: {
      title: 'Hail, Holy Queen',
      text: 'Hail, Holy Queen, Mother of mercy, our life, our sweetness and our hope. To thee do we cry, poor banished children of Eve; to thee do we send up our sighs, mourning and weeping in this valley of tears. Turn then, most gracious advocate, thine eyes of mercy toward us, and after this our exile, show unto us the blessed fruit of thy womb, Jesus. O clement, O loving, O sweet Virgin Mary.\n\nV. Pray for us, O holy Mother of God.\nR. That we may be made worthy of the promises of Christ.'
    },
    closing: {
      title: 'Closing Prayer',
      text: 'Let us pray. O God, whose only-begotten Son, by His life, death, and resurrection, has purchased for us the rewards of eternal life, grant, we beseech thee, that meditating upon these mysteries of the most holy Rosary of the Blessed Virgin Mary, we may imitate what they contain and obtain what they promise, through the same Christ our Lord. Amen.'
    }
  };

  /* Latin texts follow https://www.prayinglatin.com/prayers-of-the-rosary-in-latin/
     (accent marks are pronunciation aids and are kept as published there). */
  var latin = {
    cross: {
      title: 'Signum Crucis',
      text: 'In nomine Patris, et Filii, et Spiritus Sancti. Amen.'
    },
    creed: {
      title: 'Symbolum Apostolorum',
      text: 'Credo in Deum Patrem omnipoténtem, Creatórem cæli et terræ, et in Iesum Christum, Fílium eius únicum, Dóminum nostrum, qui concéptus est de Spíritu Sancto, natus ex María Vírgine, passus sub Póntio Piláto, crucifíxus, mórtuus, et sepúltus; descéndit ad ínferos; tértia die resurréxit a mórtuis; ascéndit ad cælos, sedet ad déxteram Dei Patris omnipoténtis; inde ventúrus est iudicáre vivos et mórtuos. Credo in Spíritum Sanctum, sanctam Ecclésiam cathólicam, sanctórum communiónem, remissiónem peccatórum, carnis resurrectiónem, vitam ætérnam. Amen.'
    },
    ourfather: {
      title: 'Pater Noster',
      text: 'Pater noster, qui es in cælis, sanctificétur nomen tuum. Advéniat regnum tuum, fiat volúntas tua, sicut in cælo, et in terra. Panem nostrum quotidiánum da nobis hódie, et dimítte nobis débita nostra sicut et nos dimíttimus debitóribus nostris. Et ne nos indúcas in tentatiónem, sed líbera nos a malo. Amen.'
    },
    hailmary: {
      title: 'Ave Maria',
      text: 'Ave María, grátia plena, Dóminus tecum; benedícta tu in muliéribus, et benedíctus fructus ventris tui, Iesus. Sancta María, Mater Dei, ora pro nobis peccatóribus, nunc, et in hora mortis nostræ. Amen.'
    },
    glory: {
      title: 'Doxologia Minor',
      text: 'Glória Patri, et Fílio, et Spirítui Sancto. Sicut erat in princípio, et nunc, et semper, et in sæcula sæculórum. Amen.'
    },
    fatima: {
      title: 'Oratio Fatima',
      text: 'Dómine Jesu, dimitte nobis débita nostra, salva nos ab igne inferni; perduc in caelum omnes ánimas, praesertim eas, quae misericórdiae tuae máxime indigent.'
    },
    queen: {
      title: 'Salve Regina',
      text: 'Salve Regína, mater misericórdiæ; vita, dulcédo, et spes nostra, salve; ad te clamámus éxsules fílii Evæ, ad te suspirámus, geméntes et flentes in hac lacrimárum valle. Eia ergo, advocáta nostra, illos tuos misericórdes óculos ad nos convérte: et Iesum, benedíctum fructum ventris tui, nobis post hoc exsílium osténde. O clemens, o pia, o dulcis Virgo María.\n\nV. Ora pro nobis, Sancta Dei Genetrix.\nR. Ut digni efficiamur promissiónibus Christi.'
    },
    closing: {
      title: 'Oratio ad Finem Rosarii Dicenda',
      text: 'Oremus. Déus, cújus Unigénitus per vítam, mortem, et resurrectiónem Súam nóbis salútis ætérnæ præmia comparávit: concéde, quæsumus: ut hæc mystéria sacratíssimo beátæ Maríæ Vírginis Rosário recoléntes, et imitémur quod cóntinent, et quod promíttunt, assequámur, per eúndem Chrístum Dóminum nóstrum. Amen.'
    }
  };

  function m(title, scripture, fruit) { return { title: title, scripture: scripture, fruit: fruit }; }

  var sets = {
    joyful: { name: 'Joyful', mysteries: [
      m('The Annunciation', 'Luke 1:26–38', 'Humility'),
      m('The Visitation', 'Luke 1:39–56', 'Love of neighbor'),
      m('The Nativity', 'Luke 2:1–20', 'Poverty of spirit'),
      m('The Presentation', 'Luke 2:22–38', 'Obedience'),
      m('The Finding in the Temple', 'Luke 2:41–52', 'Joy in finding Jesus')
    ] },
    luminous: { name: 'Luminous', mysteries: [
      m('The Baptism of Jesus', 'Matthew 3:13–17', 'Openness to the Holy Spirit'),
      m('The Wedding at Cana', 'John 2:1–12', 'To Jesus through Mary'),
      m('The Proclamation of the Kingdom', 'Mark 1:14–15', 'Repentance and trust in God'),
      m('The Transfiguration', 'Matthew 17:1–8', 'Desire for holiness'),
      m('The Institution of the Eucharist', 'Luke 22:14–20', 'Adoration')
    ] },
    sorrowful: { name: 'Sorrowful', mysteries: [
      m('The Agony in the Garden', 'Matthew 26:36–46', 'Sorrow for sin'),
      m('The Scourging at the Pillar', 'Matthew 27:24–26', 'Purity'),
      m('The Crowning with Thorns', 'Matthew 27:27–31', 'Courage'),
      m('The Carrying of the Cross', 'John 19:16–17', 'Patience'),
      m('The Crucifixion', 'Luke 23:33–46', 'Salvation')
    ] },
    glorious: { name: 'Glorious', mysteries: [
      m('The Resurrection', 'Matthew 28:1–10', 'Faith'),
      m('The Ascension', 'Acts 1:6–11', 'Hope'),
      m('The Descent of the Holy Spirit', 'Acts 2:1–4', 'Love of God'),
      m('The Assumption of Mary', 'Revelation 11:19–12:1', 'Grace of a happy death'),
      m('The Coronation of Mary', 'Revelation 12:1', 'Trust in Mary’s intercession')
    ] }
  };

  // Sunday = 0
  var daySets = ['glorious', 'joyful', 'sorrowful', 'glorious', 'luminous', 'sorrowful', 'joyful'];
  var ordinals = ['First', 'Second', 'Third', 'Fourth', 'Fifth'];

  function dayNumber(y, m, d) { return Math.round(Date.UTC(y, m, d) / 86400000); }

  // Gregorian Easter (Meeus/Jones/Butcher algorithm), as a day number.
  function easterDay(y) {
    var a = y % 19, b = Math.floor(y / 100), c = y % 100;
    var d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25);
    var g = Math.floor((b - f + 1) / 3);
    var h = (19 * a + b - d - g + 15) % 30;
    var i = Math.floor(c / 4), k = c % 4;
    var l = (32 + 2 * e + 2 * i - h - k) % 7;
    var m = Math.floor((a + 11 * h + 22 * l) / 451);
    var month = Math.floor((h + l - 7 * m + 114) / 31); // 3 = March, 4 = April
    var day = ((h + l - 7 * m + 114) % 31) + 1;
    return dayNumber(y, month - 1, day);
  }

  /* Weekdays follow the usual pattern. Sundays are Glorious, with two long-standing customs:
     the Joyful Mysteries from Advent through the Christmas season, and the Sorrowful Mysteries
     in Lent. (The Christmas season is approximated as ending on 8 January.) */
  function setInfoFor(date) {
    var weekday = date.getDay();
    if (weekday !== 0) return { key: daySets[weekday], note: '' };

    var y = date.getFullYear();
    var today = dayNumber(y, date.getMonth(), date.getDate());
    var easter = easterDay(y);
    if (today >= easter - 46 && today < easter) {
      return { key: 'sorrowful', note: 'Sundays in Lent are traditionally prayed with the Sorrowful Mysteries.' };
    }

    var christmas = dayNumber(y, 11, 25);
    var christmasWeekday = new Date(y, 11, 25).getDay();
    var fourthSunday = christmas - (christmasWeekday === 0 ? 7 : christmasWeekday);
    var adventStart = fourthSunday - 21;
    var inChristmasSeason = date.getMonth() === 0 && date.getDate() <= 8;
    if (today >= adventStart || inChristmasSeason) {
      return { key: 'joyful', note: 'Sundays in Advent and the Christmas season are traditionally prayed with the Joyful Mysteries.' };
    }
    return { key: 'glorious', note: '' };
  }

  function todaySet(date) { return setInfoFor(date || new Date()).key; }
  function todayNote(date) { return setInfoFor(date || new Date()).note; }

  /* Every set has the same shape, so the step count is always the same.
     `bead` ids match data-bead in rosary-svg.js. */
  function buildSteps(setKey) {
    var set = sets[setKey];
    var steps = [];
    function add(prayer, extra) {
      var s = { prayer: prayer };
      for (var k in extra) s[k] = extra[k];
      steps.push(s);
    }

    var intro = 'Opening prayers';
    add('cross', { section: intro, bead: 'cross' });
    add('creed', { section: intro, bead: 'cross' });
    add('ourfather', { section: intro, bead: 't-large' });
    for (var n = 1; n <= 3; n++) {
      add('hailmary', {
        section: intro, bead: 't-s' + n, count: n + ' of 3',
        note: 'Offered for an increase in faith, hope, and charity.',
        noteLa: 'Ad augmentum fidei, spei, et caritatis.'
      });
    }
    add('glory', { section: intro, bead: 't-glory' });

    set.mysteries.forEach(function (mys, d) {
      var section = ordinals[d] + ' decade';
      // The first Our Father is said on the medal. The others are said on the four
      // large beads between decades (l-10, l-21, l-32, l-43). The fifth decade ends on
      // a small bead (l-53) beside the medal, with no large bead after it.
      var ourFather = d === 0 ? 'medal' : 'l-' + (d * 11 - 1);
      var first = d * 11;
      var lastSmall = 'l-' + (first + 9);
      steps.push({ kind: 'mystery', section: section, bead: ourFather, mystery: mys, ordinal: ordinals[d], setName: set.name });
      add('ourfather', { section: section, bead: ourFather, mystery: mys });
      for (var i = 0; i < 10; i++) {
        add('hailmary', { section: section, bead: 'l-' + (first + i), count: (i + 1) + ' of 10', mystery: mys });
      }
      add('glory', { section: section, bead: lastSmall, mystery: mys });
      add('fatima', { section: section, bead: lastSmall, mystery: mys });
    });

    var outro = 'Closing prayers';
    add('queen', { section: outro, bead: 'medal' });
    add('closing', { section: outro, bead: 'medal' });
    add('cross', { section: outro, bead: 'cross' });
    steps.push({ kind: 'done', section: 'Complete', bead: 'cross' });
    return steps;
  }

  window.ROSARY = { prayers: prayers, latin: latin, sets: sets, todaySet: todaySet, todayNote: todayNote, buildSteps: buildSteps };
})();