module.exports = [
    "<p>{{title}}</p>",
    "{{ if isAdmin}}",
        "<ul>",
            "{{each list as item index}}",
                "<li>索引：{{item}} - {{index}}</li>",
            "{{/each}}",
        "</ul>",
    "{{else if !isAdmin}}",
        "<p>没有管理员权限</p>",
    "{{else}}",
        "<p>非法操作</p>",
    "{{/if}}"
].join('');
