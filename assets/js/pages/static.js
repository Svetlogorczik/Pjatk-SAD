/*
 * pages/static.js — simple content pages: study tips, Excel guide, about.
 */
(function (SAD) {
  'use strict';

  SAD.pages.tips = function (view) { SAD.pages.markupPage(view, 'tips'); };
  SAD.pages.excel = function (view) { SAD.pages.markupPage(view, 'excel'); };
  SAD.pages.about = function (view) { SAD.pages.markupPage(view, 'about'); };
})(window.SAD);
