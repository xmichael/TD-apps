//import {gettext, get_transtext} from './mf_i18n.js';
// temp dummy function until i18n is in place
function get_transtext(str){
    return str;
}


/** legend html for LU  */


var html_legend_cycleways =`
      <div class="d-flex flex-row justify-content-center">
        <h5>${get_transtext("Legend")}</h5>
      </div>
      <div class="d-flex flex-row">
          <div class="d-flex flex-column mr-3 border-right">
                <div>
                  <svg width="20" height="30" class="mr-2">
                    <line x1="0" x2="20" y1="12" y2="12" stroke="red" stroke-width="5"/>
                  </svg>${get_transtext("Dyfi Boundary")}
                </div>
                <div>
                  <svg width="20" height="30" class="mr-2">
                    <line x1="0" x2="20" y1="12" y2="12" stroke="blue" stroke-width="5"/>
                  </svg>${get_transtext("Cycleways")}
                </div>
          </div>
    </div>
`;

export {html_legend_cycleways};
