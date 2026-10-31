const { chromium } = require('playwright');
(async()=>{const [,,src,out,w,h]=process.argv;const b=await chromium.launch();const p=await b.newPage({viewport:{width:+w||1240,height:+h||1600}});await p.goto('file://'+src);await p.waitForTimeout(500);await p.screenshot({path:out,fullPage:true});await b.close();})();
