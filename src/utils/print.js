import $ from "jquery";
import { getPageSizePx, getPageSize, mmToPx } from "utils/page";
import { IMAGE_SIZE_DISPLAY } from "config/paperSize";

export function PrintElem(elem, callback) {
	const pageDefaultMM = getPageSize();
	const pageSize = getPageSizePx();
  let styleHtml = $("style")[0].outerHTML;
  let htmlContent = document.getElementById(elem).outerHTML;
  var mywindow = window.open(
    "",
    "PRINT",
    `width=${pageSize.width},height=${pageSize.height}`
  );
  const percentReal = pageDefaultMM.circleSize / IMAGE_SIZE_DISPLAY;
  const percentAbtract = 1 - percentReal;
  const distanceAbtract = percentAbtract * IMAGE_SIZE_DISPLAY / 2;

  const pxDistanceAbtract = mmToPx(distanceAbtract);

  let htmlDocument = `
		<html>
			<head>
				<title>Print</title>
				${styleHtml}
				<style>
				    #paperSize{
				      width: ${pageSize.height}px;
				      height: ${pageSize.width}px;
				      background-color: red;
				      position: relative;
				    }
				    #imageWrap{
				      position: absolute;
				      right: ${pageSize.paddingRight - pxDistanceAbtract}px;
				      bottom: ${pageSize.paddingBottom - pxDistanceAbtract}px;
				    }
				    #imageResize{
				      transform: scale(${pageDefaultMM.circleSize / IMAGE_SIZE_DISPLAY});
				      transform-origin: center center;
				    }
				    html, body, div, span, applet, object, iframe,
            h1, h2, h3, h4, h5, h6, p, blockquote, pre,
            a, abbr, acronym, address, big, cite, code,
            del, dfn, em, img, ins, kbd, q, s, samp,
            small, strike, strong, sub, sup, tt, var,
            b, u, i, center,
            dl, dt, dd, ol, ul, li,
            fieldset, form, label, legend,
            table, caption, tbody, tfoot, thead, tr, th, td,
            article, aside, canvas, details, embed, 
            figure, figcaption, footer, header, hgroup, 
            menu, nav, output, ruby, section, summary,
            time, mark, audio, video {
              margin: 0;
              padding: 0;
              border: 0;
              font-size: 100%;
              font: inherit;
              vertical-align: baseline;
            }
            /* HTML5 display-role reset for older browsers */
            article, aside, details, figcaption, figure, 
            footer, header, hgroup, menu, nav, section {
              display: block;
            }
            body {
              line-height: 1;
            }
            ol, ul {
              list-style: none;
            }
            blockquote, q {
              quotes: none;
            }
            blockquote:before, blockquote:after,
            q:before, q:after {
              content: '';
              content: none;
            }
            table {
              border-collapse: collapse;
              border-spacing: 0;
            }
        </style>
			</head>	
			<body>
			<div id="paperSize">
			<div id="imageWrap">
			  ${htmlContent}
			</div>
      </div>
		</body>
	  </html>
  `;

  mywindow.onafterprint = function() {
    callback();
  };
  mywindow.document.write(htmlDocument);
  mywindow.document.close(); // necessary for IE >= 10
  mywindow.focus(); // necessary for IE >= 10*/
  setTimeout(() => {
    mywindow.print();
    setTimeout(() => {
      mywindow.close();
      callback();
    }, 100);
  }, 200);

  return true;
}
