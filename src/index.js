import Reveal from 'reveal.js'
import RevealMarkdown from 'reveal.js/plugin/markdown/markdown'
import RevealMath from 'reveal.js/plugin/math/math'
import RevealNotes from 'reveal.js/plugin/notes/notes'
import RevealHighlight from 'reveal.js/plugin/highlight/highlight'
// import 'reveal.js/dist/reset.css'
import 'reveal.js/dist/reveal.css'
import 'reveal.js/plugin/highlight/monokai.css'

// only theme css after this point
// note: this order must match that in webpack.config.js
import 'reveal.js/dist/theme/black.css'
import 'reveal.js/dist/theme/white.css'
import 'reveal.js/dist/theme/league.css'
import 'reveal.js/dist/theme/beige.css'
import 'reveal.js/dist/theme/night.css'
import 'reveal.js/dist/theme/serif.css'
import 'reveal.js/dist/theme/simple.css'
import 'reveal.js/dist/theme/solarized.css'
import 'reveal.js/dist/theme/moon.css'
import 'reveal.js/dist/theme/dracula.css'
import 'reveal.js/dist/theme/sky.css'
import 'reveal.js/dist/theme/blood.css'

window.Reveal = Reveal;
let loaded = new Event("RevealJSLoaded");

// const solarized = require('reveal.js/dist/theme/solarized.css').toString();
// document.getElementById("theme").innerHTML = solarized;

(()=>{
    // select theme based on user preference
    let userTheme = document.querySelectorAll("head style#theme");
    if( userTheme.length != 1 ) {
        console.error("expected a user theme style element (and only one) to be specified");
        return;
    }
    let userThemeName = userTheme[0].getAttribute("data-theme-name");
    if( !userThemeName ) {
        console.error("expected a user theme style element to have data-theme-name");
        return;
    }
    let styles = document.querySelectorAll("head style.revealTheme-" + userThemeName);
    if( styles.length == 0 ) {
        console.error("reveal.js theme '" + userThemeName + "' not found.");
        return;
    }
    console.log("Selected theme: " + userThemeName);
    styles.forEach((e)=>{e.removeAttribute("media")});
    
    Reveal.initialize({
        hashOneBasedIndex: true,
        hash: true,
        history: true,
        plugins: [ RevealMarkdown, RevealMath.KaTeX, RevealHighlight, RevealNotes ]
    });
    window.dispatchEvent(loaded);
})();
