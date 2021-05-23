import yaml from "js-yaml"

//==============pipelinr===============

/**
 * Perform a deeply recursive reduce on a set of JSON, or a JSON-encodable Object hierarchy.
 *
 * @param  {Array|Object} collection
 * @param  {Function}     fn
 * @param  {*}            memo
 * @return {*}
 */
function deepReduce(collection, fn, memo) {

  /**
   * @inner
   * @param  {*} value
   * @param  {String[]} path
   * @return {*}
   */
  function iterator(value, path) {
    var type = Object.prototype.toString.call(value);

    memo = fn(memo, value, path);

    if (type === '[object Array]') {
      for (var i = 0, len = value.length; i < len; i++) {
        iterator(value[i], path.concat(i));
      }
    } else if (type === '[object Object]') {
      for (var key in value) {
        iterator(value[key], path.concat(key));
      }
    }
    return memo;
  }

  return iterator(collection, []);

}

export function loadYaml(value = "") {

        let count = 0
        value = value.split('\n').map( item => {
            let out = ""
            count++
            item = item.trimEnd()
            if(item[item.length-1] === ":" || item[item.length-1] === "|" || item[item.length-1] === ">") {
                if (item[item.length-1] === "|" || item[item.length-1] === ">") {
                    const tmp = item.slice(0, item.length-1).trimEnd()
                    if (tmp[tmp.length-1] == ":") {
                        out = item.slice(0, item.length-1) + " |"
                    } else {
                        const tmp2 = tmp.split(":")
                        if (tmp2.length > 0 && tmp2[1] && tmp2[1].match("&")){
                            const tmp3 = item.split(":")
                            out = tmp3[0] + " (type=document)" + ":" + tmp3[1]
                        } else {
                            out = item.slice(0, item.length)
                        }
                    }
                } else {
                    out= item.slice(0, item.length)
                }
            } else {
                if (item.trimStart()[2] === "*") {
                    out = item.slice(0, item.length)
                } else if (item) {
                    const tmp = item.trimEnd().split(":")
                    if (tmp.length > 0 && tmp[1] && tmp[1].match("&")){
                        const tmp2 = item.split(":")
                        out = tmp2[0] + " (type=recipe)" + ":" + tmp2[1]
                    } else {
                        out = item + " (line="+count+")"
                    }
                }
            }
            return out
        }).join('\n')

        return new Promise((onResolve, onReject)=>{
            try {
                yaml.loadAll(value, function (doc) {
                    let count = 0;
                    const output = deepReduce(doc, (memo, value, path) => {
                        if (value && typeof value === "string") {
                            const regExp = /\(([^)]+)\)/g;
                            var matches = [], params = {} , m;
                            while(m=regExp.exec(value)) {
                                matches.push(m[1]);
                            }
                            matches = matches.map( item => {
                                const parts = item.split('=')
                                const part1 = parts[0].toString()
                                const part2 = parts[1].toString()
                                params[part1] = part2   
                            })
                            const regex = /\(.*\)/gi;
                            value = value.replace(regex, '').trimEnd()
                            const task = {
                                ...params,
                                key: count++,
                                done: (value[value.length-1] === "-" && value[value.length-2] === "-") ? true: false,
                                delay: (value[value.length-1] === "-" && value[value.length-2] === "*" ) ? true: false,
                                cancel: (value[value.length-1] === "-" && value[value.length-2] === "x" ) ? true: false,
                                await: (value[value.length-1] === "-" && value[value.length-2] === "&" ) ? true: false,
                                path: path.filter( x => isNaN(x)),
                                value
                            }
                            if(!task.done && !task.cancel) 
                                memo.push(task)
                        }
                        return memo
                    }, []);
                    onResolve(output)
                });
            } catch(e) {
                onReject(e)
            }
        })
}
