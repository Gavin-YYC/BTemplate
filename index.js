const tpl = require('./tpl');
const data = require('./data');


// 配置
const defaults = {
    openTag: "{{",
    closeTag: "}}",
    compress: false,
    escape: true
};


const template = function ( tpl, data ) {
   return compile( tpl ); 
};

const toString = function ( value, type ) {
    if ( typeof value !== 'string' ) {
        type = typeof value;
        if ( type === 'number' ) {
            value += '';
        } else if ( type === 'function' ) {
            value = toString( value.call( value ) );
        } else {
            value = '';
        }
    }
    return value;
}


const isArray = Array.isArray || function ( obj ) {
    return [].toString.call( obj ) === '[object Array]';
}


const each = function ( data, callback ) {
    if ( isArray( data ) ) {
        for ( let i = 0, len = data.length; i < len; i++ ) {
            callback.call( data, data[i], i, data );
        }
    } else {
        for ( let i in data ) {
            callback.call( data, data[i], i );
        }
    }
}

const utils = template.$utils = {
    $string: toString
}

const helpers = template.$helpers = {
    
}

let mainCode = 'var $out = "";';
let headerCode = '"use strict"; var $utils = this;';
let footerCode = 'return new String( $out );';

// 编译
const compile = template.compile = function ( tpl ) {
    const openTag = defaults.openTag;
    const closeTag = defaults.closeTag;

    // html与逻辑语法分离
    tpl.split( openTag ).forEach( code => {

        code = code.split( closeTag );
        
        const $1 = code[0];
        const $2 = code[1];

        // 纯html片段 [html]
        if ( code.length === 1 ) {
           mainCode += html( $1 ); 

        // 业务逻辑 + html片段 [logic, html] 
        } else {

            mainCode += logic( $1 );
            mainCode += html( $2 );

        }
    });

    const code = headerCode + mainCode +footerCode;
    const Render = new Function( "$data", "$filename", code );
    return Render;
};


function parser ( code ) {

    code = code.replace( /^\s+/, '' );
    const split = code.split(' ');
    const key = split.shift();
    const args = split.join(' ');
    const escape = defaults.escape;

    switch ( key ) {
        case "if":
            code = 'if ( ' + args + ' ) {';
            break;

        // else 有两种情况
        // 1、else if ()
        // 2、else 
        case "else":
            if ( split.shift() === 'if' ) {
                code = '} else if (' + split.join(' ') + ') {';
            } else {
                code = '} else {'
            }
            break;
        
        case "/if":
            code = '}';
            break;

        case "each":
            const object = split[0] || '$data';
            const as = split[1] || 'as';
            const value = split[2] || '$value';
            const index = split[3] || '$index';

            code = '$each( ' + object + ', function ( ' + value + ', ' + index + ' ) {';
            break;

        case "/each":
            code = '});';
            break;

        // 除上述情况外，其他为变量输出
        // 对变量输出，需要先处理过滤器
        // 另外，变量输出需要进行
        default:
            // helper
            
            // escape
            if ( code.indexOf('#') === 0 ) {
                code = '=#' + code.substr(1);
            } else {
                code = '=' + code;
            }
            break
    }
    
    return code;

}


function getVariable( code ) {
    
    return code;
}


// 处理HTML
// 在这里进行一些对HTML的编译操作
// 代码压缩
function html( code ) {
        
    const compress = defaults.compress;
    // 压缩
    if ( compress ) {
        console.log( "pass" )
    }

    code = '$out += "' + code + '"; '

    return code;
}

// 处理逻辑
function logic( code ) {
    
    code = parser( code );

    if ( code.indexOf('=') === 0 ) {

        const isEscape = defaults.escape && /^(=#)/.test( code )
        code = code.replace(/^=[#]?|[\s;]*$/g, '');

        if ( isEscape ) {
            code = '$out += $escape( ' + code + ' );'; 
        } else {
            code = '$out += $string( ' + code + ' );';
        }
    } 

    // 变量处理
    each( getVariable( code ), function ( name ) {
        let value; 
        if ( utils[ name ] ) {
            value = '$utils.' + name;
        } else if ( helpers[ name ] ) {
            value = '$helpers.' + name;
        } else {
            value = '$data.' + name;
        }

        headerCode += name + '=' + value + ',';
    })

    return code;
}


template( tpl, data );




