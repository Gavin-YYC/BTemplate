const tpl = require('./tpl');
const data = require('./data');


// 配置
const defaults = {
    openTag: "{{",
    closeTag: "}}",
    compress: false
};


const template = function ( tpl, data ) {
   return compile( tpl ); 
};

let mainCode = "";

// 编译
const compile = template.compile = function ( tpl ) {
    const openTag = defaults.openTag;
    const closeTag = defaults.closeTag;

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
};


function parser ( code ) {

    code = code.replace( /^\s+/, '' );
    const split = code.split(' ');
    const key = split.shift();
    const args = split.join(' ');

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
            code = '})';
            break;

        // 除上述情况外，其他为变量输出
        // 对变量输出，需要先处理过滤器
        // 另外，变量输出需要进行
        default:
            // helper
            
            // escape
            
            // 最后才是输出

            code = '=' + code;
            break
    }

    return code;

}


// 解析HTML
// 在这里进行一些对HTML的编译操作
// 代码压缩
function html( code ) {
        
    const compress = defaults.compress;
    // 压缩
    if ( compress ) {
        console.log( "pass" )
    }
   
    return code;
}

// 解析逻辑部分
function logic( code ) {
    
    code = parser( code );

    if ( code.indexOf('=') === 0 ) {
        
    }
}


template( tpl, data );




