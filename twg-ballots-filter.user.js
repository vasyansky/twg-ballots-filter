// ==UserScript==
// @name        Ballots filter for turbo.jam.gd
// @match       https://turbo.jam.gd/ru/v0/results?view=ballots
// @run-at      document-idle
// @icon        https://static-cdn-tmp.jam.gd/-Wh543e4uqh5swN7uHNYPVKzKEN-TfO4zUni4_7qlc0/f:webp/rs::64:64/czM6Ly9qYW1nZC1zdGF0aWMvYWY4YjRmMTMtZDkxMS00ZDZiLWFkNWItNmRmZTM4YTY0YmUwL2ZhdjY0LndlYnA
// @grant       none
// @version     1.0
// @author      https://github.com/vasyansky
// @description 8/20/2026, 12:00:00 PM
// ==/UserScript==

(function () {
  'use strict';
  let devs = [...document.querySelectorAll('.voting-results__block h2.title a')].map(a => { return decodeURIComponent(a.href.split('/').at(-2)) })
  let games = [...document.querySelectorAll('.voting-results__block:first-of-type .voting-results__internal-block div:first-child strong')].map(s => { return s.textContent.slice(0, -1) })
  devs.sort((a, b) => {
    if (a.toLowerCase() < b.toLowerCase()) return -1
    else if (a.toLowerCase() > b.toLowerCase()) return 1
    else return 0
  })
  games.sort((a, b) => {
    if (a.toLowerCase() < b.toLowerCase()) return -1
    else if (a.toLowerCase() > b.toLowerCase()) return 1
    else return 0
  })
  window.filter_otzyvov = function () {
    let devs = [...document.querySelectorAll('.otzyvy-deva')].filter(dev => dev.querySelector('input').checked).map(dev => dev.querySelector('label').textContent);
    let games = [...document.querySelectorAll('.otzyvy-ob-igre')].filter(dev => dev.querySelector('input').checked).map(dev => dev.querySelector('label').textContent);
    [...document.querySelectorAll('.voting-results__block')].forEach(dev => {
      let devNick = decodeURIComponent(dev.querySelector('h2.title a').href.split('/').at(-2))
      if (devs.includes(devNick)) {
        dev.removeAttribute('style');
        [...dev.querySelectorAll('.voting-results__internal-block')].forEach(game => {
          let gameName = game.querySelector('div strong').textContent.slice(0, -1)
          if (games.includes(gameName)) game.removeAttribute('style')
          else game.setAttribute('style', 'display:none;')
        })
      }
      else dev.setAttribute('style', 'display:none;')
    })
  }
  document.querySelector('aside.turbo-home__pages').setAttribute('style', 'display:flex;flex-direction:column');
  document.querySelector('aside.turbo-home__pages').innerHTML += `
<style>
.filter-otzyvov{
  display: flex;
  flex-direction: column;
  max-height: calc(100vh - 75px - 92px);
  gap: 12px;
  padding: 12px 0;
}
.otzyvy-devov,
.otzyvy-ob-igrah{
  overflow-y:scroll;
  background-color: var(--bulma-scheme-main-bis);
  border: 1px solid var(--bulma-border);
}
.otzyvy-devov div:first-child,
.otzyvy-ob-igrah div:first-child{
  position:sticky;
  top:0;
  background-color:var(--bulma-text-80);
}
.otzyvy-devov div,
.otzyvy-ob-igrah div{
  padding-left:6px;
}
.otzyvy-deva:hover,
.otzyvy-ob-igre:hover{
  background-color:var(--bulma-scheme-main-ter);
}
.otzyvy-deva input:hover,
.otzyvy-deva label:hover,
.otzyvy-ob-igre input:hover,
.otzyvy-ob-igre label:hover{
  cursor:pointer;
}
</style>
<div class="filter-otzyvov">
  <div class="otzyvy-devov">
    <div>Авторы (${devs.length})</div>
    <div><input type="checkbox" id="select-all-devs" checked> <label for="select-all-devs">Выбрать всех<label></div>
    ${devs.reduce((html, dev) => {
    html += `<div class="otzyvy-deva"><input type="checkbox" id="dev-${dev}" oninput="filter_otzyvov()" checked> <label for="dev-${dev}">${dev}<label></div>`
    return html;
  }, '')}
  </div>
  <div class="otzyvy-ob-igrah">
    <div>Игры (${games.length})</div>
    <div><input type="checkbox" id="select-all-games" checked> <label for="select-all-games">Выбрать все<label></div>
    ${games.reduce((html, game) => {
    html += `<div class="otzyvy-ob-igre"><input type="checkbox" id="game-${game}" oninput="filter_otzyvov()" checked> <label for="game-${game}">${game}<label></div>`
    return html;
  }, '')}
  </div>
</div>`
  document.getElementById('select-all-devs').addEventListener('input', (event) => {
    if (event.target.checked) [...document.querySelectorAll('.otzyvy-deva input')].forEach(inp => inp.checked = true)
    else[...document.querySelectorAll('.otzyvy-deva input')].forEach(inp => inp.checked = false)
    filter_otzyvov()
  })
  document.getElementById('select-all-games').addEventListener('input', (event) => {
    if (event.target.checked) [...document.querySelectorAll('.otzyvy-ob-igre input')].forEach(inp => inp.checked = true)
    else[...document.querySelectorAll('.otzyvy-ob-igre input')].forEach(inp => inp.checked = false)
    filter_otzyvov()
  })
})()