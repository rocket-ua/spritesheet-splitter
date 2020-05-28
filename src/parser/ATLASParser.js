export default new class ATLASParser {
    constructor() {

    }

    parse(atlasTxt) {
        let parentAttributes = ['format', 'filter', 'repeat'];
        let childAttributes = ['rotate', 'xy', 'size', 'split', 'orig', 'offset', 'index'];
        let str = '';

        //identify parent nodes
        str = atlasTxt.replace(/\n([^\:\n]+)\n([a-z0-9\\_]+)\:(.+)\n{0,1}/gm, function () {
            let ret = '###' + arguments[1] + '###:{\n';   //use ### to discriminate parent node
            ret += arguments[2] + ':' + arguments[3] + '\n';
            return ret;
        });

        //identify children nodes
        str = str.replace(/\n([^\:#]+)\n/g, function () {
            let ret = '\n';
            ret += '##' + arguments[1].replace(/[\n\s]+/g, '') + '## : {\n'; //use ## to discriminate child node
            return ret;
        });

        //parse couples  
        str = str.replace(/([a-z0-9\\_]+)\:(.+)\n{0,1}/g, function (match, left, right) {

            let numMatch = right.match(/[0-9\-\.]+/g);
            let boolMatch = right.match(/(true|false)+/gi);
            let strMatch = right.match(/([a-z_\\\/])+/gi);

            right = right.replace(/\s+/, ''); //clean spaces

            if (strMatch && !boolMatch) {
                return '"' + left + '":"' + right + '",\n';
            }

            if (boolMatch || (numMatch && numMatch.length == 1)) {
                return '"' + left + '":' + right + ',\n';
            }

            if (numMatch && numMatch.length > 1) {
                return '"' + left + '": [' + right + '],\n';
            }
            return '"' + left + '":"' + right + '",\n';

        });

        //back to parent nodes
        let first = true;
        str = str.replace(/(###[^\:]+###)/g, function () {

            let ret = first ? '' : '}\n}\n},\n';
            ret += '"' + arguments[1].replace(/#{3}/g, '') +'"';

            first = false;
            return ret;
        });

        //back to child nodes
        str = str.replace(/([^\:,]+):([^\:]+),\n+(##[^\:]+##)/gm, function () {
            let left = arguments[1].replace(/[\"\n\s]+/g, '');
            let ret = arguments[0];


            //are we switching from a parent node attributes to frames definition ?
            if (parentAttributes.indexOf(left) > -1) {
                ret = arguments[1] + ':' + arguments[2] + ',\n';
                ret += '"frames" : {\n' + arguments[3];
            }
            else {
                ret = arguments[1] + ':' + arguments[2] + '},\n';
                ret += arguments[3];
            }
            return ret;
        });


        str += '\n}\n}}';

        str = str.replace(/,([\s\n\t\r])+}/g, "$1}");
        str = str.replace(/"[\s\n\t\r]+(.+)/g, "\"$1");
        str = str.replace(/#{2}/g, '"'); //fix children

        str = "{" + str + "}"; //wrap JSON

        //return str;
        return JSON.parse(str);
    }
}
