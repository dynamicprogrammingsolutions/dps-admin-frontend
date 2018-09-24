import $ from 'jquery'
import {loadControllers} from '../controller-loader';

export default e => {

    console.log("menu init");

    var content = $(e.dataset.content)[0];
    var notFound = $(e.dataset.notFound)[0];
    var load = (e) => {
        var view = e.dataset.view;
        var loader = $(content).siblings(".ui.loader");
        loader.addClass("active");
        $(content).load(view,null,(r,s,xhr) => {
            if (xhr.status === 404) {
                console.log("page not found: ",view);
                content.innerHTML = notFound.innerText;
            }
            loader.removeClass("active");
            console.log(content);
            loadControllers(content);
        });
    }
    var links = $(e).find("a[data-view]");
    links.each((i,e) => {
        if (window.location.hash === e.getAttribute("href")) {
            load(e);
        }
    })
    links.click((event) => {
        load(event.target);
    })

}