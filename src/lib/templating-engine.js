function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

var TemplateEngine = {

    applyTemplate: function (tpl, data, convert) {

        if (tpl instanceof HTMLElement) {
            tpl = tpl.innerHTML;
        }

        if (convert === undefined) convert = function(v) { return v; };

        var converthtml = function(v) {
            if (typeof v === 'string') {
                return htmlEntities(v);
            } else {
                return v;
            }
        }

        var re = /\${([A-Za-z0-9_]+)(?:\.([A-Za-z0-9_]+))*}/g;

        tpl = tpl.replace(re, function (match, p1, p2, p3, offset, input_string) {

            if (data[p1] !== undefined) {
                if (p2 !== undefined) {
                    if (data[p1][p2] !== undefined) {
                        return convert(converthtml(data[p1][p2]));
                    } else {
                        return "";
                    }
                } else {
                    return convert(converthtml(data[p1]));
                }
            } else {
                return "";
            }
        });

        re = /#{([A-Za-z0-9_]+)(?:\.([A-Za-z0-9_]+))*}/g;

        tpl = tpl.replace(re, function (match, p1, p2, p3, offset, input_string) {

            if (data[p1] !== undefined) {
                if (p2 !== undefined) {
                    if (data[p1][p2] !== undefined) {
                        return convert(data[p1][p2]);
                    } else {
                        return "";
                    }
                } else {
                    return convert(data[p1]);
                }
            } else {
                return "";
            }
        });

        return tpl;

    },

    templateOfId: function(tagId) {
        var templateElement = document.getElementById(tagId);
        return templateElement.innerHTML;
    },

    replaceInnerHTML: function(element, tpl, data, convert) {
        element.innerHTML = TemplateEngine.applyTemplate(tpl,data,convert);
    },

    createElement: function(tpl, data, convert) {

        var elementWrapper = document.createElement('div');
        TemplateEngine.replaceInnerHTML(elementWrapper,tpl,data,convert);
        for (var i = 0; i < elementWrapper.childNodes.length; i++) {
            var node = elementWrapper.childNodes[i];
            if (node.nodeType === Node.ELEMENT_NODE) {
                return node;
            }
        }
    },

    fromScriptTag: {
        toClass: {
            append: function(containingElement, elementClass, templateTagId, data, convert) {
                var elements = containingElement.getElementsByClassName(elementClass);
                for (var i = 0; i < elements.length; i++) {
                    var element = elements[0];
                    var newElement = TemplateEngine.createElement(TemplateEngine.templateOfId(templateTagId),data,convert);
                    element.appendChild(newElement);
                }
            },
            replace: function(containingElement, elementClass, templateTagId, data, convert) {

            }
        }
    }

}
