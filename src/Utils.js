export default class Utils {

    /**
     * Перевод разиан в градусы
     * @param rad
     * @returns {number}
     */
    static radToDeg(rad) {
        return (rad * 180) / Math.PI;
    }

    /**
     * Перевод градусов в радианы
     * @param deg
     * @returns {number}
     */
    static degToRad(deg) {
        return (Math.PI * deg) / 180;
    }

    /**
     * Получение случайного целого числа в заданном диапазоне
     * @param min
     * @param max
     * @returns {*}
     */
    static getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * Получение случайного числа в заданном диапазоне
     * @param min
     * @param max
     * @returns {*}
     */
    static getRandom(min, max) {
        return Math.random() * (max - min + 1) + min;
    }

    /**
     *
     * @param angle угол поворота вокруг координат ценра вращения
     * @param x координата x центра вращения
     * @param y координата y центра вращения
     * @param xRadius
     * @param yRadius
     */
    static circleMotion(angle, x, y, xRadius, yRadius) {
        let data = {};
        let rAng = Utils.degToRad(angle % 360);
        data.x = x + xRadius * Math.cos(rAng); // к центру вращениЯ по оси х прибавлЯем произведение косинуса угла поворота и радиуса по оси х и результат присваиваем _x позиции
        data.y = y + yRadius * Math.sin(rAng); // почти также рассчитываем и позицию по оси y
        return data;
    }

    static getUrlParam(parameter, defaultvalue) {
        function getUrlVars() {
            let vars = {};
            let href = decodeURI(window.location.href);
            let parts = href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
                vars[key] = decodeURIComponent(value); //JSON.parse(value);
            });
            return vars;
        }

        let urlparameter = defaultvalue;
        if (window.location.href.indexOf(parameter) > -1) {
            urlparameter = getUrlVars()[parameter];
        }
        return urlparameter;
    }
}