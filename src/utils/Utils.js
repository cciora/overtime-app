export default {
    queryParam: (label, value, first) => {
        return (first ? '' : ', ') + label + ': "' + (value ? value : '') + '"';
        return str;
    }
}