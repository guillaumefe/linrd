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
        let parents = 0
        value = value.split('\n').map( item => {
            parents++
            item = item.trimEnd()
            if(item[item.length-1] === ":") {
                //return item.slice(0, item.length-1) + " (line="+count+parents+"):" + "\n"
                return item.slice(0, item.length-1) + ":" + "\n"
            } else {
                return item + " (line="+count+parents+")" + "\n"
            }
            count++
        }).join('')

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
