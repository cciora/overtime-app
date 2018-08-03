export default {
    queryParam: (label, value, first) => {
        return (first ? '' : ', ') + label + ': "' + (value ? value : '') + '"';
    },

    queryParamStrArray: (label, arr, first) => {
        var str = (first ? '' : ', ') + label + ': [';
        for (var i=0; i<arr.length; i++){
            if (i > 0) {
                str += ', ';
            }
            str += '"' + arr[i] + '"';
        }
        str += ']';
        return str;
    }
}
