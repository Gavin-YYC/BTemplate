const tpl = require('./tpl');
const data = require('./data');


// 配置
const defaults = {
    openTag: "{{",
    closeTag: "}}"
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


// 解析HTML
// 在这里进行一些对HTML的编译操作
// 代码压缩
function html( code ) {
        
    // 压缩
    if ( compress ) {
        console.log( "pass" )
    }
   
    return code;
}

// 解析逻辑部分
function logic( code ) {

    code = code.replace( /^\s+/, '' );

    if ( code === 'if' ) {
        
    } else if ( code === '' ) {
        
    }

    return code;
}

template( tpl, data );




