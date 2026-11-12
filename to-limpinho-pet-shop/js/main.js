// Tô Limpinho Pet Shop — site por EDVSP
(function () {
  'use strict';

  // Número do WhatsApp (somente dígitos, com 55 + DDD)
  var WHATSAPP = '5519981615300';
  var MSG_PADRAO = 'Olá! Vim pelo site e gostaria de agendar um horário para o meu pet.';

  function linkWhats(texto) {
    return 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(texto);
  }

  // Links do WhatsApp com a mensagem já preenchida (atributo data-wa).
  // Sem JavaScript, os links continuam abrindo a conversa, só que sem a mensagem.
  document.querySelectorAll('a[data-wa]').forEach(function (a) {
    a.href = linkWhats(a.dataset.wa);
  });

  // ---------- Menu no celular ----------
  var btn = document.querySelector('.menu-btn');
  var nav = document.getElementById('menu');
  function setMenu(open) {
    nav.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  }
  btn.addEventListener('click', function () {
    setMenu(btn.getAttribute('aria-expanded') !== 'true');
  });
  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) setMenu(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setMenu(false);
  });

  // ---------- Montador de agendamento ----------
  var previa = document.getElementById('previa');
  var enviar = document.getElementById('enviar');

  function escolhidos(grupo) {
    return Array.prototype.map.call(
      document.querySelectorAll('[data-group="' + grupo + '"] .chip[aria-pressed="true"]'),
      function (c) { return c.textContent.trim(); }
    );
  }
  function juntar(lista) {
    if (lista.length < 2) return lista.join('');
    return lista.slice(0, -1).join(', ') + ' e ' + lista[lista.length - 1];
  }
  function atualizarMensagem() {
    var servicos = escolhidos('servico').map(function (s) { return s.toLowerCase(); });
    var porte = escolhidos('porte')[0];
    var transporte = escolhidos('transporte')[0];
    var msg = MSG_PADRAO;

    if (servicos.length || porte || transporte) {
      msg = 'Olá! Vim pelo site e gostaria de agendar ' +
        (servicos.length ? juntar(servicos) : 'um horário') + ' para o meu pet';
      msg += porte ? ' de porte ' + porte.toLowerCase() + '.' : '.';
      if (transporte === 'Levo até a loja') msg += ' Eu levo ele até a loja.';
      if (transporte === 'Quero entrega e retirada') msg += ' Gostaria de entrega e retirada.';
      msg += ' Quais horários vocês têm?';
    }
    previa.textContent = msg;
    enviar.href = linkWhats(msg);
    previa.classList.remove('pop');
    void previa.offsetWidth; // reinicia a animação
    previa.classList.add('pop');
  }
  document.querySelectorAll('.chips').forEach(function (grupo) {
    var multi = grupo.hasAttribute('data-multi');
    grupo.addEventListener('click', function (e) {
      var chip = e.target.closest('.chip');
      if (!chip) return;
      var ligado = chip.getAttribute('aria-pressed') === 'true';
      if (!multi) {
        grupo.querySelectorAll('.chip').forEach(function (c) { c.setAttribute('aria-pressed', 'false'); });
      }
      chip.setAttribute('aria-pressed', String(!ligado));
      atualizarMensagem();
    });
  });

  // ---------- Entrada suave das seções ao rolar ----------
  var itens = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); obs.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    itens.forEach(function (el) { obs.observe(el); });
  } else {
    itens.forEach(function (el) { el.classList.add('in'); });
  }

  // ---------- Holofote suave atrás da patinha (só com mouse) ----------
  var hero = document.querySelector('.hero');
  var glow = document.querySelector('.glow');
  if (hero && glow && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    hero.addEventListener('pointermove', function (e) {
      var r = glow.getBoundingClientRect();
      glow.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
      glow.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
    });
  }

  // Ano do rodapé
  var ano = document.getElementById('ano');
  if (ano) ano.textContent = new Date().getFullYear();
})();
